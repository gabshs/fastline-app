import { useState } from 'react';
import { Building2, Plus, Edit, Trash2, MapPin, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { Label } from '@/shared/ui/label';
import { useClinics } from '@/hooks/useClinics';

export function ClinicsManagement() {
  const { clinics, isLoading, createClinic, updateClinic, deleteClinic } = useClinics();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<{ id: string; name: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    timezone: 'America/Sao_Paulo',
    addressLine: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const success = await createClinic({
      name: formData.name,
      timezone: formData.timezone,
      addressLine: formData.addressLine || undefined,
    });
    
    setIsSubmitting(false);
    
    if (success) {
      setFormData({ name: '', timezone: 'America/Sao_Paulo', addressLine: '' });
      setIsDialogOpen(false);
    }
  };

  const handleEdit = (clinic: typeof clinics[0]) => {
    setSelectedClinic({ id: clinic.id, name: clinic.name });
    setFormData({
      name: clinic.name,
      timezone: clinic.timezone,
      addressLine: clinic.addressLine || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClinic) return;
    
    setIsSubmitting(true);
    
    const success = await updateClinic(selectedClinic.id, {
      name: formData.name,
      timezone: formData.timezone,
      addressLine: formData.addressLine || undefined,
    });
    
    setIsSubmitting(false);
    
    if (success) {
      setFormData({ name: '', timezone: 'America/Sao_Paulo', addressLine: '' });
      setSelectedClinic(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteClick = (clinic: typeof clinics[0]) => {
    setSelectedClinic({ id: clinic.id, name: clinic.name });
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedClinic) return;
    
    setIsSubmitting(true);
    
    const success = await deleteClinic(selectedClinic.id);
    
    setIsSubmitting(false);
    
    if (success) {
      setSelectedClinic(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl">Clínicas</h2>
          <p className="text-gray-600 mt-2">Gerencie as clínicas cadastradas no sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nova Clínica</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Clínica</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Nome da Clínica</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Clínica São Paulo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Input
                  id="timezone"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  placeholder="America/Sao_Paulo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="addressLine">Endereço (opcional)</Label>
                <Input
                  id="addressLine"
                  value={formData.addressLine}
                  onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                  placeholder="Ex: Av. Paulista, 1000"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar Clínica'
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
        ) : clinics.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Nenhuma clínica cadastrada</p>
            <p className="text-sm text-gray-500 mt-2">Clique em "Nova Clínica" para começar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Clínica</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Endereço</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Fuso Horário</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {clinics.map((clinic) => (
                  <tr key={clinic.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-medium">{clinic.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{clinic.addressLine || 'Não informado'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{clinic.timezone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEdit(clinic)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar clínica"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(clinic)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir clínica"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Clínica</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-name">Nome da Clínica</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Clínica São Paulo"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-timezone">Fuso Horário</Label>
              <Input
                id="edit-timezone"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                placeholder="America/Sao_Paulo"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-addressLine">Endereço (opcional)</Label>
              <Input
                id="edit-addressLine"
                value={formData.addressLine}
                onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                placeholder="Ex: Av. Paulista, 1000"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setFormData({ name: '', timezone: 'America/Sao_Paulo', addressLine: '' });
                  setSelectedClinic(null);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-gray-600">
              Tem certeza que deseja excluir a clínica <strong>{selectedClinic?.name}</strong>?
            </p>
            <p className="text-sm text-red-600">
              Esta ação não pode ser desfeita. Todas as filas e dados associados a esta clínica serão perdidos.
            </p>
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setSelectedClinic(null);
                }}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="button" 
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  'Excluir Clínica'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
