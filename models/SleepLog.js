import mongoose from "mongoose";

const sleepLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalDuration: { type: Number }, // in minutes
    quality: { type: String, enum: ["Restless", "Calm", "Good"] },
    notes: { type: String },
    logDate: { type: Date, default: Date.now }
}, { timestamps: true });

const SleepLog = mongoose.model("SleepLog", sleepLogSchema);
export default SleepLog;
