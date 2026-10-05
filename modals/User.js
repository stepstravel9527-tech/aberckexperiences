import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    role: {
        type: String,
        required: true
    },
    parent_id: {
        type: Number,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: ""
    },
    balance: {
        type: Number,
        required: true
    },
    daily_available_order: {
        type: Number,
        required: true
    },
    today_order: {
        type: Number,
        required: true
    },
    today_commission: {
        type: Number,
        required: true
    },
    ticket_commission: {
        type: Number,
        default: 0
    },
    ticket_point: {
        type: Number,
        default: 0
    },
    parent_user: {
        type: String,
        required: true
    },
    invitation_code: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    membership_level: {
        type: String,
        required: true
    },
    froze_amount: {
        type: Number,
        default: 0
    },
    wallet_name: {
        type: String,
        default: null
    },
    wallet_address: {
        type: String,
        default: null
    },
    network_type: {
        type: String,
        default: null
    },
    wallet_phone: {
        type: String,
        default: null
    },
    currency: {
        type: String,
        default: null
    },
    withdrawal_pin: {
        type: String,
    },
    withdrawal: {
        type: String,
        default: null
    },
    match_min: {
        type: Number,
        required: true,
    },
    match_max: {
        type: Number,
        required: true,
    },
    last_login: {
        type: Date,
        default: null
    },
    allow_withdrawal: {
        type: Boolean,
        default: true
    },
    allow_rob_order: {
        type: Boolean,
        default: true
    },
    min_withdrawal_amount: {
        type: String,
        default: ""
    },
    max_withdrawal_amount: {
        type: String,
        default: ""
    },
    withdrawal_needed_order: {
        type: String,
        default: ""
    },
    security_code: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    journeyHistory: {
        type: String,
        default: null
    },
    journey: {
        type: String,
        default: null
    },
    credibility: {
        type: Number,
        default: 100
    },
    connected_account: {
        type: String,
        default: null
    },
    connected_agent_id: {
        type: Number,
        default: null
    },
    connected_agent_username: {
        type: String,
        default: null
    },
    public_id: {
        type: String,
        default: null
    },
    url: {
        type: String,
        default: null
    },
    number_of_draws: {
        type: Number,
        default: null
    },
    winning_amount: []
}, { timestamps: true });


export const User = mongoose.models.User || mongoose.model("User", userSchema);