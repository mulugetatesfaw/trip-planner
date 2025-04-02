import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaClock, FaTruckMoving } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import "../assets/TripForm.css";
import TripModel from "./models/tripModel";
import useTripService from "../services/tripService";

const TripForm = ({ onSubmit }) => {
  const [tripData, setTripData] = useState({
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    current_cycle_used: 0,
  });

  const [routeCoords, setRouteCoords] = useState(null);

  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [error, setError] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const navigate = useNavigate();
  const tripService = useTripService();

  useEffect(() => {
  const fetchRoute = async () => {
    if (pickupCoords && dropoffCoords) {
      try {
        const pickup = `${pickupCoords[1]},${pickupCoords[0]}`; // lng,lat
        const dropoff = `${dropoffCoords[1]},${dropoffCoords[0]}`; // lng,lat
        
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickup};${dropoff}?overview=full&geometries=geojson`
        );
        
        const data = await response.json();
        
        if (data.routes?.[0]?.geometry?.coordinates) {
          // Convert coordinates from [lng, lat] to [lat, lng]
          const coords = data.routes[0].geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          );
          setRouteCoords(coords);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
        // Fallback to straight line if routing fails
        setRouteCoords([pickupCoords, dropoffCoords]);
      }
    }
  };

  fetchRoute();
}, [pickupCoords, dropoffCoords]);

  const fetchLocationSuggestions = async (query, type) => {
    if (!query) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (type === "pickup") {
        setPickupSuggestions(data);
      } else if (type === "dropoff") {
        setDropoffSuggestions(data);
      }
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setTripData({ ...tripData, [name]: value });
    if (name === "pickup_location") {
      fetchLocationSuggestions(value, "pickup");
    } else if (name === "dropoff_location") {
      fetchLocationSuggestions(value, "dropoff");
    }
  };

  const handleSelectLocation = (place, type) => {
    const newCoords = [parseFloat(place.lat), parseFloat(place.lon)];
    setTripData({ ...tripData, [`${type}_location`]: place.display_name });
    if (type === "pickup") {
      setPickupCoords(newCoords);
      setPickupSuggestions([]);
    } else if (type === "dropoff") {
      setDropoffCoords(newCoords);
      setDropoffSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!pickupCoords || !dropoffCoords) {
      setError("Please enter valid pickup and dropoff locations.");
      return;
    }
    try {
      TripModel.validate(tripData);
      const trip = new TripModel(
        tripData.current_location,
        tripData.pickup_location,
        tripData.dropoff_location,
        tripData.current_cycle_used
      );
      await tripService.createTrip(trip);
      onSubmit(trip);
      navigate("/map", { state: { pickupCoords, dropoffCoords } });
    } catch (err) {
      setError(err.message || "An error occurred while registering.");
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
            <FaMapMarkerAlt className="input-icon" /> Current Location
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
            <FaMapMarkerAlt className="input-icon pickup" /> Pickup Location
          </label>
          <input
            type="text"
            name="pickup_location"
            value={tripData.pickup_location}
            onChange={handleChange}
            placeholder="Enter pickup address"
          />
          {pickupSuggestions.length > 0 && (
            <ul className="suggestions">
              {pickupSuggestions.map((place) => (
                <li key={place.place_id} onClick={() => handleSelectLocation(place, "pickup")}>
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="input-group">
          <label>
            <FaMapMarkerAlt className="input-icon dropoff" /> Dropoff Location
          </label>
          <input
            type="text"
            name="dropoff_location"
            value={tripData.dropoff_location}
            onChange={handleChange}
            placeholder="Enter dropoff address"
          />
          {dropoffSuggestions.length > 0 && (
            <ul className="suggestions">
              {dropoffSuggestions.map((place) => (
                <li key={place.place_id} onClick={() => handleSelectLocation(place, "dropoff")}>
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="input-group">
          <label>
            <FaClock className="input-icon" /> Current Cycle Used (Hours)
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
          Start Trip
        </button>
      </form>
      {/* {pickupCoords && dropoffCoords && (
        <MapContainer center={pickupCoords} zoom={13} style={{ height: "400px", width: "100%", marginTop: "20px" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={pickupCoords}>
            <Popup>Pickup Location</Popup>
          </Marker>
          <Marker position={dropoffCoords}>
            <Popup>Dropoff Location</Popup>
          </Marker>
          <Polyline positions={[pickupCoords, dropoffCoords]} color="red" />
        </MapContainer>
      )} */}

  {pickupCoords && dropoffCoords && (
  <MapContainer center={pickupCoords} zoom={13} style={{ height: "400px", width: "100%", marginTop: "20px" }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <Marker position={pickupCoords}>
      <Popup>Pickup Location</Popup>
    </Marker>
    <Marker position={dropoffCoords}>
      <Popup>Dropoff Location</Popup>
    </Marker>
    
    {routeCoords && (
      <Polyline 
        positions={routeCoords} 
        color="red" 
        weight={3}
        opacity={0.7}
      />
    )}
  </MapContainer>
)}
    </div>
  );
};

export default TripForm;



// import React, { useState } from "react";
// import { FaMapMarkerAlt, FaClock, FaTruckMoving } from "react-icons/fa";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { useNavigate } from "react-router-dom";
// import "../assets/TripForm.css";
// import TripModel from "./models/tripModel";
// import useTripService from "../services/tripService";

// const TripForm = ({ onSubmit }) => {
//   const [tripData, setTripData] = useState({
//     current_location: "",
//     pickup_location: "",
//     dropoff_location: "",
//     current_cycle_used: 0,
//   });
  
//   const [pickupCoords, setPickupCoords] = useState(null);
//   const [dropoffCoords, setDropoffCoords] = useState(null);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const tripService = useTripService();

//   const getCoordinates = async (address) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
//       );
//       const data = await response.json();
//       if (data.length > 0) {
//         return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
//       }
//       return null;
//     } catch (error) {
//       console.error("Error fetching coordinates:", error);
//       return null;
//     }
//   };

//   const handleChange = async (e) => {
//     const { name, value } = e.target;
//     setTripData({ ...tripData, [name]: value });

//     if (name === "pickup_location") {
//       const coords = await getCoordinates(value);
//       setPickupCoords(coords);
//     } else if (name === "dropoff_location") {
//       const coords = await getCoordinates(value);
//       setDropoffCoords(coords);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (!pickupCoords || !dropoffCoords) {
//       setError("Please enter valid pickup and dropoff locations.");
//       return;
//     }

//     try {
//       TripModel.validate(tripData);
//       const trip = new TripModel(
//         tripData.current_location,
//         tripData.pickup_location,
//         tripData.dropoff_location,
//         tripData.current_cycle_used
//       );
      
//       await tripService.createTrip(trip);
//       onSubmit(trip);
//       navigate("/map", { state: { pickupCoords, dropoffCoords } });
//     } catch (err) {
//       setError(err.message || "An error occurred while registering.");
//     }
//   };

//   return (
//     <div className="trip-form-container">
//       <div className="form-header">
//         <FaTruckMoving className="form-icon" />
//         <h2>New Trip Planner</h2>
//         <p>Enter trip details to generate ELD logs</p>
//       </div>

//       <form onSubmit={handleSubmit} className="trip-form">
//         <div className="input-group">
//           <label>
//             <FaMapMarkerAlt className="input-icon" /> Current Location
//           </label>
//           <input
//             type="text"
//             name="current_location"
//             value={tripData.current_location}
//             onChange={handleChange}
//             placeholder="Enter current address"
//           />
//         </div>

//         <div className="input-group">
//           <label>
//             <FaMapMarkerAlt className="input-icon pickup" /> Pickup Location
//           </label>
//           <input
//             type="text"
//             name="pickup_location"
//             value={tripData.pickup_location}
//             onChange={handleChange}
//             placeholder="Enter pickup address"
//           />
//         </div>

//         <div className="input-group">
//           <label>
//             <FaMapMarkerAlt className="input-icon dropoff" /> Dropoff Location
//           </label>
//           <input
//             type="text"
//             name="dropoff_location"
//             value={tripData.dropoff_location}
//             onChange={handleChange}
//             placeholder="Enter dropoff address"
//           />
//         </div>

//         <div className="input-group">
//           <label>
//             <FaClock className="input-icon" /> Current Cycle Used (Hours)
//           </label>
//           <input
//             type="number"
//             name="current_cycle_used"
//             value={tripData.current_cycle_used}
//             onChange={handleChange}
//             placeholder="0 - 70 hours"
//             step="0.1"
//           />
//         </div>
//         {error && <p className="error-message">{error}</p>}
//         <button type="submit" className="submit-button">
//           Start Trip
//         </button>
//       </form>

//       {/* Display Map Only If Coordinates Are Available */}
//       {pickupCoords && dropoffCoords && (
//         <MapContainer
//           center={pickupCoords}
//           zoom={13}
//           style={{ height: "400px", width: "100%", marginTop: "20px" }}
//         >
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//           <Marker position={pickupCoords}>
//             <Popup>Pickup Location</Popup>
//           </Marker>
//           <Marker position={dropoffCoords}>
//             <Popup>Dropoff Location</Popup>
//           </Marker>
//         </MapContainer>
//       )}
//     </div>
//   );
// };

// export default TripForm;
