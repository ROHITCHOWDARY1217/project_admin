import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, MapPin, Phone, Calendar, MessageSquare, Clock, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Complaint } from '@/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ComplaintModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedComplaint: Complaint) => void;
}

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  'Resolved': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
};

const departments = [
  'Municipal Department',
  'Water Department',
  'Sanitation Department',
  'Highway Maintenance',
  'Electrical Department',
  'Health Department'
];

export function ComplaintModal({ complaint, isOpen, onClose, onUpdate }: ComplaintModalProps) {
  const [status, setStatus] = useState<string>('');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [adminRemarks, setAdminRemarks] = useState<string>('');
  const { toast } = useToast();

  if (!complaint) return null;

  const handleSave = () => {
    const updatedComplaint: Complaint = {
      ...complaint,
      status: (status || complaint.status) as Complaint['status'],
      assignedTo: assignedTo || complaint.assignedTo,
      adminRemarks: adminRemarks || complaint.adminRemarks
    };

    onUpdate(updatedComplaint);
    toast({
      title: "Complaint Updated",
      description: "The complaint has been successfully updated.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Complaint Details</span>
            <Badge className={statusColors[complaint.status]}>
              {complaint.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">{complaint.title}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{complaint.name}</p>
                  <p className="text-sm text-muted-foreground">Complainant</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{complaint.contact}</p>
                  <p className="text-sm text-muted-foreground">Contact</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{complaint.location}</p>
                  <p className="text-sm text-muted-foreground">Location</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{format(new Date(complaint.submittedAt), 'MMM dd, yyyy HH:mm')}</p>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <p className="font-medium mb-1">Description</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {complaint.description}
                </p>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-semibold">Admin Actions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Update Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder={complaint.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assigned">Assign to Department</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger>
                    <SelectValue placeholder={complaint.assignedTo || "Select Department"} />
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="remarks">Admin Remarks</Label>
              <Textarea
                id="remarks"
                placeholder={complaint.adminRemarks || "Add remarks or notes..."}
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                rows={3}
              />
            </div>

            {complaint.adminRemarks && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Previous Remarks</span>
                </div>
                <p className="text-sm">{complaint.adminRemarks}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}