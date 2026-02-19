import mongoose from "mongoose";

const motherFormSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  
  
  personalName: { type: String, default: "" },
  husbandName: { type: String, default: "" },
  motherContact: { type: String, default: "" },
  husbandContact: { type: String, default: "" },
  age: { type: String, default: "" },
  dob: { type: String, default: "" },
  bloodGroup: { type: String, default: "" },
  height: { type: String, default: "" },
  weight: { type: String, default: "" },
  medicineAllergy: { type: String, default: "" },
  foodAllergy: { type: String, default: "" },
  emergencyContact1: { type: String, default: "" },
  emergencyContact2: { type: String, default: "" },


  deliveryDate: { type: String, default: "" },
  deliveryTime: { type: String, default: "" },
  deliveryPlace: { type: String, default: "" },
  deliveryMode: { type: String, default: "" },
  deliveryDuration: { type: String, default: "" },
  deliveryComplications: { type: String, default: "" },

 
  bp: { type: String, default: "" },
  hemoglobin: { type: String, default: "" },
  bloodSugar: { type: String, default: "" },
  temperature: { type: String, default: "" },
  pulse: { type: String, default: "" },
  bleeding: { type: String, default: "" },
  painLevel: { type: String, default: "" },


  mood: { type: String, default: "" },
  postpartumDepressionSigns: { type: String, default: "" },
  emotionalSupport: { type: String, default: "" },


  breastfeedingStarted: { type: String, default: "" },
  breastfeedingIssues: { type: String, default: "" },
  appetite: { type: String, default: "" },
  sleep: { type: String, default: "" },
  bowelUrinary: { type: String, default: "" },

  
  preExistingConditions: { type: String, default: "" },
  pregnancyComplications: { type: String, default: "" },
  medications: { type: String, default: "" },
  allergies: { type: String, default: "" },


  doctorNotes: { type: String, default: "" },
  careInstructions: { type: String, default: "" },
  nextFollowUp: { type: String, default: "" },
  dischargeDate: { type: String, default: "" },
}, { timestamps: true });

const MotherForm = mongoose.model("MotherForm", motherFormSchema);
export default MotherForm;