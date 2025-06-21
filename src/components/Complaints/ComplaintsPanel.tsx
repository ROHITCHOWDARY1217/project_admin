import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ComplaintCard } from './ComplaintCard';
import { ComplaintModal } from './ComplaintModal';
import { mockComplaints } from '@/data/mockData';
import { Complaint } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface ComplaintsPanelProps {
  role?: 'state' | 'district' | 'mandal';
  district?: string;
  mandal?: string;
}

export function ComplaintsPanel({ role = 'state', district, mandal }: ComplaintsPanelProps) {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        complaint.name.toLowerCase().includes(searchLower) ||
        complaint.title.toLowerCase().includes(searchLower) ||
        complaint.location.toLowerCase().includes(searchLower) ||
        complaint.description.toLowerCase().includes(searchLower);
      
      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [complaints, searchTerm, statusFilter, categoryFilter]);

  const handleComplaintClick = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const handleComplaintUpdate = (updatedComplaint: Complaint) => {
    setComplaints(complaints.map(c => 
      c.id === updatedComplaint.id ? updatedComplaint : c
    ));
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Download Started",
        description: t('complaints.exportReport') + " is being generated...",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [...new Set(complaints.map(c => c.category))];

  const getRoleTitle = () => {
    if (role === 'state') return t('complaints.stateManagement');
    if (role === 'district') return `${t('complaints.districtManagement')} - ${district?.toUpperCase()}`;
    if (role === 'mandal') return `${t('complaints.mandalManagement')} - ${mandal?.toUpperCase()}`;
    return t('complaints.management');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 md:space-y-6"
    >
      {/* Header and Filters */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">{getRoleTitle()}</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              {t('complaints.manageRespond')}
            </p>
          </div>
          
          <Button 
            onClick={handleDownload} 
            disabled={isLoading}
            className="flex items-center space-x-2 w-full md:w-auto"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{isLoading ? t('common.loading') : t('complaints.exportReport')}</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('complaints.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t('complaints.allStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('complaints.allStatus')}</SelectItem>
                <SelectItem value="Pending">{t('complaints.pending')}</SelectItem>
                <SelectItem value="In Progress">{t('complaints.inProgress')}</SelectItem>
                <SelectItem value="Resolved">{t('complaints.resolved')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t('complaints.allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('complaints.allCategories')}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 md:p-4 rounded-lg">
          <div className="text-lg md:text-2xl font-bold text-yellow-700 dark:text-yellow-300">
            {complaints.filter(c => c.status === 'Pending').length}
          </div>
          <div className="text-xs md:text-sm text-yellow-600 dark:text-yellow-400">{t('complaints.pending')}</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 md:p-4 rounded-lg">
          <div className="text-lg md:text-2xl font-bold text-blue-700 dark:text-blue-300">
            {complaints.filter(c => c.status === 'In Progress').length}
          </div>
          <div className="text-xs md:text-sm text-blue-600 dark:text-blue-400">{t('complaints.inProgress')}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-3 md:p-4 rounded-lg">
          <div className="text-lg md:text-2xl font-bold text-green-700 dark:text-green-300">
            {complaints.filter(c => c.status === 'Resolved').length}
          </div>
          <div className="text-xs md:text-sm text-green-600 dark:text-green-400">{t('complaints.resolved')}</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/20 p-3 md:p-4 rounded-lg">
          <div className="text-lg md:text-2xl font-bold text-gray-700 dark:text-gray-300">
            {complaints.length}
          </div>
          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{t('complaints.total')}</div>
        </div>
      </div>

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {filteredComplaints.map((complaint, index) => (
          <motion.div
            key={complaint.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ComplaintCard
              complaint={complaint}
              onClick={() => handleComplaintClick(complaint)}
            />
          </motion.div>
        ))}
      </div>

      {filteredComplaints.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <p className="text-muted-foreground">No complaints found matching your criteria.</p>
        </div>
      )}

      {/* Complaint Modal */}
      <ComplaintModal
        complaint={selectedComplaint}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleComplaintUpdate}
      />
    </motion.div>
  );
}