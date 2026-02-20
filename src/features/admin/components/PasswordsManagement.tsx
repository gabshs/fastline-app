import { useState, useEffect } from 'react';
import { 
  Key, ArrowRight, Users, Building2, Loader2, Plus,
  CheckCircle, XCircle, AlertCircle, RotateCcw, Play
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { Label } from '@/shared/ui/label';
import { useClinics, useUserQueues, useTickets } from '@/hooks';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { authService } from '@/services';

const PRIORITY_CONFIG = {
  NORMAL: { label: 'Normal', color: 'bg-gray-100 text-gray-800' },
  HIGH: { label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  URGENT: { label: 'Urgente', color: 'bg-red-100 text-red-800' },
};

export function PasswordsManagement() {
  const { clinics, isLoading: isLoadingClinics } = useClinics();
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const { queues, isLoading: isLoadingQueues } = useUserQueues(selectedClinicId);
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);
  const [userServicePointId, setUserServicePointId] = useState<string | null>(null);
  
  const {
    tickets,
    currentTicket,
    queueStatus,
    isLoading,
    callNext,
    recall,
    start,
    finish,
    noShow,
    cancel,
    createTicket,
  } = useTickets(selectedClinicId, selectedQueueId);

  const [isCalling, setIsCalling] = useState(false);
  const [actioningTicketId, setActioningTicketId] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  // Buscar perfil completo do usuário logado
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await authService.getUserProfile();
        
        // Se for STAFF e tiver service_point_id, auto-selecionar clínica
        if (profile.roleKey === 'STAFF' && profile.servicePointId && profile.clinicId) {
          setUserServicePointId(profile.servicePointId);
          setSelectedClinicId(profile.clinicId);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    loadUserProfile();
  }, []);
  
  // Auto-selecionar fila se houver apenas uma disponível para STAFF
  useEffect(() => {
    if (userServicePointId && queues.length === 1 && !selectedQueueId) {
      setSelectedQueueId(queues[0].id);
    }
  }, [queues, userServicePointId, selectedQueueId]);
  
  // Create ticket dialog
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTicketPriority, setNewTicketPriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');

  // Reset queue selection when clinic changes (apenas para não-STAFF)
  useEffect(() => {
    if (!userServicePointId) {
      setSelectedQueueId(null);
    }
  }, [selectedClinicId, userServicePointId]);

  const handleCallNext = async () => {
    setIsCalling(true);
    await callNext(userServicePointId || undefined);
    setIsCalling(false);
  };

  const handleAction = async (action: () => Promise<boolean>, ticketId: string) => {
    setActioningTicketId(ticketId);
    await action();
    setActioningTicketId(null);
  };

  const handleCreateTicket = async () => {
    setIsCreating(true);
    const success = await createTicket(newTicketPriority);
    setIsCreating(false);
    
    if (success) {
      setNewTicketPriority('NORMAL');
      setIsCreateDialogOpen(false);
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch {
      return 'Agora';
    }
  };

  const selectedQueue = queues.find(q => q.id === selectedQueueId);
  const waitingTickets = tickets.filter(t => t.status === 'WAITING');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl mb-2">Gestão de Senhas</h2>
        <p className="text-gray-600">Chame e gerencie as senhas de atendimento</p>
      </div>

      {/* Clinic Selector - Oculto para STAFF */}
      {!userServicePointId && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <Label className="text-base mb-3 block">
            Selecione a Clínica
          </Label>
          {isLoadingClinics ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : clinics.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Nenhuma clínica cadastrada</p>
              <p className="text-sm text-gray-500 mt-2">Cadastre uma clínica primeiro</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clinics.map((clinic) => (
                <button
                  key={clinic.id}
                  onClick={() => setSelectedClinicId(clinic.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedClinicId === clinic.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      selectedClinicId === clinic.id ? 'bg-blue-600' : 'bg-gray-200'
                    }`}>
                      <Building2 className={`w-5 h-5 ${
                        selectedClinicId === clinic.id ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{clinic.name}</p>
                      <p className="text-sm text-gray-500 truncate">{clinic.timezone}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Clínica selecionada automaticamente para STAFF */}
      {userServicePointId && selectedClinicId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-600">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Clínica</p>
              <p className="font-semibold text-gray-900">
                {clinics.find(c => c.id === selectedClinicId)?.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Queue Selector */}
      {selectedClinicId && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base">
              Selecione a Fila
            </Label>
            {selectedQueueId && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Senha
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Nova Senha</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="priority">Prioridade</Label>
                      <Select 
                        value={newTicketPriority} 
                        onValueChange={(value: 'NORMAL' | 'HIGH' | 'URGENT') => setNewTicketPriority(value)}
                      >
                        <SelectTrigger id="priority">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NORMAL">
                            <div className="flex items-center space-x-2">
                              <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                              <span>Normal</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="HIGH">
                            <div className="flex items-center space-x-2">
                              <span className="w-3 h-3 rounded-full bg-orange-400"></span>
                              <span>Alta</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="URGENT">
                            <div className="flex items-center space-x-2">
                              <span className="w-3 h-3 rounded-full bg-red-400"></span>
                              <span>Urgente</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-2">
                        A senha será criada automaticamente com o próximo número disponível
                      </p>
                    </div>
                    <Button 
                      onClick={handleCreateTicket} 
                      className="w-full"
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Criar Senha
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          {isLoadingQueues ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : queues.length === 0 ? (
            <div className="text-center py-8">
              <Key className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Nenhuma fila disponível</p>
              <p className="text-sm text-gray-500 mt-2">Configure filas para esta clínica primeiro</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {queues.map((queue) => (
                <button
                  key={queue.id}
                  onClick={() => setSelectedQueueId(queue.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedQueueId === queue.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      selectedQueueId === queue.id ? 'bg-blue-600' : 'bg-gray-200'
                    }`}>
                      <Key className={`w-5 h-5 ${
                        selectedQueueId === queue.id ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{queue.name}</p>
                      <p className="text-sm text-gray-500 truncate">Prefixo: {queue.prefix}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedClinicId && selectedQueueId && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Current Ticket Display */}
            <div className="bg-white rounded-lg shadow p-6">

              {currentTicket ? (
                <>
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white mb-6">
                    <p className="text-sm opacity-90 mb-2">Senha Atual</p>
                    <p className="text-7xl font-bold mb-4 tracking-wider">{currentTicket.displayCode}</p>
                    <p className="text-sm opacity-90">
                      {selectedQueue?.name} • Chamada {formatTime(currentTicket.calledAt || currentTicket.createdAt)}
                    </p>
                  </div>

                  {/* Current Ticket Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => handleAction(() => recall(currentTicket.id), currentTicket.id)}
                      variant="outline"
                      disabled={actioningTicketId === currentTicket.id}
                      className="h-12"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Rechamar
                    </Button>
                    {currentTicket.status === 'CALLED' && (
                      <Button
                        onClick={() => handleAction(() => start(currentTicket.id), currentTicket.id)}
                        disabled={actioningTicketId === currentTicket.id}
                        className="h-12 bg-green-600 hover:bg-green-700"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar Atendimento
                      </Button>
                    )}
                    {currentTicket.status === 'IN_SERVICE' && (
                      <Button
                        onClick={() => handleAction(() => finish(currentTicket.id), currentTicket.id)}
                        disabled={actioningTicketId === currentTicket.id}
                        className="h-12 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Finalizar
                      </Button>
                    )}
                    <Button
                      onClick={() => handleAction(() => noShow(currentTicket.id), currentTicket.id)}
                      variant="outline"
                      disabled={actioningTicketId === currentTicket.id}
                      className="h-12 text-orange-600 border-orange-300 hover:bg-orange-50"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Não Compareceu
                    </Button>
                    <Button
                      onClick={() => handleAction(() => cancel(currentTicket.id), currentTicket.id)}
                      variant="outline"
                      disabled={actioningTicketId === currentTicket.id}
                      className="h-12 text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 rounded-lg p-12 text-center">
                  <Key className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-6">Nenhuma senha em atendimento</p>
                  <Button
                    onClick={handleCallNext}
                    disabled={isCalling || waitingTickets.length === 0 || isLoading}
                    size="lg"
                    className="h-14 px-8 text-lg"
                  >
                    {isCalling ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Chamando...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-5 h-5 mr-2" />
                        Chamar Próxima Senha
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Call Next Button (when there's a current ticket) */}
            {currentTicket && (
              <div className="bg-white rounded-lg shadow p-6">
                <Button
                  onClick={handleCallNext}
                  disabled={isCalling || waitingTickets.length === 0 || isLoading}
                  className="w-full h-14 text-lg"
                >
                  {isCalling ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Chamando...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Chamar Próxima Senha
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Waiting Queue */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-medium">Fila de Espera</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {waitingTickets.length} {waitingTickets.length === 1 ? 'senha' : 'senhas'}
                </span>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : waitingTickets.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhuma senha aguardando</p>
                  </div>
                ) : (
                  waitingTickets.map((ticket, index) => (
                    <div 
                      key={ticket.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 text-blue-800 w-10 h-10 rounded-lg flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-lg">{ticket.displayCode}</p>
                          <p className="text-sm text-gray-600">
                            Criada {formatTime(ticket.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_CONFIG[ticket.priority]?.color || 'bg-gray-100 text-gray-800'}`}>
                          {PRIORITY_CONFIG[ticket.priority]?.label || ticket.priority}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-medium mb-4">Estatísticas</h3>
              {isLoading && !queueStatus ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : queueStatus ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Aguardando</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {queueStatus.waitingCount}
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Chamados</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {queueStatus.calledCount}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Em Atendimento</p>
                    <p className="text-3xl font-bold text-green-600">
                      {queueStatus.inServiceCount}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Finalizados</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {queueStatus.completedCount}
                    </p>
                  </div>
                  {queueStatus.etaMinutes > 0 && (
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Tempo Estimado</p>
                      <p className="text-3xl font-bold text-orange-600">
                        {queueStatus.etaMinutes}min
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">Estatísticas não disponíveis</p>
                </div>
              )}
            </div>

            {/* Queue Info */}
            {selectedQueue && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-medium mb-4">Informações da Fila</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Nome</p>
                    <p className="font-medium">{selectedQueue.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Prefixo</p>
                    <p className="font-medium text-lg">{selectedQueue.prefix}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tempo Médio</p>
                    <p className="font-medium">
                      {Math.floor(selectedQueue.avgServiceSeconds / 60)} minutos
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
