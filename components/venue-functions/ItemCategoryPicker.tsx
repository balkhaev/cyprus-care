'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, X } from 'lucide-react';
import type { ItemCategory, CategoryHierarchy } from '@/types/item-category';
import type { ItemWithQuantity, QuantityLevel } from '@/types/venue';
import { fetchCategoryHierarchy, getCategoryPath } from '@/lib/api/item-categories';

interface ItemCategoryPickerProps {
  selectedItems: ItemWithQuantity[];
  onItemsChange: (items: ItemWithQuantity[]) => void;
}

const quantityLevels: { value: QuantityLevel; label: string; color: string }[] = [
  { value: 'a_lot', label: 'A lot', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  { value: 'some', label: 'Some', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
  { value: 'few', label: 'Few', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
];

export default function ItemCategoryPicker({ selectedItems, onItemsChange }: ItemCategoryPickerProps) {
  const [hierarchy, setHierarchy] = useState<CategoryHierarchy[]>([]);
  const [currentLevel, setCurrentLevel] = useState<CategoryHierarchy[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<CategoryHierarchy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    const data = await fetchCategoryHierarchy();
    setHierarchy(data);
    setCurrentLevel(data);
    setIsLoading(false);
  };

  const handleCategoryClick = (categoryNode: CategoryHierarchy) => {
    if (categoryNode.children.length > 0) {
      // Has children, navigate deeper
      setBreadcrumb([...breadcrumb, categoryNode]);
      setCurrentLevel(categoryNode.children);
    } else {
      // Leaf node, add to selected items
      addItem(categoryNode.category);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      // Go to root
      setBreadcrumb([]);
      setCurrentLevel(hierarchy);
    } else {
      // Go to specific level
      const newBreadcrumb = breadcrumb.slice(0, index + 1);
      setBreadcrumb(newBreadcrumb);
      setCurrentLevel(newBreadcrumb[newBreadcrumb.length - 1].children);
    }
  };

  const addItem = async (category: ItemCategory) => {
    // Check if already added
    if (selectedItems.some(item => item.categoryId === category.id)) {
      return;
    }

    const path = await getCategoryPath(category.id);
    const newItem: ItemWithQuantity = {
      categoryId: category.id,
      categoryPath: path,
      quantity: 'some', // Default quantity
    };

    onItemsChange([...selectedItems, newItem]);
  };

  const removeItem = (categoryId: string) => {
    onItemsChange(selectedItems.filter(item => item.categoryId !== categoryId));
  };

  const updateQuantity = (categoryId: string, quantity: QuantityLevel) => {
    onItemsChange(
      selectedItems.map(item =>
        item.categoryId === categoryId ? { ...item, quantity } : item
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category Browser */}
      <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-3 text-sm flex-wrap">
          <button
            type="button"
            onClick={() => handleBreadcrumbClick(-1)}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium"
          >
            All Categories
          </button>
          {breadcrumb.map((node, index) => (
            <div key={node.category.id} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-zinc-400" />
              <button
                type="button"
                onClick={() => handleBreadcrumbClick(index)}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium"
              >
                {node.category.name}
              </button>
            </div>
          ))}
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {currentLevel.map((node) => (
            <button
              key={node.category.id}
              type="button"
              onClick={() => handleCategoryClick(node)}
              className="p-3 text-left rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {node.category.name}
                </span>
                {node.children.length > 0 && (
                  <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                )}
              </div>
              {node.category.description && (
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1 line-clamp-2">
                  {node.category.description}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Items */}
      {selectedItems.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Selected Items ({selectedItems.length})
          </h4>
          <div className="space-y-2">
            {selectedItems.map((item) => (
              <div
                key={item.categoryId}
                className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {item.categoryPath[item.categoryPath.length - 1]}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    {item.categoryPath.slice(0, -1).join(' → ')}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="flex gap-1">
                  {quantityLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => updateQuantity(item.categoryId, level.value)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                        item.quantity === level.value
                          ? level.color
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeItem(item.categoryId)}
                  className="p-1 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  aria-label="Remove item"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

