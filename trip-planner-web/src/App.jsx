import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import TripForm from './components/TripForm';
import TripService from './services/tripService';
import Testimonials from './components/Testimonials';
import MapDisplay from './components/MapDisplay';
import './styles.css';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);

  // Restore authentication state from localStorage
  useEffect(() => {
    const accessToken = localStorage.getItem('access');
    if (accessToken) {
      setAuthenticated(true);
      setUser({
        name: localStorage.getItem('name') || 'Driver',
        email: localStorage.getItem('email') || 'driver@example.com',
        driver_profile: JSON.parse(localStorage.getItem('driver_profile') || '{}'),
      });
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setAuthenticated(true);
    localStorage.setItem('access', userData.access);
    localStorage.setItem('refresh', userData.refresh); // Fixed refresh token storage
    localStorage.setItem('name', userData.name);
    localStorage.setItem('email', userData.email);
    localStorage.setItem('driver_profile', JSON.stringify(userData.driver_profile || {}));

    setUser({
      name: userData.name || 'Driver',
      email: userData.email || 'driver@example.com',
      driver_profile: userData.driver_profile || {},
    });
  };

  const handleTripSubmit = async (tripData) => {
    try {
      const newTrip = await TripService.createTrip({
        ...tripData,
        driver: user.driver_profile.id,
      });
      setTrips((prevTrips) => [...prevTrips, newTrip]);
      alert('Trip submitted successfully!');
    } catch (error) {
      alert('Error submitting trip: ' + (error.message || error));
    }
  };

  return (
    <Router>
      <div className="app-container">
        {!authenticated && <Header />}

        <Routes>
          <Route
            path="/login"
            element={authenticated ? <Navigate to="/dashboard" /> : <Login onAuthSuccess={handleAuthSuccess} />}
          />
          <Route
            path="/signup"
            element={authenticated ? <Navigate to="/dashboard" /> : <Signup onAuthSuccess={handleAuthSuccess} />}
          />
          <Route
            path="/dashboard"
            element={authenticated ? <Dashboard user={user} setAuthenticated={setAuthenticated} trips={trips} /> : <Navigate to="/login" />}
          />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route
            path="/trip-form"
            element={authenticated ? <TripForm onSubmit={handleTripSubmit} /> : <Navigate to="/login" />} 
          />
          <Route path="/map" element={<MapDisplay />} />
          <Route
            path="/"
            element={authenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />
        </Routes>

        {!authenticated && <Footer />}
      </div>
    </Router>
  );
};

export default App;
