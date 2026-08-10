import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#090D16]/90 border-t border-white/10 py-12 mt-20 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-base font-bold text-slate-100">
              <ShoppingBag size={18} className="text-amber-400" />
              <span>
                Lifestyle <span className="font-light text-amber-400">Products</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Discover premium skincare, beauty, and lifestyle essentials for everyday wellness. Crafted to combine everyday utility with elevated aesthetic design.
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalog" className="hover:text-amber-400 transition">About Us</Link></li>
              <li><Link to="/catalog" className="hover:text-amber-400 transition">Careers</Link></li>
              <li><Link to="/admin/login" className="text-amber-400 hover:text-amber-300 font-semibold transition">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalog" className="hover:text-amber-400 transition">Help Center</Link></li>
              <li><Link to="/catalog" className="hover:text-amber-400 transition">Shipping & Returns</Link></li>
              <li><Link to="/catalog" className="hover:text-amber-400 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalog" className="hover:text-amber-400 transition">Privacy Policy</Link></li>
              <li><Link to="/catalog" className="hover:text-amber-400 transition">Terms of Service</Link></li>
              <li><Link to="/catalog" className="hover:text-amber-400 transition">Security Guidelines</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs space-y-4 md:space-y-0 text-slate-500">
          <span>&copy; {new Date().getFullYear()} Lifestyle Products Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>Minimalist E-Commerce Platform.</span>
            <span>&bull;</span>
            <Link to="/admin/login" className="text-amber-400 hover:underline font-semibold">Admin Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
