import MotherForm from "../models/MotherForm.js";
import MotherRecoveryMetrics from "../models/MotherRecoveryMetrics.js";
import MotherMentalHealth from "../models/MotherMentalHealth.js";

export const saveMotherForm = async (req, res) => {
  try {
    const formData = req.body;
    const userId = req.user;

    const motherForm = await MotherForm.findOneAndUpdate(
      { userId },
      { ...formData, userId },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Mother form saved successfully",
      data: motherForm,
    });
  } catch (error) {
    console.error("Error saving mother form:", error);
    res.status(500).json({
      success: false,
      message: "Error saving mother form",
      error: error.message,
    });
  }
};

export const getMotherForm = async (req, res) => {
  try {
    const userId = req.user;
    const motherForm = await MotherForm.findOne({ userId });

    res.status(200).json({
      success: true,
      data: motherForm || {},
    });
  } catch (error) {
    console.error("Error fetching mother form:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching mother form",
      error: error.message,
    });
  }
};

export const updateSection = async (req, res) => {
  try {
    const { section } = req.params;
    const sectionData = req.body;
    const userId = req.user;

    const motherForm = await MotherForm.findOneAndUpdate(
      { userId },
      { ...sectionData, userId },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: `${section} section updated successfully`,
      data: motherForm,
    });
  } catch (error) {
    console.error("Error updating section:", error);
    res.status(500).json({
      success: false,
      message: "Error updating section",
      error: error.message,
    });
  }
};

// get reminders 
export const getReminders = async (req, res) => {
  try {
    const userId = req.user;

    const motherForm = await MotherForm.findOne({ userId });

    // generate reminders based on form data
    const reminders = [];

    if (motherForm) {
      // check for upcoming follow-up
      if (motherForm.nextFollowUp) {
        reminders.push({
          id: 1,
          title: "Upcoming Follow-up",
          date: motherForm.nextFollowUp,
          description: "Your next follow-up appointment",
          type: "appointment"
        });
      }

      // can add more
    }

    // default reminders if none exist
    if (reminders.length === 0) {
      reminders.push({
        id: 2,
        title: "Complete Your Health Form",
        date: new Date().toISOString().split('T')[0],
        description: "Fill in your health details to get personalized reminders",
        type: "task"
      });
    }

    res.status(200).json({
      success: true,
      data: reminders
    });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reminders",
      error: error.message
    });
  }
};

// POST /recovery
export const addRecoveryMetric = async (req, res) => {
  try {
    const userId = req.user;
    const { weekOfPostpartum, bpSystolic, hemoglobin, weight } = req.body;

    const newMetric = new MotherRecoveryMetrics({
      userId,
      weekOfPostpartum,
      bpSystolic,
      hemoglobin,
      weight
    });

    await newMetric.save();

    res.status(201).json({ success: true, data: newMetric });
  } catch (error) {
    console.error("Error adding recovery metric:", error);
    res.status(500).json({ success: false, message: "Error adding recovery metric", error: error.message });
  }
};

// GET /recovery
export const getRecoveryMetrics = async (req, res) => {
  try {
    const userId = req.user;
    const metrics = await MotherRecoveryMetrics.find({ userId }).sort({ dateRecorded: 1 });

    res.status(200).json({ success: true, data: metrics });
  } catch (error) {
    console.error("Error fetching recovery metrics:", error);
    res.status(500).json({ success: false, message: "Error fetching recovery metrics", error: error.message });
  }
};

// POST /mental-health
export const addMentalHealthMetric = async (req, res) => {
  try {
    const userId = req.user;
    const { sleepHours, moodScore, dateRecorded } = req.body;

    const newMetric = new MotherMentalHealth({
      userId,
      sleepHours,
      moodScore,
      dateRecorded: dateRecorded || new Date()
    });

    await newMetric.save();

    res.status(201).json({ success: true, data: newMetric });
  } catch (error) {
    console.error("Error adding mental health metric:", error);
    res.status(500).json({ success: false, message: "Error adding mental health metric", error: error.message });
  }
};

// GET /mental-health
export const getMentalHealthMetrics = async (req, res) => {
  try {
    const userId = req.user;
    const metrics = await MotherMentalHealth.find({ userId }).sort({ dateRecorded: 1 });

    res.status(200).json({ success: true, data: metrics });
  } catch (error) {
    console.error("Error fetching mental health metrics:", error);
    res.status(500).json({ success: false, message: "Error fetching mental health metrics", error: error.message });
  }
};