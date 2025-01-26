const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('dist'))

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected...');
}).catch(err => {
  console.log('MongoDB connection error: ', err);
});

// Define Inquiry Schema and Model
const inquirySchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
}, { timestamps: true });

const Inquiry = mongoose.model('Inquiry', inquirySchema);

// POST endpoint for inquiries
app.post('/api/inquiries', async (req, res) => {
    console.log("HIIII")
  try {
    const { name, email, message } = req.body;
    const newInquiry = new Inquiry({ name, email, message });
    await newInquiry.save();
    res.status(200).json({ success: true, message: 'Inquiry sent successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send inquiry.' });
  }
});

app.get("/", (req, res) => res.sendFile(__dirname + '/dist/index.html'))

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
