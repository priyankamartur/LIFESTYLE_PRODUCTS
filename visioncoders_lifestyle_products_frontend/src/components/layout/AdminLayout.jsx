import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, BarChart3, LogOut, ShieldAlert } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function AdminLayout({ children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Products', path: '/admin/products', icon: <ShoppingBag size={18} /> },
    { label: 'Users', path: '/admin/users', icon: <Users size={18} /> },
    { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={18} /> },
  ];

  return (
    <div className="flex w-full min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col justify-between shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <ShieldAlert className="text-amber-500" size={24} />
            <span className="font-bold text-lg tracking-wider text-white">LIFESTYLE ADMIN</span>
          </div>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition duration-200 ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-500 border-l-4 border-amber-500'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Footer info & Logout */}
        <div className="p-6 border-t border-gray-800 space-y-4">
          <div className="text-xs text-gray-500">
            Logged in as <span className="text-gray-300 font-semibold">{user?.username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-900/30 rounded-xl text-sm font-bold transition duration-200 cursor-pointer"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-10 overflow-y-auto w-full">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
