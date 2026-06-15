import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Logo from '@/../../public/svg/logo-no-background.svg';

const CATEGORIES = ['Electronics', 'Laptops', 'Cameras', 'Accessories', 'Headphones', 'Sports'];

const SOCIAL_LINKS = [
  { label: 'Facebook', icon: 'fa-facebook-f', href: '#' },
  { label: 'Instagram', icon: 'fa-instagram', href: '#' },
  { label: 'Twitter', icon: 'fa-twitter', href: '#' },
  { label: 'YouTube', icon: 'fa-youtube', href: '#' },
];

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/productList' },
  { label: 'Cart', href: '/cart' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'My Profile', href: '/userProfile' },
];

const SUPPORT_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-red-600 to-red-700 text-white pt-10 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-white/20">
          <div>
            <div className="max-h-[55px] overflow-hidden flex items-center mb-4">
              <Image src={Logo} alt="Ecom-Web logo" width={180} height={50} />
            </div>

            <p className="text-white/90 text-sm leading-relaxed mb-5">
              Ecom-Web menyediakan pengalaman berbelanja online yang terpercaya untuk elektronik, laptop, kamera, aksesori, dan produk berkualitas lainnya. Rayakan Kemerdekaan Bersama Kami! 🇮🇩
            </p>

            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ label, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
                >
                  <i className={`fab ${icon} text-sm`} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>

            <ul className="space-y-2.5 text-white/90 text-sm">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Categories
            </h4>

            <ul className="space-y-2.5 text-white/90 text-sm">
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`/productList?category=${category}`}
                    className="hover:text-white transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Customer Support
            </h4>

            <ul className="space-y-2.5 text-white/90 text-sm mb-6">
              {SUPPORT_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="text-white/90 text-sm space-y-1.5">
              <p>
                <i className="fas fa-envelope mr-2 text-yellow-300" />
                support@ecom-web.com
              </p>
              <p>
                <i className="fas fa-phone mr-2 text-yellow-300" />
                +62 851 0171 7668
              </p>
            </div>
          </div>
        </div>

        <div className="pt-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-white/80 text-sm">
          <p>&copy; {new Date().getFullYear()} Ecom-Web. Merdeka! 🇮🇩</p>

          <p className="text-xs">Dibangun dengan Next.js dan Semangat Kemerdekaan Indonesia</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
