import { useState } from 'react';
import { useAuth, useNavigation } from '@/hooks';
import { LoginScreen, RegisterScreen } from '@/features/auth';
import {
  AdminDashboard,
  ClinicsManagement,
  QueuesManagement,
  UsersManagement,
  PasswordsManagement,
  Sidebar,
} from '@/features/admin';
import { TVPanel } from '@/features/tv';
import { PatientApp } from '@/features/patient';
import { LandingPage } from '@/features/landing';
import type { AdminView } from '@/types';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  
  const {
    isAuthenticated,
    currentUser,
    authView,
    isLoading,
    login,
    register,
    logout,
    switchAuthView,
  } = useAuth();

  const { activeView, navigateTo, resetNavigation } = useNavigation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }

  // Show landing page first if user is not authenticated and hasn't dismissed it
  if (!isAuthenticated && showLanding) {
    return (
      <LandingPage
        onNavigateToLogin={() => {
          setShowLanding(false);
          switchAuthView('login');
        }}
        onNavigateToRegister={() => {
          setShowLanding(false);
          switchAuthView('register');
        }}
      />
    );
  }

  // If not authenticated, show auth screens
  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <LoginScreen
          onLogin={(email, password) => login(email, password)}
          onNavigateToRegister={() => switchAuthView('register')}
          onNavigateBack={() => setShowLanding(true)}
        />
      );
    } else {
      return (
        <RegisterScreen
          onRegister={(data) => register(data)}
          onNavigateToLogin={() => switchAuthView('login')}
          onNavigateBack={() => setShowLanding(true)}
        />
      );
    }
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'clinics':
        return <ClinicsManagement />;
      case 'queues':
        return <QueuesManagement />;
      case 'users':
        return <UsersManagement />;
      case 'passwords':
        return <PasswordsManagement />;
      case 'tv':
        return <TVPanel />;
      case 'patient':
        return <PatientApp />;
      default:
        return <AdminDashboard />;
    }
  };

  // Full-screen views (TV and Patient)
  if (activeView === 'tv' || activeView === 'patient') {
    return <div>{renderView()}</div>;
  }

  const handleLogout = () => {
    logout();
    resetNavigation();
    setShowLanding(true); // Show landing page again after logout
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeView={activeView}
        onViewChange={(view) => navigateTo(view as AdminView)}
        onLogout={handleLogout}
        userName={currentUser?.ownerName}
        tenantName={currentUser?.tenantName}
      />
      <div className="flex-1">{renderView()}</div>
    </div>
  );
}