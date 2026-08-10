import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserPlus, ArrowLeft, Shield, Mail, Lock, User, Phone, CheckCircle, ShieldAlert } from 'lucide-react';
import apiService from '../../services/apiService';

export default function AdminUserAdd() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    isAdmin: true,
    enabled: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error('Please fill in all required fields (Username, Email, Password).');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const roles = ['ROLE_USER'];
      if (formData.isAdmin) {
        roles.push('ROLE_ADMIN');
      }

      await apiService.admin.createUser({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim() || null,
        lastName: formData.lastName.trim() || null,
        phoneNumber: formData.phoneNumber.trim() || null,
        enabled: formData.enabled,
        roles: roles,
      });

      toast.success(`User "${formData.username}" created successfully!`);
      navigate('/admin/users');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create user account.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn text-gray-100 pb-12">
      {/* Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-amber-400 transition mb-2"
          >
            <ArrowLeft size={14} /> Back to Member Directory
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <UserPlus className="text-amber-500" size={28} />
            Create New Account / Admin
          </h1>
          <p className="text-gray-400 text-sm">Register a new administrator or customer profile directly</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Section: Credentials */}
          <div className="border-b border-gray-800 pb-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
              <Shield size={16} /> Login Credentials
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Username <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="e.g. admin_john"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-xl outline-none text-white text-sm transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. john@lifestyle.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-xl outline-none text-white text-sm transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-xl outline-none text-white text-sm transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Personal Information */}
          <div className="border-b border-gray-800 pb-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
              <User size={16} /> Profile Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* First Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. John"
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl outline-none text-white text-sm transition focus:border-amber-500"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Doe"
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl outline-none text-white text-sm transition focus:border-amber-500"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                    <Phone size={16} />
                  </span>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="e.g. +91 9876543210"
                    className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-xl outline-none text-white text-sm transition focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Roles & Access Permissions */}
          <div className="space-y-4 pb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
              <ShieldAlert size={16} /> Access Privileges & Status
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Admin Checkbox Card */}
              <label
                className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition ${
                  formData.isAdmin
                    ? 'bg-amber-500/10 border-amber-500/50 text-white'
                    : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className={formData.isAdmin ? 'text-amber-400' : 'text-gray-500'} />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-white">Administrator Role</div>
                    <div className="text-[11px] text-gray-400">Grants full access to manage products, users & analytics</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={formData.isAdmin}
                  onChange={handleChange}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              {/* Status Toggle Card */}
              <label
                className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition ${
                  formData.enabled
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                    : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className={formData.enabled ? 'text-emerald-400' : 'text-gray-500'} />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-white">Account Enabled</div>
                    <div className="text-[11px] text-gray-400">Allow this user to sign in immediately</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  name="enabled"
                  checked={formData.enabled}
                  onChange={handleChange}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-800">
            <Link
              to="/admin/users"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl text-xs uppercase tracking-wider transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus size={16} /> Create User Account
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
