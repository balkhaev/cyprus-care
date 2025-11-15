'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

interface LocationPickerMapProps {
  initialLocation?: { lat: number; lng: number };
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

export default function LocationPickerMap({
  initialLocation = { lat: 35.1264, lng: 33.4299 },
  onLocationSelect,
}: LocationPickerMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const isInitialized = useRef(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Geocode coordinates to address
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error('Geocoding error:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mapContainerRef.current) return;
    if (isInitialized.current) return;

    // Fix icons
    delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => void })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    try {
      const map = L.map(mapContainerRef.current, {
        center: [initialLocation.lat, initialLocation.lng],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Create marker
      const marker = L.marker([initialLocation.lat, initialLocation.lng], {
        draggable: true,
      }).addTo(map);

      marker.bindPopup('Drag the marker to select location').openPopup();

      // Marker drag handler
      marker.on('dragend', async () => {
        const position = marker.getLatLng();
        setSelectedCoords({ lat: position.lat, lng: position.lng });
        const address = await reverseGeocode(position.lat, position.lng);
        onLocationSelect({ lat: position.lat, lng: position.lng, address });
      });

      // Map click handler
      map.on('click', async (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        setSelectedCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
        const address = await reverseGeocode(e.latlng.lat, e.latlng.lng);
        onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng, address });
      });

      mapRef.current = map;
      markerRef.current = marker;
      isInitialized.current = true;

      setTimeout(() => {
        if (map) {
          map.invalidateSize();
        }
      }, 100);

      // Set initial address
      reverseGeocode(initialLocation.lat, initialLocation.lng).then((address) => {
        onLocationSelect({ ...initialLocation, address });
      });
    } catch (error) {
      console.error('Map initialization error:', error);
    }

    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (error) {
          console.error('Error removing map:', error);
        }
        mapRef.current = null;
        isInitialized.current = false;
      }
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Click on the map or drag the marker to select location
      </div>
      <div
        ref={mapContainerRef}
        className="w-full h-[400px] rounded-lg border border-zinc-300 dark:border-zinc-700 overflow-hidden"
      />
      {selectedCoords && (
        <div className="text-xs text-zinc-500 dark:text-zinc-500">
          Coordinates: {selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
}

