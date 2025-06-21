import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { StateDashboard } from '@/components/Dashboards/StateDashboard';
import { DistrictDashboard } from '@/components/Dashboards/DistrictDashboard';
import { MandalDashboard } from '@/components/Dashboards/MandalDashboard';

export function RoleRouter() {
  const { adminCode, userRole } = useAuth();

  const getDashboardComponent = () => {
    if (!adminCode) return <Navigate to="/login" />;

    switch (userRole) {
      case 'state':
        return <StateDashboard />;
      case 'district':
        return <DistrictDashboard district={adminCode} />;
      case 'mandal':
        return <MandalDashboard mandal={adminCode} />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Routes>
      <Route path="/*" element={getDashboardComponent()} />
    </Routes>
  );
}