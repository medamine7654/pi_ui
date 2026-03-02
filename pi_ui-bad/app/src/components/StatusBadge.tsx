import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type StatusType = 
  | 'active' | 'suspended' | 'pending' | 'approved' | 'hidden'
  | 'available' | 'rented' | 'maintenance'
  | 'requested' | 'confirmed' | 'completed' | 'cancelled'
  | 'low' | 'medium' | 'high' | 'critical'
  | 'resolved' | 'dismissed';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  // User statuses
  active: { label: 'Actif', className: 'bg-green-100 text-green-700 hover:bg-green-100' },
  suspended: { label: 'Suspendu', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
  pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' },
  
  // Service statuses
  approved: { label: 'Approuvé', className: 'bg-green-100 text-green-700 hover:bg-green-100' },
  hidden: { label: 'Masqué', className: 'bg-gray-100 text-gray-700 hover:bg-gray-100' },
  
  // Tool statuses
  available: { label: 'Disponible', className: 'bg-green-100 text-green-700 hover:bg-green-100' },
  rented: { label: 'Loué', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
  maintenance: { label: 'Maintenance', className: 'bg-orange-100 text-orange-700 hover:bg-orange-100' },
  
  // Booking statuses
  requested: { label: 'Demandée', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' },
  confirmed: { label: 'Confirmée', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
  completed: { label: 'Terminée', className: 'bg-green-100 text-green-700 hover:bg-green-100' },
  cancelled: { label: 'Annulée', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
  
  // Severity levels
  low: { label: 'Faible', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
  medium: { label: 'Moyen', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' },
  high: { label: 'Élevé', className: 'bg-orange-100 text-orange-700 hover:bg-orange-100' },
  critical: { label: 'Critique', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
  
  // Report statuses
  resolved: { label: 'Résolu', className: 'bg-green-100 text-green-700 hover:bg-green-100' },
  dismissed: { label: 'Rejeté', className: 'bg-gray-100 text-gray-700 hover:bg-gray-100' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-700' };
  
  return (
    <Badge 
      variant="secondary" 
      className={cn(config.className, 'font-medium capitalize', className)}
    >
      {config.label}
    </Badge>
  );
}
