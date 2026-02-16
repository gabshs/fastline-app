import { useState } from 'react';
import { deviceService } from '@/services';
import { useClinics, useDevices, useQueues } from '@/hooks';
import type { CreateDeviceResponse } from '@/types/api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shared/ui/alert-dialog';
import { Tv, Copy, Check, Loader2, ExternalLink, Monitor, Calendar, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function DeviceManagement() {
  const { clinics, isLoading: isLoadingClinics } = useClinics();
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const { devices, isLoading: isLoadingDevices, reload: reloadDevices } = useDevices(selectedClinicId);
  const { queues, isLoading: isLoadingQueues } = useQueues(selectedClinicId);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [createdDevice, setCreatedDevice] = useState<CreateDeviceResponse | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isQueueDialogOpen, setIsQueueDialogOpen] = useState(false);
  const [selectedDeviceForQueues, setSelectedDeviceForQueues] = useState<string | null>(null);
  const [selectedQueueIds, setSelectedQueueIds] = useState<string[]>([]);
  const [isSavingQueues, setIsSavingQueues] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const selectedClinic = clinics.find(c => c.id === selectedClinicId);

  const handleCreateDevice = async () => {
    if (!selectedClinicId || !deviceName.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsCreating(true);
    try {
      const device = await deviceService.createDevice(selectedClinicId, {
        name: deviceName.trim(),
        type: 'TV_PANEL',
      });
      setCreatedDevice(device);
      toast.success('Dispositivo criado com sucesso!');
      setDeviceName('');
      reloadDevices();
    } catch (err) {
      toast.error('Erro ao criar dispositivo');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Copiado para área de transferência!');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setCreatedDevice(null);
    setDeviceName('');
  };

  const handleSaveQueues = async () => {
    if (!selectedClinicId || !selectedDeviceForQueues) return;

    setIsSavingQueues(true);
    try {
      await deviceService.setSubscriptions(
        selectedClinicId,
        selectedDeviceForQueues,
        { queueIds: selectedQueueIds }
      );
      toast.success('Filas configuradas com sucesso!');
      setIsQueueDialogOpen(false);
      setSelectedDeviceForQueues(null);
      setSelectedQueueIds([]);
    } catch (err) {
      toast.error('Erro ao configurar filas');
      console.error(err);
    } finally {
      setIsSavingQueues(false);
    }
  };

  const toggleQueue = (queueId: string) => {
    setSelectedQueueIds(prev =>
      prev.includes(queueId)
        ? prev.filter(id => id !== queueId)
        : [...prev, queueId]
    );
  };

  const handleDeleteDevice = async () => {
    if (!selectedClinicId || !deviceToDelete) return;

    setIsDeleting(true);
    try {
      await deviceService.deleteDevice(selectedClinicId, deviceToDelete.id);
      toast.success('Dispositivo excluído com sucesso!');
      setDeviceToDelete(null);
      reloadDevices();
    } catch (err) {
      toast.error('Erro ao excluir dispositivo');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const tvPanelUrl = `${window.location.origin}/tv-panel`;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl mb-2">Gerenciamento de Dispositivos</h2>
        <p className="text-gray-600">Configure painéis TV e kiosks para suas clínicas</p>
      </div>

      {/* Clinic Selector */}
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
            <Tv className="w-12 h-12 mx-auto text-gray-400 mb-4" />
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
                    <Tv className={`w-5 h-5 ${
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

      {/* Devices Section - Only show when clinic is selected */}
      {selectedClinicId && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-medium">Dispositivos - {selectedClinic?.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {devices?.length || 0} {devices?.length === 1 ? 'dispositivo cadastrado' : 'dispositivos cadastrados'}
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Novo Painel TV</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {createdDevice ? 'Dispositivo Criado!' : 'Criar Novo Painel TV'}
                  </DialogTitle>
                </DialogHeader>

                {!createdDevice ? (
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="deviceName">Nome do Dispositivo</Label>
                      <Input
                        id="deviceName"
                        placeholder="Ex: TV Recepção Principal"
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateDevice()}
                      />
                    </div>

                    <Button
                      onClick={handleCreateDevice}
                      disabled={isCreating || !deviceName.trim()}
                      className="w-full"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        'Criar Dispositivo'
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6 mt-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-medium mb-2">
                        ✓ Dispositivo criado com sucesso!
                      </p>
                      <p className="text-sm text-green-700">
                        Use as informações abaixo para configurar o painel TV
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-semibold">Código de Emparelhamento</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            value={createdDevice.pairingCode}
                            readOnly
                            className="font-mono text-2xl text-center tracking-wider"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(createdDevice.pairingCode, 'code')}
                          >
                            {copiedField === 'code' ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Válido por 24 horas
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold">URL do Painel TV</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            value={tvPanelUrl}
                            readOnly
                            className="text-sm"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(tvPanelUrl, 'url')}
                          >
                            {copiedField === 'url' ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(tvPanelUrl, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-900 mb-2">
                        Próximos passos:
                      </p>
                      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Abra a URL do painel TV no dispositivo</li>
                        <li>Digite o código de emparelhamento</li>
                        <li>O painel será conectado automaticamente</li>
                        <li>Configure as filas que deseja exibir</li>
                      </ol>
                    </div>

                    <Button 
                      onClick={() => {
                        setIsCreateDialogOpen(false);
                        if (createdDevice) {
                          setSelectedDeviceForQueues(createdDevice.deviceId);
                          setIsQueueDialogOpen(true);
                        }
                      }} 
                      className="w-full"
                    >
                      Configurar Filas
                    </Button>
                    <Button onClick={handleCloseDialog} className="w-full" variant="outline">
                      Fechar
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {isLoadingDevices ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : !devices || devices.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Tv className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Nenhum dispositivo configurado</p>
              <p className="text-sm">Crie um novo painel TV para começar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Monitor className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">{device.name}</h4>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        device.status === 'PAIRED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {device.status === 'PAIRED' ? 'Conectado' : 'Pendente'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Tv className="w-4 h-4" />
                      <span>{device.type === 'TV_PANEL' ? 'Painel TV' : 'Kiosk'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Criado{' '}
                        {formatDistanceToNow(new Date(device.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    {device.lastSeenAt && (
                      <div className="text-xs text-gray-500">
                        Última conexão:{' '}
                        {formatDistanceToNow(new Date(device.lastSeenAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </div>
                    )}
                  </div>

                  {device.pairingCode && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-1">Código de emparelhamento:</p>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {device.pairingCode}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(device.pairingCode!);
                            toast.success('Código copiado!');
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t space-y-2">
                    {device.status === 'PAIRED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedDeviceForQueues(device.id);
                          setIsQueueDialogOpen(true);
                        }}
                      >
                        Configurar Filas
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setDeviceToDelete({ id: device.id, name: device.name })}
                    >
                      <Trash2 className="w-3 h-3 mr-2" />
                      Excluir Dispositivo
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deviceToDelete} onOpenChange={(open) => !open && setDeviceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o dispositivo <strong>{deviceToDelete?.name}</strong>?
              <br />
              <br />
              Esta ação não pode ser desfeita. O dispositivo precisará ser emparelhado novamente caso queira utilizá-lo no futuro.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDevice}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Queue Configuration Dialog */}
      <Dialog open={isQueueDialogOpen} onOpenChange={setIsQueueDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar Filas do Painel</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <p className="text-sm text-gray-600">
              Selecione as filas que deseja exibir neste painel TV:
            </p>

            {isLoadingQueues ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : !queues || queues.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma fila disponível</p>
                <p className="text-sm mt-2">Crie filas primeiro para configurar o painel</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {queues.map((queue) => (
                  <label
                    key={queue.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedQueueIds.includes(queue.id)}
                      onChange={() => toggleQueue(queue.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{queue.name}</p>
                      <p className="text-sm text-gray-500">Prefixo: {queue.prefix}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="flex space-x-2 pt-4">
              <Button
                onClick={handleSaveQueues}
                disabled={isSavingQueues || selectedQueueIds.length === 0}
                className="flex-1"
              >
                {isSavingQueues ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Configuração'
                )}
              </Button>
              <Button
                onClick={() => {
                  setIsQueueDialogOpen(false);
                  setSelectedDeviceForQueues(null);
                  setSelectedQueueIds([]);
                }}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
