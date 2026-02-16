import { apiClient } from './apiClient';
import type {
  Device,
  CreateDeviceRequest,
  CreateDeviceResponse,
  PairDeviceRequest,
  PairDeviceResponse,
  SetDeviceSubscriptionsRequest,
  DeviceSnapshotResponse,
} from '@/types/api';

class DeviceService {
  /**
   * List devices for a clinic
   */
  async listDevices(clinicId: string): Promise<Device[]> {
    const response = await apiClient.get<Device[]>(
      `/v1/clinics/${clinicId}/devices`
    );
    return response;
  }

  /**
   * Create a new device
   */
  async createDevice(clinicId: string, data: CreateDeviceRequest): Promise<CreateDeviceResponse> {
    const response = await apiClient.post<CreateDeviceResponse>(
      `/v1/clinics/${clinicId}/devices`,
      data
    );
    return response;
  }

  /**
   * Pair a device using pairing code (public route, no JWT required)
   */
  async pairDevice(data: PairDeviceRequest): Promise<PairDeviceResponse> {
    const response = await apiClient.postPublic<PairDeviceResponse>(
      '/v1/devices/pair',
      data
    );
    return response;
  }

  /**
   * Delete a device
   */
  async deleteDevice(clinicId: string, deviceId: string): Promise<void> {
    await apiClient.delete(`/v1/clinics/${clinicId}/devices/${deviceId}`);
  }

  /**
   * Set device subscriptions (which queues to monitor)
   */
  async setSubscriptions(
    clinicId: string,
    deviceId: string,
    data: SetDeviceSubscriptionsRequest
  ): Promise<void> {
    await apiClient.put(
      `/v1/clinics/${clinicId}/devices/${deviceId}/subscriptions`,
      data
    );
  }

  /**
   * Get snapshot of current state for TV panel
   * @param deviceKey - The device API key
   * @param waitingLimit - Number of waiting tickets to show per queue
   * @param recentLimit - Number of recent called tickets to show per queue
   */
  async getSnapshot(
    deviceKey: string,
    waitingLimit = 15,
    recentLimit = 10
  ): Promise<DeviceSnapshotResponse> {
    // Use getPublic since this route uses deviceKey in URL for auth, not JWT
    const response = await apiClient.getPublic<DeviceSnapshotResponse>(
      `/v1/device/${deviceKey}/snapshot?waitingLimit=${waitingLimit}&recentLimit=${recentLimit}`
    );
    return response;
  }

  /**
   * Create EventSource for SSE events
   * @param deviceKey - The device API key
   */
  createEventSource(deviceKey: string): EventSource {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    return new EventSource(`${baseUrl}/v1/device/${deviceKey}/events`);
  }
}

export const deviceService = new DeviceService();
