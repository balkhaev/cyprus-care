/**
 * Contracts for working with venue functions
 */

import { 
  UUID, 
  Timestamp, 
  ApiResponse, 
  PaginationParams,
  PaginatedResponse,
  EntityStatus 
} from './common';
import {
  VenueFunctionType,
  VenueFunction,
  ItemWithQuantity,
  ServiceRequest,
  OperatingHours,
} from './venue';

// === Создание функции ===

export type CreateFunctionRequestBase = {
  venueId: UUID;
  specialRequests?: string;
};

export interface CreateCollectionPointRequest extends CreateFunctionRequestBase {
  type: 'collection_point';
  items: ItemWithQuantity[];
  openingTimes: OperatingHours[];
}

export interface CreateDistributionPointRequest extends CreateFunctionRequestBase {
  type: 'distribution_point';
  items: ItemWithQuantity[];
  openingTimes: OperatingHours[];
}

export interface CreateServicesNeededRequest extends CreateFunctionRequestBase {
  type: 'services_needed';
  services: ServiceRequest[];
}

export interface CreateCustomFunctionRequest extends CreateFunctionRequestBase {
  type: 'custom';
  customTypeId: UUID;
  items?: ItemWithQuantity[];
  services?: ServiceRequest[];
  openingTimes?: OperatingHours[];
}

export type CreateFunctionRequest = 
  | CreateCollectionPointRequest
  | CreateDistributionPointRequest
  | CreateServicesNeededRequest
  | CreateCustomFunctionRequest;

export interface CreateFunctionResponse {
  function: VenueFunction;
}

// === Обновление функции ===

export type UpdateFunctionRequestBase = {
  functionId: UUID;
  specialRequests?: string;
  status?: EntityStatus;
};

export interface UpdateCollectionPointRequest extends UpdateFunctionRequestBase {
  items?: ItemWithQuantity[];
  openingTimes?: OperatingHours[];
}

export interface UpdateDistributionPointRequest extends UpdateFunctionRequestBase {
  items?: ItemWithQuantity[];
  openingTimes?: OperatingHours[];
}

export interface UpdateServicesNeededRequest extends UpdateFunctionRequestBase {
  services?: ServiceRequest[];
}

export interface UpdateCustomFunctionRequest extends UpdateFunctionRequestBase {
  items?: ItemWithQuantity[];
  services?: ServiceRequest[];
  openingTimes?: OperatingHours[];
}

export type UpdateFunctionRequest = 
  | UpdateCollectionPointRequest
  | UpdateDistributionPointRequest
  | UpdateServicesNeededRequest
  | UpdateCustomFunctionRequest;

export interface UpdateFunctionResponse {
  function: VenueFunction;
}

// === Получение функций ===

export interface GetFunctionsRequest extends PaginationParams {
  venueId?: UUID;
  type?: VenueFunctionType;
  status?: EntityStatus;
}

export interface GetFunctionsResponse extends PaginatedResponse<VenueFunction> {
  // Дополнительная мета-информация
}

// === Получение одной функции ===

export interface GetFunctionRequest {
  functionId: UUID;
}

export interface GetFunctionResponse {
  function: VenueFunction;
}

// === Удаление функции ===

export interface DeleteFunctionRequest {
  functionId: UUID;
  hardDelete?: boolean;
}

export interface DeleteFunctionResponse {
  message: string;
  deletedAt: Timestamp;
}

// === Кастомные типы функций ===

export interface CustomFunctionType {
  id: UUID;
  name: string;
  description: string;
  organizerId: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateCustomFunctionTypeRequest {
  name: string;
  description: string;
}

export interface CreateCustomFunctionTypeResponse {
  customFunctionType: CustomFunctionType;
}

export interface GetCustomFunctionTypesRequest {
  organizerId?: UUID;
}

export interface GetCustomFunctionTypesResponse {
  customFunctionTypes: CustomFunctionType[];
}

export interface UpdateCustomFunctionTypeRequest {
  customTypeId: UUID;
  name?: string;
  description?: string;
}

export interface UpdateCustomFunctionTypeResponse {
  customFunctionType: CustomFunctionType;
}

export interface DeleteCustomFunctionTypeRequest {
  customTypeId: UUID;
}

export interface DeleteCustomFunctionTypeResponse {
  message: string;
}

// === Статистика функции ===

export interface FunctionStatistics {
  functionId: UUID;
  venueId: UUID;
  type: VenueFunctionType;
  responsesCount: number;
  itemResponsesCount: number;
  serviceResponsesCount: number;
  beneficiaryCommitmentsCount: number;
  lastUpdated: Timestamp;
}

export interface GetFunctionStatisticsResponse {
  statistics: FunctionStatistics;
}

// === API endpoints типизация ===

export type VenueFunctionEndpoints = {
  'POST /venue-functions': {
    request: CreateFunctionRequest;
    response: ApiResponse<CreateFunctionResponse>;
  };
  'GET /venue-functions': {
    request: GetFunctionsRequest;
    response: ApiResponse<GetFunctionsResponse>;
  };
  'GET /venue-functions/:id': {
    request: GetFunctionRequest;
    response: ApiResponse<GetFunctionResponse>;
  };
  'PATCH /venue-functions/:id': {
    request: UpdateFunctionRequest;
    response: ApiResponse<UpdateFunctionResponse>;
  };
  'DELETE /venue-functions/:id': {
    request: DeleteFunctionRequest;
    response: ApiResponse<DeleteFunctionResponse>;
  };
  'GET /venue-functions/:id/statistics': {
    request: { functionId: UUID };
    response: ApiResponse<GetFunctionStatisticsResponse>;
  };
  
  // Custom function types
  'POST /custom-function-types': {
    request: CreateCustomFunctionTypeRequest;
    response: ApiResponse<CreateCustomFunctionTypeResponse>;
  };
  'GET /custom-function-types': {
    request: GetCustomFunctionTypesRequest;
    response: ApiResponse<GetCustomFunctionTypesResponse>;
  };
  'PATCH /custom-function-types/:id': {
    request: UpdateCustomFunctionTypeRequest;
    response: ApiResponse<UpdateCustomFunctionTypeResponse>;
  };
  'DELETE /custom-function-types/:id': {
    request: DeleteCustomFunctionTypeRequest;
    response: ApiResponse<DeleteCustomFunctionTypeResponse>;
  };
};

