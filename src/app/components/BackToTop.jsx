'use client';

import { useEffect, useState } from 'react';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-20 right-5 z-50 bg-red-950 text-white w-11 h-11 rounded-full shadow-lg flex items-center justify-center hover:bg-red-800 hover:scale-110 active:scale-95 transition-all duration-200"
      aria-label="Kembali ke atas"
    >
      <i className="fas fa-chevron-up text-sm"></i>
    </button>
  );
};

export default BackToTop;