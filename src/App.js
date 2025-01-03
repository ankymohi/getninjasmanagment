import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import ContactForm from './components/ContactForm';
import ContactTable from './components/ContactTable';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

const App = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [contacts, setContacts] = useState([]);

  // Fetch contacts from the backend
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/contacts');
        setContacts(res.data);
      } catch (err) {
        console.error('Error fetching contacts:', err);
      }
    };

    fetchContacts();
  }, []);

  // Update the date every second
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      setCurrentDate(formattedDate);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Function to add a new contact
  const addContact = async (contact) => {
    try {
      const res = await axios.post('http://localhost:5000/api/contacts', contact);
      setContacts((prevContacts) => [...prevContacts, res.data]);
    } catch (err) {
      console.error('Error adding contact:', err);
    }
  };

  // PDF generation
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Date: ${currentDate}`, 14, 10);

    const tableColumn = ['Date', 'Project', 'Category', 'Coins Used', 'Status', 'Revenue'];
    const tableRows = [];

    contacts.forEach((contact) => {
      const rowData = [
        contact.date,
        contact.project,
        contact.category,
        contact.coinsUsed,
        contact.status,
        contact.revenue,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('daily_report.pdf');
  };

  const calculateProfit = () => {
    const totalCoinsUsed = contacts.reduce((acc, contact) => acc + parseInt(contact.coinsUsed || 0, 10), 0);
    const totalRevenue = contacts.reduce((acc, contact) => acc + parseFloat(contact.revenue || 0), 0);
    const investment = (totalCoinsUsed / 4800) * 716;
    const profit = totalRevenue - investment;

    return { investment: investment.toFixed(2), profit: profit.toFixed(2), totalRevenue };
  };

  const { investment, profit, totalRevenue } = calculateProfit();

  return (
    <>
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 5 }}>
        <Container>
          <Typography variant="h3" align="center" gutterBottom>
            GetNinjas Profit Management
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <ContactForm addContact={addContact} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: '10px', bgcolor: 'white' }}>
                <Typography variant="h6" gutterBottom>
                  Profit Summary
                </Typography>
                <Typography>Total Coins Used: {contacts.reduce((acc, contact) => acc + parseInt(contact.coinsUsed || 0, 10), 0)}</Typography>
                <Typography>Total Revenue: R$ {totalRevenue}</Typography>
                <Typography>Investment: R$ {investment}</Typography>
                <Typography>Profit: R$ {profit}</Typography>
              </Box>
            </Grid>
          </Grid>

          <Typography variant="h5" mt={4} gutterBottom>
            Today's Date
          </Typography>
          <div style={{ fontSize: '1.5em', color: '#555' }}>{currentDate}</div>

          <Box mt={5}>
            <ContactTable contacts={contacts} setContacts={setContacts} />
          </Box>
        </Container>
      </Box>

      <Button
        variant="contained"
        color="secondary"
        onClick={generatePDF}
        sx={{ mt: 2, display: 'block', mx: 'auto' }}
      >
        Generate PDF
      </Button>
    </>
  );
};

export default App;
