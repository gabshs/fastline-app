import { useState, useCallback } from 'react';
import type { AdminView } from '@/types';
import { ROUTES } from '@/constants';

/**
 * Custom hook for navigation management
 */
export function useNavigation() {
  const [activeView, setActiveView] = useState<AdminView>(ROUTES.DASHBOARD);

  const navigateTo = useCallback((view: AdminView) => {
    setActiveView(view);
  }, []);

  const resetNavigation = useCallback(() => {
    setActiveView(ROUTES.DASHBOARD);
  }, []);

  return {
    activeView,
    navigateTo,
    resetNavigation,
  };
}
