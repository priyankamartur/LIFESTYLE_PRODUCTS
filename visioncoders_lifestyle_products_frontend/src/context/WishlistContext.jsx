import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import apiService from '../services/apiService';
import { toast } from 'react-toastify';

export const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      setWishlistCount(0);
      return;
    }
    setLoading(true);
    try {
      const items = await apiService.wishlist.getAll();
      setWishlist(items || []);
      
      const badge = await apiService.wishlist.getCount();
      setWishlistCount(badge.count || 0);
    } catch (err) {
      console.error('Failed to retrieve wishlist:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.warning('Please log in to add items to your wishlist.');
      return;
    }
    try {
      const result = await apiService.wishlist.add(productId);
      setWishlistCount(result.count || 0);
      await fetchWishlist();
    } catch (err) {
      console.error('Failed to add product to wishlist:', err);
      throw err;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return;
    try {
      const result = await apiService.wishlist.remove(productId);
      setWishlistCount(result.count || 0);
      await fetchWishlist();
    } catch (err) {
      console.error('Failed to remove product from wishlist:', err);
      throw err;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.productId === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    setWishlistCount(0);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
