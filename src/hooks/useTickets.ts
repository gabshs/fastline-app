import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { ticketService, ApiError } from '@/services';
import type { ApiTicket, QueueStatus, TicketStatus } from '@/types/api';

/**
 * Custom hook for ticket (password) management
 */
export function useTickets(clinicId: string | null, queueId: string | null) {
  const [tickets, setTickets] = useState<ApiTicket[]>([]);
  const [currentTicket, setCurrentTicket] = useState<ApiTicket | null>(null);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = useCallback(async (status?: TicketStatus) => {
    if (!clinicId || !queueId) {
      setTickets([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await ticketService.listTickets(clinicId, queueId, status);
      setTickets(data);
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : 'Erro ao carregar senhas';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [clinicId, queueId]);

  const loadCurrent = useCallback(async () => {
    if (!clinicId || !queueId) {
      setCurrentTicket(null);
      return;
    }

    try {
      const data = await ticketService.getCurrent(clinicId, queueId);
      setCurrentTicket(data);
    } catch (err) {
      setCurrentTicket(null);
    }
  }, [clinicId, queueId]);

  const loadStatus = useCallback(async () => {
    if (!clinicId || !queueId) {
      setQueueStatus(null);
      return;
    }

    try {
      const data = await ticketService.getQueueStatus(clinicId, queueId);
      setQueueStatus(data);
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : 'Erro ao carregar estatísticas';
      console.error('Error loading queue status:', message, err);
      setQueueStatus(null);
    }
  }, [clinicId, queueId]);

  const callNext = useCallback(async (servicePointId?: string): Promise<ApiTicket | null> => {
    if (!clinicId || !queueId) {
      toast.error('Selecione uma clínica e fila primeiro');
      return null;
    }

    try {
      const ticket = await ticketService.callNext(clinicId, queueId, servicePointId);
      toast.success(`Senha ${ticket.displayCode} chamada!`);
      
      // Reload data
      await Promise.all([loadTickets('WAITING'), loadCurrent(), loadStatus()]);
      return ticket;
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : 'Erro ao chamar próxima senha';
      toast.error(message);
      return null;
    }
  }, [clinicId, queueId, loadTickets, loadCurrent, loadStatus]);

  const recall = useCallback(async (ticketId: string): Promise<boolean> => {
    try {
      await ticketService.recall(ticketId);
      toast.success('Senha rechamada!');
      await Promise.all([loadCurrent(), loadStatus()]);
      return true;
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : 'Erro ao rechamar senha';
      toast.error(message);
      return false;
    }
  }, [loadCurrent, loadStatus]);

  const start = useCallback(async (ticketId: string): Promise<boolean> => {
    try {
      await ticketService.start(ticketId);
      toast.success('Atendimento iniciado!');
      await Promise.all([loadCurrent(), loadStatus()]);
      return true;
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : 'Erro ao iniciar atendimento';
      toast.error(message);
      return false;
    }
  }, [loadCurrent, loadStatus]);

  const finish = useCallback(async (ticketId: string): Promise<boolean> => {
    try {
      await ticketService.finish(ticketId);
      toast.success('Atendimento finalizado!');
      await Promise.all([loadTickets('WAITING'), loadCurrent(), loadStatus()]);
      return true;
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : 'Erro ao finalizar atendimento';
      toast.error(message);
      return false;
    }
  }, [loadTickets, loadCurrent, loadStatus]);

  const noShow = useCallback(async (ticketId: string): Promise<boolean> => {
    try {
      await ticketService.noShow(ticketId);
      toast.success('Marcado como não compareceu');
      await Promise.all([loadTickets('WAITING'), loadCurrent(), loadStatus()]);
      return true;
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : 'Erro ao marcar como não compareceu';
      toast.error(message);
      return false;
    }
  }, [loadTickets, loadCurrent, loadStatus]);

  const cancel = useCallback(async (ticketId: string): Promise<boolean> => {
    try {
      await ticketService.cancel(ticketId);
      toast.success('Senha cancelada');
      await Promise.all([loadTickets('WAITING'), loadStatus()]);
      return true;
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : 'Erro ao cancelar senha';
      toast.error(message);
      return false;
    }
  }, [loadTickets, loadStatus]);

  const createTicket = useCallback(async (priority: 'NORMAL' | 'HIGH' | 'URGENT', sessionDate?: string): Promise<boolean> => {
    if (!clinicId || !queueId) {
      toast.error('Selecione uma clínica e fila primeiro');
      return false;
    }

    try {
      const ticket = await ticketService.createTicket(clinicId, queueId, {
        priority,
        sessionDate,
      });
      toast.success(`Senha ${ticket.displayCode} criada com sucesso!`);
      await Promise.all([loadTickets('WAITING'), loadStatus()]);
      return true;
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : 'Erro ao criar senha';
      toast.error(message);
      return false;
    }
  }, [clinicId, queueId, loadTickets, loadStatus]);

  // Load initial data when clinicId or queueId changes
  useEffect(() => {
    if (clinicId && queueId) {
      loadTickets('WAITING');
      loadCurrent();
      loadStatus();
    }
  }, [clinicId, queueId, loadTickets, loadCurrent, loadStatus]);

  return {
    tickets,
    currentTicket,
    queueStatus,
    isLoading,
    error,
    loadTickets,
    loadCurrent,
    loadStatus,
    callNext,
    recall,
    start,
    finish,
    noShow,
    cancel,
    createTicket,
  };
}
