import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,
    },
    phone_number: {
        type: Number,
        required: false,
    },
    wallet_name: {
        type: String,
        required: false,
    },
    withdrawal_amount: {
        type: Number,
        required: false,
    },
    wallet_address: {
        type: String,
        required: false,
    },
    network_type: {
        type: String,
        required: false,
    },
    currency: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
}, { timestamps: true });

export const WithdrawalHistory = mongoose.models.WithdrawalHistory || mongoose.model("WithdrawalHistory", walletSchema);
