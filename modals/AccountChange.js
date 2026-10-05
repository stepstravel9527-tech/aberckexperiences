import mongoose from "mongoose";

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    after_operation: {
        type: Number,
        required: true,
    },
    account_type: {
        type: String,
        required: true,
    }
}, { timestamps: true });

mongoose.models = {};

export const AccountChange = mongoose.model("AccountChange", schema);