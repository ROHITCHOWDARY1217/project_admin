import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { mockTrafficIssues } from '@/data/mockData';
import { TrafficIssue } from '@/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface TrafficPanelProps {
  role?: 'state' | 'district' | 'mandal';
  district?: string;
  mandal?: string;
}

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  'Resolved': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
};

const departments = [
  'Highway Maintenance',
  'Municipal Corporation',
  'Traffic Police',
  'Electrical Department'
];

export function TrafficPanel({ role = 'state', district, mandal }: TrafficPanelProps) {
  const [issues, setIssues] = useState<TrafficIssue[]>(mockTrafficIssues);
  const [selectedIssue, setSelectedIssue] = useState<TrafficIssue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesSearch = 
        issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.issueType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'all' || issue.issueType === typeFilter;
      const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [issues, searchTerm, typeFilter, statusFilter]);

  const handleStatusUpdate = (issueId: string, newStatus: TrafficIssue['status']) => {
    setIssues(issues.map(issue => 
      issue.id === issueId ? { ...issue, status: newStatus } : issue
    ));
    
    toast({
      title: "Status Updated",
      description: `Issue status has been updated to ${newStatus}.`,
    });
  };

  const handleAssignment = (issueId: string, department: string) => {
    setIssues(issues.map(issue => 
      issue.id === issueId ? { ...issue, assignedTo: department } : issue
    ));
    
    toast({
      title: "Issue Assigned",
      description: `Issue has been assigned to ${department}.`,
    });
  };

  const issueTypes = [...new Set(issues.map(i => i.issueType))];

  const getRoleTitle = () => {
    if (role === 'state') return 'State Traffic & Infrastructure';
    if (role === 'district') return `District ${district?.toUpperCase()} Traffic`;
    if (role === 'mandal') return `Mandal ${mandal?.toUpperCase()} Traffic`;
    return 'Traffic & City Issues';
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
            Manage road issues and infrastructure problems
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by location or issue type..."
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
            {issueTypes.map((type) => (
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
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
            {issues.filter(i => i.status === 'Pending').length}
          </div>
          <div className="text-sm text-yellow-600 dark:text-yellow-400">Pending</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {issues.filter(i => i.status === 'Resolved').length}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">Resolved</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-700 dark:text-red-300">
            {issues.filter(i => i.issueType === 'Pothole').length}
          </div>
          <div className="text-sm text-red-600 dark:text-red-400">Potholes</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {issues.filter(i => i.issueType === 'Traffic Light').length}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">Traffic Lights</div>
        </div>
      </div>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredIssues.map((issue, index) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedIssue(issue);
                    setIsModalOpen(true);
                  }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      {issue.issueType}
                    </CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {issue.location}
                    </div>
                  </div>
                  <Badge className={statusColors[issue.status]}>
                    {issue.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {issue.userMessage}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(issue.reportDate), 'MMM dd, yyyy')}
                  </div>
                  {issue.assignedTo && (
                    <div className="flex items-center text-blue-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {issue.assignedTo}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  {issue.status === 'Pending' && (
                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(issue.id, 'Resolved');
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Issue Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Issue Details</DialogTitle>
          </DialogHeader>
          
          {selectedIssue && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  {selectedIssue.issueType}
                </h3>
                <Badge className={statusColors[selectedIssue.status]}>
                  {selectedIssue.status}
                </Badge>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Location</Label>
                <p className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {selectedIssue.location}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Report Date</Label>
                <p className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {format(new Date(selectedIssue.reportDate), 'MMMM dd, yyyy HH:mm')}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm leading-relaxed">{selectedIssue.userMessage}</p>
              </div>
              
              {selectedIssue.assignedTo && (
                <div>
                  <Label className="text-sm font-medium">Assigned To</Label>
                  <p className="flex items-center gap-1 text-blue-600">
                    <Clock className="h-4 w-4" />
                    {selectedIssue.assignedTo}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium">Assign to Department</Label>
                <Select onValueChange={(value) => handleAssignment(selectedIssue.id, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedIssue.assignedTo || "Select Department"} />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                {selectedIssue.status === 'Pending' && (
                  <Button onClick={() => {
                    handleStatusUpdate(selectedIssue.id, 'Resolved');
                    setIsModalOpen(false);
                  }}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark as Resolved
                  </Button>
                )}
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