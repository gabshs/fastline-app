import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { clinicService, ApiError } from '@/services';
import type { ApiClinic, CreateClinicRequest } from '@/types/api';

/**
 * Custom hook for clinic management
 */
export function useClinics() {
  const [clinics, setClinics] = useState<ApiClinic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClinics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await clinicService.listClinics();
      setClinics(data);
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : 'Erro ao carregar clínicas';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createClinic = useCallback(async (data: CreateClinicRequest): Promise<boolean> => {
    try {
      await clinicService.createClinic(data);
      toast.success('Clínica criada com sucesso!');
      
      // Reload clinics list
      await loadClinics();
      return true;
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : 'Erro ao criar clínica';
      toast.error(message);
      return false;
    }
  }, [loadClinics]);

  const updateClinic = useCallback(async (id: string, data: CreateClinicRequest): Promise<boolean> => {
    try {
      await clinicService.updateClinic(id, data);
      toast.success('Clínica atualizada com sucesso!');
      
      // Reload clinics list
      await loadClinics();
      return true;
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : 'Erro ao atualizar clínica';
      toast.error(message);
      return false;
    }
  }, [loadClinics]);

  const deleteClinic = useCallback(async (id: string): Promise<boolean> => {
    try {
      await clinicService.deleteClinic(id);
      toast.success('Clínica excluída com sucesso!');
      
      // Reload clinics list
      await loadClinics();
      return true;
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : 'Erro ao excluir clínica';
      toast.error(message);
      return false;
    }
  }, [loadClinics]);

  // Load clinics on mount
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await clinicService.listClinics();
        if (isMounted) {
          setClinics(data);
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof ApiError 
            ? err.message 
            : 'Erro ao carregar clínicas';
          setError(message);
          toast.error(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    clinics,
    isLoading,
    error,
    loadClinics,
    createClinic,
    updateClinic,
    deleteClinic,
  };
}
