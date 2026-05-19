import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Briefcase, Users, HelpCircle, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Business', path: '/business', icon: Briefcase },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Support', path: '/support', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AAKT Admin</h2>
      </div>
      <nav className="mt-4 flex-1">
        <ul className="flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
                  location.pathname === item.path 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
        <ul className="flex flex-col gap-1 px-1 mb-2">
          <li>
            <Link
              to="/settings"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
                location.pathname === '/settings'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </li>
        </ul>
        
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-gray-900 dark:text-white leading-none mb-1">John Doe</span>
              <span className="text-[12px] text-gray-500 dark:text-gray-400 leading-none">Admin</span>
            </div>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors font-medium text-[14px]" title="Log out">
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
