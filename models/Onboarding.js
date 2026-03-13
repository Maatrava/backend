import mongoose from "mongoose";

const onboardingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  feedingType: { type: String, required: true },
  babyAgeWeeks: { type: Number, required: true },
  deliveryType: { type: String, required: true },
  helpFocus: { type: [String], required: true },
}, { timestamps: true });

const Onboarding = mongoose.model("Onboarding", onboardingSchema);
export default Onboarding;
