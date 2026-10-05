"use server";

import { Setting } from "@/modals/Setting";
import { connectToDB } from "@/lib/connection";

export const fetchSetting = async () => {
    try {
        await connectToDB();

        const platformSetting = await Setting.findOne().lean();
        return platformSetting;
        
    } catch (error) {

    }
}