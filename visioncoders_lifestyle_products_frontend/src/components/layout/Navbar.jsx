import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Search, Heart, ShoppingBag, ShieldAlert } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount, clearCart } = useCart();
  const { wishlistCount, clearWishlist } = useWishlist();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    clearCart();
    clearWishlist();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F17]/80 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Navigation: Catalog Links */}
          <div className="flex items-center space-x-8 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <Link
              to="/home"
              className={`hover:text-white transition duration-200 ${
                location.pathname === '/home' ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/catalog"
              className={`hover:text-white transition duration-200 ${
                location.pathname === '/catalog' ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : ''
              }`}
            >
              Shop
            </Link>
            {isAdmin ? (
              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition duration-200 ${
                  location.pathname.startsWith('/admin') ? 'border-b-2 border-amber-400 pb-1' : ''
                }`}
              >
                <LayoutDashboard size={13} />
                Admin Dashboard
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className={`flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition duration-200 ${
                  location.pathname.startsWith('/admin') ? 'border-b-2 border-amber-400 pb-1' : ''
                }`}
              >
                <ShieldAlert size={13} />
                Admin Portal
              </Link>
            )}
          </div>

          {/* Centered Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
            <Link to="/home" className="text-xl font-bold tracking-[0.25em] gold-gradient-text hover:opacity-85 transition">
              <span className="font-serif-luxury font-medium">LIFESTYLE PRODUCTS</span>
            </Link>
          </div>

          {/* Right Actions: Icons */}
          <div className="flex items-center gap-4.5 text-slate-300">
            {/* Search link */}
            <Link to="/catalog" className="p-2 hover:text-amber-400 transition" title="Search">
              <Search size={18} strokeWidth={1.5} />
            </Link>

            {/* Wishlist Link */}
            <Link to="/wishlist" className="relative p-2 hover:text-amber-400 transition" title="Wishlist">
              <Heart size={18} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-0.5 bg-rose-500 text-white font-extrabold rounded-full text-[8px] w-4.5 h-4.5 flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Trigger */}
            <Link to="/cart" className="relative p-2 hover:text-amber-400 transition" aria-label="Cart">
              <ShoppingCart size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-0.5 bg-amber-500 text-slate-950 font-extrabold rounded-full text-[8px] w-4.5 h-4.5 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900/80 border border-white/10 rounded-xl hover:bg-slate-800 text-xs font-semibold text-slate-200 transition duration-200 cursor-pointer"
                >
                  <User size={12} className="text-amber-400" />
                  <span>{user.username}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#111827] border border-white/15 rounded-2xl shadow-xl py-2 animate-fadeIn z-50">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
                    >
                      <User size={14} className="text-slate-400" />
                      <span>Personal Details</span>
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
                    >
                      <ShoppingBag size={14} className="text-slate-400" />
                      <span>My Orders</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-amber-400 hover:bg-slate-800 transition"
                      >
                        <LayoutDashboard size={14} className="text-amber-400" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <hr className="border-white/10 my-1" />
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition text-left cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-xs font-bold text-slate-200 hover:text-amber-400 transition bg-white/5 border border-white/10 rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to="/admin/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-1.5"
                >
                  <ShieldAlert size={13} />
                  Admin Portal
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
