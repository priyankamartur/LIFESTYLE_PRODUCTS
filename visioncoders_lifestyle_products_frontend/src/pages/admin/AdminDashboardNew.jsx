import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Users, DollarSign, ShoppingCart, TrendingUp, ShieldCheck } from 'lucide-react';
import apiService from '../../services/apiService';

export default function AdminDashboardNew() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-3 border-gray-700 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn text-gray-100">
      {/* Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Dashboard</h1>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck size={14} />
          System Manager Access
        </span>
      </div>

      {stats && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sales Revenue */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center justify-between shadow-lg">
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Sales</span>
                <div className="text-3xl font-black text-white">${(stats.totalRevenue || 0).toFixed(2)}</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
                <DollarSign size={22} />
              </div>
            </div>

            {/* Orders count */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center justify-between shadow-lg">
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Count</span>
                <div className="text-3xl font-black text-white">{stats.totalOrders || 0}</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl">
                <ShoppingCart size={22} />
              </div>
            </div>

            {/* User count */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center justify-between shadow-lg">
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Registered Users</span>
                <div className="text-3xl font-black text-white">{stats.totalUsers || 0}</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl">
                <Users size={22} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white tracking-tight">Recent Transactions</h3>
                <Link to="/admin/analytics/overall" className="text-xs font-bold uppercase tracking-widest text-amber-500 hover:underline flex items-center gap-0.5">
                  View Analytics <TrendingUp size={13} />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="text-xs font-bold text-gray-500 uppercase border-b border-gray-800">
                    <tr>
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {stats.recentOrders && stats.recentOrders.length > 0 ? (
                      stats.recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-850 transition">
                          <td className="py-3.5 font-semibold text-white">#{order.id}</td>
                          <td className="py-3.5 text-xs">
                            {new Date(order.orderDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="py-3.5 font-bold text-white">${(order.totalAmount || 0).toFixed(2)}</td>
                          <td className="py-3.5 text-right">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.status === 'CONFIRMED' || order.status === 'DELIVERED'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : order.status === 'CANCELLED'
                                ? 'bg-rose-500/10 text-rose-400'
                                : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-gray-500">
                          No recent transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white tracking-tight">New Member Registrations</h3>
                <Link to="/admin/users" className="text-xs font-bold uppercase tracking-widest text-amber-500 hover:underline">
                  Manage Users
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="text-xs font-bold text-gray-500 uppercase border-b border-gray-800">
                    <tr>
                      <th className="pb-3">Username</th>
                      <th className="pb-3">Email Address</th>
                      <th className="pb-3 text-right">Access Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {stats.recentUsers && stats.recentUsers.length > 0 ? (
                      stats.recentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-850 transition">
                          <td className="py-3.5 font-semibold text-white">{user.username}</td>
                          <td className="py-3.5 text-xs">{user.email}</td>
                          <td className="py-3.5 text-right">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              user.roles && user.roles.includes('ROLE_ADMIN')
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-gray-800 text-gray-400'
                            }`}>
                              {user.roles && user.roles.includes('ROLE_ADMIN') ? 'Admin' : 'Customer'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="py-8 text-center text-gray-500">
                          No recent members registered.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
