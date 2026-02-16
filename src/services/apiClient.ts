/**
 * HTTP Client with interceptors and error handling
 */

import { API_CONFIG } from '@/config/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Get authorization headers with token
   */
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem(API_CONFIG.TOKEN_KEY);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Handle HTTP response and errors
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      this.clearAuth();
      
      // Don't redirect to login if we're on a public route
      const currentPath = window.location.pathname;
      const isPublicRoute = currentPath === '/tv-panel' || currentPath === '/patient';
      
      if (!isPublicRoute) {
        window.location.href = '/login';
      }
      
      throw new ApiError(401, 'Sessão expirada. Faça login novamente.');
    }

    // Parse response body
    const contentType = response.headers.get('content-type');
    const hasJson = contentType?.includes('application/json');
    const data = hasJson ? await response.json() : await response.text();

    // Handle error responses
    if (!response.ok) {
      const errorMessage = 
        data?.error || 
        data?.message || 
        data || 
        `Request failed with status ${response.status}`;
      
      throw new ApiError(response.status, errorMessage, data?.code);
    }

    return data as T;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: controller.signal,
        ...options,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout');
      }
      const message = error instanceof Error ? error.message : 'Network error';
      throw new ApiError(0, message);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * GET request without authentication (for public routes like device snapshot)
   */
  async getPublic<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        ...options,
      });

      // For public routes, don't redirect on 401
      if (response.status === 401) {
        const data = await response.json().catch(() => ({}));
        throw new ApiError(401, data?.error || 'Unauthorized', data?.code);
      }

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout');
      }
      const message = error instanceof Error ? error.message : 'Network error';
      throw new ApiError(0, message);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * POST request without authentication (for public routes like device pairing)
   */
  async postPublic<T>(
    endpoint: string,
    body?: unknown,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        ...options,
      });

      // For public routes, don't redirect on 401
      if (response.status === 401) {
        const data = await response.json().catch(() => ({}));
        throw new ApiError(401, data?.error || 'Unauthorized', data?.code);
      }

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout');
      }
      const message = error instanceof Error ? error.message : 'Network error';
      throw new ApiError(0, message);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options: RequestInit = {},
    includeAuth = true
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = this.getHeaders(includeAuth);
      
      console.log('API POST Request:', {
        url,
        method: 'POST',
        headers,
        body,
      });

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit',
        ...options,
      });

      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error('API Error:', error);
      if (error instanceof ApiError) throw error;
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout');
      }
      const message = error instanceof Error ? error.message : 'Network error';
      throw new ApiError(0, message);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        ...options,
      });

      return await this.handleResponse<T>(response);
    } catch (error: unknown) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout');
      }
      const message = error instanceof Error ? error.message : 'Network error';
      throw new ApiError(0, message);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * DELETE request
   */
  async delete<T = void>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        signal: controller.signal,
        ...options,
      });

      return await this.handleResponse<T>(response);
    } catch (error: unknown) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout');
      }
      const message = error instanceof Error ? error.message : 'Network error';
      throw new ApiError(0, message);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Clear authentication data
   */
  clearAuth(): void {
    localStorage.removeItem(API_CONFIG.TOKEN_KEY);
    localStorage.removeItem(API_CONFIG.TENANT_ID_KEY);
    localStorage.removeItem(API_CONFIG.USER_ID_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(API_CONFIG.TOKEN_KEY);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
