export type VenueType = 'collection_point' | 'distribution_hub' | 'shelter';

export interface VenueLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface OperatingHours {
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

// Quantity levels for items
export type QuantityLevel = 'a_lot' | 'some' | 'few';

// Item with quantity
export interface ItemWithQuantity {
  categoryId: string;
  categoryPath: string[]; // e.g., ['Medicine', 'Painkillers', 'Nurofen']
  quantity: QuantityLevel;
}

// Service types for "Services Needed" function
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

// Base function type
export type VenueFunctionType = 
  | 'collection_point'
  | 'distribution_point'
  | 'services_needed'
  | 'custom';

// Collection Point Function
export interface CollectionPointFunction {
  id: string;
  type: 'collection_point';
  items: ItemWithQuantity[];
  openingTimes: OperatingHours[];
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Distribution Point Function
export interface DistributionPointFunction {
  id: string;
  type: 'distribution_point';
  items: ItemWithQuantity[];
  openingTimes: OperatingHours[];
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Services Needed Function
export interface ServicesNeededFunction {
  id: string;
  type: 'services_needed';
  services: ServiceRequest[];
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Custom Function
export interface CustomFunction {
  id: string;
  type: 'custom';
  customTypeId: string; // References custom function type created by organizer
  customTypeName: string;
  customTypeDescription: string;
  items?: ItemWithQuantity[];
  services?: ServiceRequest[];
  openingTimes?: OperatingHours[];
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Union type for all venue functions
export type VenueFunction = 
  | CollectionPointFunction 
  | DistributionPointFunction 
  | ServicesNeededFunction 
  | CustomFunction;

// Custom function type definition (created by organizers)
export interface CustomFunctionType {
  id: string;
  name: string;
  description: string;
  organizerId: string;
  createdAt: Date;
}

export interface Venue {
  id: string;
  title: string;
  description: string;
  type: VenueType;
  location: VenueLocation;
  operatingHours: OperatingHours[];
  functions: VenueFunction[]; // Added functions array
  organizerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VenueFormData {
  title: string;
  description: string;
  type: VenueType;
  location: VenueLocation;
  operatingHours: OperatingHours[];
}

