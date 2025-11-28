import React from 'react';
import type { Locker, Plan, Parcel } from './types';
import { LockerStatus, PlanType, ParcelStatus } from './types';

export const LOCKERS: Locker[] = [
  {
    id: 1,
    status: LockerStatus.OCCUPIED_USER,
    parcelInfo: 'Flipkart - Shoes',
    features: ['uv'],
  },
  {
    id: 2,
    status: LockerStatus.AVAILABLE,
    features: ['cold', 'hot'],
  },
  {
    id: 3,
    status: LockerStatus.OCCUPIED_OTHER,
    features: [],
  },
  {
    id: 4,
    status: LockerStatus.SANITIZING,
    features: ['uv'],
  },
  {
    id: 5,
    status: LockerStatus.OCCUPIED_USER,
    parcelInfo: 'Hot Food Delivery',
    features: ['hot', 'uv'],
  },
  {
    id: 6,
    status: LockerStatus.AVAILABLE,
    features: ['cold'],
  },
  {
    id: 7,
    status: LockerStatus.OCCUPIED_OTHER,
    features: [],
  },
  {
    id: 8,
    status: LockerStatus.OCCUPIED_USER,
    parcelInfo: 'Laundry Pickup',
    features: [],
  },
  {
    id: 9,
    status: LockerStatus.AVAILABLE,
    features: [],
  },
  {
    id: 10,
    status: LockerStatus.AVAILABLE,
    features: ['uv'],
  },
];

export const PLANS: Plan[] = [
    {
        name: 'Daily Pass',
        type: PlanType.DAILY,
        price: 25,
        credits: 1,
        features: ['1 Parcel Credit', 'Valid for 24 hours'],
    },
    {
        name: 'Weekly',
        type: PlanType.WEEKLY,
        price: 150,
        credits: 7,
        features: ['7 Parcel Credits', 'Rollover credits for 1 week', 'Add 1 family member'],
    },
    {
        name: 'Monthly',
        type: PlanType.MONTHLY,
        price: 500,
        credits: 30,
        features: ['30 Parcel Credits', 'Rollover credits for 1 month', 'Add up to 3 family members', 'Bonus Credits per member'],
        highlight: true,
    },
    {
        name: 'Yearly',
        type: PlanType.YEARLY,
        price: 5000,
        credits: 365,
        features: ['365 Parcel Credits', 'Unlimited Rollover', 'Add up to 5 family members', 'Highest Bonus Credits'],
    },
];

export const TEAMS: string[] = [
    'Kiosk Backend Developers',
    'Kiosk Frontend Developers',
    'Web App Developers',
    'iOS & Android Developers',
    'AWS Developers',
    'Embedded & Hardware',
    'Sheet Metal Fabricators',
    'Electricians',
    'Design (2D/3D)',
    'UI/UX & Motion Graphics',
    'Marketing & Analytics',
    'Sales Team',
    'Content & Social Media',
    'HR & Accounts',
    'Procurement',
    'Print Media',
];

export const PARCELS: Parcel[] = [
  { id: 'AMZ-834J', sender: 'Amazon', status: ParcelStatus.IN_LOCKER, lockerId: 1, recipient: 'Aarav Sharma', lastUpdate: '2024-07-21 10:05 AM' },
  { id: 'FLP-912K', sender: 'Flipkart', status: ParcelStatus.SANITIZING, lockerId: 4, recipient: 'Priya Patel', lastUpdate: '2024-07-21 11:20 AM' },
  { id: 'DDC-556L', sender: 'Delhivery', status: ParcelStatus.IN_LOCKER, lockerId: 5, recipient: 'Rohan Singh', lastUpdate: '2024-07-21 09:15 AM' },
  { id: 'BLU-112M', sender: 'BlueDart', status: ParcelStatus.DELIVERED, lockerId: 8, recipient: 'Ananya Gupta', lastUpdate: '2024-07-20 03:45 PM' },
  { id: 'AMZ-334N', sender: 'Amazon', status: ParcelStatus.RECEIVED, lockerId: null, recipient: 'Vikram Kumar', lastUpdate: '2024-07-21 12:01 PM' },
  { id: 'FLP-778P', sender: 'Flipkart', status: ParcelStatus.RETURNED, lockerId: null, recipient: 'Isha Reddy', lastUpdate: '2024-07-19 08:00 AM' },
];

export const USER_PARCELS: Parcel[] = [
    { id: 'UNX-001A', sender: 'Unknown Courier', status: ParcelStatus.AWAITING_APPROVAL, lockerId: null, recipient: 'Your Name', lastUpdate: '2024-07-22 09:30 AM' },
    { id: 'MYN-451B', sender: 'Myntra', status: ParcelStatus.UPCOMING, lockerId: null, recipient: 'Your Name', lastUpdate: '2024-07-22 08:00 AM' },
    { id: 'AMZ-834J', sender: 'Amazon', status: ParcelStatus.IN_LOCKER, lockerId: 1, recipient: 'Your Name', lastUpdate: '2024-07-21 10:05 AM' },
    { id: 'ZOM-556L', sender: 'Zomato', status: ParcelStatus.IN_LOCKER, lockerId: 5, recipient: 'Your Name', lastUpdate: '2024-07-21 09:15 AM' },
    { id: 'FRN-002C', sender: 'Ferns N Petals', status: ParcelStatus.AWAITING_APPROVAL, lockerId: null, recipient: 'Your Name', lastUpdate: '2024-07-22 10:00 AM' },
    { id: 'BLD-112M', sender: 'BlueDart', status: ParcelStatus.DELIVERED, lockerId: 2, recipient: 'Your Name', lastUpdate: '2024-07-20 04:00 PM' },
];