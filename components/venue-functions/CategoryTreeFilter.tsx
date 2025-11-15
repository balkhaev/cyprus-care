'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, X } from 'lucide-react';
import type { CategoryHierarchy, ItemCategory } from '@/types/item-category';
import { fetchCategoryHierarchy } from '@/lib/api/item-categories';

interface CategoryTreeFilterProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export default function CategoryTreeFilter({ selectedCategories, onCategoriesChange, onClose, showCloseButton = false }: CategoryTreeFilterProps) {
  const [hierarchy, setHierarchy] = useState<CategoryHierarchy[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    const data = await fetchCategoryHierarchy();
    setHierarchy(data);
    setIsLoading(false);
  };

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleCategory = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    onCategoriesChange(newSelected);
  };

  const renderCategoryNode = (node: CategoryHierarchy, level: number = 0) => {
    const isExpanded = expandedCategories.has(node.category.id);
    const isSelected = selectedCategories.includes(node.category.id);
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.category.id} className="select-none">
        <div
          className={`flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors ${
            isSelected ? 'bg-zinc-100 dark:bg-zinc-800' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.category.id);
              }}
              className="p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}
          
          <label className="flex items-center gap-2 flex-1 cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleCategory(node.category.id)}
              className="w-3.5 h-3.5 rounded border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
            <span className="text-sm text-zinc-900 dark:text-zinc-100 font-medium">
              {node.category.name}
            </span>
          </label>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children.map(child => renderCategoryNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Sort by:
          </h3>
          {selectedCategories.length > 0 && (
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">
              {selectedCategories.length} selected
            </p>
          )}
        </div>
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
          </button>
        )}
      </div>

      {/* Categories Tree */}
      <div className="max-h-96 overflow-y-auto p-2">
        {hierarchy.map(node => renderCategoryNode(node))}
      </div>

      {/* Footer Actions */}
      {selectedCategories.length > 0 && (
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
          <button
            onClick={() => onCategoriesChange([])}
            className="flex-1 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}

