import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';

export function TVPanel() {
  const [currentPassword, setCurrentPassword] = useState('A042');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const lastCalled = [
    { number: 'A041', room: 'Consultório 3' },
    { number: 'A040', room: 'Consultório 2' },
    { number: 'A039', room: 'Consultório 1' },
    { number: 'A038', room: 'Consultório 3' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl">FastLine</h1>
            <p className="text-blue-200 text-lg mt-1">Clínica São Paulo - Cardiologia</p>
          </div>
          <div className="text-right">
            <p className="text-4xl">{currentTime.toLocaleTimeString('pt-BR')}</p>
            <p className="text-blue-200 text-lg mt-1">
              {currentTime.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-16 mb-8 border border-white/20">
          <div className="flex items-center justify-center mb-6">
            <Volume2 className="w-12 h-12 mr-4 animate-pulse" />
            <p className="text-3xl">Chamando Senha</p>
          </div>
          <div className="text-center">
            <p className="text-9xl mb-6 tracking-wider animate-pulse">{currentPassword}</p>
            <p className="text-4xl">Consultório 3</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <h2 className="text-3xl mb-6">Últimas Senhas Chamadas</h2>
          <div className="grid grid-cols-4 gap-6">
            {lastCalled.map((password, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <p className="text-5xl mb-3">{password.number}</p>
                <p className="text-lg text-blue-200">{password.room}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xl text-blue-200">
            Aguarde ser chamado e dirija-se ao consultório indicado
          </p>
        </div>
      </div>
    </div>
  );
}
