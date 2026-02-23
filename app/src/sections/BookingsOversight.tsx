import { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  Briefcase,
  Wrench,
  AlertTriangle,
  Filter
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
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
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { mockBookings } from '@/data/mockData';
import type { Booking, BookingStatus } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { cn } from '@/lib/utils';

export function BookingsOversight() {
  const [bookings] = useState<Booking[]>(mockBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'service' | 'tool'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minAmount: 0,
    maxAmount: 1000,
    startDate: '',
    endDate: '',
  });

  // Reset dialog state on unmount
  useEffect(() => {
    return () => {
      setShowFilters(false);
    };
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.hostName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesType = typeFilter === 'all' || booking.type === typeFilter;
    const matchesAmount = booking.totalAmount >= filters.minAmount && booking.totalAmount <= filters.maxAmount;
    const matchesStartDate = !filters.startDate || new Date(booking.startDate) >= new Date(filters.startDate);
    const matchesEndDate = !filters.endDate || new Date(booking.endDate) <= new Date(filters.endDate);
    return matchesSearch && matchesStatus && matchesType && matchesAmount && matchesStartDate && matchesEndDate;
  });

  const activeFiltersCount = 
    (filters.minAmount > 0 ? 1 : 0) +
    (filters.maxAmount < 1000 ? 1 : 0) +
    (filters.startDate ? 1 : 0) +
    (filters.endDate ? 1 : 0);

  const clearFilters = () => {
    setFilters({
      minAmount: 0,
      maxAmount: 1000,
      startDate: '',
      endDate: '',
    });
  };

  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
  const serviceBookings = bookings.filter(b => b.type === 'service');
  const toolRentals = bookings.filter(b => b.type === 'tool');

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  const getCancellationRate = (userId: string) => {
    const userBookings = bookings.filter(b => b.guestId === userId);
    const cancelled = userBookings.filter(b => b.status === 'cancelled').length;
    return userBookings.length > 0 ? (cancelled / userBookings.length) * 100 : 0;
  };

  const getHostCancellationRate = (hostId: string) => {
    const hostBookings = bookings.filter(b => b.hostId === hostId);
    const cancelled = hostBookings.filter(b => b.status === 'cancelled').length;
    return hostBookings.length > 0 ? (cancelled / hostBookings.length) * 100 : 0;
  };

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#484848]">Réservations et locations</h1>
          <p className="text-gray-500 mt-1">Superviser les réservations et détecter les anomalies</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {serviceBookings.length} services
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {toolRentals.length} matériel
          </Badge>
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            {cancelledBookings.length} annulés
          </Badge>
        </div>
      </div>

      {/* Cancellation Alert */}
      {cancelledBookings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <div>
            <p className="font-medium text-amber-800">Alerte annulations</p>
            <p className="text-sm text-amber-700">
              {cancelledBookings.length} réservation(s) annulée(s) récemment. Vérifiez les patterns suspects.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="tools">Matériel</TabsTrigger>
          <TabsTrigger value="cancelled">
            Annulées
            {cancelledBookings.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {cancelledBookings.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <BookingsTable 
            bookings={filteredBookings}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onViewDetails={handleViewDetails}
            getCancellationRate={getCancellationRate}
            getHostCancellationRate={getHostCancellationRate}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filters={filters}
            setFilters={setFilters}
            activeFiltersCount={activeFiltersCount}
            clearFilters={clearFilters}
          />
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <BookingsTable 
            bookings={filteredBookings.filter(b => b.type === 'service')}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter="service"
            setTypeFilter={setTypeFilter}
            onViewDetails={handleViewDetails}
            getCancellationRate={getCancellationRate}
            getHostCancellationRate={getHostCancellationRate}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filters={filters}
            setFilters={setFilters}
            activeFiltersCount={activeFiltersCount}
            clearFilters={clearFilters}
            hideTypeFilter
          />
        </TabsContent>

        <TabsContent value="tools" className="mt-6">
          <BookingsTable 
            bookings={filteredBookings.filter(b => b.type === 'tool')}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter="tool"
            setTypeFilter={setTypeFilter}
            onViewDetails={handleViewDetails}
            getCancellationRate={getCancellationRate}
            getHostCancellationRate={getHostCancellationRate}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filters={filters}
            setFilters={setFilters}
            activeFiltersCount={activeFiltersCount}
            clearFilters={clearFilters}
            hideTypeFilter
          />
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          <BookingsTable 
            bookings={cancelledBookings}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onViewDetails={handleViewDetails}
            getCancellationRate={getCancellationRate}
            getHostCancellationRate={getHostCancellationRate}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filters={filters}
            setFilters={setFilters}
            activeFiltersCount={activeFiltersCount}
            clearFilters={clearFilters}
            hideStatusFilter
          />
        </TabsContent>
      </Tabs>

      {/* Booking Details Dialog */}
      <Dialog open={showBookingDetails} onOpenChange={setShowBookingDetails}>
        <DialogContent className="max-w-2xl">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Détails de la réservation</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Booking ID and Status */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Réservation #{selectedBooking.id}</p>
                    <p className="text-xs text-gray-400">
                      Créée le {new Date(selectedBooking.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <StatusBadge status={selectedBooking.status} />
                </div>

                {/* Item Info */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'p-2 rounded-lg',
                        selectedBooking.type === 'service' ? 'bg-blue-100' : 'bg-green-100'
                      )}>
                        {selectedBooking.type === 'service' ? (
                          <Briefcase className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Wrench className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{selectedBooking.itemName}</p>
                        <p className="text-sm text-gray-500">
                          {selectedBooking.type === 'service' ? 'Service' : 'Location de matériel'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Users */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-500 mb-2">Voyageur</p>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{selectedBooking.guestName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedBooking.guestName}</p>
                          <div className="flex items-center gap-1 text-xs">
                            <span className={cn(
                              getCancellationRate(selectedBooking.guestId) > 10 ? 'text-red-600' : 'text-green-600'
                            )}>
                              {getCancellationRate(selectedBooking.guestId).toFixed(1)}% annulations
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-500 mb-2">Hôte</p>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{selectedBooking.hostName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedBooking.hostName}</p>
                          <div className="flex items-center gap-1 text-xs">
                            <span className={cn(
                              getHostCancellationRate(selectedBooking.hostId) > 10 ? 'text-red-600' : 'text-green-600'
                            )}>
                              {getHostCancellationRate(selectedBooking.hostId).toFixed(1)}% annulations
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date de début</p>
                    <p className="font-medium">
                      {new Date(selectedBooking.startDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date de fin</p>
                    <p className="font-medium">
                      {new Date(selectedBooking.endDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Montant total</span>
                  <span className="text-xl font-bold text-[#FF5A5F]">{selectedBooking.totalAmount}€</span>
                </div>

                {/* Cancellation Info */}
                {selectedBooking.status === 'cancelled' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="font-medium text-red-800 mb-1">Annulation</p>
                    <p className="text-sm text-red-700">
                      Annulée le {new Date(selectedBooking.cancelledAt!).toLocaleDateString('fr-FR')}
                    </p>
                    {selectedBooking.cancellationReason && (
                      <p className="text-sm text-red-600 mt-1">
                        Raison: {selectedBooking.cancellationReason}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface BookingsTableProps {
  bookings: Booking[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: BookingStatus | 'all';
  setStatusFilter: (status: BookingStatus | 'all') => void;
  typeFilter: 'all' | 'service' | 'tool';
  setTypeFilter: (type: 'all' | 'service' | 'tool') => void;
  onViewDetails: (booking: Booking) => void;
  getCancellationRate: (userId: string) => number;
  getHostCancellationRate: (hostId: string) => number;
  hideTypeFilter?: boolean;
  hideStatusFilter?: boolean;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: {
    minAmount: number;
    maxAmount: number;
    startDate: string;
    endDate: string;
  };
  setFilters: (filters: any) => void;
  activeFiltersCount: number;
  clearFilters: () => void;
}

function BookingsTable({ 
  bookings, 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  onViewDetails,
  getCancellationRate,
  getHostCancellationRate,
  hideTypeFilter = false,
  hideStatusFilter = false,
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  activeFiltersCount,
  clearFilters
}: BookingsTableProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une réservation..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {!hideTypeFilter && (
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as 'all' | 'service' | 'tool')}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="service">Services</SelectItem>
                    <SelectItem value="tool">Matériel</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {!hideStatusFilter && (
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as BookingStatus | 'all')}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="requested">Demandée</SelectItem>
                    <SelectItem value="confirmed">Confirmée</SelectItem>
                    <SelectItem value="completed">Terminée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Button 
                variant="outline" 
                className="relative"
                onClick={() => setShowFilters(true)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-[#FF5A5F] text-white text-xs rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters Panel */}
      <Dialog key={`filters-${showFilters}`} open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filtres avancés</DialogTitle>
            <DialogDescription>
              Affinez votre recherche avec ces options
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Amount Range */}
            <div className="space-y-3">
              <Label>Montant</Label>
              <div className="space-y-2">
                <Slider
                  min={0}
                  max={1000}
                  step={50}
                  value={[filters.minAmount, filters.maxAmount]}
                  onValueChange={([min, max]) => setFilters({ ...filters, minAmount: min, maxAmount: max })}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{filters.minAmount}€</span>
                  <span>{filters.maxAmount}€</span>
                </div>
              </div>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début (après)</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin (avant)</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={clearFilters}>
              Réinitialiser
            </Button>
            <Button onClick={() => setShowFilters(false)}>
              Appliquer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voyageur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hôte</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className={cn(
                        'p-1.5 rounded-lg w-fit',
                        booking.type === 'service' ? 'bg-blue-100' : 'bg-green-100'
                      )}>
                        {booking.type === 'service' ? (
                          <Briefcase className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Wrench className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#484848]">{booking.itemName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm">{booking.guestName}</p>
                        <p className={cn(
                          'text-xs',
                          getCancellationRate(booking.guestId) > 10 ? 'text-red-500' : 'text-green-500'
                        )}>
                          {getCancellationRate(booking.guestId).toFixed(0)}% annul.
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm">{booking.hostName}</p>
                        <p className={cn(
                          'text-xs',
                          getHostCancellationRate(booking.hostId) > 10 ? 'text-red-500' : 'text-green-500'
                        )}>
                          {getHostCancellationRate(booking.hostId).toFixed(0)}% annul.
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">
                        {new Date(booking.startDate).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-xs text-gray-500">
                        au {new Date(booking.endDate).toLocaleDateString('fr-FR')}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{booking.totalAmount}€</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" onClick={() => onViewDetails(booking)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {bookings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune réservation trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
