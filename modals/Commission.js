import mongoose from "mongoose";

const commisssionSchema = new mongoose.Schema({
    membership_level: {
        type: String,
        required: true,
        unique: true,
    },
    membership_name: {
        type: String,
        required: true,
    },
    order_quantity: {
        type: Number,
        required: true,
    },
    commission_rate: {
        type: Number,
        required: true,
    },
    ticket_commission: {
        type: Number,
        required: true,
    },
    number_of_withdrawal: {
        type: Number,
        required: true,
    },
    min_withdrawal_amount: {
        type: Number,
        required: true,
    },
    max_withdrawal_amount: {
        type: Number,
        required: true,
    },
    account_balance_limit: {
        type: Number,
        required: true,
    },
    withdrawal_needed_order: {
        type: Number,
        required: true,
    },
    is_default: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const Commission = mongoose.models.Commission || mongoose.model("Commission", commisssionSchema);