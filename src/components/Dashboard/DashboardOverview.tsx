import { motion } from 'framer-motion';
import { StatsCards } from './StatsCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDashboardStats } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';

interface DashboardOverviewProps {
  role?: 'state' | 'district' | 'mandal';
  district?: string;
  mandal?: string;
}

const chartData = [
  { name: 'Mon', complaints: 12, resolved: 8 },
  { name: 'Tue', complaints: 15, resolved: 12 },
  { name: 'Wed', complaints: 8, resolved: 6 },
  { name: 'Thu', complaints: 10, resolved: 9 },
  { name: 'Fri', complaints: 14, resolved: 11 },
  { name: 'Sat', complaints: 6, resolved: 5 },
  { name: 'Sun', complaints: 4, resolved: 3 }
];

const categoryData = [
  { name: 'Water Supply', value: 35, color: '#3b82f6' },
  { name: 'Roads', value: 28, color: '#10b981' },
  { name: 'Sanitation', value: 20, color: '#f59e0b' },
  { name: 'Infrastructure', value: 17, color: '#ef4444' }
];

export function DashboardOverview({ role = 'state', district, mandal }: DashboardOverviewProps) {
  const { t } = useTranslation();

  const getRoleTitle = () => {
    if (role === 'state') return t('dashboard.stateOverview');
    if (role === 'district') return `${t('dashboard.districtOverview')} - ${district?.toUpperCase()}`;
    if (role === 'mandal') return `${t('dashboard.mandalOverview')} - ${mandal?.toUpperCase()}`;
    return t('dashboard.overview');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 md:space-y-6"
    >
      <div>
        <h2 className="text-xl md:text-2xl font-bold">{getRoleTitle()}</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          {t('dashboard.realTimeInsights')}
        </p>
      </div>

      <StatsCards stats={mockDashboardStats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">{t('dashboard.weeklyTrends')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="complaints" fill="#3b82f6" name="Complaints" />
                <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">{t('dashboard.complaintCategories')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  fontSize={12}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}