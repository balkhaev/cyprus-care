import type { ItemCategory, CategoryHierarchy } from '@/types/item-category';

// Mock item categories with hierarchy
export const mockCategories: ItemCategory[] = [
  // Root: Medicine
  {
    id: 'cat-1',
    name: 'Medicine',
    description: 'Medical supplies and pharmaceuticals',
    parentId: null,
    level: 0,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-1-1',
    name: 'Painkillers',
    description: 'Pain relief medications',
    parentId: 'cat-1',
    level: 1,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-1-1-1',
    name: 'Nurofen',
    parentId: 'cat-1-1',
    level: 2,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-1-1-2',
    name: 'Paracetamol',
    parentId: 'cat-1-1',
    level: 2,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-1-2',
    name: 'Antibiotics',
    description: 'Antibiotic medications',
    parentId: 'cat-1',
    level: 1,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-1-2-1',
    name: 'Amoxicillin',
    parentId: 'cat-1-2',
    level: 2,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-1-3',
    name: 'First Aid',
    description: 'First aid supplies',
    parentId: 'cat-1',
    level: 1,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-1-3-1',
    name: 'Bandages',
    parentId: 'cat-1-3',
    level: 2,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-1-3-2',
    name: 'Antiseptics',
    parentId: 'cat-1-3',
    level: 2,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  // Root: Food
  {
    id: 'cat-2',
    name: 'Food',
    description: 'Food supplies',
    parentId: null,
    level: 0,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-2-1',
    name: 'Canned Food',
    parentId: 'cat-2',
    level: 1,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-2-1-1',
    name: 'Canned Vegetables',
    parentId: 'cat-2-1',
    level: 2,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-2-1-2',
    name: 'Canned Meat',
    parentId: 'cat-2-1',
    level: 2,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-2-2',
    name: 'Dry Goods',
    parentId: 'cat-2',
    level: 1,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-2-2-1',
    name: 'Rice',
    parentId: 'cat-2-2',
    level: 2,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-2-2-2',
    name: 'Pasta',
    parentId: 'cat-2-2',
    level: 2,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-2-3',
    name: 'Baby Food',
    parentId: 'cat-2',
    level: 1,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  // Root: Clothing
  {
    id: 'cat-3',
    name: 'Clothing',
    description: 'Clothing items',
    parentId: null,
    level: 0,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-3-1',
    name: 'Winter Clothing',
    parentId: 'cat-3',
    level: 1,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-3-1-1',
    name: 'Winter Jackets',
    parentId: 'cat-3-1',
    level: 2,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-3-1-2',
    name: 'Blankets',
    parentId: 'cat-3-1',
    level: 2,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-3-2',
    name: 'Summer Clothing',
    parentId: 'cat-3',
    level: 1,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-3-3',
    name: 'Children Clothing',
    parentId: 'cat-3',
    level: 1,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  // Root: Hygiene
  {
    id: 'cat-4',
    name: 'Hygiene',
    description: 'Hygiene products',
    parentId: null,
    level: 0,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-4-1',
    name: 'Personal Care',
    parentId: 'cat-4',
    level: 1,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-4-1-1',
    name: 'Soap',
    parentId: 'cat-4-1',
    level: 2,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-4-1-2',
    name: 'Shampoo',
    parentId: 'cat-4-1',
    level: 2,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-4-1-3',
    name: 'Toothpaste',
    parentId: 'cat-4-1',
    level: 2,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-4-2',
    name: 'Diapers',
    parentId: 'cat-4',
    level: 1,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-4-3',
    name: 'Feminine Products',
    parentId: 'cat-4',
    level: 1,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  // Root: Other
  {
    id: 'cat-5',
    name: 'Other',
    description: 'Other supplies',
    parentId: null,
    level: 0,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-5-1',
    name: 'Batteries',
    parentId: 'cat-5',
    level: 1,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-5-2',
    name: 'Flashlights',
    parentId: 'cat-5',
    level: 1,
    isCustom: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Build category hierarchy
export function buildCategoryHierarchy(categories: ItemCategory[]): CategoryHierarchy[] {
  const categoryMap = new Map<string, ItemCategory>();
  const rootCategories: CategoryHierarchy[] = [];

  // Create map of all categories
  categories.forEach(cat => categoryMap.set(cat.id, cat));

  // Build hierarchy
  const buildNode = (category: ItemCategory): CategoryHierarchy => {
    const children = categories
      .filter(c => c.parentId === category.id)
      .map(buildNode);

    return {
      category,
      children,
    };
  };

  // Find root categories and build their trees
  categories
    .filter(cat => cat.parentId === null)
    .forEach(rootCat => {
      rootCategories.push(buildNode(rootCat));
    });

  return rootCategories;
}

export const mockCategoryHierarchy = buildCategoryHierarchy(mockCategories);

// Helper function to get category path
export function getCategoryPath(categoryId: string, categories: ItemCategory[]): string[] {
  const path: string[] = [];
  let currentId: string | null = categoryId;

  while (currentId) {
    const category = categories.find(c => c.id === currentId);
    if (!category) break;
    path.unshift(category.name);
    currentId = category.parentId;
  }

  return path;
}

