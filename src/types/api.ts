/**
 * API Request/Response Types
 * Based on Fastline API documentation
 */

// Auth Types
export interface SignupRequest {
  tenantName: string;
  ownerName: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  tenantId: string;
  ownerId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tenantId: string;
  userId: string;
  userName: string;
  tenantName: string;
  roleKey: string;
}

// Clinic Types
export interface CreateClinicRequest {
  name: string;
  timezone: string;
  addressLine?: string;
  lat?: number;
  lng?: number;
}

export interface CreateClinicResponse {
  id: string;
}

export interface ApiClinic {
  id: string;
  name: string;
  timezone: string;
  addressLine?: string;
  lat?: number;
  lng?: number;
}

export interface ListClinicsResponse {
  clinics: ApiClinic[];
}

// Queue Types
export interface CreateQueueRequest {
  name: string;
  prefix: string;
  avgServiceSeconds: number;
}

export interface CreateQueueResponse {
  id: string;
}

export interface ApiQueue {
  id: string;
  name: string;
  prefix: string;
  avgServiceSeconds: number;
}

export interface ListQueuesResponse {
  queues: ApiQueue[];
}

// Service Point Types
export interface CreateServicePointRequest {
  name: string;
  type: 'ROOM' | 'COUNTER' | 'DOCTOR';
}

export interface CreateServicePointResponse {
  id: string;
}

export interface ApiServicePoint {
  id: string;
  clinicId: string;
  name: string;
  type: 'ROOM' | 'COUNTER' | 'DOCTOR';
  isActive: boolean;
  createdAt: string;
}

export interface ListServicePointsResponse {
  servicePoints: ApiServicePoint[];
}

export interface BindQueueRequest {
  priority: number;
}

// Ticket (Password) Types
export type TicketStatus = 'WAITING' | 'CALLED' | 'IN_SERVICE' | 'FINISHED' | 'CANCELLED' | 'NO_SHOW';
export type TicketPriority = 'NORMAL' | 'HIGH' | 'URGENT';

export interface ApiTicket {
  id: string;
  queueId: string;
  sessionId: string;
  sequenceNumber: number;
  displayCode: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  calledAt?: string;
  startedAt?: string;
  finishedAt?: string;
}

export interface CreateTicketRequest {
  sessionDate?: string;
  priority: TicketPriority;
}

export interface CreateTicketResponse extends ApiTicket {}

export interface CallNextRequest {
  servicePointId?: string;
}

export interface CallNextResponse extends ApiTicket {}

export interface ListTicketsResponse {
  tickets: ApiTicket[];
}

export interface QueueStatus {
  queueId: string;
  waitingCount: number;
  calledCount: number;
  inServiceCount: number;
  completedCount: number;
  avgServiceSeconds: number;
  etaMinutes: number;
}

// Device types
export interface Device {
  id: string;
  clinicId: string;
  name: string;
  type: 'TV_PANEL' | 'KIOSK';
  status: 'PENDING' | 'PAIRED';
  pairingCode?: string;
  apiKey?: string;
  lastSeenAt?: string;
  createdAt: string;
}

export interface CreateDeviceRequest {
  name: string;
  type: 'TV_PANEL' | 'KIOSK';
}

export interface CreateDeviceResponse {
  deviceId: string;
  pairingCode: string;
  expiresAt: string;
}

export interface PairDeviceRequest {
  pairingCode: string;
}

export interface PairDeviceResponse {
  deviceId: string;
  apiKey: string;
}

export interface SetDeviceSubscriptionsRequest {
  queueIds: string[];
}

// TV Panel Snapshot types
export interface SnapshotTicket {
  id: string;
  displayCode: string;
  status: TicketStatus;
  servicePointName?: string;
  createdAt: string;
  calledAt?: string;
}

export interface SnapshotStats {
  waitingCount: number;
  calledCount: number;
  inServiceCount: number;
  completedCount: number;
  etaMinutes: number;
}

export interface QueueSnapshot {
  queueId: string;
  current?: SnapshotTicket;
  waitingTop: SnapshotTicket[];
  recentCalled: SnapshotTicket[];
  stats: SnapshotStats;
}

export interface DeviceSnapshotResponse {
  deviceId: string;
  clinicId: string;
  queues: QueueSnapshot[];
}

// SSE Event types
export interface TicketEvent {
  type: 'ticket.created' | 'ticket.called' | 'ticket.started' | 'ticket.finished' | 'ticket.cancelled' | 'ticket.no_show';
  ticket: ApiTicket;
  queueId: string;
  clinicId: string;
  timestamp: string;
}

// Error Types
export interface ApiErrorResponse {
  error?: string;
  message?: string;
  code?: string;
}

// Health Check
export interface HealthResponse {
  status: string;
  db: boolean;
}
