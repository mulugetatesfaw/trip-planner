import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthService from '../../services/authService'; // Import AuthService
import '../../assets/Auth.css';

const Login = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State for error handling
  const authService = useAuthService();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    const credentials = {
      email,
      password,
    };
    try {
      const response = await authService.login(credentials);
     console.log("API Response:", response); 

      if (response.access) {
        localStorage.setItem('accessToken', response.access);
      }
      if (response.refresh) {
        localStorage.setItem('refreshToken', response.refresh);
      }

      const userData = {
        userId: response.user_id, 
        email: response.email, 
        fullName: response.full_name, 
      };
      onAuthSuccess(userData);
      navigate('/dashboard');
    } catch (err) {
      console.error("errorrr", err);
      setError(err.message || 'An error occurred while logging in.'); // Set error state
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        {error && <p className="error-message">{error}</p>} {/* Show error if exists */}
        <form onSubmit={handleSubmit}>
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
            Sign In
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;