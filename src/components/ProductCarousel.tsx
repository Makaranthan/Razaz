import React, { useRef } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
}

export default function ProductCarousel({ title, subtitle, products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 sm:mb-10 space-y-4 sm:space-y-0">
          <div>
            {subtitle && <p className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 mb-2">{subtitle}</p>}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light">{title}</h2>
          </div>
          <div className="flex space-x-2 self-start sm:self-auto">
            <button 
              onClick={() => scroll('left')}
              className="p-2 border border-gray-200 rounded-full hover:bg-white hover:shadow-md transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 border border-gray-200 rounded-full hover:bg-white hover:shadow-md transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-8 -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[280px] sm:min-w-[320px] snap-start flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
