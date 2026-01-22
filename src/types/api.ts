/**
 * API Request/Response Types
 * Based on Fastline API documentation
 */

// Auth Types
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  tenant_id: string;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  expires_at: string;
  tenant_id: string;
  user_id: string;
}

// Clinic Types
export interface CreateClinicRequest {
  name: string;
  timezone: string;
  address_line?: string;
  lat?: number;
  lng?: number;
}

export interface CreateClinicResponse {
  id: string;
}

export interface ApiClinic {
  id: string;
  name: string;
  timezone: string;
  address_line?: string;
  lat?: number;
  lng?: number;
  is_active: boolean;
  created_at: string;
}

export interface ListClinicsResponse {
  clinics: ApiClinic[];
}

// Error Types
export interface ApiErrorResponse {
  error?: string;
  message?: string;
  code?: string;
}

// Health Check
export interface HealthResponse {
  status: string;
  db: boolean;
}
