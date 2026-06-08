'use client';

import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useFirebaseAppContext } from './FirebaseContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, loading } = useFirebaseAppContext();
  const [cart, setCart] = useState({ cartItems: [] });

  const getAuthToken = async () => {
    if (!user) return null;
    return user.getIdToken();
  };

  const fetchCart = async () => {
    const token = await getAuthToken();
    if (!token) { setCart({ cartItems: [] }); return; }
    const res = await fetch('/api/cart', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) { setCart({ cartItems: [] }); return; }
    const data = await res.json();
    setCart(data.cart || { cartItems: [] });
  };

  useEffect(() => {
    if (!loading) fetchCart();
  }, [user, loading]);

  const addItemToCart = async ({ product, name, price, image, stock, seller, quantity = 1 }) => {
    const token = await getAuthToken();
    if (!token) {
      toast.warn('Silakan login terlebih dahulu! 🔒');
      return;
    }
    const item = { product, name, price, image, stock, seller, quantity };
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(item),
    });
    if (!res.ok) { toast.error('Gagal menambahkan ke cart'); return; }
    const data = await res.json();
    setCart(data.cart);
    toast.success(`${name} ditambahkan ke cart! 🛒`);
  };

  const deleteItemFromCart = async (id) => {
    const token = await getAuthToken();
    if (!token) return;
    const res = await fetch(`/api/cart?product=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) { toast.error('Gagal menghapus item'); return; }
    const data = await res.json();
    setCart(data.cart);
    toast.info('Item dihapus dari cart');
  };

  const clearCart = async () => {
    const token = await getAuthToken();
    if (!token) return;
    const res = await fetch('/api/cart', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) { toast.error('Gagal mengosongkan cart'); return; }
    const data = await res.json();
    setCart(data.cart);
    toast.info('Cart dikosongkan');
  };

  return (
    <CartContext.Provider value={{ cart, addItemToCart, deleteItemFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;