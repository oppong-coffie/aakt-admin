import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Business from './pages/Business';
import Support from './pages/Support';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Workloads from './pages/Workloads';

function App() {
  return (
    <Routes>
      {/* Landing & Auth Pages (No Sidebar) */}
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard Pages (With Sidebar) */}
      <Route
        path="/*"
        element={
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
                <Route path="/users" element={<Users />} />
                <Route path="/support" element={<Support />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
            {/* END:: Main */}
          </div>
        }
      />
    </Routes>
  );
}

export default App;
