import { useState } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  MapPin,
  Euro,
  Star
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockServices, mockBookings } from '@/data/mockData';
import type { Service, ServiceStatus } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { cn } from '@/lib/utils';

export function ServicesModeration() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | 'all'>('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'hide' | 'suspend'>('approve');
  const [serviceToAction, setServiceToAction] = useState<Service | null>(null);

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const reportedServices = services.filter(s => s.reportsCount > 0);
  const pendingServices = services.filter(s => s.status === 'pending');

  const handleAction = (service: Service, action: 'approve' | 'hide' | 'suspend') => {
    setServiceToAction(service);
    setActionType(action);
    setShowActionDialog(true);
  };

  const confirmAction = () => {
    if (serviceToAction) {
      const newStatus: Record<typeof actionType, ServiceStatus> = {
        approve: 'approved',
        hide: 'hidden',
        suspend: 'suspended',
      };
      
      setServices(services.map(s => 
        s.id === serviceToAction.id 
          ? { ...s, status: newStatus[actionType] }
          : s
      ));
      setShowActionDialog(false);
      setServiceToAction(null);
    }
  };

  const handleViewDetails = (service: Service) => {
    setSelectedService(service);
    setShowServiceDetails(true);
  };

  const getServiceBookings = (serviceId: string) => {
    return mockBookings.filter(b => b.itemId === serviceId && b.type === 'service');
  };

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#484848]">Modération des services</h1>
          <p className="text-gray-500 mt-1">Examiner et modérer les services proposés</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
            {pendingServices.length} en attente
          </Badge>
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            {reportedServices.length} signalés
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="all">Tous les services</TabsTrigger>
          <TabsTrigger value="pending">
            En attente
            {pendingServices.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-yellow-500 text-white rounded-full">
                {pendingServices.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="reported">
            Signalés
            {reportedServices.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {reportedServices.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ServicesTable 
            services={filteredServices}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onViewDetails={handleViewDetails}
            onAction={handleAction}
          />
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <ServicesTable 
            services={pendingServices}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onViewDetails={handleViewDetails}
            onAction={handleAction}
            hideFilter
          />
        </TabsContent>

        <TabsContent value="reported" className="mt-6">
          <ServicesTable 
            services={reportedServices}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onViewDetails={handleViewDetails}
            onAction={handleAction}
            hideFilter
          />
        </TabsContent>
      </Tabs>

      {/* Service Details Dialog */}
      <Dialog open={showServiceDetails} onOpenChange={setShowServiceDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          {selectedService && (
            <>
              <DialogHeader>
                <DialogTitle>Détails du service</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[calc(90vh-8rem)]">
                <div className="space-y-6">
                  {/* Images */}
                  <div className="grid grid-cols-3 gap-2">
                    {selectedService.images.map((img, idx) => (
                      <img 
                        key={idx} 
                        src={img} 
                        alt={`${selectedService.title} ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>

                  {/* Header */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#484848]">{selectedService.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedService.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Euro className="w-4 h-4" />
                        {selectedService.price}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {selectedService.rating > 0 ? `${selectedService.rating}/5` : 'Pas encore noté'}
                      </span>
                    </div>
                  </div>

                  {/* Host Info */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-[#FF5A5F] text-white">
                            {selectedService.hostName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedService.hostName}</p>
                          <p className="text-sm text-gray-500">Hôte</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Description */}
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-gray-600">{selectedService.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-[#FF5A5F]">{selectedService.bookingsCount}</p>
                        <p className="text-sm text-gray-500">Réservations</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-[#00A699]">{selectedService.rating || '-'}</p>
                        <p className="text-sm text-gray-500">Note moyenne</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className={cn(
                          'text-2xl font-bold',
                          selectedService.reportsCount > 0 ? 'text-red-600' : 'text-gray-400'
                        )}>
                          {selectedService.reportsCount}
                        </p>
                        <p className="text-sm text-gray-500">Signalements</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Booking History */}
                  <div>
                    <h4 className="font-medium mb-3">Historique des réservations</h4>
                    <div className="space-y-2">
                      {getServiceBookings(selectedService.id).map(booking => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{booking.guestName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{booking.guestName}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(booking.startDate).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <StatusBadge status={booking.status} />
                        </div>
                      ))}
                      {getServiceBookings(selectedService.id).length === 0 && (
                        <p className="text-gray-500 text-center py-4">Aucune réservation</p>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="gap-2">
                {selectedService.status === 'pending' && (
                  <Button 
                    variant="default" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setShowServiceDetails(false);
                      handleAction(selectedService, 'approve');
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approuver
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowServiceDetails(false);
                    handleAction(selectedService, 'hide');
                  }}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Masquer
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    setShowServiceDetails(false);
                    handleAction(selectedService, 'suspend');
                  }}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Suspendre
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' && 'Approuver le service'}
              {actionType === 'hide' && 'Masquer le service'}
              {actionType === 'suspend' && 'Suspendre le service'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' && `Êtes-vous sûr de vouloir approuver "${serviceToAction?.title}" ?`}
              {actionType === 'hide' && `Êtes-vous sûr de vouloir masquer "${serviceToAction?.title}" ? Il ne sera plus visible par les utilisateurs.`}
              {actionType === 'suspend' && `Êtes-vous sûr de vouloir suspendre "${serviceToAction?.title}" ? Cette action nécessite une révision.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              Annuler
            </Button>
            <Button 
              variant={actionType === 'suspend' ? 'destructive' : 'default'}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
              onClick={confirmAction}
            >
              {actionType === 'approve' && 'Approuver'}
              {actionType === 'hide' && 'Masquer'}
              {actionType === 'suspend' && 'Suspendre'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ServicesTableProps {
  services: Service[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: ServiceStatus | 'all';
  setStatusFilter: (status: ServiceStatus | 'all') => void;
  onViewDetails: (service: Service) => void;
  onAction: (service: Service, action: 'approve' | 'hide' | 'suspend') => void;
  hideFilter?: boolean;
}

function ServicesTable({ 
  services, 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter,
  onViewDetails,
  onAction,
  hideFilter = false
}: ServicesTableProps) {
  return (
    <div className="space-y-4">
      {!hideFilter && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un service..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ServiceStatus | 'all')}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="hidden">Masqué</SelectItem>
                  <SelectItem value="suspended">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hôte</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sign.</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={service.images[0]} 
                          alt={service.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-[#484848]">{service.title}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {service.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{service.hostName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium">{service.price}€</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={service.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">
                          {service.rating > 0 ? service.rating : '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge 
                        variant={service.reportsCount > 0 ? 'destructive' : 'secondary'}
                        className={cn(service.reportsCount === 0 && 'bg-gray-100 text-gray-600')}
                      >
                        {service.reportsCount}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewDetails(service)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </DropdownMenuItem>
                          {service.status === 'pending' && (
                            <DropdownMenuItem onClick={() => onAction(service, 'approve')}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              Approuver
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => onAction(service, 'hide')}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Masquer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAction(service, 'suspend')}>
                            <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
                            Suspendre
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {services.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun service trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
