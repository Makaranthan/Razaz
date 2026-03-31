import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const backgroundImages = [
  "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1587836374828-cb4387df3eb7?auto=format&fit=crop&q=80&w=2000"
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative h-[65vh] w-full bg-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.img
            key={currentImageIndex}
            src={backgroundImages[currentImageIndex]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            alt="Luxury Watch"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-white mt-12 md:mt-0"
        >
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] mb-3 md:mb-4 font-medium text-gray-300">
            The Heritage Collection
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-light mb-4 md:mb-6 leading-tight">
            Mastering the <br />Art of Time
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 md:mb-10 font-light max-w-lg">
            Discover our new arrivals featuring precision engineering and timeless elegance. Crafted for those who appreciate the extraordinary.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
            <button className="bg-white text-black px-6 py-3 md:px-8 md:py-4 text-sm uppercase tracking-widest font-semibold hover:bg-gray-200 transition-colors w-full sm:w-auto text-center">
              Shop Men
            </button>
            <button className="border border-white text-white px-6 py-3 md:px-8 md:py-4 text-sm uppercase tracking-widest font-semibold hover:bg-white hover:text-black transition-colors w-full sm:w-auto text-center">
              Shop Women
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
