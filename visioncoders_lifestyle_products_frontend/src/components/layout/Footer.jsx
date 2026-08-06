import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#F5EFE6]/80 border-t border-[#EAE1D2] py-12 mt-20 text-[#786C5E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-base font-bold text-gray-900">
              <ShoppingBag size={18} className="text-gray-900" />
              <span>
                Lifestyle <span className="font-light text-gray-500">Products</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              Discover premium skincare, beauty, and lifestyle essentials for everyday wellness. Crafted to combine everyday utility with elevated aesthetic design.
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalog" className="hover:text-gray-900 transition">About Us</Link></li>
              <li><Link to="/catalog" className="hover:text-gray-900 transition">Careers</Link></li>
              <li><Link to="/catalog" className="hover:text-gray-900 transition">Press & News</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalog" className="hover:text-gray-900 transition">Help Center</Link></li>
              <li><Link to="/catalog" className="hover:text-gray-900 transition">Shipping & Returns</Link></li>
              <li><Link to="/catalog" className="hover:text-gray-900 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalog" className="hover:text-gray-900 transition">Privacy Policy</Link></li>
              <li><Link to="/catalog" className="hover:text-gray-900 transition">Terms of Service</Link></li>
              <li><Link to="/catalog" className="hover:text-gray-900 transition">Security Guidelines</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center text-xs space-y-4 md:space-y-0 text-gray-400">
          <span>&copy; {new Date().getFullYear()} Lifestyle Products Inc. All rights reserved.</span>
          <span>Minimalist E-Commerce Platform.</span>
        </div>
      </div>
    </footer>
  );
}
