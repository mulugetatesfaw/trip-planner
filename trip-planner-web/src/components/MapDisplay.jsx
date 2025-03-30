import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useLocation } from "react-router-dom";

// Fix marker icons for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapDisplay = () => {
  const location = useLocation();
  const { state } = location; // Retrieve data from navigation state
  const { pickup_location, dropoff_location } = state || {};

  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);

  // Function to get coordinates from address using Nominatim API
  const getCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      if (data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  useEffect(() => {
    if (pickup_location) {
      getCoordinates(pickup_location).then(setPickupCoords);
    }
    if (dropoff_location) {
      getCoordinates(dropoff_location).then(setDropoffCoords);
    }
  }, [pickup_location, dropoff_location]);

  const route = pickupCoords && dropoffCoords ? [pickupCoords, dropoffCoords] : [];

  return (
    <div style={{ height: "100vh" }}>
      <MapContainer center={pickupCoords || [0, 0]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
        />
        {pickupCoords && (
          <Marker position={pickupCoords}>
            <Popup>Pickup Location</Popup>
          </Marker>
        )}
        {dropoffCoords && (
          <Marker position={dropoffCoords}>
            <Popup>Dropoff Location</Popup>
          </Marker>
        )}
        {pickupCoords && dropoffCoords && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default MapDisplay;
