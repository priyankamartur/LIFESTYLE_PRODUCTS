import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserPlus } from 'lucide-react';
import apiService from '../../services/apiService';

export default function Register() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await apiService.auth.signup({
        username: data.username,
        email: data.email,
        password: data.password,
        role: 'CUSTOMER',
        roles: ['ROLE_USER'],
      });
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Username or email may already be taken.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <div className="bg-white border border-gray-200/80 w-full max-w-md p-8 rounded-3xl shadow-lg shadow-gray-100 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Create Account</h2>
          <p className="text-gray-500 text-sm">Join Lifestyle Products and discover premium products</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="e.g. johndoe"
              className={`w-full px-4 py-2.5 border ${
                errors.username ? 'border-rose-500' : 'border-gray-200'
              } rounded-xl outline-none text-gray-800 text-sm transition`}
              disabled={submitting}
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Must be at least 3 characters' },
              })}
            />
            {errors.username && (
              <span className="text-xs font-medium text-rose-500">{errors.username.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="e.g. john@example.com"
              className={`w-full px-4 py-2.5 border ${
                errors.email ? 'border-rose-500' : 'border-gray-200'
              } rounded-xl outline-none text-gray-800 text-sm transition`}
              disabled={submitting}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <span className="text-xs font-medium text-rose-500">{errors.email.message}</span>
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
              placeholder="At least 6 characters"
              className={`w-full px-4 py-2.5 border ${
                errors.password ? 'border-rose-500' : 'border-gray-200'
              } rounded-xl outline-none text-gray-800 text-sm transition`}
              disabled={submitting}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            {errors.password && (
              <span className="text-xs font-medium text-rose-500">{errors.password.message}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Re-enter password"
              className={`w-full px-4 py-2.5 border ${
                errors.confirmPassword ? 'border-rose-500' : 'border-gray-200'
              } rounded-xl outline-none text-gray-800 text-sm transition`}
              disabled={submitting}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === passwordVal || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <span className="text-xs font-medium text-rose-500">{errors.confirmPassword.message}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-sm transition duration-200 cursor-pointer disabled:opacity-50 mt-2"
          >
            {submitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <UserPlus size={16} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-gray-900 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
