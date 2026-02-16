import { useState } from 'react';
import { useAuth, useNavigation } from '@/hooks';
import { LoginScreen, RegisterScreen } from '@/features/auth';
import {
  AdminDashboard,
  ClinicsManagement,
  QueuesAndServicePoints,
  UsersManagement,
  PasswordsManagement,
  DeviceManagement,
  Sidebar,
} from '@/features/admin';
import { TVPanel } from '@/features/tv';
import { TVPanelPage } from '@/features/tv-panel/pages/TVPanelPage';
import { PatientApp } from '@/features/patient';
import { LandingPage } from '@/features/landing';
import type { AdminView } from '@/types';

export default function App() {
  console.log('🏁 App component rendering');
  const [showLanding, setShowLanding] = useState(true);
  
  // Check URL hash for public routes (workaround for routing issues)
  const urlPath = window.location.pathname;
  const isPublicRoute = urlPath === '/tv-panel' || urlPath === '/patient';
  
  console.log('🔎 Checking URL:', urlPath, 'isPublicRoute:', isPublicRoute);
  
  // If it's a public route, render it directly without navigation hook
  if (isPublicRoute) {
    console.log('✅ Direct public route detected:', urlPath);
    if (urlPath === '/tv-panel') {
      return <TVPanelPage />;
    }
    if (urlPath === '/patient') {
      return <PatientApp />;
    }
  }
  
  // Get navigation state for authenticated routes
  const { activeView, navigateTo, resetNavigation } = useNavigation();
  console.log('📱 App activeView:', activeView);

  // Double-check for public routes via activeView
  if (activeView === 'tv-panel' || activeView === 'patient') {
    console.log('✅ Public route detected via activeView:', activeView);
    const renderPublicView = () => {
      switch (activeView) {
        case 'tv-panel':
          return <TVPanelPage />;
        case 'patient':
          return <PatientApp />;
        default:
          return null;
      }
    };
    return <div>{renderPublicView()}</div>;
  }

  console.log('🔐 Not a public route, checking auth...');
  // Only run auth hooks if NOT on public routes
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
      case 'service-points':
        return <QueuesAndServicePoints />;
      case 'users':
        return <UsersManagement />;
      case 'passwords':
        return <PasswordsManagement />;
      case 'devices':
        return <DeviceManagement />;
      case 'tv':
        return <TVPanel />;
      default:
        return <AdminDashboard />;
    }
  };

  // Full-screen view for TV (legacy - authenticated)
  if (activeView === 'tv') {
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