'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Building2, Warehouse, Home, Save } from 'lucide-react';
import type { VenueType, VenueLocation, OperatingHours, Venue } from '@/types/venue';

// Динамический импорт карты
const LocationPickerMap = dynamic(() => import('@/components/LocationPickerMap'), {
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

const venueTypes: Array<{ value: VenueType; label: string; icon: React.ReactNode; description: string }> = [
  {
    value: 'collection_point',
    label: 'Пункт сбора',
    icon: <Building2 className="h-5 w-5" />,
    description: 'Место для сбора гуманитарной помощи',
  },
  {
    value: 'distribution_hub',
    label: 'Распределительный центр',
    icon: <Warehouse className="h-5 w-5" />,
    description: 'Центр для распределения помощи',
  },
  {
    value: 'shelter',
    label: 'Убежище',
    icon: <Home className="h-5 w-5" />,
    description: 'Временное убежище для нуждающихся',
  },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditVenuePage({ params }: PageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [venue, setVenue] = useState<Venue | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'collection_point' as VenueType,
  });

  const [location, setLocation] = useState<VenueLocation>({
    lat: 55.7558,
    lng: 37.6173,
    address: '',
  });

  const [operatingHours, setOperatingHours] = useState<OperatingHours[]>([]);

  useEffect(() => {
    params.then((resolvedParams) => {
      // Симуляция загрузки данных
      setTimeout(() => {
        const venueData = mockVenues[resolvedParams.id];
        if (venueData) {
          setVenue(venueData);
          setFormData({
            title: venueData.title,
            description: venueData.description,
            type: venueData.type,
          });
          setLocation(venueData.location);
          setOperatingHours(venueData.operatingHours);
        }
        setIsLoading(false);
      }, 500);
    });
  }, [params]);

  const handleLocationSelect = (newLocation: VenueLocation) => {
    setLocation(newLocation);
  };

  const handleOperatingHoursChange = (index: number, field: keyof OperatingHours, value: string | boolean) => {
    const newHours = [...operatingHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setOperatingHours(newHours);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Симуляция отправки данных
    await new Promise(resolve => setTimeout(resolve, 1500));

    const updatedVenue = {
      ...venue,
      ...formData,
      location,
      operatingHours,
      updatedAt: new Date(),
    };

    console.log('Обновлена площадка:', updatedVenue);

    // Перенаправление на страницу детального просмотра
    router.push(`/venues/${venue?.id}`);
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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Шапка */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/venues/${venue.id}`}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Редактировать площадку
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {venue.title}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Форма */}
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
          {/* Основная информация */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Основная информация
            </h2>

            {/* Название */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Название площадки *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Например: Центральный пункт сбора"
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
                required
              />
            </div>

            {/* Описание */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Описание *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Опишите назначение и функции площадки..."
                rows={4}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all resize-none"
                required
              />
            </div>

            {/* Тип площадки */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Тип площадки *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {venueTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.type === type.value
                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`${formData.type === type.value ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400'}`}>
                        {type.icon}
                      </div>
                      <span className={`font-medium ${formData.type === type.value ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300'}`}>
                        {type.label}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {type.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Местоположение */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Местоположение
            </h2>

            <LocationPickerMap
              initialLocation={{ lat: location.lat, lng: location.lng }}
              onLocationSelect={handleLocationSelect}
            />

            {/* Адрес */}
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Адрес
              </label>
              <input
                id="address"
                type="text"
                value={location.address}
                onChange={(e) => setLocation({ ...location, address: e.target.value })}
                placeholder="Адрес будет определен автоматически"
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
              />
            </div>
          </div>

          {/* Часы работы */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Часы работы
            </h2>

            <div className="space-y-3">
              {operatingHours.map((hours, index) => (
                <div
                  key={hours.dayOfWeek}
                  className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                >
                  <div className="w-32 flex-shrink-0">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {hours.dayOfWeek}
                    </span>
                  </div>
                  
                  {hours.isClosed ? (
                    <div className="flex-1">
                      <span className="text-sm text-zinc-500 dark:text-zinc-500">Закрыто</span>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center gap-3">
                      <input
                        type="time"
                        value={hours.openTime}
                        onChange={(e) => handleOperatingHoursChange(index, 'openTime', e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                      />
                      <span className="text-zinc-500">—</span>
                      <input
                        type="time"
                        value={hours.closeTime}
                        onChange={(e) => handleOperatingHoursChange(index, 'closeTime', e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                      />
                    </div>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hours.isClosed}
                      onChange={(e) => handleOperatingHoursChange(index, 'isClosed', e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                    />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Закрыто</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href={`/venues/${venue.id}`}
              className="px-6 py-3 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg font-medium transition-colors"
            >
              Отмена
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white dark:border-zinc-900 border-t-transparent"></div>
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Сохранить изменения
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

