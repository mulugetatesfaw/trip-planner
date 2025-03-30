import React, { useState } from 'react';
import { createDriverProfile } from '../services/apiService';

const DriverProfile = ({ token }) => {
  const [formData, setFormData] = useState({
    user: '', // Email of the user
    license_number: '',
    available_hours: 70.0, // Default value
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDriverProfile(formData, token);
      alert('Driver profile created successfully!');
    } catch (error) {
      alert('Failed to create driver profile: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="user" onChange={handleChange} placeholder="User Email" required />
      <input type="text" name="license_number" onChange={handleChange} placeholder="License Number" required />
      <input type="number" name="available_hours" onChange={handleChange} placeholder="Available Hours" required />
      <button type="submit">Create Driver Profile</button>
    </form>
  );
};

export default DriverProfile;