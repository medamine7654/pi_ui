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
  Package
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
import { Progress } from '@/components/ui/progress';
import { mockTools, mockBookings } from '@/data/mockData';
import type { Tool, ToolStatus } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { cn } from '@/lib/utils';

export function ToolsModeration() {
  const [tools, setTools] = useState<Tool[]>(mockTools);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ToolStatus | 'all'>('all');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showToolDetails, setShowToolDetails] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'hide' | 'suspend'>('approve');
  const [toolToAction, setToolToAction] = useState<Tool | null>(null);

  const filteredTools = tools.filter(tool => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tool.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const reportedTools = tools.filter(t => t.reportsCount > 0);
  const maintenanceTools = tools.filter(t => t.status === 'maintenance');

  const handleAction = (tool: Tool, action: 'approve' | 'hide' | 'suspend') => {
    setToolToAction(tool);
    setActionType(action);
    setShowActionDialog(true);
  };

  const confirmAction = () => {
    if (toolToAction) {
      const newStatus: Record<typeof actionType, ToolStatus> = {
        approve: 'available',
        hide: 'hidden',
        suspend: 'suspended',
      };
      
      setTools(tools.map(t => 
        t.id === toolToAction.id 
          ? { ...t, status: newStatus[actionType] }
          : t
      ));
      setShowActionDialog(false);
      setToolToAction(null);
    }
  };

  const handleViewDetails = (tool: Tool) => {
    setSelectedTool(tool);
    setShowToolDetails(true);
  };

  const getToolRentals = (toolId: string) => {
    return mockBookings.filter(b => b.itemId === toolId && b.type === 'tool');
  };

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#484848]">Modération du matériel</h1>
          <p className="text-gray-500 mt-1">Examiner et modérer les outils et matériel en location</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            {maintenanceTools.length} en maintenance
          </Badge>
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            {reportedTools.length} signalés
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="all">Tout le matériel</TabsTrigger>
          <TabsTrigger value="maintenance">
            Maintenance
            {maintenanceTools.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-orange-500 text-white rounded-full">
                {maintenanceTools.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="reported">
            Signalés
            {reportedTools.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {reportedTools.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ToolsTable 
            tools={filteredTools}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onViewDetails={handleViewDetails}
            onAction={handleAction}
          />
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <ToolsTable 
            tools={maintenanceTools}
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
          <ToolsTable 
            tools={reportedTools}
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

      {/* Tool Details Dialog */}
      <Dialog open={showToolDetails} onOpenChange={setShowToolDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          {selectedTool && (
            <>
              <DialogHeader>
                <DialogTitle>Détails du matériel</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[calc(90vh-8rem)]">
                <div className="space-y-6">
                  {/* Images */}
                  <div className="grid grid-cols-3 gap-2">
                    {selectedTool.images.map((img, idx) => (
                      <img 
                        key={idx} 
                        src={img} 
                        alt={`${selectedTool.name} ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>

                  {/* Header */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#484848]">{selectedTool.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedTool.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Euro className="w-4 h-4" />
                        {selectedTool.pricePerDay}€/jour
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        Stock: {selectedTool.stock}
                      </span>
                    </div>
                  </div>

                  {/* Host Info */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-[#FF5A5F] text-white">
                            {selectedTool.hostName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedTool.hostName}</p>
                          <p className="text-sm text-gray-500">Propriétaire</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Description */}
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-gray-600">{selectedTool.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-[#FF5A5F]">{selectedTool.rentalsCount}</p>
                        <p className="text-sm text-gray-500">Locations</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-[#00A699]">{selectedTool.stock}</p>
                        <p className="text-sm text-gray-500">En stock</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className={cn(
                          'text-2xl font-bold',
                          selectedTool.reportsCount > 0 ? 'text-red-600' : 'text-gray-400'
                        )}>
                          {selectedTool.reportsCount}
                        </p>
                        <p className="text-sm text-gray-500">Signalements</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Stock Availability */}
                  <div>
                    <h4 className="font-medium mb-2">Disponibilité du stock</h4>
                    <div className="flex items-center gap-4">
                      <Progress 
                        value={selectedTool.stock * 20} 
                        className="flex-1 h-3"
                      />
                      <span className={cn(
                        'font-medium',
                        selectedTool.stock === 0 ? 'text-red-600' :
                        selectedTool.stock < 3 ? 'text-yellow-600' :
                        'text-green-600'
                      )}>
                        {selectedTool.stock} unités
                      </span>
                    </div>
                  </div>

                  {/* Rental History */}
                  <div>
                    <h4 className="font-medium mb-3">Historique des locations</h4>
                    <div className="space-y-2">
                      {getToolRentals(selectedTool.id).map(rental => (
                        <div key={rental.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{rental.guestName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{rental.guestName}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(rental.startDate).toLocaleDateString('fr-FR')} - {new Date(rental.endDate).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <StatusBadge status={rental.status} />
                            <p className="text-sm font-medium mt-1">{rental.totalAmount}€</p>
                          </div>
                        </div>
                      ))}
                      {getToolRentals(selectedTool.id).length === 0 && (
                        <p className="text-gray-500 text-center py-4">Aucune location</p>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="gap-2">
                {selectedTool.status === 'suspended' && (
                  <Button 
                    variant="default" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setShowToolDetails(false);
                      handleAction(selectedTool, 'approve');
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Réactiver
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowToolDetails(false);
                    handleAction(selectedTool, 'hide');
                  }}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Masquer
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    setShowToolDetails(false);
                    handleAction(selectedTool, 'suspend');
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
              {actionType === 'approve' && 'Réactiver le matériel'}
              {actionType === 'hide' && 'Masquer le matériel'}
              {actionType === 'suspend' && 'Suspendre le matériel'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' && `Êtes-vous sûr de vouloir réactiver "${toolToAction?.name}" ?`}
              {actionType === 'hide' && `Êtes-vous sûr de vouloir masquer "${toolToAction?.name}" ? Il ne sera plus visible par les utilisateurs.`}
              {actionType === 'suspend' && `Êtes-vous sûr de vouloir suspendre "${toolToAction?.name}" ? Cette action nécessite une révision.`}
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
              {actionType === 'approve' && 'Réactiver'}
              {actionType === 'hide' && 'Masquer'}
              {actionType === 'suspend' && 'Suspendre'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ToolsTableProps {
  tools: Tool[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: ToolStatus | 'all';
  setStatusFilter: (status: ToolStatus | 'all') => void;
  onViewDetails: (tool: Tool) => void;
  onAction: (tool: Tool, action: 'approve' | 'hide' | 'suspend') => void;
  hideFilter?: boolean;
}

function ToolsTable({ 
  tools, 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter,
  onViewDetails,
  onAction,
  hideFilter = false
}: ToolsTableProps) {
  return (
    <div className="space-y-4">
      {!hideFilter && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un outil..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ToolStatus | 'all')}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="rented">Loué</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matériel</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Propriétaire</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix/jour</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sign.</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={tool.images[0]} 
                          alt={tool.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-[#484848]">{tool.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {tool.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{tool.hostName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium">{tool.pricePerDay}€</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'text-sm font-medium',
                          tool.stock === 0 ? 'text-red-600' :
                          tool.stock < 3 ? 'text-yellow-600' :
                          'text-green-600'
                        )}>
                          {tool.stock}
                        </span>
                        <span className="text-xs text-gray-500">unités</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={tool.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge 
                        variant={tool.reportsCount > 0 ? 'destructive' : 'secondary'}
                        className={cn(tool.reportsCount === 0 && 'bg-gray-100 text-gray-600')}
                      >
                        {tool.reportsCount}
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
                          <DropdownMenuItem onClick={() => onViewDetails(tool)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </DropdownMenuItem>
                          {tool.status === 'suspended' && (
                            <DropdownMenuItem onClick={() => onAction(tool, 'approve')}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              Réactiver
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => onAction(tool, 'hide')}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Masquer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAction(tool, 'suspend')}>
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
          {tools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun matériel trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
