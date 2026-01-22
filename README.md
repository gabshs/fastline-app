# 🏥 FastLine - Sistema de Gestão de Filas para Clínicas

> Sistema SaaS moderno para gestão de filas de atendimento em clínicas e centros médicos, com interface para pacientes, administradores e painéis de TV.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.12-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API](#-api)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

## 🎯 Sobre o Projeto

O FastLine é uma solução completa para gerenciamento de filas em clínicas e estabelecimentos de saúde. O sistema permite que clínicas gerenciem seus atendimentos de forma eficiente, pacientes acompanhem sua posição na fila em tempo real, e painéis de TV exibam informações relevantes na sala de espera.

### Design Original

Este projeto foi desenvolvido a partir do design disponível em:
[FastLine Queue Management SaaS - Figma](https://www.figma.com/design/ielUF8UrxyfbfOZgFmLohY/FastLine-Queue-Management-SaaS)

## ✨ Funcionalidades

### 👨‍⚕️ Painel Administrativo
- **Dashboard Analítico**: Visualização de métricas e estatísticas em tempo real
- **Gerenciamento de Clínicas**: CRUD completo para cadastro e edição de clínicas
- **Gerenciamento de Filas**: Criação, edição e controle de filas de atendimento
- **Gerenciamento de Usuários**: Controle de acesso e permissões
- **Gerenciamento de Senhas**: Emissão e controle de senhas de atendimento
- **Relatórios**: Geração de relatórios e análises de atendimento

### 👤 Interface do Paciente
- **Emissão de Senhas**: Solicitação de senha de atendimento
- **Acompanhamento em Tempo Real**: Visualização da posição na fila
- **Notificações**: Alertas sobre proximidade do atendimento
- **Histórico**: Consulta de atendimentos anteriores

### 📺 Painel de TV
- **Display de Senhas**: Exibição das senhas sendo chamadas
- **Informações da Clínica**: Exibição de informações e avisos
- **Interface Otimizada**: Layout responsivo para diferentes tamanhos de tela

### 🔐 Autenticação e Segurança
- **Login Seguro**: Autenticação via JWT
- **Registro de Usuários**: Cadastro de novos usuários e clínicas
- **Controle de Acesso**: Diferentes níveis de permissão
- **Sessões Persistentes**: Manutenção de sessão via localStorage

## 🛠 Tecnologias

### Core
- **[React](https://reactjs.org/)** `18.3.1` - Biblioteca para construção de interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Vite](https://vitejs.dev/)** `6.3.5` - Build tool e dev server ultra-rápido

### UI/UX
- **[TailwindCSS](https://tailwindcss.com/)** `4.1.12` - Framework CSS utility-first
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis e não-estilizados
- **[Material UI](https://mui.com/)** `7.3.5` - Componentes React seguindo Material Design
- **[Lucide React](https://lucide.dev/)** - Biblioteca de ícones
- **[Framer Motion](https://www.framer.com/motion/)** - Animações fluidas

### Bibliotecas Auxiliares
- **[React Hook Form](https://react-hook-form.com/)** `7.55.0` - Gerenciamento de formulários
- **[date-fns](https://date-fns.org/)** `3.6.0` - Manipulação de datas
- **[Recharts](https://recharts.org/)** `2.15.2` - Gráficos e visualizações
- **[React DnD](https://react-dnd.github.io/react-dnd/)** `16.0.1` - Drag and Drop
- **[Sonner](https://sonner.emilkowal.ski/)** `2.0.3` - Toast notifications

### Ferramentas de Desenvolvimento
- **[PostCSS](https://postcss.org/)** - Processador CSS
- **[class-variance-authority](https://cva.style/docs)** - Gerenciamento de variantes de componentes
- **[clsx](https://github.com/lukeed/clsx)** - Utilitário para classes condicionais

## 🏗 Arquitetura

O projeto segue uma arquitetura modular baseada em features, com separação clara de responsabilidades:

```
src/
├── app/                      # Configuração principal
├── features/                 # Módulos por domínio
│   ├── auth/                # Autenticação
│   ├── admin/               # Painel administrativo
│   ├── patient/             # Interface do paciente
│   └── tv/                  # Painel de TV
├── shared/                   # Recursos compartilhados
│   ├── components/          # Componentes reutilizáveis
│   └── ui/                  # Sistema de design
├── hooks/                    # React Hooks customizados
├── services/                 # Lógica de negócio
├── types/                    # Definições TypeScript
├── utils/                    # Funções utilitárias
├── constants/               # Constantes da aplicação
└── styles/                   # Estilos globais
```

### Princípios Arquiteturais

1. **Feature-Based Organization**: Cada funcionalidade é isolada em sua própria pasta
2. **Separation of Concerns**: Separação entre apresentação, lógica e dados
3. **Type Safety**: Uso rigoroso de TypeScript em todo o projeto
4. **Component Composition**: Componentes pequenos e reutilizáveis
5. **Custom Hooks**: Lógica compartilhada através de hooks customizados
6. **Service Layer**: Camada de serviços para lógica de negócio

Para mais detalhes, consulte [ARCHITECTURE.md](./ARCHITECTURE.md).

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 ou **pnpm** >= 8.0.0 (recomendado)
- **Git**

### Backend
O projeto requer o backend FastLine API rodando localmente:
- **URL padrão**: `http://localhost:8080`
- Consulte [integration.md](./integration.md) para documentação completa da API

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/fastline-app.git
cd fastline-app
```

### 2. Instale as dependências
```bash
# Com npm
npm install

# Ou com pnpm (recomendado)
pnpm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário:
```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=FastLine
```

### 4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 💻 Uso

### Desenvolvimento
```bash
npm run dev          # Inicia o servidor de desenvolvimento
```

### Build
```bash
npm run build        # Gera build de produção
```

### Acesso ao Sistema

#### Administrador
1. Acesse `http://localhost:5173`
2. Faça login com credenciais de administrador
3. Navegue pelo dashboard e módulos de gerenciamento

#### Paciente
1. Acesse a interface do paciente
2. Solicite uma senha de atendimento
3. Acompanhe sua posição na fila

#### Painel de TV
1. Acesse o painel de TV em um navegador
2. Visualize as senhas sendo chamadas em tempo real

## 📁 Estrutura do Projeto

```
fastline-app/
├── public/                   # Arquivos estáticos
├── src/
│   ├── app/                 # Componente principal
│   │   ├── App.tsx          # Componente raiz
│   │   └── components/      # Componentes da app
│   │
│   ├── features/            # Funcionalidades por domínio
│   │   ├── auth/           # Autenticação e registro
│   │   │   ├── components/
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── RegisterScreen.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── admin/          # Painel administrativo
│   │   │   ├── components/
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── ClinicsManagement.tsx
│   │   │   │   ├── QueuesManagement.tsx
│   │   │   │   ├── UsersManagement.tsx
│   │   │   │   └── PasswordsManagement.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── patient/        # Interface do paciente
│   │   │   ├── components/
│   │   │   │   └── PatientApp.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── tv/            # Painel de TV
│   │       ├── components/
│   │       │   └── TVPanel.tsx
│   │       └── index.ts
│   │
│   ├── shared/             # Recursos compartilhados
│   │   ├── components/    # Componentes reutilizáveis
│   │   └── ui/            # Sistema de design (Radix UI)
│   │
│   ├── hooks/             # Custom Hooks
│   │   ├── useAuth.ts     # Autenticação
│   │   ├── useClinics.ts  # Gerenciamento de clínicas
│   │   ├── useNavigation.ts # Navegação
│   │   └── index.ts
│   │
│   ├── services/          # Camada de serviços
│   │   ├── apiClient.ts   # Cliente HTTP
│   │   ├── authService.ts # Serviço de autenticação
│   │   ├── clinicService.ts # Serviço de clínicas
│   │   └── index.ts
│   │
│   ├── types/             # Definições TypeScript
│   │   ├── index.ts       # Tipos principais
│   │   └── api.ts         # Tipos da API
│   │
│   ├── utils/             # Utilitários
│   │   ├── storage.ts     # localStorage helpers
│   │   ├── validators.ts  # Validações
│   │   └── index.ts
│   │
│   ├── constants/         # Constantes
│   │   └── index.ts       # Rotas, mensagens, etc.
│   │
│   ├── styles/            # Estilos globais
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   ├── theme.css
│   │   └── fonts.css
│   │
│   ├── config/            # Configurações
│   │   └── api.ts
│   │
│   ├── main.tsx           # Entry point
│   └── vite-env.d.ts      # Tipos do Vite
│
├── guidelines/             # Diretrizes do projeto
├── .gitignore
├── ARCHITECTURE.md         # Documentação da arquitetura
├── integration.md          # Documentação da API
├── ATTRIBUTIONS.md         # Atribuições
├── package.json
├── tsconfig.json
├── vite.config.ts
├── postcss.config.mjs
└── README.md
```

## 🔌 API

O projeto se comunica com a FastLine API através de um proxy configurado no Vite.

### Configuração do Proxy
```typescript
// vite.config.ts
server: {
  proxy: {
    '/v1': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

### Endpoints Principais

#### Autenticação
- `POST /v1/signup` - Registro de nova clínica
- `POST /v1/login` - Login de usuário

#### Clínicas
- `GET /v1/clinics` - Listar clínicas
- `POST /v1/clinics` - Criar clínica
- `GET /v1/clinics/:id` - Buscar clínica
- `PUT /v1/clinics/:id` - Atualizar clínica
- `DELETE /v1/clinics/:id` - Deletar clínica

#### Filas
- `GET /v1/queues` - Listar filas
- `POST /v1/queues` - Criar fila
- `PUT /v1/queues/:id` - Atualizar fila
- `DELETE /v1/queues/:id` - Deletar fila

Para documentação completa da API, consulte [integration.md](./integration.md).

## 🧪 Testes

```bash
# Executar testes (quando implementado)
npm run test

# Executar testes em modo watch
npm run test:watch

# Gerar coverage
npm run test:coverage
```

## 📚 Documentação Adicional

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura detalhada do projeto
- [integration.md](./integration.md) - Documentação completa da API
- [ATTRIBUTIONS.md](./ATTRIBUTIONS.md) - Créditos e atribuições
- [Guidelines.md](./guidelines/Guidelines.md) - Diretrizes de desenvolvimento

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes de Contribuição

- Siga os padrões de código estabelecidos
- Escreva código TypeScript com tipagem forte
- Mantenha componentes pequenos e focados
- Documente código complexo
- Teste suas mudanças antes de fazer PR

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

## 👥 Autores

- **Gabriel Silva** - Desenvolvimento inicial

## 🙏 Agradecimentos

- Design original por [FastLine Queue Management SaaS](https://www.figma.com/design/ielUF8UrxyfbfOZgFmLohY/FastLine-Queue-Management-SaaS)
- [Radix UI](https://www.radix-ui.com/) - Componentes acessíveis
- [shadcn/ui](https://ui.shadcn.com/) - Inspiração para sistema de design
- Comunidade React e TypeScript

---

<div align="center">
  <p>Feito com ❤️ por Gabriel Silva</p>
  <p>⭐ Se este projeto foi útil, considere dar uma estrela!</p>
</div>