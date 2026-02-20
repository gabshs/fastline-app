import { Building2, Users, ListOrdered, Key, LayoutDashboard, User, LogOut, Monitor, ChevronRight } from 'lucide-react';
import filaProLogo from '@/assets/images/logo.svg';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout?: () => void;
  userName?: string;
  tenantName?: string;
  userRole?: string;
}

export function Sidebar({ activeView, onViewChange, onLogout, userName, tenantName, userRole }: SidebarProps) {
  // Mapeamento de roleKey para nomes em português
  const roleNames: Record<string, string> = {
    'OWNER': 'Proprietário',
    'ADMIN': 'Administrador',
    'SUPERVISOR': 'Supervisor',
    'STAFF': 'Atendente',
    'VIEWER': 'Visualizador',
  };

  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['OWNER', 'ADMIN', 'SUPERVISOR', 'VIEWER'] },
    { id: 'clinics', label: 'Clínicas', icon: Building2, roles: ['OWNER', 'ADMIN'] },
    { id: 'users', label: 'Usuários', icon: Users, roles: ['OWNER', 'ADMIN'] },
    { id: 'queues', label: 'Filas e Atendimento', icon: ListOrdered, roles: ['OWNER', 'ADMIN', 'SUPERVISOR'] },
    { id: 'passwords', label: 'Gestão de Senhas', icon: Key, roles: ['OWNER', 'ADMIN', 'SUPERVISOR', 'STAFF'] },
    { id: 'devices', label: 'Dispositivos', icon: Monitor, roles: ['OWNER', 'ADMIN', 'SUPERVISOR'] },
    { id: 'patient', label: 'App Paciente', icon: User, roles: ['OWNER', 'ADMIN', 'SUPERVISOR', 'VIEWER'] },
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => 
    !userRole || item.roles.includes(userRole)
  );

  // Get role display name
  const roleDisplayName = userRole ? roleNames[userRole] || 'Usuário' : 'Usuário';

  return (
    <div className="bg-gradient-to-b from-[var(--sidebar-bg-start)] to-[var(--sidebar-bg-end)] text-white w-72 h-screen flex flex-col shadow-2xl fixed left-0 top-0">
      {/* Header - Logo */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-center">
          <img 
            src={filaProLogo} 
            alt="FilaPro" 
            className="w-56 h-auto"
          />
        </div>
      </div>

      {/* User Info Card */}
      {(userName || tenantName) && (
        <div className="mx-4 mb-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
          <div>
            <p className="text-sm font-semibold text-[var(--sidebar-text)] truncate">{userName || 'Usuário'}</p>
            <p className="text-xs text-[var(--sidebar-text-muted)] mt-1">{roleDisplayName}</p>
          </div>
          {tenantName && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-xs text-blue-400">Grupo</p>
              <p className="text-xs text-[var(--sidebar-text-muted)] truncate">{tenantName}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Navigation - Scrollable */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center justify-between px-6 py-3.5 transition-all duration-200 group ${
                activeView === item.id
                  ? 'bg-blue-600/20 text-blue-400 rounded-lg border-l-4 border-blue-500'
                  : 'text-[var(--sidebar-text-muted)] hover:bg-white/5 hover:text-[var(--sidebar-text)]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    activeView === item.id ? 'text-blue-400' : 'text-[var(--sidebar-text-muted)] group-hover:text-[var(--sidebar-text)]'
                  }`} 
                />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {isActive && (
                <ChevronRight className="w-4 h-4 text-blue-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Button - Fixed at bottom */}
      {onLogout && (
        <div className="p-4 mt-auto">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-medium">Sair da Conta</span>
          </button>
        </div>
      )}
    </div>
  );
}