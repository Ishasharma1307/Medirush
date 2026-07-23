import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapControls } from './MapControls';

// Fix standard Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom colored markers using divIcon
const createCustomIcon = (type) => {
  let colorClass = 'bg-blue-500';
  if (type === 'Hospital') colorClass = 'bg-red-500';
  else if (type === 'Pharmacy') colorClass = 'bg-green-500';
  else if (type === 'Clinic') colorClass = 'bg-purple-500';

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="${colorClass} w-6 h-6 rounded-full border-2 border-white shadow-lg shadow-black/30 flex items-center justify-center hover:scale-110 transition-transform">
            <div class="w-2 h-2 bg-white rounded-full"></div>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24]
  });
};

const UserLocationIcon = L.divIcon({
  className: 'user-location-icon',
  html: `<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center animate-pulse shadow-xl shadow-blue-500/50">
          <div class="w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

// Component to handle recentering the map when coordinates change
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
};

export const HealthcareMap = ({ userLocation, places, activePlace, onPlaceSelect, onRecenter }) => {
  const defaultCenter = [40.7128, -74.0060]; // NY fallback
  const center = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={center} 
        zoom={14} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapUpdater center={userLocation ? [userLocation.lat, userLocation.lng] : null} />
        
        <MapControls onRecenter={onRecenter} />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={UserLocationIcon} />
        )}

        {places.map((place) => (
          <Marker 
            key={place.id}
            position={[place.latitude, place.longitude]}
            icon={createCustomIcon(place.type)}
            eventHandlers={{
              click: () => onPlaceSelect(place),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};
