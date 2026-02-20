import { Building2, Users, Clock, Loader2, Activity, AlertTriangle } from 'lucide-react';
import { StatCard } from './StatCard';
import { useDashboard } from '@/hooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function AdminDashboard() {
  const { stats, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error || 'Erro ao carregar estatísticas'}
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = stats.ticketsByHour.map(item => ({
    hora: `${item.hour}h`,
    senhas: item.count,
  }));

  // Calculate completion rate
  const completionRate = stats.totalTicketsToday > 0
    ? Math.round((stats.totalTicketsCompleted / stats.totalTicketsToday) * 100)
    : 0;

  // Pie chart data for status - FilaPro refined colors
  const COLORS = {
    wait: '#FACC15',      // --status-wait (amarelo menos saturado)
    call: '#3B82F6',      // --status-call
    progress: '#38BDF8',  // --brand-cyan
    done: '#22C55E',      // --status-done (verde apenas para sucesso)
    error: '#EF4444',     // --status-error
  };
  const pieData = [
    { name: 'Aguardando', value: stats.ticketsByStatus.waiting, color: COLORS.wait },
    { name: 'Chamadas', value: stats.ticketsByStatus.called, color: COLORS.call },
    { name: 'Em Atendimento', value: stats.ticketsByStatus.started, color: COLORS.progress },
    { name: 'Concluídas', value: stats.ticketsByStatus.completed, color: COLORS.done },
    { name: 'Expiradas', value: stats.ticketsByStatus.expired, color: COLORS.error },
  ].filter(item => item.value > 0);

  // Line chart data for last 7 days
  const lineData = stats.ticketsLast7Days.map(item => ({
    data: format(new Date(item.date), 'dd/MM', { locale: ptBR }),
    senhas: item.count,
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-gray-600 mt-2">Visão geral do sistema FilaPro</p>
      </div>

      {/* Stats Cards with Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Clínicas Ativas"
          value={stats.totalClinics}
          icon={Building2}
          trend={`${stats.totalQueues} filas`}
          tooltip="Número total de clínicas cadastradas e ativas no sistema"
        />
        <StatCard
          title="Senhas Hoje"
          value={stats.totalTicketsToday}
          icon={Users}
          trend={`${completionRate}% concluídas`}
          tooltip="Total de senhas geradas hoje e percentual de atendimentos concluídos"
        />
        <StatCard
          title="Tempo Médio"
          value={`${stats.averageWaitTime}min`}
          icon={Clock}
          trend={`máx: ${stats.maxWaitTime}min`}
          tooltip="Tempo médio de espera desde a geração da senha até ser chamada, e o tempo máximo registrado hoje"
        />
        <StatCard
          title="Taxa de Abandono"
          value={`${stats.abandonmentRate.toFixed(1)}%`}
          icon={AlertTriangle}
          trend={`${stats.ticketsByStatus.expired} senhas expiradas`}
          tooltip="Percentual de senhas que foram canceladas ou marcadas como 'não compareceu' em relação ao total gerado"
        />
      </div>

      {/* New Charts Row - Pie and Line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart - Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Distribuição por Status (Hoje)</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum dado disponível</p>
              </div>
            </div>
          )}
        </div>

        {/* Line Chart - Last 7 Days */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Últimos 7 Dias</h3>
          {lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="senhas" stroke="#16A34A" strokeWidth={2} name="Senhas Geradas" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum dado disponível</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Tickets by Hour Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Senhas por Hora (Hoje)</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="senhas" fill="#3b82f6" name="Senhas Geradas" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma senha gerada hoje</p>
              </div>
            </div>
          )}
        </div>

        {/* Top 5 Queues */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Top 5 Filas Mais Movimentadas (Hoje)</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {stats.topQueues.length > 0 ? (
              stats.topQueues.map((queue, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{queue.queueName}</p>
                      <p className="text-sm text-gray-600">{queue.clinicName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{queue.totalCount}</p>
                    <p className="text-xs text-gray-500">senhas</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma fila com senhas hoje</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Atividades Recentes</h3>
        <div className="space-y-4">
          {stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma atividade recente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
