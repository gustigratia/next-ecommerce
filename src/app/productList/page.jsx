'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

import axios from 'axios';
import queryString from 'query-string';

import ProductList from './ProductList';

const getPaginationItems = (currentPage, totalPages) => {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [1];

  if (currentPage > 3) {
    pages.push('left-ellipsis');
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) {
    pages.push('right-ellipsis');
  }

  pages.push(totalPages);

  return pages;
};

const Page = () => {
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

  const totalPages = Math.max(Number(productData?.totalPages) || 1, 1);
  const paginationItems = getPaginationItems(currentPage, totalPages);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, category, sort, rating]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        console.log('API query:', searchQuery);

        const response = await axios.get(`/api/product?${searchQuery}`);
        setProductData(response.data);
      } catch (error) {}
    };

    fetchProductData();
  }, [searchQuery]);

  return (
    <div>
      <ProductList allProductData={productData} />

      {totalPages > 1 && (
        <nav
          data-cy="pagination"
          className="pagination flex items-center justify-center gap-2 mt-6"
        >
          <button
            data-cy="pagination-prev"
            type="button"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className="flex items-center mx-2 text-gray-600 hover:text-blue-500 cursor-pointer border border-gray-300 px-3 py-2 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &lt; Previous
          </button>

          {paginationItems.map((item) => {
            if (typeof item === 'string') {
              return (
                <span key={item} className="px-3 py-2 text-gray-500">
                  ...
                </span>
              );
            }

            return (
              <button
                data-cy={`pagination-page-${item}`}
                key={item}
                type="button"
                onClick={() => goToPage(item)}
                className={`flex items-center mx-1 cursor-pointer border px-3 py-2 rounded-md transition duration-300 ease-in-out ${
                  currentPage === item
                    ? 'font-bold text-blue-500 bg-blue-100 border-blue-500'
                    : 'text-gray-600 border-gray-300 hover:text-blue-500'
                }`}
              >
                {item}
              </button>
            );
          })}

          <button
            data-cy="pagination-next"
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
            className="flex items-center mx-2 text-gray-600 hover:text-blue-500 cursor-pointer border border-gray-300 px-3 py-2 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next &gt;
          </button>
        </nav>
      )}
    </div>
  );
};

export default Page;
