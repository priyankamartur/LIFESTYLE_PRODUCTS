import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogIn } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const user = await login(data.username, data.password);
      toast.success(`Welcome back, ${user.username}!`);
      navigate('/home');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10 px-4">
      <div className="bg-white border border-gray-200/80 w-full max-w-md p-8 rounded-3xl shadow-lg shadow-gray-100 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Sign in to your Lifestyle Products account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="e.g. alice_green"
              className={`w-full px-4 py-3 border ${
                errors.username ? 'border-rose-500' : 'border-gray-200'
              } rounded-xl outline-none text-gray-800 text-sm transition`}
              disabled={submitting}
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && (
              <span className="text-xs font-medium text-rose-500">{errors.username.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className={`w-full px-4 py-3 border ${
                errors.password ? 'border-rose-500' : 'border-gray-200'
              } rounded-xl outline-none text-gray-800 text-sm transition`}
              disabled={submitting}
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && (
              <span className="text-xs font-medium text-rose-500">{errors.password.message}</span>
            )}
            <div className="flex justify-end pt-1">
              <Link to="/forgot-password" className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-sm transition duration-200 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 pt-2 space-y-2">
          <div>
            Don't have an account?{' '}
            <Link to="/register" className="text-gray-900 font-bold hover:underline">
              Register now
            </Link>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <Link to="/admin/login" className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition flex items-center justify-center gap-1">
              <span>Switch to Admin Portal</span> &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
