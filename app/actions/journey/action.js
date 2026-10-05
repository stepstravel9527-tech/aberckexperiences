"use server";

import { auth } from '@/lib/auth';
import { AccountChange } from "@/modals/AccountChange";
import { Commission } from "@/modals/Commission";
import { Journey } from "@/modals/Journey";
import { JourneyHistory } from "@/modals/JourneyHistory";
import { Setting } from "@/modals/Setting";
import { User } from "@/modals/User";
import { connectToDB } from "@/lib/connection";

export const submitJourney = async () => {
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

        if (!authenticatedUser?.allow_rob_order) return {
            message: `Can not place your order at this time, Please contact customer care.`,
            status: 403,
            type: "danger"
        };

        if (authenticatedUser?.balance < 0) return {
            message: `Insufficient balance`,
            status: 502,
            type: "danger"
        };

        // check journey product
        let journeyProduct;
        let journeyStageArray;
        let isJourney;
        if (authenticatedUser?.journey !== null) {
            const journey = await Journey.findById(authenticatedUser?.journey).lean();

            const userJourney = journey?.journey;
            const userCurrentStage = authenticatedUser?.today_order;

            const stages = userJourney.map(item => Number(item.stage));
            journeyStageArray = stages;

            isJourney = stages.includes(userCurrentStage);

            if (isJourney) {
                const journeyProducts = userJourney?.filter(item => Number(item.stage) === userCurrentStage);
                journeyProduct = journeyProducts[0];
            }
        }

        const journeyHistory = await JourneyHistory.findById(authenticatedUser?.journeyHistory).lean();

        const collectAllHistory = journeyHistory?.JourneyHistory;
        const pendingProduct = collectAllHistory?.filter(product => product.status === "pending");
        const withoutPendingList = collectAllHistory?.filter(product => product.status !== "pending");

        let isPendingProductObject = pendingProduct[0];

        if (!isPendingProductObject) {
            if (authenticatedUser?.today_order >= authenticatedUser?.daily_available_order) return {
                message: `Destinations completed at current tier level`,
                status: 502,
                type: "danger"
            };
        }

        if (pendingProduct?.length !== 0 && isPendingProductObject && Object.keys(isPendingProductObject).length > 1) {
            const newObj = {
                ...isPendingProductObject,
                status: "completed"
            }

            const updateArray = [...withoutPendingList, newObj]

            await JourneyHistory.findByIdAndUpdate(authenticatedUser?.journeyHistory, {
                JourneyHistory: updateArray
            });
        } else {

            return {
                message: "ERROR!",
                status: 404,
                type: "danger",
            };
        }

        const commission = await Commission.findOne({ membership_level: authenticatedUser?.membership_level }).lean();
        const commissionRate = commission?.commission_rate;

        const refundAmount = isPendingProductObject?.productPrice;
        const calculateCommission = commissionRate * isPendingProductObject?.productPrice;
        const calculatedRefundAmount = authenticatedUser?.balance + refundAmount;
        // const calculateStage = authenticatedUser?.today_order + 1;
        // const calculateStage = 0;

        const calculateFinalBalance = calculatedRefundAmount + calculateCommission;
        // const calculateFinalCommission = authenticatedUser?.today_commission + calculateCommission;

        // let deductedAmount = Number(collectAllHistory[0].productPrice) * Number(commissionRate) || 0;
        // let calReturnAmount = authenticatedUser?.balance + authenticatedUser?.froze_amount + authenticatedUser?.today_commission;
        // let finalCalAmount = calReturnAmount - deductedAmount;

        let calBalance;
        let calFrozeAmount;
        let ticketCommission;
        var isNextJourney;

        if (isPendingProductObject?.isJourneyProduct) {

            const currentJourneyProduct = isPendingProductObject;

            let isNext;
            let isContinue;

            if (journeyStageArray?.length === 0) {
                isNext = 0;
                isContinue = 0;
            } else {
                isNext = journeyStageArray[0] - currentJourneyProduct.stage;

                if (authenticatedUser?.ticket_point) {
                    isContinue = journeyStageArray[0] - authenticatedUser?.ticket_point;
                } else {
                    isContinue = 0;
                }
            }

            if (isContinue !== 1 || isContinue === 0) {
                if (isNext !== 1) {
                    if (isPendingProductObject?.isNegative) {
                        calBalance = authenticatedUser?.froze_amount + authenticatedUser?.ticket_commission;
                    } else {
                        calBalance = authenticatedUser?.balance + authenticatedUser?.froze_amount + authenticatedUser?.ticket_commission;
                    }

                    calFrozeAmount = 0;
                    ticketCommission = 0;
                    isNextJourney = false;

                    const balanceAfterOp = authenticatedUser?.froze_amount;

                    // for onhold
                    const journeyHistory = await JourneyHistory.findById(authenticatedUser?.journeyHistory).lean();
                    const collectAllHistory = journeyHistory?.JourneyHistory;
                    const withHoldList = collectAllHistory?.filter(product => product.isHold);
                    const withoutHoldList = collectAllHistory?.filter(product => !product.isHold);

                    const updatedWithHoldList = withHoldList.map(product => ({
                        ...product,
                        isHold: false
                    }));

                    const updateArray = [...withoutHoldList, ...updatedWithHoldList];

                    const res = await JourneyHistory.findByIdAndUpdate(authenticatedUser?.journeyHistory, {
                        JourneyHistory: updateArray
                    }, { new: true }).lean();

                    if (res) {
                        await AccountChange.create({
                            username: authenticatedUser?.username,
                            phone_number: authenticatedUser?.phone_number,
                            amount: balanceAfterOp,
                            after_operation: balanceAfterOp,
                            account_type: "frozeAmount"
                        });

                        await AccountChange.create({
                            username: authenticatedUser?.username,
                            phone_number: authenticatedUser?.phone_number,
                            amount: authenticatedUser?.ticket_commission,
                            after_operation: calBalance,
                            account_type: "orderCommission"
                        });
                    }

                } else {
                    calBalance = authenticatedUser?.balance;
                    calFrozeAmount = authenticatedUser?.froze_amount;
                    ticketCommission = authenticatedUser?.ticket_commission;
                    isNextJourney = true;
                }

                await User.findByIdAndUpdate(authenticatedUser?._id, {
                    balance: calBalance?.toFixed(2),
                    // today_order: calculateStage,
                    froze_amount: calFrozeAmount,
                    ticket_commission: ticketCommission,
                });

            } else {

                if (isPendingProductObject?.isNegative) {
                    calBalance = authenticatedUser?.froze_amount + authenticatedUser?.ticket_commission;
                } else {
                    calBalance = authenticatedUser?.balance + authenticatedUser?.froze_amount + authenticatedUser?.ticket_commission;
                }

                const res = await User.findByIdAndUpdate(authenticatedUser?._id, {
                    balance: calBalance?.toFixed(2),
                    ticket_commission: 0,
                    froze_amount: 0,
                });

                if (res) {
                    if (isNext !== 1) {

                    } else {
                        isNextJourney = true;
                    }
                }

                await AccountChange.create({
                    username: authenticatedUser?.username,
                    phone_number: authenticatedUser?.phone_number,
                    amount: authenticatedUser?.ticket_commission?.toFixed(2),
                    after_operation: calBalance?.toFixed(2),
                    account_type: "orderCommission"
                });

            }

        } else {
            await User.findByIdAndUpdate(authenticatedUser?._id, {
                balance: calculateFinalBalance?.toFixed(2),
                // today_order: calculateStage,
                // today_commission: calculateFinalCommission,
            });

            await AccountChange.create({
                username: authenticatedUser?.username,
                phone_number: authenticatedUser?.phone_number,
                amount: calculateCommission,
                after_operation: calculateFinalBalance,
                account_type: "orderCommission"
            });

        }

        return {
            message: "Successful",
            status: 201,
            type: "success",
            isNextJourney
        };
    } catch (error) {
        console.log(error)
    }
}

