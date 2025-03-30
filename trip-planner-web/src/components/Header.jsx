import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTruck, FaBars, FaTimes } from 'react-icons/fa';
import '../assets/Header.css';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        {/* Animated Logo */}
        <div className={`logo ${isMounted ? 'logo-animate' : ''}`}>
          <FaTruck className="logo-icon" />
          <span className="logo-text">
            <span className="logo-highlight">ELD</span>Logger
          </span>
        </div>

        {/* Right Navigation */}
        <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="#testimonials" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Testimonials
          </Link>
          <Link to="#contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Contact Us
          </Link>
          <div className="auth-buttons">
            <Link to="/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Sign In
            </Link>
            <Link to="/signup" className="cta-button" onClick={() => setMobileMenuOpen(false)}>
              Sign Up
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div 
          className="mobile-menu-icon"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </header>
  );
};

export default Header;