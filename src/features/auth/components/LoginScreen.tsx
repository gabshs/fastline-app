import { useState } from 'react';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onNavigateToRegister: () => void;
  onNavigateBack?: () => void;
}

export function LoginScreen({ onLogin, onNavigateToRegister, onNavigateBack }: LoginScreenProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onLogin(formData.email, formData.password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {onNavigateBack && (
          <button
            onClick={onNavigateBack}
            className="flex items-center text-white hover:text-blue-100 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
        )}
        
        <div className="text-center mb-8">
          <h1 className="text-5xl text-white mb-2">FastLine</h1>
          <p className="text-blue-200 text-lg">Sistema de Gestão de Filas</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl mb-2">Bem-vindo de volta</h2>
            <p className="text-gray-600">Entre com suas credenciais para acessar o sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-600">Lembrar-me</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700">
                Esqueceu a senha?
              </a>
            </div>

            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              <LogIn className="w-5 h-5 mr-2" />
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-gray-600">
              Não tem uma conta?{' '}
              <button
                onClick={onNavigateToRegister}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-blue-100 text-sm">
          <p>© 2026 FastLine. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
