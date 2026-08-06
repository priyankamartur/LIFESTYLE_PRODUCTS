import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye, Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import { getProductImg } from '../../utils/imageHelper';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import useWishlist from '../../hooks/useWishlist';

export default function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.warning('Please log in to add items to your wishlist.');
      return;
    }
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        toast.info(`"${product.name}" removed from wishlist.`);
      } else {
        await addToWishlist(product.id);
        toast.success(`"${product.name}" added to wishlist!`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update wishlist.');
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.warning('Please log in to add items to your cart.');
      return;
    }

    setAdding(true);
    try {
      await addToCart(product.id, 1);
      toast.success(`"${product.name}" added to cart!`);
    } catch (err) {
      toast.error(err.message || 'Failed to add item.');
    } finally {
      setAdding(false);
    }
  };

  const imageSrc = getProductImg(product.name, product.imageUrl);

  return (
    <div className="group bg-white border border-gray-150 rounded-[20px] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full relative">
      
      {/* Image Container with Zoom effect on hover */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 flex-shrink-0">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Wishlist Heart Icon (Top-Right) */}
        <button
          onClick={toggleWishlist}
          className="absolute top-4 right-4 w-9 h-9 bg-white/95 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 hover:scale-110 shadow-sm border border-gray-100 transition cursor-pointer z-20"
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-rose-500" : ""} />
        </button>

        {/* Quick View Details Overlay */}
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/product/${product.id}`}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-white text-gray-900 font-semibold rounded-full text-xs shadow-md transform translate-y-2 group-hover:translate-y-0 transition duration-300 hover:bg-gray-50 border border-gray-100"
          >
            <Eye size={12} />
            Quick View
          </Link>
        </div>

        {product.featured && (
          <span className="absolute top-4 left-4 bg-gray-900 text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-md shadow-sm">
            Featured
          </span>
        )}
      </div>

      {/* Info Content */}
      <div className="p-5 flex flex-col flex-grow bg-white">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
          {product.categoryName || 'Lifestyle'}
        </span>
        
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-amber-700 transition duration-200 line-clamp-2 h-10 mb-2" title={product.name}>
          <Link to={`/product/${product.id}`} className="font-serif-luxury">{product.name}</Link>
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 text-amber-500 text-xs mb-4">
          <div className="flex">
            <Star size={11} fill="currentColor" className="text-amber-500 border-none" />
            <Star size={11} fill="currentColor" className="text-amber-500 border-none" />
            <Star size={11} fill="currentColor" className="text-amber-500 border-none" />
            <Star size={11} fill="currentColor" className="text-amber-500 border-none" />
            <Star size={11} fill="currentColor" className="text-amber-500 border-none opacity-20" />
          </div>
          <span className="text-gray-400 text-[10px] font-medium">(4.0)</span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <span className="text-base font-medium font-serif-luxury text-gray-900">${product.price.toFixed(2)}</span>
          
          <div className="flex items-center gap-1.5">
            {/* Direct Details Link */}
            <Link
              to={`/product/${product.id}`}
              className="flex items-center justify-center w-8.5 h-8.5 bg-gray-50 border border-gray-200 hover:border-gray-950 text-gray-600 hover:text-gray-950 rounded-xl transition"
              title="View Product Details"
            >
              <Eye size={13} />
            </Link>
            
            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="flex items-center justify-center w-8.5 h-8.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition cursor-pointer disabled:opacity-50"
              title="Add to Cart"
            >
              {adding ? (
                <span className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></span>
              ) : (
                <ShoppingCart size={13} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
