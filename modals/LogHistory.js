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
    ip_address: {
        type: String,
    },
    country_name: {
        type: String,
    },
    region_name: {
        type: String,
    },
    city_name: {
        type: String,
    },
    device_type: {
        type: String,
    },
    os: {
        type: String,
    },
    browser: {
        type: String,
    },
    domain: {
        type: String,
    }
}, { timestamps: true });

mongoose.models = {};

export const LoginHistory = mongoose.model("LoginHistory", schema);