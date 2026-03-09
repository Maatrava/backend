import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    appointmentDate: { type: String, default: "" },
    appointmentTime: { type: String, default: "" },
    doctorName: { type: String, default: "" },
    hospital: { type: String, default: "" },
    reason: { type: String, default: "" },
    contact: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;

