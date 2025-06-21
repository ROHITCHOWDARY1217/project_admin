import { motion } from 'framer-motion';
import { AlertTriangle, Megaphone, Users, Shield, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types';
import { useTranslation } from 'react-i18next';

interface StatsCardsProps {
  stats: DashboardStats;
}

const statItems = [
  {
    titleKey: 'stats.complaintsToday',
    key: 'complaintsToday' as keyof DashboardStats,
    icon: AlertTriangle,
    color: 'text-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-900/20'
  },
  {
    titleKey: 'stats.activeSchemes',
    key: 'activeSchemes' as keyof DashboardStats,
    icon: Megaphone,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    titleKey: 'stats.registeredElderly',
    key: 'registeredElderly' as keyof DashboardStats,
    icon: Users,
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-900/20'
  },
  {
    titleKey: 'stats.scamAlertsWeek',
    key: 'scamAlertsThisWeek' as keyof DashboardStats,
    icon: Shield,
    color: 'text-red-600',
    bg: 'bg-red-50 dark:bg-red-900/20'
  },
  {
    titleKey: 'stats.issuesResolvedMonth',
    key: 'issuesResolvedThisMonth' as keyof DashboardStats,
    icon: CheckCircle,
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20'
  }
];

export function StatsCards({ stats }: StatsCardsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t(item.titleKey)}
                </CardTitle>
                <div className={`p-2 rounded-lg ${item.bg}`}>
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <motion.div
                  className="text-2xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {stats[item.key]}
                </motion.div>
                <p className="text-xs text-muted-foreground mt-1">
                  {index < 2 ? '+12% from yesterday' : '+8% from last period'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}