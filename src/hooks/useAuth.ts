import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { authService, ApiError } from '@/services';
import { MESSAGES } from '@/constants';
import type { User, AuthView } from '@/types';
import type { SignupRequest } from '@/types/api';

/**
 * Custom hook for authentication management with real API
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = authService.getCurrentUser();
          if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
          } else {
            // Token exists but no user data, logout
            authService.logout();
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await authService.login(email, password);
      setIsAuthenticated(true);
      setCurrentUser(user);
      toast.success(MESSAGES.LOGIN_SUCCESS(user.ownerName));
      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          toast.error('Email ou senha incorretos');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Erro ao fazer login. Tente novamente.');
      }
      return false;
    }
  }, []);

  const register = useCallback(async (data: SignupRequest): Promise<boolean> => {
    try {
      const user = await authService.signup(data);
      
      // Auto-login after successful registration
      const loginSuccess = await login(data.email, data.password);
      
      if (loginSuccess) {
        toast.success(MESSAGES.REGISTER_SUCCESS(user.ownerName));
        return true;
      }
      
      return false;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 400) {
          toast.error('Este email já está cadastrado ou dados inválidos');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Erro ao criar conta. Tente novamente.');
      }
      return false;
    }
  }, [login]);

  const logout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    toast.success(MESSAGES.LOGOUT_SUCCESS);
  }, []);

  const switchAuthView = useCallback((view: AuthView) => {
    setAuthView(view);
  }, []);

  return {
    isAuthenticated,
    currentUser,
    authView,
    isLoading,
    login,
    register,
    logout,
    switchAuthView,
  };
}
