import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Breadcrumbs from './components/common/Breadcrumbs';
import ChatbotWidget from './components/common/Chatbot/ChatbotWidget';

// Routes
import AppRoutes from './routes/AppRoutes';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex w-full">
        <AppRoutes />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen text-slate-100 w-full relative">
      <Navbar />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs />
        <AppRoutes />
      </main>

      <Footer />
      <ChatbotWidget />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <AppContent />
            
            {/* React Toastify Notifications config */}
            <ToastContainer 
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
