import { useState, useEffect } from 'react';
import { Mail, Lock, User, Building2, UserPlus, ArrowLeft, Eye, EyeOff, AlertCircle, X, FileText } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import filaProLogo from '@/assets/images/logo.svg';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

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

    if (!acceptedTerms) {
      newErrors.terms = 'Você deve aceitar os Termos de Uso e Política de Privacidade';
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockOn(true);
    } else {
      setCapsLockOn(false);
    }
  };

  useEffect(() => {
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
      <div className="w-full max-w-2xl">

        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <img 
              src={filaProLogo} 
              alt="FilaPro" 
              className="w-56 h-auto"
            />
          </div>
          <p className="text-slate-400 text-base">Crie sua conta e comece a gerenciar suas filas</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-10">
          <button
            onClick={onNavigateBack || onNavigateToLogin}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>{onNavigateBack ? 'Voltar' : 'Voltar para login'}</span>
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Criar nova conta</h2>
            <p className="text-slate-500">Preencha os dados abaixo para começar</p>
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
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      setErrors({ ...errors, password: '' });
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Espaço fixo para mensagem de Caps Lock - evita movimento */}
                <div className="h-6 mt-1">
                  {capsLockOn && (
                    <div className="flex items-center text-amber-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span>Caps Lock está ativado</span>
                    </div>
                  )}
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      setErrors({ ...errors, confirmPassword: '' });
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Espaço fixo para mensagem de Caps Lock - evita movimento */}
                <div className="h-6 mt-1">
                  {capsLockOn && (
                    <div className="flex items-center text-amber-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span>Caps Lock está ativado</span>
                    </div>
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    setErrors({ ...errors, terms: '' });
                  }}
                  className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                />
                <span className="text-sm text-slate-600">
                  Li e aceito os{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-blue-600 hover:text-blue-700 underline font-medium"
                  >
                    Termos de Uso e Política de Privacidade
                  </button>
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-600 text-sm">{errors.terms}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all" 
              disabled={isLoading}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-slate-600">
              Já tem uma conta?{' '}
              <button
                onClick={onNavigateToLogin}
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>

        {/* Modal de Termos de Uso */}
        {showTermsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowTermsModal(false)}>
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Termos de Uso e Política de Privacidade</h2>
                </div>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)] prose prose-slate prose-sm">
                <h3 className="text-xl font-bold text-slate-900 mt-0">1. Apresentação</h3>
                <p>Bem-vindo ao FilaPro!</p>
                <p>O FilaPro é uma plataforma digital disponibilizada na nuvem, destinada à gestão de filas e atendimentos presenciais, permitindo que clínicas, consultórios e estabelecimentos organizem o fluxo de atendimento de forma eficiente, transparente e previsível, por meio de painéis administrativos, painéis de exibição (TV), emissão de senhas e acompanhamento em tempo real.</p>
                <p>Ao utilizar o FilaPro, você concorda integralmente com estes Termos de Uso e Política de Privacidade.</p>

                <h3 className="text-xl font-bold text-slate-900 mt-6">2. Aceitação dos Termos</h3>
                <p>Ao acessar, utilizar ou navegar pelo sistema FilaPro, você declara que leu, compreendeu e concorda com todos os termos aqui descritos.</p>
                <p>Caso não concorde com estes Termos, não utilize o FilaPro.</p>

                <h3 className="text-xl font-bold text-slate-900 mt-6">3. Definições</h3>
                <p>Para fins destes Termos:</p>
                <ul>
                  <li><strong>FilaPro:</strong> plataforma de software de gestão de filas.</li>
                  <li><strong>Usuário:</strong> pessoa física autorizada pela empresa contratante a utilizar o sistema.</li>
                  <li><strong>Empresa Contratante:</strong> clínica, consultório ou organização que contrata o FilaPro.</li>
                  <li><strong>Painel TV:</strong> interface pública destinada à exibição de senhas e chamadas.</li>
                  <li><strong>Dados:</strong> informações inseridas no sistema, incluindo dados operacionais e, quando aplicável, dados pessoais.</li>
                </ul>

                <h3 className="text-xl font-bold text-slate-900 mt-6">4. Objeto do Serviço</h3>
                <p>O FilaPro disponibiliza funcionalidades como:</p>
                <ul>
                  <li>Criação e gerenciamento de filas de atendimento;</li>
                  <li>Emissão e controle de senhas;</li>
                  <li>Painel administrativo para gestão;</li>
                  <li>Painel público (TV) para exibição de chamadas;</li>
                  <li>Acompanhamento em tempo real do status de atendimento;</li>
                  <li>Integração entre dispositivos autorizados.</li>
                </ul>
                <p>O serviço é destinado exclusivamente à empresa contratante e seus colaboradores autorizados.</p>

                <h3 className="text-xl font-bold text-slate-900 mt-6">5. Cadastro e Responsabilidades do Usuário</h3>
                <p>O usuário compromete-se a:</p>
                <ul>
                  <li>Fornecer informações verdadeiras, completas e atualizadas;</li>
                  <li>Manter a confidencialidade de suas credenciais de acesso;</li>
                  <li>Utilizar o sistema de forma ética, legal e conforme estes Termos.</li>
                </ul>
                <p>O FilaPro não se responsabiliza por acessos indevidos decorrentes de negligência do usuário.</p>

                <h3 className="text-xl font-bold text-slate-900 mt-6">6. Uso Adequado do Sistema</h3>
                <p>É expressamente proibido:</p>
                <ul>
                  <li>Utilizar o sistema para fins ilegais;</li>
                  <li>Tentar acessar áreas não autorizadas;</li>
                  <li>Realizar engenharia reversa, cópia ou exploração indevida do software;</li>
                  <li>Inserir códigos maliciosos, vírus ou scripts;</li>
                  <li>Utilizar robôs, scrapers ou automações não autorizadas.</li>
                </ul>
                <p>O descumprimento poderá resultar na suspensão ou encerramento da conta, sem aviso prévio.</p>

                <h3 className="text-xl font-bold text-slate-900 mt-6">7. Painel TV e Informações Públicas</h3>
                <p>O Painel TV do FilaPro é destinado à exibição pública de:</p>
                <ul>
                  <li>Senhas;</li>
                  <li>Status de atendimento;</li>
                  <li>Informações operacionais.</li>
                </ul>
                <p>O FilaPro não recomenda a exibição de dados sensíveis ou informações pessoais identificáveis de pacientes no painel público. A responsabilidade pelo conteúdo exibido é da empresa contratante.</p>

                <h3 className="text-xl font-bold text-slate-900 mt-6">8. Assinatura, Cobrança e Cancelamento</h3>
                <h4 className="text-lg font-semibold text-slate-900 mt-4">8.1 Assinatura</h4>
                <p>O uso do FilaPro pode estar condicionado a planos de assinatura pagos, conforme valores e condições divulgados no momento da contratação.</p>
                <h4 className="text-lg font-semibold text-slate-900 mt-4">8.2 Cobrança</h4>
                <p>As cobranças são recorrentes e realizadas conforme o plano contratado.</p>
                <h4 className="text-lg font-semibold text-slate-900 mt-4">8.3 Cancelamento</h4>
                <p>O cancelamento pode ser solicitado a qualquer momento. Não há reembolso proporcional por períodos já utilizados, salvo disposição legal em contrário.</p>

                <h3 className="text-xl font-bold text-slate-900 mt-6">9. Privacidade e Proteção de Dados (LGPD)</h3>
                <p>O FilaPro trata dados pessoais em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD).</p>
                <h4 className="text-lg font-semibold text-slate-900 mt-4">9.1 Dados Coletados</h4>
                <p>Podem ser coletados:</p>
                <ul>
                  <li>Dados de cadastro (nome, e-mail, empresa);</li>
                  <li>Dados operacionais de atendimento;</li>
                  <li>Dados técnicos (logs, IP, dispositivos).</li>
                </ul>
                <h4 className="text-lg font-semibold text-slate-900 mt-4">9.2 Finalidade</h4>
                <p>Os dados são utilizados para:</p>
                <ul>
                  <li>Operação do sistema;</li>
                  <li>Suporte técnico;</li>
                  <li>Melhoria contínua do serviço;</li>
                  <li>Cumprimento de obrigações legais.</li>
                </ul>
                <h4 className="text-lg font-semibold text-slate-900 mt-4">9.3 Responsabilidade sobre Dados de Pacientes</h4>
                <p>A empresa contratante é a controladora dos dados dos pacientes inseridos no sistema. O FilaPro atua como operador, conforme a LGPD.</p>

                <h3 className="text-xl font-bold text-slate-900 mt-6">10. Segurança da Informação</h3>
                <p>O FilaPro adota medidas técnicas e organizacionais para proteger os dados, incluindo:</p>
                <ul>
                  <li>Controle de acesso;</li>
                  <li>Autenticação;</li>
                  <li>Monitoramento;</li>
                  <li>Comunicação segura.</li>
                </ul>
                <p>Contudo, não é possível garantir segurança absoluta contra todos os riscos digitais.</p>

                <h3 className="text-xl font-bold text-slate-900 mt-6">11. Isenção de Garantias</h3>
                <p>O serviço é fornecido "no estado em que se encontra" e "conforme disponibilidade".</p>
                <p>O FilaPro não garante que:</p>
                <ul>
                  <li>O serviço será ininterrupto;</li>
                  <li>Estará livre de erros;</li>
                  <li>Atenderá a todas as expectativas específicas do usuário.</li>
                </ul>

                <h3 className="text-xl font-bold text-slate-900 mt-6">12. Limitação de Responsabilidade</h3>
                <p>Na máxima extensão permitida por lei, o FilaPro não se responsabiliza por:</p>
                <ul>
                  <li>Perdas financeiras indiretas;</li>
                  <li>Danos consequenciais;</li>
                  <li>Falhas decorrentes de uso indevido;</li>
                  <li>Problemas causados por terceiros ou infraestrutura externa.</li>
                </ul>

                <h3 className="text-xl font-bold text-slate-900 mt-6">13. Alterações dos Termos</h3>
                <p>O FilaPro poderá alterar estes Termos a qualquer momento. As alterações entrarão em vigor após sua publicação no sistema.</p>
                <p>O uso contínuo do serviço após alterações implica aceitação automática.</p>

                <h3 className="text-xl font-bold text-slate-900 mt-6">14. Suporte e Atendimento</h3>
                <p>O suporte será prestado conforme os canais oficiais disponibilizados pelo FilaPro.</p>

                <h3 className="text-xl font-bold text-slate-900 mt-6">15. Disposições Finais</h3>
                <p>Se qualquer cláusula destes Termos for considerada inválida, as demais permanecerão em pleno vigor.</p>
                <p>Estes Termos são regidos pelas leis da República Federativa do Brasil.</p>

                <div className="mt-8 p-4 bg-slate-100 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1"><strong>📌 Versão:</strong> 1.0</p>
                  <p className="text-sm text-slate-600 mb-1"><strong>📅 Última atualização:</strong> Fevereiro de 2026</p>
                  <p className="text-sm text-slate-600">© 2026 FilaPro. Todos os direitos reservados.</p>
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 flex justify-end">
                <Button
                  onClick={() => setShowTermsModal(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>© 2026 FilaPro. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
