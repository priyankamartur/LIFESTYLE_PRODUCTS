import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { XCircle, ShoppingCart, RefreshCw } from 'lucide-react';

export default function OrderFailed() {
  const location = useLocation();
  const state = location.state || {};
  const { amount } = state;

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-[#F6F2EC]">
      <div className="bg-white border border-gray-150 w-full max-w-lg p-8 md:p-10 rounded-[24px] shadow-sm text-center space-y-8 animate-fadeIn">
        
        {/* Error Header */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center shadow-inner">
            <XCircle size={36} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-medium font-serif-luxury text-gray-900 tracking-tight">
            Payment Failed
          </h1>
          <p className="text-sm text-gray-500 max-w-sm">
            We were unable to process your payment transaction. Please verify your payment details or try again with a different payment method.
          </p>
        </div>

        {/* Action Links */}
        <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
          <Link
            to="/cart"
            className="flex items-center justify-center gap-1.5 px-6 py-3.5 border border-gray-200 hover:border-gray-900 rounded-full text-xs font-bold uppercase tracking-widest text-gray-700 hover:text-gray-950 transition duration-300"
          >
            <ShoppingCart size={13} />
            <span>Go Back to Cart</span>
          </Link>
          <Link
            to="/checkout"
            className="flex items-center justify-center gap-1.5 px-6 py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-xs font-bold uppercase tracking-widest transition duration-300 shadow-sm"
          >
            <RefreshCw size={13} />
            <span>Retry Payment</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
