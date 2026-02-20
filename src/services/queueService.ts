/**
 * Queue Service
 * Handles CRUD operations for queues
 */

import { apiClient } from './apiClient';
import type {
  CreateQueueRequest,
  CreateQueueResponse,
  ListQueuesResponse,
  ApiQueue,
} from '@/types/api';

class QueueService {
  /**
   * Create a new queue for a clinic
   */
  async createQueue(clinicId: string, data: CreateQueueRequest): Promise<string> {
    const response = await apiClient.post<CreateQueueResponse>(
      `/v1/clinics/${clinicId}/queues`,
      data
    );
    return response.id;
  }

  /**
   * List all queues for a specific clinic
   */
  async listQueues(clinicId: string): Promise<ApiQueue[]> {
    const response = await apiClient.get<{ queues: ApiQueue[] }>(`/v1/clinics/${clinicId}/queues`);
    return response.queues;
  }

  async listUserQueues(clinicId: string): Promise<ApiQueue[]> {
    const response = await apiClient.get<{ queues: ApiQueue[] }>(`/v1/clinics/${clinicId}/user-queues`);
    return response.queues || [];
  }

  /**
   * Get a single queue by ID
   */
  async getQueue(clinicId: string, id: string): Promise<ApiQueue | null> {
    try {
      const queues = await this.listQueues(clinicId);
      return queues.find(q => q.id === id) || null;
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const queueService = new QueueService();
