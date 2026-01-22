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
   * Update a clinic (placeholder - implement when API supports it)
   */
  async updateClinic(id: string, data: Partial<CreateClinicRequest>): Promise<void> {
    // TODO: Implement when API provides PUT /v1/clinics/:id
    console.warn('Update clinic not implemented in API yet', id, data);
    throw new Error('Update clinic not implemented in API yet');
  }

  /**
   * Delete a clinic (placeholder - implement when API supports it)
   */
  async deleteClinic(id: string): Promise<void> {
    // TODO: Implement when API provides DELETE /v1/clinics/:id
    console.warn('Delete clinic not implemented in API yet', id);
    throw new Error('Delete clinic not implemented in API yet');
  }
}

// Export singleton instance
export const clinicService = new ClinicService();
