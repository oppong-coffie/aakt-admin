import { Navigate, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { ToastProvider } from './components/Toast';
import Dashboard from './pages/Dashboard';
import Business from './pages/Business';
import BusinessDetails from './pages/BusinessDetails';
import Users from './pages/Users';
import Admins from './pages/Admins';
import Login from './pages/Login';
import Onboardings from './pages/Onboardings';
import Portfolio from './pages/Portfolio';
import Folders from './pages/Folders';
import BusinessItems from './pages/BusinessItems';
import BusinessDocuments from './pages/BusinessDocuments';

function AdminGuard({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('auth_token');
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  if (!token || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function PublicGuard({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('auth_token');
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  if (token && isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <ToastProvider>
      <Routes>
        {/* Admin auth page (No Sidebar) */}
        <Route path="/login" element={<PublicGuard><Login /></PublicGuard>} />

        {/* Admin pages (With Sidebar) */}
        <Route
          path="/*"
          element={
            <AdminGuard>
              <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                {/* START:: Sidebar */}
                <Sidebar />
                {/* END:: Sidebar */}

                {/* START:: Main */}
                <main className="flex-1 w-full overflow-x-hidden overflow-y-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/business" element={<Business />} />
                    <Route path="/projects" element={<Portfolio />} />
                    <Route path="/folders" element={<Folders />} />
                    <Route path="/business-items" element={<BusinessItems />} />
                    <Route path="/business-documents" element={<BusinessDocuments />} />
                    <Route path="/business/:id" element={<BusinessDetails />} />
                    <Route path="/onboardings" element={<Onboardings />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/admins" element={<Admins />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                {/* END:: Main */}
              </div>
            </AdminGuard>
          }
        />
      </Routes>
    </ToastProvider>
  );
}

export default App;
