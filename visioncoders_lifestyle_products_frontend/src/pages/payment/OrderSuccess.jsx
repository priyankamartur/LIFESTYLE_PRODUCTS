import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export default function OrderSuccess() {
  const location = useLocation();
  const state = location.state;

  if (!state || !state.orderId || !state.paymentId) {
    return <Navigate to="/home" replace />;
  }

  const { orderId, paymentId, amount, paymentStatus } = state;

  // Calculate delivery date (4 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-[#F6F2EC]">
      <div className="bg-white border border-gray-150 w-full max-w-xl p-8 md:p-10 rounded-[24px] shadow-sm text-center space-y-8 animate-fadeIn">
        
        {/* Success Icon Header */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
            <CheckCircle size={36} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-medium font-serif-luxury text-gray-900 tracking-tight">
            Payment Successful
          </h1>
          <p className="text-sm text-gray-500 max-w-md">
            Thank you for your order! Your payment has been verified, and we have begun preparing your package.
          </p>
        </div>

        {/* Transaction Summary Table */}
        <div className="border border-gray-150 rounded-[20px] overflow-hidden bg-gray-50/50 p-6 text-left space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#C9A66B] border-b border-gray-150 pb-2.5">
            Order Receipt Summary
          </h3>
          
          <div className="grid grid-cols-2 gap-y-3.5 text-xs text-gray-500 font-medium">
            <span className="text-gray-400">Order Reference ID</span>
            <span className="text-gray-900 font-serif-luxury text-right font-bold">#{orderId}</span>
            
            <span className="text-gray-400">Razorpay Payment ID</span>
            <span className="text-gray-900 font-mono text-right text-[10px] break-all">{paymentId}</span>
            
            <span className="text-gray-400">Amount Charged</span>
            <span className="text-gray-900 font-serif-luxury text-right font-bold">{formatCurrency(amount || 0)}</span>
            
            <span className="text-gray-400">Transaction Status</span>
            <span className="text-emerald-600 font-bold uppercase tracking-wider text-right">{paymentStatus || 'SUCCESS'}</span>

            <div className="col-span-2 border-t border-gray-150 pt-3 flex flex-col gap-1 text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estimated Delivery</span>
              <span className="text-gray-900 text-sm font-semibold">{formattedDeliveryDate}</span>
            </div>
          </div>
        </div>

        {/* Action Button Links */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/profile"
            className="flex items-center justify-center gap-1.5 px-6 py-3 border border-gray-200 hover:border-gray-900 rounded-full text-xs font-bold uppercase tracking-widest text-gray-700 hover:text-gray-950 transition duration-300"
          >
            <span>View Order History</span>
          </Link>
          <Link
            to="/catalog"
            className="flex items-center justify-center gap-1.5 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-xs font-bold uppercase tracking-widest transition duration-300 shadow-sm"
          >
            <ShoppingBag size={13} />
            <span>Continue Shopping</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
