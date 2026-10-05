import { auth } from '@/lib/auth';
import { JourneyHistory } from "@/modals/JourneyHistory";
import { User } from "@/modals/User";
import { connectToDB } from "@/lib/connection";
import { Recharge } from "@/modals/Recharge";

export const fetchJourneyHistory = async (authenticatedUser) => {
    try {
        await connectToDB();
        const response = await JourneyHistory.findById(authenticatedUser?.journeyHistory).select('-_id -__v -updatedAt').lean();
        const journeyHistory = response?.JourneyHistory?.reverse();
        return journeyHistory;
    } catch (error) {
        console.log(error)
    }
}

export const fetchRechargeHistory = async (sessionUser) => {

    try {
        await connectToDB();

        const authenticatedUser = await User.findOne({ _id: sessionUser?._id }).lean();

        if (!authenticatedUser) {
            return {
                message: `Unauthorized, data not found!`,
                status: 404,
                type: "danger"
            };
        }

        const history = await Recharge.find({
            username: authenticatedUser?.username,
            recharge_type: "credit"
        }).lean();

        return history;

    } catch (error) {
        console.log(error)
    }
}