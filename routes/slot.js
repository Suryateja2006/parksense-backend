const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');

// Auto-book endpoint for faculty
router.post('/auto-book-faculty', async (req, res) => {
  const { phoneNumber, carNumber } = req.body;

  try {
    // ✅ 1. Check if user already has a slot booked
    const existingSlot = await Slot.findOne({ phoneNumber, userType: 'faculty' });

    if (existingSlot) {
      return res.json({ success: true, slot: existingSlot });
    }

    // ✅ 2. Proceed with normal booking if not already booked
    const bookedSlots = await Slot.find({ userType: 'faculty' });
    const bookedSlotNumbers = bookedSlots.map(slot => slot.slotNumber);

    const rows = ['A', 'B', 'C', 'D'];
    let availableSlot = null;

    for (const row of rows) {
      for (let i = 1; i <= 6; i++) {
        const slotId = `${row}${i}`;
        if (!bookedSlotNumbers.includes(slotId)) {
          availableSlot = slotId;
          break;
        }
      }
      if (availableSlot) break;
    }

    if (!availableSlot) {
      return res.status(400).json({ success: false, message: 'No slots available' });
    }

    // Convert current UTC time to IST (Indian Standard Time)
    const utcDate = new Date();
    const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5.5 hours for IST

    // Format IST date to string "YYYY-MM-DD HH:mm:ss"
    const formattedISTTime = istDate.toISOString().slice(0, 19).replace("T", " "); 

    const newSlot = new Slot({
      slotNumber: availableSlot,
      phoneNumber,
      carNumber,
      userType: 'faculty',
      bookedAt: formattedISTTime,  // Save IST formatted time
    });

    const savedSlot = await newSlot.save();

    res.json({ success: true, slot: savedSlot });
  } catch (error) {
    console.error("Auto-booking error:", error);
    res.status(500).json({ success: false, message: 'Auto-booking failed', error: error.message });
  }
});

router.post('/auto-book-student', async (req, res) => {
  const { phoneNumber, carNumber } = req.body;

  try {
    // ✅ 1. Check if user already has a slot booked
    const existingSlot = await Slot.findOne({ phoneNumber, userType: 'student' });

    if (existingSlot) {
      console.log("Existing slot found:", existingSlot);
      return res.json({ success: true, slot: existingSlot });
    }

    // ✅ 2. Proceed with normal booking if not already booked
    const bookedSlots = await Slot.find({ userType: 'student' });
    const bookedSlotNumbers = bookedSlots.map(slot => slot.slotNumber);
    console.log("Booked slots:", bookedSlotNumbers);  // Log booked slot numbers

    const rows = ['E', 'F', 'G', 'H'];
    let availableSlot = null;

    for (const row of rows) {
      for (let i = 1; i <= 6; i++) {
        const slotId = `${row}${i}`;
        if (!bookedSlotNumbers.includes(slotId)) {
          availableSlot = slotId;
          break;
        }
      }
      if (availableSlot) break;
    }

    if (!availableSlot) {
      console.log("No available slot found.");
      return res.status(400).json({ success: false, message: 'No slots available' });
    }

    console.log("Available slot found:", availableSlot);

    // Convert current UTC time to IST (Indian Standard Time)
    const utcDate = new Date();
    const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5.5 hours for IST

    // Format IST date to string "YYYY-MM-DD HH:mm:ss"
    const formattedISTTime = istDate.toISOString().slice(0, 19).replace("T", " "); 

    const newSlot = new Slot({
      slotNumber: availableSlot,
      phoneNumber,
      carNumber,
      userType: 'student',
      bookedAt: formattedISTTime,  // Save IST formatted time
    });

    const savedSlot = await newSlot.save();

    console.log("New slot booked:", savedSlot);
    res.json({ success: true, slot: savedSlot });
  } catch (error) {
    console.error("Auto-booking error:", error);
    res.status(500).json({ success: false, message: 'Auto-booking failed', error: error.message });
  }
});

// Release slot endpoint with userType consideration
router.post('/release-slot', async (req, res) => {
  const { slotNumber} = req.body;

  try {
    // Ensure userType matches the slot's userType (i.e., faculty or student)
    const slot = await Slot.findOne({ slotNumber });

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }


    // Proceed with deletion of the slot if userType matches
    await Slot.deleteOne({ slotNumber });

    res.json({ success: true, message: 'Slot released successfully' });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to release slot',
      error: error.message 
    });
  }
});

// Get all slots
router.get('/slots', async (req, res) => {
  try {
    const slots = await Slot.find();
    res.json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch slots',
      error: error.message 
    });
  }
});

module.exports = router;
