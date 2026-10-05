import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    journey: []
}, { timestamps: true });

mongoose.models = {};


export const Journey = mongoose.models.Journey || mongoose.model("Journey", historySchema);