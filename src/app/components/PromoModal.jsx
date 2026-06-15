'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      setTimeout(() => setShowContent(true), 50); // slight delay for smooth entry animation
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShowContent(false);
    setTimeout(() => setIsOpen(false), 300); // Wait for exit animation
  };

  const handleClaim = () => {
    localStorage.setItem('promoClaimed', 'true');
    localStorage.setItem('appliedPromoCode', 'MERDEKA79');
    setShowContent(false);
    setTimeout(() => {
      setIsOpen(false);
      router.push('/checkout');
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-colors duration-500 ease-out ${showContent ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent'}`}
    >
      {/* Background click to dismiss */}
      <div className="absolute inset-0 cursor-pointer" onClick={handleClose}></div>

      {/* Modal Content - Modern UI */}
      <div
        className={`relative z-10 w-full max-w-lg bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          showContent ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8'
        }`}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

        {/* Header Section */}
        <div className="bg-gradient-to-br from-red-600 to-red-800 p-8 text-center text-white relative overflow-hidden">
          {/* Confetti/Ornaments */}
          <div className="absolute top-2 left-4 text-red-300 opacity-50">✦</div>
          <div className="absolute bottom-4 right-8 text-red-300 opacity-50 text-xl">✦</div>
          <div className="absolute top-8 right-12 text-red-300 opacity-30 text-sm">✦</div>

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-all focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>

          <div className="flex justify-center mb-4 relative z-10">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm ring-4 ring-white/10">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-widest text-white drop-shadow-md">
            Promo Kemerdekaan
          </h2>
          <p className="mt-2 text-red-100 font-medium text-base tracking-wide">
            Semarak Spesial 17 Agustus
          </p>
        </div>

        {/* Body Section */}
        <div className="p-8 text-center bg-white/90 backdrop-blur-md relative z-10">
          <p className="text-gray-600 mb-6 font-medium text-lg">
            Klaim sekarang dan nikmati diskon spesial hingga{' '}
            <span className="text-red-600 font-bold">79%</span> untuk pesanan Anda!
          </p>

          <div className="relative group cursor-pointer inline-block mb-8 w-full max-w-xs mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-red-50 border-2 border-dashed border-red-500 text-red-700 font-black text-3xl py-4 px-8 rounded-2xl tracking-widest shadow-inner flex items-center justify-center gap-3">
              MERDEKA79
            </div>
          </div>

          <button
            onClick={handleClaim}
            className="w-full relative overflow-hidden bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-2xl transition duration-300 shadow-[0_8px_30px_rgba(220,38,38,0.4)] hover:shadow-[0_8px_30px_rgba(220,38,38,0.6)] flex justify-center items-center gap-2 group transform hover:-translate-y-1"
          >
            <span className="relative z-10 text-lg tracking-wide">Klaim Voucher Sekarang</span>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10 transform group-hover:translate-x-1 transition-transform"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
