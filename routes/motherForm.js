import express from "express";
import auth from "../middleware/auth.js";
import {
  saveMotherForm,
  getMotherForm,
  updateSection,
  getReminders,
} from "../controllers/motherFormController.js";

const router = express.Router();

// all routes are protected with auth middleware
router.post("/save", auth, saveMotherForm);
router.get("/get", auth, getMotherForm);
router.put("/section/:section", auth, updateSection);
router.get("/reminders", auth, getReminders);
router.put("/update", auth, async (req, res) => {
  try {
    const updatedForm = await MotherForm.findOneAndUpdate(
      { user: req.user },   // sees login user's form
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      data: updatedForm
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;