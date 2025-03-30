import React, { useState } from 'react';
//import { Link, useNavigate } from 'react-router-dom';
import TripForm from './TripForm';
import '../assets/Dashboard.css';

const Dashboard = ({ user, setAuthenticated }) => {
  const [activeTab, setActiveTab] = useState('new-trip');
  const [tripHistory] = useState([
    { id: 1, date: '2024-03-01', route: 'San Francisco to Los Angeles', status: 'Completed' },
    { id: 2, date: '2024-03-05', route: 'Los Angeles to Las Vegas', status: 'In Progress' },
  ]);

  const handleLogout = () => {
    setAuthenticated(false);
    // Add actual logout logic here
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="user-profile">
          <div className="profile-icon">
            {user.name[0]}
          </div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <button onClick={handleLogout} className="logout-button">
            Log Out
          </button>
        </div>

        <nav className="dashboard-nav">
          <button 
            className={`nav-item ${activeTab === 'new-trip' ? 'active' : ''}`}
            onClick={() => setActiveTab('new-trip')}
          >
            🚚 New Trip
          </button>
          <button 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📋 Trip History
          </button>
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        {activeTab === 'new-trip' && (
          <div className="dashboard-section">
            <h2>Plan New Trip</h2>
            <TripForm />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="dashboard-section">
            <h2>Trip History</h2>
            <div className="trip-list">
              {tripHistory.map(trip => (
                <div key={trip.id} className="trip-card">
                  <div className="trip-date">{trip.date}</div>
                  <div className="trip-route">{trip.route}</div>
                  <div className={`trip-status ${trip.status.toLowerCase()}`}>
                    {trip.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="dashboard-section">
            <h2>Profile Settings</h2>
            <div className="profile-info">
              <div className="info-item">
                <label>Name:</label>
                <p>{user.name}</p>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <p>{user.email}</p>
              </div>
              <div className="info-item">
                <label>Member Since:</label>
                <p>March 2024</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;