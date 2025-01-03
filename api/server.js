require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors(
  {
    origin:[""],
    methods:["POST" , "GET"],
    credentials:true
  }
));
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

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
    res.json(updatedContact);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// Update an existing contact
app.put('/api/contacts/:id', async (req, res) => {
    try {
      const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } // Return the updated document
      );
      res.json(updatedContact);
    } catch (err) {
      res.status(500).send('Server error');
    }
  });
  
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = serverless(app);
