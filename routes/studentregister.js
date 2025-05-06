const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');  // Import Student model

const router = express.Router();

// Student registration route
router.post('/', async (req, res) => {
  const { phone, carNumber, password } = req.body;

  try {
    // Check if student already exists by phone number
    const existingStudent = await Student.findOne({ phone });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new student
    const student = new Student({
      phone,
      carNumber,
      password: hashedPassword,
    });

    // Save student to database
    await student.save();

    // Generate JWT token
    const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Registration successful', token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
