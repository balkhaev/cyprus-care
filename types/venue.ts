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

export interface Venue {
  id: string;
  title: string;
  description: string;
  type: VenueType;
  location: VenueLocation;
  operatingHours: OperatingHours[];
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

