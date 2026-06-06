/**
 * SimilarProductCard Component displays a card for a similar product, including product details.
 * @param {Object} similarProduct - Object containing details of the similar product.
 * @returns {JSX.Element} - Rendered component with similar product card layout.
 */
import React from 'react';
import StarRatings from 'react-star-ratings';

const SimilarProductCard = ({ similarProduct }) => {
  return (
    <div className="w-full max-w-[320px] bg-slate-50 border border-gray-200 hover:bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      {/* Product image with a link to the product page */}
      <a href={`/productList/${similarProduct._id}`}>
        <img
          className="p-3 w-full h-52 object-contain rounded-t-lg"
          src={similarProduct.images[0].url}
          alt="product image"
        />
      </a>
      <div className="px-5 pb-5">
        {/* Product name with a link to the product page */}
        <a href="#">
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {similarProduct.name.slice(0, 30)}
          </h5>
        </a>
        {/* Star ratings component for product ratings */}
        <div className="ratings">
          <div className="my-1">
            <StarRatings
              rating={similarProduct?.ratings}
              starRatedColor="#FFD700"
              numberOfStars={5}
              starDimension="18px"
              starSpacing="1px"
              name="rating"
            />
          </div>
        </div>
        {/* Display product price and add to cart button */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹ {similarProduct?.price.toLocaleString()}
          </span>
          <div className="my-3 text-white bg-yellow-600 border border-transparent rounded-md hover:bg-yellow-800 cursor-pointer px-2 py-2 flex items-center">
            <i className="fa-solid fa-cart-shopping"></i>
            <a className="ml-2" role="button">
              Add to Cart
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimilarProductCard;
