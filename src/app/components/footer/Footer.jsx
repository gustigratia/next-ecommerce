import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Logo from '@/../../public/svg/logo-no-background.svg';

const CATEGORIES = ['Electronics', 'Laptops', 'Cameras', 'Accessories', 'Headphones', 'Sports'];

const Footer = () => {
  return (
    <footer className="bg-red-950 text-white pt-10 pb-4">
      <div className="container mx-auto px-4">

        {/* Grid konten utama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-red-800">

          {/* Brand & Social */}
          <div>
            <div className="max-h-[55px] overflow-hidden flex items-center mb-4">
              <Image src={Logo} alt="logo_img" width={180} height={50} />
            </div>
            <p className="text-red-200 text-sm leading-relaxed mb-5">
              Platform e-commerce terpercaya untuk belanja elektronik, laptop, kamera, dan aksesoris terbaik.
            </p>
            <div className="flex gap-3">
              {[
                { icon: 'fa-facebook-f', href: '#' },
                { icon: 'fa-instagram', href: '#' },
                { icon: 'fa-twitter', href: '#' },
                { icon: 'fa-youtube', href: '#' },
              ].map(({ icon, href }) => (
                <a
                  key={icon}
                  href={href}
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/25 transition-colors"
                >
                  <i className={`fab ${icon} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-red-200 text-sm">
              {[
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/productList' },
                { label: 'Cart', href: '/cart' },
                { label: 'Wishlist', href: '/wishlist' },
                { label: 'My Profile', href: '/userProfile' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kategori */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Kategori
            </h4>
            <ul className="space-y-2.5 text-red-200 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/productList?category=${cat}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Bantuan
            </h4>
            <ul className="space-y-2.5 text-red-200 text-sm mb-6">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'FAQ', href: '#' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Kontak singkat */}
            <div className="text-red-200 text-sm space-y-1.5">
              <p><i className="fas fa-envelope mr-2 text-red-400"></i>support@ecom-web.com</p>
              <p><i className="fas fa-phone mr-2 text-red-400"></i>+62 21 1234 5678</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-red-300 text-sm">
          <p>&copy; {new Date().getFullYear()} Ecom-Web. All rights reserved.</p>
          <p className="text-xs">
            Made with <span className="text-red-400">❤</span> using Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;