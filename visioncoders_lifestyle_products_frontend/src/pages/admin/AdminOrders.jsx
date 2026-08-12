import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Mail, Phone, MapPin, Calendar, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import apiService from '../../services/apiService';
import { formatCurrency } from '../../utils/formatCurrency';
import { getProductImg } from '../../services/imageHelper';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await apiService.admin.getAllOrders();
      setOrders(data || []);
    } catch (err) {
      toast.error('Failed to load customer orders.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await apiService.admin.updateOrderStatus(orderId, newStatus);
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === 'ALL') return true;
    return order.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-3 border-gray-700 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="text-amber-500" />
            Customer Orders Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Track customer orders, view buyer contact info (Name, Email, Phone), and update fulfillment status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="p-2.5 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 rounded-xl transition"
            title="Refresh orders"
          >
            <RefreshCw size={16} />
          </button>

          {/* Filter dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-gray-200 text-xs font-semibold rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center text-gray-500">
          <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-sm font-semibold">No orders found matching the criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-gray-700 transition"
            >
              {/* Top Row: Order ID, Date, Status */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-800 gap-3">
                <div>
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Order ID</span>
                  <h3 className="text-lg font-black text-white">#{order.id}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                    <Calendar size={13} />
                    {new Date(order.orderDate).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.status === 'CONFIRMED' || order.status === 'DELIVERED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : order.status === 'CANCELLED'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-900/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {order.status}
                  </span>

                  {/* Status Changer */}
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="bg-gray-950 border border-gray-800 text-xs font-bold text-gray-300 rounded-xl px-2.5 py-1.5 outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="PENDING">Mark Pending</option>
                    <option value="CONFIRMED">Mark Confirmed</option>
                    <option value="SHIPPED">Mark Shipped</option>
                    <option value="DELIVERED">Mark Delivered</option>
                    <option value="CANCELLED">Mark Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Middle Row: Customer Info Card & Shipping Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-950/60 p-4 rounded-xl border border-gray-800/80">
                {/* Customer Contact Details */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Customer Details</span>
                  <div className="flex items-center gap-2 text-sm text-amber-300 font-bold">
                    <User size={15} />
                    {order.customerName || order.username || 'Customer'}
                    {order.username && <span className="text-xs text-gray-500 font-normal">(@{order.username})</span>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Mail size={14} className="text-gray-400" />
                    <a href={`mailto:${order.customerEmail}`} className="hover:text-amber-400 underline">
                      {order.customerEmail || 'No email provided'}
                    </a>
                  </div>
                  {order.customerPhone && (
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <Phone size={14} className="text-gray-400" />
                      <span>{order.customerPhone}</span>
                    </div>
                  )}
                </div>

                {/* Shipping Address */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Shipping Address</span>
                  <div className="flex items-start gap-2 text-xs text-gray-300">
                    <MapPin size={15} className="text-amber-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{order.shippingAddress || 'Standard Shipping'}</span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Ordered Items</span>
                <div className="divide-y divide-gray-850">
                  {order.items && order.items.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getProductImg(item.productName, item.productImageUrl)}
                          alt={item.productName}
                          className="w-10 h-10 object-cover rounded-lg bg-gray-950 border border-gray-800"
                        />
                        <div>
                          <h4 className="text-xs font-semibold text-white">{item.productName}</h4>
                          <span className="text-[11px] text-gray-400">
                            Qty: {item.quantity} × {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-white">{formatCurrency(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="flex justify-end pt-3 border-t border-gray-800">
                <div className="text-right">
                  <span className="text-xs text-gray-400 font-medium">Order Total: </span>
                  <span className="text-base font-black text-white">{formatCurrency(order.totalAmount || 0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
