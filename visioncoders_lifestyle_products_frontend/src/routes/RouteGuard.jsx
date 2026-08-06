import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function RouteGuard({ children, requireAuth = false, requireAdmin = false, guestOnly = false }) {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // If auth is loading, render a placeholder page
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-700 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (guestOnly && isAuthenticated) {
    return <Navigate to={isAdminRoute ? "/admin/dashboard" : "/home"} replace />;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={isAdminRoute ? "/admin/login" : "/login"} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
