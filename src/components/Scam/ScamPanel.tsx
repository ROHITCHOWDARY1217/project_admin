import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, AlertTriangle, CheckCircle, X, Eye, Archive, Megaphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { mockScamReports } from '@/data/mockData';
import { ScamReport } from '@/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ScamPanelProps {
  role?: 'state' | 'district' | 'mandal';
  district?: string;
  mandal?: string;
}

const statusColors = {
  'Verified': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  'Unverified': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  'False Report': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
};

const typeColors = {
  'Fake Agent': 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  'Fake Website': 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
  'Phone Scam': 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
  'Email Fraud': 'bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300'
};

export function ScamPanel({ role = 'state', district, mandal }: ScamPanelProps) {
  const [reports, setReports] = useState<ScamReport[]>(mockScamReports);
  const [selectedReport, setSelectedReport] = useState<ScamReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch = 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'all' || report.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [reports, searchTerm, typeFilter, statusFilter]);

  const handleStatusUpdate = (reportId: string, newStatus: ScamReport['status']) => {
    setReports(reports.map(report => 
      report.id === reportId ? { ...report, status: newStatus } : report
    ));
    
    toast({
      title: "Status Updated",
      description: `Report status has been updated to ${newStatus}.`,
    });
  };

  const handleToggleAlert = (reportId: string) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, isAlertActive: !report.isAlertActive }
        : report
    ));
    
    const report = reports.find(r => r.id === reportId);
    toast({
      title: report?.isAlertActive ? "Alert Deactivated" : "Alert Activated",
      description: report?.isAlertActive 
        ? "Alert removed from homepage banner." 
        : "Alert added to homepage banner.",
    });
  };

  const handleArchive = (reportId: string) => {
    setReports(reports.filter(report => report.id !== reportId));
    toast({
      title: "Report Archived",
      description: "The report has been archived successfully.",
    });
  };

  const scamTypes = [...new Set(reports.map(r => r.type))];

  const getRoleTitle = () => {
    if (role === 'state') return 'State Scam Reports & Alerts';
    if (role === 'district') return `District ${district?.toUpperCase()} Scam Reports`;
    if (role === 'mandal') return `Mandal ${mandal?.toUpperCase()} Scam Reports`;
    return 'Scam Reports & Alerts';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold">{getRoleTitle()}</h2>
          <p className="text-muted-foreground">
            Monitor and verify fraud reports from citizens
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {scamTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="Unverified">Unverified</SelectItem>
            <SelectItem value="False Report">False Report</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {reports.filter(r => r.status === 'Verified').length}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">Verified</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
            {reports.filter(r => r.status === 'Unverified').length}
          </div>
          <div className="text-sm text-yellow-600 dark:text-yellow-400">Pending Review</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {reports.filter(r => r.isAlertActive).length}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">Active Alerts</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-700 dark:text-red-300">
            {reports.filter(r => r.status === 'False Report').length}
          </div>
          <div className="text-sm text-red-600 dark:text-red-400">False Reports</div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedReport(report);
                    setIsModalOpen(true);
                  }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-500" />
                      {report.title}
                    </CardTitle>
                    <Badge variant="outline" className={typeColors[report.type as keyof typeof typeColors]}>
                      {report.type}
                    </Badge>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={statusColors[report.status]}>
                      {report.status}
                    </Badge>
                    {report.isAlertActive && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                        🚨 Alert Active
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {report.description}
                </p>
                
                {report.link && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Link:</span>
                    <p className="font-mono text-xs bg-muted/50 p-1 rounded truncate">
                      {report.link}
                    </p>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  Reported: {format(new Date(report.reportedAt), 'MMM dd, yyyy')}
                </div>

                <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedReport(report);
                      setIsModalOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  
                  {report.status === 'Unverified' && (
                    <>
                      <Button 
                        size="sm"
                        onClick={() => handleStatusUpdate(report.id, 'Verified')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verify
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleStatusUpdate(report.id, 'False Report')}
                      >
                        <X className="h-4 w-4 mr-1" />
                        False
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Report Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Scam Report Details</span>
              <div className="flex gap-2">
                <Badge className={statusColors[selectedReport?.status || 'Unverified']}>
                  {selectedReport?.status}
                </Badge>
                {selectedReport?.isAlertActive && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    🚨 Alert Active
                  </Badge>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedReport.title}</h3>
                <Badge variant="outline" className={typeColors[selectedReport.type as keyof typeof typeColors]}>
                  {selectedReport.type}
                </Badge>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm leading-relaxed">{selectedReport.description}</p>
              </div>
              
              {selectedReport.link && (
                <div>
                  <Label className="text-sm font-medium">Related Link</Label>
                  <p className="font-mono text-sm bg-muted/50 p-2 rounded break-all">
                    {selectedReport.link}
                  </p>
                </div>
              )}
              
              <div>
                <Label className="text-sm font-medium">Reported Date</Label>
                <p>{format(new Date(selectedReport.reportedAt), 'MMMM dd, yyyy HH:mm')}</p>
              </div>

              <div className="flex flex-wrap gap-2 pt-4">
                {selectedReport.status === 'Unverified' && (
                  <>
                    <Button onClick={() => {
                      handleStatusUpdate(selectedReport.id, 'Verified');
                      setIsModalOpen(false);
                    }}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verify Report
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        handleStatusUpdate(selectedReport.id, 'False Report');
                        setIsModalOpen(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Mark as False
                    </Button>
                  </>
                )}
                
                {selectedReport.status === 'Verified' && (
                  <Button 
                    variant={selectedReport.isAlertActive ? "outline" : "default"}
                    onClick={() => {
                      handleToggleAlert(selectedReport.id);
                      setIsModalOpen(false);
                    }}
                  >
                    <Megaphone className="h-4 w-4 mr-1" />
                    {selectedReport.isAlertActive ? 'Remove from Alert' : 'Add to Alert Banner'}
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    handleArchive(selectedReport.id);
                    setIsModalOpen(false);
                  }}
                >
                  <Archive className="h-4 w-4 mr-1" />
                  Archive Report
                </Button>
                
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}