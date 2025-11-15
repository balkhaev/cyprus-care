/**
 * Contracts for volunteer responses and beneficiary commitments
 */

import { 
  UUID, 
  Timestamp, 
  ApiResponse, 
  PaginationParams,
  PaginatedResponse 
} from './common';
import { ServiceType } from './venue';

export type ResponseStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
export type ResponseType = 'item' | 'service';

// === Отклик волонтера ===

export interface VolunteerResponse {
  id: UUID;
  volunteerId: UUID;
  volunteerName: string;
  venueId: UUID;
  venueName: string;
  functionId: UUID;
  responseType: ResponseType;
  
  // Для откликов на предметы
  categoryId?: UUID;
  categoryPath?: string[];
  quantityOffered?: number;
  
  // Для откликов на услуги
  serviceType?: ServiceType;
  
  // Общие поля
  message?: string;
  status: ResponseStatus;
  
  // Дополнительная информация
  deliveryDate?: Timestamp;
  notes?: string;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// === Создание отклика ===

export interface CreateVolunteerResponseRequest {
  venueId: UUID;
  functionId: UUID;
  responseType: ResponseType;
  
  // Для предметов
  categoryId?: UUID;
  quantityOffered?: number;
  
  // Для услуг
  serviceType?: ServiceType;
  
  // Общее
  message?: string;
  deliveryDate?: Timestamp;
  notes?: string;
}

export interface CreateVolunteerResponseResponse {
  response: VolunteerResponse;
}

// === Обновление отклика ===

export interface UpdateVolunteerResponseRequest {
  responseId: UUID;
  status?: ResponseStatus;
  quantityOffered?: number;
  message?: string;
  deliveryDate?: Timestamp;
  notes?: string;
}

export interface UpdateVolunteerResponseResponse {
  response: VolunteerResponse;
}

// === Получение откликов ===

export interface GetVolunteerResponsesRequest extends PaginationParams {
  volunteerId?: UUID;
  venueId?: UUID;
  functionId?: UUID;
  status?: ResponseStatus;
  responseType?: ResponseType;
  dateFrom?: Timestamp;
  dateTo?: Timestamp;
}

export interface GetVolunteerResponsesResponse extends PaginatedResponse<VolunteerResponse> {
  totalByStatus: Record<ResponseStatus, number>;
}

// === Получение одного отклика ===

export interface GetVolunteerResponseRequest {
  responseId: UUID;
}

export interface GetVolunteerResponseResponse {
  response: VolunteerResponse;
}

// === Удаление/отмена отклика ===

export interface DeleteVolunteerResponseRequest {
  responseId: UUID;
  reason?: string;
}

export interface DeleteVolunteerResponseResponse {
  message: string;
  deletedAt: Timestamp;
}

// === Обязательство бенефициара ===

export interface BeneficiaryCommitment {
  id: UUID;
  beneficiaryId: UUID;
  beneficiaryName: string;
  venueId: UUID;
  venueName: string;
  functionId: UUID; // Должно быть distribution_point
  
  // Информация о посещении
  plannedVisitDate?: Timestamp;
  actualVisitDate?: Timestamp;
  
  status: 'confirmed' | 'cancelled' | 'completed';
  
