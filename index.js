const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const studentLogin = require('./routes/studentlogin');
const facultyLogin = require('./routes/facultylogin');
const adminLogin = require('./routes/adminlogin');
const register = require('./routes/register');
const studentRegister = require('./routes/studentregister');
const bookingRoutes = require('./routes/booking');
const slotsRoutes = require('./routes/slot');
const fetchingslotRoutes = require('./routes/slots');
const getBookedSlots = require("./routes/getBookedSlots");

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",  
    /https:\/\/.*\.ngrok\.io$/, 
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/studentlogin', studentLogin);
app.use('/api/facultylogin', facultyLogin);
app.use('/api/adminlogin', adminLogin);
app.use('/api/register', register);
app.use('/api/studentregister', studentRegister);
app.use('/api/booking', bookingRoutes);
app.use('/api', slotsRoutes);
app.use('/api/slots', fetchingslotRoutes);
app.use("/api/getBookedSlots", getBookedSlots);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


app.get("/",(req,res)=>{
  return res.send("Welcome to the booking system");
})  

const PORT =process.env.PORT|| 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
