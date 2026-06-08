'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';

import axios from 'axios';
import queryString from 'query-string';

import ProductList from './ProductList';

const Page = ({ searchParams }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const latestRequestId = useRef(0);

  const [productData, setProductData] = useState({
    products: [],
    totalPages: 1,
  });

  const keyword = searchParams?.keyword || '';
  const category = searchParams?.category || '';
  const sort = searchParams?.sort || '';
  const rating = searchParams?.rating || '';

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
    const requestId = latestRequestId.current + 1;
    latestRequestId.current = requestId;

    const fetchProductData = async () => {
      try {
        const response = await axios.get(`/api/product?${searchQuery}`);

        // Cegah response request lama menimpa data request terbaru
        if (requestId === latestRequestId.current) {
          setProductData(response.data);
        }
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

export default Page;
