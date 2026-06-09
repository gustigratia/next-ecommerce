'use client';

import Link from 'next/link';
import React, { useContext } from 'react';
import StarRatings from 'react-star-ratings';

import CartContext from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

/**
 * ProductItem component is responsible for rendering an individual product in a styled card format.
 * It displays product information such as name, image, ratings, description, price, and provides an option to add the product to the cart.
 * @param {Object} props - Component properties.
 * @param {Object} props.product - Object containing details of the product to be displayed.
 * @returns {JSX.Element} - Rendered ProductItem component.
 */

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
    <article className="border border-gray-200 overflow-hidden bg-white shadow-sm rounded-xl mb-5 hover:shadow-lg transition-shadow duration-300 group">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 flex p-3 relative overflow-hidden">
          <img
            src={productImage}
            alt={product.name}
            className="object-contain max-h-52 w-full transition-transform duration-300 group-hover:scale-105"
          />

          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <i
              className={`${
                inWishlist ? 'fas text-red-500' : 'far text-gray-400'
              } fa-heart text-sm`}
            />
          </button>
        </div>

        <div className="md:w-2/4">
          <div className="p-4">
            <Link href={`/productList/${product._id}`} className="hover:underline">
              <h2 className="text-xl font-semibold text-gray-900 hover:text-red-900 transition-colors line-clamp-2">
                {product.name}
              </h2>
            </Link>

            <div className="flex flex-wrap items-center gap-2 my-2">
              <StarRatings
                rating={product?.ratings || 0}
                starRatedColor="#FFD700"
                numberOfStars={5}
                starDimension="18px"
                starSpacing="1px"
                name={`rating-${product._id}`}
              />

              <span className="text-gray-500 text-sm">({product?.ratings || 0})</span>
            </div>

            <p className="text-gray-600 mb-2 line-clamp-3 text-sm leading-relaxed">
              {product?.description}
            </p>

            {product?.seller && (
              <p className="text-xs text-gray-400">
                <i className="fas fa-store mr-1" />
                {product.seller}
              </p>
            )}
          </div>
        </div>

        <div className="md:w-1/4 border-t lg:border-t-0 lg:border-l-2 border-gray-100 flex flex-col justify-center items-center">
          <div className="p-5 text-center w-full">
            <span className="text-2xl font-bold text-gray-900">
              ₹
              {Number(product?.price).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>

            <p className="text-green-600 text-sm mt-1">
              <i className="fas fa-truck mr-1" />
              Free Shipping
            </p>

            {product?.stock > 0 ? (
              <span className="inline-block mt-2 text-xs text-green-700 bg-green-100 px-3 py-0.5 rounded-full font-medium">
                In Stock ({product.stock})
              </span>
            ) : (
              <span className="inline-block mt-2 text-xs text-red-700 bg-red-100 px-3 py-0.5 rounded-full font-medium">
                Out of Stock
              </span>
            )}

            <button
              type="button"
              className="mt-4 w-full text-white bg-yellow-600 border border-transparent rounded-lg hover:bg-yellow-700 active:scale-95 transition-all duration-200 cursor-pointer px-4 py-2.5 flex items-center justify-center gap-2 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={addToCartHandler}
              disabled={!product?.stock || product.stock === 0}
            >
              <i className="fa-solid fa-cart-shopping" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductItem;
