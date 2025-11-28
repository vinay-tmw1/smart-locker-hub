export enum LockerStatus {
  AVAILABLE = 'Available',
  OCCUPIED_USER = 'Your Parcel',
  OCCUPIED_OTHER = 'In Use',
  SANITIZING = 'Sanitizing',
}

export type Feature = 'hot' | 'cold' | 'uv';

export interface Locker {
  id: number;
  status: LockerStatus;
  parcelInfo?: string;
  features: Feature[];
}

export enum PlanType {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
}

export interface Plan {
  name: string;
  type: PlanType;
  price: number;
  credits: number;
  features: string[];
  highlight?: boolean;
}

export interface FamilyMember {
    id: number;
    name: string;
}

export enum ParcelStatus {
  // Admin/System statuses
  RECEIVED = 'Received at Hub',
  SANITIZING = 'Sanitizing',
  DELIVERED = 'Delivered to Recipient',

  // Shared statuses
  IN_LOCKER = 'In Locker',
  RETURNED = 'Returned',
  
  // User-facing statuses
  AWAITING_APPROVAL = 'Awaiting Approval',
  UPCOMING = 'Upcoming',
}

export interface Parcel {
  id: string;
  sender: string;
  status: ParcelStatus;
  lockerId: number | null;
  recipient: string;
  lastUpdate: string;
}
