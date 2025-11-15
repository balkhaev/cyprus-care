'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, MapPin, Clock, Edit, Trash2, Building2, Warehouse, Home, Phone, Mail } from 'lucide-react';
import type { Venue, VenueType } from '@/types/venue';

// Динамический импорт карты
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100 mx-auto mb-4"></div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Загрузка карты...</p>
      </div>
    </div>
  ),
});

// Временные тестовые данные
const mockVenues: Record<string, Venue> = {
  '1': {
    id: '1',
    title: 'Центральный пункт сбора',
    description: 'Основной пункт сбора гуманитарной помощи в центре города. Здесь принимаются вещи, продукты питания, медикаменты и другая необходимая помощь для нуждающихся.',
    type: 'collection_point',
    location: {
      lat: 55.7558,
      lng: 37.6173,
      address: 'Красная площадь, 1, Москва',
    },
    operatingHours: [
      { dayOfWeek: 'Понедельник', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { dayOfWeek: 'Вторник', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { dayOfWeek: 'Среда', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { dayOfWeek: 'Четверг', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { dayOfWeek: 'Пятница', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { dayOfWeek: 'Суббота', openTime: '10:00', closeTime: '16:00', isClosed: false },
      { dayOfWeek: 'Воскресенье', openTime: '00:00', closeTime: '00:00', isClosed: true },
    ],
    organizerId: 'org-1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
};

const venueTypeIcons: Record<VenueType, React.ReactNode> = {
  collection_point: <Building2 className="h-6 w-6" />,
  distribution_hub: <Warehouse className="h-6 w-6" />,
  shelter: <Home className="h-6 w-6" />,
};

const venueTypeLabels: Record<VenueType, string> = {
  collection_point: 'Пункт сбора',
  distribution_hub: 'Распределительный центр',
  shelter: 'Убежище',
};

const venueTypeDescriptions: Record<VenueType, string> = {
  collection_point: 'Место для сбора гуманитарной помощи',
  distribution_hub: 'Центр для распределения помощи',
  shelter: 'Временное убежище для нуждающихся',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VenueDetailPage({ params }: PageProps) {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    params.then((resolvedParams) => {
      // Симуляция загрузки данных
      setTimeout(() => {
        const venueData = mockVenues[resolvedParams.id];
        setVenue(venueData || null);
        setIsLoading(false);
      }, 500);
    });
  }, [params]);

  const handleDelete = async () => {
    // Логика удаления площадки
    console.log('Удаление площадки:', venue?.id);
    setShowDeleteModal(false);
    // Перенаправление на список
    window.location.href = '/venues';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
            <MapPin className="h-8 w-8 text-zinc-400" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Площадка не найдена
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Запрашиваемая площадка не существует или была удалена
          </p>
          <Link
            href="/venues"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Вернуться к списку
          </Link>
        </div>
      </div>
    );
  }

  const getTodayHours = () => {
    const today = new Date().toLocaleDateString('ru-RU', { weekday: 'long' });
    const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);
    const hours = venue.operatingHours.find(h => h.dayOfWeek === todayCapitalized);
    
    if (!hours || hours.isClosed) {
      return { text: 'Закрыто', isOpen: false };
    }
    
    return { text: `${hours.openTime} - ${hours.closeTime}`, isOpen: true };
  };

  const todayHours = getTodayHours();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Шапка */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/venues"
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {venue.title}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {venueTypeLabels[venue.type]}
                  </span>
                  <span className="text-zinc-400">•</span>
                  <span className={`text-sm font-medium ${todayHours.isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {todayHours.text}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/venues/${venue.id}/edit`}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Редактировать
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Контент */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Тип и описание */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300">
                {venueTypeIcons[venue.type]}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  {venueTypeLabels[venue.type]}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {venueTypeDescriptions[venue.type]}
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Описание
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {venue.description}
              </p>
            </div>
          </div>

          {/* Карта */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Местоположение
            </h2>
            <div className="mb-4">
              <div className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{venue.location.address}</span>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden">
              <LeafletMap
                markers={[{
                  id: venue.id,
                  lat: venue.location.lat,
                  lng: venue.location.lng,
                  title: venue.title,
                  description: venue.description,
                }]}
                center={[venue.location.lat, venue.location.lng]}
                zoom={15}
              />
            </div>
          </div>

          {/* Часы работы */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Часы работы
            </h2>
            <div className="space-y-2">
              {venue.operatingHours.map((hours) => {
                const isToday = new Date().toLocaleDateString('ru-RU', { weekday: 'long' }).charAt(0).toUpperCase() + 
                               new Date().toLocaleDateString('ru-RU', { weekday: 'long' }).slice(1) === hours.dayOfWeek;
                
                return (
                  <div
                    key={hours.dayOfWeek}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isToday ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-zinc-50 dark:bg-zinc-800/50'
                    }`}
                  >
                    <span className={`font-medium ${
                      isToday ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300'
                    }`}>
                      {hours.dayOfWeek}
                      {isToday && (
                        <span className="ml-2 text-xs font-normal text-zinc-600 dark:text-zinc-400">
                          (Сегодня)
                        </span>
                      )}
                    </span>
                    {hours.isClosed ? (
                      <span className="text-sm text-zinc-500 dark:text-zinc-500">Закрыто</span>
                    ) : (
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {hours.openTime} — {hours.closeTime}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Информация о создании */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Дополнительная информация
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-zinc-600 dark:text-zinc-400">Создано:</span>
                <span className="ml-2 text-zinc-900 dark:text-zinc-100 font-medium">
                  {venue.createdAt.toLocaleDateString('ru-RU', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div>
                <span className="text-zinc-600 dark:text-zinc-400">Обновлено:</span>
                <span className="ml-2 text-zinc-900 dark:text-zinc-100 font-medium">
                  {venue.updatedAt.toLocaleDateString('ru-RU', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Модальное окно удаления */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Удалить площадку?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Вы уверены, что хотите удалить площадку "{venue.title}"? Это действие нельзя отменить.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg font-medium hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

