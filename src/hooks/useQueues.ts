import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { queueService, ApiError } from '@/services';
import type { ApiQueue, CreateQueueRequest } from '@/types/api';

/**
 * Custom hook for queue management
 */
export function useQueues(clinicId: string | null) {
  const [queues, setQueues] = useState<ApiQueue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQueues = useCallback(async () => {
    if (!clinicId) {
      setQueues([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await queueService.listQueues(clinicId);
      setQueues(data);
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : 'Erro ao carregar filas';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [clinicId]);

  const createQueue = useCallback(async (data: CreateQueueRequest): Promise<boolean> => {
    if (!clinicId) {
      toast.error('Selecione uma clínica primeiro');
      return false;
    }

    try {
      await queueService.createQueue(clinicId, data);
      toast.success('Fila criada com sucesso!');
      
      // Reload queues list
      await loadQueues();
      return true;
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : 'Erro ao criar fila';
      toast.error(message);
      return false;
    }
  }, [clinicId, loadQueues]);

  // Load queues when clinicId changes
  useEffect(() => {
    loadQueues();
  }, [loadQueues]);

  return {
    queues,
    isLoading,
    error,
    loadQueues,
    createQueue,
  };
}
