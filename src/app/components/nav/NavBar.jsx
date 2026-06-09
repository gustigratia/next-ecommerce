'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useState } from 'react';

import Logo from '@/../public/svg/logo-no-background.svg';
import { useFirebaseAppContext } from '@/app/context/FirebaseContext';

import CartContext from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import Container from '../Container';
import Search from './Search';

<<<<<<< HEAD
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

/**
 * NavBar component renders the application navigation bar with the logo, search bar, cart link, and user authentication links.
 * Utilizes Next.js Link for client-side navigation.
 * @returns {JSX.Element} - Rendered component for the navigation bar.
 */

=======
>>>>>>> 2861b1fc576152c58ca8124d43ae7a58c2efb556
const NavBar = () => {
  const { user } = useFirebaseAppContext();
  const { cart } = useContext(CartContext);
  const { wishlist } = useWishlist();
  const cartItems = cart?.cartItems;
  const cartItemCount = cartItems?.length || 0;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 w-full bg-red-950 z-30 shadow-xl text-white">
      <div className="py-2 border-b border-red-900">
        <Container>
          <div className="flex items-center justify-between gap-3 md:gap-0">
            {/* Logo */}
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <div className="max-h-[55px] overflow-hidden flex justify-center items-center">
                <Image src={Logo} alt="logo_img" width={180} height={50} />
              </div>
            </Link>

            {/* Search — hanya tampil di desktop */}
            <div className="hidden md:block flex-1 max-w-md mx-6">
              <Search />
            </div>

            {/* Tombol-tombol — desktop */}
            <div className="hidden md:flex items-center gap-2">
              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative px-3 py-2 inline-flex items-center gap-1.5 text-yellow-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-50 transition text-sm"
              >
                <i className="fa fa-heart"></i>
                <span className="hidden lg:inline">Wishlist</span>
                {wishlist.wishlistItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                    {wishlist.wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative px-3 py-2 inline-flex items-center gap-1.5 text-yellow-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-50 transition text-sm"
              >
                <i className="fa fa-shopping-cart"></i>
                <span className="hidden lg:inline">Cart</span>

                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-bold leading-none">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* User */}
              {user ? (
                <Link
                  href="/userProfile"
                  className="px-3 py-2 inline-flex items-center gap-1.5 text-yellow-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-50 transition text-sm"
                >
                  <i className="fa-solid fa-user"></i>
                  <span className="font-semibold hidden lg:inline max-w-[120px] truncate">
                    {user.displayName}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-3 py-2 inline-flex items-center gap-1.5 text-yellow-700 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-50 transition text-sm"
                >
                  <i className="fa fa-user"></i>
                  <span className="hidden lg:inline">Sign in / Sign up</span>
                </Link>
              )}
            </div>

            {/* Hamburger — mobile */}
            <button
              className="md:hidden text-white p-2 rounded hover:bg-red-900 transition"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>

          {/* Search bar mobile — selalu tampil di mobile */}
          <div className="md:hidden mt-2 pb-1">
            <Search />
          </div>
        </Container>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-red-900 border-t border-red-800 px-4 py-3 flex flex-col gap-2">
          <Link
            href="/wishlist"
            className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
            onClick={() => setMenuOpen(false)}
          >
            <span className="flex items-center gap-2">
              <i className="fa fa-heart text-red-300 w-4"></i>
              Wishlist
            </span>
            {wishlist.wishlistItems.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {wishlist.wishlistItems.length}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
            onClick={() => setMenuOpen(false)}
          >
            <span className="flex items-center gap-2">
              <i className="fa fa-shopping-cart text-yellow-300 w-4"></i>
              Cart
            </span>
            {cartItemCount > 0 && (
              <span className="bg-yellow-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>

          {user ? (
            <Link
              href="/userProfile"
              className="flex items-center gap-2 py-2.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
              onClick={() => setMenuOpen(false)}
            >
              <i className="fa-solid fa-user text-blue-300 w-4"></i>
              {user.displayName}
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 py-2.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
              onClick={() => setMenuOpen(false)}
            >
              <i className="fa fa-user text-blue-300 w-4"></i>
              Sign in / Sign up
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default NavBar;
