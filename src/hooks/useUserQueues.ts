import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { queueService, ApiError } from '@/services';
import type { ApiQueue } from '@/types/api';

/**
 * Custom hook for user-specific queue management
 * Returns queues based on user role:
 * - STAFF: only queues linked to their service point
 * - Others: all queues from the clinic
 */
export function useUserQueues(clinicId: string | null) {
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
      const data = await queueService.listUserQueues(clinicId);
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

  // Load queues when clinicId changes
  useEffect(() => {
    loadQueues();
  }, [loadQueues]);

  return {
    queues,
    isLoading,
    error,
    loadQueues,
  };
}
