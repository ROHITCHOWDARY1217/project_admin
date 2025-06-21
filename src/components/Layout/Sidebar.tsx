import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  AlertTriangle, 
  Megaphone, 
  Car, 
  Users, 
  Shield, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  role: 'state' | 'district' | 'mandal';
  isMobile?: boolean;
}

export function Sidebar({ activeSection, onSectionChange, role, isMobile = false }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { adminCode } = useAuth();
  const { t } = useTranslation();

  const menuItems = [
    { id: 'dashboard', labelKey: 'nav.dashboard', icon: Home },
    { id: 'complaints', labelKey: 'nav.complaints', icon: AlertTriangle },
    { id: 'schemes', labelKey: 'nav.schemes', icon: Megaphone },
    { id: 'traffic', labelKey: 'nav.traffic', icon: Car },
    { id: 'elderly', labelKey: 'nav.elderly', icon: Users },
    { id: 'scam-alerts', labelKey: 'nav.scamAlerts', icon: Shield },
    { id: 'admin-tools', labelKey: 'nav.adminTools', icon: Settings }
  ];

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'state': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'district': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'mandal': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {isMobileOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside className="relative w-64 h-full bg-background border-r shadow-lg">
              <div className="p-6">
                <h2 className="text-xl font-bold">Smart Civic Portal</h2>
                <p className="text-sm text-muted-foreground">Intelligence System</p>
                <Badge className={`mt-2 ${getRoleBadgeColor(role)}`}>
                  {adminCode?.toUpperCase()} - {role.toUpperCase()}
                </Badge>
              </div>
              <nav className="px-4 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleSectionChange(item.id)}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {t(item.labelKey)}
                    </Button>
                  );
                })}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </>
    );
  }

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="hidden md:flex flex-col bg-background border-r h-screen sticky top-0"
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-xl font-bold">Smart Civic Portal</h2>
              <p className="text-sm text-muted-foreground">Intelligence System</p>
              <Badge className={`mt-2 ${getRoleBadgeColor(role)}`}>
                {adminCode?.toUpperCase()} - {role.toUpperCase()}
              </Badge>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <nav className="px-4 space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className={cn(
                "w-full",
                isCollapsed ? "justify-center px-2" : "justify-start"
              )}
              onClick={() => handleSectionChange(item.id)}
            >
              <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
              {!isCollapsed && t(item.labelKey)}
            </Button>
          );
        })}
      </nav>
    </motion.aside>
  );
}