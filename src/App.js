import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HolidayCard from './Holidays';
import SignUp from './SignUp';
import Login from './Login';
import Bookings from './Bookings';
import Profile from './Profile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') ? true : false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    // Check token on component mount
    checkToken();

    // Set an interval to keep checking for the token
    const intervalId = setInterval(checkToken, 1000); // Check every 1 second

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <HolidayCard /> : <Navigate to="/login" replace />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mybookings" element={<Bookings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;