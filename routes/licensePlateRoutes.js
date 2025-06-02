const express = require('express');
const router = express.Router();
const {testDB, parksenseDB } = require('../models/dbConnections');
const LicensePlate = parksenseDB.model('LicensePlate', require('../models/LicensePlate').schema, 'license_plates');
const Slot = testDB.model('Slot', require('../models/Slot').schema, 'slots');

// Helper to normalize plate strings
const normalizePlate = (plate) => plate.replace(/\s+/g, ' ').trim().toUpperCase();

// GET all parking data
router.get('/parking-data', async (req, res) => {
  try {
    const [occupiedSlots, unauthorizedPlates] = await Promise.all([
      Slot.find({ isBooked: true }),
      LicensePlate.find({ unauthorized: true })
    ]);
    console.log(occupiedSlots);

    res.json({
      success: true,
      occupiedSlots,
      unauthorizedPlates
    });
  } catch (error) {
    console.error('Error fetching parking data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch parking data',
      error: error.message
    });
  }
});

// DELETE unauthorized plate
router.delete('/unauthorized/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await LicensePlate.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: 'License plate not found' 
      });
    }

    res.json({
      success: true,
      message: 'Unauthorized plate deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting license plate:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete license plate',
      error: error.message 
    });
  }
});

// Update plate status (authorize or delete)
router.patch('/plates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { action, slotNumber } = req.body;

    if (!['authorize', 'delete'].includes(action)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid action' 
      });
    }

    if (action === 'delete') {
      await LicensePlate.findByIdAndDelete(id);
      return res.json({
        success: true,
        message: 'Plate deleted successfully'
      });
    }

    // Authorize action
    const plate = await LicensePlate.findByIdAndUpdate(
      id,
      { unauthorized: false },
      { new: true }
    );

    if (!plate) {
      return res.status(404).json({
        success: false,
        message: 'License plate not found'
      });
    }

    // Check if slot already exists for this plate
    const existingSlot = await Slot.findOne({ carNumber: plate.plate });
    
    if (!existingSlot) {
      // Create new slot only if it doesn't exist
      const newSlot = await Slot.create({
        carNumber: plate.plate,
        slotNumber: slotNumber || 'UNKNOWN',
        isBooked: true,
        status: 'occupied',
        bookedAt: new Date(),
        licensePlateRef: plate._id  // Reference to the LicensePlate document
      });

      // Update the license plate with slot reference
      plate.slotId = newSlot._id;
      await plate.save();
    }

    res.json({
      success: true,
      message: existingSlot ? 'Vehicle already has a parking slot' : 'Vehicle authorized and added to parking'
    });

  } catch (error) {
    console.error('Error updating plate status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update plate status',
      error: error.message 
    });
  }
});

module.exports = router;