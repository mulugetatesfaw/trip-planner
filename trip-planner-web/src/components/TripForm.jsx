// src/components/TripForm.js
import React, { useState } from 'react';
import { FaMapMarkerAlt, FaClock, FaTruckMoving } from 'react-icons/fa';
import '../assets/TripForm.css';
import { useNavigate } from 'react-router-dom';
//import TripService from '../services/tripService';
import TripModel from './models/tripModel';
import useTripService from '../services/tripService';
const TripForm = ({ onSubmit }) => {
  const [tripData, setTripData] = useState({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    current_cycle_used: 0,

  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const tripService = useTripService();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData({ ...tripData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate trip data
      TripModel.validate(tripData);

      // Create TripModel instance
      const trip = new TripModel(
        tripData.current_location,
        tripData.pickup_location,
        tripData.dropoff_location,
        tripData.current_cycle_used
      );

      await tripService.createTrip(trip);
      onSubmit(trip); 
      navigate('/map', { state: { pickup_location: tripData.pickup_location, dropoff_location: tripData.dropoff_location } });
    } catch (err) {
      setError(err.message || 'An error occurred while registering.');
    }
  };

  return (
    <div className="trip-form-container">
      <div className="form-header">
        <FaTruckMoving className="form-icon" />
        <h2>New Trip Planner</h2>
        <p>Enter trip details to generate ELD logs</p>
      </div>

      <form onSubmit={handleSubmit} className="trip-form">
        <div className="input-group">
          <label>
            <FaMapMarkerAlt className="input-icon" />
            Current Location
          </label>
          <input
            type="text"
            name="current_location"
            value={tripData.current_location}
            onChange={handleChange}
            placeholder="Enter current address"
          />
        </div>

        <div className="input-group">
          <label>
            <FaMapMarkerAlt className="input-icon pickup" />
            Pickup Location
          </label>
          <input
            type="text"
            name="pickup_location"
            value={tripData.pickup_location}
            onChange={handleChange}
            placeholder="Enter pickup address"
          />
        </div>

        <div className="input-group">
          <label>
            <FaMapMarkerAlt className="input-icon dropoff" />
            Dropoff Location
          </label>
          <input
            type="text"
            name="dropoff_location"
            value={tripData.dropoff_location}
            onChange={handleChange}
            placeholder="Enter dropoff address"
          />
        </div>

        <div className="input-group">
          <label>
            <FaClock className="input-icon" />
            Current Cycle Used (Hours)
          </label>
          <input
            type="number"
            name="current_cycle_used"
            value={tripData.current_cycle_used}
            onChange={handleChange}
            placeholder="0 - 70 hours"
            step="0.1"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button">
          Star Trip
        </button>
      </form>
    </div>
  );
};

export default TripForm;