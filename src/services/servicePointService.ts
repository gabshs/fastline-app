/**
 * Service Point Service
 * Handles CRUD operations for service points
 */

import { apiClient } from './apiClient';
import type {
  CreateServicePointRequest,
  CreateServicePointResponse,
  ListServicePointsResponse,
  ApiServicePoint,
} from '@/types/api';

class ServicePointService {
  /**
   * Create a new service point for a clinic
   */
  async createServicePoint(clinicId: string, data: CreateServicePointRequest): Promise<string> {
    const response = await apiClient.post<CreateServicePointResponse>(
      `/v1/clinics/${clinicId}/service-points`,
      data
    );
    return response.id;
  }

  /**
   * List all service points for a specific clinic
   */
  async listServicePoints(clinicId: string): Promise<ApiServicePoint[]> {
    const response = await apiClient.get<ListServicePointsResponse>(
      `/v1/clinics/${clinicId}/service-points`
    );
    return response.servicePoints || [];
  }

  /**
   * Get a single service point by ID
   */
  async getServicePoint(clinicId: string, id: string): Promise<ApiServicePoint | null> {
    try {
      const servicePoints = await this.listServicePoints(clinicId);
      return servicePoints.find(sp => sp.id === id) || null;
    } catch {
      return null;
    }
  }

  /**
   * Bind a queue to a service point
   */
  async bindQueue(
    clinicId: string,
    servicePointId: string,
    queueId: string,
    priority: number = 1
  ): Promise<void> {
    await apiClient.post(
      `/v1/clinics/${clinicId}/service-points/${servicePointId}/queues/${queueId}`,
      { priority }
    );
  }

  /**
   * Get queues bound to a service point
   */
  async getServicePointQueues(
    clinicId: string,
    servicePointId: string
  ): Promise<string[]> {
    const response = await apiClient.get<{ queues: Array<{ queueId: string; priority: number }> }>(
      `/v1/clinics/${clinicId}/service-points/${servicePointId}/queues`
    );
    return response.queues.map(q => q.queueId);
  }
}

// Export singleton instance
export const servicePointService = new ServicePointService();
