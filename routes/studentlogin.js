const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');  // Import Student model

const router = express.Router();

// Student login route
router.post('/', async (req, res) => {
  const { phone, password } = req.body;

  try {
    // Find student by phone number
    const student = await Student.findOne({ phone });

    if (!student) {
      return res.status(400).json({ message: 'Student not found' });
    }

    // Compare password with the hashed password in database
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: student._id, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ Send student details along with token
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        phone: student.phone,
        carNumber: student.carNumber || "Not available" // fallback in case field is missing
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
