import { useState, useEffect } from 'react';
import { dashboardService, type DashboardStats } from '@/services/dashboardService';

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err) {
      setError('Erro ao carregar estatísticas');
      console.error('Error loading dashboard stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await dashboardService.getStats();
        if (isMounted) {
          setStats(data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Erro ao carregar estatísticas');
          console.error('Error loading dashboard stats:', err);
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
    stats,
    isLoading,
    error,
    reload: loadStats,
  };
}

// Note: React StrictMode in development intentionally runs effects twice
// to help detect side effects. This is expected behavior and won't happen in production.
