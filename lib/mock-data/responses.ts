import type {
  VolunteerResponse,
  BeneficiaryCommitment,
  NeedStatusUpdate,
} from "@/types/response"

// Mock volunteer responses
export const mockVolunteerResponses: VolunteerResponse[] = [
  {
    id: "resp-1",
    volunteerId: "user-vol-1",
    volunteerName: "Alex Johnson",
    venueId: "1",
    functionId: "func-1",
    responseType: "item",
    categoryId: "cat-1-1-1",
    categoryPath: ["Medicine", "Painkillers", "Nurofen"],
    quantityOffered: 10,
    message: "I have 10 boxes of Nurofen to donate",
    createdAt: new Date("2024-01-20"),
    status: "confirmed",
  },
  {
    id: "resp-2",
    volunteerId: "user-vol-2",
    volunteerName: "Sarah Williams",
    venueId: "1",
    functionId: "func-2",
    responseType: "service",
    serviceType: "transport_big",
    message: "I have a large truck available on weekends",
    createdAt: new Date("2024-01-21"),
    status: "confirmed",
  },
  {
    id: "resp-3",
    volunteerId: "user-vol-1",
    volunteerName: "Alex Johnson",
    venueId: "3",
    functionId: "func-5",
    responseType: "item",
    categoryId: "cat-3-3",
    categoryPath: ["Clothing", "Children Clothing"],
    quantityOffered: 20,
    message: "I have children clothes (ages 5-10)",
    createdAt: new Date("2024-01-22"),
    status: "pending",
  },
]

// Mock beneficiary commitments
export const mockBeneficiaryCommitments: BeneficiaryCommitment[] = [
  {
    id: "commit-1",
    beneficiaryId: "user-ben-1",
    beneficiaryName: "Mohammed Ali",
    venueId: "2",
    functionId: "func-3",
    createdAt: new Date("2024-01-20"),
    status: "confirmed",
  },
  {
    id: "commit-2",
    beneficiaryId: "user-ben-2",
    beneficiaryName: "Elena Petrov",
    venueId: "2",
    functionId: "func-3",
    createdAt: new Date("2024-01-21"),
    status: "confirmed",
  },
  {
    id: "commit-3",
    beneficiaryId: "user-ben-1",
    beneficiaryName: "Mohammed Ali",
    venueId: "4",
    functionId: "func-7",
    createdAt: new Date("2024-01-22"),
    status: "confirmed",
  },
]

// Mock need status updates
export const mockNeedStatusUpdates: NeedStatusUpdate[] = [
  // Venue 1, func-1 (Collection Point) - items
  {
    id: "status-1",
    venueId: "1",
    functionId: "func-1",
    itemCategoryId: "cat-1-1-1", // Nurofen
    status: "need_few_more",
    updatedBy: "org-1",
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "status-2",
    venueId: "1",
    functionId: "func-1",
    itemCategoryId: "cat-1-1-2", // Paracetamol
    status: "need_a_lot",
    updatedBy: "org-1",
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "status-3",
    venueId: "1",
    functionId: "func-1",
    itemCategoryId: "cat-1-2-1", // Amoxicillin
    status: "need_few_more",
    updatedBy: "org-1",
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "status-4",
    venueId: "1",
    functionId: "func-1",
    itemCategoryId: "cat-1-3-1", // Bandages
    status: "need_a_lot",
    updatedBy: "org-1",
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "status-5",
    venueId: "1",
    functionId: "func-1",
    itemCategoryId: "cat-1-3-2", // Antiseptics
    status: "need_a_lot",
    updatedBy: "org-1",
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "status-6",
    venueId: "1",
    functionId: "func-1",
    itemCategoryId: "cat-2-1-1", // Canned Vegetables
    status: "dont_need",
    updatedBy: "org-1",
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "status-7",
    venueId: "1",
    functionId: "func-1",
    itemCategoryId: "cat-2-1-2", // Canned Meat
    status: "need_few_more",
    updatedBy: "org-1",
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "status-8",
    venueId: "1",
    functionId: "func-1",
    itemCategoryId: "cat-2-2-1", // Rice
    status: "need_a_lot",
    updatedBy: "org-1",
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "status-9",
    venueId: "1",
    functionId: "func-1",
    itemCategoryId: "cat-2-2-2", // Pasta
    status: "need_a_lot",
    updatedBy: "org-1",
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "status-10",
    venueId: "1",
    functionId: "func-1",
    itemCategoryId: "cat-3-1-1", // Jackets
    status: "need_few_more",
    updatedBy: "org-1",
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "status-11",
    venueId: "1",
    functionId: "func-1",
    itemCategoryId: "cat-3-2-1", // Winter Clothes
    status: "need_a_lot",
    updatedBy: "org-1",
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "status-12",
    venueId: "1",
    functionId: "func-1",
    itemCategoryId: "cat-4-1", // Soap
    status: "dont_need",
    updatedBy: "org-1",
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "status-13",
    venueId: "1",
    functionId: "func-1",
    itemCategoryId: "cat-4-2", // Diapers
    status: "need_a_lot",
    updatedBy: "org-1",
    updatedAt: new Date("2024-01-21"),
  },
  // Venue 1, func-2 (Services Needed)
  {
    id: "status-14",
    venueId: "1",
    functionId: "func-2",
    serviceType: "transport_big",
    status: "need_a_lot",
    updatedBy: "org-1",
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "status-15",
    venueId: "1",
    functionId: "func-2",
    serviceType: "carrying",
    status: "need_few_more",
    updatedBy: "org-1",
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "status-16",
    venueId: "1",
    functionId: "func-2",
    serviceType: "language",
    status: "need_a_lot",
    updatedBy: "org-1",
    updatedAt: new Date("2024-01-21"),
  },
  // Other venues
  {
    id: "status-17",
    venueId: "2",
    functionId: "func-3",
    itemCategoryId: "cat-2-2-1",
    status: "dont_need",
    updatedBy: "org-1",
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "status-18",
    venueId: "4",
    functionId: "func-7",
    itemCategoryId: "cat-1-1-2",
    status: "need_few_more",
    updatedBy: "org-1",
    updatedAt: new Date("2024-01-22"),
  },
]

// Helper functions to get data
export function getResponsesForVenue(venueId: string): VolunteerResponse[] {
  return mockVolunteerResponses.filter((r) => r.venueId === venueId)
}

export function getResponsesForFunction(
  functionId: string
): VolunteerResponse[] {
  return mockVolunteerResponses.filter((r) => r.functionId === functionId)
}

export function getCommitmentsForVenue(
  venueId: string
): BeneficiaryCommitment[] {
  return mockBeneficiaryCommitments.filter((c) => c.venueId === venueId)
}

export function getCommitmentsForFunction(
  functionId: string
): BeneficiaryCommitment[] {
  return mockBeneficiaryCommitments.filter((c) => c.functionId === functionId)
}

export function getNeedStatus(
  functionId: string,
  categoryId?: string,
  serviceType?: string
): NeedStatusUpdate | undefined {
  return mockNeedStatusUpdates.find(
    (s) =>
      s.functionId === functionId &&
      (categoryId
        ? s.itemCategoryId === categoryId
        : s.serviceType === serviceType)
  )
}
