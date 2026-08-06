import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import apiService from '../services/apiService';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      setCartCount(0);
      return;
    }
    setLoading(true);
    try {
      const details = await apiService.cart.getDetails();
      setCart(details);
      
      const badge = await apiService.cart.getCount();
      setCartCount(badge.count || 0);
    } catch (err) {
      console.error('Failed to retrieve cart details:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    
    // Sync cart count updates across different components/windows
    const handleCartUpdate = () => {
      fetchCart();
    };
    
    window.addEventListener('cartUpdate', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdate', handleCartUpdate);
    };
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) throw new Error('Authentication required');
    try {
      const result = await apiService.cart.add(productId, quantity);
      setCartCount(result.count || 0);
      await fetchCart();
      window.dispatchEvent(new Event('cartUpdate'));
    } catch (err) {
      console.error('Failed to add product to cart:', err);
      throw err;
    }
  };

  const updateQty = async (productId, quantity) => {
    if (!isAuthenticated) return;
    try {
      const result = await apiService.cart.updateQuantity(productId, quantity);
      setCartCount(result.count || 0);
      await fetchCart();
      window.dispatchEvent(new Event('cartUpdate'));
    } catch (err) {
      console.error('Failed to update quantity:', err);
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;
    try {
      await apiService.cart.deleteItem(productId);
      await fetchCart();
      window.dispatchEvent(new Event('cartUpdate'));
    } catch (err) {
      console.error('Failed to delete item from cart:', err);
      throw err;
    }
  };

  const clearCart = () => {
    setCart(null);
    setCartCount(0);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        cartCount, 
        loading, 
        fetchCart, 
        addToCart, 
        updateQty, 
        removeFromCart, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
