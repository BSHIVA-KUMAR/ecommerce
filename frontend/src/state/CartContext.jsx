import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const key = `cart-${user?.username || 'guest'}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      setCart([]);
      return;
    }
    try {
      setCart(JSON.parse(raw));
    } catch {
      setCart([]);
    }
  }, [user?.username]);

  useEffect(() => {
    const key = `cart-${user?.username || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, user?.username]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, qty } : item));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);

  const value = useMemo(
    () => ({ cart, addToCart, updateQty, removeFromCart, clearCart, itemCount, total }),
    [cart, itemCount, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
