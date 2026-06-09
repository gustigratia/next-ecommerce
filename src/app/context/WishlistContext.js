'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { useFirebaseAppContext } from './FirebaseContext';

const WishlistContext = createContext(null);

const DEFAULT_WISHLIST = {
  wishlistItems: [],
};

export const WishlistProvider = ({ children }) => {
  const { user, loading } = useFirebaseAppContext();
  const [wishlist, setWishlist] = useState(DEFAULT_WISHLIST);

  const getAuthToken = useCallback(async () => {
    if (!user) return null;

    return user.getIdToken();
  }, [user]);

  const fetchWishlist = useCallback(async () => {
    try {
      const token = await getAuthToken();

      if (!token) {
        setWishlist(DEFAULT_WISHLIST);
        return;
      }

      const res = await fetch('/api/wishlist', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setWishlist(DEFAULT_WISHLIST);
        return;
      }

      const data = await res.json();

      setWishlist(data.wishlist || DEFAULT_WISHLIST);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      setWishlist(DEFAULT_WISHLIST);
    }
  }, [getAuthToken]);

  useEffect(() => {
    if (!loading) {
      fetchWishlist();
    }
  }, [loading, fetchWishlist]);

  const addToWishlist = useCallback(
    async (product) => {
      try {
        const token = await getAuthToken();

        if (!token) {
          toast.warn('Please sign in to add items to your wishlist.');
          return;
        }

        const item = {
          product: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product?.images?.[0]?.url || '',
          ratings: product.ratings || 0,
          stock: product.stock,
          seller: product.seller,
        };

        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(item),
        });

        if (!res.ok) {
          const errorData = await res.json();

          toast.error(`Failed to add item to wishlist: ${errorData.error || res.statusText}`);

          return;
        }

        const data = await res.json();

        setWishlist(data.wishlist || DEFAULT_WISHLIST);
        toast.success(`${product.name} has been added to your wishlist.`);
      } catch (error) {
        console.error('Failed to add item to wishlist:', error);
        toast.error('An error occurred while adding the item to your wishlist.');
      }
    },
    [getAuthToken]
  );

  const removeFromWishlist = useCallback(
    async (productId) => {
      try {
        const token = await getAuthToken();

        if (!token) return;

        const res = await fetch(`/api/wishlist?product=${productId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          toast.error('Failed to remove item from wishlist.');
          return;
        }

        const data = await res.json();

        setWishlist(data.wishlist || DEFAULT_WISHLIST);
        toast.info('Item removed from wishlist.');
      } catch (error) {
        console.error('Failed to remove item from wishlist:', error);
        toast.error('An error occurred while removing the item from your wishlist.');
      }
    },
    [getAuthToken]
  );

  const isInWishlist = useCallback(
    (productId) =>
      wishlist.wishlistItems.some((item) => String(item.product) === String(productId)),
    [wishlist.wishlistItems]
  );

  const toggleWishlist = useCallback(
    async (product) => {
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product);
      }
    },
    [isInWishlist, removeFromWishlist, addToWishlist]
  );

  const clearWishlist = useCallback(async () => {
    try {
      const token = await getAuthToken();

      if (!token) return;

      const res = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        toast.error('Failed to clear wishlist.');
        return;
      }

      const data = await res.json();

      setWishlist(data.wishlist || DEFAULT_WISHLIST);
      toast.info('Wishlist cleared successfully.');
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
      toast.error('An error occurred while clearing your wishlist.');
    }
  }, [getAuthToken]);

  const value = useMemo(
    () => ({
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      clearWishlist,
    }),
    [wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, clearWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }

  return context;
};

export default WishlistContext;
