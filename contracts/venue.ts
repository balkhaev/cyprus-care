/**
 * Contracts for working with venues
 */

import { 
  UUID, 
  Timestamp, 
  ApiResponse, 
  PaginationParams, 
  PaginatedResponse,
  GeoLocation,
  EntityStatus 
} from './common';

export type VenueType = 'collection_point' | 'distribution_hub' | 'shelter';

// === Время работы ===

export interface OperatingHours {
  dayOfWeek: string; // 'monday', 'tuesday', etc.
  openTime: string; // HH:MM format
  closeTime: string; // HH:MM format
  isClosed: boolean;
}

// === Площадка ===

export interface Venue {
  id: UUID;
  title: string;
  description: string;
  type: VenueType;
  location: GeoLocation;
  operatingHours: OperatingHours[];
  organizerId: number; // Changed to number to match User.id
  status: EntityStatus;
  functionsCount: number; // Количество функций
  imageUrls?: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// === Создание площадки ===

export interface CreateVenueRequest {
  title: string;
  description: string;
  type: VenueType;
  location: GeoLocation;
  operatingHours: OperatingHours[];
  imageUrls?: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

export interface CreateVenueResponse {
  venue: Venue;
}

// === Обновление площадки ===

export interface UpdateVenueRequest {
  title?: string;
  description?: string;
  type?: VenueType;
  location?: GeoLocation;
  operatingHours?: OperatingHours[];
  imageUrls?: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  status?: EntityStatus;
}

export interface UpdateVenueResponse {
  venue: Venue;
}

// === Получение площадок ===

export interface GetVenuesRequest extends PaginationParams {
  type?: VenueType;
  organizerId?: number; // Changed to number to match User.id
  status?: EntityStatus;
  searchQuery?: string;
  // Геофильтрация
  nearLocation?: {
    lat: number;
    lng: number;
    radiusKm: number;
  };
  // Фильтр по наличию функций
  hasFunctionType?: string;
}

export interface GetVenuesResponse extends PaginatedResponse<Venue> {
  // Можно добавить дополнительную мета-информацию
}

// === Получение одной площадки ===

export interface GetVenueRequest {
  venueId: UUID;
  includeInactive?: boolean;
}

export interface GetVenueResponse {
  venue: Venue;
}

// === Детальная информация о площадке с функциями ===

export interface VenueWithFunctions extends Venue {
  functions: VenueFunction[];
}

export interface GetVenueWithFunctionsResponse {
  venue: VenueWithFunctions;
}

// === Удаление площадки ===

export interface DeleteVenueRequest {
  venueId: UUID;
  hardDelete?: boolean; // Полное удаление или мягкое (status = deleted)
}

export interface DeleteVenueResponse {
  message: string;
  deletedAt: Timestamp;
}

// === Функции площадки (базовые типы) ===

export type VenueFunctionType = 
  | 'collection_point'
  | 'distribution_point'
  | 'services_needed'
  | 'custom';

export type QuantityLevel = 'a_lot' | 'some' | 'few';

export interface ItemWithQuantity {
  categoryId: UUID;
  categoryPath: string[]; // e.g., ['Medicine', 'Painkillers', 'Nurofen']
  quantity: QuantityLevel;
}

export type ServiceType = 
  | 'transport_big'
  | 'transport_small'
  | 'carrying'
  | 'language'
  | 'admin'
  | 'tech';

export interface ServiceRequest {
  type: ServiceType;
  description: string;
  isRequired: boolean;
}

// === Базовая функция ===

export interface VenueFunctionBase {
  id: UUID;
  venueId: UUID;
  type: VenueFunctionType;
  specialRequests?: string;
  status: EntityStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// === Типы функций ===

export interface CollectionPointFunction extends VenueFunctionBase {
  type: 'collection_point';
  items: ItemWithQuantity[];
  openingTimes: OperatingHours[];
}

export interface DistributionPointFunction extends VenueFunctionBase {
  type: 'distribution_point';
  items: ItemWithQuantity[];
  openingTimes: OperatingHours[];
}

export interface ServicesNeededFunction extends VenueFunctionBase {
  type: 'services_needed';
  services: ServiceRequest[];
}

export interface CustomFunction extends VenueFunctionBase {
  type: 'custom';
  customTypeId: UUID;
  customTypeName: string;
  customTypeDescription: string;
  items?: ItemWithQuantity[];
  services?: ServiceRequest[];
  openingTimes?: OperatingHours[];
}

export type VenueFunction = 
  | CollectionPointFunction 
  | DistributionPointFunction 
  | ServicesNeededFunction 
  | CustomFunction;

// === Статистика площадки ===

export interface VenueStatistics {
  venueId: UUID;
  totalResponses: number;
  itemResponsesCount: number;
  serviceResponsesCount: number;
  beneficiaryCommitmentsCount: number;
  mostNeededItems: Array<{
    categoryId: UUID;
    categoryPath: string[];
    requestCount: number;
  }>;
  mostNeededServices: Array<{
    serviceType: ServiceType;
    requestCount: number;
  }>;
}

export interface GetVenueStatisticsResponse {
  statistics: VenueStatistics;
}

// === API endpoints типизация ===

export type VenueEndpoints = {
  'POST /venues': {
    request: CreateVenueRequest;
    response: ApiResponse<CreateVenueResponse>;
  };
  'GET /venues': {
    request: GetVenuesRequest;
    response: ApiResponse<GetVenuesResponse>;
  };
  'GET /venues/:id': {
    request: GetVenueRequest;
    response: ApiResponse<GetVenueResponse>;
  };
  'GET /venues/:id/full': {
    request: { venueId: UUID };
    response: ApiResponse<GetVenueWithFunctionsResponse>;
  };
  'PATCH /venues/:id': {
    request: UpdateVenueRequest;
    response: ApiResponse<UpdateVenueResponse>;
  };
  'DELETE /venues/:id': {
    request: DeleteVenueRequest;
    response: ApiResponse<DeleteVenueResponse>;
  };
  'GET /venues/:id/statistics': {
    request: { venueId: UUID };
    response: ApiResponse<GetVenueStatisticsResponse>;
  };
};

