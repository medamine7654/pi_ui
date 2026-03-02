import { useEffect, useState } from 'react';
import { 
  Users, 
  Briefcase, 
  Wrench, 
  Calendar, 
  Flag, 
  TrendingUp, 
  TrendingDown,
  Euro,
  AlertTriangle,
  Activity as ActivityIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockStats, mockActivities, revenueChartData, bookingsChartData } from '@/data/mockData';
import type { Activity } from '@/types';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  trendValue?: string;
  color: string;
}

function StatCard({ title, value, description, icon: Icon, trend, trendValue, color }: StatCardProps) {
  const [count, setCount] = useState(0);
  const numericValue = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, '')) : value;
  const isCurrency = typeof value === 'string' && value.includes('€');
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [numericValue]);

  const displayValue = isCurrency 
    ? `${count.toLocaleString()}€` 
    : count.toLocaleString();

  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div 
        className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full transition-transform group-hover:scale-110"
        style={{ backgroundColor: color }}
      />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#484848]">{displayValue}</div>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        {trend && trendValue && (
          <div className={`flex items-center gap-1 mt-2 text-xs ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{trendValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SimpleLineChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" className="w-full h-32" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,100 ${points} 100,100`}
        fill={`url(#gradient-${color})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw"
      />
    </svg>
  );
}

function SimpleBarChart({ data, colors }: { data: { label: string; value: number; color: string }[]; colors?: string[] }) {
  const max = Math.max(...data.map(d => d.value));
  
  return (
    <div className="flex items-end justify-between h-32 gap-2">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-1">
          <div 
            className="w-full rounded-t-md transition-all duration-500 hover:opacity-80"
            style={{ 
              height: `${(item.value / max) * 100}%`,
              backgroundColor: item.color || colors?.[index % (colors?.length || 1)] || '#FF5A5F'
            }}
          />
          <span className="text-xs text-gray-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'user_registered': return Users;
      case 'booking_created': return Calendar;
      case 'booking_cancelled': return AlertTriangle;
      case 'report_submitted': return Flag;
      case 'service_created': return Briefcase;
      case 'tool_created': return Wrench;
      case 'user_suspended': return AlertTriangle;
      default: return ActivityIcon;
    }
  };

  const getColor = (type: Activity['type']) => {
    switch (type) {
      case 'user_registered': return '#00A699';
      case 'booking_created': return '#FF5A5F';
      case 'booking_cancelled': return '#FF5A5F';
      case 'report_submitted': return '#FF5A5F';
      case 'service_created': return '#00A699';
      case 'tool_created': return '#00A699';
      case 'user_suspended': return '#FF5A5F';
      default: return '#484848';
    }
  };

  const Icon = getIcon(activity.type);
  const color = getColor(activity.type);

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div 
        className="p-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#484848]">{activity.description}</p>
        {activity.userName && (
          <p className="text-xs text-gray-500 mt-0.5">par {activity.userName}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          {new Date(activity.timestamp).toLocaleString('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}

export function DashboardOverview() {
  const stats = [
    { 
      title: 'Utilisateurs totaux', 
      value: mockStats.totalUsers, 
      description: `${mockStats.totalHosts} hôtes, ${mockStats.totalGuests} voyageurs`,
      icon: Users, 
      trend: 'up' as const, 
      trendValue: '+12% ce mois',
      color: '#FF5A5F' 
    },
    { 
      title: 'Services actifs', 
      value: mockStats.totalServices, 
      icon: Briefcase, 
      trend: 'up' as const, 
      trendValue: '+8% ce mois',
      color: '#00A699' 
    },
    { 
      title: 'Matériel disponible', 
      value: mockStats.totalTools, 
      icon: Wrench, 
      color: '#484848' 
    },
    { 
      title: 'Réservations', 
      value: mockStats.totalBookings, 
      description: `${mockStats.totalToolRentals} locations de matériel`,
      icon: Calendar, 
      trend: 'up' as const, 
      trendValue: '+15% ce mois',
      color: '#FF5A5F' 
    },
    { 
      title: 'Revenus mensuels', 
      value: `${mockStats.monthlyRevenue}€`, 
      icon: Euro, 
      trend: 'up' as const, 
      trendValue: '+5.2% ce mois',
      color: '#00A699' 
    },
    { 
      title: 'Signalements', 
      value: mockStats.pendingReports, 
      description: `${mockStats.flaggedAccounts} comptes signalés`,
      icon: Flag, 
      trend: 'down' as const, 
      trendValue: '-3 ce mois',
      color: '#FF5A5F' 
    },
  ];

  const revenueData = revenueChartData.datasets[0].data.slice(-6).map((v, i) => ({
    label: revenueChartData.labels.slice(-6)[i],
    value: v,
    color: '#FF5A5F'
  }));

  const bookingsData = bookingsChartData.datasets.map(ds => ({
    label: ds.label,
    data: ds.data.slice(-6)
  }));

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#484848]">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Vue d'ensemble de la plateforme</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Évolution des revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={revenueData} />
          </CardContent>
        </Card>

        {/* Bookings Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Réservations et locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookingsData.map((dataset, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{dataset.label}</span>
                    <span className="text-sm font-medium" style={{ color: idx === 0 ? '#00A699' : '#FF5A5F' }}>
                      {dataset.data[dataset.data.length - 1]}
                    </span>
                  </div>
                  <SimpleLineChart 
                    data={dataset.data} 
                    color={idx === 0 ? '#00A699' : '#FF5A5F'} 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Health */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Santé de la plateforme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Taux d'annulation</span>
                <span className="font-medium">{mockStats.cancellationRate}%</span>
              </div>
              <Progress value={mockStats.cancellationRate * 10} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Seuil recommandé: &lt;5%</p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Satisfaction clients</span>
                <span className="font-medium">4.6/5</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Hôtes actifs</span>
                <span className="font-medium">87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-1">
                {mockActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
