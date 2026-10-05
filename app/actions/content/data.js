"use server";

import { Content } from "@/modals/Content";
import { connectToDB } from "@/lib/connection";

export const fetchContent = async (title) => {
    try {
        await connectToDB();

        const content = await Content.findOne({ "title": title }).lean();

        return content;
    } catch (error) {
        console.log(error)
    }
}