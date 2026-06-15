'use client';

import Link from 'next/link';
import React, { useContext } from 'react';
import StarRatings from 'react-star-ratings';

import CartContext from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductItem = ({ product }) => {
  const { addItemToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const productImage = product?.images?.[0]?.url || 'https://via.placeholder.com/300';
  const inWishlist = isInWishlist(product._id);

  const addToCartHandler = () => {
    addItemToCart({
      product: product._id,
      name: product.name,
      price: product.price,
      image: productImage,
      stock: product.stock,
      seller: product.seller,
    });
  };

  return (
    <article className="border-2 border-red-300 overflow-hidden bg-white shadow-lg rounded-xl mb-5 hover:shadow-2xl transition-shadow duration-300 group">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 flex p-3 relative overflow-hidden bg-red-50">
          <img
            src={productImage}
            alt={product.name}
            className="object-contain max-h-52 w-full transition-transform duration-300 group-hover:scale-105"
          />

          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            className="absolute top-4 right-4 w-10 h-10 bg-red-600 rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 hover:scale-110 active:scale-95 transition-all duration-200"
            aria-label={inWishlist ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
          >
            <i
              className={`${
                inWishlist ? 'fas text-white' : 'far text-white'
              } fa-heart text-lg`}
            />
          </button>
        </div>

        <div className="md:w-2/4">
          <div className="p-4">
            <Link href={`/productList/${product._id}`} className="hover:underline">
              <h2 className="text-xl font-bold text-red-700 hover:text-red-600 transition-colors line-clamp-2">
                {product.name}
              </h2>
            </Link>

            <div className="flex flex-wrap items-center gap-2 my-2">
              <StarRatings
                rating={product?.ratings || 0}
                starRatedColor="#DC143C"
                numberOfStars={5}
                starDimension="18px"
                starSpacing="1px"
                name={`rating-${product._id}`}
              />

              <span className="text-gray-600 text-sm font-semibold">({product?.ratings || 0})</span>
            </div>

            <p className="text-gray-700 mb-2 line-clamp-3 text-sm leading-relaxed">
              {product?.description}
            </p>

            {product?.seller && (
              <p className="text-xs text-gray-600 font-semibold">
                <i className="fas fa-store mr-1 text-red-600" />
                {product.seller}
              </p>
            )}
          </div>
        </div>

        <div className="md:w-1/4 border-t lg:border-t-0 lg:border-l-2 border-red-300 flex flex-col justify-center items-center">
          <div className="p-5 text-center w-full">
            <span className="text-3xl font-bold text-red-600">
              £
              {Number(product?.price).toLocaleString('id-ID', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>

            <p className="text-red-600 text-sm mt-1 font-bold">
              <i className="fas fa-truck mr-1" />
              Pengiriman Gratis
            </p>

            {product?.stock > 0 ? (
              <span className="inline-block mt-2 text-xs text-white bg-red-600 px-3 py-0.5 rounded-full font-bold">
                Tersedia ({product.stock})
              </span>
            ) : (
              <span className="inline-block mt-2 text-xs text-white bg-gray-400 px-3 py-0.5 rounded-full font-bold">
                Habis Terjual
              </span>
            )}

            <button
              type="button"
              className="mt-4 w-full text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 active:scale-95 transition-all duration-200 cursor-pointer px-4 py-2.5 flex items-center justify-center gap-2 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              onClick={addToCartHandler}
              disabled={!product?.stock || product.stock === 0}
            >
              <i className="fa-solid fa-cart-shopping" />
              Tambah ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductItem;
