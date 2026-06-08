import { Poppins } from 'next/font/google';
import Script from 'next/script';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import BackToTop from './components/BackToTop';
import Footer from './components/footer/Footer';
import NavBar from './components/nav/NavBar';
import { CartProvider } from './context/CartContext';
import FirebaseContextProvider from './context/FirebaseContext';
import { WishlistProvider } from './context/WishlistContext';
import './globals.css';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata = {
  title: 'E-Commerce App',
  description: 'Generated E-Commerce App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} text-slate-700`}>
        <FirebaseContextProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="flex flex-col min-h-screen">
                <NavBar />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <BackToTop />
              <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                theme="light"
              />
            </WishlistProvider>
          </CartProvider>
        </FirebaseContextProvider>

        <Script src="https://kit.fontawesome.com/83b993c0e4.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}