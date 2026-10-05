import mongoose from "mongoose";

const schema = new mongoose.Schema({
    notice_name: {
        type: String,
        required: true,
    },
    notice: {
        type: String,
        required: true,
    }
}, { timestamps: true });

mongoose.models = {};

export const Notice = mongoose.model("Notice", schema);