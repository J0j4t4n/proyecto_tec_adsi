import React from 'react';

// --- General UI & App State ---
export type View = 'public' | 'login' | 'admin';
export type ModalType = 'scanner' | 'art' | 'chat' | 'quote' | null;

export interface AppActions {
  navigateTo: (sectionId: string) => void;
  openModal: (modal: ModalType) => void;
  attemptLogin: (password: string) => boolean;
}

// --- B2C Features ---
export interface Service {
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
  titleKey: string;
  descriptionKey: string;
  price: number; 
}

export interface AIFeature {
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
  titleKey: string;
  descriptionKey: string;
  buttonKey: string;
  action: () => void;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  state?: 'loading' | 'tool_code' | 'error';
  id: string;
}

// --- Data Models (CRM & Appointments) ---
export interface CommunicationEntry {
  id: string;
  date: string;
  text: string;
}

export interface MedicalRecord {
  date: string;
  description: string;
  type: 'vaccine' | 'checkup' | 'treatment';
}

export interface Pet {
  name: string;
  breed: string;
  age: number;
  weight: number; // in kg
  avatarUrl: string;
  medicalHistory: MedicalRecord[];
  vaccineReminders: string[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  memberSince: string;
  pet: Pet;
  communicationLog: CommunicationEntry[];
}

export interface User extends Omit<Client, 'id' | 'memberSince' | 'pet' | 'address' | 'communicationLog'> {
  petName: string;
  petBreed: string;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  clientId: string;
  petName: string;
  service: string;
  address: string;
  status: 'confirmed' | 'completed' | 'canceled';
  paymentStatus: 'paid' | 'pending';
  syncedToGoogle: boolean;
}

export interface AppointmentCreationData {
    name: string; 
    petName: string;
    date: string;
    time: string;
    service: string;
    phone: string;
    address: string;
}

// --- B2B Dashboard Types ---
export type DashboardView = 'summary' | 'appointments' | 'clients' | 'analytics' | 'settings' | 'leads' | 'providers' | 'expenses' | 'inventory' | 'marketing';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  capturedAt: string;
  status: 'new' | 'contacted' | 'converted';
}

export interface WashData {
  day: string;
  lavados: number;
}

export interface MachineData {
  id: string;
  status: 'online' | 'offline' | 'maintenance';
  soapLevel: number; // percentage
  conditionerLevel: number; // percentage
}

// --- Analytics Types ---
export interface ServicePopularity {
  name: string;
  count: number;
}

export interface TopClient {
  name: string;
  revenue: number;
}

export interface PeakHour {
  hour: string;
  appointments: number;
}

// --- Finance Module Types ---
export interface Provider {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: 'supplies' | 'maintenance' | 'professional_services' | 'other';
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  category: 'supplies' | 'rent' | 'utilities' | 'marketing' | 'salaries' | 'other';
  amount: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  lowStockThreshold: number;
  supplierId: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number; // as percentage
  sentAt: string;
}


// --- User Management Types ---
export type UserRole = 'admin' | 'manager' | 'employee';

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastLogin: string;
}

// --- Google Integration ---
export interface GoogleUser {
    email: string;
    name: string;
    picture: string;
}

// --- Dashboard Settings ---
export interface PaymentMethod {
  id: 'creditCard' | 'applePay' | 'googlePay' | 'nfc';
  name: string;
  enabled: boolean;
}

export interface VoiceOption {
    id: string;
    name: string;
}