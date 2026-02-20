import { Clock, Users, TrendingUp, Shield, Smartphone, Monitor, ArrowRight, Check, Zap, Star, Building } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export function LandingPage({ onNavigateToLogin, onNavigateToRegister }: LandingPageProps) {
  const features = [
    {
      icon: Clock,
      title: 'Redução do Tempo de Espera',
      description: 'Otimize o fluxo de atendimento e reduza significativamente o tempo de espera dos seus pacientes.',
    },
    {
      icon: Users,
      title: 'Gestão Completa de Filas',
      description: 'Controle total sobre suas filas de atendimento com sistema intuitivo e eficiente.',
    },
    {
      icon: Monitor,
      title: 'Painel de TV',
      description: 'Exiba as senhas chamadas em telas grandes com design limpo e alta legibilidade.',
    },
    {
      icon: Smartphone,
      title: 'App para Pacientes',
      description: 'Seus pacientes podem acompanhar a fila em tempo real pelo celular de qualquer lugar.',
    },
    {
      icon: TrendingUp,
      title: 'Relatórios e Métricas',
      description: 'Acompanhe estatísticas e tome decisões baseadas em dados reais do seu negócio.',
    },
    {
      icon: Shield,
      title: 'Seguro e Confiável',
      description: 'Seus dados protegidos com as melhores práticas de segurança da informação.',
    },
  ];

  const benefits = [
    'Dashboard administrativo completo',
    'Gestão de múltiplas clínicas',
    'Controle de usuários e permissões',
    'Sistema de senhas inteligente',
    'Notificações em tempo real',
    'Suporte técnico dedicado',
  ];

  const plans = [
    {
      name: 'Starter',
      icon: Zap,
      price: 147,
      description: 'Ideal para começar a digitalizar sua fila',
      features: [
        'Até 2 clínicas',
        'Dashboard administrativo',
        'Gestão de senhas básica',
        'Painel de TV',
        'Até 5 usuários',
        'Suporte por email',
        'Relatórios básicos',
      ],
      highlighted: false,
    },
    {
      name: 'Profissional',
      icon: Star,
      price: 297,
      description: 'Tudo que você precisa para crescer',
      features: [
        'Clínicas ilimitadas',
        'Dashboard completo',
        'Gestão avançada de senhas',
        'Painel de TV personalizado',
        'Usuários ilimitados',
        'PWA para pacientes',
        'Notificações em tempo real',
        'Relatórios avançados',
        'Suporte prioritário',
        'Integrações via API',
      ],
      highlighted: true,
      badge: 'Mais Popular',
    },
    {
      name: 'Enterprise',
      icon: Building,
      price: null,
      description: 'Solução sob medida para sua rede',
      features: [
        'Tudo do Profissional',
        'Infraestrutura dedicada',
        'Personalização completa',
        'SLA garantido',
        'Gerente de conta dedicado',
        'Treinamento presencial',
        'Consultoria estratégica',
        'Integrações customizadas',
      ],
      highlighted: false,
      cta: 'Solicitar Orçamento',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Header/Navbar */}
      <header className="fixed top-0 w-full bg-gradient-to-b from-[#0B1C2D] to-[#070F1A] backdrop-blur-md border-b border-white/10 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/src/assets/images/logo.svg" 
              alt="FilaPro" 
              className="w-56 h-auto"
            />
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={onNavigateToLogin}
              className="text-slate-200 hover:text-white px-4 py-2 transition-colors font-medium"
            >
              Entrar
            </button>
            <Button 
              onClick={onNavigateToRegister}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-600/50 transition-all px-6 py-2.5"
            >
              Começar Grátis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold">
              Sistema de Gestão de Filas para Clínicas
            </div>
            <h1 className="text-6xl font-bold mb-6 text-slate-900 leading-tight">
              Transforme a experiência de atendimento da sua clínica
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Reduza o tempo de espera, organize suas filas e ofereça uma experiência moderna para seus pacientes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Button 
                size="lg" 
                onClick={onNavigateToRegister} 
                className="h-14 px-10 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all"
              >
                Criar Conta Grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <button
                onClick={onNavigateToLogin}
                className="h-14 px-10 text-lg border-2 border-slate-300 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all text-slate-700 font-semibold"
              >
                Ver Demonstração
              </button>
            </div>
            <p className="text-sm text-slate-500">
              Sem cartão de crédito • Configure em minutos
            </p>
          </div>

          {/* Hero Image/Mockup */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-8 bg-gray-100 rounded"></div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-24 bg-blue-50 rounded"></div>
                      <div className="h-24 bg-green-50 rounded"></div>
                      <div className="h-24 bg-purple-50 rounded"></div>
                    </div>
                    <div className="h-32 bg-gray-50 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Tudo que você precisa em um só lugar</h2>
            <p className="text-xl text-slate-600">
              Recursos completos para gestão profissional de filas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-slate-900">
                Por que escolher o FilaPro?
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Desenvolvido para clínicas que buscam excelência no atendimento e eficiência operacional.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-slate-700 text-base">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 font-medium">Senhas Atendidas Hoje</span>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-4xl font-bold text-slate-900">247</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 font-medium">Tempo Médio de Espera</span>
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-4xl font-bold text-slate-900">12 min</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 font-medium">Pacientes na Fila</span>
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-4xl font-bold text-slate-900">8</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold">
              Planos e Preços
            </div>
            <h2 className="text-5xl font-bold mb-6 text-slate-900">Escolha o plano ideal para sua clínica</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Todos os planos incluem 14 dias de teste grátis. Sem cartão de crédito.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all relative transform hover:-translate-y-1 ${
                    plan.highlighted 
                      ? 'border-2 border-blue-600 ring-4 ring-blue-100 lg:scale-105' 
                      : 'border border-slate-200'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-2.5 rounded-full text-sm font-bold shadow-xl">
                        ⭐ {plan.badge}
                      </span>
                    </div>
                  )}
                  
                  <div className={`p-8 ${plan.highlighted ? 'pt-10' : 'pt-8'}`}>
                    <div className={`w-16 h-16 ${plan.highlighted ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-blue-50'} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                      <Icon className={`w-8 h-8 ${plan.highlighted ? 'text-white' : 'text-blue-600'}`} />
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-3 text-slate-900">{plan.name}</h3>
                    <p className="text-slate-600 mb-8 text-base">{plan.description}</p>
                    
                    <div className="mb-8">
                      {plan.price !== null ? (
                        <>
                          <div className="flex items-baseline mb-2">
                            <span className="text-6xl font-bold text-slate-900">R$ {plan.price}</span>
                            <span className="text-slate-600 ml-3 text-lg font-medium">/mês</span>
                          </div>
                          <p className="text-sm text-slate-500">Cobrado mensalmente</p>
                        </>
                      ) : (
                        <div className="text-4xl font-bold text-slate-900">Sob consulta</div>
                      )}
                    </div>

                    <Button
                      onClick={onNavigateToRegister}
                      className={`w-full h-14 mb-8 text-base font-bold shadow-lg hover:shadow-xl transition-all ${
                        plan.highlighted
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                          : 'bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 hover:border-blue-600'
                      }`}
                    >
                      {plan.cta || 'Começar Grátis'}
                      {!plan.cta && <ArrowRight className="ml-2 w-5 h-5" />}
                    </Button>

                    <div className="space-y-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-5 pb-3 border-b border-slate-200">O que está incluído</p>
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Check className="w-3.5 h-3.5 text-green-600 font-bold" />
                          </div>
                          <span className="text-slate-700 text-base leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-8 bg-white rounded-2xl shadow-lg px-8 py-6 border border-slate-200">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-slate-700 font-medium">14 dias grátis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-slate-700 font-medium">Sem cartão de crédito</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-slate-700 font-medium">Cancele quando quiser</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 text-white">
            Pronto para transformar sua clínica?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Comece gratuitamente hoje e veja a diferença no seu atendimento.
          </p>
          <div className="flex items-center justify-center">
            <Button
              size="lg"
              onClick={onNavigateToRegister}
              className="h-16 px-12 text-lg bg-white text-blue-600 hover:bg-slate-50 font-semibold shadow-2xl hover:shadow-3xl transition-all"
            >
              Criar Conta Grátis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          <p className="text-blue-100 mt-6 text-base">
            Não precisa cartão de crédito
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gradient-to-b from-[#0B1C2D] to-[#070F1A] text-slate-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/src/assets/images/logo.svg" 
                  alt="FilaPro" 
                  className="h-20 w-auto"
                />
              </div>
              <p className="text-sm text-slate-400">
                Sistema de gestão de filas para clínicas modernas.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demonstração</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-700 text-center text-sm">
            <p className="text-slate-400">© 2026 FilaPro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}