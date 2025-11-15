// Item category hierarchy types

export interface ItemCategory {
  id: string;
  name: string;
  description?: string;
  parentId: string | null; // null for root categories
  level: number; // 0 = root, 1 = first level, 2 = second level, etc.
  organizerId?: string; // If created by organizer (custom category)
  isCustom: boolean; // true if created by organizer
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryHierarchy {
  category: ItemCategory;
  children: CategoryHierarchy[];
}

export interface CategoryFormData {
  name: string;
  description?: string;
  parentId: string | null;
}

// Helper type for displaying category path
export interface CategoryPath {
  categoryId: string;
  path: string[]; // e.g., ['Medicine', 'Painkillers', 'Nurofen']
}

// Predefined root categories
export const DEFAULT_CATEGORIES = [
  'Medicine',
  'Food',
  'Clothing',
  'Hygiene',
  'Other'
] as const;

export type DefaultCategoryType = typeof DEFAULT_CATEGORIES[number];

