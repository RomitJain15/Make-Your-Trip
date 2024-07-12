

const mongoose = require('mongoose');

// Mongoose model
const HolidaySchema = new mongoose.Schema({
    id: Number,
    city: String,
    country: String,
    price: Number,
    deal: Boolean,
    dealDetails: String,
    rating: Number,
    duration: String,
    imageUrl: String,
    description: String,
    tags: [String],
    comments: [{ 
      userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
      comment: String,
      createdAt: Date,
    }],
    booking: [{
      userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      startDate: Date,
      endDate: Date,
      Amount: Number,
      guests: Number,
    }],
    itinerary: [{
      day: Number,
      activities: [String],
    }]
  });

  
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    image: { type: String, default: 'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg' },
    joiningDate: { type: Date, default: Date.now },
  });

  
// Convert schemas into models and export them
const Holiday = mongoose.model('Holiday', HolidaySchema);
const User = mongoose.model('User', UserSchema);

module.exports = { Holiday, User };