"use server";

import { User } from "@/modals/User";
import { connectToDB } from "@/lib/connection";
import cloudinary from "cloudinary";
import { auth } from '@/lib/auth';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadProfile = async (formData) => {
    let {
        public_id,
        url
    } = Object.fromEntries(formData);

    try {
        await connectToDB();
        const { user } = await auth();

        const isUser = await User.findOne({ username: user?.username }).lean();

        if (!isUser) return {
            message: "User not found",
            status: 201,
            type: "success"
        };

        if (isUser && isUser?.public_id && isUser?.public_id !== null) {
            await cloudinary.v2.uploader.destroy(isUser?.public_id);
        }

        await User.findByIdAndUpdate(user?._id, {
            public_id,
            url
        });

        return {
            message: "Profile picture uploaded successfully",
            status: 201,
            type: "success"
        };
    } catch (error) {
        console.log(error)
    }
}