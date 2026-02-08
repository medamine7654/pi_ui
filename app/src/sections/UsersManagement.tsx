import { useState } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  Ban, 
  CheckCircle, 
  Eye,
  User as UserIcon,
  Shield,
  UserX,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { mockUsers } from '@/data/mockData';
import type { User as UserType, UserRole, UserStatus } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { cn } from '@/lib/utils';

export function UsersManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [userToSuspend, setUserToSuspend] = useState<UserType | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSuspend = (user: UserType) => {
    setUserToSuspend(user);
    setShowSuspendDialog(true);
  };

  const confirmSuspend = () => {
    if (userToSuspend) {
      setUsers(users.map(u => 
        u.id === userToSuspend.id 
          ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' }
          : u
      ));
      setShowSuspendDialog(false);
      setUserToSuspend(null);
    }
  };

  const handleViewDetails = (user: UserType) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return Shield;
      case 'host': return UserIcon;
      case 'guest': return UserX;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'host': return 'Hôte';
      case 'guest': return 'Voyageur';
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#484848]">Utilisateurs</h1>
          <p className="text-gray-500 mt-1">Gérer les comptes utilisateurs et leurs rôles</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {users.filter(u => u.status === 'active').length} actifs
          </Badge>
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            {users.filter(u => u.status === 'suspended').length} suspendus
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un utilisateur..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as UserRole | 'all')}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="host">Hôte</SelectItem>
                  <SelectItem value="guest">Voyageur</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as UserStatus | 'all')}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="suspended">Suspendu</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activité</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Signalements</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risque</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const RoleIcon = getRoleIcon(user.role);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-[#FF5A5F] text-white">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-[#484848]">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <RoleIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{getRoleLabel(user.role)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <p>{user.bookingsCount} réservations</p>
                          {user.listingsCount > 0 && (
                            <p className="text-gray-500">{user.listingsCount} annonces</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant={user.reportsCount > 0 ? 'destructive' : 'secondary'}
                          className={cn(user.reportsCount === 0 && 'bg-gray-100 text-gray-600')}
                        >
                          {user.reportsCount}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={user.riskScore} 
                            className="w-16 h-2"
                          />
                          <span className={cn(
                            'text-xs font-medium',
                            user.riskScore > 70 ? 'text-red-600' :
                            user.riskScore > 40 ? 'text-yellow-600' :
                            'text-green-600'
                          )}>
                            {user.riskScore}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleSuspend(user)}
                              className={user.status === 'suspended' ? 'text-green-600' : 'text-red-600'}
                            >
                              {user.status === 'suspended' ? (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Réactiver
                                </>
                              ) : (
                                <>
                                  <Ban className="mr-2 h-4 w-4" />
                                  Suspendre
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-2xl">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>Détails de l'utilisateur</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedUser.avatar} />
                    <AvatarFallback className="bg-[#FF5A5F] text-white text-2xl">
                      {selectedUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-[#484848]">{selectedUser.name}</h3>
                    <p className="text-gray-500">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={selectedUser.status} />
                      <Badge variant="outline">{getRoleLabel(selectedUser.role)}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-500">Inscrit le</p>
                      <p className="font-medium">{new Date(selectedUser.joinedAt).toLocaleDateString('fr-FR')}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-500">Dernière activité</p>
                      <p className="font-medium">{new Date(selectedUser.lastActive).toLocaleDateString('fr-FR')}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-500">Réservations</p>
                      <p className="font-medium">{selectedUser.bookingsCount}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-500">Taux d'annulation</p>
                      <p className={cn(
                        'font-medium',
                        selectedUser.cancellationRate > 10 ? 'text-red-600' : 'text-green-600'
                      )}>
                        {selectedUser.cancellationRate}%
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Score de risque</p>
                  <div className="flex items-center gap-4">
                    <Progress value={selectedUser.riskScore} className="flex-1 h-3" />
                    <span className={cn(
                      'font-medium',
                      selectedUser.riskScore > 70 ? 'text-red-600' :
                      selectedUser.riskScore > 40 ? 'text-yellow-600' :
                      'text-green-600'
                    )}>
                      {selectedUser.riskScore}/100
                    </span>
                  </div>
                </div>

                {selectedUser.reportsCount > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-medium">{selectedUser.reportsCount} signalement(s)</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Suspend Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {userToSuspend?.status === 'suspended' ? 'Réactiver le compte' : 'Suspendre le compte'}
            </DialogTitle>
            <DialogDescription>
              {userToSuspend?.status === 'suspended' 
                ? `Êtes-vous sûr de vouloir réactiver le compte de ${userToSuspend?.name} ?`
                : `Êtes-vous sûr de vouloir suspendre le compte de ${userToSuspend?.name} ? Cet utilisateur ne pourra plus accéder à la plateforme.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendDialog(false)}>
              Annuler
            </Button>
            <Button 
              variant={userToSuspend?.status === 'suspended' ? 'default' : 'destructive'}
              onClick={confirmSuspend}
            >
              {userToSuspend?.status === 'suspended' ? 'Réactiver' : 'Suspendre'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
