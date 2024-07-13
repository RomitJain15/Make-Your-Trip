const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Holiday, User } = require('./schemas');

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; 

const app = express();


const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors({
  origin: 'https://make-your-trip-ajj9.onrender.com/' // Replace with your frontend domain
}));
app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));


const authenticateToken = (req, res, next) => {
  // Get the token from the request header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401); // If no token, return Unauthorized

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // If token is not valid, return Forbidden
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
};

// MongoDB connection
mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Routes :-

// Get all holidays

app.get('/api/holidays', authenticateToken, async (req, res) => {
  // Assuming `comments.userId` references `User` model
  const holidays = await Holiday.find()
                                .populate({
                                  path: 'comments.userId',
                                  select: 'name image' // Only fetch the username field
                                });

  res.json(holidays);
});

// Filter Holidays

// app.get('/api/holidays', async (req, res) => {
//   // Adjust the find method to include a query for city equals "Ajmer"
//   const holidays = await Holiday.find({ city: 'Ajmer' });
//   res.json(holidays);
// });

// My Bookings

app.get('/api/bookings', authenticateToken, async (req, res) => {
  const bookings = await Holiday.find({ 'booking.userId': req.user.id })
                                .populate({
                                  path: 'comments.userId',
                                  select: 'name image'
                                });
  res.json(bookings);
});

// Edit Holiday

app.put('/api/editHolidays/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedHoliday = await Holiday.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedHoliday) {
      return res.status(404).send('Holiday not found.');
    }
    res.json(updatedHoliday);
  } catch (error) {
    res.status(500).send('Error updating holiday: ' + error.message);
  }
});

// Add Holiday

app.post('/api/holidays', authenticateToken, async (req, res) => {
  // Check if req.body is an array
  console.log("Request body:", req.body.length);
  console.log("Request body:", req.body)
  if (Array.isArray(req.body)) {
    try {
      // Use Promise.all to save all holidays concurrently
      const savedHolidays = await Promise.all(req.body.map(holidayData => {
        const newHoliday = new Holiday(holidayData);
        return newHoliday.save();
      }));
      console.log("Holidays saved successfully:");
      res.json(savedHolidays); // Send back the array of saved holidays
    } catch (error) {
      // Handle any errors that occur during the save process
      res.status(500).json({ message: "Error saving holidays", error: error });
    }
  } else {
    // Handle the case where the request body is not an array
    res.status(400).json({ message: "Invalid input, expected an array of holidays" });
  }
});

// add comments
app.post('/api/comments/:holidayID', authenticateToken, async (req, res) => {
    try {
      const holidayId = req.params.holidayID;
      const userId = req.user.id;
      const { commentText } = req.body;
      const date = new Date();
      const holiday = await Holiday.findById(holidayId);
      if (!holiday) {
        return res.status(404).json({ message: 'Holiday not found' });
      }
      holiday.comments.push({ userId: userId, comment: commentText, createdAt:date });
      await holiday.save();
      res.json(holiday);
    } catch (error) { 
      res.status(500).json({ message: 'Error adding comment', error: error.toString() });
    } 
});

// Add Booking

app.post('/api/bookings/:holidayID', authenticateToken, async (req, res) => {
  try {
    const holidayId = req.params.holidayID;
    const userId = req.user.id;
    const { startDate, amount, guests, endDate } = req.body;
    const holiday = await Holiday.findById(holidayId);
    if (!holiday) {
      return res.status(404).json({ message: 'Holiday not found' });
    }
    holiday.booking.push({ userId: userId, startDate: startDate, Amount: amount, guests: guests, endDate: endDate });
    await holiday.save();
    res.json(holiday);
  } catch (error) {
    res.status(500).json({ message: 'Error adding booking', error: error.toString() });
  }
});

// Delete Booking

app.delete('/api/bookings/:bookingID', authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.bookingID;
    const userId = req.user.id;
    const holiday = await Holiday.findOne({ 'booking._id': bookingId });
    if (!holiday) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const booking = holiday.booking.id(bookingId);
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    booking.deleteOne();
    await holiday.save();
    res.json(holiday);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.toString() });
  }
});
// Delete All Holidays

app.delete('/api/DeleteAllHolidays', authenticateToken, async (req, res) => {
try {
    console.log("Attempting to delete all holidays...");
    const result = await Holiday.deleteMany({});
    console.log("Delete result:", result);
    res.json({ message: 'All holidays deleted successfully', result: result });
} catch (error) {
    console.error("Error deleting holidays:", error);
    res.status(500).json({ message: 'Error deleting holidays', error: error.toString() });
}
});

// Delete Holiday

app.delete('/api/holidays/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Attempting to delete holiday with ID: ${id}...`);
    const result = await Holiday.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Holiday not found' });
    }
    console.log("Delete result:", result);
    res.json({ message: 'Holiday deleted successfully', result: result });
  } catch (error) {
    console.error("Error deleting holiday:", error);
    res.status(500).json({ message: 'Error deleting holiday', error: error.toString() });
  }
});


// SignUp

app.post('/api/register', async (req, res) => {
  // Assuming 'email' is the unique attribute you want to check
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    // Respond with an error if a user with the same email already exists
    return res.status(400).json({ message: 'User already exists with this email.' });
  }

  // If no existing user is found, proceed to create a new user
  User.create(req.body)
    .then(user => {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ user, token });
    })
    .catch(err => {
      console.error(err); // Log the error for debugging
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Login 

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          // Generate a JWT token when the user successfully logs in
          const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
          // Send the token and user info back to the client
          res.json({ message: "Success", user: user, token: token });
        } else {
          res.json({ message: "Incorrect Password", user: null });
        }
      } else {
        res.json({ message: "User does not exist", user: null });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "An error occurred" });
    });
});

// Profile

app.get('/api/profile', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

// Profile Photo

app.put('/api/profile/photo', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.image = req.body.image;
  await user.save();
  res.json(user);
}
);

// Add Itinerary

app.put('/api/itinerary/:holidayID', authenticateToken, async (req, res) => {
    try {
      const holidayId = req.params.holidayID;
      const { itinerary } = req.body;
      const holiday = await Holiday.findById(holidayId);
      if (!holiday) {
        return res.status(404).json({ message: 'Holiday not found' });
      }
      holiday.itinerary = itinerary;
      await holiday.save();
      res.json(holiday);
    } catch (error) {
      res.status(500).json({ message: 'Error updating itinerary', error: error.toString() });
    }
  }
);

// Delete Itinerary

app.delete('/api/itinerary/delete/:holidayID', authenticateToken, async (req, res) => {
    try {
      const holidayId = req.params.holidayID;
      const holiday = await Holiday.findById(holidayId);
      if (!holiday) {
        return res.status(404).json({ message: 'Holiday not found' });
      }
      holiday.itinerary = [];
      await holiday.save();
      res.json(holiday);
    } catch (error) {
      res.status(500).json({ message: 'Error deleting itinerary', error: error.toString() });
    }
  }
);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));