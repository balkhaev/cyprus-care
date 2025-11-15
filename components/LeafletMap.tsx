'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

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
  center = [35.1264, 33.4299], // Кипр - Никосия по умолчанию
  zoom = 13,
  onMarkerClick,
  userLocation,
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
        const marker = L.marker([markerData.lat, markerData.lng])
          .bindPopup(`
            <div style="padding: 8px; min-width: 150px;">
              <h3 style="font-weight: bold; margin-bottom: 4px; color: #18181b; font-size: 14px;">${markerData.title}</h3>
              <p style="color: #52525b; margin: 0; font-size: 12px;">${markerData.description}</p>
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

      console.log(`Добавлено маркеров: ${markers.length}`);
    } catch (error) {
      console.error('Ошибка при обновлении маркеров:', error);
    }
  }, [markers, onMarkerClick]);

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
