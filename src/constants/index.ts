// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'fastline_auth_token',
  USERS: 'fastline_users',
  CURRENT_USER: 'fastline_current_user',
  CLINICS: 'fastline_clinics',
  QUEUES: 'fastline_queues',
  PASSWORDS: 'fastline_passwords',
} as const;

// Default values
export const DEFAULT_USER = {
  email: 'admin@fastline.com',
  password: 'admin123',
  ownerName: 'Administrador',
  tenantName: 'FastLine Admin',
};

// Messages
export const MESSAGES = {
  LOGIN_SUCCESS: (name: string) => `Bem-vindo, ${name}!`,
  REGISTER_SUCCESS: (name: string) => `Conta criada com sucesso! Bem-vindo, ${name}!`,
  LOGOUT_SUCCESS: 'Você saiu do sistema',
  LOGIN_ERROR: 'Email ou senha incorretos',
  REGISTER_ERROR: 'Este email já está cadastrado',
} as const;

// Routes
export const ROUTES = {
  DASHBOARD: 'dashboard',
  CLINICS: 'clinics',
  QUEUES: 'queues',
  USERS: 'users',
  PASSWORDS: 'passwords',
  DEVICES: 'devices',
  TV: 'tv',
  TV_PANEL: 'tv-panel',
  PATIENT: 'patient',
} as const;
