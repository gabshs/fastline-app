import { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import filaProLogo from '@/assets/images/logo.svg';

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
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Salvar email se "Lembrar-me" estiver marcado
    if (rememberMe) {
      localStorage.setItem('filapro_remembered_email', formData.email);
    } else {
      localStorage.removeItem('filapro_remembered_email');
    }
    
    await onLogin(formData.email, formData.password);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockOn(true);
    } else {
      setCapsLockOn(false);
    }
  };

  useEffect(() => {
    // Carregar email salvo se existir
    const savedEmail = localStorage.getItem('filapro_remembered_email');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.getModifierState && e.getModifierState('CapsLock')) {
        setCapsLockOn(true);
      } else {
        setCapsLockOn(false);
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1C2D] to-[#070F1A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <img 
              src={filaProLogo} 
              alt="FilaPro" 
              className="w-56 h-auto"
            />
          </div>
          <p className="text-slate-400 text-base">Sistema de Gestão de Filas</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-10">
          {onNavigateBack && (
            <button
              onClick={onNavigateBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </button>
          )}
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Bem-vindo de volta</h2>
            <p className="text-slate-500">Entre com suas credenciais para acessar o sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="pl-10 h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-700 font-medium">Senha</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Espaço fixo para mensagem de Caps Lock - evita movimento */}
              <div className="h-6 mt-2">
                {capsLockOn && (
                  <div className="flex items-center text-amber-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>Caps Lock está ativado</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                />
                <span className="text-slate-600">Lembrar-me</span>
              </label>
              <a href="#" className="text-blue-500 hover:text-blue-600 transition-colors">
                Esqueceu a senha?
              </a>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all mt-6" 
              disabled={isLoading}
            >
              <LogIn className="w-5 h-5 mr-2" />
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-slate-600">
              Não tem uma conta?{' '}
              <button
                onClick={onNavigateToRegister}
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>© 2026 FilaPro. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
