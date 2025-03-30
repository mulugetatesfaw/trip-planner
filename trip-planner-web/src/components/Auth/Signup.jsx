import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/Auth.css';
import UserModel from '../models/userModel';
import useAuthService from '../../services/authService'; // Import useAuthService


const Signup = ({ onAuthSuccess }) => { // Use onAuthSuccess instead of setAuthenticated
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate();
  const authService = useAuthService();
  const [ setSuccess] = useState(null); // State for success message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state
    setSuccess(null); // Reset success state

    const userData = {
      full_name: name,
      email,
      password,
    };
    

    try {
      UserModel.validate(userData);
      await authService.register(userData);
      setSuccess('Registration successful! You can now log in.'); // Set success message
      onAuthSuccess(userData);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while registering.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        {error && <p className="error-message">{error}</p>} {/* Show error if exists */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            Sign Up
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;