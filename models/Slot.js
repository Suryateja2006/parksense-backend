const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  slotNumber: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  carNumber: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    immutable: true
  },
  bookedAt: {
    type: Date,
    default: Date.now 
  },
});

module.exports = mongoose.model('Slot', SlotSchema);