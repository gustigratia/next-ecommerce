'use client';

import Link from 'next/link';
import { useContext } from 'react';
import StarRatings from 'react-star-ratings';

import CartContext from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItemToCart } = useContext(CartContext);

  if (wishlist.length === 0) {
    return (
      <section className="py-24 text-center">
        <i className="far fa-heart text-7xl text-gray-200 mb-6 block"></i>
        <h2 className="text-2xl font-semibold text-gray-500 mb-2">Wishlist kamu masih kosong</h2>
        <p className="text-gray-400 mb-8">Klik ikon ❤️ di product card untuk menyimpan produk favorit</p>
        <Link
          href="/productList"
          className="inline-flex items-center gap-2 text-white bg-red-800 py-3 px-8 rounded-lg hover:bg-red-700 transition"
        >
          <i className="fas fa-shopping-bag"></i>
          Lihat Produk
        </Link>
      </section>
    );
  }

  return (
    <section className="container max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <i className="fas fa-heart text-red-500"></i>
        Wishlist
        <span className="text-base font-normal text-gray-500">({wishlist.length} produk)</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {wishlist.map((product) => (
          <div
            key={product._id}
            className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="relative overflow-hidden h-48">
              <img
                src={product?.images?.[0]?.url || ''}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button
                onClick={() => removeFromWishlist(product._id)}
                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform"
                title="Hapus dari wishlist"
              >
                <i className="fas fa-heart text-red-500"></i>
              </button>
            </div>
            <div className="p-4">
              <Link href={`/productList/${product._id}`}>
                <h3 className="font-semibold text-gray-900 hover:text-red-900 transition line-clamp-2 mb-2">
                  {product.name}
                </h3>
              </Link>
              <div className="mb-2">
                <StarRatings
                  rating={product?.ratings || 0}
                  starRatedColor="#FFD700"
                  numberOfStars={5}
                  starDimension="14px"
                  starSpacing="1px"
                  name={`rating-${product._id}`}
                />
              </div>
              <p className="text-xl font-bold text-gray-900 mb-3">
                ₹{Number(product?.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <button
                onClick={() => addItemToCart({
                  product: product._id,
                  name: product.name,
                  price: product.price,
                  image: product.images[0].url,
                  stock: product.stock,
                  seller: product.seller,
                })}
                className="w-full flex items-center justify-center gap-2 text-white bg-yellow-600 hover:bg-yellow-700 active:scale-95 transition-all py-2 rounded-lg text-sm font-medium"
              >
                <i className="fa-solid fa-cart-shopping"></i>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}