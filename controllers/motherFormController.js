import MotherForm from "../models/MotherForm.js";

// legacy single-record helpers kept for compatibility (not used by new UI)
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