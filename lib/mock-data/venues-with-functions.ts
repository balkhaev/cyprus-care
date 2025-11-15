import type { Venue, VenueFunction, CollectionPointFunction, DistributionPointFunction, ServicesNeededFunction, CustomFunctionType } from '@/types/venue';

// Mock venues with functions
export const mockVenues: Venue[] = [
  {
    id: '1',
    title: 'Central Collection Point',
    description: 'Main collection point for humanitarian aid in the city center',
    type: 'collection_point',
    location: {
      lat: 35.1738,
      lng: 33.3642,
      address: 'Ledra Street, 1, Nicosia',
    },
    operatingHours: [
      { dayOfWeek: 'Monday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { dayOfWeek: 'Tuesday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { dayOfWeek: 'Wednesday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { dayOfWeek: 'Thursday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { dayOfWeek: 'Friday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { dayOfWeek: 'Saturday', openTime: '10:00', closeTime: '16:00', isClosed: false },
      { dayOfWeek: 'Sunday', openTime: '00:00', closeTime: '00:00', isClosed: true },
    ],
    functions: [
      {
        id: 'func-1',
        type: 'collection_point',
        items: [
          {
            categoryId: 'cat-1-1-1',
            categoryPath: ['Medicine', 'Painkillers', 'Nurofen'],
            quantity: 'some',
          },
          {
            categoryId: 'cat-1-1-2',
            categoryPath: ['Medicine', 'Painkillers', 'Paracetamol'],
            quantity: 'a_lot',
          },
          {
            categoryId: 'cat-1-2-1',
            categoryPath: ['Medicine', 'Antibiotics', 'Amoxicillin'],
            quantity: 'few',
          },
          {
            categoryId: 'cat-1-3-1',
            categoryPath: ['Medicine', 'First Aid', 'Bandages'],
            quantity: 'a_lot',
          },
          {
            categoryId: 'cat-1-3-2',
            categoryPath: ['Medicine', 'First Aid', 'Antiseptics'],
            quantity: 'some',
          },
          {
            categoryId: 'cat-2-1-1',
            categoryPath: ['Food', 'Canned Food', 'Canned Vegetables'],
            quantity: 'few',
          },
          {
            categoryId: 'cat-2-1-2',
            categoryPath: ['Food', 'Canned Food', 'Canned Meat'],
            quantity: 'a_lot',
          },
          {
            categoryId: 'cat-2-2-1',
            categoryPath: ['Food', 'Dry Food', 'Rice'],
            quantity: 'a_lot',
          },
          {
            categoryId: 'cat-2-2-2',
            categoryPath: ['Food', 'Dry Food', 'Pasta'],
            quantity: 'some',
          },
          {
            categoryId: 'cat-3-1-1',
            categoryPath: ['Clothing', 'Adult Clothing', 'Jackets'],
            quantity: 'few',
          },
          {
            categoryId: 'cat-3-2-1',
            categoryPath: ['Clothing', 'Children Clothing', 'Winter Clothes'],
            quantity: 'a_lot',
          },
          {
            categoryId: 'cat-4-1',
            categoryPath: ['Hygiene', 'Soap'],
            quantity: 'some',
          },
          {
            categoryId: 'cat-4-2',
            categoryPath: ['Hygiene', 'Diapers'],
            quantity: 'a_lot',
          },
        ],
        openingTimes: [
          { dayOfWeek: 'Monday', openTime: '09:00', closeTime: '18:00', isClosed: false },
          { dayOfWeek: 'Tuesday', openTime: '09:00', closeTime: '18:00', isClosed: false },
          { dayOfWeek: 'Wednesday', openTime: '09:00', closeTime: '18:00', isClosed: false },
          { dayOfWeek: 'Thursday', openTime: '09:00', closeTime: '18:00', isClosed: false },
          { dayOfWeek: 'Friday', openTime: '09:00', closeTime: '18:00', isClosed: false },
          { dayOfWeek: 'Saturday', openTime: '10:00', closeTime: '16:00', isClosed: false },
          { dayOfWeek: 'Sunday', openTime: '00:00', closeTime: '00:00', isClosed: true },
        ],
        specialRequests: 'Please bring items in clean condition',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      } as CollectionPointFunction,
      {
        id: 'func-2',
        type: 'services_needed',
        services: [
          {
            type: 'transport_big',
            description: 'Need large truck for moving supplies',
            isRequired: true,
          },
          {
            type: 'carrying',
            description: 'Strong people needed to carry heavy boxes',
            isRequired: true,
          },
          {
            type: 'language',
            description: 'English and Arabic speakers needed',
            isRequired: false,
          },
        ],
        specialRequests: 'Volunteers should be available on weekends',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      } as ServicesNeededFunction,
    ],
    organizerId: 'org-1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'West District Distribution Hub',
    description: 'Distribution center for the western part of the city',
    type: 'distribution_hub',
    location: {
      lat: 35.1590,
      lng: 33.3450,
      address: 'Makarios Avenue, 10, Nicosia',
    },
    operatingHours: [
      { dayOfWeek: 'Monday', openTime: '10:00', closeTime: '19:00', isClosed: false },
      { dayOfWeek: 'Tuesday', openTime: '10:00', closeTime: '19:00', isClosed: false },
      { dayOfWeek: 'Wednesday', openTime: '10:00', closeTime: '19:00', isClosed: false },
      { dayOfWeek: 'Thursday', openTime: '10:00', closeTime: '19:00', isClosed: false },
      { dayOfWeek: 'Friday', openTime: '10:00', closeTime: '19:00', isClosed: false },
      { dayOfWeek: 'Saturday', openTime: '11:00', closeTime: '17:00', isClosed: false },
      { dayOfWeek: 'Sunday', openTime: '11:00', closeTime: '17:00', isClosed: false },
    ],
    functions: [
      {
        id: 'func-3',
        type: 'distribution_point',
        items: [
          {
            categoryId: 'cat-2-2-1',
            categoryPath: ['Food', 'Dry Goods', 'Rice'],
            quantity: 'a_lot',
          },
          {
            categoryId: 'cat-2-2-2',
            categoryPath: ['Food', 'Dry Goods', 'Pasta'],
            quantity: 'a_lot',
          },
          {
            categoryId: 'cat-3-1-2',
            categoryPath: ['Clothing', 'Winter Clothing', 'Blankets'],
            quantity: 'some',
          },
          {
            categoryId: 'cat-4-2',
            categoryPath: ['Hygiene', 'Diapers'],
            quantity: 'few',
          },
        ],
        openingTimes: [
          { dayOfWeek: 'Monday', openTime: '10:00', closeTime: '19:00', isClosed: false },
          { dayOfWeek: 'Tuesday', openTime: '10:00', closeTime: '19:00', isClosed: false },
          { dayOfWeek: 'Wednesday', openTime: '10:00', closeTime: '19:00', isClosed: false },
          { dayOfWeek: 'Thursday', openTime: '10:00', closeTime: '19:00', isClosed: false },
          { dayOfWeek: 'Friday', openTime: '10:00', closeTime: '19:00', isClosed: false },
          { dayOfWeek: 'Saturday', openTime: '11:00', closeTime: '17:00', isClosed: false },
          { dayOfWeek: 'Sunday', openTime: '11:00', closeTime: '17:00', isClosed: false },
        ],
        specialRequests: 'Please bring ID to collect items',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16'),
      } as DistributionPointFunction,
    ],
    organizerId: 'org-1',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    title: 'Emergency Shelter North',
    description: 'Temporary shelter providing accommodation and basic services',
    type: 'shelter',
    location: {
      lat: 35.1850,
      lng: 33.3800,
      address: 'Kennedy Avenue, 25, Nicosia',
    },
    operatingHours: [
      { dayOfWeek: 'Monday', openTime: '00:00', closeTime: '23:59', isClosed: false },
      { dayOfWeek: 'Tuesday', openTime: '00:00', closeTime: '23:59', isClosed: false },
      { dayOfWeek: 'Wednesday', openTime: '00:00', closeTime: '23:59', isClosed: false },
      { dayOfWeek: 'Thursday', openTime: '00:00', closeTime: '23:59', isClosed: false },
      { dayOfWeek: 'Friday', openTime: '00:00', closeTime: '23:59', isClosed: false },
      { dayOfWeek: 'Saturday', openTime: '00:00', closeTime: '23:59', isClosed: false },
      { dayOfWeek: 'Sunday', openTime: '00:00', closeTime: '23:59', isClosed: false },
    ],
    functions: [
      {
        id: 'func-4',
        type: 'services_needed',
        services: [
          {
            type: 'admin',
            description: 'Administrative support for registrations',
            isRequired: true,
          },
          {
            type: 'language',
            description: 'Translators (English, Arabic, Ukrainian)',
            isRequired: true,
          },
          {
            type: 'tech',
            description: 'IT support for database management',
            isRequired: false,
          },
        ],
        createdAt: new Date('2024-01-17'),
        updatedAt: new Date('2024-01-17'),
      } as ServicesNeededFunction,
      {
        id: 'func-5',
        type: 'collection_point',
        items: [
          {
            categoryId: 'cat-3-3',
            categoryPath: ['Clothing', 'Children Clothing'],
            quantity: 'a_lot',
          },
          {
            categoryId: 'cat-2-3',
            categoryPath: ['Food', 'Baby Food'],
            quantity: 'some',
          },
        ],
        openingTimes: [
          { dayOfWeek: 'Monday', openTime: '08:00', closeTime: '20:00', isClosed: false },
          { dayOfWeek: 'Tuesday', openTime: '08:00', closeTime: '20:00', isClosed: false },
          { dayOfWeek: 'Wednesday', openTime: '08:00', closeTime: '20:00', isClosed: false },
          { dayOfWeek: 'Thursday', openTime: '08:00', closeTime: '20:00', isClosed: false },
          { dayOfWeek: 'Friday', openTime: '08:00', closeTime: '20:00', isClosed: false },
          { dayOfWeek: 'Saturday', openTime: '09:00', closeTime: '18:00', isClosed: false },
          { dayOfWeek: 'Sunday', openTime: '09:00', closeTime: '18:00', isClosed: false },
        ],
        specialRequests: 'Especially need children items',
        createdAt: new Date('2024-01-17'),
        updatedAt: new Date('2024-01-17'),
      } as CollectionPointFunction,
    ],
    organizerId: 'org-2',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: '4',
    title: 'South Community Center',
    description: 'Community center serving as both collection and distribution point',
    type: 'collection_point',
    location: {
      lat: 35.1450,
      lng: 33.3700,
      address: 'Stasikratous Street, 42, Nicosia',
    },
    operatingHours: [
      { dayOfWeek: 'Monday', openTime: '09:00', closeTime: '17:00', isClosed: false },
      { dayOfWeek: 'Tuesday', openTime: '09:00', closeTime: '17:00', isClosed: false },
      { dayOfWeek: 'Wednesday', openTime: '09:00', closeTime: '17:00', isClosed: false },
      { dayOfWeek: 'Thursday', openTime: '09:00', closeTime: '17:00', isClosed: false },
      { dayOfWeek: 'Friday', openTime: '09:00', closeTime: '17:00', isClosed: false },
      { dayOfWeek: 'Saturday', openTime: '00:00', closeTime: '00:00', isClosed: true },
      { dayOfWeek: 'Sunday', openTime: '00:00', closeTime: '00:00', isClosed: true },
    ],
    functions: [
      {
        id: 'func-6',
        type: 'collection_point',
        items: [
          {
            categoryId: 'cat-4-1-1',
            categoryPath: ['Hygiene', 'Personal Care', 'Soap'],
            quantity: 'some',
          },
          {
            categoryId: 'cat-4-1-3',
            categoryPath: ['Hygiene', 'Personal Care', 'Toothpaste'],
            quantity: 'few',
          },
          {
            categoryId: 'cat-5-1',
            categoryPath: ['Other', 'Batteries'],
            quantity: 'few',
          },
        ],
        openingTimes: [
          { dayOfWeek: 'Monday', openTime: '09:00', closeTime: '17:00', isClosed: false },
          { dayOfWeek: 'Tuesday', openTime: '09:00', closeTime: '17:00', isClosed: false },
          { dayOfWeek: 'Wednesday', openTime: '09:00', closeTime: '17:00', isClosed: false },
          { dayOfWeek: 'Thursday', openTime: '09:00', closeTime: '17:00', isClosed: false },
          { dayOfWeek: 'Friday', openTime: '09:00', closeTime: '17:00', isClosed: false },
          { dayOfWeek: 'Saturday', openTime: '00:00', closeTime: '00:00', isClosed: true },
          { dayOfWeek: 'Sunday', openTime: '00:00', closeTime: '00:00', isClosed: true },
        ],
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18'),
      } as CollectionPointFunction,
      {
        id: 'func-7',
        type: 'distribution_point',
        items: [
          {
            categoryId: 'cat-1-1-2',
            categoryPath: ['Medicine', 'Painkillers', 'Paracetamol'],
            quantity: 'some',
          },
          {
            categoryId: 'cat-1-3-2',
            categoryPath: ['Medicine', 'First Aid', 'Antiseptics'],
            quantity: 'some',
          },
        ],
        openingTimes: [
          { dayOfWeek: 'Monday', openTime: '13:00', closeTime: '17:00', isClosed: false },
          { dayOfWeek: 'Wednesday', openTime: '13:00', closeTime: '17:00', isClosed: false },
          { dayOfWeek: 'Friday', openTime: '13:00', closeTime: '17:00', isClosed: false },
          { dayOfWeek: 'Tuesday', openTime: '00:00', closeTime: '00:00', isClosed: true },
          { dayOfWeek: 'Thursday', openTime: '00:00', closeTime: '00:00', isClosed: true },
          { dayOfWeek: 'Saturday', openTime: '00:00', closeTime: '00:00', isClosed: true },
          { dayOfWeek: 'Sunday', openTime: '00:00', closeTime: '00:00', isClosed: true },
        ],
        specialRequests: 'Distribution only on Mon, Wed, Fri afternoons',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18'),
      } as DistributionPointFunction,
      {
        id: 'func-8',
        type: 'services_needed',
        services: [
          {
            type: 'transport_small',
            description: 'Small car for local deliveries',
            isRequired: false,
          },
        ],
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18'),
      } as ServicesNeededFunction,
    ],
    organizerId: 'org-1',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
];

// Mock custom function types created by organizers
export const mockCustomFunctionTypes: CustomFunctionType[] = [
  {
    id: 'custom-type-1',
    name: 'Medical Clinic',
    description: 'Temporary medical clinic providing basic healthcare',
    organizerId: 'org-1',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'custom-type-2',
    name: 'Education Center',
    description: 'Providing educational support for children',
    organizerId: 'org-2',
    createdAt: new Date('2024-01-12'),
  },
];

