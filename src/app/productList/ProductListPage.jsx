'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';

import axios from 'axios';
import queryString from 'query-string';

import ProductList from './ProductList';

const ProductListPage = () => {
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);

  const [productData, setProductData] = useState({
    products: [],
    totalPages: 1,
  });

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const rating = searchParams.get('rating') || '';

  const searchQuery = useMemo(() => {
    return queryString.stringify(
      {
        keyword,
        page: currentPage,
        category,
        sort,
        rating,
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );
  }, [keyword, currentPage, category, sort, rating]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, category, sort, rating]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`/api/product?${searchQuery}`);
        setProductData(response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, [searchQuery]);

  return (
    <div>
      <ProductList allProductData={productData} />

      <div className="flex justify-center mt-6">
        <ReactPaginate
          onPageChange={handlePageClick}
          pageCount={productData?.totalPages || 1}
          forcePage={currentPage - 1}
          previousLabel={<span>&lt; Previous</span>}
          nextLabel={<span>Next &gt;</span>}
          pageClassName="flex items-center mx-2 text-gray-600 hover:text-blue-500 cursor-pointer border border-gray-300 px-3 rounded-md transition duration-300 ease-in-out"
          activeClassName="font-bold text-blue-500 bg-blue-100 border-blue-500"
          containerClassName="pagination flex space-x-2"
          previousClassName="flex items-center mx-2 text-gray-600 hover:text-blue-500 cursor-pointer border border-gray-300 px-2 rounded-md transition duration-300 ease-in-out"
          nextClassName="flex items-center mx-2 text-gray-600 hover:text-blue-500 cursor-pointer border border-gray-300 px-2 rounded-md transition duration-300 ease-in-out"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default ProductListPage;
