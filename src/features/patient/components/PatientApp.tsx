import { useState } from 'react';
import { User, Clock, Users, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

export function PatientApp() {
  const [view, setView] = useState<'select' | 'form' | 'waiting'>('select');
  const [selectedQueue, setSelectedQueue] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [passwordNumber, setPasswordNumber] = useState('');
  const [position, setPosition] = useState(0);

  const queues = [
    { id: 'cardiologia-sp', name: 'Cardiologia', clinic: 'Clínica São Paulo', waiting: 12, avgTime: '15min' },
    { id: 'ortopedia-rj', name: 'Ortopedia', clinic: 'Clínica Rio de Janeiro', waiting: 8, avgTime: '22min' },
    { id: 'pediatria-bh', name: 'Pediatria', clinic: 'Clínica Belo Horizonte', waiting: 15, avgTime: '18min' },
    { id: 'dermatologia-sp', name: 'Dermatologia', clinic: 'Clínica São Paulo', waiting: 6, avgTime: '12min' },
  ];

  const handleSelectQueue = (queueId: string) => {
    setSelectedQueue(queueId);
    setView('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queue = queues.find(q => q.id === selectedQueue);
    if (queue) {
      setPasswordNumber(`A${Math.floor(Math.random() * 900) + 100}`);
      setPosition(queue.waiting + 1);
      setView('waiting');
    }
  };

  const selectedQueueData = queues.find(q => q.id === selectedQueue);

  if (view === 'select') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-3xl mb-2">FilaPro</h1>
            <p className="text-gray-600">Entre na fila de forma rápida e fácil</p>
          </div>

          <div className="mb-4">
            <h2 className="text-xl mb-4">Selecione uma Fila</h2>
          </div>

          <div className="space-y-4">
            {queues.map((queue) => (
              <button
                key={queue.id}
                onClick={() => handleSelectQueue(queue.id)}
                className="w-full bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl mb-1">{queue.name}</h3>
                    <p className="text-gray-600">{queue.clinic}</p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    Aberta
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{queue.waiting} na fila</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Média: {queue.avgTime}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'form') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setView('select')}
            className="flex items-center space-x-2 text-gray-600 mb-6 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl mb-2">Entrar na Fila</h2>
            <p className="text-gray-600">{selectedQueueData?.name} - {selectedQueueData?.clinic}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Digite seu nome"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pessoas na fila:</span>
                  <span className="font-medium">{selectedQueueData?.waiting}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tempo médio de espera:</span>
                  <span className="font-medium">{selectedQueueData?.avgTime}</span>
                </div>
              </div>

              <Button type="submit" className="w-full h-12">
                Entrar na Fila
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl mb-2">Você está na fila!</h2>
          <p className="text-gray-600">{selectedQueueData?.name} - {selectedQueueData?.clinic}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center">
          <p className="text-gray-600 mb-2">Sua Senha</p>
          <p className="text-6xl mb-4 text-blue-600">{passwordNumber}</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Paciente: {formData.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-3xl mb-1">{position - 1}</p>
            <p className="text-sm text-gray-600">Pessoas à sua frente</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-3xl mb-1">{selectedQueueData?.avgTime}</p>
            <p className="text-sm text-gray-600">Tempo médio de espera</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium mb-2">Informações importantes:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Fique atento ao painel de chamadas</li>
            <li>• Você receberá um aviso quando estiver próximo</li>
            <li>• Mantenha-se na área de espera</li>
            <li>• Tempo estimado pode variar conforme complexidade dos atendimentos</li>
          </ul>
        </div>

        <Button
          onClick={() => setView('select')}
          variant="outline"
          className="w-full mt-6"
        >
          Voltar ao Início
        </Button>
      </div>
    </div>
  );
}
