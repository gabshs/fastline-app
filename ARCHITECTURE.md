# FastLine App - Arquitetura do Projeto

## 📁 Estrutura de Pastas

```
src/
├── app/                      # Configuração principal da aplicação
│   └── App.tsx              # Componente raiz
│
├── features/                # Funcionalidades organizadas por domínio
│   ├── auth/               # Autenticação e registro
│   │   ├── components/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   └── index.ts
│   │
│   ├── admin/              # Painel administrativo
│   │   ├── components/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── ClinicsManagement.tsx
│   │   │   ├── QueuesManagement.tsx
│   │   │   ├── UsersManagement.tsx
│   │   │   ├── PasswordsManagement.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── StatCard.tsx
│   │   └── index.ts
│   │
│   ├── patient/            # Interface do paciente
│   │   ├── components/
│   │   │   └── PatientApp.tsx
│   │   └── index.ts
│   │
│   └── tv/                 # Painel de TV
│       ├── components/
│       │   └── TVPanel.tsx
│       └── index.ts
│
├── shared/                  # Recursos compartilhados
│   ├── components/         # Componentes reutilizáveis
│   │   └── figma/
│   │       └── ImageWithFallback.tsx
│   └── ui/                 # Componentes UI do sistema de design
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ... (todos os componentes UI)
│
├── hooks/                   # Custom React Hooks
│   ├── useAuth.ts          # Hook de autenticação
│   ├── useNavigation.ts    # Hook de navegação
│   └── index.ts
│
├── services/                # Camada de serviços e lógica de negócio
│   ├── authService.ts      # Serviço de autenticação
│   └── index.ts
│
├── types/                   # Definições de tipos TypeScript
│   └── index.ts            # Interfaces e tipos (User, Clinic, Queue, etc.)
│
├── utils/                   # Funções utilitárias
│   ├── storage.ts          # Utilities para localStorage
│   ├── validators.ts       # Funções de validação
│   └── index.ts
│
├── constants/               # Constantes da aplicação
│   └── index.ts            # STORAGE_KEYS, MESSAGES, ROUTES, etc.
│
└── styles/                  # Estilos globais
    ├── index.css
    ├── tailwind.css
    ├── theme.css
    └── fonts.css
```

## 🏗️ Arquitetura e Padrões

### 1. **Feature-Based Organization**
- Cada funcionalidade principal está isolada em sua própria pasta dentro de `features/`
- Cada feature exporta seus componentes através de um arquivo `index.ts`
- Facilita manutenção, testes e escalabilidade

### 2. **Separation of Concerns**
- **Components**: Apenas apresentação e UI
- **Hooks**: Lógica de estado e efeitos colaterais
- **Services**: Lógica de negócio e operações de dados
- **Types**: Definições de tipos centralizadas
- **Utils**: Funções auxiliares puras

### 3. **Custom Hooks**
- `useAuth`: Gerencia autenticação, login, registro e logout
- `useNavigation`: Gerencia navegação entre views

### 4. **Services Layer**
- `authService`: Gerencia usuários, autenticação e persistência
- Padrão Singleton para serviços
- Separação clara entre lógica de negócio e apresentação

### 5. **Type Safety**
- Todos os tipos centralizados em `types/index.ts`
- Uso consistente de TypeScript em todo o projeto
- Interfaces bem definidas para comunicação entre camadas

### 6. **Constants**
- Valores hardcoded extraídos para constantes
- Facilita manutenção e alterações futuras
- Storage keys, mensagens e rotas centralizadas

## 🔧 Tecnologias Utilizadas

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Styling
- **Radix UI** - Componentes acessíveis
- **Sonner** - Toast notifications
- **LocalStorage** - Persistência de dados (mock)

## 📝 Boas Práticas Implementadas

1. **Path Aliases**: Uso de `@/` para imports absolutos
2. **Barrel Exports**: Arquivos `index.ts` para exports organizados
3. **Type Inference**: Aproveitamento do TypeScript para inferência de tipos
4. **Immutability**: Uso de operadores spread para imutabilidade
5. **Single Responsibility**: Cada módulo tem uma responsabilidade clara
6. **DRY (Don't Repeat Yourself)**: Código reutilizável e modular

## 🚀 Como Usar

### Imports
```typescript
// Hooks
import { useAuth, useNavigation } from '@/hooks';

// Features
import { LoginScreen } from '@/features/auth';
import { AdminDashboard } from '@/features/admin';

// Services
import { authService } from '@/services';

// Types
import type { User, LoginCredentials } from '@/types';

// Constants
import { MESSAGES, ROUTES } from '@/constants';

// Utils
import { storage, validators } from '@/utils';
```

### Adicionando Nova Feature

1. Crie pasta em `src/features/nome-feature/`
2. Adicione componentes em `components/`
3. Crie `index.ts` para exports
4. Adicione tipos necessários em `src/types/index.ts`
5. Se necessário, crie serviços em `src/services/`
6. Adicione hooks customizados em `src/hooks/`

### Adicionando Novo Serviço

1. Crie arquivo em `src/services/nomeService.ts`
2. Implemente como classe ou objeto singleton
3. Exporte no `src/services/index.ts`
4. Use nos hooks ou componentes conforme necessário

## 🔄 Fluxo de Dados

```
User Action
    ↓
Component (UI)
    ↓
Custom Hook
    ↓
Service Layer
    ↓
Storage/API
    ↓
Update State
    ↓
Re-render Component
```

## 📦 Próximos Passos para Melhorias

- [ ] Adicionar Context API para estado global
- [ ] Implementar React Router para navegação
- [ ] Adicionar testes unitários (Jest/Vitest)
- [ ] Implementar integração com backend real
- [ ] Adicionar error boundaries
- [ ] Implementar lazy loading de componentes
- [ ] Adicionar i18n para internacionalização
- [ ] Implementar logging e analytics

## 🤝 Contribuindo

Ao adicionar código novo, siga os padrões estabelecidos:
- Use TypeScript com tipos explícitos
- Organize por feature quando possível
- Extraia lógica complexa para hooks ou services
- Mantenha componentes pequenos e focados
- Documente código complexo com comentários
