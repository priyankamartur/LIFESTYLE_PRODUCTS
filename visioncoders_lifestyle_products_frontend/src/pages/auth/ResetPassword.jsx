import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Lock, KeyRound, CheckCircle, ArrowLeft } from 'lucide-react';
import apiService from '../../services/apiService';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const tokenParam = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: emailParam,
      token: tokenParam,
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (emailParam) setValue('email', emailParam);
    if (tokenParam) setValue('token', tokenParam);
  }, [emailParam, tokenParam, setValue]);

  const newPasswordVal = watch('newPassword');

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await apiService.auth.resetPassword(data.email, data.token, data.newPassword);
      setResetSuccess(true);
      toast.success(res.message || 'Password reset successfully.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to reset password. Token may be invalid or expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10 px-4">
      <div className="bg-white border border-gray-200/80 w-full max-w-md p-8 rounded-3xl shadow-lg shadow-gray-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <KeyRound size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Reset Password</h2>
          <p className="text-gray-500 text-sm">
            Please enter your new password below to regain access to your account.
          </p>
        </div>

        {resetSuccess ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-emerald-900">Password reset successfully.</h3>
              <p className="text-xs text-emerald-700">You can now use your new password to sign in to your account.</p>
            </div>
            <Link
              to="/login"
              className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition"
            >
              Go to Login Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email field (read-only or editable if not passed) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider" htmlFor="email">
                Registered Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Your email address"
                className={`w-full px-4 py-3 border ${
                  errors.email ? 'border-rose-500' : 'border-gray-200'
                } rounded-xl outline-none text-gray-800 text-sm transition focus:border-amber-500 bg-gray-50`}
                disabled={submitting || !!emailParam}
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && (
                <span className="text-xs font-medium text-rose-500">{errors.email.message}</span>
              )}
            </div>

            {/* Token Field (hidden if passed, or shown if missing) */}
            {!tokenParam && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider" htmlFor="token">
                  Reset Token
                </label>
                <input
                  type="text"
                  id="token"
                  placeholder="Paste reset token from email/console"
                  className={`w-full px-4 py-3 border ${
                    errors.token ? 'border-rose-500' : 'border-gray-200'
                  } rounded-xl outline-none text-gray-800 text-sm transition focus:border-amber-500`}
                  disabled={submitting}
                  {...register('token', { required: 'Reset token is required' })}
                />
                {errors.token && (
                  <span className="text-xs font-medium text-rose-500">{errors.token.message}</span>
                )}
              </div>
            )}
            {tokenParam && <input type="hidden" {...register('token')} value={tokenParam} />}

            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider" htmlFor="newPassword">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter new password (min 6 chars)"
                className={`w-full px-4 py-3 border ${
                  errors.newPassword ? 'border-rose-500' : 'border-gray-200'
                } rounded-xl outline-none text-gray-800 text-sm transition focus:border-amber-500`}
                disabled={submitting}
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.newPassword && (
                <span className="text-xs font-medium text-rose-500">{errors.newPassword.message}</span>
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
                placeholder="Confirm your new password"
                className={`w-full px-4 py-3 border ${
                  errors.confirmPassword ? 'border-rose-500' : 'border-gray-200'
                } rounded-xl outline-none text-gray-800 text-sm transition focus:border-amber-500`}
                disabled={submitting}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === newPasswordVal || 'Passwords do not match',
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
                  <Lock size={16} />
                  Reset Password
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center text-sm text-gray-500 pt-2 border-t border-gray-100">
          Remembered your password?{' '}
          <Link to="/login" className="text-gray-900 font-bold hover:underline inline-flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
