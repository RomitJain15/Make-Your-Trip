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
    const handleLoginEvent = () => {
      setIsLoggedIn(localStorage.getItem('token') ? true : false);
    };

    // Listen for the loginEvent
    window.addEventListener('loginEvent', handleLoginEvent);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('loginEvent', handleLoginEvent);
    };
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