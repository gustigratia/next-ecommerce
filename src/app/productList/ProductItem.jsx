/**
 * ProductItem component is responsible for rendering an individual product in a styled card format.
 * It displays product information such as name, image, ratings, description, price, and provides an option to add the product to the cart.
 * @param {Object} props - Component properties.
 * @param {Object} props.product - Object containing details of the product to be displayed.
 * @returns {JSX.Element} - Rendered ProductItem component.
 */
'use client';

import Link from 'next/link';
import React, { useContext } from 'react';
import StarRatings from 'react-star-ratings';

import CartContext from '../context/CartContext';

/**
 * ProductItem component is responsible for rendering an individual product in a styled card format.
 * It displays product information such as name, image, ratings, description, price, and provides an option to add the product to the cart.
 * @param {Object} props - Component properties.
 * @param {Object} props.product - Object containing details of the product to be displayed.
 * @returns {JSX.Element} - Rendered ProductItem component.
 */

/**
 * ProductItem component is responsible for rendering an individual product in a styled card format.
 * It displays product information such as name, image, ratings, description, price, and provides an option to add the product to the cart.
 * @param {Object} props - Component properties.
 * @param {Object} props.product - Object containing details of the product to be displayed.
 * @returns {JSX.Element} - Rendered ProductItem component.
 */

/**
 * ProductItem component is responsible for rendering an individual product in a styled card format.
 * It displays product information such as name, image, ratings, description, price, and provides an option to add the product to the cart.
 * @param {Object} props - Component properties.
 * @param {Object} props.product - Object containing details of the product to be displayed.
 * @returns {JSX.Element} - Rendered ProductItem component.
 */

/**
 * ProductItem component is responsible for rendering an individual product in a styled card format.
 * It displays product information such as name, image, ratings, description, price, and provides an option to add the product to the cart.
 * @param {Object} props - Component properties.
 * @param {Object} props.product - Object containing details of the product to be displayed.
 * @returns {JSX.Element} - Rendered ProductItem component.
 */

const ProductItem = ({ product }) => {
  const { addItemToCart } = useContext(CartContext);

  /**
   * Handles the click event for adding the product to the cart.
   * Adds the product details to the cart using the addItemToCart function from the CartContext.
   */

  const addToCartHandler = () => {
    addItemToCart({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0].url,
      stock: product.stock,
      seller: product.seller,
    });
  };

  return (
    <article className="border border-gray-200 overflow-hidden bg-white shadow-sm rounded mb-5">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 flex p-3">
          {/* Product Image */}
          <img
            src={
              product?.images[0]
                ? product?.images[0].url
                : 'https://www.designinfo.in/wp-content/uploads/2023/01/Apple-iPhone-14-Pro-Mobile-Phone-493177786-i-1-1200Wx1200H-485x485-optimized.jpeg'
            }
            alt="product name"
            className="object-fill max-h-52"
          />
        </div>
        <div className="md:w-2/4">
          <div className="p-4">
            {/* Product Name */}
            <Link href={`/productList/${product._id}`} className="hover:underline">
              <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
            </Link>
            {/* Ratings */}
            <div className="flex flex-wrap items-center space-x-2 my-2">
              <div className="ratings">
                <div className="my-1">
                  <StarRatings
                    rating={product?.ratings}
                    starRatedColor="#FFD700"
                    numberOfStars={5}
                    starDimension="18px"
                    starSpacing="1px"
                    name="rating"
                  />
                </div>
              </div>
              <span className="text-gray-500">{product?.ratings}</span>
            </div>
            {/* Product Description */}
            <p className="text-gray-600 mb-2 line-clamp-3">{product?.description}</p>
          </div>
        </div>
        <div className="md:w-1/4 border-t lg:border-t-0 lg:border-l-2 border-gray-200 flex flex-col justify-center items-center">
          <div className="p-5">
            {/* Product Price */}
            <span className="text-2xl font-semibold text-black">
              ₹{' '}
              {Number(product?.price).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            {/* Shipping Information */}
            <p className="text-green-600">Free Shipping</p>
            {/* Add to Cart Button */}
            <button
              className="my-3 text-white bg-yellow-600 border border-transparent rounded-md hover:bg-yellow-800 cursor-pointer px-2 py-2"
              onClick={addToCartHandler}
            >
              <i className="fa-solid fa-cart-shopping"></i>
              <a className="ml-1 inline-block" role="button">
                Add to Cart
              </a>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductItem;
