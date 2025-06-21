import { motion } from 'framer-motion';
import { Calendar, MapPin, Phone, User, MessageSquare, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Complaint } from '@/types';
import { format } from 'date-fns';

interface ComplaintCardProps {
  complaint: Complaint;
  onClick: () => void;
}

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  'Resolved': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
};

const categoryColors = {
  'Water Supply': 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  'Infrastructure': 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
  'Sanitation': 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
  'Roads': 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
};

export function ComplaintCard({ complaint, onClick }: ComplaintCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{complaint.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{complaint.name}</span>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge className={statusColors[complaint.status]}>
                {complaint.status}
              </Badge>
              <Badge variant="outline" className={categoryColors[complaint.category as keyof typeof categoryColors]}>
                {complaint.category}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {complaint.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{complaint.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{complaint.contact}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(complaint.submittedAt), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span>{complaint.submissionMethod}</span>
            </div>
          </div>

          {complaint.assignedTo && (
            <div className="pt-2 border-t">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Assigned to: <strong>{complaint.assignedTo}</strong></span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}