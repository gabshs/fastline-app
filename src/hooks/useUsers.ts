import { useState, useEffect } from 'react';
import { userService, type User, type Role, type CreateUserRequest, type UpdateUserRequest } from '@/services';
import { toast } from 'sonner';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const [usersData, rolesData] = await Promise.all([
        userService.getUsers(),
        userService.getRoles()
      ]);
      setUsers(usersData || []);
      setRoles(rolesData || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
      setError(errorMessage);
      setUsers([]);
      setRoles([]);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const [usersData, rolesData] = await Promise.all([
          userService.getUsers(),
          userService.getRoles()
        ]);
        
        if (isMounted) {
          setUsers(usersData || []);
          setRoles(rolesData || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
          setError(errorMessage);
          setUsers([]);
          setRoles([]);
          toast.error(errorMessage);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const createUser = async (data: CreateUserRequest) => {
    try {
      const newUser = await userService.createUser(data);
      setUsers([newUser, ...users]);
      toast.success('Usuário criado com sucesso!');
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar usuário';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateUser = async (id: string, data: UpdateUserRequest) => {
    try {
      const updatedUser = await userService.updateUser(id, data);
      setUsers(users.map(u => u.id === id ? updatedUser : u));
      toast.success('Usuário atualizado com sucesso!');
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar usuário';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await userService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      toast.success('Usuário excluído com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir usuário';
      toast.error(errorMessage);
      throw err;
    }
  };

  const changePassword = async (id: string, newPassword: string) => {
    try {
      await userService.changePassword(id, { newPassword });
      toast.success('Senha alterada com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar senha';
      toast.error(errorMessage);
      throw err;
    }
  };

  return {
    users,
    roles,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    refetch: fetchUsers,
  };
}
