import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    JourneyHistory: []
}, { timestamps: true });

mongoose.models = {};


export const JourneyHistory = mongoose.models.JourneyHistory || mongoose.model("JourneyHistory", historySchema);