/**
 * API Configuration
 */

export const API_CONFIG = {
  BASE_URL: (import.meta.env.VITE_API_BASE_URL as string) || '', // Empty string uses the proxy in dev
  TIMEOUT: 30000, // 30 seconds
  TOKEN_KEY: 'access_token',
  TENANT_ID_KEY: 'tenant_id',
  USER_ID_KEY: 'user_id',
} as const;

export const API_ENDPOINTS = {
  // Auth
  SIGNUP: '/v1/signup',
  LOGIN: '/v1/login',
  
  // Clinics
  CLINICS: '/v1/clinics',
  
  // Health
  HEALTH: '/health',
} as const;
