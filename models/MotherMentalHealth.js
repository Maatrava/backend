import mongoose from "mongoose";

const motherMentalHealthSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sleepHours: { type: Number, required: true },
    moodScore: { type: Number, required: true, min: 1, max: 10 },
    dateRecorded: { type: Date, default: Date.now }
}, { timestamps: true });

const MotherMentalHealth = mongoose.model("MotherMentalHealth", motherMentalHealthSchema);
export default MotherMentalHealth;
