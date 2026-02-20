import { useEffect, useRef } from 'react';
import { authService } from '@/services';

/**
 * Hook to automatically refresh access token when it's about to expire
 * Checks every minute if token needs refresh
 */
export function useTokenRefresh() {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      // Only check if user is authenticated
      if (!authService.isAuthenticated()) {
        return;
      }

      // Check if token is expiring soon (within 5 minutes)
      if (authService.isTokenExpiringSoon()) {
        console.log('🔄 Token expiring soon, refreshing...');
        const success = await authService.refreshToken();
        
        if (success) {
          console.log('✅ Token refreshed successfully');
        } else {
          console.log('❌ Failed to refresh token, user will be logged out');
        }
      }
    };

    // Check immediately on mount
    checkAndRefreshToken();

    // Check every minute
    intervalRef.current = setInterval(checkAndRefreshToken, 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
}
