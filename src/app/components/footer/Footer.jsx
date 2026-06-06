/**
 * Footer Component represents the footer section of the website, including the company logo, navigation links,
 * and copyright information.
 * @returns {JSX.Element} - Rendered component for the website footer.
 */
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Logo from '@/../../public/svg/logo-no-background.svg';

const Footer = () => {
  return (
    <footer className="bg-red-950 text-white py-4 sm:py-6">
      {/* Container for the footer content */}
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        {/* Company logo */}
        <div className="max-h-[55px] overflow-hidden flex justify-center items-center mb-4 sm:mb-0">
          <Image src={Logo} alt="logo_img" width={180} height={50} />
        </div>

        {/* Navigation links */}
        <div className="space-x-3 text-center sm:text-left">
          <Link href="/about" className="hover:text-gray-400">
            About Us
          </Link>
          <Link href="/products" className="hover:text-gray-400">
            Products
          </Link>
          <Link href="/contact" className="hover:text-gray-400">
            Contact
          </Link>
        </div>
      </div>

      {/* Horizontal line separator */}
      <hr className="my-2 sm:my-6 w-full md:w-[90%] mx-auto" />

      {/* Copyright information */}
      <p className="text-center font-serif">
        &copy; {new Date().getFullYear()} Ecom-Web. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
