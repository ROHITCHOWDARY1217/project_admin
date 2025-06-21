export interface Complaint {
  id: string;
  name: string;
  contact: string;
  location: string;
  title: string;
  description: string;
  category: string;
  submissionMethod: 'Manual' | 'Voice';
  status: 'Pending' | 'In Progress' | 'Resolved';
  submittedAt: string;
  assignedTo?: string;
  adminRemarks?: string;
}

export interface Scheme {
  id: string;
  name: string;
  applicantName: string;
  age: number;
  gender: string;
  income: number;
  eligibilityMatch: boolean;
  status: 'Applied' | 'Under Review' | 'Approved' | 'Rejected';
  appliedAt: string;
  isNew?: boolean;
  // Extended fields for new scheme applications
  address?: string;
  phoneNumber?: string;
  email?: string;
  documents?: string;
  description?: string;
  // Administrative scheme metadata (for scheme creation)
  schemeCode?: string;
  category?: string;
  objectives?: string;
  eligibilityCriteria?: string;
  targetBeneficiaries?: string;
  budgetAllocation?: string;
  maxIncomeLimit?: string;
  ageLimit?: string;
  launchDate?: string;
  applicationDeadline?: string;
  implementingDepartment?: string;
  contactDetails?: string;
  requiredDocuments?: string;
  benefits?: string;
}

export interface TrafficIssue {
  id: string;
  location: string;
  issueType: string;
  reportDate: string;
  userMessage: string;
  image?: string;
  status: 'Pending' | 'Resolved';
  assignedTo?: string;
}

export interface ElderlyWorker {
  id: string;
  name: string;
  age: number;
  skill: string;
  experience: string;
  address: string;
  workHours: string;
  status: 'Registered' | 'Assigned Work' | 'Paid';
  assignedTask?: string;
}

export interface ScamReport {
  id: string;
  title: string;
  description: string;
  type: 'Fake Agent' | 'Fake Website' | 'Phone Scam' | 'Email Fraud';
  link?: string;
  image?: string;
  reportedAt: string;
  status: 'Verified' | 'Unverified' | 'False Report';
  isAlertActive?: boolean;
}

export interface DashboardStats {
  complaintsToday: number;
  activeSchemes: number;
  registeredElderly: number;
  scamAlertsThisWeek: number;
  issuesResolvedThisMonth: number;
}