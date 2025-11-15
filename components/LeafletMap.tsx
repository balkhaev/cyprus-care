'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Исправление иконок маркеров Leaflet
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => void })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
}

interface LeafletMapProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (marker: MapMarker) => void;
  userLocation?: { lat: number; lng: number } | null;
}

export default function LeafletMap({
  markers = [],
  center = [55.7558, 37.6173], // Москва по умолчанию
  zoom = 13,
  onMarkerClick,
  userLocation,
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Инициализация карты
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Создаем карту
    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: true,
    });

    // Добавляем тайлы OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Создаем слой для маркеров
    markersLayerRef.current = L.layerGroup().addTo(map);

    mapRef.current = map;

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, zoom]);

  // Обновление маркеров
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    // Очищаем предыдущие маркеры
    markersLayerRef.current.clearLayers();

    // Добавляем новые маркеры
    markers.forEach((markerData) => {
      const marker = L.marker([markerData.lat, markerData.lng])
        .bindPopup(`
          <div style="padding: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 4px; color: #18181b;">${markerData.title}</h3>
            <p style="color: #52525b; margin: 0;">${markerData.description}</p>
          </div>
        `)
        .on('click', () => {
          if (onMarkerClick) {
            onMarkerClick(markerData);
          }
        });

      if (markersLayerRef.current) {
        marker.addTo(markersLayerRef.current);
      }
    });
  }, [markers, onMarkerClick]);

  // Обновление местоположения пользователя
  useEffect(() => {
    if (!mapRef.current) return;

    // Удаляем предыдущий маркер пользователя
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userLocation) {
      // Создаем кастомную иконку для местоположения пользователя
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div style="position: relative;">
            <div style="
              width: 20px;
              height: 20px;
              background-color: #3b82f6;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            "></div>
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 40px;
              height: 40px;
              background-color: rgba(59, 130, 246, 0.2);
              border-radius: 50%;
              animation: pulse 2s infinite;
            "></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      // Добавляем маркер пользователя
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
      })
        .bindPopup('<div style="padding: 8px; font-weight: bold; color: #18181b;">Ваше местоположение</div>')
        .addTo(mapRef.current);

      // Центрируем карту на местоположении пользователя
      mapRef.current.setView([userLocation.lat, userLocation.lng], 15);
    }
  }, [userLocation]);

  return (
    <>
      <div ref={mapContainerRef} className="w-full h-full" />
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.4;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
        
        .leaflet-popup-tip-container {
          display: none;
        }
      `}</style>
    </>
  );
}

