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
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">F</span>
            </div>
            <span className="text-2xl text-gray-900">FastLine</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onNavigateToLogin}
              className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Entrar
            </button>
            <Button onClick={onNavigateToRegister}>
              Começar Grátis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm">
              Sistema de Gestão de Filas para Clínicas
            </div>
            <h1 className="text-6xl mb-6 text-gray-900">
              Transforme a experiência de atendimento da sua clínica
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Gerencie filas de atendimento de forma inteligente, reduza o tempo de espera 
              e ofereça uma experiência moderna para seus pacientes com o FastLine.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button size="lg" onClick={onNavigateToRegister} className="h-14 px-8 text-lg">
                Criar Conta Grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <button
                onClick={onNavigateToLogin}
                className="h-14 px-8 text-lg border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                Ver Demonstração
              </button>
            </div>
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
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-gray-900">Tudo que você precisa em um só lugar</h2>
            <p className="text-xl text-gray-600">
              Recursos completos para gestão profissional de filas de atendimento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl mb-6 text-gray-900">
                Por que escolher o FastLine?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Desenvolvido especialmente para clínicas que buscam excelência 
                no atendimento e eficiência operacional.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12">
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Senhas Atendidas Hoje</span>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-3xl">247</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Tempo Médio de Espera</span>
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-3xl">12 min</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Pacientes na Fila</span>
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-3xl">8</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-gray-900">Planos que se adaptam ao seu negócio</h2>
            <p className="text-xl text-gray-600">
              Escolha o plano que melhor atende às suas necessidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all relative ${
                    plan.highlighted 
                      ? 'border-2 border-blue-600 scale-105 lg:scale-110' 
                      : 'border border-gray-200'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className={`w-14 h-14 ${plan.highlighted ? 'bg-blue-600' : 'bg-blue-100'} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className={`w-7 h-7 ${plan.highlighted ? 'text-white' : 'text-blue-600'}`} />
                    </div>
                    
                    <h3 className="text-2xl mb-2 text-gray-900">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      {plan.price !== null ? (
                        <>
                          <div className="flex items-baseline">
                            <span className="text-5xl text-gray-900">R$ {plan.price}</span>
                            <span className="text-gray-600 ml-2">/mês</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-3xl text-gray-900">Sob consulta</div>
                      )}
                    </div>

                    <Button
                      onClick={onNavigateToRegister}
                      className={`w-full h-12 mb-6 ${
                        plan.highlighted
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                    >
                      {plan.cta || 'Começar Grátis'}
                      {!plan.cta && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>

                    <div className="space-y-3">
                      <p className="text-sm text-gray-500 uppercase tracking-wide">Incluso:</p>
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Todos os planos incluem 14 dias de teste grátis • Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl mb-6 text-white">
            Pronto para revolucionar sua clínica?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Comece gratuitamente hoje e veja a diferença que o FastLine pode fazer 
            para o seu negócio e seus pacientes.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button
              size="lg"
              onClick={onNavigateToRegister}
              className="h-14 px-8 text-lg bg-white text-blue-600 hover:bg-gray-100"
            >
              Criar Conta Grátis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          <p className="text-blue-200 mt-6 text-sm">
            Não precisa cartão de crédito • Configure em minutos
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white">F</span>
                </div>
                <span className="text-xl text-white">FastLine</span>
              </div>
              <p className="text-sm">
                Sistema de gestão de filas para clínicas modernas.
              </p>
            </div>
            
            <div>
              <h4 className="text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white">Preços</a></li>
                <li><a href="#" className="hover:text-white">Demonstração</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Sobre</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white">Documentação</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center text-sm">
            <p>© 2026 FastLine. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}