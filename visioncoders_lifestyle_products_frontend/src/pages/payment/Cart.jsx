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
    <div className="cart-page space-y-8 animate-fadeIn">
      <h1 className="text-3xl font-extrabold text-black tracking-tight">Shopping Cart</h1>

      {isEmpty ? (
        <div className="glass flex flex-col items-center justify-center py-24 px-4 rounded-3xl text-center space-y-6">
          <div className="w-16 h-16 flex items-center justify-center bg-gray-100 border border-gray-200 rounded-2xl text-gray-600">
            <ShoppingBag size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-black">Your cart is currently empty</h3>
            <p className="text-gray-700 text-sm max-w-sm">
              Explore our premium products list and add items to your cart to begin checking out.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl shadow-lg transition"
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
                className="flex items-center gap-6 p-4 rounded-2xl bg-bg-surface border border-gray-200 hover:border-gray-300 transition"
              >
                <div className="w-20 h-20 bg-[#F9F7F5] rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                  <img
                    src={getProductImg(item.name, item.imageUrl)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow min-w-0">
                  <h3 className="text-base font-bold text-black truncate hover:text-indigo-600 transition">
                    <Link to={`/product/${item.productId}`}>{item.name}</Link>
                  </h3>
                  <span className="text-xs text-gray-600 font-medium">${item.pricePerUnit.toFixed(2)} each</span>
                </div>

                {/* Qty Selector */}
                <div className="flex items-center bg-bg-elevated border border-gray-200 rounded-lg p-0.5">
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity, -1)}
                    disabled={item.quantity <= 1}
                    className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600 hover:text-black disabled:opacity-40 transition cursor-pointer"
                    title="Decrease"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-black">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity, 1)}
                    className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200 text-gray-600 hover:text-black transition cursor-pointer"
                    title="Increase"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <div className="w-24 text-right text-base font-extrabold text-black">
                  ${item.totalPrice.toFixed(2)}
                </div>

                <button
                  onClick={() => handleDeleteItem(item.productId, item.name)}
                  className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Totals Summary Card */}
          <div className="glass rounded-3xl p-8 space-y-6">
            <h3 className="text-lg font-bold text-black tracking-tight border-b border-gray-200 pb-4">
              Order Summary
            </h3>

            <div className="space-y-3.5 text-sm text-gray-600 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-black">${cart.overallTotalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span className="text-black">$0.00</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-5 flex justify-between items-end text-black">
              <span className="text-sm font-bold text-gray-600">Total Price</span>
              <span className="text-2xl font-black text-brand-primary">
                ${cart.overallTotalPrice.toFixed(2)}
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-brand-primary to-indigo-600 hover:opacity-95 text-white font-bold rounded-2xl shadow-xl transition cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="text-center">
              <Link to="/catalog" className="text-xs text-gray-600 hover:text-black hover:underline transition">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
