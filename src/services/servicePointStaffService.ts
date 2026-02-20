import { apiClient } from './apiClient';

export interface StaffMember {
  userId: string;
  name: string;
  email: string;
}

export interface ServicePointStaffResponse {
  staff: StaffMember[];
}

class ServicePointStaffService {
  async getServicePointStaff(servicePointId: string): Promise<StaffMember[]> {
    const response = await apiClient.get<ServicePointStaffResponse>(`/v1/service-points/${servicePointId}/staff`);
    return response.staff;
  }

  async getAvailableStaff(): Promise<StaffMember[]> {
    const response = await apiClient.get<ServicePointStaffResponse>('/v1/staff/available');
    return response.staff;
  }

  async assignStaff(servicePointId: string, userId: string): Promise<void> {
    await apiClient.post(`/v1/service-points/${servicePointId}/staff`, { userId });
  }

  async removeStaff(servicePointId: string, userId: string): Promise<void> {
    await apiClient.delete(`/v1/service-points/${servicePointId}/staff/${userId}`);
  }
}

export const servicePointStaffService = new ServicePointStaffService();
