import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, MapPin, CreditCard, Clock, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/formatCurrency';

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.orders.getDetails(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order details:', err);
        setError(err.message || 'Could not retrieve details for this order.');
        toast.error('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const getStatusBadge = (status) => {
    const s = String(status).toUpperCase();
    const map = {
      DELIVERED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      SHIPPED: 'bg-purple-50 text-purple-800 border-purple-200',
      PROCESSING: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      PENDING: 'bg-amber-50 text-amber-800 border-amber-200',
      CANCELLED: 'bg-rose-50 text-rose-800 border-rose-200',
    };
    return map[s] || 'bg-gray-50 text-gray-800 border-gray-200';
  };

  const getPaymentStatus = (status) => {
    const s = String(status).toUpperCase();
    if (s === 'PROCESSING' || s === 'SHIPPED' || s === 'DELIVERED') {
      return { label: 'PAID', style: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    }
    if (s === 'PENDING') {
      return { label: 'PENDING', style: 'bg-amber-50 text-amber-800 border-amber-200' };
    }
    return { label: 'FAILED / CANCELLED', style: 'bg-rose-50 text-rose-800 border-rose-200' };
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="h-8 w-64 bg-gray-200 rounded"></div>
        <div className="bg-white border border-gray-150 rounded-[24px] p-6 h-60"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 flex flex-col items-center justify-center text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 flex items-center justify-center bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 shadow-sm">
          <AlertCircle size={32} />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-xl font-bold text-gray-900 font-serif-luxury">Order Not Found</h2>
          <p className="text-sm text-gray-500">{error || 'The details for this order could not be loaded.'}</p>
        </div>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-full text-xs uppercase tracking-widest transition cursor-pointer shadow-sm"
        >
          <ChevronLeft size={14} />
          <span>Back to Orders</span>
        </Link>
      </div>
    );
  }

  const payStatus = getPaymentStatus(order.status);

  return (
    <div className="space-y-6 animate-fadeIn py-6 max-w-4xl mx-auto px-4">
      {/* Back to Orders Link */}
      <Link to="/orders" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-950 transition">
        <ChevronLeft size={14} />
        Back to Orders
      </Link>

      {/* Main Container */}
      <div className="bg-white border border-gray-150 rounded-[32px] overflow-hidden shadow-sm">
        {/* Header Block */}
        <div className="border-b border-gray-100 p-6 md:p-8 bg-gray-50/50 flex flex-wrap justify-between items-center gap-4">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold font-serif-luxury text-gray-900 tracking-tight">
              Order Details
            </h1>
            <p className="text-xs text-gray-500">
              ID: <strong className="text-gray-800">#{order.id}</strong>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(order.status)}`}>
              Order: {order.status}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${payStatus.style}`}>
              Payment: {payStatus.label}
            </span>
          </div>
        </div>

        {/* Content Block */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
            {/* Shipping details */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#C9A66B] flex items-center gap-1.5">
                <MapPin size={14} />
                Shipping Address
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                {order.shippingAddress}
              </p>
            </div>
            
            {/* Purchase date details */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#C9A66B] flex items-center gap-1.5">
                <Calendar size={14} />
                Order Date
              </h3>
              <p className="text-sm text-gray-700 font-semibold">
                {new Date(order.orderDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#C9A66B] flex items-center gap-1.5 pb-2 border-b border-gray-50">
              <ShoppingBag size={14} />
              Items In This Order
            </h3>
            
            <div className="divide-y divide-gray-100">
              {order.items && order.items.map((item, idx) => (
                <div key={item.id || idx} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <img
                    src={item.productImageUrl || 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=200&q=80'}
                    alt={item.productName}
                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0 md:flex-row md:items-center gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A66B] block">
                        {item.category}
                      </span>
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base leading-snug">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-1">
                        {item.productDescription}
                      </p>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap justify-between md:justify-end items-center gap-6 text-xs text-gray-500">
                      <div className="text-left md:text-right">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Unit Price</span>
                        <span className="font-medium text-gray-900 font-serif-luxury">{formatCurrency(item.price)}</span>
                      </div>
                      <div className="text-left md:text-right">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Quantity</span>
                        <span className="font-bold text-gray-900">{item.quantity}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Subtotal</span>
                        <span className="font-semibold text-gray-950 font-serif-luxury">{formatCurrency(item.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals Footer */}
          <div className="border-t border-gray-100 pt-6 flex justify-end">
            <div className="w-full md:w-72 space-y-3.5 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900 font-serif-luxury">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold uppercase tracking-wider text-xs">FREE</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                <span className="font-bold text-gray-900 uppercase tracking-widest text-xs">Grand Total</span>
                <span className="text-2xl font-bold font-serif-luxury text-[#C9A66B]">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
