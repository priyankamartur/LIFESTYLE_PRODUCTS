import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { Users, DollarSign, ShoppingCart, ArrowUpRight, ShieldAlert, BarChart2 } from 'lucide-react';
import apiService from '../../services/apiService';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const data = await apiService.admin.getStats();
        setStats(data);
      } catch (err) {
        toast.error('Failed to load dashboard metrics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  // Format chart data based on mock sales
  const salesChartData = [
    { name: 'Jan', Sales: 4000, Orders: 24 },
    { name: 'Feb', Sales: 3000, Orders: 18 },
    { name: 'Mar', Sales: 5000, Orders: 29 },
    { name: 'Apr', Sales: 8000, Orders: 42 },
    { name: 'May', Sales: stats?.totalRevenue ? stats.totalRevenue * 0.7 : 6000, Orders: stats?.totalOrders ? Math.round(stats.totalOrders * 0.6) : 30 },
    { name: 'Jun', Sales: stats?.totalRevenue || 12000, Orders: stats?.totalOrders || 50 }
  ];

  const styles = {
    subbar: 'flex gap-4 border-b border-white/5 pb-4 mb-8',
    subLink: 'px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 transition hover:text-white',
    activeSubLink: 'bg-brand-primary/10 text-brand-primary border-l-2 border-brand-primary',
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-gray-700 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Dashboard</h1>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent rounded-lg text-xs font-semibold uppercase tracking-wider">
          <ShieldAlert size={14} />
          System Manager Access
        </span>
      </div>

      {/* Admin subbar navigation */}
      <div className={styles.subbar}>
        <Link to="/admin/dashboard" className={`${styles.subLink} ${styles.activeSubLink}`}>
          Analytics Overview
        </Link>
        <Link to="/admin/products" className={styles.subLink}>
          Products Management
        </Link>
        <Link to="/admin/users" className={styles.subLink}>
          Users Management
        </Link>
      </div>

      {stats && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sales Revenue */}
            <div className="bg-bg-surface border border-white/5 rounded-2xl p-6 flex items-center justify-between shadow-lg">
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Sales</span>
                <div className="text-3xl font-black text-white">${(stats.totalRevenue || 0).toFixed(2)}</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
                <DollarSign size={22} />
              </div>
            </div>

            {/* Orders count */}
            <div className="bg-bg-surface border border-white/5 rounded-2xl p-6 flex items-center justify-between shadow-lg">
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Count</span>
                <div className="text-3xl font-black text-white">{stats.totalOrders || 0}</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-2xl">
                <ShoppingCart size={22} />
              </div>
            </div>

            {/* Users count */}
            <div className="bg-bg-surface border border-white/5 rounded-2xl p-6 flex items-center justify-between shadow-lg">
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Users</span>
                <div className="text-3xl font-black text-white">{stats.totalUsers || 0}</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-brand-accent/10 border border-brand-accent/20 text-brand-accent rounded-2xl">
                <Users size={22} />
              </div>
            </div>
          </div>

          {/* Visual Charts section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-bg-surface border border-white/5 p-6 rounded-3xl space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart2 size={16} className="text-brand-primary" />
                Revenue Analytics ($)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#131a26', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="Sales" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-bg-surface border border-white/5 p-6 rounded-3xl space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart2 size={16} className="text-brand-accent" />
                Order Volumes Summary
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#131a26', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }} />
                    <Bar dataKey="Orders" fill="#d946ef" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Details Tables Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Orders table */}
            <div className="lg:col-span-2 bg-bg-surface border border-white/5 p-6 rounded-3xl shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Transactions</h3>
                <Link to="/profile" className="text-xs text-brand-primary font-bold hover:underline flex items-center gap-0.5">
                  View Trackings <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-400 font-bold uppercase tracking-wider text-xs">
                      <th className="pb-3">Order</th>
                      <th className="pb-3">User</th>
                      <th className="pb-3">Total Amount</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {stats.recentOrders && stats.recentOrders.map((o) => (
                      <tr key={o.id} className="text-gray-300">
                        <td className="py-3.5 font-bold text-white">#{o.id}</td>
                        <td className="py-3.5">{o.username || `Customer #${o.userId}`}</td>
                        <td className="py-3.5 font-semibold text-white">${o.totalAmount.toFixed(2)}</td>
                        <td className="py-3.5">
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] uppercase font-bold border ${
                            o.status === 'DELIVERED' 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Users listing */}
            <div className="bg-bg-surface border border-white/5 p-6 rounded-3xl shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">New Registrations</h3>
                <Link to="/admin/users" className="text-xs text-brand-primary font-bold hover:underline flex items-center gap-0.5">
                  Manage Directory <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="divide-y divide-white/5">
                {stats.recentUsers && stats.recentUsers.map((u) => {
                  const initialName = (u.firstName ? u.firstName[0] : '') + (u.lastName ? u.lastName[0] : '') || u.username.slice(0, 2).toUpperCase();
                  return (
                    <div key={u.id} className="flex items-center gap-3 py-3">
                      <div className="w-9 h-9 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center font-black text-xs">
                        {initialName}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{u.firstName || u.username} {u.lastName}</div>
                        <div className="text-[11px] text-gray-500 truncate">{u.email}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
