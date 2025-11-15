'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import type { VenueFunctionType, ItemWithQuantity, ServiceRequest, OperatingHours } from '@/types/venue';
import type { Venue } from '@/types/venue';
import { fetchVenueById } from '@/lib/api/venues';
import { addFunctionToVenue } from '@/lib/api/venue-functions';
import FunctionSelector from '@/components/venue-functions/FunctionSelector';
import ItemCategoryTreePicker from '@/components/venue-functions/ItemCategoryTreePicker';
import ServiceSelector from '@/components/venue-functions/ServiceSelector';

const defaultOperatingHours: OperatingHours[] = [
  { dayOfWeek: 'Monday', openTime: '09:00', closeTime: '18:00', isClosed: false },
  { dayOfWeek: 'Tuesday', openTime: '09:00', closeTime: '18:00', isClosed: false },
  { dayOfWeek: 'Wednesday', openTime: '09:00', closeTime: '18:00', isClosed: false },
  { dayOfWeek: 'Thursday', openTime: '09:00', closeTime: '18:00', isClosed: false },
  { dayOfWeek: 'Friday', openTime: '09:00', closeTime: '18:00', isClosed: false },
  { dayOfWeek: 'Saturday', openTime: '10:00', closeTime: '16:00', isClosed: false },
  { dayOfWeek: 'Sunday', openTime: '00:00', closeTime: '00:00', isClosed: true },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NewFunctionPage({ params }: PageProps) {
  const router = useRouter();
  const [venueId, setVenueId] = useState<string>('');
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedType, setSelectedType] = useState<VenueFunctionType | null>(null);
  const [selectedItems, setSelectedItems] = useState<ItemWithQuantity[]>([]);
  const [selectedServices, setSelectedServices] = useState<ServiceRequest[]>([]);
  const [openingTimes, setOpeningTimes] = useState<OperatingHours[]>(defaultOperatingHours);
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    params.then(async (resolvedParams) => {
      setVenueId(resolvedParams.id);
      const venueData = await fetchVenueById(resolvedParams.id);
      setVenue(venueData);
      setIsLoading(false);
    });
  }, [params]);

  const handleOperatingHoursChange = (index: number, field: keyof OperatingHours, value: string | boolean) => {
    const newHours = [...openingTimes];
    newHours[index] = { ...newHours[index], [field]: value };
    setOpeningTimes(newHours);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    setIsSubmitting(true);

    try {
      switch (selectedType) {
        case 'collection_point':
          await addFunctionToVenue(venueId, {
            type: 'collection_point',
            items: selectedItems,
            openingTimes,
            specialRequests: specialRequests || undefined,
          });
          break;
        case 'distribution_point':
          await addFunctionToVenue(venueId, {
            type: 'distribution_point',
            items: selectedItems,
            openingTimes,
            specialRequests: specialRequests || undefined,
          });
          break;
        case 'services_needed':
          await addFunctionToVenue(venueId, {
            type: 'services_needed',
            services: selectedServices,
            specialRequests: specialRequests || undefined,
          });
          break;
      }

      router.push(`/venues/${venueId}`);
    } catch (error) {
      console.error('Error adding function:', error);
      alert('Failed to add function. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Loading...</p>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Venue Not Found
          </h2>
          <Link
            href="/venues"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Back to Venues
          </Link>
        </div>
      </div>
    );
  }

  const canSubmit = selectedType && (
    (selectedType === 'services_needed' && selectedServices.length > 0) ||
    ((selectedType === 'collection_point' || selectedType === 'distribution_point') && selectedItems.length > 0)
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/venues/${venueId}`}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Add Function
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {venue.title}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Select Function Type */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Select Function Type
            </h2>
            <FunctionSelector
              onSelect={setSelectedType}
              selectedType={selectedType || undefined}
              hideCustom={true}
            />
          </div>

          {/* Function Configuration */}
          {selectedType && selectedType !== 'custom' && (
            <>
              {/* Items Configuration (for collection/distribution) */}
              {(selectedType === 'collection_point' || selectedType === 'distribution_point') && (
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                    {selectedType === 'collection_point' ? 'Items to Collect' : 'Items to Distribute'}
                  </h2>
                  <ItemCategoryTreePicker
                    selectedItems={selectedItems}
                    onItemsChange={setSelectedItems}
                  />
                </div>
              )}

              {/* Services Configuration (for services_needed) */}
              {selectedType === 'services_needed' && (
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                    Services Needed
                  </h2>
                  <ServiceSelector
                    selectedServices={selectedServices}
                    onServicesChange={setSelectedServices}
                  />
                </div>
              )}

              {/* Opening Times (not for services_needed) */}
              {selectedType !== 'services_needed' && (
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                    Opening Times
                  </h2>
                  <div className="space-y-3">
                    {openingTimes.map((hours, index) => (
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
                            <span className="text-sm text-zinc-500 dark:text-zinc-500">Closed</span>
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
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">Closed</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Requests */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  Special Requests (Optional)
                </h2>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any special instructions or requirements..."
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none"
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href={`/venues/${venueId}`}
              className="px-6 py-3 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg font-medium transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white dark:border-zinc-900 border-t-transparent"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Add Function
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

