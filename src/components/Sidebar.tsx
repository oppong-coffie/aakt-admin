import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Briefcase, Users, HelpCircle, Settings, LogOut, CheckSquare, UserPlus, FolderOpen, FileText } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  
  // Get user info from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const userName = user?.fullName || user?.name || localStorage.getItem('user_email') || 'User';
  const userEmail = user?.email || localStorage.getItem('user_email') || '';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    ...(isAdmin ? [
      { name: 'Admin Workloads', path: '/workloads', icon: CheckSquare },
      { name: 'Business', path: '/business', icon: Briefcase },
      { name: 'Onboardings', path: '/onboardings', icon: UserPlus },
      { name: 'Users', path: '/users', icon: Users },
    ] : []),
    { name: 'My Workloads', path: '/my-workloads', icon: CheckSquare },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Support', path: '/support', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen flex flex-col">
      <div className="p-3 text-start">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">AAKT</h2>
      </div>
      <nav className="mt-1 flex-1">
        <ul className="flex flex-col px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-[13px] font-medium transition-colors ${location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
              >
                <item.icon className="w-3 h-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 dark:border-gray-700 flex flex-col gap-2">
        <ul className="flex flex-col gap-1 px-1 mb-2">
          <li>
            <Link
              to="/settings"
              className={`flex items-center gap-3 px-3 rounded-xl text-[13px] font-medium transition-colors ${location.pathname === '/settings'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
            >
              <Settings className="w-3 h-3" />
              Settings
            </Link>
          </li>
        </ul>

        <div className="px-3 py-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {userInitials}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {userName}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {userEmail || (isAdmin ? 'Administrator' : 'User')}
              </span>
            </div>
          </div>
        </div>
        <ul className="flex flex-col gap-1 px-1">
          <li>
            <button
              onClick={() => {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('is_admin');
                localStorage.removeItem('user_role');
                window.location.href = '/landing';
              }}
              className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-[13px] font-medium transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <LogOut className="w-3 h-3" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
