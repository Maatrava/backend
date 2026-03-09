import mongoose from "mongoose";

const motherRecoveryMetricsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weekOfPostpartum: { type: String, required: true },
  bpSystolic: { type: Number, required: true },
  hemoglobin: { type: Number, required: true },
  weight: { type: Number, required: true },
  dateRecorded: { type: Date, default: Date.now }
}, { timestamps: true });

const MotherRecoveryMetrics = mongoose.model("MotherRecoveryMetrics", motherRecoveryMetricsSchema);
export default MotherRecoveryMetrics;
