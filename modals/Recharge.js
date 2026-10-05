import mongoose from "mongoose";

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    recharge_by: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    after_recharge: {
        type: Number,
        required: true,
    },
    recharge_type: {
        type: String,
        required: true,
    },
    remark: {
        type: String,
        required: false,
    }
}, { timestamps: true });

mongoose.models = {};

export const Recharge = mongoose.model("Recharge", schema);