  // Дополнительно
  notes?: string;
  numberOfPeople?: number; // Количество людей (если бенефициар приходит с семьей)
  specialNeeds?: string[];
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// === Создание обязательства ===

export interface CreateBeneficiaryCommitmentRequest {
  venueId: UUID;
  functionId: UUID;
  plannedVisitDate?: Timestamp;
  numberOfPeople?: number;
  specialNeeds?: string[];
  notes?: string;
}

export interface CreateBeneficiaryCommitmentResponse {
  commitment: BeneficiaryCommitment;
}

// === Обновление обязательства ===

export interface UpdateBeneficiaryCommitmentRequest {
  commitmentId: UUID;
  status?: 'confirmed' | 'cancelled' | 'completed';
  plannedVisitDate?: Timestamp;
  actualVisitDate?: Timestamp;
  numberOfPeople?: number;
  specialNeeds?: string[];
  notes?: string;
}

export interface UpdateBeneficiaryCommitmentResponse {
  commitment: BeneficiaryCommitment;
}

// === Получение обязательств ===

export interface GetBeneficiaryCommitmentsRequest extends PaginationParams {
  beneficiaryId?: UUID;
  venueId?: UUID;
  functionId?: UUID;
  status?: 'confirmed' | 'cancelled' | 'completed';
  dateFrom?: Timestamp;
  dateTo?: Timestamp;
}

export interface GetBeneficiaryCommitmentsResponse extends PaginatedResponse<BeneficiaryCommitment> {
  totalByStatus: Record<'confirmed' | 'cancelled' | 'completed', number>;
}

// === Получение одного обязательства ===

export interface GetBeneficiaryCommitmentRequest {
  commitmentId: UUID;
}

export interface GetBeneficiaryCommitmentResponse {
  commitment: BeneficiaryCommitment;
}

// === Удаление/отмена обязательства ===

export interface DeleteBeneficiaryCommitmentRequest {
  commitmentId: UUID;
  reason?: string;
}

export interface DeleteBeneficiaryCommitmentResponse {
  message: string;
  cancelledAt: Timestamp;
}

// === Статус потребностей (управляется организаторами) ===

export type NeedStatus = 'need_a_lot' | 'need_few_more' | 'dont_need';

export interface NeedStatusUpdate {
  id: UUID;
  venueId: UUID;
  functionId: UUID;
  itemCategoryId?: UUID;
  serviceType?: ServiceType;
  status: NeedStatus;
  updatedBy: UUID;
  updatedAt: Timestamp;
}

export interface UpdateNeedStatusRequest {
  venueId: UUID;
  functionId: UUID;
  itemCategoryId?: UUID;
  serviceType?: ServiceType;
  status: NeedStatus;
}

export interface UpdateNeedStatusResponse {
  needStatus: NeedStatusUpdate;
}

export interface GetNeedStatusesRequest {
  venueId?: UUID;
  functionId?: UUID;
}

export interface GetNeedStatusesResponse {
  needStatuses: NeedStatusUpdate[];
}

// === Проекции для организаторов ===

export interface ItemProjection {
  categoryId: UUID;
  categoryPath: string[];
  currentStatus: NeedStatus;
  responseCount: number;
  totalQuantityOffered: number;
  pendingResponses: number;
  confirmedResponses: number;
}

export interface ServiceProjection {
  serviceType: ServiceType;
  currentStatus: NeedStatus;
  responseCount: number;
  pendingResponses: number;
  confirmedResponses: number;
  respondingVolunteers: Array<{
    id: UUID;
    name: string;
    message?: string;
    status: ResponseStatus;
  }>;
}

export interface VenueProjection {
  venueId: UUID;
  venueName: string;
  functionId: UUID;
  functionType: string;
  items: ItemProjection[];
  services: ServiceProjection[];
  beneficiaryCommitments: number;
  lastUpdated: Timestamp;
}

export interface GetVenueProjectionRequest {
  venueId: UUID;
  functionId?: UUID;
}

export interface GetVenueProjectionResponse {
  projection: VenueProjection;
}

// === API endpoints типизация ===

export type ResponseEndpoints = {
  // Volunteer responses
  'POST /volunteer-responses': {
    request: CreateVolunteerResponseRequest;
    response: ApiResponse<CreateVolunteerResponseResponse>;
  };
  'GET /volunteer-responses': {
    request: GetVolunteerResponsesRequest;
    response: ApiResponse<GetVolunteerResponsesResponse>;
  };
  'GET /volunteer-responses/:id': {
    request: GetVolunteerResponseRequest;
    response: ApiResponse<GetVolunteerResponseResponse>;
  };
  'PATCH /volunteer-responses/:id': {
    request: UpdateVolunteerResponseRequest;
    response: ApiResponse<UpdateVolunteerResponseResponse>;
  };
  'DELETE /volunteer-responses/:id': {
    request: DeleteVolunteerResponseRequest;
    response: ApiResponse<DeleteVolunteerResponseResponse>;
  };
  
  // Beneficiary commitments
  'POST /beneficiary-commitments': {
    request: CreateBeneficiaryCommitmentRequest;
    response: ApiResponse<CreateBeneficiaryCommitmentResponse>;
  };
  'GET /beneficiary-commitments': {
    request: GetBeneficiaryCommitmentsRequest;
    response: ApiResponse<GetBeneficiaryCommitmentsResponse>;
  };
  'GET /beneficiary-commitments/:id': {
    request: GetBeneficiaryCommitmentRequest;
    response: ApiResponse<GetBeneficiaryCommitmentResponse>;
  };
  'PATCH /beneficiary-commitments/:id': {
    request: UpdateBeneficiaryCommitmentRequest;
    response: ApiResponse<UpdateBeneficiaryCommitmentResponse>;
  };
  'DELETE /beneficiary-commitments/:id': {
    request: DeleteBeneficiaryCommitmentRequest;
    response: ApiResponse<DeleteBeneficiaryCommitmentResponse>;
  };
  
  // Need status
  'POST /need-status': {
    request: UpdateNeedStatusRequest;
    response: ApiResponse<UpdateNeedStatusResponse>;
  };
  'GET /need-status': {
    request: GetNeedStatusesRequest;
    response: ApiResponse<GetNeedStatusesResponse>;
  };
  
  // Projections for organizers
  'GET /projections/venue/:venueId': {
    request: GetVenueProjectionRequest;
    response: ApiResponse<GetVenueProjectionResponse>;
  };
};

