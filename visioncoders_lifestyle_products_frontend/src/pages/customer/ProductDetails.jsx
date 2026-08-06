import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShoppingCart, CreditCard, ChevronLeft, Minus, Plus, Star, ShieldCheck } from 'lucide-react';
import apiService from '../../services/apiService';
import { getProductImg } from '../../utils/imageHelper';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const prodData = await apiService.products.getById(id);
        setProduct(prodData);
      } catch (err) {
        setError(err.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async (showToast = true) => {
    if (!isAuthenticated) {
      toast.warning('Please log in to add items to your cart.');
      return false;
    }

    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      if (showToast) {
        toast.success(`"${product.name}" (${quantity} units) added to cart!`);
      }
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to add item to cart.');
      return false;
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    const success = await handleAddToCart(false);
    if (success) {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 space-y-6">
        <div className="glass p-6 rounded-2xl text-rose-400 font-medium">{error || 'Product not found.'}</div>
        <button
          onClick={() => navigate('/catalog')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold rounded-xl text-gray-300 hover:text-white transition cursor-pointer"
        >
          <ChevronLeft size={14} />
          Back to Catalog
        </button>
      </div>
    );
  }

  const imageSrc = getProductImg(product.name, product.imageUrl);

  return (
    <div className="space-y-6 animate-fadeIn text-slate-100">
      {/* Back Button */}
      <button
        onClick={() => navigate('/catalog')}
        className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-amber-400 transition cursor-pointer"
      >
        <ChevronLeft size={16} />
        Back to Shop
      </button>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left Column: Image Card */}
        <div className="glass rounded-3xl overflow-hidden aspect-square relative border border-white/10 shadow-2xl bg-slate-900/60">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Column: Info Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              {product.categoryName || 'Lifestyle'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif-luxury font-extrabold text-white tracking-tight leading-tight">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-1.5 pt-1 text-amber-400 text-sm">
              <div className="flex">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" className="opacity-40" />
              </div>
              <span className="text-slate-400 text-xs">(4.5 Rating / 12 Reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-amber-400 font-serif-luxury">${product.price.toFixed(2)}</span>
            <span className="text-xs text-emerald-400 font-bold px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              In Stock & Ready to Ship
            </span>
          </div>

          {/* Description */}
          <div className="border-t border-b border-white/10 py-6 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Product Overview</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {product.description ||
                'Crafted using structural grade polymers and premium aesthetics, this collection incorporates durable everyday use metrics with standard design values.'}
            </p>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Quantity:</span>
            <div className="flex items-center bg-slate-900/90 border border-white/15 rounded-xl p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                title="Decrease"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-white text-lg font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                title="Increase"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Checkout Action row */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => handleAddToCart(true)}
              disabled={adding}
              className="flex-grow flex items-center justify-center gap-2 py-4 bg-slate-800/90 border border-white/15 hover:border-amber-400 text-white font-bold rounded-2xl hover:bg-slate-700 transition duration-200 cursor-pointer disabled:opacity-50"
            >
              <ShoppingCart size={18} className="text-amber-400" />
              Add to Cart
            </button>
            
            <button
              onClick={handleBuyNow}
              disabled={adding}
              className="flex-grow flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-2xl shadow-xl shadow-amber-500/20 transition duration-200 cursor-pointer disabled:opacity-50"
            >
              <CreditCard size={18} />
              Buy It Now
            </button>
          </div>

          {/* Security badge info */}
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-400 pt-4">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>256-Bit SSL Encrypted merchant validation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
