'use client';

import Link from 'next/link';
import { Package, Truck, Users, Edit, Trash2, Clock, AlertCircle, Car, Languages, Briefcase, Laptop } from 'lucide-react';
import type { VenueFunction, ServiceType } from '@/types/venue';

const quantityLabels: Record<string, { label: string; color: string }> = {
  a_lot: { label: 'A lot', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  some: { label: 'Some', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
  few: { label: 'Few', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
};

const serviceIcons: Record<ServiceType, React.ReactNode> = {
  transport_big: <Truck className="h-4 w-4" />,
  transport_small: <Car className="h-4 w-4" />,
  carrying: <Users className="h-4 w-4" />,
  language: <Languages className="h-4 w-4" />,
  admin: <Briefcase className="h-4 w-4" />,
  tech: <Laptop className="h-4 w-4" />,
};

const serviceLabels: Record<ServiceType, string> = {
  transport_big: 'Large Transport',
  transport_small: 'Small Transport',
  carrying: 'Carrying / Heavy Lifting',
  language: 'Language Skills',
  admin: 'Admin Help',
  tech: 'Tech Support',
};

interface FunctionCardProps {
  venueFunction: VenueFunction;
  venueId?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export default function FunctionCard({ venueFunction, venueId, onEdit, onDelete, showActions = true }: FunctionCardProps) {
  const getFunctionIcon = () => {
    switch (venueFunction.type) {
      case 'collection_point':
        return <Package className="h-5 w-5" />;
      case 'distribution_point':
        return <Truck className="h-5 w-5" />;
      case 'services_needed':
        return <Users className="h-5 w-5" />;
      case 'custom':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getFunctionTitle = () => {
    switch (venueFunction.type) {
      case 'collection_point':
        return 'Collection Point';
      case 'distribution_point':
        return 'Distribution Point';
      case 'services_needed':
        return 'Services Needed';
      case 'custom':
        return venueFunction.customTypeName;
      default:
        return 'Function';
    }
  };

  const getTodayHours = () => {
    if (venueFunction.type === 'services_needed') return null;
    if (venueFunction.type === 'custom' && !venueFunction.openingTimes) return null;

    const openingTimes = venueFunction.type === 'custom' 
      ? venueFunction.openingTimes 
      : venueFunction.openingTimes;

    if (!openingTimes) return null;

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const hours = openingTimes.find(h => h.dayOfWeek === today);

    if (!hours || hours.isClosed) {
      return { text: 'Closed today', isOpen: false };
    }

    return { text: `${hours.openTime} - ${hours.closeTime}`, isOpen: true };
  };

  const todayHours = getTodayHours();

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300">
              {getFunctionIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
                {getFunctionTitle()}
              </h3>
              {todayHours && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  <span
                    className={`text-sm ${
                      todayHours.isOpen
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-zinc-500 dark:text-zinc-500'
                    }`}
                  >
                    {todayHours.text}
                  </span>
                </div>
              )}
            </div>
          </div>

          {showActions && (
            <div className="flex items-center gap-2">
              {venueId && (
                <Link
                  href={`/venues/${venueId}/functions/${venueFunction.id}/edit`}
                  className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  aria-label="Edit function"
                >
                  <Edit className="h-4 w-4" />
                </Link>
              )}
              {onEdit && !venueId && (
                <button
                  onClick={onEdit}
                  className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  aria-label="Edit function"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                  aria-label="Delete function"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Collection/Distribution Items */}
        {(venueFunction.type === 'collection_point' || venueFunction.type === 'distribution_point') && (
          <div>
            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Items ({venueFunction.items.length})
            </h4>
            <div className="space-y-2">
              {venueFunction.items.slice(0, 5).map((item) => {
                const quantityInfo = quantityLabels[item.quantity];
                return (
                  <div
                    key={item.categoryId}
                    className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {item.categoryPath[item.categoryPath.length - 1]}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-500 truncate">
                        {item.categoryPath.slice(0, -1).join(' → ')}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${quantityInfo.color}`}
                    >
                      {quantityInfo.label}
                    </span>
                  </div>
                );
              })}
              {venueFunction.items.length > 5 && (
                <p className="text-xs text-zinc-500 dark:text-zinc-500 text-center">
                  +{venueFunction.items.length - 5} more items
                </p>
              )}
            </div>
          </div>
        )}

        {/* Services */}
        {venueFunction.type === 'services_needed' && (
          <div>
            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Services Required ({venueFunction.services.length})
            </h4>
            <div className="space-y-2">
              {venueFunction.services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                >
                  <div className="p-1.5 bg-zinc-200 dark:bg-zinc-700 rounded text-zinc-700 dark:text-zinc-300">
                    {serviceIcons[service.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {serviceLabels[service.type]}
                      </p>
                      {service.isRequired && (
                        <span className="px-1.5 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    {service.description && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                        {service.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Function Items/Services */}
        {venueFunction.type === 'custom' && (
          <div className="space-y-3">
            {venueFunction.customTypeDescription && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {venueFunction.customTypeDescription}
              </p>
            )}
            {venueFunction.items && venueFunction.items.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Items ({venueFunction.items.length})
                </h4>
                <div className="text-xs text-zinc-500 dark:text-zinc-500">
                  {venueFunction.items.map(i => i.categoryPath[i.categoryPath.length - 1]).join(', ')}
                </div>
              </div>
            )}
            {venueFunction.services && venueFunction.services.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Services ({venueFunction.services.length})
                </h4>
                <div className="text-xs text-zinc-500 dark:text-zinc-500">
                  {venueFunction.services.map(s => serviceLabels[s.type]).join(', ')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Special Requests */}
        {venueFunction.specialRequests && (
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Special Requests
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {venueFunction.specialRequests}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

