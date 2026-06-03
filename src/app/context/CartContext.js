'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { useFirebaseAppContext } from './FirebaseContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, loading } = useFirebaseAppContext();

  const [cart, setCart] = useState({ cartItems: [] });

  const getCartKey = () => {
    if (!user?.uid) return null;
    return `cart_${user.uid}`;
  };

  useEffect(() => {
    if (!loading) {
      setCartToState();
    }
  }, [user, loading]);

  const setCartToState = () => {
    const cartKey = getCartKey();

    if (!cartKey) {
      setCart({ cartItems: [] });
      return;
    }

    const storedCart = localStorage.getItem(cartKey);

    setCart(storedCart ? JSON.parse(storedCart) : { cartItems: [] });
  };

  const addItemToCart = async ({ product, name, price, image, stock, seller, quantity = 1 }) => {
    const cartKey = getCartKey();

    if (!cartKey) {
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

    const isItemExist = cart?.cartItems?.find((i) => i.product === item.product);

    let newCartItems;

    if (isItemExist) {
      newCartItems = cart.cartItems.map((i) => (i.product === isItemExist.product ? item : i));
    } else {
      newCartItems = [...(cart.cartItems || []), item];
    }

    const newCart = { cartItems: newCartItems };

    localStorage.setItem(cartKey, JSON.stringify(newCart));
    setCart(newCart);
  };

  const deleteItemFromCart = (id) => {
    const cartKey = getCartKey();

    if (!cartKey) {
      return;
    }

    const newCartItems = cart?.cartItems?.filter((i) => i.product !== id);

    const newCart = { cartItems: newCartItems };

    localStorage.setItem(cartKey, JSON.stringify(newCart));
    setCart(newCart);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItemToCart,
        deleteItemFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
