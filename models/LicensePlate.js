// const mongoose = require('mongoose');

// const licensePlateSchema = new mongoose.Schema({
//   license_plate: String,
//   confidence: Number,
//   slot:String,
//   timestamp: Date,
//   userType: String,
//   status: String  ,
//   unauthorized:Boolean,
//   updatedByAdmin:Boolean,
//   imagePath: String,
// });

// module.exports = mongoose.model('LicensePlate', licensePlateSchema);


// models/LicensePlate.js


// const mongoose = require("mongoose");

// const licensePlateSchema = new mongoose.Schema({
//   plate: { type: String, unique: true },
//   scannedAt: Date,
//   phone: String,
//   slotId: { type: mongoose.Schema.Types.ObjectId, ref: "Slot" },
// });

// module.exports = mongoose.model("LicensePlate", licensePlateSchema);

const mongoose = require("mongoose");

const licensePlateSchema = new mongoose.Schema({
  plate: { type: String, required: true },
  phone: { type: String },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: "Slot" },
  bookedAt: { type: Date },
  exitedAt: { type: Date },
  scannedAt: { type: Date },
  // status: { type: String, enum: ["booked", "exited", "unauthorized"], default: "unauthorized" }
  unauthorized:{type:Boolean}
});

module.exports = mongoose.model("LicensePlate", licensePlateSchema);
