import React, { useState, useEffect } from 'react';
import { Modal, Button, Box, Typography } from '@mui/material';
import AddHolidayForm from './AddHolidayForm'; // Assuming AddHolidayForm is your form component
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function HolidayModal(props) {
  const { mode, holidayData, onAddHoliday, onEditHoliday } = props;
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(holidayData || {});

  useEffect(() => {
    if (mode === 'edit' && holidayData) {
      setFormData(holidayData);
    }
  }, [mode, holidayData]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Style for the modal content
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40vw', // Adjust width as needed
    maxWidth: '90vw', // Ensure it doesn't exceed the viewport width
    maxHeight: '85vh', // Set a maximum height to make it smaller and fit on the screen
    overflowY: 'auto', // Enable vertical scrolling within the Box
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleSubmit = (newRecord) => {
    if (mode === 'add') {
      onAddHoliday(newRecord);
    } else if (mode === 'edit') {
      onEditHoliday(holidayData._id, newRecord);
    }
    handleClose(); // Close the modal after submission
  };

  return (
    <div>
    <Button
      variant="outlined"
      onClick={handleOpen}
      style={mode === 'edit' ? {} : {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
      }}
    >
      {mode === 'add' ? 'Add Holiday' : <EditIcon />}
    </Button>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="holiday-modal-title"
        aria-describedby="holiday-modal-description"
      >
        <Box sx={style}>
            <IconButton
                aria-label="close"
                onClick={handleClose} // You need to define this function to handle the close action
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
          <Typography id="holiday-modal-title" variant="h6" component="h2">
            {mode === 'add' ? 'Add New Holiday' : 'Edit Holiday'}
          </Typography>
          <Typography id="holiday-modal-description" sx={{ mt: 2 }}>
            {mode === 'add' ? 'Fill in the details of the new holiday.' : 'Edit the details of the holiday.'}
          </Typography>
          <AddHolidayForm 
            initialData={formData}
            onSubmit={handleSubmit} 
          />
        </Box>
      </Modal>
    </div>
  );
}

export default HolidayModal;