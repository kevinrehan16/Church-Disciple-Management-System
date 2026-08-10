import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// 1. Siguraduhin na naka-import ang ThemeProvider
import { ThemeProvider } from './contexts/ThemeContext'; 
import LoginPage from './pages/LoginPage';
import ChangePasswordPage from './pages/ChangePasswordPage';

import MainLayout from './components/layout/MainLayout';
import LoadingScreen from './components/ui/LoadingScreen';

// PAGES
import AdminDashboard from './pages/dashboards/AdminDashboard';
import Members from './pages/members/members';
import PastoralStaffs from './pages/members/pastoralStaffs';
import Elders from './pages/members/elders';
import Deacons from './pages/members/deacons';

import Visitors from './pages/visitors/visitors';
import DiscipleNetwork from './pages/disciplenetwork/disciplenetwork';
import GrowthGroupsMembers from './pages/groupsmembers/growthgroupsmembers';

import GrowthGroups from './pages/groupsetup/growthgroups';
import Clusters from './pages/groupsetup/clusters';
import Churches from './pages/groupsetup/churches';
import Profiles from './pages/profiles/Profiles';

import Permissions from './pages/permissions/permissions';
import Roles from './pages/roles/roles';
import Users from './pages/users/users';

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
              <Route path="/change-password" element={<ChangePasswordPage />} />
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<AdminDashboard />} />

                  <Route path="/profile/me" element={<Profiles />} />
                  <Route path="/member/:id" element={<Profiles />} />

                  <Route path="/members/all" element={<Members />} />
                  <Route path="/members/pastoral-staff" element={<PastoralStaffs />} />
                  <Route path="/members/elders" element={<Elders />} />
                  <Route path="/members/deacons" element={<Deacons />} />

                  <Route path="/visitors" element={<Visitors />} />

                  <Route path="/disciple-network" element={<DiscipleNetwork />} />

                  <Route path="/groups-members/growth-groups" element={<GrowthGroupsMembers />} />

                  <Route path="/group-setup/churches" element={<Churches />} />
                  <Route path="/group-setup/clusters" element={<Clusters />} />
                  <Route path="/group-setup/growth-groups" element={<GrowthGroups />} />

                  <Route path="/roles" element={<Roles />} />
                  <Route path="/permissions" element={<Permissions />} />
                  <Route path="/users" element={<Users />} />
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