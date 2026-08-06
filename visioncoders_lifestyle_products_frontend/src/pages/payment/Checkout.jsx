import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { CreditCard, ChevronLeft, ArrowRight } from 'lucide-react';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import apiService from '../../services/apiService';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, loading, fetchCart, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!loading && (!cart || !cart.products || cart.products.length === 0)) {
      navigate('/cart');
    }
  }, [cart, loading, navigate]);

  // Load Razorpay Script helper
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // 1. Load Razorpay Script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load Razorpay Checkout SDK. Please check your internet connection.');
        setSubmitting(false);
        return;
      }

      // 2. Create the PENDING Order in the database first (captures address)
      const dbOrder = await apiService.orders.checkout(data.shippingAddress);
      
      // Dispatch cartUpdate event to refresh count
      window.dispatchEvent(new Event('cartUpdate'));

      // 3. Create Razorpay order from the backend
      const razorpayOrder = await apiService.razorpay.createOrder(dbOrder.totalAmount);

      // 4. Configure Razorpay Options
      const options = {
        key: razorpayOrder.key,
        amount: Math.round(razorpayOrder.amount * 100), // in Paise
        currency: razorpayOrder.currency || 'INR',
        name: 'Lifestyle Products',
        description: `Order #${dbOrder.id} Payment`,
        image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=100&q=80',
        order_id: razorpayOrder.orderId,
        handler: async function (response) {
          try {
            setSubmitting(true);
            
            // 5. Call verify payment endpoint
            const verifyRes = await apiService.razorpay.verify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: dbOrder.id
            });

            toast.success('Payment successfully verified!');
            clearCart();
            window.dispatchEvent(new Event('cartUpdate'));

            // Redirect to success page
            navigate('/order-success', {
              state: {
                orderId: dbOrder.id,
                paymentId: response.razorpay_payment_id,
                amount: dbOrder.totalAmount,
                paymentStatus: 'SUCCESS'
              }
            });
          } catch (err) {
            toast.error(err.message || 'Payment verification failed.');
            navigate('/order-failed', { state: { amount: dbOrder.totalAmount } });
          } finally {
            setSubmitting(false);
          }
        },
        prefill: {
          name: user ? user.username : 'Guest User',
          email: user ? user.email : 'guest@example.com',
          contact: user ? user.phoneNumber || '9999999999' : '9999999999'
        },
        theme: {
          color: '#1F1F1F'
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
            toast.info('Payment cancelled.');
          }
        }
      };

      // 5. Launch Razorpay modal
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        toast.error('Payment failed: ' + resp.error.description);
        navigate('/order-failed', { state: { amount: dbOrder.totalAmount } });
      });
      rzp.open();

    } catch (err) {
      toast.error(err.message || 'Failed to initialize payment order.');
      setSubmitting(false);
    }
  };

  if (loading || !cart) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh] bg-[#F6F2EC]">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn bg-[#F6F2EC] text-[#1F1F1F] py-6">
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-950 transition">
        <ChevronLeft size={14} />
        Back to Cart
      </Link>

      <h1 className="text-3xl font-medium font-serif-luxury text-gray-900 tracking-tight">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Delivery address form */}
        <div className="lg:col-span-2 bg-white border border-gray-150 p-8 rounded-[24px] space-y-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#C9A66B] border-b border-gray-100 pb-4">
            Shipping Information
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider" htmlFor="shippingAddress">
                Full Delivery Address
              </label>
              <textarea
                id="shippingAddress"
                rows="4"
                placeholder="Name, Street Name, Apt #, City, State, ZIP Code"
                className={`w-full px-4 py-3 border ${
                  errors.shippingAddress ? 'border-rose-500' : 'border-gray-200'
                } rounded-xl outline-none text-gray-800 text-sm transition resize-y`}
                disabled={submitting}
                {...register('shippingAddress', { required: 'Delivery address is required' })}
              />
              {errors.shippingAddress && (
                <span className="text-xs font-medium text-rose-500">{errors.shippingAddress.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-full text-xs uppercase tracking-widest transition cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></span>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <CreditCard size={14} />
                  <span>Pay Now</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order review sidebar */}
        <div className="bg-white border border-gray-150 rounded-[24px] p-8 space-y-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#C9A66B] border-b border-gray-100 pb-4">
            Order Preview
          </h3>

          <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto pr-2 space-y-2">
            {cart.products.map((item) => (
              <div key={item.productId} className="flex justify-between items-center text-sm py-2">
                <span className="text-gray-500 line-clamp-1 max-w-[70%]">
                  {item.name} <strong className="text-gray-900">&times; {item.quantity}</strong>
                </span>
                <span className="font-semibold text-gray-900 font-serif-luxury">
                  ${item.totalPrice.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-3.5 text-xs text-gray-500 font-medium">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-gray-900 font-semibold font-serif-luxury">${cart.overallTotalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-emerald-600 font-bold uppercase tracking-wider">FREE</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 flex justify-between items-end">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Price</span>
            <span className="text-xl font-bold font-serif-luxury text-[#C9A66B]">
              ${cart.overallTotalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
