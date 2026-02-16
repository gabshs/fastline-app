import { useState, useEffect, useCallback } from 'react';
import { deviceService } from '@/services';
import type { DeviceSnapshotResponse, QueueSnapshot, TicketEvent } from '@/types/api';
import { Loader2, Wifi, WifiOff, Users, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TVPanelProps {
  deviceKey: string;
}

export function TVPanel({ deviceKey }: TVPanelProps) {
  const [snapshot, setSnapshot] = useState<DeviceSnapshotResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const loadSnapshot = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await deviceService.getSnapshot(deviceKey);
      console.log('📊 Snapshot loaded:', data);
      if (data.queues) {
        data.queues.forEach(q => {
          console.log(`Queue ${q.queueId} stats:`, q.stats);
        });
      }
      setSnapshot(data);
    } catch (err) {
      setError('Erro ao carregar dados do painel');
      console.error('Error loading snapshot:', err);
    } finally {
      setIsLoading(false);
    }
  }, [deviceKey]);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!deviceKey) return;

    const eventSource = deviceService.createEventSource(deviceKey);

    eventSource.onopen = () => {
      console.log('SSE Connected');
      setIsConnected(true);
      setError(null);
    };

    eventSource.onerror = (err) => {
      console.error('SSE Error:', err);
      setIsConnected(false);
      setError('Conexão perdida. Reconectando...');
    };

    eventSource.addEventListener('ticket.created', (event) => {
      const data = JSON.parse(event.data) as TicketEvent;
      console.log('🎫 Ticket created:', data);
      loadSnapshot();
    });

    eventSource.addEventListener('ticket.update', (event) => {
      const data = JSON.parse(event.data) as TicketEvent;
      console.log('🎫 Ticket update:', data);
      loadSnapshot();
    });

    eventSource.addEventListener('ticket.called', (event) => {
      const data = JSON.parse(event.data) as TicketEvent;
      console.log('🎫 Ticket called:', data);
      console.log('Ticket called:', data);
      loadSnapshot();
    });

    eventSource.addEventListener('ticket.started', (event) => {
      const data = JSON.parse(event.data) as TicketEvent;
      console.log('🎫 Ticket STARTED (atendimento iniciado):', data);
      loadSnapshot();
    });

    eventSource.addEventListener('ticket.finished', (event) => {
      const data = JSON.parse(event.data) as TicketEvent;
      console.log('Ticket finished:', data);
      loadSnapshot();
    });

    eventSource.addEventListener('ticket.cancelled', (event) => {
      const data = JSON.parse(event.data) as TicketEvent;
      console.log('Ticket cancelled:', data);
      loadSnapshot();
    });

    eventSource.addEventListener('ticket.no_show', (event) => {
      const data = JSON.parse(event.data) as TicketEvent;
      console.log('Ticket no show:', data);
      loadSnapshot();
    });

    return () => {
      eventSource.close();
    };
  }, [deviceKey, loadSnapshot]);

  const formatTime = useCallback((dateString: string) => {
    try {
      // Use currentTime to ensure real-time updates
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch {
      return 'Agora';
    }
  }, [currentTime]); // Recalculate when currentTime changes

  if (isLoading && !snapshot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4" />
          <p className="text-2xl">Carregando painel...</p>
        </div>
      </div>
    );
  }

  if (error && !snapshot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center">
        <div className="text-center text-white">
          <WifiOff className="w-16 h-16 mx-auto mb-4" />
          <p className="text-2xl mb-2">Erro de Conexão</p>
          <p className="text-lg opacity-90">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold text-white mb-2">FastLine</h1>
          <p className="text-xl text-blue-200">Painel de Senhas</p>
        </div>
        <div className="flex items-center space-x-4">
          {isConnected ? (
            <div className="flex items-center text-green-300">
              <Wifi className="w-6 h-6 mr-2" />
              <span className="text-lg">Conectado</span>
            </div>
          ) : (
            <div className="flex items-center text-yellow-300">
              <WifiOff className="w-6 h-6 mr-2" />
              <span className="text-lg">Reconectando...</span>
            </div>
          )}
          <div className="text-white text-2xl font-mono">
            {currentTime.toLocaleTimeString('pt-BR')}
          </div>
        </div>
      </div>

      {/* Queues Grid */}
      {snapshot && snapshot.queues.length > 0 ? (
        <div className={`grid gap-8 ${
          snapshot.queues.length === 1 
            ? 'grid-cols-1' 
            : snapshot.queues.length === 2 
            ? 'grid-cols-1 xl:grid-cols-2' 
            : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
        }`}>
          {snapshot.queues.map((queue) => (
            <QueuePanel key={queue.queueId} queue={queue} formatTime={formatTime} currentTime={currentTime} />
          ))}
        </div>
      ) : (
        <div className="text-center text-white py-20">
          <Users className="w-24 h-24 mx-auto mb-4 opacity-50" />
          <p className="text-3xl">Nenhuma fila configurada</p>
        </div>
      )}
    </div>
  );
}

interface QueuePanelProps {
  queue: QueueSnapshot;
  formatTime: (dateString: string) => string;
  currentTime: Date;
}

function QueuePanel({ queue, formatTime, currentTime }: QueuePanelProps) {
  // currentTime is used to trigger re-renders every second
  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Current Ticket - Large Display */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-12 text-white">
        <p className="text-3xl mb-6 opacity-90">Senha Atual</p>
        {queue.current ? (
          <>
            <p className="text-[12rem] font-bold mb-6 tracking-wider text-center leading-none">
              {queue.current.displayCode}
            </p>
            <p className="text-2xl text-center opacity-90">
              {(() => {
                const timestamp = queue.current.calledAt || queue.current.createdAt;
                console.log('🕐 Timestamp para formatTime:', timestamp, 'Parsed:', new Date(timestamp));
                return `Chamada ${formatTime(timestamp)}`;
              })()}
            </p>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-5xl opacity-70">Aguardando...</p>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Aguardando</p>
          <p className="text-3xl font-bold text-blue-600">{queue.stats.waitingCount}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Em Atendimento</p>
          <p className="text-3xl font-bold text-green-600">{queue.stats.inServiceCount}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Tempo Estimado</p>
          <p className="text-3xl font-bold text-orange-600 flex items-center justify-center">
            <Clock className="w-6 h-6 mr-2" />
            {queue.stats.etaMinutes}min
          </p>
        </div>
      </div>

      {/* Waiting Queue */}
      {queue.waitingTop && queue.waitingTop.length > 0 && (
        <div className="p-6 border-t">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Próximas Senhas</h3>
          <div className="grid grid-cols-5 gap-3">
            {queue.waitingTop.slice(0, 10).map((ticket) => (
              <div
                key={ticket.id}
                className="bg-blue-50 rounded-lg p-3 text-center border-2 border-blue-200"
              >
                <p className="text-2xl font-bold text-blue-700">{ticket.displayCode}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Called */}
      {queue.recentCalled && queue.recentCalled.length > 0 && (
        <div className="p-6 border-t bg-gray-50">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Últimas Chamadas</h3>
          <div className="flex flex-wrap gap-2">
            {queue.recentCalled.slice(0, 5).map((ticket) => (
              <div
                key={ticket.id}
                className="bg-gray-200 rounded px-3 py-1 text-gray-700 font-medium"
              >
                {ticket.displayCode}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
