import { useState } from 'react';
import { Mail, Lock, User, Building2, UserPlus, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

interface RegisterScreenProps {
  onRegister: (data: {
    tenantName: string;
    ownerName: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
  onNavigateToLogin: () => void;
  onNavigateBack?: () => void;
}

export function RegisterScreen({ onRegister, onNavigateToLogin, onNavigateBack }: RegisterScreenProps) {
  const [formData, setFormData] = useState({
    email: '',
    tenantName: '',
    ownerName: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'A senha deve ter no mínimo 8 caracteres';
    }

    if (!formData.tenantName.trim()) {
      newErrors.tenantName = 'Nome do grupo é obrigatório';
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Nome do responsável é obrigatório';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const success = await onRegister({
      tenantName: formData.tenantName,
      ownerName: formData.ownerName,
      email: formData.email,
      password: formData.password,
    });
    setIsLoading(false);

    // If successful, the hook will handle navigation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <button
          onClick={onNavigateBack || onNavigateToLogin}
          className="flex items-center space-x-2 text-white mb-6 hover:text-blue-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{onNavigateBack ? 'Voltar' : 'Voltar para login'}</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-5xl text-white mb-2">FastLine</h1>
          <p className="text-blue-200 text-lg">Crie sua conta e comece a gerenciar suas filas</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl mb-2">Criar nova conta</h2>
            <p className="text-gray-600">Preencha os dados abaixo para começar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="tenantName">Nome do grupo</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="tenantName"
                  type="text"
                  value={formData.tenantName}
                  onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                  placeholder="Grupo São Lucas"
                  className="pl-10"
                  required
                />
                {errors.tenantName && <p className="text-red-500 text-sm mt-1">{errors.tenantName}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="ownerName">Nome do responsável</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="ownerName"
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="Dr. João Silva"
                  className="pl-10"
                  required
                />
                {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contato@clinica.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      setErrors({ ...errors, password: '' });
                    }}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      setErrors({ ...errors, confirmPassword: '' });
                    }}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-700">
                <strong>Ao criar uma conta, você concorda com:</strong>
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• Termos de Uso do FastLine</li>
                <li>• Política de Privacidade</li>
                <li>• Uso responsável dos dados dos pacientes</li>
              </ul>
            </div>

            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              <UserPlus className="w-5 h-5 mr-2" />
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <button
                onClick={onNavigateToLogin}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Fazer login
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
