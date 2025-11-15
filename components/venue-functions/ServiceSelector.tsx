'use client';

import { Car, Truck, Users, Languages, Briefcase, Laptop } from 'lucide-react';
import type { ServiceType, ServiceRequest } from '@/types/venue';

interface ServiceOption {
  type: ServiceType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const serviceOptions: ServiceOption[] = [
  {
    type: 'transport_big',
    label: 'Large Transport',
    description: 'Big truck or van for moving large quantities',
    icon: <Truck className="h-5 w-5" />,
  },
  {
    type: 'transport_small',
    label: 'Small Transport',
    description: 'Car for local deliveries',
    icon: <Car className="h-5 w-5" />,
  },
  {
    type: 'carrying',
    label: 'Carrying / Heavy Lifting',
    description: 'Strong people needed to carry and lift',
    icon: <Users className="h-5 w-5" />,
  },
  {
    type: 'language',
    label: 'Language Skills',
    description: 'Specialized language knowledge',
    icon: <Languages className="h-5 w-5" />,
  },
  {
    type: 'admin',
    label: 'Admin Help',
    description: 'Administrative and organizational support',
    icon: <Briefcase className="h-5 w-5" />,
  },
  {
    type: 'tech',
    label: 'Tech Support',
    description: 'Technical and IT assistance',
    icon: <Laptop className="h-5 w-5" />,
  },
];

interface ServiceSelectorProps {
  selectedServices: ServiceRequest[];
  onServicesChange: (services: ServiceRequest[]) => void;
}

export default function ServiceSelector({ selectedServices, onServicesChange }: ServiceSelectorProps) {
  const isServiceSelected = (type: ServiceType): boolean => {
    return selectedServices.some(s => s.type === type);
  };

  const getService = (type: ServiceType): ServiceRequest | undefined => {
    return selectedServices.find(s => s.type === type);
  };

  const toggleService = (type: ServiceType) => {
    if (isServiceSelected(type)) {
      // Remove service
      onServicesChange(selectedServices.filter(s => s.type !== type));
    } else {
      // Add service
      const newService: ServiceRequest = {
        type,
        description: '',
        isRequired: false,
      };
      onServicesChange([...selectedServices, newService]);
    }
  };

  const updateServiceDescription = (type: ServiceType, description: string) => {
    onServicesChange(
      selectedServices.map(s =>
        s.type === type ? { ...s, description } : s
      )
    );
  };

  const toggleRequired = (type: ServiceType) => {
    onServicesChange(
      selectedServices.map(s =>
        s.type === type ? { ...s, isRequired: !s.isRequired } : s
      )
    );
  };

  return (
    <div className="space-y-4">
      {serviceOptions.map((option) => {
        const isSelected = isServiceSelected(option.type);
        const service = getService(option.type);

        return (
          <div
            key={option.type}
            className={`rounded-lg border-2 transition-all ${
              isSelected
                ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800'
                : 'border-zinc-200 dark:border-zinc-700'
            }`}
          >
            {/* Service Header */}
            <div className="flex items-start gap-3 p-4">
              <div
                className={`p-2 rounded-lg ${
                  isSelected
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {option.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {option.label}
                  </h4>
                  {isSelected && service?.isRequired && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {option.description}
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleService(option.type)}
                  className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                />
              </label>
            </div>

            {/* Service Details (shown when selected) */}
            {isSelected && (
              <div className="px-4 pb-4 space-y-3 border-t border-zinc-200 dark:border-zinc-700 pt-4">
                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Details / Requirements
                  </label>
                  <textarea
                    value={service?.description || ''}
                    onChange={(e) => updateServiceDescription(option.type, e.target.value)}
                    placeholder={`Describe specific requirements for ${option.label.toLowerCase()}...`}
                    rows={2}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none"
                  />
                </div>

                {/* Required Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={service?.isRequired || false}
                    onChange={() => toggleRequired(option.type)}
                    className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    Mark as required
                  </span>
                </label>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

