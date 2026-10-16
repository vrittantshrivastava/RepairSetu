export type DeviceCategory = 'smartphone' | 'laptop' | 'tablet';

export type ServiceType = 'pickup' | 'visit';
export type RepairPriority = 'standard' | 'express';

export type RepairStatus =
  | 'request_submitted'
  | 'repairer_accepted'
  | 'device_received'
  | 'diagnosis_in_progress'
  | 'cost_approval_pending'
  | 'repair_in_progress'
  | 'quality_check'
  | 'ready_for_delivery'
  | 'completed';

export interface DeviceModel {
  id: string;
  category: DeviceCategory;
  brand: string;
  model: string;
  popularIssues: string[];
}

export interface IssueType {
  id: string;
  name: string;
  iconName: string;
  typicalCostRange: { min: number; max: number };
  typicalDurationHours: number;
}

export interface RepairRequest {
  id: string;
  category: DeviceCategory;
  brand: string;
  model: string;
  issue: string;
  customDescription: string;
  aiClassification?: {
    primaryCategory: string;
    confidence: 'high' | 'medium' | 'low';
    secondaryCategory?: string;
    explanation: string;
  };
  city: string;
  area: string;
  pincode: string;
  serviceType: ServiceType;
  priority: RepairPriority;
  images: string[];
  createdAt: string;
  customerName: string;
  customerPhone: string;
}

export interface RepairerProfile {
  id: string;
  name: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  completedRepairs: number;
  experienceYears: number;
  address: string;
  area: string;
  distanceKm: number;
  avatarUrl?: string;
  workshopImageUrl?: string;
  badge?: 'Best Value' | 'Highest Rated' | 'Fastest Turnaround' | 'Top Specialist';
  specialties: string[];
  partsPolicy: string;
  warrantyPolicy: string;
  openingHours: string;
  reviews: {
    id: string;
    author: string;
    date: string;
    rating: number;
    device: string;
    comment: string;
  }[];
}

export interface Quotation {
  id: string;
  repairerId: string;
  repairer: RepairerProfile;
  amount: number;
  estimatedHours: number;
  warrantyDays: number;
  partsType: 'OEM Grade' | 'Original Genuine' | 'Certified Compatible';
  pickupAvailable: boolean;
  notes: string;
  anomalyFlag?: boolean;
}

export interface CostAdjustment {
  initialAmount: number;
  updatedAmount: number;
  difference: number;
  diagnosisDetails: string;
  reason: string;
  status: 'pending' | 'approved' | 'declined';
  photos?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'repairer' | 'system';
  senderName: string;
  senderRole?: string;
  text: string;
  timestamp: string;
  attachmentUrl?: string;
  isDiagnosticPhoto?: boolean;
}

export interface ActiveRepairJob {
  repairId: string;
  request: RepairRequest;
  selectedQuotation: Quotation;
  status: RepairStatus;
  statusHistory: {
    status: RepairStatus;
    timestamp: string;
    note: string;
  }[];
  costAdjustment?: CostAdjustment;
  messages?: ChatMessage[];
  finalPaidAmount?: number;
  completedAt?: string;
  warrantyExpiry?: string;
  paymentStatus: 'pending' | 'paid';
  technicianNotes?: string;
}

export interface DigitalWarranty {
  warrantyId: string;
  repairId: string;
  device: string;
  repairPerformed: string;
  partsUsed: string;
  repairerName: string;
  repairerArea: string;
  repairDate: string;
  amountPaid: number;
  warrantyDays: number;
  expiryDate: string;
  terms: string[];
  status: 'active' | 'expired' | 'claimed';
}

export interface UserLocation {
  city: string;
  area: string;
  pincode: string;
  latitude: number;
  longitude: number;
  source: 'gps' | 'manual' | 'preset';
}

export interface NearbyRepairStore {
  id: string;
  name: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  latitude: number;
  longitude: number;
  address: string;
  area: string;
  distanceKm: number;
  devices: DeviceCategory[];
  services: string[];
  startingPrice: number;
  priceRange?: string;
  warranty: string;
  warrantyDays: number;
  pickupAvailable: boolean;
  isOpen: boolean;
  openingHours: string;
  estimatedHours: number;
  completedRepairs: number;
  experienceYears: number;
  partsPolicy: string;
  badge?: 'Best Value' | 'Highest Rated' | 'Fastest Turnaround' | 'Top Specialist';
  phone: string;
  specialties: string[];
  reviews: {
    id: string;
    author: string;
    date: string;
    rating: number;
    device: string;
    comment: string;
  }[];
}

