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

const NavBar = () => {
  const { user } = useFirebaseAppContext();
  const { cart } = useContext(CartContext);
  const { wishlist } = useWishlist();
  const cartItems = cart?.cartItems;
  const cartItemCount = cartItems?.length || 0;
  const wishlistItemCount = wishlist?.wishlistItems?.length || 0;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-white text-red-700 py-2 text-center font-bold text-xs md:text-sm shadow-sm border-b border-red-100">
        <span className="inline-flex items-center justify-center gap-2 px-4">
          <span className="h-2 w-8 rounded-full bg-red-600" />
          <span>Rayakan Kemerdekaan Indonesia 17 Agustus bersama Promo Merah Putih Istimewa</span>
          <span className="h-2 w-8 rounded-full bg-red-600" />
        </span>
      </div>

      <div className="sticky top-0 w-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 z-30 shadow-xl text-white">
        <div className="py-3 border-b border-white/15">
          <Container>
            <div className="flex items-center justify-between gap-3 md:gap-0">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                <div className="max-h-[55px] overflow-hidden flex justify-center items-center">
                  <Image src={Logo} alt="logo_img" width={180} height={50} />
                </div>
              </Link>

              <div className="hidden md:block flex-1 max-w-md mx-6">
                <Search />
              </div>

              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/wishlist"
                  className="relative px-3 py-2 inline-flex items-center gap-1.5 text-red-700 bg-white shadow-sm border border-white/80 rounded-md hover:bg-red-50 transition text-sm font-semibold"
                >
                  <i className="fa fa-heart"></i>
                  <span className="hidden lg:inline">Wishlist</span>
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-700 ring-2 ring-white text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold leading-none">
                      {wishlistItemCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/cart"
                  className="relative px-3 py-2 inline-flex items-center gap-1.5 text-red-700 bg-white shadow-sm border border-white/80 rounded-md hover:bg-red-50 transition text-sm font-semibold"
                >
                  <i className="fa fa-shopping-cart"></i>
                  <span className="hidden lg:inline">Cart</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-700 ring-2 ring-white text-white text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center font-bold leading-none">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {user ? (
                  <Link
                    href="/userProfile"
                    className="px-3 py-2 inline-flex items-center gap-1.5 text-red-700 bg-white shadow-sm border border-white/80 rounded-md hover:bg-red-50 transition text-sm"
                  >
                    <i className="fa-solid fa-user"></i>
                    <span className="font-semibold hidden lg:inline max-w-[120px] truncate">
                      {user.displayName}
                    </span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="px-3 py-2 inline-flex items-center gap-1.5 text-red-700 bg-white shadow-sm border border-white/80 rounded-md hover:bg-red-50 transition text-sm font-semibold"
                  >
                    <i className="fa fa-user"></i>
                    <span className="hidden lg:inline">Sign in / Sign up</span>
                  </Link>
                )}
              </div>

              <button
                className="md:hidden text-white p-2 rounded-md hover:bg-white/15 transition"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>

            <div className="md:hidden mt-3 pb-1">
              <Search />
            </div>
          </Container>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-red-800 border-t border-white/15 px-4 py-3 flex flex-col gap-2 shadow-lg">
            <Link
              href="/wishlist"
              className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
              onClick={() => setMenuOpen(false)}
            >
              <span className="flex items-center gap-2">
                <i className="fa fa-heart text-white w-4"></i>
                Wishlist
              </span>
              {wishlistItemCount > 0 && (
                <span className="bg-white text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
              onClick={() => setMenuOpen(false)}
            >
              <span className="flex items-center gap-2">
                <i className="fa fa-shopping-cart text-white w-4"></i>
                Cart
              </span>
              {cartItemCount > 0 && (
                <span className="bg-white text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">
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
                <i className="fa-solid fa-user text-white w-4"></i>
                {user.displayName}
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 py-2.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
                onClick={() => setMenuOpen(false)}
              >
                <i className="fa fa-user text-white w-4"></i>
                Sign in / Sign up
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default NavBar;
