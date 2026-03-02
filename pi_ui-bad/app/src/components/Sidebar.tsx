import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Wrench,
  Calendar,
  Flag,
  BarChart3,
  Settings,
  Menu,
  X,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'tools', label: 'Matériel', icon: Wrench },
  { id: 'bookings', label: 'Réservations', icon: Calendar },
  { id: 'reports', label: 'Signalements', icon: Flag, badge: 23 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Paramètres', icon: Settings },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleMobile}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className={cn('flex items-center gap-2', collapsed && 'justify-center w-full')}>
            <div className="w-8 h-8 bg-gradient-to-br from-[#FF5A5F] to-[#00A699] rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="font-bold text-lg text-[#484848]">RentAdmin</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={toggleSidebar}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <TooltipProvider delayDuration={0}>
            <nav className="p-3 space-y-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                const Icon = item.icon;

                const navButton = (
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-3 transition-all duration-200',
                      isActive && 'bg-[#FF5A5F] hover:bg-[#FF5A5F]/90 text-white',
                      !isActive && 'text-[#484848] hover:bg-gray-100',
                      collapsed && 'justify-center px-2'
                    )}
                    onClick={() => {
                      onSectionChange(item.id);
                      setMobileOpen(false);
                    }}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && (
                      <span className="flex-1 text-left">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className={cn(
                        'px-2 py-0.5 text-xs rounded-full',
                        isActive ? 'bg-white/20' : 'bg-[#FF5A5F] text-white'
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </Button>
                );

                if (collapsed) {
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        {navButton}
                      </TooltipTrigger>
                      <TooltipContent side="right" className="flex items-center gap-2">
                        {item.label}
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-xs bg-[#FF5A5F] text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return <div key={item.id}>{navButton}</div>;
              })}
            </nav>
          </TooltipProvider>
        </ScrollArea>
      </aside>
    </>
  );
}
