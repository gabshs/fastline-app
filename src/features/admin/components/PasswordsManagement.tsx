import { useState } from 'react';
import { Key, ArrowRight, Pause, Play, Users, Clock } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

interface Password {
  id: string;
  number: string;
  patient: string;
  waitTime: string;
  status: 'waiting' | 'called' | 'attending';
}

export function PasswordsManagement() {
  const [selectedQueue, setSelectedQueue] = useState('cardiologia-sp');
  const [currentPassword, setCurrentPassword] = useState('A042');
  const [isPaused, setIsPaused] = useState(false);
  
  const [passwords, setPasswords] = useState<Password[]>([
    { id: '1', number: 'A043', patient: 'João Silva', waitTime: '15min', status: 'waiting' },
    { id: '2', number: 'A044', patient: 'Maria Santos', waitTime: '10min', status: 'waiting' },
    { id: '3', number: 'A045', patient: 'Pedro Oliveira', waitTime: '5min', status: 'waiting' },
    { id: '4', number: 'A046', patient: 'Ana Costa', waitTime: '2min', status: 'waiting' },
    { id: '5', number: 'A047', patient: 'Carlos Ferreira', waitTime: '1min', status: 'waiting' },
  ]);

  const callNextPassword = () => {
    if (passwords.length > 0) {
      const nextPassword = passwords[0];
      setCurrentPassword(nextPassword.number);
      setPasswords(passwords.slice(1));
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl">Gestão de Senhas</h2>
        <p className="text-gray-600 mt-2">Chame e gerencie as senhas de atendimento</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="mb-6">
              <label className="block text-sm mb-2 text-gray-600">Fila Selecionada</label>
              <Select value={selectedQueue} onValueChange={setSelectedQueue}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiologia-sp">Cardiologia - Clínica São Paulo</SelectItem>
                  <SelectItem value="ortopedia-rj">Ortopedia - Clínica Rio de Janeiro</SelectItem>
                  <SelectItem value="pediatria-bh">Pediatria - Clínica Belo Horizonte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white mb-6">
              <p className="text-sm opacity-90 mb-2">Senha Atual</p>
              <p className="text-6xl mb-4">{currentPassword}</p>
              <p className="text-sm opacity-90">Cardiologia - Consultório 3</p>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                onClick={callNextPassword}
                disabled={isPaused || passwords.length === 0}
                className="flex-1 h-14 text-lg"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Chamar Próxima Senha
              </Button>
              <Button 
                onClick={togglePause}
                variant="outline"
                className="h-14 px-8"
              >
                {isPaused ? (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Retomar
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pausar
                  </>
                )}
              </Button>
            </div>

            {isPaused && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Fila pausada. Clique em "Retomar" para continuar chamando senhas.
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl mb-4">Fila de Espera</h3>
            <div className="space-y-3">
              {passwords.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma senha aguardando</p>
                </div>
              ) : (
                passwords.map((password, index) => (
                  <div key={password.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-lg flex items-center justify-center">
                        <span className="text-lg">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-lg">{password.number}</p>
                        <p className="text-sm text-gray-600">{password.patient}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{password.waitTime}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl mb-4">Estatísticas</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Na Fila</p>
                <p className="text-3xl text-blue-600">{passwords.length}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Atendidos Hoje</p>
                <p className="text-3xl text-green-600">42</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Tempo Médio</p>
                <p className="text-3xl text-purple-600">18min</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl mb-4">Últimas Chamadas</h3>
            <div className="space-y-3">
              {[
                { number: 'A041', time: '2 min atrás' },
                { number: 'A040', time: '5 min atrás' },
                { number: 'A039', time: '8 min atrás' },
                { number: 'A038', time: '12 min atrás' },
              ].map((call, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Key className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">{call.number}</span>
                  </div>
                  <span className="text-sm text-gray-600">{call.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
