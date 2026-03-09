import mongoose from "mongoose";

const feedingLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    feedingType: { type: String, enum: ["Breastfeeding", "Formula", "Both"], required: true },
    amount: { type: Number }, // in ml or oz
    duration: { type: Number }, // in minutes
    side: { type: String, enum: ["Left", "Right", "Both"] },
    notes: { type: String },
    logDate: { type: Date, default: Date.now }
}, { timestamps: true });

const FeedingLog = mongoose.model("FeedingLog", feedingLogSchema);
export default FeedingLog;
