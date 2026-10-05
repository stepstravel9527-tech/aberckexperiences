import mongoose from "mongoose";
// import mongoose from "mongoose";

const schema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    product_name: {
        type: String,
        required: true,
    },
    product_price: {
        type: Number,
        required: true,
    },
    order_quantity: {
        type: Number,
        required: true,
    },
    order_commission: {
        type: Number,
        required: true,
    },
    order_amount: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

mongoose.models = {};

export const Order = mongoose.model("Order", schema);