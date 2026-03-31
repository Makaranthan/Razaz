import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import ProductCarousel from '../components/ProductCarousel';
import CartModal from '../components/CartModal';
import AuthModal from '../components/AuthModal';
import Footer from '../components/Footer';
import { Product } from '../types';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.data.products);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const trendingProducts = products.filter(p => p.isBestseller);
  const newArrivals = products.filter(p => p.isFeatured);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      <CartModal />
      <AuthModal />
      <main>
        <Hero />
        {trendingProducts.length > 0 && (
          <ProductCarousel title="Trending Now" subtitle="Most Desired" products={trendingProducts} />
        )}
        <ProductGrid />
        {newArrivals.length > 0 && (
          <ProductCarousel title="New Arrivals" subtitle="Just Dropped" products={newArrivals} />
        )}
      </main>
      <Footer />
    </div>
  );
}
