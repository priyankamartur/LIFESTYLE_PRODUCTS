import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RouteGuard from './RouteGuard';
import useAuth from '../hooks/useAuth';

// Pages
import Home from '../pages/customer/Home';
import Catalog from '../pages/customer/Catalog';
import ProductDetails from '../pages/customer/ProductDetails';
import Wishlist from '../pages/customer/Wishlist';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import Cart from '../pages/payment/Cart';
import Checkout from '../pages/payment/Checkout';
import Payment from '../pages/payment/Payment';
import Profile from '../pages/profile/Profile';
import OrderSuccess from '../pages/payment/OrderSuccess';
import OrderFailed from '../pages/payment/OrderFailed';
import OrderHistory from '../pages/payment/OrderHistory';
import OrderDetails from '../pages/payment/OrderDetails';
import AdminLayout from '../components/layout/AdminLayout';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboardNew from '../pages/admin/AdminDashboardNew';
import AdminProductList from '../pages/admin/AdminProductList';
import AdminProductAdd from '../pages/admin/AdminProductAdd';
import AdminProductEdit from '../pages/admin/AdminProductEdit';
import AdminProductDelete from '../pages/admin/AdminProductDelete';
import AdminUserList from '../pages/admin/AdminUserList';
import AdminUserEdit from '../pages/admin/AdminUserEdit';
import AnalyticsAdmin from '../pages/admin/AnalyticsAdmin';

export default function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-700 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Root Route: Redirects to Home or Login based on authentication */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
        } 
      />

      {/* Authenticated Customer Pages */}
      <Route 
        path="/home" 
        element={
          <RouteGuard requireAuth>
            <Home />
          </RouteGuard>
        } 
      />
      <Route 
        path="/catalog" 
        element={
          <RouteGuard requireAuth>
            <Catalog />
          </RouteGuard>
        } 
      />
      <Route 
        path="/product/:id" 
        element={
          <RouteGuard requireAuth>
            <ProductDetails />
          </RouteGuard>
        } 
      />

      {/* Guest Only Pages */}
      <Route 
        path="/login" 
        element={
          <RouteGuard guestOnly>
            <Login />
          </RouteGuard>
        } 
      />
      <Route 
        path="/register" 
        element={
          <RouteGuard guestOnly>
            <Register />
          </RouteGuard>
        } 
      />
      <Route 
        path="/forgot-password" 
        element={
          <RouteGuard guestOnly>
            <ForgotPassword />
          </RouteGuard>
        } 
      />
      <Route 
        path="/reset-password" 
        element={
          <RouteGuard guestOnly>
            <ResetPassword />
          </RouteGuard>
        } 
      />

      {/* Authenticated Customer Pages */}
      <Route 
        path="/wishlist" 
        element={
          <RouteGuard requireAuth>
            <Wishlist />
          </RouteGuard>
        } 
      />
      <Route 
        path="/cart" 
        element={
          <RouteGuard requireAuth>
            <Cart />
          </RouteGuard>
        } 
      />
      <Route 
        path="/checkout" 
        element={
          <RouteGuard requireAuth>
            <Checkout />
          </RouteGuard>
        } 
      />
      <Route 
        path="/payment" 
        element={
          <RouteGuard requireAuth>
            <Payment />
          </RouteGuard>
        } 
      />
      <Route 
        path="/order-success" 
        element={
          <RouteGuard requireAuth>
            <OrderSuccess />
          </RouteGuard>
        } 
      />
      <Route 
        path="/order-failed" 
        element={
          <RouteGuard requireAuth>
            <OrderFailed />
          </RouteGuard>
        } 
      />
      <Route 
        path="/orders" 
        element={
          <RouteGuard requireAuth>
            <OrderHistory />
          </RouteGuard>
        } 
      />
      <Route 
        path="/orders/:orderId" 
        element={
          <RouteGuard requireAuth>
            <OrderDetails />
          </RouteGuard>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <RouteGuard requireAuth>
            <Profile />
          </RouteGuard>
        } 
      />

      {/* Admin Pages */}
      <Route 
        path="/admin/login" 
        element={
          <RouteGuard guestOnly>
            <AdminLogin />
          </RouteGuard>
        } 
      />
      <Route 
        path="/admin/dashboard" 
        element={
          <RouteGuard requireAuth requireAdmin>
            <AdminLayout>
              <AdminDashboardNew />
            </AdminLayout>
          </RouteGuard>
        } 
      />
      <Route 
        path="/admin/products" 
        element={
          <RouteGuard requireAuth requireAdmin>
            <AdminLayout>
              <AdminProductList />
            </AdminLayout>
          </RouteGuard>
        } 
      />
      <Route 
        path="/admin/products/add" 
        element={
          <RouteGuard requireAuth requireAdmin>
            <AdminLayout>
              <AdminProductAdd />
            </AdminLayout>
          </RouteGuard>
        } 
      />
      <Route 
        path="/admin/products/edit/:id" 
        element={
          <RouteGuard requireAuth requireAdmin>
            <AdminLayout>
              <AdminProductEdit />
            </AdminLayout>
          </RouteGuard>
        } 
      />
      <Route 
        path="/admin/products/delete/:id" 
        element={
          <RouteGuard requireAuth requireAdmin>
            <AdminLayout>
              <AdminProductDelete />
            </AdminLayout>
          </RouteGuard>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <RouteGuard requireAuth requireAdmin>
            <AdminLayout>
              <AdminUserList />
            </AdminLayout>
          </RouteGuard>
        } 
      />
      <Route 
        path="/admin/users/edit/:id" 
        element={
          <RouteGuard requireAuth requireAdmin>
            <AdminLayout>
              <AdminUserEdit />
            </AdminLayout>
          </RouteGuard>
        } 
      />
      <Route 
        path="/admin/analytics" 
        element={
          <RouteGuard requireAuth requireAdmin>
            <AdminLayout>
              <AnalyticsAdmin />
            </AdminLayout>
          </RouteGuard>
        } 
      />
      <Route 
        path="/admin/analytics/daily" 
        element={
          <RouteGuard requireAuth requireAdmin>
            <AdminLayout>
              <AnalyticsAdmin />
            </AdminLayout>
          </RouteGuard>
        } 
      />
      <Route 
        path="/admin/analytics/monthly" 
        element={
          <RouteGuard requireAuth requireAdmin>
            <AdminLayout>
              <AnalyticsAdmin />
            </AdminLayout>
          </RouteGuard>
        } 
      />
      <Route 
        path="/admin/analytics/yearly" 
        element={
          <RouteGuard requireAuth requireAdmin>
            <AdminLayout>
              <AnalyticsAdmin />
            </AdminLayout>
          </RouteGuard>
        } 
      />
      <Route 
        path="/admin/analytics/overall" 
        element={
          <RouteGuard requireAuth requireAdmin>
            <AdminLayout>
              <AnalyticsAdmin />
            </AdminLayout>
          </RouteGuard>
        } 
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
