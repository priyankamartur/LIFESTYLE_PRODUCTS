import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import apiService from '../../services/apiService';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resMessage, setResMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSubmitted(false);
    try {
      const res = await apiService.auth.forgotPassword(data.email);
      setSubmitted(true);
      setResMessage(res.message || 'If that email is registered, a password reset link has been sent.');
      toast.success(res.message || 'Password reset request submitted.');

      // In local development simulation mode, auto-redirect if test token is returned
      if (res && res.token) {
        toast.info('Test Mode: Reset token received! Redirecting to password reset...', { autoClose: 3000 });
        setTimeout(() => {
          navigate(`/reset-password?token=${encodeURIComponent(res.token)}&email=${encodeURIComponent(data.email)}`);
        }, 2000);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to submit password reset request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10 px-4">
      <div className="bg-white border border-gray-200/80 w-full max-w-md p-8 rounded-3xl shadow-lg shadow-gray-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Mail size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Forgot Password</h2>
          <p className="text-gray-500 text-sm">
            Enter your registered email address and we will send you instructions to reset your password.
          </p>
        </div>

        {submitted && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-800 text-sm flex items-start gap-3 shadow-sm">
            <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={18} />
            <div className="space-y-1">
              <p className="font-bold">Request Processed</p>
              <p>{resMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="e.g. alice@example.com"
              className={`w-full px-4 py-3 border ${
                errors.email ? 'border-rose-500' : 'border-gray-200'
              } rounded-xl outline-none text-gray-800 text-sm transition focus:border-amber-500`}
              disabled={submitting}
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            {errors.email && (
              <span className="text-xs font-medium text-rose-500">{errors.email.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-sm transition duration-200 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <Send size={16} />
                Send Reset Link
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 pt-2 border-t border-gray-100">
          Remember your password?{' '}
          <Link to="/login" className="text-gray-900 font-bold hover:underline inline-flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
