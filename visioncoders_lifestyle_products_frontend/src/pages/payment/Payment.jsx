import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreditCard, CheckCircle, XCircle, ShieldCheck, ExternalLink } from 'lucide-react';
import apiService from '../../services/apiService';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearCart } = useCart();

  // Retrieve passed order details from router state
  const state = location.state;
  if (!state || !state.orderId || !state.amount) {
    return <Navigate to="/cart" replace />;
  }

  const { orderId, amount } = state;

  // Form inputs (Backup card method / Simulation details)
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY'); // 'RAZORPAY' | 'CREDIT_CARD'
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cvv, setCvv] = useState('');
  const [simulateStatus, setSimulateStatus] = useState('SUCCESS');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // 'success' | 'failed'
  const [transactionId, setTransactionId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Dynamic Razorpay SDK Injection helper
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    setErrorMsg('');

    const res = await loadRazorpayScript();
    if (!res) {
      toast.error('Failed to load Razorpay SDK. Falling back to card simulation.');
      setPaymentMethod('CREDIT_CARD');
      setLoading(false);
      return;
    }

    try {
      const options = {
        key: 'rzp_test_LifestyleProductsKey2026', // Test Razorpay Key
        amount: Math.round(amount * 100), // in Paisa
        currency: 'INR',
        name: 'Lifestyle Products',
        description: `Payment for order #${orderId}`,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80',
        handler: async function (response) {
          try {
            // Process success callback in the backend
            const payload = {
              orderId,
              paymentMethod: 'RAZORPAY',
              cardNumber: response.razorpay_payment_id || 'RZP-TXN-SUCCESS',
              cvv: '000',
              simulateStatus: 'SUCCESS'
            };
            const payRes = await apiService.payments.process(payload);
            
            if (payRes && payRes.paymentStatus === 'COMPLETED') {
              clearCart();
              window.dispatchEvent(new Event('cartUpdate'));
              setTransactionId(payRes.transactionId);
              setResult('success');
              toast.success('Payment successfully captured via Razorpay!');
            } else {
              setErrorMsg('Transaction rejected during processing.');
              setResult('failed');
            }
          } catch (err) {
            setErrorMsg(err.message || 'Payment status mapping failed.');
            setResult('failed');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user ? user.username : 'Guest User',
          email: user ? user.email : 'guest@example.com'
        },
        theme: {
          color: '#6366f1'
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.info('Payment window cancelled.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setErrorMsg('Razorpay initialization failed.');
      setResult('failed');
      setLoading(false);
    }
  };

  const handleCardPayment = async (e) => {
    e.preventDefault();
    if (!cardNumber || !cvv || !cardName) {
      toast.warning('Please fill in card details');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await apiService.payments.process({
        orderId,
        paymentMethod: 'CREDIT_CARD',
        cardNumber,
        cvv,
        simulateStatus
      });

      if (response && response.paymentStatus === 'COMPLETED') {
        clearCart();
        window.dispatchEvent(new Event('cartUpdate'));
        setTransactionId(response.transactionId);
        setResult('success');
        toast.success('Card payment successfully processed!');
      } else {
        setErrorMsg('Simulated transaction failed.');
        setResult('failed');
        toast.error('Transaction failed.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Payment processing error');
      setResult('failed');
      toast.error('Payment processing failed.');
    } finally {
      setLoading(false);
    }
  };

  // Render Success Screen
  if (result === 'success') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-10 px-4 animate-fadeIn">
        <div className="glass w-full max-w-md p-8 rounded-3xl border border-emerald-500/20 text-center space-y-6 shadow-xl">
          <CheckCircle size={60} className="text-emerald-400 mx-auto" />
          
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Order Confirmed!</h2>
            <p className="text-gray-400 text-sm">
              Your transaction has processed successfully. Your order is now in progress.
            </p>
          </div>

          <div className="bg-bg-elevated border border-white/5 p-4 rounded-xl text-sm text-left space-y-2">
            <div><strong className="text-gray-300">Order ID:</strong> <span className="text-white font-semibold">#{orderId}</span></div>
            <div className="truncate"><strong className="text-gray-300">Transaction ID:</strong> <span className="text-brand-primary">{transactionId}</span></div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => navigate('/')} className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition cursor-pointer">
              Back to Home
            </button>
            <button onClick={() => navigate('/profile')} className="flex-1 py-3 bg-gradient-to-r from-brand-primary to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl shadow-lg transition cursor-pointer">
              Track Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Failure Screen
  if (result === 'failed') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-10 px-4 animate-fadeIn">
        <div className="glass w-full max-w-md p-8 rounded-3xl border border-rose-500/20 text-center space-y-6 shadow-xl">
          <XCircle size={60} className="text-rose-400 mx-auto" />
          
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Payment Rejected</h2>
            <p className="text-gray-400 text-sm">
              We encountered an issue finalizing your payment details.
            </p>
          </div>

          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-300 text-sm font-medium">
            {errorMsg}
          </div>

          <div className="flex gap-4">
            <button onClick={() => navigate('/cart')} className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition cursor-pointer">
              Go to Cart
            </button>
            <button onClick={() => setResult(null)} className="flex-1 py-3 bg-gradient-to-r from-brand-primary to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl shadow-lg transition cursor-pointer">
              Retry Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10 px-4 animate-fadeIn">
      <div className="glass w-full max-w-md p-8 rounded-3xl shadow-xl shadow-black/40 border border-white/5 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-white tracking-tight font-sans">Payment Method</h2>
          <p className="text-gray-400 text-sm">Choose payment type for order #{orderId}</p>
        </div>

        <div className="flex justify-between items-center p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl">
          <span className="text-sm font-bold text-gray-400">Total Price:</span>
          <span className="text-2xl font-black text-brand-primary">{formatCurrency(amount)}</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Method</label>
          <select
            className="px-4 py-2.5 bg-bg-surface border border-white/10 focus:border-brand-primary rounded-xl text-sm text-gray-200 outline-none cursor-pointer"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            disabled={loading}
          >
            <option value="RAZORPAY">Razorpay Portal Checkout</option>
            <option value="CREDIT_CARD">Credit / Debit Card Simulation</option>
          </select>
        </div>

        {paymentMethod === 'RAZORPAY' ? (
          <div className="space-y-4 pt-2">
            <button
              onClick={handleRazorpayPayment}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-brand-primary to-indigo-600 hover:opacity-95 text-white font-bold rounded-2xl shadow-xl transition cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Open Razorpay Portal</span>
                  <ExternalLink size={16} />
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-gray-500 leading-relaxed">
              Launches the Razorpay checkout screen to complete payments using credit cards, net banking, or UPI.
            </p>
          </div>
        ) : (
          <form onSubmit={handleCardPayment} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider" htmlFor="cardName">Cardholder Name</label>
              <input
                type="text"
                id="cardName"
                placeholder="John Doe"
                className="w-full px-4 py-2 bg-bg-surface border border-white/10 focus:border-brand-primary rounded-xl outline-none text-white text-sm transition"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider" htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                placeholder="4111 2222 3333 4444"
                className="w-full px-4 py-2 bg-bg-surface border border-white/10 focus:border-brand-primary rounded-xl outline-none text-white text-sm transition"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider" htmlFor="expiry">Expiry</label>
                <input
                  type="text"
                  id="expiry"
                  placeholder="MM/YY"
                  className="w-full px-4 py-2 bg-bg-surface border border-white/10 focus:border-brand-primary rounded-xl outline-none text-white text-sm transition"
                  disabled={loading}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider" htmlFor="cvv">CVV</label>
                <input
                  type="password"
                  id="cvv"
                  placeholder="123"
                  className="w-full px-4 py-2 bg-bg-surface border border-white/10 focus:border-brand-primary rounded-xl outline-none text-white text-sm transition"
                  maxLength="4"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 border-t border-white/5 pt-4">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider" htmlFor="simulate">Simulation Mode</label>
              <select
                id="simulate"
                className="px-4 py-2 bg-bg-surface border border-white/10 focus:border-brand-primary rounded-xl text-xs text-gray-200 outline-none cursor-pointer"
                value={simulateStatus}
                onChange={(e) => setSimulateStatus(e.target.value)}
                disabled={loading}
              >
                <option value="SUCCESS">SUCCESS (Clear cart & update order status)</option>
                <option value="FAILURE">FAILURE (Simulate card declined error)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-brand-primary to-indigo-600 hover:opacity-95 text-white font-bold rounded-2xl shadow-xl transition cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                `Pay ${formatCurrency(amount)}`
              )}
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 pt-2 border-t border-white/5">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>Secure checkout transaction</span>
        </div>
      </div>
    </div>
  );
}
