import mongoose from "mongoose";

const schema = new mongoose.Schema({
    mobile_number: {
        type: String,
    },
    live_chat: {
        type: String,
    },
    we_chat: {
        type: String,
    },
    link: {
        type: String,
    },
    work_time: {
        type: String,
    },
}, { timestamps: true });

mongoose.models = {};

export const Support = mongoose.model("Support", schema);