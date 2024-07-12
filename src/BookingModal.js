import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axiosWithAuth from './axiosWithAuth';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const BookingModal = (props) => {

    const { holiday, handleBookingSubmit } = props;

    const [guests, setGuests] = useState(1);
    const [startDate, setStartDate] = useState(dayjs());
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleBookingSubmit(holiday, startDate, guests);
        handleClose();
    }

    return (
        <div>
            <Button
            onClick={handleOpen}
            style={{ margin: '10px' }}
            variant="outlined"
            >
                Book
            </Button>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="booking-modal-title"
            aria-describedby="booking-modal-description"
            >
            <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
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
                <Typography id="booking-modal-title" variant="h6" component="h2">
                    Book Your Holiday
                </Typography>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="guests"
                    label="Number of Guests"
                    name="guests"
                    type="number"
                    value={guests}
                    inputProps={{ min: 1 }}
                    onChange={(e) => setGuests(e.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => {
                            setStartDate(newValue);
                        }}
                        minDate={dayjs(new Date())}
                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    />
                </LocalizationProvider>
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Total Price: ${Number(guests) * holiday.price}
                </Typography>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Save Booking
                </Button>
            </Box>
            </Modal>
        </div>
    );
};

export default BookingModal;