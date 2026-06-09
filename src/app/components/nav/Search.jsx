/**
 * Search Component provides a search input and button for searching products.
 * It utilizes Next.js useRouter for navigation.
 * @returns {JSX.Element} - Rendered component for searching products.
 */
'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

/**
 * Search Component provides a search input and button for searching products.
 * It utilizes Next.js useRouter for navigation.
 * @returns {JSX.Element} - Rendered component for searching products.
 */

/**
 * Search Component provides a search input and button for searching products.
 * It utilizes Next.js useRouter for navigation.
 * @returns {JSX.Element} - Rendered component for searching products.
 */

/**
 * Search Component provides a search input and button for searching products.
 * It utilizes Next.js useRouter for navigation.
 * @returns {JSX.Element} - Rendered component for searching products.
 */

/**
 * Search Component provides a search input and button for searching products.
 * It utilizes Next.js useRouter for navigation.
 * @returns {JSX.Element} - Rendered component for searching products.
 */

const Search = () => {
  // State to manage the search keyword
  const [keyword, setKeyword] = useState('');
  // Next.js useRouter hook for navigation
  const router = useRouter();

  /**
   * Handles the form submission, redirects to the search page with the entered keyword.
   * If the keyword is empty, redirects to the home page.
   * @param {Event} e - Form submission event.
   */

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      router.push(`/productList/?keyword=${keyword}`);
    } else {
      router.push('/');
    }
    setKeyword('');
  };

  // Render the search form
  return (
    <form
      className="flex flex-nowrap items-center w-full order-last md:order-none mt-5 md:mt-0 md:w-2/4 lg:w-2/4"
      onSubmit={submitHandler}
    >
      <input
        className="flex-grow appearance-none border border-gray-200 bg-gray-100 rounded-s-lg py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 text-black"
        type="text"
        placeholder="Search for products..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="px-4 py-2 inline-block border border-transparent bg-yellow-600 text-white rounded-e-lg hover:bg-yellow-800"
      >
        Search
      </button>
    </form>
  );
};

export default Search;
