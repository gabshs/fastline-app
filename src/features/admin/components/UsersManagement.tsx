import { useState } from 'react';
import { Users, Plus, Edit, Trash2, Mail, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shared/ui/alert-dialog';
import { useUsers } from '@/hooks';
import type { User, CreateUserRequest } from '@/services';

export function UsersManagement() {
  const { users, roles, isLoading, error, createUser, updateUser, deleteUser } = useUsers();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleKey: 'STAFF',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: CreateUserRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        roleKey: formData.roleKey,
      };

      if (isEditMode && selectedUser) {
        await updateUser(selectedUser.id, {
          name: formData.name,
          email: formData.email,
          status: 'ACTIVE',
          roleKey: formData.roleKey,
        });
      } else {
        await createUser(data);
      }

      setFormData({ name: '', email: '', password: '', roleKey: 'STAFF' });
      setIsDialogOpen(false);
      setIsEditMode(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      roleKey: user.roleKey,
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser.id);
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setSelectedUser(null);
    setFormData({ name: '', email: '', password: '', roleKey: 'STAFF' });
  };

  const getRoleLabel = (roleKey: string) => {
    const translations: Record<string, string> = {
      'OWNER': 'Proprietário',
      'ADMIN': 'Administrador',
      'SUPERVISOR': 'Supervisor',
      'STAFF': 'Atendente',
      'VIEWER': 'Visualizador'
    };
    return translations[roleKey] || roleKey;
  };

  const getRoleColor = (roleKey: string) => {
    switch (roleKey) {
      case 'OWNER':
        return 'bg-purple-100 text-purple-800';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800';
      case 'SUPERVISOR':
        return 'bg-green-100 text-green-800';
      case 'STAFF':
        return 'bg-orange-100 text-orange-800';
      case 'VIEWER':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl">Usuários</h2>
          <p className="text-gray-600 mt-2">Gerencie os usuários do sistema</p>
        </div>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Novo Usuário</span>
        </Button>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) handleCloseDialog();
          else setIsDialogOpen(true);
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: João Silva"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="usuario@email.com"
                  required
                />
              </div>
              {!isEditMode && (
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Digite a senha"
                    required={!isEditMode}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="role">Função</Label>
                <Select value={formData.roleKey} onValueChange={(value) => setFormData({ ...formData, roleKey: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles?.map((role) => (
                      <SelectItem key={role.id} value={role.key}>
                        {getRoleLabel(role.key)}
                      </SelectItem>
                    )) || <SelectItem value="STAFF">Carregando...</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              {formData.roleKey === 'STAFF' && (
                <div className="text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="font-medium">Vinculação de Ponto de Atendimento</p>
                  <p className="text-xs mt-1">Após criar o usuário Atendente, você poderá vinculá-lo a um ponto de atendimento na tela "Filas e Pontos de Atendimento".</p>
                </div>
              )}
              <Button type="submit" className="w-full">
                {isEditMode ? 'Atualizar Usuário' : 'Cadastrar Usuário'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Usuário</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Função</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getRoleColor(user.roleKey)}`}>
                      {getRoleLabel(user.roleKey)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      user.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Editar usuário"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Excluir usuário"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário <strong>{selectedUser?.name}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
