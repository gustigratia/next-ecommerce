'use client';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { useFirebaseAppContext } from './FirebaseContext';

const CartContext = createContext(null);

const DEFAULT_CART = {
  cartItems: [],
};

export const CartProvider = ({ children }) => {
  const { user, loading } = useFirebaseAppContext();
  const [cart, setCart] = useState(DEFAULT_CART);

  const getAuthToken = useCallback(async () => {
    if (!user) return null;

    return user.getIdToken();
  }, [user]);

  const fetchCart = useCallback(async () => {
    try {
      const token = await getAuthToken();

      if (!token) {
        setCart(DEFAULT_CART);
        return;
      }

      const res = await fetch('/api/cart', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setCart(DEFAULT_CART);
        return;
      }

      const data = await res.json();

      setCart(data.cart || DEFAULT_CART);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart(DEFAULT_CART);
    }
  }, [getAuthToken]);

  useEffect(() => {
    if (!loading) {
      fetchCart();
    }
  }, [loading, fetchCart]);

  const addItemToCart = useCallback(
    async ({ product, name, price, image, stock, seller, quantity = 1 }) => {
      try {
        const token = await getAuthToken();

        if (!token) {
          toast.warn('Please sign in to add items to your cart.');
          return;
        }

        const item = {
          product,
          name,
          price,
          image,
          stock,
          seller,
          quantity,
        };

        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(item),
        });

        if (!res.ok) {
          toast.error('Failed to add item to cart.');
          return;
        }

        const data = await res.json();

        setCart(data.cart || DEFAULT_CART);
        toast.success(`${name} has been added to your cart.`);
      } catch (error) {
        console.error('Failed to add item to cart:', error);
        toast.error('An error occurred while adding the item to your cart.');
      }
    },
    [getAuthToken]
  );

  const deleteItemFromCart = useCallback(
    async (id) => {
      try {
        const token = await getAuthToken();

        if (!token) return;

        const res = await fetch(`/api/cart?product=${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          toast.error('Failed to remove item from cart.');
          return;
        }

        const data = await res.json();

        setCart(data.cart || DEFAULT_CART);
        toast.info('Item removed from cart.');
      } catch (error) {
        console.error('Failed to remove item from cart:', error);
        toast.error('An error occurred while removing the item from your cart.');
      }
    },
    [getAuthToken]
  );

  const clearCart = useCallback(async () => {
    try {
      const token = await getAuthToken();

      if (!token) return;

      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        toast.error('Failed to clear cart.');
        return;
      }

      const data = await res.json();

      setCart(data.cart || DEFAULT_CART);
      toast.info('Cart cleared successfully.');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('An error occurred while clearing your cart.');
    }
  }, [getAuthToken]);

  const value = useMemo(
    () => ({
      cart,
      addItemToCart,
      deleteItemFromCart,
      clearCart,
    }),
    [cart, addItemToCart, deleteItemFromCart, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
