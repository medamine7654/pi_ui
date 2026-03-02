import { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Euro, 
  Flag,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  mockStats, 
  mockUsers, 
  mockBookings, 
  mockTools,
  revenueChartData, 
  bookingsChartData
} from '@/data/mockData';
import { cn } from '@/lib/utils';

export function Analytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Calculate metrics
  const topHosts = mockUsers
    .filter(u => u.role === 'host')
    .sort((a, b) => b.bookingsCount - a.bookingsCount)
    .slice(0, 5);

  const mostReported = mockUsers
    .filter(u => u.reportsCount > 0)
    .sort((a, b) => b.reportsCount - a.reportsCount)
    .slice(0, 5);

  const highCancellationUsers = mockUsers
    .filter(u => u.cancellationRate > 5)
    .sort((a, b) => b.cancellationRate - a.cancellationRate)
    .slice(0, 5);

  const cancelledBookings = mockBookings.filter(b => b.status === 'cancelled');
  const cancellationRate = (cancelledBookings.length / mockBookings.length) * 100;

  const revenueData = revenueChartData.datasets[0].data;
  const currentRevenue = revenueData[revenueData.length - 1];
  const previousRevenue = revenueData[revenueData.length - 2];
  const revenueGrowth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#484848]">Analytics</h1>
          <p className="text-gray-500 mt-1">Statistiques et indicateurs de performance</p>
        </div>
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? 'bg-[#FF5A5F]' : ''}
            >
              {range === '7d' && '7 jours'}
              {range === '30d' && '30 jours'}
              {range === '90d' && '3 mois'}
              {range === '1y' && '1 an'}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Revenus totaux"
          value={`${currentRevenue.toLocaleString()}€`}
          change={revenueGrowth}
          icon={Euro}
          color="#00A699"
        />
        <KPICard
          title="Réservations"
          value={mockStats.totalBookings.toLocaleString()}
          change={12.5}
          icon={Calendar}
          color="#FF5A5F"
        />
        <KPICard
          title="Nouveaux utilisateurs"
          value="156"
          change={8.3}
          icon={Users}
          color="#484848"
        />
        <KPICard
          title="Taux d'annulation"
          value={`${cancellationRate.toFixed(1)}%`}
          change={-2.1}
          icon={Flag}
          color="#FF5A5F"
          isNegativeGood
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Évolution des revenus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart 
              data={revenueChartData.datasets[0].data.slice(-6).map((v, i) => ({
                label: revenueChartData.labels.slice(-6)[i],
                value: v,
              }))}
              color="#00A699"
            />
          </CardContent>
        </Card>

        {/* Bookings Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Réservations vs Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleLineChart 
              data={bookingsChartData.datasets[0].data.slice(-6)}
              color="#FF5A5F"
              label="Services"
            />
            <div className="mt-4">
              <SimpleLineChart 
                data={bookingsChartData.datasets[1].data.slice(-6)}
                color="#00A699"
                label="Matériel"
              />
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5A5F]" />
                <span className="text-sm text-gray-600">Services</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00A699]" />
                <span className="text-sm text-gray-600">Matériel</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Hosts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Hôtes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topHosts.map((host, index) => (
                <div key={host.id} className="flex items-center gap-3">
                  <span className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-50 text-gray-500'
                  )}>
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{host.name}</p>
                    <p className="text-xs text-gray-500">{host.bookingsCount} réservations</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {host.listingsCount} annonces
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Most Reported */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-red-600">Plus signalés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mostReported.map((user, index) => (
                <div key={user.id} className="flex items-center gap-3">
                  <span className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    index === 0 ? 'bg-red-100 text-red-700' :
                    'bg-gray-50 text-gray-500'
                  )}>
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.reportsCount} signalements</p>
                  </div>
                  <Badge variant="destructive">
                    {user.riskScore}% risque
                  </Badge>
                </div>
              ))}
              {mostReported.length === 0 && (
                <p className="text-gray-500 text-center py-4">Aucun utilisateur signalé</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* High Cancellation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-orange-600">Taux d'annulation élevé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highCancellationUsers.map((user, index) => (
                <div key={user.id} className="flex items-center gap-3">
                  <span className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    index === 0 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-50 text-gray-500'
                  )}>
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">
                      {user.cancellationRate}% de ses réservations
                    </p>
                  </div>
                  <Progress 
                    value={user.cancellationRate * 5} 
                    className="w-16 h-2"
                  />
                </div>
              ))}
              {highCancellationUsers.length === 0 && (
                <p className="text-gray-500 text-center py-4">Aucun utilisateur concerné</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Health */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Santé de la plateforme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <HealthMetric
              label="Services actifs"
              value={mockStats.totalServices}
              total={mockStats.totalServices + 10}
              color="#FF5A5F"
            />
            <HealthMetric
              label="Matériel disponible"
              value={mockTools.filter(t => t.status === 'available').length}
              total={mockStats.totalTools}
              color="#00A699"
            />
            <HealthMetric
              label="Utilisateurs actifs"
              value={mockUsers.filter(u => u.status === 'active').length}
              total={mockUsers.length}
              color="#484848"
            />
            <HealthMetric
              label="Réservations complétées"
              value={mockBookings.filter(b => b.status === 'completed').length}
              total={mockBookings.length}
              color="#00A699"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
  isNegativeGood?: boolean;
}

function KPICard({ title, value, change, icon: Icon, color, isNegativeGood }: KPICardProps) {
  const isPositive = change > 0;
  const isGood = isNegativeGood ? !isPositive : isPositive;

  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div 
        className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full"
        style={{ backgroundColor: color }}
      />
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <div className={cn(
            'flex items-center gap-1 text-sm font-medium',
            isGood ? 'text-green-600' : 'text-red-600'
          )}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs(change).toFixed(1)}%
          </div>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold text-[#484848]">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface HealthMetricProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

function HealthMetric({ label, value, total, color }: HealthMetricProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value}/{total}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs text-gray-500">{percentage.toFixed(1)}% actif</p>
    </div>
  );
}

interface SimpleBarChartProps {
  data: { label: string; value: number }[];
  color: string;
}

function SimpleBarChart({ data, color }: SimpleBarChartProps) {
  const max = Math.max(...data.map(d => d.value));

  return (
    <div className="flex items-end justify-between h-48 gap-2">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full relative">
            <div 
              className="w-full rounded-t-md transition-all duration-500"
              style={{ 
                height: `${(item.value / max) * 160}px`,
                backgroundColor: color,
                opacity: 0.8 + (index / data.length) * 0.2
              }}
            />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
              {(item.value / 1000).toFixed(0)}k
            </div>
          </div>
          <span className="text-xs text-gray-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

interface SimpleLineChartProps {
  data: number[];
  color: string;
  label: string;
}

function SimpleLineChart({ data, color }: SimpleLineChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" className="w-full h-24" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,100 ${points} 100,100`}
        fill={`url(#gradient-${color.replace('#', '')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
