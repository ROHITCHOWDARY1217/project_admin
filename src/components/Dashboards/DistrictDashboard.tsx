import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Header } from '@/components/Layout/Header';
import { DashboardOverview } from '@/components/Dashboard/DashboardOverview';
import { ComplaintsPanel } from '@/components/Complaints/ComplaintsPanel';
import { SchemesPanel } from '@/components/Schemes/SchemesPanel';
import { TrafficPanel } from '@/components/Traffic/TrafficPanel';
import { ElderlyPanel } from '@/components/Elderly/ElderlyPanel';
import { ScamPanel } from '@/components/Scam/ScamPanel';
import { AdminToolsPanel } from '@/components/AdminTools/AdminToolsPanel';
import { AIAssistant } from '@/components/AI/AIAssistant';
import { useTranslation } from 'react-i18next';

interface DistrictDashboardProps {
  district: string;
}

const sectionTitles = {
  dashboard: 'District Dashboard Overview',
  complaints: 'District Complaint Management',
  schemes: 'District Schemes Management',
  traffic: 'District Traffic & Infrastructure',
  elderly: 'District Elderly Skill Program',
  'scam-alerts': 'District Scam Reports & Alerts',
  'admin-tools': 'District Admin Tools'
};

export function DistrictDashboard({ district }: DistrictDashboardProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { t } = useTranslation();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview role="district" district={district} />;
      case 'complaints':
        return <ComplaintsPanel role="district" district={district} />;
      case 'schemes':
        return <SchemesPanel role="district" district={district} />;
      case 'traffic':
        return <TrafficPanel role="district" district={district} />;
      case 'elderly':
        return <ElderlyPanel role="district" district={district} />;
      case 'scam-alerts':
        return <ScamPanel role="district" district={district} />;
      case 'admin-tools':
        return <AdminToolsPanel role="district" district={district} />;
      default:
        return <DashboardOverview role="district" district={district} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        role="district"
      />
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        role="district"
        isMobile={true}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={`${sectionTitles[activeSection as keyof typeof sectionTitles]} - ${district.toUpperCase()}`} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            {renderContent()}
          </div>
        </main>
      </div>
      
      <AIAssistant role="district" />
    </div>
  );
}