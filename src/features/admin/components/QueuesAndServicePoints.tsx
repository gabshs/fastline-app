import { useState } from 'react';
import { 
  Monitor, Plus, Building2, Loader2, Users, Stethoscope, DoorOpen,
  ListOrdered, Clock, Hash
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useClinics, useServicePoints, useQueues } from '@/hooks';
import { servicePointService, servicePointStaffService, type StaffMember } from '@/services';
import { toast } from 'sonner';

const SERVICE_POINT_TYPES = [
  { value: 'ROOM', label: 'Sala', icon: DoorOpen },
  { value: 'COUNTER', label: 'Balcão', icon: Users },
  { value: 'DOCTOR', label: 'Médico', icon: Stethoscope },
] as const;

export function QueuesAndServicePoints() {
  const { clinics, isLoading: isLoadingClinics } = useClinics();
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const { servicePoints, isLoading: isLoadingSP, createServicePoint, loadServicePoints } = useServicePoints(selectedClinicId);
  const { queues, isLoading: isLoadingQueues, createQueue } = useQueues(selectedClinicId);

  const [activeTab, setActiveTab] = useState<'queues' | 'service-points'>('queues');
  
  // Queue form
  const [isQueueDialogOpen, setIsQueueDialogOpen] = useState(false);
  const [isSubmittingQueue, setIsSubmittingQueue] = useState(false);
  const [queueFormData, setQueueFormData] = useState({
    name: '',
    prefix: '',
    avgServiceMinutes: 5,
  });

  // Service Point form
  const [isSPDialogOpen, setIsSPDialogOpen] = useState(false);
  const [isSubmittingSP, setIsSubmittingSP] = useState(false);
  const [spFormData, setSPFormData] = useState({
    name: '',
    type: 'ROOM' as 'ROOM' | 'COUNTER' | 'DOCTOR',
  });

  // Bind queues dialog
  const [bindDialogOpen, setBindDialogOpen] = useState(false);
  const [selectedServicePointId, setSelectedServicePointId] = useState<string | null>(null);
  const [selectedQueueIds, setSelectedQueueIds] = useState<Set<string>>(new Set());
  const [isBinding, setIsBinding] = useState(false);

  // Staff management
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [availableStaff, setAvailableStaff] = useState<StaffMember[]>([]);
  const [assignedStaff, setAssignedStaff] = useState<StaffMember[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');

  const selectedClinic = clinics.find(c => c.id === selectedClinicId);

  const handleQueueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingQueue(true);
    
    const success = await createQueue({
      name: queueFormData.name,
      prefix: queueFormData.prefix,
      avgServiceSeconds: queueFormData.avgServiceMinutes * 60,
    });
    
    setIsSubmittingQueue(false);
    
    if (success) {
      setQueueFormData({ name: '', prefix: '', avgServiceMinutes: 5 });
      setIsQueueDialogOpen(false);
    }
  };

  const handleSPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingSP(true);
    
    const success = await createServicePoint({
      name: spFormData.name,
      type: spFormData.type,
    });
    
    setIsSubmittingSP(false);
    
    if (success) {
      setSPFormData({ name: '', type: 'ROOM' });
      setIsSPDialogOpen(false);
    }
  };

  const handleBindQueues = async () => {
    if (!selectedClinicId || !selectedServicePointId || selectedQueueIds.size === 0) {
      toast.error('Selecione pelo menos uma fila');
      return;
    }

    setIsBinding(true);
    try {
      let priority = 1;
      for (const queueId of selectedQueueIds) {
        await servicePointService.bindQueue(selectedClinicId, selectedServicePointId, queueId, priority);
        priority++;
      }
      toast.success('Filas vinculadas com sucesso!');
      setBindDialogOpen(false);
      setSelectedQueueIds(new Set());
      await loadServicePoints();
    } catch (error) {
      toast.error('Erro ao vincular filas');
    } finally {
      setIsBinding(false);
    }
  };

  const toggleQueueSelection = (queueId: string) => {
    const newSet = new Set(selectedQueueIds);
    if (newSet.has(queueId)) {
      newSet.delete(queueId);
    } else {
      newSet.add(queueId);
    }
    setSelectedQueueIds(newSet);
  };

  const handleAssignStaff = async () => {
    if (!selectedServicePointId || !selectedStaffId) {
      toast.error('Selecione um atendente');
      return;
    }

    try {
      await servicePointStaffService.assignStaff(selectedServicePointId, selectedStaffId);
      toast.success('Atendente vinculado com sucesso!');
      
      // Atualizar listas
      const [available, assigned] = await Promise.all([
        servicePointStaffService.getAvailableStaff(),
        servicePointStaffService.getServicePointStaff(selectedServicePointId)
      ]);
      setAvailableStaff(available);
      setAssignedStaff(assigned);
      setSelectedStaffId('');
    } catch (error) {
      toast.error('Erro ao vincular atendente');
    }
  };

  const handleRemoveStaff = async (userId: string) => {
    if (!selectedServicePointId) return;

    try {
      await servicePointStaffService.removeStaff(selectedServicePointId, userId);
      toast.success('Atendente removido com sucesso!');
      
      // Atualizar listas
      const [available, assigned] = await Promise.all([
        servicePointStaffService.getAvailableStaff(),
        servicePointStaffService.getServicePointStaff(selectedServicePointId)
      ]);
      setAvailableStaff(available);
      setAssignedStaff(assigned);
    } catch (error) {
      toast.error('Erro ao remover atendente');
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = SERVICE_POINT_TYPES.find(t => t.value === type);
    return typeConfig?.icon || Monitor;
  };

  const getTypeLabel = (type: string) => {
    const typeConfig = SERVICE_POINT_TYPES.find(t => t.value === type);
    return typeConfig?.label || type;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl mb-2">Filas e Pontos de Atendimento</h2>
        <p className="text-gray-600">Gerencie as filas e pontos de atendimento das suas clínicas</p>
      </div>

      {/* Clinic Selector */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <Label htmlFor="clinic-select" className="text-base mb-3 block">
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

      {/* Tabs Section */}
      {selectedClinicId && (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'queues' | 'service-points')}>
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="queues">
              <ListOrdered className="w-4 h-4 mr-2" />
              Filas
            </TabsTrigger>
            <TabsTrigger value="service-points">
              <Monitor className="w-4 h-4 mr-2" />
              Pontos de Atendimento
            </TabsTrigger>
          </TabsList>

          {/* Queues Tab */}
          <TabsContent value="queues">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-medium">Filas - {selectedClinic?.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {queues.length} {queues.length === 1 ? 'fila cadastrada' : 'filas cadastradas'}
                </p>
              </div>
              <Dialog open={isQueueDialogOpen} onOpenChange={setIsQueueDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Nova Fila</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cadastrar Nova Fila</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleQueueSubmit} className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="queue-name">Nome da Fila</Label>
                      <Input
                        id="queue-name"
                        value={queueFormData.name}
                        onChange={(e) => setQueueFormData({ ...queueFormData, name: e.target.value })}
                        placeholder="Ex: Atendimento Geral"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="queue-prefix">Prefixo das Senhas</Label>
                      <Input
                        id="queue-prefix"
                        value={queueFormData.prefix}
                        onChange={(e) => setQueueFormData({ ...queueFormData, prefix: e.target.value.toUpperCase() })}
                        placeholder="Ex: ATD"
                        maxLength={3}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Máximo 3 caracteres</p>
                    </div>
                    <div>
                      <Label htmlFor="avg-time">Tempo Médio de Atendimento (minutos)</Label>
                      <Input
                        id="avg-time"
                        type="number"
                        value={queueFormData.avgServiceMinutes}
                        onChange={(e) => setQueueFormData({ ...queueFormData, avgServiceMinutes: parseInt(e.target.value) || 1 })}
                        placeholder="5"
                        min="1"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {queueFormData.avgServiceMinutes} {queueFormData.avgServiceMinutes === 1 ? 'minuto' : 'minutos'}
                      </p>
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmittingQueue}>
                      {isSubmittingQueue ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Cadastrando...
                        </>
                      ) : (
                        'Cadastrar Fila'
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white rounded-lg shadow">
              {isLoadingQueues ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : queues.length === 0 ? (
                <div className="text-center py-12">
                  <ListOrdered className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Nenhuma fila cadastrada</p>
                  <p className="text-sm text-gray-500 mt-2">Clique em "Nova Fila" para começar</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {queues.map((queue) => (
                    <div
                      key={queue.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <ListOrdered className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{queue.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Hash className="w-3 h-3 text-gray-400" />
                              <p className="text-sm text-gray-500">{queue.prefix}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{Math.floor(queue.avgServiceSeconds / 60)} min médio</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Service Points Tab */}
          <TabsContent value="service-points">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-medium">Pontos de Atendimento - {selectedClinic?.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {servicePoints.length} {servicePoints.length === 1 ? 'ponto cadastrado' : 'pontos cadastrados'}
                </p>
              </div>
              <Dialog open={isSPDialogOpen} onOpenChange={setIsSPDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Novo Ponto</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cadastrar Novo Ponto de Atendimento</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSPSubmit} className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="sp-name">Nome do Ponto</Label>
                      <Input
                        id="sp-name"
                        value={spFormData.name}
                        onChange={(e) => setSPFormData({ ...spFormData, name: e.target.value })}
                        placeholder="Ex: Recepção Principal"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="sp-type">Tipo</Label>
                      <Select
                        value={spFormData.type}
                        onValueChange={(value: 'ROOM' | 'COUNTER' | 'DOCTOR') => 
                          setSPFormData({ ...spFormData, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICE_POINT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center space-x-2">
                                <type.icon className="w-4 h-4" />
                                <span>{type.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmittingSP}>
                      {isSubmittingSP ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Cadastrando...
                        </>
                      ) : (
                        'Cadastrar Ponto'
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white rounded-lg shadow">
              {isLoadingSP ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : servicePoints.length === 0 ? (
                <div className="text-center py-12">
                  <Monitor className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Nenhum ponto de atendimento cadastrado</p>
                  <p className="text-sm text-gray-500 mt-2">Clique em "Novo Ponto" para começar</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {servicePoints.map((point) => {
                    const Icon = getTypeIcon(point.type);
                    return (
                      <div
                        key={point.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Icon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{point.name}</h4>
                              <p className="text-sm text-gray-500">{getTypeLabel(point.type)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              point.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {point.isActive ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                setSelectedServicePointId(point.id);
                                setBindDialogOpen(true);
                                
                                // Carregar filas já vinculadas
                                if (selectedClinicId) {
                                  try {
                                    const boundQueueIds = await servicePointService.getServicePointQueues(
                                      selectedClinicId,
                                      point.id
                                    );
                                    setSelectedQueueIds(new Set(boundQueueIds));
                                  } catch (error) {
                                    console.error('Error loading bound queues:', error);
                                    setSelectedQueueIds(new Set());
                                  }
                                }
                              }}
                              disabled={queues.length === 0}
                              className="flex-1"
                            >
                              <ListOrdered className="w-4 h-4 mr-1" />
                              Filas
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                setSelectedServicePointId(point.id);
                                setIsLoadingStaff(true);
                                setStaffDialogOpen(true);
                                try {
                                  const [available, assigned] = await Promise.all([
                                    servicePointStaffService.getAvailableStaff(),
                                    servicePointStaffService.getServicePointStaff(point.id)
                                  ]);
                                  setAvailableStaff(available);
                                  setAssignedStaff(assigned);
                                } catch (error) {
                                  toast.error('Erro ao carregar atendentes');
                                } finally {
                                  setIsLoadingStaff(false);
                                }
                              }}
                              className="flex-1"
                            >
                              <Users className="w-4 h-4 mr-1" />
                              Atendentes
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Bind Queues Dialog */}
      <Dialog open={bindDialogOpen} onOpenChange={setBindDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vincular Filas ao Ponto de Atendimento</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {queues.length === 0 ? (
              <p className="text-gray-600 text-center py-4">Nenhuma fila disponível</p>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Selecione as filas que deseja vincular a este ponto de atendimento:
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {queues.map((queue) => (
                    <label
                      key={queue.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedQueueIds.has(queue.id)}
                        onChange={() => toggleQueueSelection(queue.id)}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{queue.name}</p>
                        <p className="text-sm text-gray-500">Prefixo: {queue.prefix}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <Button
                  onClick={handleBindQueues}
                  className="w-full mt-4"
                  disabled={isBinding || selectedQueueIds.size === 0}
                >
                  {isBinding ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Vinculando...
                    </>
                  ) : (
                    `Vincular ${selectedQueueIds.size} ${selectedQueueIds.size === 1 ? 'fila' : 'filas'}`
                  )}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Staff Management Dialog */}
      <Dialog open={staffDialogOpen} onOpenChange={setStaffDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gerenciar Atendentes do Ponto de Atendimento</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            {isLoadingStaff ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                {/* Assigned Staff */}
                <div>
                  <h4 className="font-medium mb-3">Atendentes Vinculados</h4>
                  {assignedStaff.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4 border rounded-lg">
                      Nenhum atendente vinculado a este ponto
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {assignedStaff.map((staff) => (
                        <div
                          key={staff.userId}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{staff.name}</p>
                            <p className="text-sm text-gray-500">{staff.email}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveStaff(staff.userId)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Staff */}
                <div>
                  <h4 className="font-medium mb-3">Vincular Novo Atendente</h4>
                  {assignedStaff.length >= 1 ? (
                    <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                      Este ponto já possui um atendente vinculado. Remova o atendente atual para vincular outro.
                    </p>
                  ) : availableStaff.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4 border rounded-lg">
                      Nenhum atendente disponível para vincular
                    </p>
                  ) : (
                    <div className="flex gap-2">
                      <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Selecione um atendente" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableStaff.map((staff) => (
                            <SelectItem key={staff.userId} value={staff.userId}>
                              {staff.name} - {staff.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleAssignStaff}
                        disabled={!selectedStaffId}
                      >
                        Vincular
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
