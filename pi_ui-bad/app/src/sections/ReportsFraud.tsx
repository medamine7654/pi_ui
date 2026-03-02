import { useState } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  CheckCircle, 
  XCircle, 
  ShieldAlert,
  User,
  Briefcase,
  Wrench,
  Bell
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { mockReports, mockFraudAlerts } from '@/data/mockData';
import type { Report, FraudAlert, ReportStatus, ReportReason } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { cn } from '@/lib/utils';

const reportReasonLabels: Record<ReportReason, string> = {
  inappropriate_content: 'Contenu inapproprié',
  fraud: 'Fraude',
  spam: 'Spam',
  misrepresentation: 'Fausse description',
  safety_concern: 'Problème de sécurité',
  other: 'Autre',
};

const fraudTypeLabels: Record<FraudAlert['type'], string> = {
  cancellation_spike: 'Pic d\'annulations',
  negative_reviews: 'Avis négatifs',
  listing_spam: 'Spam d\'annonces',
  suspicious_activity: 'Activité suspecte',
};

export function ReportsFraud() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>(mockFraudAlerts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [resolveAction, setResolveAction] = useState<'resolve' | 'dismiss'>('resolve');

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporterName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingReports = reports.filter(r => r.status === 'pending');
  const criticalAlerts = fraudAlerts.filter(a => a.severity === 'critical' && !a.isRead);

  const handleResolve = (report: Report, action: 'resolve' | 'dismiss') => {
    setSelectedReport(report);
    setResolveAction(action);
    setShowResolveDialog(true);
  };

  const confirmResolve = () => {
    if (selectedReport) {
      setReports(reports.map(r => 
        r.id === selectedReport.id 
          ? { ...r, status: resolveAction === 'resolve' ? 'resolved' : 'dismissed' }
          : r
      ));
      setShowResolveDialog(false);
    }
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setShowReportDetails(true);
  };



  const markAlertAsRead = (alertId: string) => {
    setFraudAlerts(fraudAlerts.map(a => 
      a.id === alertId ? { ...a, isRead: true } : a
    ));
  };

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#484848]">Signalements et fraude</h1>
          <p className="text-gray-500 mt-1">Modérer les signalements et surveiller les activités suspectes</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            {pendingReports.length} en attente
          </Badge>
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            {criticalAlerts.length} alertes critiques
          </Badge>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <div className="space-y-2">
          {criticalAlerts.map(alert => (
            <div key={alert.id} className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <Bell className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-800">{fraudTypeLabels[alert.type]}</p>
                <p className="text-sm text-red-700">{alert.description}</p>
                <p className="text-xs text-red-600 mt-1">Utilisateur: {alert.userName}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600"
                onClick={() => markAlertAsRead(alert.id)}
              >
                Marquer comme lu
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto">
          <TabsTrigger value="reports">
            Signalements
            {pendingReports.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {pendingReports.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="fraud">
            Alertes fraude
            {fraudAlerts.filter(a => !a.isRead).length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-orange-500 text-white rounded-full">
                {fraudAlerts.filter(a => !a.isRead).length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-6 space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un signalement..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ReportStatus | 'all')}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="resolved">Résolu</SelectItem>
                    <SelectItem value="dismissed">Rejeté</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cible</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Raison</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Signalé par</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gravité</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {report.targetType === 'user' && <User className="w-4 h-4 text-gray-400" />}
                            {report.targetType === 'service' && <Briefcase className="w-4 h-4 text-gray-400" />}
                            {report.targetType === 'tool' && <Wrench className="w-4 h-4 text-gray-400" />}
                            <span className="font-medium text-[#484848]">{report.targetName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm capitalize">
                            {report.targetType === 'user' ? 'Utilisateur' : 
                             report.targetType === 'service' ? 'Service' : 'Matériel'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm">{reportReasonLabels[report.reason]}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm">{report.reporterName}</span>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={report.severity} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={report.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(report)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir détails
                              </DropdownMenuItem>
                              {report.status === 'pending' && (
                                <>
                                  <DropdownMenuItem onClick={() => handleResolve(report, 'resolve')}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                    Résoudre
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleResolve(report, 'dismiss')}>
                                    <XCircle className="mr-2 h-4 w-4 text-gray-600" />
                                    Rejeter
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredReports.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucun signalement trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fraud" className="mt-6">
          <div className="grid gap-4">
            {fraudAlerts.map((alert) => (
              <Card key={alert.id} className={cn(
                'transition-all',
                !alert.isRead && 'border-l-4 border-l-red-500'
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'p-3 rounded-full',
                        alert.severity === 'critical' ? 'bg-red-100' :
                        alert.severity === 'high' ? 'bg-orange-100' :
                        alert.severity === 'medium' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      )}>
                        <ShieldAlert className={cn(
                          'w-5 h-5',
                          alert.severity === 'critical' ? 'text-red-600' :
                          alert.severity === 'high' ? 'text-orange-600' :
                          alert.severity === 'medium' ? 'text-yellow-600' :
                          'text-blue-600'
                        )} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{fraudTypeLabels[alert.type]}</h4>
                          <StatusBadge status={alert.severity} />
                          {!alert.isRead && (
                            <Badge variant="secondary" className="bg-red-100 text-red-700">Nouveau</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Utilisateur: <strong>{alert.userName}</strong></span>
                          <span>•</span>
                          <span>{new Date(alert.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!alert.isRead && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => markAlertAsRead(alert.id)}
                        >
                          Marquer comme lu
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        Voir le profil
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {fraudAlerts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucune alerte de fraude</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Report Details Dialog */}
      <Dialog open={showReportDetails} onOpenChange={setShowReportDetails}>
        <DialogContent className="max-w-2xl">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle>Détails du signalement</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Target Info */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {selectedReport.targetType === 'user' && <User className="w-5 h-5" />}
                        {selectedReport.targetType === 'service' && <Briefcase className="w-5 h-5" />}
                        {selectedReport.targetType === 'tool' && <Wrench className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium">{selectedReport.targetName}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {selectedReport.targetType === 'user' ? 'Utilisateur' : 
                           selectedReport.targetType === 'service' ? 'Service' : 'Matériel'}
                        </p>
                      </div>
                      <StatusBadge status={selectedReport.severity} className="ml-auto" />
                    </div>
                  </CardContent>
                </Card>

                {/* Report Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Signalé par</p>
                    <p className="font-medium">{selectedReport.reporterName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date du signalement</p>
                    <p className="font-medium">
                      {new Date(selectedReport.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Raison</p>
                    <p className="font-medium">{reportReasonLabels[selectedReport.reason]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Statut</p>
                    <StatusBadge status={selectedReport.status} />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Description</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedReport.description}</p>
                  </div>
                </div>

                {/* Resolution Info */}
                {selectedReport.status !== 'pending' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="font-medium text-green-800">Résolution</p>
                    <p className="text-sm text-green-700">
                      {selectedReport.status === 'resolved' ? 'Signalement résolu' : 'Signalement rejeté'}
                    </p>
                    {selectedReport.resolvedAt && (
                      <p className="text-sm text-green-600 mt-1">
                        Le {new Date(selectedReport.resolvedAt).toLocaleDateString('fr-FR')} par {selectedReport.resolvedBy}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {selectedReport.status === 'pending' && (
                <DialogFooter className="gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowReportDetails(false);
                      handleResolve(selectedReport, 'dismiss');
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Rejeter
                  </Button>
                  <Button 
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setShowReportDetails(false);
                      handleResolve(selectedReport, 'resolve');
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Résoudre
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {resolveAction === 'resolve' ? 'Résoudre le signalement' : 'Rejeter le signalement'}
            </DialogTitle>
            <DialogDescription>
              {resolveAction === 'resolve' 
                ? 'Êtes-vous sûr de vouloir marquer ce signalement comme résolu ?'
                : 'Êtes-vous sûr de vouloir rejeter ce signalement ?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveDialog(false)}>
              Annuler
            </Button>
            <Button 
              variant={resolveAction === 'resolve' ? 'default' : 'secondary'}
              className={resolveAction === 'resolve' ? 'bg-green-600 hover:bg-green-700' : ''}
              onClick={confirmResolve}
            >
              {resolveAction === 'resolve' ? 'Résoudre' : 'Rejeter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
