import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HolidayCard from './Holidays';
import SignUp from './SignUp';
import Login from './Login';
import Bookings from './Bookings';
import Profile from './Profile';

function HomeRoute() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('token') ? true : location.state?.isLoggedIn || false;

  return isLoggedIn ? <HolidayCard /> : <Navigate to="/login" replace />;
}


function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') ? true : false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mybookings" element={<Bookings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;