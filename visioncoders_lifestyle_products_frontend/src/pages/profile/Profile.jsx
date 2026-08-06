import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User, ShoppingBag, Lock, Calendar, MapPin, Edit, Phone, Mail, ShieldAlert } from 'lucide-react';
import apiService from '../../services/apiService';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'security'
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Forms setup
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setValue: setProfileValue,
    formState: { errors: profileErrors },
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch: watchPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm();

  const newPasswordVal = watchPassword('newPassword');

  const fetchProfileAndOrders = async () => {
    setLoading(true);
    try {
      const [profileData, ordersData] = await Promise.all([
        apiService.profile.get(),
        apiService.orders.getHistoryStructured()
      ]);

      if (profileData) {
        setProfileValue('firstName', profileData.firstName || '');
        setProfileValue('lastName', profileData.lastName || '');
        setProfileValue('email', profileData.email || '');
        setProfileValue('phoneNumber', profileData.phoneNumber || '');
      }
      setOrders(ordersData || []);
    } catch (err) {
      console.error('Failed to load profile settings:', err);
      toast.error('Failed to load profile settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndOrders();
  }, []);

  const onProfileSubmit = async (data) => {
    setSubmitting(true);
    try {
      await apiService.profile.update(data);
      toast.success('Profile details updated successfully!');
      fetchProfileAndOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to update profile settings.');
    } finally {
      setSubmitting(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setSubmitting(true);
    try {
      await apiService.profile.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      toast.success('Password updated successfully!');
      resetPassword();
    } catch (err) {
      toast.error(err.message || 'Current password may be incorrect.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status).toUpperCase();
    const map = {
      DELIVERED: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      CANCELLED: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      PROCESSING: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      SHIPPED: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      PENDING: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    };
    return map[s] || map.PENDING;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-gray-700 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100">
      <h1 className="text-3xl font-extrabold text-white tracking-tight font-serif-luxury">Account Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="flex flex-col gap-1.5">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-left transition cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-500/20 text-amber-300 border-l-3 border-amber-400'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <ShoppingBag size={16} />
            My Orders
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-left transition cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-amber-500/20 text-amber-300 border-l-3 border-amber-400'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <User size={16} />
            Personal Details
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-left transition cursor-pointer ${
              activeTab === 'security'
                ? 'bg-amber-500/20 text-amber-300 border-l-3 border-amber-400'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Lock size={16} />
            Security & Login
          </button>
        </aside>

        {/* Dynamic tabs details container */}
        <div className="lg:col-span-3 glass border border-white/10 p-8 rounded-3xl shadow-2xl">
          
          {/* Orders History Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white tracking-tight border-b border-white/10 pb-4 font-serif-luxury">
                Order History
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-16 text-gray-500 space-y-3">
                  <ShoppingBag size={36} className="mx-auto opacity-40" />
                  <p className="text-sm font-medium">No order details registered yet.</p>
                </div>
              ) : (
                <div className="border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                  {orders.map((order) => (
                    <div key={order.id} className="transition hover:bg-white/1">
                      {/* Accordion header */}
                      <div
                        onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                        className="flex flex-wrap justify-between items-center gap-4 p-5 cursor-pointer select-none text-sm"
                      >
                        <div className="space-y-1">
                          <div className="font-extrabold text-white">Order #{order.id}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1.5">
                            <Calendar size={13} />
                            {new Date(order.orderDate).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-black text-white text-base">
                            ${order.totalAmount.toFixed(2)}
                          </span>
                          <span className={`badge ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                          <span className="text-xs font-bold text-brand-primary">
                            {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
                          </span>
                        </div>
                      </div>

                      {/* Accordion content */}
                      {expandedOrderId === order.id && (
                        <div className="px-5 pb-5 pt-2 border-t border-dashed border-white/5 bg-slate-900/30 text-sm space-y-4">
                          <div className="flex gap-1.5 text-gray-400 items-start">
                            <MapPin size={15} className="mt-0.5 text-gray-600 flex-shrink-0" />
                            <span>
                              <strong className="text-gray-300">Shipping Address:</strong> {order.shippingAddress}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Items Ordered</h4>
                            <div className="divide-y divide-white/5 border border-white/5 rounded-xl px-4 bg-bg-surface/30">
                              {order.orderItems && order.orderItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center py-2.5 text-sm">
                                  <span className="text-gray-300">
                                    {item.productName || `Product #${item.productId}`} <strong className="text-brand-primary">&times; {item.quantity}</strong>
                                  </span>
                                  <span className="font-semibold text-white">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Settings Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white tracking-tight border-b border-white/5 pb-4">
                Personal Information
              </h2>

              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider" htmlFor="firstName">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="e.g. John"
                      className="w-full px-4 py-2.5 bg-bg-surface border border-white/10 focus:border-brand-primary rounded-xl outline-none text-white text-sm"
                      disabled={submitting}
                      {...registerProfile('firstName')}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider" htmlFor="lastName">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      placeholder="e.g. Doe"
                      className="w-full px-4 py-2.5 bg-bg-surface border border-white/10 focus:border-brand-primary rounded-xl outline-none text-white text-sm"
                      disabled={submitting}
                      {...registerProfile('lastName')}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="john@example.com"
                    className={`w-full px-4 py-2.5 bg-bg-surface border ${
                      profileErrors.email ? 'border-rose-500' : 'border-white/10'
                    } focus:border-brand-primary rounded-xl outline-none text-white text-sm`}
                    disabled={submitting}
                    {...registerProfile('email', { required: 'Email address is required' })}
                  />
                  {profileErrors.email && (
                    <span className="text-xs font-medium text-rose-400">{profileErrors.email.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider" htmlFor="phoneNumber">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    placeholder="+1 555-0100"
                    className="w-full px-4 py-2.5 bg-bg-surface border border-white/10 focus:border-brand-primary rounded-xl outline-none text-white text-sm"
                    disabled={submitting}
                    {...registerProfile('phoneNumber')}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/20 transition duration-200 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Updating...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Password Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white tracking-tight border-b border-white/5 pb-4">
                Update Account Password
              </h2>

              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider" htmlFor="currentPassword">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    className={`w-full px-4 py-2.5 bg-bg-surface border ${
                      passwordErrors.currentPassword ? 'border-rose-500' : 'border-white/10'
                    } focus:border-brand-primary rounded-xl outline-none text-white text-sm`}
                    disabled={submitting}
                    {...registerPassword('currentPassword', { required: 'Current password is required' })}
                  />
                  {passwordErrors.currentPassword && (
                    <span className="text-xs font-medium text-rose-400">{passwordErrors.currentPassword.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider" htmlFor="newPassword">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className={`w-full px-4 py-2.5 bg-bg-surface border ${
                      passwordErrors.newPassword ? 'border-rose-500' : 'border-white/10'
                    } focus:border-brand-primary rounded-xl outline-none text-white text-sm`}
                    disabled={submitting}
                    {...registerPassword('newPassword', {
                      required: 'New password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                  />
                  {passwordErrors.newPassword && (
                    <span className="text-xs font-medium text-rose-400">{passwordErrors.newPassword.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className={`w-full px-4 py-2.5 bg-bg-surface border ${
                      passwordErrors.confirmPassword ? 'border-rose-500' : 'border-white/10'
                    } focus:border-brand-primary rounded-xl outline-none text-white text-sm`}
                    disabled={submitting}
                    {...registerPassword('confirmPassword', {
                      required: 'Please confirm password',
                      validate: (val) => val === newPasswordVal || 'Passwords do not match',
                    })}
                  />
                  {passwordErrors.confirmPassword && (
                    <span className="text-xs font-medium text-rose-400">{passwordErrors.confirmPassword.message}</span>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/20 transition duration-200 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Updating...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
