import mongoose from "mongoose";

const babyHealthRecordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    weight: { type: Number },
    height: { type: Number },
    headCircumference: { type: Number },
    temperature: { type: Number },
    vaccinations: [{
        name: { type: String },
        date: { type: Date },
        administered: { type: Boolean, default: false }
    }],
    notes: { type: String },
    logDate: { type: Date, default: Date.now }
}, { timestamps: true });

const BabyHealthRecord = mongoose.model("BabyHealthRecord", babyHealthRecordSchema);
export default BabyHealthRecord;
