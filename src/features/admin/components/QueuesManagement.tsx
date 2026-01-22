import { useState } from 'react';
import { ListOrdered, Plus, Edit, Trash2, Users, Clock } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

interface Queue {
  id: string;
  name: string;
  clinic: string;
  waiting: number;
  avgTime: string;
  status: 'active' | 'paused' | 'closed';
}

export function QueuesManagement() {
  const [queues, setQueues] = useState<Queue[]>([
    {
      id: '1',
      name: 'Cardiologia',
      clinic: 'Clínica São Paulo',
      waiting: 12,
      avgTime: '15min',
      status: 'active',
    },
    {
      id: '2',
      name: 'Ortopedia',
      clinic: 'Clínica Rio de Janeiro',
      waiting: 8,
      avgTime: '22min',
      status: 'active',
    },
    {
      id: '3',
      name: 'Pediatria',
      clinic: 'Clínica Belo Horizonte',
      waiting: 15,
      avgTime: '18min',
      status: 'active',
    },
    {
      id: '4',
      name: 'Dermatologia',
      clinic: 'Clínica São Paulo',
      waiting: 6,
      avgTime: '12min',
      status: 'paused',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    clinic: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQueue: Queue = {
      id: String(queues.length + 1),
      name: formData.name,
      clinic: formData.clinic,
      waiting: 0,
      avgTime: '0min',
      status: 'active',
    };
    setQueues([...queues, newQueue]);
    setFormData({ name: '', clinic: '' });
    setIsDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'paused':
        return 'Pausada';
      case 'closed':
        return 'Encerrada';
      default:
        return status;
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl">Filas</h2>
          <p className="text-gray-600 mt-2">Gerencie as filas de atendimento</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nova Fila</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Fila</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Nome da Fila</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Cardiologia"
                  required
                />
              </div>
              <div>
                <Label htmlFor="clinic">Clínica</Label>
                <Select value={formData.clinic} onValueChange={(value) => setFormData({ ...formData, clinic: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma clínica" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Clínica São Paulo">Clínica São Paulo</SelectItem>
                    <SelectItem value="Clínica Rio de Janeiro">Clínica Rio de Janeiro</SelectItem>
                    <SelectItem value="Clínica Belo Horizonte">Clínica Belo Horizonte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Criar Fila</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {queues.map((queue) => (
          <div key={queue.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <ListOrdered className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{queue.name}</h3>
                  <p className="text-sm text-gray-600">{queue.clinic}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(queue.status)}`}>
                {getStatusLabel(queue.status)}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Aguardando</span>
                </div>
                <span className="font-medium">{queue.waiting}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Tempo Médio</span>
                </div>
                <span className="font-medium">{queue.avgTime}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
