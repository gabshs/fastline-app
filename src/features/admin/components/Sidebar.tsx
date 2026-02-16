import { Building2, Users, ListOrdered, Key, LayoutDashboard, Tv, User, LogOut, Monitor } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout?: () => void;
  userName?: string;
  tenantName?: string;
}

export function Sidebar({ activeView, onViewChange, onLogout, userName, tenantName }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clinics', label: 'Clínicas', icon: Building2 },
    { id: 'queues', label: 'Filas e Atendimento', icon: ListOrdered },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'passwords', label: 'Gestão de Senhas', icon: Key },
    { id: 'devices', label: 'Dispositivos', icon: Monitor },
    { id: 'tv', label: 'Painel TV', icon: Tv },
    { id: 'patient', label: 'App Paciente', icon: User },
  ];

  return (
    <div className="bg-blue-900 text-white w-64 min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl">FastLine</h1>
        <p className="text-blue-300 text-sm mt-1">Gestão de Filas</p>
      </div>

      {(userName || tenantName) && (
        <div className="mb-6 p-4 bg-blue-800 rounded-lg">
          <p className="text-sm text-blue-200 mb-1">Conta</p>
          <p className="font-medium text-sm">{userName}</p>
          <p className="text-xs text-blue-300 mt-1">{tenantName}</p>
        </div>
      )}
      
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-800 text-white'
                  : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {onLogout && (
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors mt-4 border-t border-blue-800 pt-4"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      )}
    </div>
  );
}