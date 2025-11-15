'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Plus, Check } from 'lucide-react';
import type { ItemCategory, CategoryHierarchy } from '@/types/item-category';
import type { ItemWithQuantity } from '@/types/venue';
import { fetchCategoryHierarchy, getCategoryPath } from '@/lib/api/item-categories';

interface ItemCategoryTreePickerProps {
  selectedItems: ItemWithQuantity[];
  onItemsChange: (items: ItemWithQuantity[]) => void;
}

interface TreeNodeProps {
  node: CategoryHierarchy;
  level: number;
  selectedItems: ItemWithQuantity[];
  onAddItem: (category: ItemCategory) => void;
  expandAll: boolean;
}

function TreeNode({ node, level, selectedItems, onAddItem, expandAll }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const isSelected = selectedItems.some(item => item.categoryId === node.category.id);
  const paddingClass = `pl-${level * 4}`;

  useEffect(() => {
    setIsExpanded(expandAll);
  }, [expandAll]);

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 ${paddingClass} hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded transition-colors group`}
      >
        {/* Expand/Collapse Button */}
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}

        {/* Category Name */}
        <div className="flex-1 flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {node.category.name}
          </span>
          {node.category.description && (
            <span className="text-xs text-zinc-500 dark:text-zinc-500 hidden group-hover:inline">
              {node.category.description}
            </span>
          )}
        </div>

        {/* Add Button (only for leaf nodes) */}
        {!hasChildren && (
          <button
            type="button"
            onClick={() => onAddItem(node.category)}
            disabled={isSelected}
            className={`p-1.5 rounded-lg transition-all ${
              isSelected
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-not-allowed'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
            title={isSelected ? 'Already added' : 'Add item'}
          >
            {isSelected ? (
              <Check className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Children count */}
        {hasChildren && (
          <span className="text-xs text-zinc-500 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
            {node.children.length}
          </span>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.category.id}
              node={child}
              level={level + 1}
              selectedItems={selectedItems}
              onAddItem={onAddItem}
              expandAll={expandAll}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ItemCategoryTreePicker({ selectedItems, onItemsChange }: ItemCategoryTreePickerProps) {
  const [hierarchy, setHierarchy] = useState<CategoryHierarchy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandAll, setExpandAll] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    const data = await fetchCategoryHierarchy();
    setHierarchy(data);
    setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category Tree Browser */}
      <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Browse Categories
          </h3>
          <button
            type="button"
            onClick={() => setExpandAll(!expandAll)}
            className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline"
          >
            {expandAll ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
        
        <div className="p-4 max-h-[500px] overflow-y-auto">
          <div className="space-y-1">
            {hierarchy.map((node) => (
              <TreeNode
                key={node.category.id}
                node={node}
                level={0}
                selectedItems={selectedItems}
                onAddItem={addItem}
                expandAll={expandAll}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

