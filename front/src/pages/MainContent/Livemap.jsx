import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import img from '../../assets/location-pin.png';

// Fix for broken leaflet icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom icon using your imported image
const customIcon = new L.Icon({
  iconUrl: img,
  iconSize: [40, 40], // Adjust size as needed
  iconAnchor: [20, 40], // Adjust anchor point as needed (half width, full height)
  popupAnchor: [0, -40], // Adjust popup anchor
});

const LiveMap = () => {
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
      <Marker 
        position={[hardcodedLocation.latitude, hardcodedLocation.longitude]} 
        icon={customIcon}
      >
        <Popup>
          Live Location: 25.4322° N, 81.7704° E
        </Popup>
      </Marker>

      {/* Uncomment this logic to show markers from real-time data */}
      {/* {Object.keys(markers).map((id) => (
        <Marker key={id} position={[markers[id].latitude, markers[id].longitude]} icon={customIcon}>
          <Popup>Bus ID: {id}</Popup>
        </Marker>
      ))} */}
    </MapContainer>
  );
};

export default LiveMap;
