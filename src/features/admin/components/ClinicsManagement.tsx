import { useState } from 'react';
import { Building2, Plus, Edit, Trash2, MapPin, Phone } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { Label } from '@/shared/ui/label';

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  queues: number;
  status: 'active' | 'inactive';
}

export function ClinicsManagement() {
  const [clinics, setClinics] = useState<Clinic[]>([
    {
      id: '1',
      name: 'Clínica São Paulo',
      address: 'Av. Paulista, 1000 - São Paulo, SP',
      phone: '(11) 3333-4444',
      queues: 5,
      status: 'active',
    },
    {
      id: '2',
      name: 'Clínica Rio de Janeiro',
      address: 'Av. Atlântica, 500 - Rio de Janeiro, RJ',
      phone: '(21) 2222-3333',
      queues: 3,
      status: 'active',
    },
    {
      id: '3',
      name: 'Clínica Belo Horizonte',
      address: 'Av. Afonso Pena, 200 - Belo Horizonte, MG',
      phone: '(31) 3333-5555',
      queues: 4,
      status: 'active',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClinic: Clinic = {
      id: String(clinics.length + 1),
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      queues: 0,
      status: 'active',
    };
    setClinics([...clinics, newClinic]);
    setFormData({ name: '', address: '', phone: '' });
    setIsDialogOpen(false);
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
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ex: Av. Paulista, 1000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 3333-4444"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Cadastrar Clínica</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Clínica</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Endereço</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Telefone</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Filas</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Status</th>
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
                      <span className="text-sm">{clinic.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{clinic.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{clinic.queues} filas</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      clinic.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {clinic.status === 'active' ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
