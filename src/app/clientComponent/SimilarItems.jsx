/**
 * SimilarItems Component displays a section with similar products based on the product category.
 * @param {Object[]} allProductData - Array of all product data.
 * @param {string} productCateogary - The category of the main product for which similar items are displayed.
 * @returns {JSX.Element} - Rendered component with similar product cards.
 */
'use client';

import React from 'react';

import SimilarProductCard from './SimilarProductCard';

/**
 * SimilarItems Component displays a section with similar products based on the product category.
 * @param {Object[]} allProductData - Array of all product data.
 * @param {string} productCateogary - The category of the main product for which similar items are displayed.
 * @returns {JSX.Element} - Rendered component with similar product cards.
 */

/**
 * SimilarItems Component displays a section with similar products based on the product category.
 * @param {Object[]} allProductData - Array of all product data.
 * @param {string} productCateogary - The category of the main product for which similar items are displayed.
 * @returns {JSX.Element} - Rendered component with similar product cards.
 */

/**
 * SimilarItems Component displays a section with similar products based on the product category.
 * @param {Object[]} allProductData - Array of all product data.
 * @param {string} productCateogary - The category of the main product for which similar items are displayed.
 * @returns {JSX.Element} - Rendered component with similar product cards.
 */

/**
 * SimilarItems Component displays a section with similar products based on the product category.
 * @param {Object[]} allProductData - Array of all product data.
 * @param {string} productCateogary - The category of the main product for which similar items are displayed.
 * @returns {JSX.Element} - Rendered component with similar product cards.
 */

const SimilarItems = ({ allProductData, productCateogary }) => {
  // Filter products based on the specified category
  const allRelatedProducts = allProductData.filter(
    (product) => product.category === productCateogary
  );

  return (
    <div className="border-t-2 border-red-100">
      <h1 className="text-center py-6 text-2xl font-extrabold text-yellow-600">{`similar ${productCateogary.toLowerCase()} items`}</h1>
      <div className="flex flex-row gap-2">
        {allRelatedProducts.slice(0, 4).map((similarProduct) => (
          <SimilarProductCard key={similarProduct._id} similarProduct={similarProduct} />
        ))}
      </div>
    </div>
  );
};

export default SimilarItems;
