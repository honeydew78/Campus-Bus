import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

// Fix for broken leaflet icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Uncomment and configure this logic in the future for real-time tracking
/*
const socket = io('http://localhost:4000'); // Update this URL as needed
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}
*/

const LiveMap = () => {
  // Uncomment this logic in the future for real-time tracking
  /*
  const [markers, setMarkers] = useState({});

  useEffect(() => {
    // Handle receiving new locations
    socket.on('receive-location', (data) => {
      console.log(data);
      const { id, latitude, longitude } = data;
      setMarkers((prevMarkers) => ({
        ...prevMarkers,
        [id]: { latitude, longitude },
      }));
    });

    // Handle user disconnection
    socket.on('user-disconnected', (id) => {
      setMarkers((prevMarkers) => {
        const updatedMarkers = { ...prevMarkers };
        delete updatedMarkers[id];
        return updatedMarkers;
      });
    });

    return () => {
      socket.off('receive-location');
      socket.off('user-disconnected');
    };
  }, []);
  */

  // Hardcoded location
  const hardcodedLocation = { latitude: 25.4322, longitude: 81.7704 };

  return (
    <MapContainer
      center={[hardcodedLocation.latitude, hardcodedLocation.longitude]}
      zoom={16}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[hardcodedLocation.latitude, hardcodedLocation.longitude]}>
        <Popup>
          Hardcoded Location: 25.4322° N, 81.7704° E
        </Popup>
      </Marker>

      {/* Uncomment this logic to show markers from real-time data */}
      {/* {Object.keys(markers).map((id) => (
        <Marker key={id} position={[markers[id].latitude, markers[id].longitude]}>
          <Popup>Bus ID: {id}</Popup>
        </Marker>
      ))} */}
    </MapContainer>
  );
};

export default LiveMap;
