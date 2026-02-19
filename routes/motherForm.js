import express from "express";
import auth from "../middleware/auth.js";
import { 
  saveMotherForm, 
  getMotherForm, 
  updateSection,
  getReminders 
} from "../controllers/motherFormController.js";

const router = express.Router();

// all routes are protected with auth middleware
router.post("/save", auth, saveMotherForm);
router.get("/get", auth, getMotherForm);
router.put("/section/:section", auth, updateSection);
router.get("/reminders", auth, getReminders);

export default router;