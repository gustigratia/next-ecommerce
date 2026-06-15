'use client';

import Link from 'next/link';
import { useContext } from 'react';
import StarRatings from 'react-star-ratings';

import CartContext from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItemToCart } = useContext(CartContext);

  const wishlistItems = wishlist.wishlistItems || [];

  if (wishlistItems.length === 0) {
    return (
      <section className="container max-w-screen-lg mx-auto px-4 py-20">
        <div className="relative overflow-hidden rounded-xl border border-red-100 bg-gradient-to-br from-white via-red-50 to-white px-6 py-16 text-center shadow-sm">
          <div className="absolute left-0 top-0 h-2 w-full bg-red-600" />
          <div className="absolute left-0 top-2 h-2 w-full bg-white" />

          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-md ring-8 ring-red-100">
            <i className="far fa-heart text-5xl text-red-500" />
          </div>

          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-red-600">
            Wishlist Merah Putih
          </p>
          <h2 className="mb-3 text-3xl font-bold text-gray-900">Wishlist masih kosong</h2>

          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
            Simpan produk favorit Anda untuk dibeli saat promo Kemerdekaan. Produk pilihan akan
            tampil di sini agar mudah dibandingkan sebelum checkout.
          </p>

          <Link
            href="/productList"
            className="inline-flex items-center gap-2 text-white bg-red-600 py-3 px-8 rounded-lg hover:bg-red-700 active:scale-95 transition font-bold shadow-md"
          >
            <i className="fas fa-shopping-bag" />
            Jelajahi Produk
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container max-w-screen-xl mx-auto px-4 py-8">
      <div className="mb-6 overflow-hidden rounded-xl border border-red-100 bg-white shadow-sm">
        <div className="h-2 bg-red-600" />
        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-red-600">
              Koleksi Kemerdekaan
            </p>
            <h1 className="mt-1 flex flex-wrap items-center gap-3 text-3xl font-bold text-gray-900">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <i className="fas fa-heart" />
              </span>
              Wishlist Favorit
              <span className="text-sm font-bold text-red-700 bg-red-50 px-3 py-1 rounded-full">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
              </span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Produk favorit Anda tersimpan untuk belanja promo merah putih.
            </p>
          </div>

          <button
            onClick={() => {
              if (confirm('Anda yakin ingin menghapus seluruh wishlist?')) {
                clearWishlist();
              }
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-700 active:scale-95"
          >
            <i className="fas fa-trash" />
            Hapus Wishlist
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {wishlistItems.map((product) => (
          <div
            key={product.product}
            className="group overflow-hidden rounded-xl border border-red-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-48 overflow-hidden bg-red-50">
              <img
                src={product?.imageUrl || ''}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-red-700 shadow-sm">
                Merdeka Deal
              </span>

              <button
                onClick={() => removeFromWishlist(product.product)}
                className="absolute top-3 right-3 w-10 h-10 bg-red-600 rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 hover:scale-110 transition-all"
                title="Hapus dari wishlist"
                aria-label="Hapus dari wishlist"
              >
                <i className="fas fa-heart text-white" />
              </button>
            </div>

            <div className="p-4">
              <Link href={`/productList/${product.product || product._id}`}>
                <h3 className="font-bold text-gray-900 hover:text-red-600 transition line-clamp-2 mb-2 text-lg">
                  {product.name}
                </h3>
              </Link>

              <div className="mb-2">
                <StarRatings
                  rating={product?.ratings || 0}
                  starRatedColor="#DC143C"
                  numberOfStars={5}
                  starDimension="16px"
                  starSpacing="1px"
                  name={`rating-${product.product || product._id}`}
                />
              </div>

              <p className="text-2xl font-bold text-red-600 mb-3">
                Rp
                {Number(product?.price).toLocaleString('id-ID', {
                  minimumFractionDigits: 0,
                })}
              </p>

              <button
                onClick={() =>
                  addItemToCart({
                    product: product.product,
                    name: product.name,
                    price: product.price,
                    image: product?.imageUrl,
                    stock: product.stock,
                    seller: product.seller,
                  })
                }
                className="w-full flex items-center justify-center gap-2 text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all py-2.5 rounded-lg text-sm font-bold shadow-md"
              >
                <i className="fa-solid fa-cart-shopping" />
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
