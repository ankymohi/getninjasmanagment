import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, TextField } from '@mui/material';
import axios from 'axios';

const ContactTable = ({ contacts, setContacts }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);

  const handleEditClick = (contact) => {
    setCurrentContact(contact);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setCurrentContact(null);
  };

  const handleEditSave = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/contacts/${currentContact._id}`, currentContact);
      setContacts((prevContacts) =>
        prevContacts.map((contact) => (contact._id === res.data._id ? res.data : contact))
      );
      handleEditClose();
    } catch (err) {
      console.error('Error updating contact:', err);
    }
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Coins Used</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Revenue</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact._id}>
                <TableCell>{contact.date}</TableCell>
                <TableCell>{contact.project}</TableCell>
                <TableCell>{contact.category}</TableCell>
                <TableCell>{contact.coinsUsed}</TableCell>
                <TableCell>{contact.status}</TableCell>
                <TableCell>{contact.revenue}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEditClick(contact)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      {currentContact && (
        <Dialog open={openEdit} onClose={handleEditClose}>
          <div style={{ padding: 20 }}>
            <h3>Edit Contact</h3>
            <TextField
              label="Date"
              value={currentContact.date}
              onChange={(e) => setCurrentContact({ ...currentContact, date: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Project"
              value={currentContact.project}
              onChange={(e) => setCurrentContact({ ...currentContact, project: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Category"
              value={currentContact.category}
              onChange={(e) => setCurrentContact({ ...currentContact, category: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Coins Used"
              type="number"
              value={currentContact.coinsUsed}
              onChange={(e) => setCurrentContact({ ...currentContact, coinsUsed: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Status"
              value={currentContact.status}
              onChange={(e) => setCurrentContact({ ...currentContact, status: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Revenue"
              type="number"
              value={currentContact.revenue}
              onChange={(e) => setCurrentContact({ ...currentContact, revenue: e.target.value })}
              fullWidth
              margin="normal"
            />
            <div style={{ marginTop: 20 }}>
              <Button variant="contained" color="primary" onClick={handleEditSave}>
                Save
              </Button>
              <Button variant="contained" color="secondary" onClick={handleEditClose} style={{ marginLeft: 10 }}>
                Cancel
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default ContactTable;
