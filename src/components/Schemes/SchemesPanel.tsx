import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Download, CheckCircle, X, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AddSchemeModal } from './AddSchemeModal';
import { mockSchemes } from '@/data/mockData';
import { Scheme } from '@/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface SchemesPanelProps {
  role?: 'state' | 'district' | 'mandal';
  district?: string;
  mandal?: string;
}

const statusColors = {
  'Applied': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  'Under Review': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  'Approved': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
};

export function SchemesPanel({ role = 'state', district, mandal }: SchemesPanelProps) {
  const [schemes, setSchemes] = useState<Scheme[]>(mockSchemes);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      const matchesSearch = 
        scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.applicantName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || scheme.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [schemes, searchTerm, statusFilter]);

  const handleStatusUpdate = (schemeId: string, newStatus: Scheme['status']) => {
    setSchemes(schemes.map(scheme => 
      scheme.id === schemeId ? { ...scheme, status: newStatus } : scheme
    ));
    
    toast({
      title: "Status Updated",
      description: `Scheme status has been updated to ${newStatus}.`,
    });
  };

  const handleAddScheme = (newScheme: Scheme) => {
    setSchemes(prev => [newScheme, ...prev]);
  };

  const handleBulkApprove = () => {
    const pendingSchemes = schemes.filter(s => s.status === 'Under Review');
    setSchemes(schemes.map(scheme => 
      scheme.status === 'Under Review' ? { ...scheme, status: 'Approved' } : scheme
    ));
    
    toast({
      title: "Bulk Approval Complete",
      description: `${pendingSchemes.length} schemes have been approved.`,
    });
  };

  const getRoleTitle = () => {
    if (role === 'state') return 'State Schemes Management';
    if (role === 'district') return `District ${district?.toUpperCase()} Schemes`;
    if (role === 'mandal') return `Mandal ${mandal?.toUpperCase()} Schemes`;
    return 'Schemes Management';
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
            Manage scheme applications and approvals
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleBulkApprove} variant="outline">
            <CheckCircle className="h-4 w-4 mr-2" />
            Bulk Approve
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Scheme
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schemes or applicants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Applied">Applied</SelectItem>
            <SelectItem value="Under Review">Under Review</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['Applied', 'Under Review', 'Approved', 'Rejected'] as const).map((status) => (
          <div key={status} className="bg-muted/50 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {schemes.filter(s => s.status === status).length}
            </div>
            <div className="text-sm text-muted-foreground">{status}</div>
          </div>
        ))}
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme, index) => (
          <motion.div
            key={scheme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {scheme.name}
                      {scheme.isNew && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          🆕 New
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {scheme.applicantName}
                    </p>
                  </div>
                  <Badge className={statusColors[scheme.status]}>
                    {scheme.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Age:</span>
                    <p className="font-medium">{scheme.age} years</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Gender:</span>
                    <p className="font-medium">{scheme.gender}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Income:</span>
                    <p className="font-medium">₹{scheme.income.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Eligible:</span>
                    <p className={`font-medium ${scheme.eligibilityMatch ? 'text-green-600' : 'text-red-600'}`}>
                      {scheme.eligibilityMatch ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="text-muted-foreground">Applied:</span>
                  <p className="font-medium">{format(new Date(scheme.appliedAt), 'MMM dd, yyyy')}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedScheme(scheme);
                      setIsModalOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  
                  {scheme.status === 'Under Review' && (
                    <>
                      <Button 
                        size="sm"
                        onClick={() => handleStatusUpdate(scheme.id, 'Approved')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleStatusUpdate(scheme.id, 'Rejected')}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Scheme Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Applicant Profile</DialogTitle>
          </DialogHeader>
          
          {selectedScheme && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedScheme.name}</h3>
                <p className="text-muted-foreground">{selectedScheme.applicantName}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Age</label>
                  <p>{selectedScheme.age} years</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Gender</label>
                  <p>{selectedScheme.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Annual Income</label>
                  <p>₹{selectedScheme.income.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Eligibility</label>
                  <p className={selectedScheme.eligibilityMatch ? 'text-green-600' : 'text-red-600'}>
                    {selectedScheme.eligibilityMatch ? 'Eligible' : 'Not Eligible'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Application Date</label>
                <p>{format(new Date(selectedScheme.appliedAt), 'MMMM dd, yyyy')}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Current Status</label>
                <Badge className={statusColors[selectedScheme.status]}>
                  {selectedScheme.status}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Scheme Modal */}
      <AddSchemeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddScheme={handleAddScheme}
      />
    </motion.div>
  );
}