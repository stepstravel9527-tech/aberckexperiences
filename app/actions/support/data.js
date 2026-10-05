"use server";

import { Support } from "@/modals/Support";
import { connectToDB } from "@/lib/connection";

export const fetchSupport = async () => {
    try {
        await connectToDB();

        const support = await Support.findOne().lean();
        return support;
        
    } catch (error) {

    }
}