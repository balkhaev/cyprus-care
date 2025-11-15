/**
 * Mediterranean Relief UI - Map Marker Styles
 * Orange markers for collection points
 * Blue markers for distribution points
 * Green markers for services
 */

export const mapMarkerColors = {
  collection: {
    primary: '#E36414', // Deep orange - fire, urgency
    label: 'Пункт сбора',
  },
  distribution: {
    primary: '#1E88E5', // Safe blue - trust, calm
    label: 'Пункт распределения',
  },
  service: {
    primary: '#4CAF50', // Olive green - hope, nature
    label: 'Сервис',
  },
  emergency: {
    primary: '#D32F2F', // Fire red - error/urgent
    label: 'Экстренная помощь',
  },
};

export type MarkerType = keyof typeof mapMarkerColors;

/**
 * Creates a custom Leaflet DivIcon with Mediterranean Relief UI styling
 */
export function createCustomMarker(type: MarkerType = 'collection') {
  const color = mapMarkerColors[type].primary;
  
  return `
    <div style="
      background: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 12px;
        height: 12px;
        background: white;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `;
}

/**
 * Map theme configuration for Leaflet
 */
export const mapTheme = {
  // Tile layer with warm tones
  tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  
  // Default view settings
  defaultCenter: { lat: 34.9176, lng: 33.4062 } as const, // Cyprus center
  defaultZoom: 10,
  
  // Style overrides for Mediterranean feel
  style: {
    zIndex: 0,
    backgroundColor: '#F9F5F1', // Warm white background
  },
};

/**
 * Marker cluster colors for different types
 */
export const clusterColors = {
  collection: 'bg-primary text-primary-foreground',
  distribution: 'bg-secondary text-secondary-foreground',
  service: 'bg-accent text-accent-foreground',
  emergency: 'bg-destructive text-white',
};

