const express = require("express");
const router = express.Router();
const Slot = require("../models/Slot");

// GET /api/getBookedSlots
router.get("/", async (req, res) => {
  try {
    const totalSlots = 24;

    // Count documents where booked is true
    const bookedSlotsCount = await Slot.countDocuments({ booked: true });

    res.status(200).json({
      totalSlots,
      bookedSlots: bookedSlotsCount,
      availableSlots: totalSlots - bookedSlotsCount,
    });
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
