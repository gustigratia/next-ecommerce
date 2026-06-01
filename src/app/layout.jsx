import { Poppins } from 'next/font/google'
import './globals.css'
import NavBar from './components/nav/NavBar'
import Footer from './components/footer/Footer'
import FirebaseContextProvider from './context/FirebaseContext'
import { CartProvider } from './context/CartContext'
import Script from 'next/script'

const poppins = Poppins({ subsets: ['latin'], weight: ["400", "700"] })

export const metadata = {
  title: 'E-Commerce App',
  description: 'Generated E-Commerce App',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} text-slate-700`}>
        <FirebaseContextProvider>
          <CartProvider>
            <div className='flex flex-col min-h-screen'>
              <NavBar />
              <main className='flex-grow'>
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </FirebaseContextProvider>

        <Script
          src="https://kit.fontawesome.com/83b993c0e4.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}