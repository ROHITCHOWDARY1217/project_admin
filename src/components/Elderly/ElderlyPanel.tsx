import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Users, CheckCircle, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { mockElderlyWorkers } from '@/data/mockData';
import { ElderlyWorker } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ElderlyPanelProps {
  role?: 'state' | 'district' | 'mandal';
  district?: string;
  mandal?: string;
}

const statusColors = {
  'Registered': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  'Assigned Work': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  'Paid': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
};

const tasks = [
  'Data Entry Project',
  'Online Form Filling',
  'Content Moderation',
  'Customer Support Chat',
  'Document Digitization',
  'Survey Completion',
  'Product Description Writing'
];

export function ElderlyPanel({ role = 'state', district, mandal }: ElderlyPanelProps) {
  const [workers, setWorkers] = useState<ElderlyWorker[]>(mockElderlyWorkers);
  const [selectedWorker, setSelectedWorker] = useState<ElderlyWorker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const matchesSearch = 
        worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSkill = skillFilter === 'all' || worker.skill === skillFilter;
      const matchesStatus = statusFilter === 'all' || worker.status === statusFilter;
      
      return matchesSearch && matchesSkill && matchesStatus;
    });
  }, [workers, searchTerm, skillFilter, statusFilter]);

  const handleStatusUpdate = (workerId: string, newStatus: ElderlyWorker['status']) => {
    setWorkers(workers.map(worker => 
      worker.id === workerId ? { ...worker, status: newStatus } : worker
    ));
    
    toast({
      title: "Status Updated",
      description: `Worker status has been updated to ${newStatus}.`,
    });
  };

  const handleTaskAssignment = (workerId: string, task: string) => {
    setWorkers(workers.map(worker => 
      worker.id === workerId ? { ...worker, assignedTask: task, status: 'Assigned Work' } : worker
    ));
    
    toast({
      title: "Task Assigned",
      description: `Task "${task}" has been assigned successfully.`,
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Participant list is being generated...",
    });
  };

  const skills = [...new Set(workers.map(w => w.skill))];

  const getRoleTitle = () => {
    if (role === 'state') return 'State Elderly Skill Program';
    if (role === 'district') return `District ${district?.toUpperCase()} Elderly Skills`;
    if (role === 'mandal') return `Mandal ${mandal?.toUpperCase()} Elderly Skills`;
    return 'Elderly Skill Program';
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
            Manage work-from-home opportunities for elderly citizens
          </p>
        </div>
        
        <Button onClick={handleDownload} className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Download List</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, skill, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={skillFilter} onValueChange={setSkillFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="All Skills" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Skills</SelectItem>
            {skills.map((skill) => (
              <SelectItem key={skill} value={skill}>
                {skill}
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
            <SelectItem value="Registered">Registered</SelectItem>
            <SelectItem value="Assigned Work">Assigned Work</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {workers.filter(w => w.status === 'Registered').length}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">New Registrations</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
            {workers.filter(w => w.status === 'Assigned Work').length}
          </div>
          <div className="text-sm text-yellow-600 dark:text-yellow-400">Active Workers</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {workers.filter(w => w.status === 'Paid').length}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">Completed</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {workers.length}
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-400">Total Enrolled</div>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWorkers.map((worker, index) => (
          <motion.div
            key={worker.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedWorker(worker);
                    setIsModalOpen(true);
                  }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      {worker.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {worker.age} years • {worker.skill}
                    </p>
                  </div>
                  <Badge className={statusColors[worker.status]}>
                    {worker.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="truncate">{worker.address}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{worker.workHours}</span>
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="text-muted-foreground">Experience:</span>
                  <p className="font-medium">{worker.experience}</p>
                </div>

                {worker.assignedTask && (
                  <div className="pt-2 border-t">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Current Task:</span>
                      <p className="font-medium text-blue-600">{worker.assignedTask}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {worker.status === 'Registered' && (
                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWorker(worker);
                        setIsModalOpen(true);
                      }}
                    >
                      Assign Task
                    </Button>
                  )}
                  {worker.status === 'Assigned Work' && (
                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(worker.id, 'Paid');
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Paid
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Worker Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Worker Profile</DialogTitle>
          </DialogHeader>
          
          {selectedWorker && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedWorker.name}</h3>
                <Badge className={statusColors[selectedWorker.status]}>
                  {selectedWorker.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Age</Label>
                  <p>{selectedWorker.age} years</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Skill</Label>
                  <p>{selectedWorker.skill}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Experience</Label>
                  <p>{selectedWorker.experience}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Work Hours</Label>
                  <p>{selectedWorker.workHours}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Address</Label>
                <p className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {selectedWorker.address}
                </p>
              </div>

              {selectedWorker.assignedTask && (
                <div>
                  <Label className="text-sm font-medium">Current Task</Label>
                  <p className="text-blue-600 font-medium">{selectedWorker.assignedTask}</p>
                </div>
              )}

              {selectedWorker.status === 'Registered' && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Assign Task</Label>
                  <Select onValueChange={(value) => {
                    handleTaskAssignment(selectedWorker.id, value);
                    setIsModalOpen(false);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a task" />
                    </SelectTrigger>
                    <SelectContent>
                      {tasks.map((task) => (
                        <SelectItem key={task} value={task}>
                          {task}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {selectedWorker.status === 'Assigned Work' && (
                  <Button onClick={() => {
                    handleStatusUpdate(selectedWorker.id, 'Paid');
                    setIsModalOpen(false);
                  }}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark as Paid
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