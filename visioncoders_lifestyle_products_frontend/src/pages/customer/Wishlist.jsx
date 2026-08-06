import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import useWishlist from '../../hooks/useWishlist';
import useCart from '../../hooks/useCart';
import { getProductImg } from '../../utils/imageHelper';

export default function Wishlist() {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const [addingCartId, setAddingCartId] = useState(null);

  const handleAddToCart = async (productId, productName) => {
    setAddingCartId(productId);
    try {
      await addToCart(productId, 1);
      toast.success(`"${productName}" added to cart!`);
    } catch (err) {
      toast.error(err.message || 'Failed to add item to cart.');
    } finally {
      setAddingCartId(null);
    }
  };

  const handleRemoveFromWishlist = async (productId, productName) => {
    try {
      await removeFromWishlist(productId);
      toast.info(`"${productName}" removed from wishlist.`);
    } catch (err) {
      toast.error(err.message || 'Failed to remove item.');
    }
  };

  if (loading && wishlist.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
        <div className="text-6xl text-rose-500">❤️</div>
        <h2 className="text-2xl font-serif-luxury font-medium text-gray-900">Your Wishlist is Empty</h2>
        <p className="text-gray-500 max-w-sm text-sm">
          Save your favorite products to find them easily next time and build your perfect collection.
        </p>
        <Link
          to="/catalog"
          className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl text-sm transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-serif-luxury font-medium text-gray-900">My Wishlist</h1>
        <p className="text-gray-500 text-sm mt-1">Manage and shop your favorite lifestyle products.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((item) => {
          const imageSrc = getProductImg(item.productName, item.productImageUrl);
          return (
            <div
              key={item.id}
              className="group bg-white border border-gray-150 rounded-[20px] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full relative"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 flex-shrink-0">
                <img
                  src={imageSrc}
                  alt={item.productName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Remove from Wishlist button */}
                <button
                  onClick={() => handleRemoveFromWishlist(item.productId, item.productName)}
                  className="absolute top-4 right-4 w-9 h-9 bg-white/95 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 hover:scale-110 shadow-sm border border-gray-100 transition cursor-pointer z-20"
                  title="Remove from Wishlist"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Info Content */}
              <div className="p-5 flex flex-col flex-grow bg-white">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                  {item.category}
                </span>

                <h3 className="text-sm font-medium text-gray-900 group-hover:text-amber-700 transition duration-200 line-clamp-2 h-10 mb-2" title={item.productName}>
                  <Link to={`/product/${item.productId}`} className="font-serif-luxury">
                    {item.productName}
                  </Link>
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 text-amber-500 text-xs mb-2">
                  <div className="flex">
                    <Star size={11} fill="currentColor" className="text-amber-500 border-none" />
                    <Star size={11} fill="currentColor" className="text-amber-500 border-none" />
                    <Star size={11} fill="currentColor" className="text-amber-500 border-none" />
                    <Star size={11} fill="currentColor" className="text-amber-500 border-none" />
                    <Star size={11} fill="currentColor" className="text-amber-500 border-none opacity-20" />
                  </div>
                  <span className="text-gray-400 text-[10px] font-medium">(4.0)</span>
                </div>

                {/* Stock Status */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md">
                    {item.stockStatus}
                  </span>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="text-base font-medium font-serif-luxury text-gray-900">${item.price.toFixed(2)}</span>

                  <div className="flex items-center gap-1.5">
                    {/* View Details button */}
                    <Link
                      to={`/product/${item.productId}`}
                      className="flex items-center justify-center w-8.5 h-8.5 bg-gray-50 border border-gray-200 hover:border-gray-950 text-gray-600 hover:text-gray-950 rounded-xl transition"
                      title="View Details"
                    >
                      <Eye size={13} />
                    </Link>

                    {/* Add to Cart button */}
                    <button
                      onClick={() => handleAddToCart(item.productId, item.productName)}
                      disabled={addingCartId === item.productId}
                      className="flex items-center justify-center w-8.5 h-8.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition cursor-pointer disabled:opacity-50"
                      title="Add to Cart"
                    >
                      {addingCartId === item.productId ? (
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
        })}
      </div>
    </div>
  );
}
