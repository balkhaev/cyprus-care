'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Venue } from '@/types/venue';

// Исправление иконок маркеров Leaflet
const fixLeafletIcons = () => {
  if (typeof window === 'undefined') return;
  
  delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => void })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
};

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

// Calculate ETA based on distance (assuming average speed)
function calculateETA(distanceKm: number): string {
  // Average speed: walking 5 km/h, driving 40 km/h in city
  // Use 30 km/h as average
  const avgSpeed = 30;
  const timeHours = distanceKm / avgSpeed;
  const timeMinutes = Math.round(timeHours * 60);
  
  if (timeMinutes < 60) {
    return `${timeMinutes} min`;
  } else {
    const hours = Math.floor(timeMinutes / 60);
    const minutes = timeMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  }
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  venue?: Venue; // Full venue object for rich popups
  isDistributionPoint?: boolean; // Highlight for beneficiaries
}

interface LeafletMapProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (marker: MapMarker) => void;
  userLocation?: { lat: number; lng: number } | null;
  highlightDistributionPoints?: boolean; // For beneficiary view
  showETA?: boolean; // Show estimated time to reach
}

export default function LeafletMap({
  markers = [],
  center = [35.1264, 33.4299], // Кипр - Никосия по умолчанию
  zoom = 13,
  onMarkerClick,
  userLocation,
  highlightDistributionPoints = false,
  showETA = false,
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const isInitialized = useRef(false);

  // Инициализация карты
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mapContainerRef.current) return;
    if (isInitialized.current) return;

    // Исправляем иконки
    fixLeafletIcons();

    try {
      // Создаем карту
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        attributionControl: true,
      });

      // Добавляем тайлы OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        minZoom: 3,
      }).addTo(map);

      // Создаем слой для маркеров
      markersLayerRef.current = L.layerGroup().addTo(map);

      mapRef.current = map;
      isInitialized.current = true;

      console.log('Карта инициализирована успешно');

      // Обработка изменения размера
      setTimeout(() => {
        if (map) {
          map.invalidateSize();
        }
      }, 100);
    } catch (error) {
      console.error('Ошибка инициализации карты:', error);
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (error) {
          console.error('Ошибка при удалении карты:', error);
        }
        mapRef.current = null;
        isInitialized.current = false;
      }
    };
  }, []); // Только при первом рендере

  // Обновление маркеров
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    try {
      // Очищаем предыдущие маркеры
      markersLayerRef.current.clearLayers();

      // Добавляем новые маркеры
      markers.forEach((markerData) => {
        // Create custom icon for distribution points if highlighted
        let markerIcon = undefined;
        if (highlightDistributionPoints && markerData.isDistributionPoint) {
          markerIcon = L.divIcon({
            className: 'distribution-point-marker',
            html: `
              <div style="position: relative; width: 32px; height: 32px;">
                <div style="
                  width: 32px;
                  height: 32px;
                  background-color: #10b981;
                  border: 3px solid white;
                  border-radius: 50% 50% 50% 0;
                  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);
                  transform: rotate(-45deg);
                "></div>
                <div style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  color: white;
                  font-size: 18px;
                  font-weight: bold;
                  z-index: 10;
                ">📦</div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          });
        }

        // Build popup content
        let popupContent = `
          <div style="padding: 8px; min-width: 200px; max-width: 300px;">
            <h3 style="font-weight: bold; margin-bottom: 4px; color: #18181b; font-size: 14px;">${markerData.title}</h3>
            <p style="color: #52525b; margin: 0 0 8px 0; font-size: 12px;">${markerData.description}</p>
        `;

        // Add ETA if user location is available and showETA is true
        if (showETA && userLocation) {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            markerData.lat,
            markerData.lng
          );
          const eta = calculateETA(distance);
          popupContent += `
            <div style="padding: 4px 8px; background: #f4f4f5; border-radius: 4px; margin-bottom: 8px;">
              <span style="font-size: 11px; color: #71717a;">📍 ${distance.toFixed(1)} km · ⏱️ ${eta}</span>
            </div>
          `;
        }

        // Add functions if venue data is available
        if (markerData.venue && markerData.venue.functions.length > 0) {
          popupContent += `<div style="margin-top: 8px;">`;
          popupContent += `<div style="font-size: 11px; font-weight: 600; color: #71717a; margin-bottom: 4px; text-transform: uppercase;">Functions</div>`;
          
          markerData.venue.functions.forEach((func) => {
            let functionLabel = '';
            let functionDetails = '';
            
            if (func.type === 'collection_point') {
              functionLabel = '📥 Collection Point';
              const itemCount = func.items?.length || 0;
              functionDetails = itemCount > 0 ? `${itemCount} items needed` : '';
            } else if (func.type === 'distribution_point') {
              functionLabel = '📦 Distribution Point';
              const itemCount = func.items?.length || 0;
              functionDetails = itemCount > 0 ? `${itemCount} items available` : '';
            } else if (func.type === 'services_needed') {
              functionLabel = '🤝 Services Needed';
              const serviceCount = func.services?.length || 0;
              functionDetails = serviceCount > 0 ? `${serviceCount} services` : '';
            } else if (func.type === 'custom') {
              functionLabel = `✨ ${func.customTypeName}`;
            }
            
            popupContent += `
              <div style="font-size: 11px; padding: 4px 8px; background: #e4e4e7; border-radius: 4px; margin-bottom: 4px; color: #27272a;">
                <div style="font-weight: 600;">${functionLabel}</div>
                ${functionDetails ? `<div style="color: #52525b; margin-top: 2px;">${functionDetails}</div>` : ''}
              </div>
            `;
          });
          
          popupContent += `</div>`;
        }

        popupContent += `</div>`;

        const marker = L.marker([markerData.lat, markerData.lng], markerIcon ? { icon: markerIcon } : undefined)
          .bindPopup(popupContent)
          .on('click', () => {
            if (onMarkerClick) {
              onMarkerClick(markerData);
            }
          });

        if (markersLayerRef.current) {
          marker.addTo(markersLayerRef.current);
        }
      });

      console.log(`Добавлено маркеров: ${markers.length}`);
    } catch (error) {
      console.error('Ошибка при обновлении маркеров:', error);
    }
  }, [markers, onMarkerClick, highlightDistributionPoints, showETA, userLocation]);

  // Обновление местоположения пользователя
  useEffect(() => {
    if (!mapRef.current) return;

    try {
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
            <div style="position: relative; width: 20px; height: 20px;">
              <div style="
                width: 20px;
                height: 20px;
                background-color: #3b82f6;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
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
        mapRef.current.setView([userLocation.lat, userLocation.lng], 15, {
          animate: true,
          duration: 1,
        });

        console.log('Местоположение пользователя установлено:', userLocation);
      }
    } catch (error) {
      console.error('Ошибка при обновлении местоположения пользователя:', error);
    }
  }, [userLocation]);

  return (
    <>
      <div 
        ref={mapContainerRef} 
        className="w-full h-full z-0"
        style={{ minHeight: '400px' }}
      />
      <style jsx global>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          z-index: 0;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
        
        .leaflet-popup-tip {
          display: none;
        }
        
        .user-location-marker {
          background: transparent;
          border: none;
        }
      `}</style>
    </>
  );
}
