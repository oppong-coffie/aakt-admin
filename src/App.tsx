import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Business from './pages/Business';
import BusinessDetails from './pages/BusinessDetails';
import Support from './pages/Support';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Workloads from './pages/Workloads';
import Onboardings from './pages/Onboardings';

// Redirect to login if token is missing
function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  if (!token) return null;
  return <>{children}</>;
}

// Redirect to dashboard if token exists
function PublicGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  if (token) return null;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Landing & Auth Pages (No Sidebar) */}
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={<PublicGuard><Login /></PublicGuard>} />
      <Route path="/register" element={<PublicGuard><Register /></PublicGuard>} />

      {/* Dashboard Pages (With Sidebar) */}
      <Route
        path="/*"
        element={
          <AuthGuard>
            <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              {/* START:: Sidebar */}
              <Sidebar />
              {/* END:: Sidebar */}

              {/* START:: Main */}
              <main className="flex-1 w-full overflow-x-hidden overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/workloads" element={<Workloads />} />
                  <Route path="/business" element={<Business />} />
                  <Route path="/business/:id" element={<BusinessDetails />} />
                  <Route path="/onboardings" element={<Onboardings />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
              {/* END:: Main */}
            </div>
          </AuthGuard>
        }
      />
    </Routes>
  );
}

export default App;
