# 📘 Documentação de Integração - Fastline API

## Visão Geral

A Fastline API é uma solução para gestão de clínicas e atendimentos médicos. Esta documentação fornece informações completas para integração do frontend.

**Base URL:** `http://localhost:8080`  
**Ambiente de Produção:** `https://api.fastline.com` (atualizar quando disponível)

---

## 🔐 Autenticação

A API usa **JWT (JSON Web Tokens)** com Bearer Authentication.

### Fluxo de Autenticação

```mermaid
sequenceDiagram
    Frontend->>API: POST /v1/signup
    API-->>Frontend: 201 Created
    Frontend->>API: POST /v1/login
    API-->>Frontend: 200 OK + access_token
    Frontend->>API: GET /v1/clinics (Bearer token)
    API-->>Frontend: 200 OK + dados
```

### Header de Autenticação

Todas as rotas protegidas requerem o header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Importante:**
- Token expira em **30 minutos**
- Armazene o token de forma segura (localStorage/sessionStorage)
- Remova o token ao fazer logout
- Redirecione para login ao receber `401 Unauthorized`

---

## 📚 Endpoints

### 1. Cadastro de Tenant (Clínica)

**Endpoint:** `POST /v1/signup`  
**Autenticação:** ❌ Não requerida  
**Descrição:** Registra uma nova clínica no sistema

#### Request

```typescript
interface SignupRequest {
  name: string;      // Nome da clínica (min: 3 chars)
  email: string;     // Email do administrador (único)
  password: string;  // Senha (min: 8 chars)
}
```

#### Exemplo

```javascript
const response = await fetch('http://localhost:8080/v1/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Clínica São Lucas',
    email: 'admin@saolucas.com',
    password: 'Senha123!@#',
  }),
});

const data = await response.json();
```

#### Response (201 Created)

```json
{
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Clínica São Lucas",
  "email": "admin@saolucas.com"
}
```

#### Erros Possíveis

| Status | Código | Descrição |
|--------|--------|-----------|
| 400 | `INVALID_INPUT` | Email já cadastrado ou dados inválidos |
| 500 | `INTERNAL_ERROR` | Erro no servidor |

---

### 2. Login

**Endpoint:** `POST /v1/login`  
**Autenticação:** ❌ Não requerida  
**Descrição:** Autentica usuário e retorna token JWT

#### Request

```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

#### Exemplo

```javascript
const response = await fetch('http://localhost:8080/v1/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@saolucas.com',
    password: 'Senha123!@#',
  }),
});

const data = await response.json();

// Armazena token
localStorage.setItem('access_token', data.access_token);
localStorage.setItem('tenant_id', data.tenant_id);
```

#### Response (200 OK)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJzdWIiOiJ1c2VyLTEyMyIsImlhdCI6MTczNTg0ODAwMCwiZXhwIjoxNzM1ODQ5ODAwfQ.signature",
  "expires_at": "2026-01-02T16:00:00Z",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "user-123"
}
```

#### Erros Possíveis

| Status | Código | Descrição |
|--------|--------|-----------|
| 401 | `UNAUTHORIZED` | Email ou senha incorretos |
| 500 | `INTERNAL_ERROR` | Erro no servidor |

---

### 3. Criar Clínica

**Endpoint:** `POST /v1/clinics`  
**Autenticação:** ✅ Requerida  
**Descrição:** Cria uma nova unidade de clínica

#### Request

```typescript
interface CreateClinicRequest {
  name: string;              // Nome da clínica (obrigatório)
  timezone: string;          // Timezone IANA (ex: "America/Sao_Paulo")
  address_line?: string;     // Endereço completo (opcional)
  lat?: number;              // Latitude (opcional)
  lng?: number;              // Longitude (opcional)
}
```

#### Exemplo

```javascript
const token = localStorage.getItem('access_token');

const response = await fetch('http://localhost:8080/v1/clinics', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    name: 'Clínica Central',
    timezone: 'America/Sao_Paulo',
    address_line: 'Rua das Flores, 123 - Centro',
    lat: -23.550520,
    lng: -46.633308,
  }),
});

if (response.status === 401) {
  // Token expirado - redirecionar para login
  window.location.href = '/login';
}

const data = await response.json();
```

#### Response (201 Created)

```json
{
  "id": "clinic-550e8400-e29b-41d4-a716-446655440000"
}
```

#### Erros Possíveis

