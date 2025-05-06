const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

// Import Routes
const studentLogin = require('./routes/studentlogin');
const facultyLogin = require('./routes/userlogin');
const adminLogin = require('./routes/adminlogin');
const register = require('./routes/register');
const studentRegister = require('./routes/studentregister');
const bookingRoutes = require('./routes/booking');
const slotsRoutes = require('./routes/slot');
const fetchingslotRoutes = require('./routes/slots');
const getBookedSlots = require("./routes/getBookedSlots");
// Create an Express application
const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",  // Your local Vite frontend
    /https:\/\/.*\.ngrok\.io$/, // Regex for ALL ngrok URLs
  ], // Frontend URL, adjust this based on your environment
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies to be sent from the frontend
};

app.use(cors(corsOptions));  // Enable CORS for your frontend
app.use(express.json());  // Middleware to parse JSON requests

// Set up API routes
app.use('/api/studentlogin', studentLogin);
app.use('/api/facultylogin', facultyLogin);
app.use('/api/adminlogin', adminLogin);
app.use('/api/register', register);
app.use('/api/studentregister', studentRegister);
app.use('/api/booking', bookingRoutes);
app.use('/api', slotsRoutes);
app.use('/api/slots', fetchingslotRoutes);
app.use("/api/getBookedSlots", getBookedSlots);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


app.get("/",(req,res)=>{
  return res.send("Welcome to the booking system");
})  
// Start the server
const PORT =5000 || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
