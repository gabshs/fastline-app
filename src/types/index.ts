// User types
export interface User {
  email: string;
  ownerName: string;
  tenantName: string;
}

export interface UserCredentials extends User {
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  ownerName: string;
  password: string;
  tenantName: string;
}

// Auth types
export type AuthView = 'login' | 'register';

// View types
export type AdminView = 
  | 'dashboard' 
  | 'clinics' 
  | 'queues' 
  | 'users' 
  | 'passwords' 
  | 'tv' 
  | 'patient';

// Clinic types
export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  tenantId: string;
}

// Queue types
export interface Queue {
  id: string;
  name: string;
  clinicId: string;
  currentNumber: number;
  status: 'active' | 'paused' | 'inactive';
}

// Password types
export interface Password {
  id: string;
  queueId: string;
  number: string;
  patientName?: string;
  status: 'waiting' | 'called' | 'attended' | 'cancelled';
  createdAt: Date;
  calledAt?: Date;
  attendedAt?: Date;
}
