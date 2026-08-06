import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import useCart from '../../hooks/useCart';
import { getProductImg } from '../../utils/imageHelper';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, loading, updateQty, removeFromCart } = useCart();

  const handleQuantityChange = async (productId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty < 1) return;
    try {
      await updateQty(productId, newQty);
    } catch (err) {
      toast.error('Failed to update item quantity.');
    }
  };

  const handleDeleteItem = async (productId, name) => {
    if (!window.confirm(`Remove "${name}" from your shopping cart?`)) return;
    try {
      await removeFromCart(productId);
      toast.info(`"${name}" removed from cart.`);
    } catch (err) {
      toast.error('Failed to remove item.');
    }
  };

  if (loading && !cart) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-gray-700 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const products = cart?.products || [];
  const isEmpty = products.length === 0;

  return (
    <div className="cart-page space-y-8 animate-fadeIn text-slate-100">
      <h1 className="text-3xl font-extrabold text-white tracking-tight font-serif-luxury">Shopping Cart</h1>

      {isEmpty ? (
        <div className="glass flex flex-col items-center justify-center py-24 px-4 rounded-3xl text-center space-y-6 border border-white/10">
          <div className="w-16 h-16 flex items-center justify-center bg-slate-900 border border-white/10 rounded-2xl text-amber-400">
            <ShoppingBag size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Your cart is currently empty</h3>
            <p className="text-slate-300 text-sm max-w-sm">
              Explore our premium products list and add items to your cart to begin checking out.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition"
            >
              <span>Explore Collection</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {products.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-6 p-4 rounded-2xl glass border border-white/10 hover:border-amber-400/40 transition"
              >
                <div className="w-20 h-20 bg-slate-900 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                  <img
                    src={getProductImg(item.name, item.imageUrl)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow min-w-0">
                  <h3 className="text-base font-bold text-white truncate hover:text-amber-400 transition">
                    <Link to={`/product/${item.productId}`}>{item.name}</Link>
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">${item.pricePerUnit.toFixed(2)} each</span>
                </div>

                {/* Qty Selector */}
                <div className="flex items-center bg-slate-900/90 border border-white/15 rounded-lg p-0.5">
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity, -1)}
                    disabled={item.quantity <= 1}
                    className="w-7 h-7 rounded flex items-center justify-center hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition cursor-pointer"
                    title="Decrease"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-white">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity, 1)}
                    className="w-7 h-7 rounded flex items-center justify-center hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Increase"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <div className="w-24 text-right text-base font-extrabold text-amber-400">
                  ${item.totalPrice.toFixed(2)}
                </div>

                <button
                  onClick={() => handleDeleteItem(item.productId, item.name)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Totals Summary Card */}
          <div className="glass rounded-3xl p-8 space-y-6 border border-white/10">
            <h3 className="text-lg font-bold text-white tracking-tight border-b border-white/10 pb-4 font-serif-luxury">
              Order Summary
            </h3>

            <div className="space-y-3.5 text-sm text-slate-300 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-bold">${cart.overallTotalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (Estimated)</span>
                <span className="text-white font-bold">$0.00</span>
              </div>
              <hr className="border-white/10 my-2" />
              <div className="flex justify-between text-base font-black text-white">
                <span>Estimated Total</span>
                <span className="text-amber-400 font-serif-luxury text-xl">${cart.overallTotalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-2xl shadow-xl shadow-amber-500/20 transition duration-200 cursor-pointer text-sm uppercase tracking-wider"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
            
            <div className="text-center">
              <Link to="/catalog" className="text-xs text-slate-400 hover:text-white hover:underline transition">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
