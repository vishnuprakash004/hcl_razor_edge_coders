import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0, totalItems: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isLoggedIn) { setCart({ items: [], totalAmount: 0, totalItems: 0 }); return; }
    try {
      setLoading(true);
      const res = await api.get('/cart');
      setCart(res.data);
    } catch (e) { console.error('Cart fetch failed', e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, [isLoggedIn]);

  const addToCart = async (productId, quantity = 1) => {
    await api.post('/cart/add', { productId, quantity });
    await fetchCart();
  };

  const updateItem = async (cartItemId, quantity) => {
    await api.put(`/cart/${cartItemId}?quantity=${quantity}`);
    await fetchCart();
  };

  const removeItem = async (cartItemId) => {
    await api.delete(`/cart/${cartItemId}`);
    await fetchCart();
  };

  const clearCart = async () => {
    await api.delete('/cart/clear');
    await fetchCart();
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
