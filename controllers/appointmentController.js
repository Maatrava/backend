import Appointment from "../models/Appointment.js";

export const listAppointments = async (req, res) => {
  try {
    const userId = req.user;
    const appointments = await Appointment.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error listing appointments:", error);
    res.status(500).json({
      success: false,
      message: "Error listing appointments",
      error: error.message,
    });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const userId = req.user;
    const payload = req.body || {};
    const appointment = new Appointment({ ...payload, userId });
    await appointment.save();
    res.status(201).json({
      success: true,
      message: "Appointment booked",
      data: appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Error creating appointment",
      error: error.message,
    });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;
    const payload = req.body || {};

    const updated = await Appointment.findOneAndUpdate(
      { _id: id, userId },
      { ...payload, userId },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Appointment updated",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Error updating appointment",
      error: error.message,
    });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;

    const deleted = await Appointment.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Appointment cancelled",
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting appointment",
      error: error.message,
    });
  }
};

