import express from "express";
import auth from "../middleware/auth.js";
import {
  listAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/", auth, listAppointments);
router.post("/", auth, createAppointment);
router.put("/:id", auth, updateAppointment);
router.delete("/:id", auth, deleteAppointment);

export default router;

