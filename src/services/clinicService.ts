/**
 * Clinic Service
 * Handles CRUD operations for clinics
 */

import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/config/api';
import type {
  CreateClinicRequest,
  CreateClinicResponse,
  ListClinicsResponse,
  ApiClinic,
} from '@/types/api';

class ClinicService {
  /**
   * Create a new clinic
   */
  async createClinic(data: CreateClinicRequest): Promise<string> {
    const response = await apiClient.post<CreateClinicResponse>(
      API_ENDPOINTS.CLINICS,
      data
    );
    return response.id;
  }

  /**
   * List all clinics for the current tenant
   */
  async listClinics(): Promise<ApiClinic[]> {
    const response = await apiClient.get<ListClinicsResponse>(
      API_ENDPOINTS.CLINICS
    );
    return response.clinics || [];
  }

  /**
   * Get a single clinic by ID
   */
  async getClinic(id: string): Promise<ApiClinic | null> {
    try {
      const clinics = await this.listClinics();
      return clinics.find(c => c.id === id) || null;
    } catch {
      return null;
    }
  }

  /**
   * Update a clinic
   */
  async updateClinic(id: string, data: Partial<CreateClinicRequest>): Promise<void> {
    await apiClient.put(
      `${API_ENDPOINTS.CLINICS}/${id}`,
      data
    );
  }

  /**
   * Delete a clinic
   */
  async deleteClinic(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.CLINICS}/${id}`);
  }
}

// Export singleton instance
export const clinicService = new ClinicService();
