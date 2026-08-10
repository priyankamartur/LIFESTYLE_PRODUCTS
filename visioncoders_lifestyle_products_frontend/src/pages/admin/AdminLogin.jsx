import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Lock, ShieldAlert } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin, logout } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handlePreset = (username, password) => {
    setValue('username', username);
    setValue('password', password);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setAccessDenied(false);
    try {
      const user = await adminLogin(data.username, data.password);
      if (user && user.roles && user.roles.includes('ROLE_ADMIN')) {
        toast.success(`Admin authenticated successfully!`);
        navigate('/admin/dashboard');
      } else {
        if (logout) {
          await logout();
        }
        setAccessDenied(true);
        toast.error('Access Denied. You are not authorized to access the Admin Portal.');
      }
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('access denied')) {
        setAccessDenied(true);
      }
      toast.error(err.message || 'Invalid username or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full text-gray-100">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-md p-8 rounded-3xl shadow-xl space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert size={26} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h2>
          <p className="text-gray-400 text-sm">Secure Sign In for Administrators</p>
        </div>

        {accessDenied && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl text-rose-400 text-sm space-y-1 text-center">
            <p className="font-bold">Access Denied.</p>
            <p>You are not authorized to access the Admin Portal.</p>
          </div>
        )}

        {/* Quick Admin Presets */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-3.5 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Quick Admin Credentials:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handlePreset('Admin@1', 'Priyanka@admin')}
              className="p-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-left transition cursor-pointer"
            >
              <div className="font-semibold text-white">Admin@1</div>
              <div className="text-[10px] text-gray-400">Priyanka@admin</div>
            </button>
            <button
              type="button"
              onClick={() => handlePreset('admin', 'Admin@123')}
              className="p-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-left transition cursor-pointer"
            >
              <div className="font-semibold text-white">admin</div>
              <div className="text-[10px] text-gray-400">Admin@123</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Admin Username"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none text-white text-sm transition focus:border-amber-500"
              disabled={submitting}
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && (
              <span className="text-xs font-medium text-rose-500">{errors.username.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Admin Password"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none text-white text-sm transition focus:border-amber-500"
              disabled={submitting}
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && (
              <span className="text-xs font-medium text-rose-500">{errors.password.message}</span>
            )}
            <div className="flex justify-end pt-1">
              <Link to="/forgot-password" className="text-xs font-semibold text-gray-400 hover:text-amber-500 transition hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-xl shadow-sm transition duration-200 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <span className="w-5 h-5 border-2 border-gray-950/30 border-t-gray-950 rounded-full animate-spin"></span>
            ) : (
              <>
                <Lock size={16} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-800">
          <Link to="/login" className="text-gray-400 hover:text-white transition">
            &larr; Back to Customer Login
          </Link>
        </div>
      </div>
    </div>
  );
}
