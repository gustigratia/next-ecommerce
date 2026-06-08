'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useFirebaseAppContext } from './FirebaseContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, loading } = useFirebaseAppContext();
  const [wishlist, setWishlist] = useState({ wishlistItems: [] });

  const getAuthToken = async () => {
    if (!user) return null;
    return user.getIdToken();
  };

  const fetchWishlist = async () => {
    const token = await getAuthToken();
    if (!token) {
      setWishlist({ wishlistItems: [] });
      return;
    }
    const res = await fetch('/api/wishlist', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      setWishlist({ wishlistItems: [] });
      return;
    }
    const data = await res.json();
    console.log('📦 Wishlist data dari API:', JSON.stringify(data, null, 2));
    setWishlist(data.wishlist || { wishlistItems: [] });
  };

  useEffect(() => {
    if (!loading) fetchWishlist();
  }, [user, loading]);

  const addToWishlist = async (product) => {
    const token = await getAuthToken();
    if (!token) {
      toast.warn('Silakan login terlebih dahulu! 🔒');
      return;
    }

    const item = { 
      product: product._id, 
      name: product.name, 
      price: product.price, 
      imageUrl: product?.images?.[0]?.url || '', 
      ratings: product.ratings || 0,
      stock: product.stock,
      seller: product.seller 
    };

    console.log('📤 Mengirim ke wishlist API:', JSON.stringify(item, null, 2));

    const res = await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(item),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('❌ Error response:', errorData);
      toast.error(`Gagal menambahkan ke wishlist: ${errorData.error || res.statusText}`);
      return;
    }

    const data = await res.json();
    console.log('📥 Response dari wishlist API:', JSON.stringify(data, null, 2));
    setWishlist(data.wishlist);
    toast.success(`${product.name} ditambahkan ke wishlist ❤️`);
  };

  const removeFromWishlist = async (productId) => {
    const token = await getAuthToken();
    if (!token) return;

    const res = await fetch(`/api/wishlist?product=${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      toast.error('Gagal menghapus dari wishlist');
      return;
    }

    const data = await res.json();
    setWishlist(data.wishlist);
    toast.info('Dihapus dari wishlist');
  };

  const isInWishlist = (productId) =>
    wishlist.wishlistItems.some((item) => item.product === productId);

  const toggleWishlist = async (product) => {
    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product);
    }
  };

  const clearWishlist = async () => {
    const token = await getAuthToken();
    if (!token) return;

    const res = await fetch('/api/wishlist', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      toast.error('Gagal mengosongkan wishlist');
      return;
    }

    const data = await res.json();
    setWishlist(data.wishlist);
    toast.info('Wishlist dikosongkan');
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
export default WishlistContext;