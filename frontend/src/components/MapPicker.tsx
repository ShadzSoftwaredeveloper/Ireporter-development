import React, { useState, useEffect } from 'react';
import { Location } from '../types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { MapPin, Navigation, Globe } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

interface MapPickerProps {
  location: Location;
  onChange: (location: Location) => void;
}

export const MapPicker: React.FC<MapPickerProps> = ({ location, onChange }) => {
  const [lat, setLat] = useState(location.lat.toString());
  const [lng, setLng] = useState(location.lng.toString());
  const [address, setAddress] = useState(location.address || '');
  const [markerPosition, setMarkerPosition] = useState({ x: 50, y: 50 });
  const [mapMode, setMapMode] = useState<'simple' | 'google'>('google');

  useEffect(() => {
    setLat(location.lat.toString());
    setLng(location.lng.toString());
    setAddress(location.address || '');
  }, [location]);

  const handleLatChange = (value: string) => {
    setLat(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= -90 && numValue <= 90) {
      onChange({ ...location, lat: numValue });
      // Update marker position (simplified mapping)
      setMarkerPosition((prev) => ({ ...prev, y: ((90 - numValue) / 180) * 100 }));
    }
  };

  const handleLngChange = (value: string) => {
    setLng(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= -180 && numValue <= 180) {
      onChange({ ...location, lng: numValue });
      // Update marker position (simplified mapping)
      setMarkerPosition((prev) => ({ ...prev, x: ((numValue + 180) / 360) * 100 }));
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMarkerPosition({ x, y });
    
    // Convert to lat/lng (simplified)
    const newLat = 90 - (y * 180 / 100);
    const newLng = (x * 360 / 100) - 180;
    
    setLat(newLat.toFixed(6));
    setLng(newLng.toFixed(6));
    onChange({ ...location, lat: newLat, lng: newLng });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please enter coordinates manually.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLat = position.coords.latitude;
        const newLng = position.coords.longitude;
        setLat(newLat.toString());
        setLng(newLng.toString());
        onChange({ lat: newLat, lng: newLng });
        setMarkerPosition({
          x: ((newLng + 180) / 360) * 100,
          y: ((90 - newLat) / 180) * 100,
        });
      },
      (error) => {
        // Only log to console for permission policy errors, don't alert
        if (error.code === error.PERMISSION_DENIED) {
          console.log('Geolocation permission denied or blocked by policy. Please enter coordinates manually.');
          // Silently fail for permission policy blocks
          return;
        }
        
        let errorMessage = 'Unable to get current location. Please enter coordinates manually.';
        
        switch (error.code) {
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please enter coordinates manually.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again or enter coordinates manually.';
            break;
          default:
            errorMessage = 'Error getting location. Please enter coordinates manually.';
        }
        
        console.error('Geolocation error:', {
          code: error?.code,
          message: (error instanceof Error) ? error.message : String(error),
        });
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Place/Address Input */}
      <div className="space-y-2">
        <Label htmlFor="address">Place or Address (Optional)</Label>
        <Input
          id="address"
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            onChange({ ...location, address: e.target.value });
          }}
          placeholder="e.g., Times Square, New York or 123 Main St"
        />
        <p className="text-sm text-gray-500">
          Type the place name or address for easier identification
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            min="-90"
            max="90"
            value={lat}
            onChange={(e) => handleLatChange(e.target.value)}
            placeholder="e.g., 40.7128"
          />
          <p className="text-sm text-gray-500">Range: -90 to 90</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            min="-180"
            max="180"
            value={lng}
            onChange={(e) => handleLngChange(e.target.value)}
            placeholder="e.g., -74.0060"
          />
          <p className="text-sm text-gray-500">Range: -180 to 180</p>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={getCurrentLocation}
        className="w-full md:w-auto gap-2"
      >
        <Navigation className="w-4 h-4" />
        Use Current Location
      </Button>

      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <Label>Location on Map</Label>
          <Tabs value={mapMode} onValueChange={(value) => setMapMode(value as 'simple' | 'google')}>
            <TabsList>
              <TabsTrigger value="google" className="gap-2">
                <Globe className="w-4 h-4" />
                Google Maps
              </TabsTrigger>
              <TabsTrigger value="simple" className="gap-2">
                <MapPin className="w-4 h-4" />
                Simple
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {mapMode === 'google' ? (
          <div className="relative w-full h-96 bg-white rounded-lg border-2 border-gray-300 overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={address.trim() 
                ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=15`
                : `https://www.google.com/maps?q=${parseFloat(lat)},${parseFloat(lng)}&output=embed&z=15`
              }
              title="Google Maps Location"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white px-4 py-2 text-sm">
              <div className="flex justify-between items-center">
                <span>Location Preview</span>
                <span>
                  {parseFloat(lat).toFixed(4)}, {parseFloat(lng).toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={handleMapClick}
            className="relative w-full h-96 bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50 rounded-lg border-2 border-gray-300 overflow-hidden cursor-crosshair"
            style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(0,0,0,.05) 35px, rgba(0,0,0,.05) 36px),
                repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(0,0,0,.05) 35px, rgba(0,0,0,.05) 36px)
              `,
            }}
          >
            {/* Marker */}
            <div
              className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200"
              style={{
                left: `${markerPosition.x}%`,
                top: `${markerPosition.y}%`,
              }}
            >
              <MapPin className="w-8 h-8 text-red-600 fill-red-500" />
            </div>
            
            {/* Coordinates display */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white px-4 py-2 text-sm">
              <div className="flex justify-between items-center">
                <span>Click on the map to set location</span>
                <span>
                  {parseFloat(lat).toFixed(4)}, {parseFloat(lng).toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500">
          {mapMode === 'google' 
            ? 'View the location on Google Maps. Type a place name above or use coordinates to update the position.'
            : 'Click anywhere on the map to set the incident location, or enter coordinates manually above.'
          }
        </p>
      </div>
    </div>
  );
};