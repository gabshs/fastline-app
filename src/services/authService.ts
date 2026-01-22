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
    const response = await apiClient.post<SignupResponse>(
      API_ENDPOINTS.SIGNUP,
      data,
      {},
      false // Don't include auth for signup
    );

    // Return user data
    return {
      email: response.email,
      ownerName: response.name,
      tenantName: response.name,
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
    localStorage.setItem(API_CONFIG.TOKEN_KEY, response.access_token);
    localStorage.setItem(API_CONFIG.TENANT_ID_KEY, response.tenant_id);
    localStorage.setItem(API_CONFIG.USER_ID_KEY, response.user_id);

    // Get user data (for now, store email only, could fetch more from API later)
    const user: User = {
      email,
      ownerName: email.split('@')[0], // Extract name from email for now
      tenantName: response.tenant_id,
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
   * Logout current user
   */
  logout(): void {
    apiClient.clearAuth();
    localStorage.removeItem('current_user');
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
}

// Export singleton instance
export const authService = new AuthService();
