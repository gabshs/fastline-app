import { apiClient } from './apiClient';

export interface Role {
  id: string;
  key: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  roleKey: string;
  roleDescription: string;
  servicePointId?: string;
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  roleKey: string;
  servicePointId?: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  status: string;
  roleKey: string;
  servicePointId?: string;
}

export interface ChangePasswordRequest {
  newPassword: string;
}

class UserService {
  private basePath = '/v1/users';

  async getRoles(): Promise<Role[]> {
    const response = await apiClient.get<{ roles: Role[] }>(`${this.basePath}/roles`);
    return response.roles;
  }

  async getUsers(): Promise<User[]> {
    const response = await apiClient.get<{ users: User[] }>(this.basePath);
    return response.users;
  }

  async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(`${this.basePath}/${id}`);
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    return apiClient.post<User>(this.basePath, data);
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    return apiClient.put<User>(`${this.basePath}/${id}`, data);
  }

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  async changePassword(id: string, data: ChangePasswordRequest): Promise<void> {
    await apiClient.put(`${this.basePath}/${id}/password`, data);
  }
}

export const userService = new UserService();
