import { Complaint, Scheme, TrafficIssue, ElderlyWorker, ScamReport, DashboardStats } from '@/types';

export const mockComplaints: Complaint[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    contact: '+91 9876543210',
    location: 'Sector 15, Chandigarh',
    title: 'Water Supply Issue',
    description: 'No water supply for past 3 days in our locality. Multiple households affected.',
    category: 'Water Supply',
    submissionMethod: 'Manual',
    status: 'Pending',
    submittedAt: '2024-12-13T09:30:00Z'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    contact: '+91 8765432109',
    location: 'Civil Lines, Delhi',
    title: 'Streetlight Not Working',
    description: 'Street lights have been non-functional for 2 weeks making the area unsafe at night.',
    category: 'Infrastructure',
    submissionMethod: 'Voice',
    status: 'In Progress',
    submittedAt: '2024-12-12T14:15:00Z',
    assignedTo: 'Municipal Department'
  },
  {
    id: '3',
    name: 'Amit Patel',
    contact: '+91 7654321098',
    location: 'Satellite, Ahmedabad',
    title: 'Garbage Collection Delay',
    description: 'Garbage has not been collected for over a week. Health concerns in the area.',
    category: 'Sanitation',
    submissionMethod: 'Manual',
    status: 'Resolved',
    submittedAt: '2024-12-10T11:20:00Z',
    assignedTo: 'Sanitation Department',
    adminRemarks: 'Issue resolved. Regular collection resumed.'
  },
  {
    id: '4',
    name: 'Sunita Devi',
    contact: '+91 6543210987',
    location: 'Patna City',
    title: 'Road Repair Needed',
    description: 'Major potholes on main road causing traffic issues and vehicle damage.',
    category: 'Roads',
    submissionMethod: 'Voice',
    status: 'Pending',
    submittedAt: '2024-12-13T16:45:00Z'
  }
];

export const mockSchemes: Scheme[] = [
  {
    id: '1',
    name: 'PM Awas Yojana',
    applicantName: 'Ramesh Gupta',
    age: 45,
    gender: 'Male',
    income: 25000,
    eligibilityMatch: true,
    status: 'Under Review',
    appliedAt: '2024-12-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Digital India Initiative',
    applicantName: 'Kavita Singh',
    age: 32,
    gender: 'Female',
    income: 35000,
    eligibilityMatch: true,
    status: 'Approved',
    appliedAt: '2024-11-28T14:30:00Z',
    isNew: true
  },
  {
    id: '3',
    name: 'Skill Development Program',
    applicantName: 'Arjun Yadav',
    age: 28,
    gender: 'Male',
    income: 45000,
    eligibilityMatch: false,
    status: 'Applied',
    appliedAt: '2024-12-05T09:15:00Z'
  }
];

export const mockTrafficIssues: TrafficIssue[] = [
  {
    id: '1',
    location: 'MG Road & Church Street Junction',
    issueType: 'Traffic Light',
    reportDate: '2024-12-13T08:00:00Z',
    userMessage: 'Traffic signal not working since yesterday causing major congestion',
    status: 'Pending'
  },
  {
    id: '2',
    location: 'NH-44, KM 150',
    issueType: 'Pothole',
    reportDate: '2024-12-12T15:30:00Z',
    userMessage: 'Large pothole causing vehicle damage and accidents',
    status: 'Resolved',
    assignedTo: 'Highway Maintenance'
  },
  {
    id: '3',
    location: 'Central Avenue',
    issueType: 'Road Construction',
    reportDate: '2024-12-11T12:00:00Z',
    userMessage: 'Incomplete road construction blocking traffic flow',
    status: 'Pending'
  }
];

export const mockElderlyWorkers: ElderlyWorker[] = [
  {
    id: '1',
    name: 'Lakshmi Devi',
    age: 65,
    skill: 'Tailoring',
    experience: '30 years',
    address: 'Mylapore, Chennai',
    workHours: '4 hours/day',
    status: 'Assigned Work',
    assignedTask: 'School uniform stitching'
  },
  {
    id: '2',
    name: 'Gopal Krishnan',
    age: 68,
    skill: 'Data Entry',
    experience: '5 years',
    address: 'T. Nagar, Chennai',
    workHours: '3 hours/day',
    status: 'Paid'
  },
  {
    id: '3',
    name: 'Kamala Bai',
    age: 62,
    skill: 'Handicrafts',
    experience: '25 years',
    address: 'Bandra, Mumbai',
    workHours: '5 hours/day',
    status: 'Registered'
  }
];

export const mockScamReports: ScamReport[] = [
  {
    id: '1',
    title: 'Fake Government Job Portal',
    description: 'Fraudulent website claiming to provide government jobs for money',
    type: 'Fake Website',
    link: 'fake-gov-jobs.com',
    reportedAt: '2024-12-13T10:00:00Z',
    status: 'Verified',
    isAlertActive: true
  },
  {
    id: '2',
    title: 'Impersonating Income Tax Officer',
    description: 'Person calling citizens claiming to be IT officer and asking for personal details',
    type: 'Phone Scam',
    reportedAt: '2024-12-12T16:20:00Z',
    status: 'Verified'
  },
  {
    id: '3',
    title: 'Fake Subsidy Scheme Email',
    description: 'Email claiming to provide government subsidy in exchange for bank details',
    type: 'Email Fraud',
    reportedAt: '2024-12-11T09:45:00Z',
    status: 'Unverified'
  }
];

export const mockDashboardStats: DashboardStats = {
  complaintsToday: 8,
  activeSchemes: 12,
  registeredElderly: 156,
  scamAlertsThisWeek: 4,
  issuesResolvedThisMonth: 34
};