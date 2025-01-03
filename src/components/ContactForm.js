import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const ContactForm = ({ addContact }) => {
  const [contact, setContact] = useState({
    date: '',
    project: '',
    category: '',
    coinsUsed: '',
    status: 'Unlocked',
    revenue: '',
    replacementCoins: '',
  });

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addContact({ ...contact, id: Date.now() });
    setContact({
      date: '',
      project: '',
      category: '',
      coinsUsed: '',
      status: 'Unlocked',
      revenue: '',
      replacementCoins: '',
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 3, border: '1px solid #ddd', borderRadius: '10px', bgcolor: 'white' }}
    >
      <Typography variant="h6" gutterBottom>
        Add Contact
      </Typography>
      <TextField
        label="Date"
        type="date"
        name="date"
        value={contact.date}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Client Name"
        name="project"
        value={contact.project}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Category"
        name="category"
        value={contact.category}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Coins Used"
        name="coinsUsed"
        type="number"
        value={contact.coinsUsed}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Status"
        name="status"
        value={contact.status}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Revenue"
        name="revenue"
        type="number"
        value={contact.revenue}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" fullWidth>
        Add Contact
      </Button>
    </Box>
  );
};

export default ContactForm;
