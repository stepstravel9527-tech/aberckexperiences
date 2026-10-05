"use server";

import { auth } from '@/lib/auth';
import { Commission } from "@/modals/Commission";
import { User } from "@/modals/User";
import { Withdrawal } from "@/modals/Withdrawal";
import { connectToDB } from "@/lib/connection";

export const fetchUser = async (q, page) => {
    const regex = new RegExp(q, "i");
    const ITEM_PER_PAGE = 10;

    try {
        connectToDB();

        // 并行执行两个查询
        const [count, users] = await Promise.all([
            User.find({
                username: { $regex: regex },
                role: { $in: ["user", "practice"] }
            }).countDocuments(),

            User.find({
                username: { $regex: regex },
                role: { $in: ["user", "practice"] }
            })
                .select('-__v -_id -createdAt -updatedAt') // 忽略这些字段
                .limit(ITEM_PER_PAGE)
                .skip(ITEM_PER_PAGE * (page - 1))
                .lean()
        ]);
        return {
            users: JSON.parse(JSON.stringify(users)),
            count
        };
    } catch (error) {
        console.log(error);
        return { users: [], count: 0 };
    }
}

export const fetchAuthenticatedUser = async (sessionUser) => {
    try {
        connectToDB();

        if (!sessionUser) {
            // 用户未登录或 session 无效
            return {
                message: `Authentication failed`,
                status: 401, // 改为 401 更合适
                type: "danger"
            };
        }

        // user 包含的是 JWT token 中的基本信息
        // 需要从数据库获取完整用户信息
        const dbUser = await User.findById(sessionUser._id)
            .select('-password -__v') // 排除敏感和不必要字段
            .lean();

        if (!dbUser) {
            // 数据库中没有对应的用户（可能被删除）
            return {
                message: `User not found`,
                status: 404,
                type: "danger"
            };
        }
        // 返回完整的数据库用户信息
        return {
            message: `Fetch user success`,
            status: 200,
            type: "success",
            data: dbUser
        };
    } catch (error) {
        console.error('Fetch authenticated user error:', error); // 更详细的日志
        return {
            message: `Server error: ${error.message}`,
            status: 500,
            type: "danger"
        };
    }
}

export const fetchMembership = async (authenticatedUser) => {
    try {
        connectToDB();
        const membership = await Commission.findOne({ membership_level: authenticatedUser?.membership_level }).select('-_id -__v').lean();
        return membership;
    } catch (error) {
        console.log(error)
    }
}

export const fetchPendingWithdrawal = async () => {
    try {
        connectToDB();

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
                message: `Something went wrong!`,
                status: 404,
                type: "danger"
            };
        }

        let pendingWithdrawal;
        if (authenticatedUser?.withdrawal !== null) {
            const withdrawal = await Withdrawal.findById(authenticatedUser?.withdrawal).lean();

            pendingWithdrawal = withdrawal?.wallet?.filter(item => item.status === "pending")[0]
        }

        if (!pendingWithdrawal) {
            return {}
        }

        return pendingWithdrawal;

    } catch (error) {
        console.log(error)
    }
}

export const fetchWithdrawal = async (sessionUser) => {
    try {
        await connectToDB();

        const authenticatedUser = await User.findOne({ _id: sessionUser?._id }).lean();

        if (!authenticatedUser) {
            return {
                message: `Something went wrong!`,
                status: 404,
                type: "danger"
            };
        }

        const withdrawal = await Withdrawal.findById(authenticatedUser?.withdrawal).lean();
        const withdrawals = withdrawal?.wallet;

        return withdrawals;

    } catch (error) {
        console.log(error);
    }
}

export const fetchCommission = async () => {
    try {
        await connectToDB();
        const commissions = await Commission.find()
            .select('-_id') //排除_id
            .lean();
        return commissions;
    } catch (error) {
        console.log(error);
    }
}



