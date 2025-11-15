'use client';

import { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, Menu, X, User } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Динамический импорт компонента карты для избежания SSR проблем
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 dark:border-zinc-100 mx-auto mb-4"></div>
        <p className="text-zinc-600 dark:text-zinc-400">Загрузка карты...</p>
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

  // Примеры маркеров (замените на реальные данные из API)
  const markers: MapMarker[] = [
    {
      id: '1',
      lat: 55.7558,
      lng: 37.6173,
      title: 'Красная площадь',
      description: 'Главная площадь Москвы',
    },
    {
      id: '2',
      lat: 55.7539,
      lng: 37.6208,
      title: 'ГУМ',
      description: 'Главный универсальный магазин',
    },
    {
      id: '3',
      lat: 55.7520,
      lng: 37.6175,
      title: 'Храм Василия Блаженного',
      description: 'Собор Покрова Пресвятой Богородицы на Рву',
    },
    {
      id: '4',
      lat: 55.7516,
      lng: 37.6184,
      title: 'Кремль',
      description: 'Московский Кремль',
    },
  ];

  // Получение геолокации пользователя при загрузке
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
          console.error('Ошибка получения геолокации:', error);
        }
      );
    }
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
          console.log('Ваше местоположение:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Ошибка получения геолокации:', error);
          alert('Не удалось получить ваше местоположение. Пожалуйста, разрешите доступ к геолокации.');
        }
      );
    } else {
      alert('Ваш браузер не поддерживает геолокацию');
    }
  };

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
  };

  const handleBuildRoute = () => {
    if (selectedMarker) {
      alert(`Построение маршрута к: ${selectedMarker.title}`);
      // Здесь можно добавить логику построения маршрута
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
      {/* Шапка */}
      <header className="absolute top-0 left-0 right-0 z-[1000] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Логотип */}
          <Link href="/" className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
            <span className="font-bold text-xl text-zinc-900 dark:text-zinc-100">
              Care Map
            </span>
          </Link>

          {/* Поиск (десктоп) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Поиск на карте..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
              />
            </div>
          </div>

          {/* Меню (десктоп) */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <User className="h-5 w-5" />
              <span>Войти</span>
            </Link>
          </div>

          {/* Кнопка мобильного меню */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-zinc-900 dark:text-zinc-100"
            aria-label="Меню"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Мобильное меню */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-4">
            {/* Поиск (мобильный) */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Поиск на карте..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>

            {/* Ссылки */}
            <Link 
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <User className="h-5 w-5" />
              <span>Войти</span>
            </Link>
          </div>
        )}
      </header>

      {/* Основная область карты */}
      <div className="h-full w-full pt-[60px]">
        <LeafletMap
          markers={markers}
          center={[55.7558, 37.6173]}
          zoom={13}
          onMarkerClick={handleMarkerClick}
          userLocation={userLocation}
        />

        {/* Информация о выбранном маркере */}
        {selectedMarker && (
          <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-4 z-[1000]">
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
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleBuildRoute}
                className="flex-1 px-3 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Построить маршрут
              </button>
              <button className="px-3 py-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors">
                Подробнее
              </button>
            </div>
          </div>
        )}

        {/* Кнопка "Моё местоположение" */}
        <button
          onClick={handleLocateMe}
          className="absolute bottom-6 right-6 p-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all z-[999] hover:scale-110"
          style={{ marginBottom: selectedMarker ? '160px' : '0' }}
          title="Моё местоположение"
          aria-label="Моё местоположение"
        >
          <Navigation className="h-6 w-6" />
        </button>

        {/* Индикатор местоположения */}
        {userLocation && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-full shadow-lg z-[999] animate-fade-in">
            Местоположение определено
          </div>
        )}
      </div>
    </div>
  );
}
