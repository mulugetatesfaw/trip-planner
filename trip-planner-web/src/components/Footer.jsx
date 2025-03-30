import React from 'react';
import { FaMapPin, FaPhone, FaPaperPlane, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { RiRoadsterLine } from 'react-icons/ri';
import '../assets/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-curve"></div>
      
      <div className="footer-content">
        <div className="brand-section">
          <div className="brand-logo">
            <RiRoadsterLine className="logo-icon" />
            <span className="logo-text">RouteMaster</span>
          </div>
          <p className="brand-tagline">Precision in every mile</p>
        </div>

        <div className="footer-grid">
          {/* Navigation Column */}
          <div className="footer-col">
            <h4 className="column-title">Journey</h4>
            <ul className="footer-links">
              <li><a href="/routes" className="link-item">Route Planning</a></li>
              <li><a href="/analytics" className="link-item">Performance Analytics</a></li>
              <li><a href="/compliance" className="link-item">Compliance Hub</a></li>
              <li><a href="/support" className="link-item">Driver Support</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="footer-col">
            <h4 className="column-title">Connect</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FaMapPin className="contact-icon" />
                <span>Silicon Valley Hub</span>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+1 (888) 867-5309</span>
              </div>
              <div className="contact-item">
                <FaPaperPlane className="contact-icon" />
                <span>hello@routemaster.ai</span>
              </div>
            </div>
          </div>

          {/* Social Column */}
          <div className="footer-col">
            <h4 className="column-title">Follow the Road</h4>
            <div className="social-links">
              <a href="#" className="social-card">
                <FaTwitter className="social-icon" />
                <span>Updates</span>
              </a>
              <a href="#" className="social-card">
                <FaLinkedin className="social-icon" />
                <span>Careers</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-legal">
          <div className="legal-text">
            © 2023 RouteMaster Technologies
            <span className="divider">|</span>
            <a href="/privacy">Data Promise</a>
            <span className="divider">|</span>
            <a href="/terms">Service Terms</a>
          </div>
          <div className="innovation-tag">
            <span>🚀 Built for tomorrow's highways</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;