// backend/routes/facultyLogin.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Faculty = require('../models/Faculty'); // Correctly import the Faculty model
const router = express.Router();

// Faculty login route
router.post('/', async (req, res) => {
  const { phone, password } = req.body;

  console.log("Received phone: ", phone); // Log the received phone number

  try {
    // Check if the faculty exists in the database
    const faculty = await Faculty.findOne({ phone });

    if (!faculty) {
      return res.status(400).json({ msg: 'Phone number not found' });
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Incorrect password' });
    }

    // Generate a JWT token with faculty-specific details
    const token = jwt.sign(
      { id: faculty._id, phone: faculty.phone },
      process.env.JWT_SECRET, // Ensure JWT_SECRET is stored securely in your environment variables
      { expiresIn: '1h' }
    );

    // Respond with a successful login and send the user details with the token
    return res.status(200).json({
      msg: 'Login successful',
      user: {
        id: faculty._id,
        phone: faculty.phone,
        carNumber: faculty.carNumber, // Send the carNumber as part of the response
      },
      token,
      role: 'faculty', // Role as 'faculty'
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = router;
