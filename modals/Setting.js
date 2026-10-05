import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title: {
        type: String,
    },
    first_member: {
        type: Number,
        default: 0,
    },
    second_member: {
        type: Number,
        default: 0,
    },
    third_member: {
        type: Number,
        default: 0,
    },
    fourth_member: {
        type: Number,
        default: 0,
    },
    fifth_member: {
        type: Number,
        default: 0,
    },
    gift_amount: {
        type: Number,
        required: false,
        default: 0,
    },
    payment_waiting_time: {
        type: Number,
        required: false,
        default: 0,
    },
    matching_range_min: {
        type: Number,
        required: true,
    },
    matching_range_max: {
        type: Number,
        required: true,
    },
    is_withdrawal_allow: {
        type: Boolean,
        default: true
    },
    is_topup_allow: {
        type: Boolean,
        default: true
    },
    is_order_grabing_allow: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

mongoose.models = {};

export const Setting = mongoose.model("Setting", schema);