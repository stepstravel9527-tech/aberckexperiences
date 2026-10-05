"use server";

import { Product } from "@/modals/Product"
import { auth } from '@/lib/auth';
import { connectToDB } from "@/lib/connection";
import { Commission } from "@/modals/Commission";
import { User } from "@/modals/User";
import { JourneyHistory } from "@/modals/JourneyHistory";
import { Journey } from "@/modals/Journey";
import { AccountChange } from "@/modals/AccountChange";
import generateOrderId from "@/utils/generateOrderId";
import { Order } from "@/modals/Order";
import { Setting } from "@/modals/Setting";

import moment from 'moment-timezone';

export const fetchProduct = async () => {
    try {
        await connectToDB();
        const { user } = await auth();

        if (!user) {
            return {
                message: `Something went wrong!`,
                status: 404,
                type: "danger"
            };
        }

        const authenticatedUser = await User.findOne({ _id: user?._id }).lean();

        if (!authenticatedUser) {
            return {
                message: `Unauthorized, data not found!`,
                status: 404,
                type: "danger"
            };
        }

        if (!authenticatedUser?.allow_rob_order)
            return {
                message: `Can not place your order at this time, Please contact customer care.`,
                status: 404,
                type: "danger"
            };

        const checkPending = await JourneyHistory.findById(authenticatedUser?.journeyHistory).lean();

        const collectAllProducts = checkPending?.JourneyHistory;
        const isPendingProduct = collectAllProducts?.some(product => product.status === "pending");

        if (!isPendingProduct) {
            if (authenticatedUser?.today_order >= authenticatedUser?.daily_available_order)
                return {
                    message: `Destinations completed at current tier level`,
                    status: 502,
                    type: "danger"
                };
        }

        let journeyProduct;
        if (!isPendingProduct) {
            // check journey product
            if (authenticatedUser?.journey !== null) {
                const journey = await Journey.findById(authenticatedUser?.journey).lean();

                const userJourney = journey?.journey;
                const userCurrentStage = authenticatedUser?.today_order + 1;

                const stages = userJourney.map(item => Number(item.stage));

                const isJourney = stages.includes(userCurrentStage);

                if (isJourney) {
                    const journeyProducts = userJourney?.filter(item => Number(item.stage) === userCurrentStage);
                    journeyProduct = journeyProducts[0];
                }
            }
        }

        const membership = await Commission.findOne({ membership_level: authenticatedUser?.membership_level }).lean();
        if (!membership)
            return {
                message: `Membership not found!`,
                status: 404,
                type: "danger"
            };

        var minRange = authenticatedUser?.match_min / 100;
        var maxRange = authenticatedUser?.match_max / 100

        let products;
        let randomIndex;
        let historyProduct;
        let hasPendingProduct;

        let product;
        let commission;
        let totalValue;
        //order carete time
        let createdAt;
        let order_id;

        if (journeyProduct?.isJourneyProduct) {
            // if journey run this 
            const checkPending = await JourneyHistory.findById(authenticatedUser?.journeyHistory).lean();

            const collectAllProducts = checkPending?.JourneyHistory;
            hasPendingProduct = collectAllProducts?.some(productItem => productItem.status === "pending");

            if (hasPendingProduct) {
                const pendingProduct = collectAllProducts.filter(product => product.status === "pending");
                product = pendingProduct[0];
                const order = await Order.findOne({ product_name: product.productName, username: authenticatedUser.username });
                order_id = order.order_id;
                createdAt = product.createdAt;
            } else {
                // calculate commission
                product = journeyProduct;

                commission = product?.productPrice * membership?.ticket_commission;
                // totalValue = product?.productPrice + commission;
                totalValue = product?.productPrice;

                // creating user journey history

                if (authenticatedUser?.balance >= product?.productPrice) {
                    product.status = "pending";
                    product.isNegative = false;
                    product.isHold = true;
                    historyProduct = product;
                } else {
                    product.status = "pending";
                    product.isNegative = true;
                    product.isHold = true;
                    historyProduct = product;
                }
            }

            if (authenticatedUser?.journeyHistory === null) {
                // connect user and journey history for the first submission
                const history = await JourneyHistory.create({
                    JourneyHistory: historyProduct
                })

                await User.findByIdAndUpdate(authenticatedUser?._id, {
                    journeyHistory: history?._id,
                });
            } else {

                // updating new submission history
                product = journeyProduct;
                const journeyHistory = await JourneyHistory.findById(authenticatedUser?.journeyHistory).lean();

                const collectAllHistory = journeyHistory?.JourneyHistory;
                const withoutPendingList = collectAllHistory?.filter(product => product.status !== "pending");

                const createdAt = new Date();

                const newObj = {
                    ...product,
                    status: "pending",
                    createdAt: createdAt
                }
                const updateArray = [...withoutPendingList, newObj]

                await JourneyHistory.findByIdAndUpdate(authenticatedUser?.journeyHistory, {
                    JourneyHistory: updateArray
                });

                // removing the product from journey
                const journies = await Journey.findById(authenticatedUser?.journey).lean();
                const collectAllJourney = journies?.journey;
                const removedTheUsedJourney = collectAllJourney?.filter(journey => journey._id.toString() !== product._id.toString())

                // 可以直接使用 removedTheUsedJourney，不需要额外展开
                await Journey.findByIdAndUpdate(authenticatedUser?.journey, {
                    journey: removedTheUsedJourney  // 直接使用过滤后的数组
                });
            }

        } else {
            // if not journey run this 
            // check for pending product

            const checkPending = await JourneyHistory.findById(authenticatedUser?.journeyHistory).lean();

            const collectAllProducts = checkPending?.JourneyHistory;
            hasPendingProduct = collectAllProducts?.some(product => product.status === "pending");

            if (hasPendingProduct) {
                const pendingProduct = collectAllProducts.filter(product => product.status === "pending");
                product = pendingProduct[0];
                const order = await Order.findOne({ product_name: product.productName, username: authenticatedUser.username }).lean();
                order_id = order.order_id;
                createdAt = product.createdAt;
            } else {
                const pipeline = [
                    {
                        $match: {
                            productPrice: {
                                $gte: authenticatedUser?.balance * minRange,
                                $lte: authenticatedUser?.balance * maxRange
                            }
                        }
                    }
                    // { $sample: { size: 1 } } // ✅ 如果你想随机取 1 个商品
                ];

                products = JSON.parse(JSON.stringify(await Product.aggregate(pipeline)));

                let relocatePorducts = products;

                // remove the dublication
                if (checkPending !== null) {
                    const allHistoryProducts = checkPending?.JourneyHistory || [];

                    const allHistoryProductIds = allHistoryProducts.map(product => product._id.toString());
                    products = products.filter(product => !allHistoryProductIds.includes(product._id.toString()));

                    if (products?.length === 0) {
                        const allHistoryProducts = checkPending?.JourneyHistory || [];
                        const returnedIDAlt = allHistoryProducts.map(product => product._id.toString());
                        const returnedID = returnedIDAlt?.slice(-4);
                        products = relocatePorducts.filter(product => !returnedID.includes(product._id.toString()));

                        if (products?.length === 0) {
                            products = relocatePorducts;
                        }
                    }
                } else {
                    products = relocatePorducts;
                }

                if (authenticatedUser?.balance < membership?.account_balance_limit) {
                    return {
                        message: "Insufficient balance!",
                        status: 405,
                        type: "danger"
                    };
                }

                randomIndex = Math.floor(Math.random() * products.length);
                product = products[randomIndex];

                if (products.length === 0) return {
                    message: `Product not found!`,
                    status: 404,
                    type: "danger"
                };

                // creating user journey history
                product.status = "pending"
                historyProduct = product;
            }

            if (authenticatedUser?.journeyHistory === null) {
                // connect user and journey history for the first submission
                const history = await JourneyHistory.create({
                    JourneyHistory: historyProduct
                })

                await User.findByIdAndUpdate(authenticatedUser?._id, {
                    journeyHistory: history?._id,
                });
            } else {

                // updating new submission history
                const journeyHistory = await JourneyHistory.findById(authenticatedUser?.journeyHistory).lean();

                const collectAllHistory = journeyHistory?.JourneyHistory;
                const withoutPendingList = collectAllHistory?.filter(product => product.status !== "pending");

                const createdAt = new Date();

                const newObj = {
                    ...product,
                    status: "pending",
                    createdAt: createdAt
                }

                const updateArray = [...withoutPendingList, newObj]

                await JourneyHistory.findByIdAndUpdate(authenticatedUser?.journeyHistory, {
                    JourneyHistory: updateArray
                });
            }

            // calculate commission & totalValue
            const rate = product?.isJourneyProduct
                ? membership?.ticket_commission
                : membership?.commission_rate;

            commission = product?.productPrice * rate;
            totalValue = product?.productPrice;
        }

        // updating the db
        let calculateBalance;
        let calculateCommission;
        let calculatedCommission

        if (!hasPendingProduct) {
            if (journeyProduct?.isJourneyProduct) {
                let deduction = journeyProduct?.productPrice * membership?.ticket_commission;
                calculateBalance = (authenticatedUser?.balance - product?.productPrice);
                calculateCommission = product?.productPrice * membership?.ticket_commission;
                calculatedCommission = authenticatedUser?.today_commission + calculateCommission;

                let negativeValue;
                let netFrozeAmount;
                let calFrozeAmount;

                if (authenticatedUser?.balance > product?.productPrice) {
                    negativeValue = authenticatedUser?.balance - product?.productPrice;
                    netFrozeAmount = product?.productPrice;
                    calFrozeAmount = authenticatedUser?.froze_amount + Math.abs(netFrozeAmount);
                } else {
                    if (authenticatedUser?.froze_amount === 0) {
                        negativeValue = authenticatedUser?.balance - product?.productPrice;
                        netFrozeAmount = product?.productPrice - Math.abs(negativeValue);
                        calFrozeAmount = authenticatedUser?.froze_amount + Math.abs(netFrozeAmount);
                    } else {
                        negativeValue = authenticatedUser?.balance - product?.productPrice;
                        calFrozeAmount = authenticatedUser?.froze_amount;
                    }
                }

                await User.findByIdAndUpdate(authenticatedUser?._id, {
                    balance: calculateBalance?.toFixed(2),
                    froze_amount: calFrozeAmount?.toFixed(2),
                    today_commission: calculatedCommission?.toFixed(2),
                    ticket_commission: (authenticatedUser?.ticket_commission ?? 0) + deduction,
                    today_order: authenticatedUser?.today_order + 1
                });

                await AccountChange.create({
                    username: authenticatedUser?.username,
                    phone_number: authenticatedUser?.phone_number,
                    amount: product?.productPrice,
                    after_operation: calculateBalance?.toFixed(2),
                    account_type: "transaction",
                });

                const order_amount_val = product?.productPrice * membership?.ticket_commission;
                const calculated_order_amount_val = order_amount_val + product?.productPrice;

                order_id = generateOrderId();
                const order = await Order.create({
                    order_id: order_id,
                    username: authenticatedUser?.username,
                    phone_number: authenticatedUser?.phone_number,
                    product_name: product?.productName,
                    product_price: product?.productPrice,
                    order_amount: calculated_order_amount_val,
                    order_commission: order_amount_val,
                    order_quantity: 1
                });
                createdAt = order.createdAt;

                const setting = await Setting.findOne().lean();
                const uplineCommissionRate = (setting?.first_member) / 100;

                const uplineUserCommission = product?.productPrice * membership?.ticket_commission;
                const uplineFinealCommission = uplineUserCommission * uplineCommissionRate;

                const uplineUserAccount = await User.findOne({ id: authenticatedUser?.parent_id }).lean();

                await AccountChange.create({
                    username: uplineUserAccount?.username,
                    phone_number: uplineUserAccount?.phone_number,
                    amount: uplineUserAccount?.balance,
                    after_operation: uplineUserAccount?.balance + uplineFinealCommission,
                    account_type: "upperUserCommission"
                });

                const finalVal = uplineUserAccount?.balance + uplineFinealCommission;
                await User.findByIdAndUpdate(uplineUserAccount?._id, {
                    balance: finalVal?.toFixed(2),
                });

            } else {
                //normal progress
                calculateBalance = authenticatedUser?.balance - product?.productPrice;
                calculateCommission = product?.productPrice * membership?.commission_rate;
                calculatedCommission = authenticatedUser?.today_commission + calculateCommission;

                await User.findByIdAndUpdate(authenticatedUser?._id, {
                    balance: calculateBalance?.toFixed(2),
                    today_commission: calculatedCommission?.toFixed(2),
                    today_order: authenticatedUser?.today_order + 1
                });

                await AccountChange.create({
                    username: authenticatedUser?.username,
                    phone_number: authenticatedUser?.phone_number,
                    amount: product?.productPrice,
                    after_operation: calculateBalance?.toFixed(2),
                    account_type: "transaction",
                });

                const order_amount_val = product?.productPrice * membership?.commission_rate;
                const calculated_order_amount_val = order_amount_val + product?.productPrice;

                order_id = generateOrderId();
                const order = await Order.create({
                    order_id: order_id,
                    username: authenticatedUser?.username,
                    phone_number: authenticatedUser?.phone_number,
                    product_name: product?.productName,
                    product_price: product?.productPrice,
                    order_amount: calculated_order_amount_val,
                    order_commission: order_amount_val,
                    order_quantity: 1
                });
                createdAt = order.createdAt;

                const setting = await Setting.findOne().lean();
                const uplineCommissionRate = (setting?.first_member) / 100;

                const uplineUserCommission = product?.productPrice * membership?.commission_rate;
                const uplineFinealCommission = uplineUserCommission * uplineCommissionRate;

                const uplineUserAccount = await User.findOne({ id: authenticatedUser?.parent_id }).lean();

                await AccountChange.create({
                    username: uplineUserAccount?.username,
                    phone_number: uplineUserAccount?.phone_number,
                    amount: uplineUserAccount?.balance,
                    after_operation: uplineUserAccount?.balance + uplineFinealCommission,
                    account_type: "upperUserCommission"
                });

                const finalVal = uplineUserAccount?.balance + uplineFinealCommission;
                await User.findByIdAndUpdate(uplineUserAccount?._id, {
                    balance: finalVal?.toFixed(2),
                });
            }
        }

        return {
            message: `Fetched!`,
            status: 201,
            type: "success",
            data: {
                product: product ?? null,
                commission: commission ?? null,
                totalValue: totalValue ?? null,
                createdAt: createdAt
                    ? moment.tz(createdAt, process.env.NEXT_PUBLIC_TIME_ZONE).format('DD MMM YYYY, hh:mm:ss')
                    : null,
                order_id: order_id ?? null,
            }
        };

    } catch (error) {
        console.log(error)
    }
}

