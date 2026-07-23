import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// 1. Siguraduhin na naka-import ang ThemeProvider
import { ThemeProvider } from './contexts/ThemeContext'; 
import LoginPage from './pages/LoginPage';
import MainLayout from './components/layout/MainLayout';
import LoadingScreen from './components/ui/LoadingScreen';

// PAGES
import AdminDashboard from './pages/dashboards/AdminDashboard';
import Members from './pages/members/members';
import PastoralStaffs from './pages/members/pastoralStaffs';
import Elders from './pages/members/elders';
import Deacons from './pages/members/deacons';

import Visitors from './pages/visitors/visitors';
import GrowthGroups from './pages/groupsetup/growthgroups';
import Clusters from './pages/groupsetup/clusters';
import Churches from './pages/groupsetup/churches';
import Profiles from './pages/profiles/Profiles';

// Protected Route Component
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const queryClient = new QueryClient();
  
  return (
    // 2. I-wrap ang buong app sa ThemeProvider
    <QueryClientProvider client={queryClient}>
      <ThemeProvider> 
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/profile" element={<Profiles />} />
                  <Route path="/members/all" element={<Members />} />
                  <Route path="/members/pastoral-staff" element={<PastoralStaffs />} />
                  <Route path="/members/elders" element={<Elders />} />
                  <Route path="/members/deacons" element={<Deacons />} />
                  <Route path="/visitors" element={<Visitors />} />
                  <Route path="/group-setup/growth-groups" element={<GrowthGroups />} />
                  <Route path="/group-setup/clusters" element={<Clusters />} />
                  <Route path="/group-setup/churches" element={<Churches />} />
                </Route>
              </Route>
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;