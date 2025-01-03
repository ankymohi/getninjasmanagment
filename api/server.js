require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

let isConnected = false;

// MongoDB Connection
async function connectToDatabase() {
  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log('MongoDB connected');
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
      throw new Error('Database connection failed');
    }
  }
}

// Middleware
app.use(cors({
  origin: "https://getninjasmanagment-emuy.vercel.app",
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,
}));
app.use(helmet());
app.use(bodyParser.json());

// Schema & Model
const contactSchema = new mongoose.Schema({
  date: String,
  project: String,
  category: String,
  coinsUsed: Number,
  status: String,
  revenue: Number,
});

const Contact = mongoose.model('Contact', contactSchema);

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Failed to connect to the database' });
  }
});

// Routes
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json(newContact);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save contact' });
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(updatedContact);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// Start Server
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server running on http://localhost:${PORT}`);
  }
});

module.exports = app; // Export for testing or serverless environments
