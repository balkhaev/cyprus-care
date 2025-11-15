// Types for volunteer responses and beneficiary commitments

export type ResponseType = 'item' | 'service';

// Volunteer response to a venue function need
export interface VolunteerResponse {
  id: string;
  volunteerId: string;
  volunteerName: string;
  venueId: string;
  functionId: string;
  responseType: ResponseType;
  
  // For item responses
  categoryId?: string;
  categoryPath?: string[];
  quantityOffered?: number;
  
  // For service responses
  serviceType?: string;
  
  // Common fields
  message?: string;
  createdAt: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

// Beneficiary commitment to attend distribution point
export interface BeneficiaryCommitment {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  venueId: string;
  functionId: string; // Should be a distribution_point function
  createdAt: Date;
  status: 'confirmed' | 'cancelled';
}

// Need status set by organizers
export type NeedStatus = 'need_a_lot' | 'need_few_more' | 'dont_need';

export interface NeedStatusUpdate {
  id: string;
  venueId: string;
  functionId: string;
  itemCategoryId?: string; // For item needs
  serviceType?: string; // For service needs
  status: NeedStatus;
  updatedBy: string; // organizerId
  updatedAt: Date;
}

// Aggregated projections for organizers
export interface ItemProjection {
  categoryId: string;
  categoryPath: string[];
  currentStatus: NeedStatus;
  responseCount: number;
  totalQuantityOffered: number;
}

export interface ServiceProjection {
  serviceType: string;
  currentStatus: NeedStatus;
  responseCount: number;
  respondingVolunteers: Array<{
    id: string;
    name: string;
    message?: string;
  }>;
}

export interface VenueProjection {
  venueId: string;
  functionId: string;
  items: ItemProjection[];
  services: ServiceProjection[];
  beneficiaryCommitments: number; // Count for distribution points
}

