import { useState } from 'react';
import { Monitor, Plus, Building2, Loader2, Users, Stethoscope, DoorOpen } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { useClinics, useServicePoints } from '@/hooks';

const SERVICE_POINT_TYPES = [
  { value: 'ROOM', label: 'Sala', icon: DoorOpen },
  { value: 'COUNTER', label: 'Balcão', icon: Users },
  { value: 'DOCTOR', label: 'Médico', icon: Stethoscope },
] as const;

export function ServicePointsManagement() {
  const { clinics, isLoading: isLoadingClinics } = useClinics();
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const { servicePoints, isLoading, createServicePoint } = useServicePoints(selectedClinicId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'ROOM' as 'ROOM' | 'COUNTER' | 'DOCTOR',
  });

  const selectedClinic = clinics.find(c => c.id === selectedClinicId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const success = await createServicePoint({
      name: formData.name,
      type: formData.type,
    });
    
    setIsSubmitting(false);
    
    if (success) {
      setFormData({ name: '', type: 'ROOM' });
      setIsDialogOpen(false);
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
        <h2 className="text-3xl mb-2">Pontos de Atendimento</h2>
        <p className="text-gray-600">Gerencie os pontos de atendimento das suas clínicas</p>
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
            <p className="text-sm text-gray-500 mt-2">Cadastre uma clínica primeiro para gerenciar pontos de atendimento</p>
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

      {/* Service Points Section */}
      {selectedClinicId && (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-medium">
                Pontos de Atendimento - {selectedClinic?.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {servicePoints.length} {servicePoints.length === 1 ? 'ponto cadastrado' : 'pontos cadastrados'}
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="name">Nome do Ponto</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Recepção Principal"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: 'ROOM' | 'COUNTER' | 'DOCTOR') => 
                        setFormData({ ...formData, type: value })
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
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
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
            {isLoading ? (
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
                      <div className="flex items-center justify-between text-sm">
                        <span className={`px-2 py-1 rounded-full ${
                          point.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {point.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
