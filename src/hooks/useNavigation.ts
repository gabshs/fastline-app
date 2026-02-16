import { useState, useCallback, useEffect } from 'react';
import type { AdminView } from '@/types';
import { ROUTES } from '@/constants';

/**
 * Get initial view from URL path
 */
function getInitialViewFromUrl(): AdminView {
  const path = window.location.pathname;
  console.log('🔍 Current URL path:', path);
  
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
    console.log('📍 Mapped to view:', view);
    return view;
  }
  
  // If path not found, use dashboard as fallback
  console.log('⚠️ Path not found in map, using dashboard fallback');
  return ROUTES.DASHBOARD;
}

/**
 * Custom hook for navigation management
 */
export function useNavigation() {
  const [activeView, setActiveView] = useState<AdminView>(() => {
    const initial = getInitialViewFromUrl();
    console.log('🚀 useNavigation initialized with view:', initial);
    return initial;
  });

  // Update URL when view changes
  useEffect(() => {
    const path = `/${activeView}`;
    console.log('🔄 activeView changed to:', activeView, 'current path:', window.location.pathname);
    if (window.location.pathname !== path) {
      console.log('⚠️ Updating URL from', window.location.pathname, 'to', path);
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
