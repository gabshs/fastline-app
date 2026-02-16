import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { servicePointService, ApiError } from '@/services';
import type { ApiServicePoint, CreateServicePointRequest } from '@/types/api';

/**
 * Custom hook for service point management
 */
export function useServicePoints(clinicId: string | null) {
  const [servicePoints, setServicePoints] = useState<ApiServicePoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadServicePoints = useCallback(async () => {
    if (!clinicId) {
      setServicePoints([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await servicePointService.listServicePoints(clinicId);
      setServicePoints(data);
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : 'Erro ao carregar pontos de atendimento';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [clinicId]);

  const createServicePoint = useCallback(async (data: CreateServicePointRequest): Promise<boolean> => {
    if (!clinicId) {
      toast.error('Selecione uma clínica primeiro');
      return false;
    }

    try {
      await servicePointService.createServicePoint(clinicId, data);
      toast.success('Ponto de atendimento criado com sucesso!');
      
      // Reload service points list
      await loadServicePoints();
      return true;
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : 'Erro ao criar ponto de atendimento';
      toast.error(message);
      return false;
    }
  }, [clinicId, loadServicePoints]);

  // Load service points when clinicId changes
  useEffect(() => {
    loadServicePoints();
  }, [loadServicePoints]);

  return {
    servicePoints,
    isLoading,
    error,
    loadServicePoints,
    createServicePoint,
  };
}
