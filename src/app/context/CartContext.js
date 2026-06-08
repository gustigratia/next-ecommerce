'use client';

import { createContext, useEffect, useState } from 'react';

import { useFirebaseAppContext } from './FirebaseContext';

const CartContext = createContext({
  cart: { cartItems: [] },
  addItemToCart: async () => {},
  deleteItemFromCart: async () => {},
  clearCart: async () => {},
});

export const CartProvider = ({ children }) => {
  const { user, loading } = useFirebaseAppContext();

  const [cart, setCart] = useState({ cartItems: [] });

  const normalizeCart = (cartData) => {
    return {
      ...cartData,
      cartItems: Array.isArray(cartData?.cartItems) ? cartData.cartItems : [],
    };
  };

  const getAuthToken = async () => {
    if (!user) return null;
    return user.getIdToken();
  };

  const fetchCart = async () => {
    try {
      const token = await getAuthToken();

      if (!token) {
        setCart({ cartItems: [] });
        return;
      }

      const res = await fetch('/api/cart', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setCart({ cartItems: [] });
        return;
      }

      const data = await res.json();
      setCart(normalizeCart(data.cart));
    } catch (error) {
      setCart({ cartItems: [] });
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchCart();
    }
  }, [user, loading]);

  const addItemToCart = async ({ product, name, price, image, stock, seller, quantity = 1 }) => {
    const token = await getAuthToken();

    if (!token) {
      alert('Please login first');
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
      alert('Failed to update cart');
      return;
    }

    const data = await res.json();
    setCart(normalizeCart(data.cart));
  };

  const deleteItemFromCart = async (id) => {
    const token = await getAuthToken();

    if (!token) return;

    const res = await fetch(`/api/cart?product=${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      alert('Failed to remove item from cart');
      return;
    }

    const data = await res.json();
    setCart(normalizeCart(data.cart));
  };

  const clearCart = async () => {
    const token = await getAuthToken();

    if (!token) return;

    const res = await fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      alert('Failed to clear cart');
      return;
    }

    const data = await res.json();
    setCart(normalizeCart(data.cart));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItemToCart,
        deleteItemFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
