import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  return (
    <div 
      className="group relative flex flex-col bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isFeatured && (
          <span className="bg-black text-white text-[10px] uppercase tracking-wider px-2 py-1 font-bold">
            New
          </span>
        )}
        {product.isBestseller && (
          <span className="bg-gray-100 text-black text-[10px] uppercase tracking-wider px-2 py-1 font-bold">
            Trending
          </span>
        )}
        {product.stockQuantity <= 0 && (
          <span className="bg-red-50 text-red-600 text-[10px] uppercase tracking-wider px-2 py-1 font-bold">
            Out of Stock
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity hover:bg-white hover:text-red-500 shadow-sm">
        <Heart className="h-4 w-4" />
      </button>

      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 mb-4">
        <img
          src={product.images[0]}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${isHovered && product.images[1] ? 'opacity-0' : 'opacity-100'}`}
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        
        {/* Quick Add Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-0 lg:translate-y-full lg:group-hover:translate-y-0 transition-transform duration-300">
          <button 
            onClick={() => addToCart(product)}
            disabled={product.stockQuantity <= 0}
            className="w-full bg-black/90 backdrop-blur text-white py-3 text-sm uppercase tracking-wider font-semibold hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            <ShoppingBag className="h-4 w-4" />
            {product.stockQuantity > 0 ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col space-y-1">
        <span className="text-xs text-gray-500 uppercase tracking-wider">{product.brand}</span>
        <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
        <p className="text-sm text-gray-600">${product.price.toLocaleString()}</p>
      </div>
    </div>
  );
}
