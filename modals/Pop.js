import mongoose from "mongoose";

const schema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    visibility: {
        type: String,
        required: true,
    },
    animationType: {
        type: String,
        required: true,
    },
    animationTimingFunction: {
        type: String,
        required: true,
    },
    animationDuration: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

mongoose.models = {};

export const Pop = mongoose.model("Pop", schema);