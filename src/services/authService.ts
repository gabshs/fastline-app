import { apiClient } from './apiClient';
import { API_ENDPOINTS, API_CONFIG } from '@/config/api';
import type { 
  SignupRequest, 
  SignupResponse, 
  LoginRequest, 
  LoginResponse 
} from '@/types/api';
import type { User } from '@/types';

/**
 * Authentication service
 * Handles user authentication, registration with real API
 */

class AuthService {
  /**
   * Register a new tenant (clinic)
   */
  async signup(data: SignupRequest): Promise<User> {
    await apiClient.post<SignupResponse>(
      API_ENDPOINTS.SIGNUP,
      data,
      {},
      false // Don't include auth for signup
    );

    // Return user data
    return {
      email: data.email,
      ownerName: data.ownerName,
      tenantName: data.tenantName,
    };
  }

  /**
   * Authenticate user with email and password
   */
  async login(email: string, password: string): Promise<User> {
    const request: LoginRequest = { email, password };
    
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.LOGIN,
      request,
      {},
      false // Don't include auth for login
    );

    // Store tokens
    localStorage.setItem(API_CONFIG.TOKEN_KEY, response.accessToken);
    localStorage.setItem('refresh_token', response.refreshToken);
    localStorage.setItem('token_expires_at', response.expiresAt.toString());
    localStorage.setItem(API_CONFIG.TENANT_ID_KEY, response.tenantId);
    localStorage.setItem(API_CONFIG.USER_ID_KEY, response.userId);

    // Get user data from login response
    const user: User = {
      email,
      ownerName: response.userName,
      tenantName: response.tenantName,
      roleKey: response.roleKey,
    };

    // Save current user
    this.saveCurrentUser(user);
    
    return user;
  }

  /**
   * Save current user to localStorage
   */
  private saveCurrentUser(user: User): void {
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('current_user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await apiClient.post<{ accessToken: string; expiresAt: number }>(
        '/v1/refresh',
        { refreshToken },
        {},
        false
      );

      localStorage.setItem(API_CONFIG.TOKEN_KEY, response.accessToken);
      localStorage.setItem('token_expires_at', response.expiresAt.toString());
      return true;
    } catch {
      // Refresh token expired or invalid - logout
      this.logout();
      return false;
    }
  }

  /**
   * Check if token is about to expire (within 5 minutes)
   */
  isTokenExpiringSoon(): boolean {
    const expiresAt = localStorage.getItem('token_expires_at');
    if (!expiresAt) return false;

    const expirationTime = parseInt(expiresAt) * 1000; // Convert to milliseconds
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    return expirationTime - now < fiveMinutes;
  }

  /**
   * Logout current user
   */
  logout(): void {
    apiClient.clearAuth();
    localStorage.removeItem('current_user');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  /**
   * Check API health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await apiClient.get<{ status: string; db: boolean }>(
        API_ENDPOINTS.HEALTH
      );
      return response.status === 'ok' && response.db;
    } catch {
      return false;
    }
  }

  /**
   * Get user profile with service point and clinic information
   */
  async getUserProfile(): Promise<{
    userId: string;
    email: string;
    name: string;
    roleKey: string;
    servicePointId?: string;
    servicePointName?: string;
    clinicId?: string;
    clinicName?: string;
  }> {
    return await apiClient.get('/v1/profile');
  }
}

// Export singleton instance
export const authService = new AuthService();