| Status | Código | Descrição |
|--------|--------|-----------|
| 400 | `INVALID_INPUT` | Dados inválidos |
| 401 | `UNAUTHORIZED` | Token inválido ou expirado |
| 500 | `INTERNAL_ERROR` | Erro no servidor |

---

### 4. Listar Clínicas

**Endpoint:** `GET /v1/clinics`  
**Autenticação:** ✅ Requerida  
**Descrição:** Lista todas as clínicas do tenant

#### Request

Nenhum parâmetro necessário. O tenant é identificado automaticamente pelo token JWT.

#### Exemplo

```javascript
const token = localStorage.getItem('access_token');

const response = await fetch('http://localhost:8080/v1/clinics', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const data = await response.json();
```

#### Response (200 OK)

```typescript
interface ListClinicsResponse {
  clinics: Clinic[];
}

interface Clinic {
  id: string;
  name: string;
  timezone: string;
  address_line?: string;
  lat?: number;
  lng?: number;
  is_active: boolean;
  created_at: string; // ISO 8601
}
```

```json
{
  "clinics": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Clínica Central",
      "timezone": "America/Sao_Paulo",
      "address_line": "Rua das Flores, 123 - Centro",
      "lat": -23.550520,
      "lng": -46.633308,
      "is_active": true,
      "created_at": "2026-01-02T15:04:05Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "name": "Clínica Norte",
      "timezone": "America/Sao_Paulo",
      "address_line": "Av. Paulista, 1000",
      "lat": -23.561684,
      "lng": -46.655882,
      "is_active": true,
      "created_at": "2026-01-01T10:30:00Z"
    }
  ]
}
```

#### Erros Possíveis

| Status | Código | Descrição |
|--------|--------|-----------|
| 401 | `UNAUTHORIZED` | Token inválido ou expirado |
| 500 | `INTERNAL_ERROR` | Erro no servidor |

---

### 5. Health Check

**Endpoint:** `GET /health`  
**Autenticação:** ❌ Não requerida  
**Descrição:** Verifica status da API e banco de dados

#### Exemplo

```javascript
const response = await fetch('http://localhost:8080/health');
const data = await response.json();

if (data.status === 'ok' && data.db) {
  console.log('API está online');
}
```

#### Response (200 OK)

```json
{
  "status": "ok",
  "db": true
}
```

---

## 🛠️ Implementação Frontend

### React + TypeScript

#### 1. Serviço de API

```typescript
// src/services/api.ts
const API_BASE_URL = 'http://localhost:8080';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      // Token expirado - limpar e redirecionar
      localStorage.removeItem('access_token');
      localStorage.removeItem('tenant_id');
      window.location.href = '/login';
      throw new ApiError(401, 'Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new ApiError(response.status, error.message || 'Request failed');
    }

    return response.json();
  }

  async signup(data: SignupRequest): Promise<SignupResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/tenant/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/identity/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await this.handleResponse<LoginResponse>(response);
    
    // Armazena token
    localStorage.setItem('access_token', result.access_token);
    localStorage.setItem('tenant_id', result.tenant_id);
    
    return result;
  }

  async createClinic(data: CreateClinicRequest): Promise<CreateClinicResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/clinics`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async listClinics(): Promise<ListClinicsResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/clinics`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('tenant_id');
    window.location.href = '/login';
  }
}

export const api = new ApiService();

// Types
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  tenant_id: string;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  expires_at: string;
  tenant_id: string;
  user_id: string;
}

export interface CreateClinicRequest {
  name: string;
  timezone: string;
  address_line?: string;
  lat?: number;
  lng?: number;
}

export interface CreateClinicResponse {
  id: string;
}

export interface Clinic {
  id: string;
  name: string;
  timezone: string;
  address_line?: string;
  lat?: number;
  lng?: number;
  is_active: boolean;
  created_at: string;
}

export interface ListClinicsResponse {
  clinics: Clinic[];
}
```

#### 2. Hook de Autenticação

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { api, LoginRequest } from '../services/api';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      await api.login(credentials);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    api.logout();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, login, logout };
}
```

#### 3. Componente de Login

```tsx
// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login({ email, password });

    if (result.success) {
      navigate('/clinics');
    } else {
      setError(result.error || 'Erro ao fazer login');
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Carregando...' : 'Entrar'}
      </button>
    </form>
  );
}
```

#### 4. Listar Clínicas

```tsx
// src/pages/Clinics.tsx
import React, { useEffect, useState } from 'react';
import { api, Clinic } from '../services/api';