export const validateStartJourney = async () => {
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

        if (!authenticatedUser?.allow_rob_order) return {
            message: `Can not place your order at this time, Please contact customer care.`,
            status: 403,
            type: "danger"
        };

        // check order grabing allowed
        const setting = await Setting.findOne().lean();
        const isTimeAllow = setting.is_order_grabing_allow;

        if (!isTimeAllow) return {
            message: `Can not place your order at this time, Please contact customer care.`,
            status: 403,
            type: "danger"
        };

        const commission = await Commission.findOne({ membership_level: authenticatedUser?.membership_level }).lean();
        const account_balance_limit = commission?.account_balance_limit;
        const maxStage = commission?.order_quantity;

        const checkPending = await JourneyHistory.findById(authenticatedUser?.journeyHistory).lean();

        const collectAllProducts = checkPending?.JourneyHistory;
        const isPendingProduct = collectAllProducts?.some(product => product.status === "pending");

        if (!isPendingProduct) {
            if (authenticatedUser?.today_order >= maxStage) {
                return {
                    message: "Destinations completed at current tier level",
                    status: 200,
                    type: "danger"
                };
            }
        }

        if (authenticatedUser?.journeyHistory !== null) {
            const allUserHistoryRes = await JourneyHistory.findById(authenticatedUser?.journeyHistory).lean();
            const allUserHistoryArray = allUserHistoryRes?.JourneyHistory;

            const isPendingHistory = allUserHistoryArray?.filter(item => item.status === "pending");
            if (isPendingHistory?.length !== 0) {
                return {
                    message: "Validation completed!",
                    status: 101,
                    type: "success"
                };
            } else {
                if (authenticatedUser?.journey !== null) {
                    //Journey
                    const journey = await Journey.findById(authenticatedUser?.journey).lean();
                    const userJourney = journey?.journey;
                    const userCurrentStage = authenticatedUser?.today_order;
                    const stages = userJourney.map(item => Number(item.stage));

                    let isNext = stages[0] - userCurrentStage;

                    if (userJourney?.length === 0) {
                        isNext = 14456456456;
                    }

                    if (isNext === 1) {

                    } else {
                        if (authenticatedUser?.balance < account_balance_limit) {
                            return {
                                message: "Insufficient balance!",
                                status: 404,
                                type: "danger"
                            };
                        }
                    }
                } else {
                    if (authenticatedUser?.balance < account_balance_limit) {
                        return {
                            message: "Insufficient balance!",
                            status: 404,
                            type: "danger"
                        };
                    }
                }
            }
        } else {
            if (authenticatedUser?.balance < account_balance_limit) {
                return {
                    message: "Insufficient balance!",
                    status: 404,
                    type: "danger"
                };
            }
        }

        const uplineUserAccount = await User.findOne({ id: authenticatedUser?.parent_id }).lean();

        if (!uplineUserAccount) return {
            message: "No parent user, please contact customer support!",
            status: 404,
            type: "danger"
        }

        return {
            message: "Validation completed!",
            status: 201,
            type: "success"
        };
    } catch (error) {
        console.log(error)
    }
}

export const checkPendingJourney = async () => {
    const { user } = await auth();
    const authenticatedUser = await User.findOne({ _id: user?._id }).lean();
    const allUserHistoryRes = await JourneyHistory.findById(authenticatedUser?.journeyHistory).lean();
    const allUserHistoryArray = allUserHistoryRes?.JourneyHistory;

    const isPendingHistory = allUserHistoryArray?.filter(item => item.status === "pending");
    if (isPendingHistory?.length !== 0) {
        return true;
    } else {
        return false;
    }
}