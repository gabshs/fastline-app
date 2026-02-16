/**
 * Ticket Service
 * Handles all ticket (password) operations
 */

import { apiClient } from './apiClient';
import type {
  CreateTicketRequest,
  CreateTicketResponse,
  CallNextResponse,
  ListTicketsResponse,
  ApiTicket,
  QueueStatus,
  TicketStatus,
} from '@/types/api';

class TicketService {
  /**
   * Create a new ticket for a queue
   */
  async createTicket(
    clinicId: string,
    queueId: string,
    data: CreateTicketRequest
  ): Promise<ApiTicket> {
    const response = await apiClient.post<CreateTicketResponse>(
      `/v1/clinics/${clinicId}/queues/${queueId}/tickets`,
      data
    );
    return response;
  }

  /**
   * Call next ticket in queue
   */
  async callNext(
    clinicId: string,
    queueId: string,
    servicePointId?: string
  ): Promise<ApiTicket> {
    const response = await apiClient.post<CallNextResponse>(
      `/v1/clinics/${clinicId}/queues/${queueId}/tickets/next`,
      { servicePointId }
    );
    return response;
  }

  /**
   * List tickets by status
   */
  async listTickets(
    clinicId: string,
    queueId: string,
    status?: TicketStatus,
    limit?: number
  ): Promise<ApiTicket[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const url = `/v1/clinics/${clinicId}/queues/${queueId}/tickets${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<ListTicketsResponse>(url);
    return response.tickets || [];
  }

  /**
   * List recently called tickets
   */
  async listRecentCalled(
    clinicId: string,
    queueId: string,
    limit: number = 10
  ): Promise<ApiTicket[]> {
    const response = await apiClient.get<ListTicketsResponse>(
      `/v1/clinics/${clinicId}/queues/${queueId}/tickets/recent?limit=${limit}`
    );
    return response.tickets || [];
  }

  /**
   * Get current ticket (CALLED or IN_SERVICE)
   */
  async getCurrent(clinicId: string, queueId: string): Promise<ApiTicket | null> {
    try {
      const response = await apiClient.get<ApiTicket>(
        `/v1/clinics/${clinicId}/queues/${queueId}/tickets/current`
      );
      return response;
    } catch {
      return null;
    }
  }

  /**
   * Get queue status with counts and ETA
   */
  async getQueueStatus(clinicId: string, queueId: string): Promise<QueueStatus> {
    const response = await apiClient.get<QueueStatus>(
      `/v1/clinics/${clinicId}/queues/${queueId}/tickets/status`
    );
    return response;
  }

  /**
   * Recall a ticket
   */
  async recall(ticketId: string): Promise<ApiTicket> {
    const response = await apiClient.post<ApiTicket>(
      `/v1/tickets/${ticketId}/recall`,
      {}
    );
    return response;
  }

  /**
   * Start service for a ticket
   */
  async start(ticketId: string): Promise<ApiTicket> {
    const response = await apiClient.post<ApiTicket>(
      `/v1/tickets/${ticketId}/start`,
      {}
    );
    return response;
  }

  /**
   * Finish service for a ticket
   */
  async finish(ticketId: string): Promise<ApiTicket> {
    const response = await apiClient.post<ApiTicket>(
      `/v1/tickets/${ticketId}/finish`,
      {}
    );
    return response;
  }

  /**
   * Mark ticket as no-show
   */
  async noShow(ticketId: string): Promise<ApiTicket> {
    const response = await apiClient.post<ApiTicket>(
      `/v1/tickets/${ticketId}/no-show`,
      {}
    );
    return response;
  }

  /**
   * Cancel a ticket
   */
  async cancel(ticketId: string): Promise<ApiTicket> {
    const response = await apiClient.post<ApiTicket>(
      `/v1/tickets/${ticketId}/cancel`,
      {}
    );
    return response;
  }
}

// Export singleton instance
export const ticketService = new TicketService();
