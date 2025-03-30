import React from 'react';
import '../assets/Logsheet.css';

const LogSheet = ({ logs }) => {
  return (
    <div className="log-sheet">
      <h2>Daily Log Sheets</h2>
      {logs.map((log, index) => (
        <div key={index} className="log-entry">
          <p>Date: {log.date}</p>
          <p>Start Time: {log.startTime}</p>
          <p>End Time: {log.endTime}</p>
          <p>Distance: {log.distance} miles</p>
        </div>
      ))}
    </div>
  );
};

export default LogSheet;