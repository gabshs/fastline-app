import { useState, useEffect, useCallback } from 'react';
import { deviceService } from '@/services';
import type { Device } from '@/types/api';

export function useDevices(clinicId: string | null) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDevices = useCallback(async () => {
    if (!clinicId) {
      setDevices([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await deviceService.listDevices(clinicId);
      setDevices(data);
    } catch (err) {
      setError('Erro ao carregar dispositivos');
      console.error('Error loading devices:', err);
    } finally {
      setIsLoading(false);
    }
  }, [clinicId]);

  useEffect(() => {
    if (!clinicId) {
      setDevices([]);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await deviceService.listDevices(clinicId);
        if (isMounted) {
          setDevices(data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Erro ao carregar dispositivos');
          console.error('Error loading devices:', err);
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
  }, [clinicId]);

  return {
    devices,
    isLoading,
    error,
    reload: loadDevices,
  };
}
