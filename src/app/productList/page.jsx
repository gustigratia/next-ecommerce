/**
 * Page component is responsible for rendering a paginated list of products based on the provided search parameters.
 * It uses the ProductList component to display the products and ReactPaginate for pagination.
 * @param {Object} props - Component properties.
 * @param {Object} props.searchParams - Object containing search parameters like keyword, category, sort, and rating.
 * @returns {JSX.Element} - Rendered Page component.
 */
'use client';

import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

import axios from 'axios';
import queryString from 'query-string';

import ProductList from './ProductList';

/**
 * Page component is responsible for rendering a paginated list of products based on the provided search parameters.
 * It uses the ProductList component to display the products and ReactPaginate for pagination.
 * @param {Object} props - Component properties.
 * @param {Object} props.searchParams - Object containing search parameters like keyword, category, sort, and rating.
 * @returns {JSX.Element} - Rendered Page component.
 */

/**
 * Page component is responsible for rendering a paginated list of products based on the provided search parameters.
 * It uses the ProductList component to display the products and ReactPaginate for pagination.
 * @param {Object} props - Component properties.
 * @param {Object} props.searchParams - Object containing search parameters like keyword, category, sort, and rating.
 * @returns {JSX.Element} - Rendered Page component.
 */

/**
 * Page component is responsible for rendering a paginated list of products based on the provided search parameters.
 * It uses the ProductList component to display the products and ReactPaginate for pagination.
 * @param {Object} props - Component properties.
 * @param {Object} props.searchParams - Object containing search parameters like keyword, category, sort, and rating.
 * @returns {JSX.Element} - Rendered Page component.
 */

const Page = ({ searchParams }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productData, setProductData] = useState([]);

  // Construct URL parameters for the API request
  const urlParams = {
    keyword: searchParams.keyword,
    page: currentPage,
    category: searchParams.category,
    sort: searchParams.sort,
    rating: searchParams.rating,
  };
  // Convert URL parameters to a query string
  const searchQuery = queryString.stringify(urlParams);

  // Handle page change in the pagination component
  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1);
  };

  useEffect(() => {
    // Fetch product data based on the search parameters and current page
    const fetchInitialData = async () => {
      try {
        const response = await axios.get(`/api/product?${searchQuery}`);
        setProductData(response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };
    // Call the fetchInitialData function when the component mounts or when the currentPage or searchParams change
    fetchInitialData();
  }, [currentPage, searchParams]);

  return (
    <div>
      <ProductList allProductData={productData} />
      <ReactPaginate
        onPageChange={handlePageClick}
        pageCount={10}
        pageClassName="flex items-center mx-2 text-gray-600 hover:text-blue-500 cursor-pointer border border-gray-300 px-3 rounded-md transition duration-300 ease-in-out"
        activeClassName="font-bold text-blue-500 bg-blue-100 border-blue-500"
        containerClassName="pagination flex space-x-2"
        previousClassName="flex items-center mx-2 text-gray-600 hover:text-blue-500 cursor-pointer border border-gray-300 px-2 rounded-md transition duration-300 ease-in-out"
        nextClassName="flex items-center mx-2 text-gray-600 hover:text-blue-500 cursor-pointer border border-gray-300 px-2 rounded-md transition duration-300 ease-in-out"
        previousLabel={<span>&lt; Previous</span>}
        nextLabel={<span>Next &gt;</span>}
      />
    </div>
  );
};

export default Page;
