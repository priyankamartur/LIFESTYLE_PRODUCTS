import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Calendar, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/formatCurrency';

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.orders.getHistory();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load order history:', err);
      setError(err.message || 'Failed to retrieve your order history. Please try again.');
      toast.error('Could not load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const s = String(status).toUpperCase();
    if (s === 'PROCESSING' || s === 'SHIPPED' || s === 'DELIVERED' || s === 'SUCCESS') {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    if (s === 'PENDING') {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    return 'bg-rose-50 text-rose-800 border-rose-200';
  };

  const getStatusLabel = (status) => {
    const s = String(status).toUpperCase();
    if (s === 'PROCESSING' || s === 'SHIPPED' || s === 'DELIVERED' || s === 'SUCCESS') {
      return 'SUCCESS';
    }
    if (s === 'PENDING') {
      return 'PENDING';
    }
    return 'FAILED';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 space-y-6 animate-pulse">
        <div className="h-9 w-48 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-gray-150 rounded-[24px] p-6 space-y-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="border-t border-gray-100 pt-4 flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 flex flex-col items-center justify-center text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 flex items-center justify-center bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 shadow-sm">
          <AlertCircle size={32} />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-xl font-bold text-gray-900 font-serif-luxury">Unable to load orders</h2>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-full text-xs uppercase tracking-widest transition cursor-pointer shadow-sm"
        >
          <RefreshCw size={14} className="animate-spin-once" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 flex flex-col items-center justify-center text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 flex items-center justify-center bg-gray-50 border border-gray-150 rounded-[28px] text-gray-400 shadow-sm">
          <ShoppingBag size={36} />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-medium font-serif-luxury text-gray-900">No Orders Yet</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            It looks like you haven't placed any orders yet. Start exploring our premium collections to find something you love.
          </p>
        </div>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-full text-xs uppercase tracking-widest transition cursor-pointer shadow-md hover:shadow-lg"
        >
          <span>Continue Shopping</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn py-6 max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-medium font-serif-luxury text-gray-900 tracking-tight">Order History</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((item, idx) => (
          <div
            key={`${item.orderId}-${item.productId}-${idx}`}
            onClick={() => navigate(`/orders/${item.orderId}`)}
            className="group bg-white border border-gray-150 rounded-[24px] p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-sm"
          >
            <div className="space-y-4">
              {/* Product Header */}
              <div className="flex gap-4">
                <img
                  src={item.productImageUrl || 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=200&q=80'}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A66B]">
                    {item.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 leading-snug group-hover:text-[#C9A66B] transition-colors">
                    {item.productName}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {item.productDescription}
                  </p>
                </div>
              </div>

              {/* Order Info & Price Details */}
              <div className="space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Order ID</span>
                  <span className="font-bold text-gray-900">#{item.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Date</span>
                  <span className="font-medium text-gray-700 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(item.orderDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity</span>
                  <span className="font-bold text-gray-900">{item.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price Per Unit</span>
                  <span className="font-medium text-gray-900 font-serif-luxury">{formatCurrency(item.price)}</span>
                </div>
              </div>
            </div>

            {/* Status & Total Price Footer */}
            <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(item.orderStatus)}`}>
                {getStatusLabel(item.orderStatus)}
              </span>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Total</span>
                <span className="font-bold text-gray-900 font-serif-luxury text-base">
                  {formatCurrency(item.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
