import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { DashboardOverview } from '@/sections/DashboardOverview';
import { UsersManagement } from '@/sections/UsersManagement';
import { ServicesModeration } from '@/sections/ServicesModeration';
import { ToolsModeration } from '@/sections/ToolsModeration';
import { BookingsOversight } from '@/sections/BookingsOversight';
import { ReportsFraud } from '@/sections/ReportsFraud';
import { Analytics } from '@/sections/Analytics';
import { Settings } from '@/sections/Settings';
import { cn } from '@/lib/utils';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'users':
        return <UsersManagement />;
      case 'services':
        return <ServicesModeration />;
      case 'tools':
        return <ToolsModeration />;
      case 'bookings':
        return <BookingsOversight />;
      case 'reports':
        return <ReportsFraud />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  const getSearchPlaceholder = () => {
    switch (activeSection) {
      case 'users':
        return 'Rechercher un utilisateur...';
      case 'services':
        return 'Rechercher un service...';
      case 'tools':
        return 'Rechercher un outil...';
      case 'bookings':
        return 'Rechercher une réservation...';
      case 'reports':
        return 'Rechercher un signalement...';
      default:
        return 'Rechercher...';
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className={cn(
        'transition-all duration-300',
        'lg:ml-64'
      )}>
        <Header searchPlaceholder={getSearchPlaceholder()} />
        <div className="pt-16">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
