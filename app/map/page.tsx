'use client';

import { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, Menu, X, User } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import of map component to avoid SSR issues
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Loading map...</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Please wait</p>
      </div>
    </div>
  ),
});

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
}

export default function MapPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Example markers (replace with real data from API)
  const markers: MapMarker[] = [
    {
      id: '1',
      lat: 55.7558,
      lng: 37.6173,
      title: 'Red Square',
      description: 'Main square of Moscow',
    },
    {
      id: '2',
      lat: 55.7539,
      lng: 37.6208,
      title: 'GUM',
      description: 'Main department store',
    },
    {
      id: '3',
      lat: 55.7520,
      lng: 37.6175,
      title: 'Saint Basil\'s Cathedral',
      description: 'Cathedral of the Intercession',
    },
    {
      id: '4',
      lat: 55.7516,
      lng: 37.6184,
      title: 'Kremlin',
      description: 'Moscow Kremlin',
    },
  ];

  // Get user geolocation on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    }
  }, []);

  // Mark map as loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(newLocation);
          console.log('Your location:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          alert('Unable to get your location. Please allow geolocation access.');
        }
      );
    } else {
      alert('Your browser does not support geolocation');
    }
  };

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
    console.log('Selected marker:', marker);
  };

  const handleBuildRoute = () => {
    if (selectedMarker) {
      alert(`Building route to: ${selectedMarker.title}`);
      // Add route building logic here
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-[1000] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
            <span className="font-bold text-xl text-zinc-900 dark:text-zinc-100">
              Care Map
            </span>
          </Link>

          {/* Search (desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search on map..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
              />
            </div>
          </div>

          {/* Menu (desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <User className="h-5 w-5" />
              <span>Sign In</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-zinc-900 dark:text-zinc-100"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-4">
            {/* Search (mobile) */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search on map..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>

            {/* Links */}
            <Link 
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <User className="h-5 w-5" />
              <span>Sign In</span>
            </Link>
          </div>
        )}
      </header>

      {/* Main map area */}
      <div className="h-full w-full pt-[60px]">
        {isMapLoaded && (
          <LeafletMap
            markers={markers}
            center={[55.7558, 37.6173]}
            zoom={13}
            onMarkerClick={handleMarkerClick}
            userLocation={userLocation}
          />
        )}

        {/* Selected marker info */}
        {selectedMarker && (
          <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-4 z-[1000] animate-slide-up">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  {selectedMarker.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {selectedMarker.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedMarker(null)}
                className="p-1 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleBuildRoute}
                className="flex-1 px-3 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Build Route
              </button>
              <button className="px-3 py-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors">
                Details
              </button>
            </div>
          </div>
        )}

        {/* "My Location" button */}
        <button
          onClick={handleLocateMe}
          className="absolute right-6 p-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all z-[999] hover:scale-110"
          style={{ 
            bottom: selectedMarker ? 'calc(24px + 160px)' : '24px',
            transition: 'bottom 0.3s ease'
          }}
          title="My Location"
          aria-label="My Location"
        >
          <Navigation className="h-6 w-6" />
        </button>

        {/* Location indicator */}
        {userLocation && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-full shadow-lg z-[999]">
            Location detected
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
