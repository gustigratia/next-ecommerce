/**
 * NavBar component renders the application navigation bar with the logo, search bar, cart link, and user authentication links.
 * Utilizes Next.js Link for client-side navigation.
 * @returns {JSX.Element} - Rendered component for the navigation bar.
 */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';

import Logo from '@/../public/svg/logo-no-background.svg';
import { useFirebaseAppContext } from '@/app/context/FirebaseContext';

import CartContext from '../../context/CartContext';
import Container from '../Container';
import Search from './Search';

/**
 * NavBar component renders the application navigation bar with the logo, search bar, cart link, and user authentication links.
 * Utilizes Next.js Link for client-side navigation.
 * @returns {JSX.Element} - Rendered component for the navigation bar.
 */

/**
 * NavBar component renders the application navigation bar with the logo, search bar, cart link, and user authentication links.
 * Utilizes Next.js Link for client-side navigation.
 * @returns {JSX.Element} - Rendered component for the navigation bar.
 */

/**
 * NavBar component renders the application navigation bar with the logo, search bar, cart link, and user authentication links.
 * Utilizes Next.js Link for client-side navigation.
 * @returns {JSX.Element} - Rendered component for the navigation bar.
 */

const NavBar = () => {
  // Retrieve user information from Firebase context
  const { user } = useFirebaseAppContext();

  // Retrieve cart information from CartContext
  const { cart } = useContext(CartContext);
  const cartItems = cart?.cartItems;
  // Render the navigation bar
  return (
    <div className="sticky top-0 w-full bg-red-950 z-30 shadow-xl text-white">
      <div className="py-2 border-b-[1px]">
        <Container>
          <div className="flex items-center justify-between gap-3 md:gap-0">
            {/* Logo with link to home page */}
            <Link href="/">
              <div className="max-h-[55px] overflow-hidden flex justify-center items-center">
                <Image src={Logo} alt="logo_img" width={180} height={50} />
              </div>
            </Link>
            {/* Search component */}
            <div className="hidden md:block">
              <Search />
            </div>
            {/* Cart and User authentication links */}
            <div className="flex items-center gap-3">
              {/* Cart link */}
              <Link
                href="/cart"
                className="px-3 py-2 inline-block text-center text-yellow-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300"
              >
                <i className="text-yellow-600 w-5 fa fa-shopping-cart"></i>
                <span className="hidden lg:inline ml-1">
                  Cart (<b>{cartItems?.length || 0}</b>)
                </span>
              </Link>
              {/* User profile link if user is authenticated, otherwise Sign in/Sign up link */}
              {user ? (
                <Link
                  href="userProfile"
                  className="px-3 py-2 inline-block text-center text-yellow-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300"
                >
                  <h1 className="font-bold">
                    <i class="fa-solid fa-user mr-1"></i>
                    {user.displayName}
                  </h1>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-3 py-2 inline-block text-center text-yellow-700 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300"
                >
                  <i className="text-yellow-600 w-5 fa fa-user"></i>
                  <span className="hidden lg:inline ml-1">Sign in/Sign up</span>
                </Link>
              )}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default NavBar;
