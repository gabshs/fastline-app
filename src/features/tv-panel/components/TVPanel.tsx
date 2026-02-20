import { useState, useEffect, useCallback, useRef } from 'react';
import { deviceService } from '@/services';
import type { DeviceSnapshotResponse, QueueSnapshot, TicketEvent } from '@/types/api';
import { Loader2, Wifi, WifiOff, Users, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import filaProLogo from '@/assets/images/logo-fila-pro.svg';

interface TVPanelProps {
  deviceKey: string;
}

export function TVPanel({ deviceKey }: TVPanelProps) {
  const [snapshot, setSnapshot] = useState<DeviceSnapshotResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const previousCurrentTickets = useRef<Map<string, string>>(new Map());

  // Função para anunciar senha usando Text-to-Speech
  const announceTicket = useCallback((displayCode: string, servicePointName?: string) => {
    if ('speechSynthesis' in window) {
      // Cancelar qualquer anúncio anterior
      window.speechSynthesis.cancel();
      
      // Criar mensagem com pausas entre palavras
      let message = `Senha, ${displayCode.split('').join(', ')}`;
      if (servicePointName) {
        message += `,, ${servicePointName}`;
      }
      
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9; // Velocidade mais lenta para melhor compreensão
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      console.log('🔊 Anunciando:', message);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

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
      
      // Verificar se há nova senha atual e anunciar
      if (data.queues) {
        data.queues.forEach(queue => {
          if (queue.current) {
            const previousTicketId = previousCurrentTickets.current.get(queue.queueId);
            const currentTicketId = queue.current.id;
            
            // Se mudou a senha atual, anunciar
            if (previousTicketId !== currentTicketId) {
              console.log(`🆕 Nova senha atual na fila ${queue.queueId}:`, queue.current.displayCode);
              announceTicket(queue.current.displayCode, queue.current.servicePointName || undefined);
              previousCurrentTickets.current.set(queue.queueId, currentTicketId);
            }
          }
        });
      }
      
      setSnapshot(data);
    } catch (err: any) {
      console.error('Error loading snapshot:', err);
      
      // Se erro 401, a chave é inválida - limpar e forçar novo emparelhamento
      if (err?.response?.status === 401 || err?.status === 401) {
        console.log('🔑 Chave de dispositivo inválida (401). Limpando e redirecionando...');
        localStorage.removeItem('tv_device_key');
        window.location.href = window.location.pathname; // Recarrega sem query params
        return;
      }
      
      setError('Erro ao carregar dados do painel');
    } finally {
      setIsLoading(false);
    }
  }, [deviceKey, announceTicket]);

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

    eventSource.onerror = (err: any) => {
      console.error('SSE Error:', err);
      setIsConnected(false);
      
      // Se erro 401, a chave é inválida - limpar e forçar novo emparelhamento
      if (err?.status === 401 || eventSource.readyState === EventSource.CLOSED) {
        console.log('🔑 Conexão SSE falhou (possível 401). Verificando autenticação...');
        // Tentar carregar snapshot para confirmar se é 401
        loadSnapshot();
      } else {
        setError('Conexão perdida. Reconectando...');
      }
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
    <div className="h-screen overflow-hidden bg-gradient-to-b from-[#0A0F1A] to-[#050810] p-4 flex flex-col">
      {/* Header com logo discreta */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <img 
            src={filaProLogo} 
            alt="FilaPro" 
            className="w-48 h-auto opacity-90"
          />
          <div className="border-l border-slate-700 pl-6">
            <p className="text-4xl text-slate-400">Painel de Senhas</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          {isConnected ? (
            <div className="flex items-center text-green-400">
              <Wifi className="w-5 h-5 mr-2" />
              <span className="text-sm">Conectado</span>
            </div>
          ) : (
            <div className="flex items-center text-amber-400">
              <WifiOff className="w-5 h-5 mr-2" />
              <span className="text-sm">Reconectando...</span>
            </div>
          )}
          <div className="text-slate-300 text-4xl font-mono">
            {currentTime.toLocaleTimeString('pt-BR')}
          </div>
        </div>
      </div>

      {/* Queues Grid */}
      {snapshot && snapshot.queues.length > 0 ? (
        <div className={`grid gap-4 flex-1 overflow-hidden mt-2 ${
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
  // Se não há senha atual, mostrar a primeira das últimas chamadas
  const displayTicket = queue.current || (queue.recentCalled && queue.recentCalled.length > 0 ? queue.recentCalled[0] : null);
  
  return (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-slate-700/50">
      {/* Current Ticket - Large Display - Azul escuro */}
      <div className="bg-gradient-to-br from-[#1E3A5F] to-[#0F2847] p-8 text-white">
        <p className="text-5xl mb-6 text-slate-300 font-medium">Senha Atual</p>
        {displayTicket ? (
          <>
            <p className="text-[14rem] font-bold mb-6 tracking-wider text-center leading-none">
              {displayTicket.displayCode}
            </p>
            {displayTicket.servicePointName && (
              <p className="text-8xl text-center font-bold mb-4 text-blue-300">
                {displayTicket.servicePointName}
              </p>
            )}
            <p className="text-4xl text-center text-slate-300">
              {(() => {
                const timestamp = displayTicket.calledAt || displayTicket.createdAt;
                console.log('🕐 Timestamp para formatTime:', timestamp, 'Parsed:', new Date(timestamp));
                return `Chamada ${formatTime(timestamp)}`;
              })()}
            </p>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-6xl text-slate-400">Aguardando...</p>
          </div>
        )}
      </div>

      {/* Statistics - Cores semânticas */}
      <div className="grid grid-cols-3 gap-4 p-6 bg-slate-800/60">
        <div className="text-center">
          <p className="text-lg text-slate-400 mb-2 uppercase tracking-wide">Aguardando</p>
          <p className="text-5xl font-bold text-blue-400">{queue.stats.waitingCount}</p>
        </div>
        <div className="text-center">
          <p className="text-lg text-slate-400 mb-2 uppercase tracking-wide">Em Atendimento</p>
          <p className="text-5xl font-bold text-green-400">{queue.stats.inServiceCount}</p>
        </div>
        <div className="text-center">
          <p className="text-lg text-slate-400 mb-2 uppercase tracking-wide">Tempo Estimado</p>
          <p className="text-5xl font-bold text-amber-400 flex items-center justify-center">
            <Clock className="w-8 h-8 mr-2" />
            {queue.stats.etaMinutes}min
          </p>
        </div>
      </div>

      {/* Recent Called */}
      {queue.recentCalled && queue.recentCalled.length > 0 && (
        <div className="p-6 border-t border-slate-700/50 bg-slate-800/40">
          <h3 className="text-3xl font-semibold mb-5 text-slate-400 uppercase tracking-wide">Últimas Chamadas</h3>
          <div className="flex flex-wrap gap-5">
            {queue.recentCalled.slice(0, 3).map((ticket) => (
              <div
                key={ticket.id}
                className="bg-slate-700/60 rounded-lg px-10 py-6 text-slate-300 font-medium"
              >
                <div className="flex items-center gap-5">
                  <span className="text-6xl font-bold">{ticket.displayCode}</span>
                  {ticket.servicePointName && (
                    <span className="text-4xl font-semibold text-blue-300">→ {ticket.servicePointName}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
