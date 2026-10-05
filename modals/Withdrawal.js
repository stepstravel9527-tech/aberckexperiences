import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    iid: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    wallet_name: {
        type: String,
        required: true,
    },
    withdrawal_amount: {
        type: Number,
        required: true,
    },
    wallet_address: {
        type: String,
        required: true,
    },
    network_type: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    remark: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        required: false,
    },
    updatedAt: {
        type: Date,
        required: false,
    },
}, { _id: false });

const withdrawalSchema = new mongoose.Schema({
    wallet: [walletSchema],
}, { timestamps: true });

mongoose.models = {};

export const Withdrawal = mongoose.models.Withdrawal || mongoose.model("Withdrawal", withdrawalSchema);
