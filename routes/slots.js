const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');

// GET /slots - fetch all slot details
router.get('/occupied', async (req, res) => {
  try {
    const slots = await Slot.find({});
    res.json(slots); // send all slot details as JSON
  } catch (err) {
    res.status(500).json({ error: 'Error fetching slots', details: err.message });
  }
});

module.exports = router;
