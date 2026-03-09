import mongoose from "mongoose";

const motherHealthRecordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bp: { type: String },
    weight: { type: Number },
    temperature: { type: Number },
    pulse: { type: Number },
    mood: { type: String },
    painLevel: { type: Number },
    notes: { type: String },
    checkInDate: { type: Date, default: Date.now }
}, { timestamps: true });

const MotherHealthRecord = mongoose.model("MotherHealthRecord", motherHealthRecordSchema);
export default MotherHealthRecord;
