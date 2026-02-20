import { useState, useCallback, useEffect } from 'react';
import type { AdminView } from '@/types';
import { ROUTES } from '@/constants';

/**
 * Get initial view from URL path
 */
function getInitialViewFromUrl(): AdminView {
  const path = window.location.pathname;
  
  // Map URL paths to views
  const pathMap: Record<string, AdminView> = {
    '/': 'dashboard',
    '/dashboard': 'dashboard',
    '/clinics': 'clinics',
    '/queues': 'queues',
    '/service-points': 'service-points',
    '/users': 'users',
    '/passwords': 'passwords',
    '/devices': 'devices',
    '/tv': 'tv',
    '/tv-panel': 'tv-panel',
    '/patient': 'patient',
  };
  
  // Check if path exists in map
  if (pathMap[path]) {
    const view = pathMap[path];
    return view;
  }
  
  // If path not found, use dashboard as fallback
  return ROUTES.DASHBOARD;
}

/**
 * Custom hook for navigation management
 */
export function useNavigation() {
  const [activeView, setActiveView] = useState<AdminView>(() => {
    const initial = getInitialViewFromUrl();
    return initial;
  });

  // Update URL when view changes
  useEffect(() => {
    const path = `/${activeView}`;
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  }, [activeView]);

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setActiveView(getInitialViewFromUrl());
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
