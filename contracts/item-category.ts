/**
 * Контракты для работы с категориями предметов
 */

import { 
  UUID, 
  Timestamp, 
  ApiResponse, 
  EntityStatus 
} from './common';

// === Категория предметов ===

export interface ItemCategory {
  id: UUID;
  name: string;
  description?: string;
  parentId: UUID | null; // null для корневых категорий
  level: number; // 0 = root, 1 = first level, 2 = second level, etc.
  organizerId?: UUID; // Если создана организатором (кастомная категория)
  isCustom: boolean; // true если создана организатором
  status: EntityStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// === Иерархия категорий ===

export interface CategoryHierarchy {
  category: ItemCategory;
  children: CategoryHierarchy[];
}

export interface CategoryPath {
  categoryId: UUID;
  path: string[]; // e.g., ['Medicine', 'Painkillers', 'Nurofen']
  fullPath: ItemCategory[]; // Полная цепочка категорий
}

// === Создание категории ===

export interface CreateItemCategoryRequest {
  name: string;
  description?: string;
  parentId: UUID | null;
}

export interface CreateItemCategoryResponse {
  category: ItemCategory;
  path: string[];
}

// === Обновление категории ===

export interface UpdateItemCategoryRequest {
  categoryId: UUID;
  name?: string;
  description?: string;
  status?: EntityStatus;
  // Изменение родителя (для перемещения в иерархии)
  parentId?: UUID | null;
}

export interface UpdateItemCategoryResponse {
  category: ItemCategory;
  newPath: string[];
}

// === Получение категорий ===

export interface GetItemCategoriesRequest {
  parentId?: UUID | null; // null для корневых, undefined для всех
  organizerId?: UUID; // Фильтр по организатору (для кастомных категорий)
  includeCustom?: boolean; // Включать ли кастомные категории
  status?: EntityStatus;
  level?: number; // Фильтр по уровню
}

export interface GetItemCategoriesResponse {
  categories: ItemCategory[];
  totalCount: number;
}

// === Получение иерархии ===

export interface GetCategoryHierarchyRequest {
  rootId?: UUID | null; // Начальная категория для построения дерева
  organizerId?: UUID; // Включить кастомные категории организатора
  maxDepth?: number; // Максимальная глубина дерева
}

export interface GetCategoryHierarchyResponse {
  hierarchy: CategoryHierarchy[];
}

// === Получение одной категории ===

export interface GetItemCategoryRequest {
  categoryId: UUID;
}

export interface GetItemCategoryResponse {
  category: ItemCategory;
  path: CategoryPath;
  children: ItemCategory[];
  parentChain: ItemCategory[]; // Цепочка родителей до корня
}

// === Поиск категорий ===

export interface SearchCategoriesRequest {
  query: string;
  organizerId?: UUID;
  includeCustom?: boolean;
  limit?: number;
}

export interface SearchCategoriesResponse {
  results: Array<{
    category: ItemCategory;
    path: string[];
    relevanceScore: number;
  }>;
  totalFound: number;
}

// === Удаление категории ===

export interface DeleteItemCategoryRequest {
  categoryId: UUID;
  // Что делать с дочерними категориями
  handleChildren: 'move_to_parent' | 'delete_cascade' | 'reject_if_has_children';
  // Что делать с записями, использующими эту категорию
  handleReferences: 'move_to_parent' | 'delete_cascade' | 'reject_if_referenced';
}

export interface DeleteItemCategoryResponse {
  message: string;
  deletedCount: number; // Количество удаленных категорий (включая дочерние)
  movedCount: number; // Количество перемещенных категорий
  affectedReferences: number; // Количество затронутых записей
}

// === Валидация пути категории ===

export interface ValidateCategoryPathRequest {
  categoryId: UUID;
  parentId?: UUID | null;
}

export interface ValidateCategoryPathResponse {
  isValid: boolean;
  errors?: string[];
  resultingPath?: string[];
}

// === Статистика использования категорий ===

export interface CategoryUsageStatistics {
  categoryId: UUID;
  categoryName: string;
  categoryPath: string[];
  
  // Использование в функциях
  usedInCollectionPoints: number;
  usedInDistributionPoints: number;
  
  // Отклики
  volunteerResponsesCount: number;
  totalQuantityOffered: number;
  
  // Временная статистика
  usageLastWeek: number;
  usageLastMonth: number;
  
  // Популярность
  popularityScore: number;
}

export interface GetCategoryStatisticsRequest {
  categoryId?: UUID;
  organizerId?: UUID;
  includeChildren?: boolean; // Включить статистику дочерних категорий
}

export interface GetCategoryStatisticsResponse {
  statistics: CategoryUsageStatistics[];
}

// === Предопределенные корневые категории ===

export const DEFAULT_ROOT_CATEGORIES = [
  'Medicine',
  'Food',
  'Clothing',
  'Hygiene',
  'Other'
] as const;

export type DefaultRootCategory = typeof DEFAULT_ROOT_CATEGORIES[number];

// === Массовое создание категорий ===

export interface BulkCreateCategoriesRequest {
  categories: Array<{
    name: string;
    description?: string;
    parentId: UUID | null;
  }>;
}

export interface BulkCreateCategoriesResponse {
  created: ItemCategory[];
  failed: Array<{
    name: string;
    error: string;
  }>;
}

// === API endpoints типизация ===

export type ItemCategoryEndpoints = {
  'POST /item-categories': {
    request: CreateItemCategoryRequest;
    response: ApiResponse<CreateItemCategoryResponse>;
  };
  'POST /item-categories/bulk': {
    request: BulkCreateCategoriesRequest;
    response: ApiResponse<BulkCreateCategoriesResponse>;
  };
  'GET /item-categories': {
    request: GetItemCategoriesRequest;
    response: ApiResponse<GetItemCategoriesResponse>;
  };
  'GET /item-categories/hierarchy': {
    request: GetCategoryHierarchyRequest;
    response: ApiResponse<GetCategoryHierarchyResponse>;
  };
  'GET /item-categories/search': {
    request: SearchCategoriesRequest;
    response: ApiResponse<SearchCategoriesResponse>;
  };
  'GET /item-categories/:id': {
    request: GetItemCategoryRequest;
    response: ApiResponse<GetItemCategoryResponse>;
  };
  'GET /item-categories/:id/statistics': {
    request: { categoryId: UUID };
    response: ApiResponse<CategoryUsageStatistics>;
  };
  'GET /item-categories/statistics': {
    request: GetCategoryStatisticsRequest;
    response: ApiResponse<GetCategoryStatisticsResponse>;
  };
  'PATCH /item-categories/:id': {
    request: UpdateItemCategoryRequest;
    response: ApiResponse<UpdateItemCategoryResponse>;
  };
  'DELETE /item-categories/:id': {
    request: DeleteItemCategoryRequest;
    response: ApiResponse<DeleteItemCategoryResponse>;
  };
  'POST /item-categories/:id/validate-path': {
    request: ValidateCategoryPathRequest;
    response: ApiResponse<ValidateCategoryPathResponse>;
  };
};

