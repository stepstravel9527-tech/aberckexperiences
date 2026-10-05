"use server";

import { Notice } from "@/modals/Notice";
import { Pop } from "@/modals/Pop";
import { Setting } from "@/modals/Setting";
import { connectToDB } from "@/lib/connection";

export const fetchNotice = async () => {
    try {
        await connectToDB();

        const notice = await Notice.findOne().lean();

        return notice;
    } catch (error) {
        console.log(error)
    }
}

export const fetchSetting = async () => {
    try {
        await connectToDB();

        const setting = await Setting.findOne().lean();

        return setting;
    } catch (error) {
        console.log(error)
    }
}

export const fetchPop = async () => {
    try {
        await connectToDB();

        const pop = await Pop.findOne().lean();

        return pop;
    } catch (error) {
        console.log(error)
    }
}

