'use client';

import { Package, Truck, Users, Plus } from 'lucide-react';
import type { VenueFunctionType } from '@/types/venue';

interface FunctionOption {
  type: VenueFunctionType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const functionOptions: FunctionOption[] = [
  {
    type: 'collection_point',
    label: 'Collection Point',
    description: 'Collect items for distribution',
    icon: <Package className="h-6 w-6" />,
  },
  {
    type: 'distribution_point',
    label: 'Distribution Point',
    description: 'Distribute items to beneficiaries',
    icon: <Truck className="h-6 w-6" />,
  },
  {
    type: 'services_needed',
    label: 'Services Needed',
    description: 'Request volunteer services',
    icon: <Users className="h-6 w-6" />,
  },
  {
    type: 'custom',
    label: 'Custom Function',
    description: 'Create a custom function type',
    icon: <Plus className="h-6 w-6" />,
  },
];

interface FunctionSelectorProps {
  onSelect: (type: VenueFunctionType) => void;
  selectedType?: VenueFunctionType;
  hideCustom?: boolean;
}

export default function FunctionSelector({ onSelect, selectedType, hideCustom = false }: FunctionSelectorProps) {
  const options = hideCustom ? functionOptions.filter(opt => opt.type !== 'custom') : functionOptions;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option) => (
        <button
          key={option.type}
          type="button"
          onClick={() => onSelect(option.type)}
          className={`p-6 rounded-xl border-2 transition-all text-left group hover:shadow-md ${
            selectedType === option.type
              ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800 shadow-md'
              : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-lg transition-colors ${
                selectedType === option.type
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700'
              }`}
            >
              {option.icon}
            </div>
            <div className="flex-1">
              <h3
                className={`font-semibold text-lg mb-1 ${
                  selectedType === option.type
                    ? 'text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-800 dark:text-zinc-200'
                }`}
              >
                {option.label}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {option.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

