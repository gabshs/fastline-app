import { apiClient } from './apiClient';

export interface DashboardStats {
  totalClinics: number;
  totalQueues: number;
  totalTicketsToday: number;
  totalTicketsCompleted: number;
  averageWaitTime: number;
  maxWaitTime: number;
  activeQueues: ActiveQueueInfo[];
  recentActivity: ActivityLog[];
  ticketsByHour: HourlyTickets[];
  
  // New metrics
  ticketsByStatus: TicketStatusCount;
  comparisonYesterday: ComparisonData;
  abandonmentRate: number;
  ticketsLast7Days: DailyTickets[];
  topQueues: QueueRanking[];
}

export interface ActiveQueueInfo {
  queueID: string;
  queueName: string;
  clinicName: string;
  waitingCount: number;
  avgWaitTime: number;
}

export interface ActivityLog {
  action: string;
  details: string;
  timestamp: string;
}

export interface HourlyTickets {
  hour: number;
  count: number;
}

export interface TicketStatusCount {
  waiting: number;
  called: number;
  started: number;
  completed: number;
  expired: number;
}

export interface ComparisonData {
  ticketsChange: number;
  ticketsChangePerc: number;
  avgWaitChange: number;
  completedChange: number;
}

export interface DailyTickets {
  date: string;
  count: number;
}

export interface QueueRanking {
  queueName: string;
  clinicName: string;
  totalCount: number;
}

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    return await apiClient.get<DashboardStats>('/v1/dashboard/stats');
  }
}

export const dashboardService = new DashboardService();
