import { Building2, Users, Clock, TrendingUp } from 'lucide-react';
import { StatCard } from './StatCard';

export function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl">Dashboard</h2>
        <p className="text-gray-600 mt-2">Visão geral do sistema FastLine</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Clínicas Ativas"
          value={12}
          icon={Building2}
          trend="+2 este mês"
          trendUp={true}
        />
        <StatCard
          title="Filas Hoje"
          value={45}
          icon={Users}
          trend="+15% vs ontem"
          trendUp={true}
        />
        <StatCard
          title="Tempo Médio"
          value="18min"
          icon={Clock}
          trend="-3min vs ontem"
          trendUp={true}
        />
        <StatCard
          title="Atendimentos Hoje"
          value={328}
          icon={TrendingUp}
          trend="+12%"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl mb-4">Filas Ativas</h3>
          <div className="space-y-4">
            {[
              { name: 'Clínica São Paulo - Cardiologia', waiting: 12, avg: '15min' },
              { name: 'Clínica Rio - Ortopedia', waiting: 8, avg: '22min' },
              { name: 'Clínica BH - Pediatria', waiting: 15, avg: '18min' },
              { name: 'Clínica Curitiba - Dermatologia', waiting: 6, avg: '12min' },
            ].map((queue, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{queue.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {queue.waiting} aguardando · Tempo médio: {queue.avg}
                  </p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Ativa
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl mb-4">Atividades Recentes</h3>
          <div className="space-y-4">
            {[
              { action: 'Nova clínica cadastrada', clinic: 'Clínica Porto Alegre', time: '5 min atrás' },
              { action: 'Fila criada', clinic: 'Clínica São Paulo - Oftalmologia', time: '15 min atrás' },
              { action: 'Senha chamada', clinic: 'Senha A045 - Clínica Rio', time: '23 min atrás' },
              { action: 'Novo usuário cadastrado', clinic: 'Dr. João Silva', time: '1 hora atrás' },
              { action: 'Fila encerrada', clinic: 'Clínica BH - Neurologia', time: '2 horas atrás' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.clinic}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