export function Clinics() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadClinics();
  }, []);

  const loadClinics = async () => {
    try {
      const data = await api.listClinics();
      setClinics(data.clinics);
    } catch (err) {
      setError('Erro ao carregar clínicas');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>Minhas Clínicas</h1>
      {clinics.length === 0 ? (
        <p>Nenhuma clínica cadastrada</p>
      ) : (
        <ul>
          {clinics.map((clinic) => (
            <li key={clinic.id}>
              <h3>{clinic.name}</h3>
              <p>{clinic.address_line}</p>
              <small>{new Date(clinic.created_at).toLocaleDateString('pt-BR')}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## 🔒 Boas Práticas de Segurança

### 1. Armazenamento do Token

```typescript
// ✅ BOM - localStorage para SPAs
localStorage.setItem('access_token', token);

// ✅ MELHOR - httpOnly cookie (backend deve configurar)
// O token é enviado automaticamente pelo navegador

// ❌ RUIM - variável global
window.token = token;
```

### 2. Interceptor de Requisições

```typescript
// Axios example
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 3. Refresh Token (Futuro)

```typescript
// Quando implementar refresh token
let isRefreshing = false;
let failedQueue: any[] = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      
      try {
        const { data } = await apiClient.post('/v1/auth/refresh', { refreshToken });
        localStorage.setItem('access_token', data.access_token);
        
        failedQueue.forEach((prom) => prom.resolve(data.access_token));
        failedQueue = [];
        
        return apiClient(originalRequest);
      } catch (err) {
        failedQueue.forEach((prom) => prom.reject(err));
        failedQueue = [];
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 🧪 Testando a API

### cURL

```bash
# 1. Signup
curl -X POST http://localhost:8080/v1/tenant/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Clínica Teste",
    "email": "teste@clinica.com",
    "password": "Senha123!@#"
  }'

# 2. Login
TOKEN=$(curl -X POST http://localhost:8080/v1/identity/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@clinica.com",
    "password": "Senha123!@#"
  }' | jq -r '.access_token')

# 3. Criar clínica
curl -X POST http://localhost:8080/v1/clinics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Clínica Central",
    "timezone": "America/Sao_Paulo",
    "address_line": "Rua Exemplo, 123"
  }'

# 4. Listar clínicas
curl -X GET http://localhost:8080/v1/clinics \
  -H "Authorization: Bearer $TOKEN"
```

### Postman

1. Importe a collection do Swagger: `http://localhost:8080/swagger/doc.json`
2. Configure variável de ambiente `{{baseUrl}}` = `http://localhost:8080`
3. Configure variável `{{token}}` após login
4. Use `Bearer {{token}}` em Authorization

---

## 📊 Códigos de Status HTTP

| Código | Significado | Quando ocorre |
|--------|-------------|---------------|
| 200 | OK | Requisição bem-sucedida (GET, PUT) |
| 201 | Created | Recurso criado (POST) |
| 400 | Bad Request | Dados inválidos |
| 401 | Unauthorized | Token ausente/inválido/expirado |
| 404 | Not Found | Recurso não encontrado |
| 500 | Internal Server Error | Erro no servidor |

---

## 🐛 Troubleshooting

### Erro: "Missing Authorization header"

```typescript
// ❌ Errado
headers: {
  'Authorization': token
}

// ✅ Correto
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Erro: "Invalid token"

- Verifique se o token não expirou (30 minutos)
- Faça login novamente
- Verifique se o prefixo "Bearer " está presente

### CORS Error

Se receber erro de CORS no navegador, verifique se o backend está configurado corretamente. Para desenvolvimento local, pode ser necessário proxy:

```json
// package.json (React)
{
  "proxy": "http://localhost:8080"
}
```

---

## 📱 Swagger UI Interativo

Acesse `http://localhost:8080/swagger/index.html` para testar os endpoints diretamente no navegador.

**Como usar:**
1. Faça login no endpoint `/v1/identity/login`
2. Copie o `access_token`
3. Clique no botão "Authorize" 🔒
4. Digite: `Bearer SEU_TOKEN`
5. Teste os endpoints protegidos

---

## 📞 Suporte

- **Documentação API:** http://localhost:8080/swagger
- **Health Check:** http://localhost:8080/health
- **Repositório:** [GitHub](https://github.com/seu-repo/fastline-api)

---

**Versão:** 1.0  
**Última atualização:** 02/01/2026