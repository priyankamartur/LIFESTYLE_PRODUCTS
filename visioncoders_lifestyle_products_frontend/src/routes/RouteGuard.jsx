import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function RouteGuard({ children, requireAuth = false, requireAdmin = false, guestOnly = false }) {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // If auth is loading, render a placeholder page
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-700 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Admin login route handling: allow access if user is not an admin (so customer can sign in as admin)
  if (location.pathname === '/admin/login') {
    if (isAuthenticated && isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return children;
  }

  if (guestOnly && isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin/dashboard" : "/home"} replace />;
  }

  if (requireAuth && !isAuthenticated) {
    const isTargetingAdmin = location.pathname.startsWith('/admin');
    return <Navigate to={isTargetingAdmin ? "/admin/login" : "/login"} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
