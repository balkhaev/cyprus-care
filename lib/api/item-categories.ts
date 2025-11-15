import type { ItemCategory, CategoryHierarchy, CategoryFormData } from '@/types/item-category';
import { mockCategories, buildCategoryHierarchy } from '@/lib/mock-data/item-categories';

// In-memory storage for categories
let categoriesStore: ItemCategory[] = [...mockCategories];

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<ItemCategory[]> {
  await delay();
  return [...categoriesStore];
}

/**
 * Fetch category hierarchy
 */
export async function fetchCategoryHierarchy(): Promise<CategoryHierarchy[]> {
  await delay();
  return buildCategoryHierarchy(categoriesStore);
}

/**
 * Fetch category by ID
 */
export async function fetchCategoryById(id: string): Promise<ItemCategory | null> {
  await delay();
  const category = categoriesStore.find(c => c.id === id);
  return category ? { ...category } : null;
}

// Note: Categories are predefined and read-only
// Organizers cannot create, update, or delete categories

/**
 * Fetch children of a category
 */
export async function fetchCategoryChildren(parentId: string): Promise<ItemCategory[]> {
  await delay();
  return categoriesStore.filter(c => c.parentId === parentId);
}

/**
 * Fetch root categories
 */
export async function fetchRootCategories(): Promise<ItemCategory[]> {
  await delay();
  return categoriesStore.filter(c => c.parentId === null);
}

/**
 * Get category path (breadcrumb)
 */
export async function getCategoryPath(categoryId: string): Promise<string[]> {
  await delay();
  
  const path: string[] = [];
  let currentId: string | null = categoryId;
  
  while (currentId) {
    const category = categoriesStore.find(c => c.id === currentId);
    if (!category) break;
    path.unshift(category.name);
    currentId = category.parentId;
  }
  
  return path;
}

/**
 * Search categories by name
 */
export async function searchCategories(query: string): Promise<ItemCategory[]> {
  await delay();
  
  const lowerQuery = query.toLowerCase();
  return categoriesStore.filter(c => 
    c.name.toLowerCase().includes(lowerQuery) ||
    (c.description?.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Reset categories to initial mock data (for testing)
 */
export function resetCategories(): void {
  categoriesStore = [...mockCategories];
}

