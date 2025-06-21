import { motion } from 'framer-motion';
import { Settings, Download, Upload, Users, BarChart3, RefreshCw, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface AdminToolsPanelProps {
  role?: 'state' | 'district' | 'mandal';
  district?: string;
  mandal?: string;
}

export function AdminToolsPanel({ role = 'state', district, mandal }: AdminToolsPanelProps) {
  const [notifications, setNotifications] = useState(true);
  const [autoAssign, setAutoAssign] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const { toast } = useToast();

  const handleExport = (type: string) => {
    toast({
      title: "Export Started",
      description: `${type} export is being generated...`,
    });
  };

  const handleRefresh = () => {
    toast({
      title: "Data Refreshed",
      description: "All data has been synced successfully.",
    });
  };

  const handleBackup = () => {
    toast({
      title: "Backup Created",
      description: "System backup has been created successfully.",
    });
  };

  const getRoleTitle = () => {
    if (role === 'state') return 'State Admin Tools';
    if (role === 'district') return `District ${district?.toUpperCase()} Admin Tools`;
    if (role === 'mandal') return `Mandal ${mandal?.toUpperCase()} Admin Tools`;
    return 'Admin Tools';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold">{getRoleTitle()}</h2>
        <p className="text-muted-foreground">
          System settings and administrative utilities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for new submissions
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-assign">Auto Assignment</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically assign complaints to departments
                </p>
              </div>
              <Switch
                id="auto-assign"
                checked={autoAssign}
                onCheckedChange={setAutoAssign}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-alerts">Email Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications to department heads
                </p>
              </div>
              <Switch
                id="email-alerts"
                checked={emailAlerts}
                onCheckedChange={setEmailAlerts}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => handleExport('All Reports')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export All Reports
            </Button>
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => handleExport('Complaints')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Complaints Data
            </Button>
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => handleExport('Schemes')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Schemes Data
            </Button>
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleBackup}
            >
              <Upload className="h-4 w-4 mr-2" />
              Create System Backup
            </Button>
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh All Data
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-sm text-muted-foreground">Active Sessions</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-muted-foreground">System Uptime</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">156</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">5.2GB</div>
                <div className="text-sm text-muted-foreground">Storage Used</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Assistant Simulation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm mb-2">💡 <strong>AI Suggestion:</strong></p>
              <p className="text-sm text-muted-foreground">
                "5 new complaints about water supply in Sector 15. Consider bulk assignment to Water Department."
              </p>
            </div>
            
            <Button className="w-full" variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat with AI Assistant
            </Button>
            
            <Button className="w-full" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Summary Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}