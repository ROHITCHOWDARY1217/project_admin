import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { LoginPage } from '@/components/Auth/LoginPage';
import { RoleRouter } from '@/components/Auth/RoleRouter';
import { AuthProvider } from '@/hooks/useAuth';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import './App.css';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('authToken');
    setIsAuthenticated(!!token); // sets true if token exists
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard/*"
            element={isAuthenticated ? <RoleRouter /> : <Navigate to="/login" />}
          />
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
          />
        </Routes>
      </div>
      <Toaster />
    </Router>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App; // ✅ This is the important line!
