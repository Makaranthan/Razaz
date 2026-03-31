import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Filter, ChevronDown, X } from 'lucide-react';
import { Product } from '../types';
import { useSearchParams, useLocation } from 'react-router-dom';

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  // Filter States
  const [activeCategory, setActiveCategory] = useState<string>(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    brand: '',
    strapMaterial: '',
    minPrice: '',
    maxPrice: ''
  });

  // Sync state when URL changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || 'All';
    setActiveCategory(categoryFromUrl);
  }, [searchParams]);

  // Handle scrolling to products section when hash changes
  useEffect(() => {
    if (location.hash === '#products') {
      const element = document.getElementById('products');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build query string
      const params = new URLSearchParams();
      if (activeCategory !== 'All') params.append('category', activeCategory);
      if (sortBy !== 'featured') params.append('sort', sortBy);
      
      const searchQuery = searchParams.get('search');
      if (searchQuery) {
        params.append('search', searchQuery);
      } else if (filters.brand) {
        params.append('search', filters.brand); // Fallback to brand filter if no global search
      }
      
      if (filters.strapMaterial) params.append('strapMaterial', filters.strapMaterial);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.data.products);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, sortBy, filters, searchParams.get('search')]);

  const categories = ['All', 'Men', 'Women', 'Luxury', 'Smartwatch'];

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ brand: '', strapMaterial: '', minPrice: '', maxPrice: '' });
    setIsFilterOpen(false);
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <section id="products" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 space-y-6 md:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light mb-4">Curated Collection</h2>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`text-xs sm:text-sm uppercase tracking-wider pb-1 border-b-2 transition-colors ${
                  activeCategory === category 
                    ? 'border-black text-black font-semibold' 
                    : 'border-transparent text-gray-500 hover:text-black'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4 self-start md:self-auto">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 text-xs sm:text-sm uppercase tracking-wider text-gray-600 hover:text-black"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <div className="relative group z-30">
            <button className="flex items-center space-x-2 text-xs sm:text-sm uppercase tracking-wider text-gray-600 hover:text-black">
              <span>Sort: {sortBy.replace('-', ' ')}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              {['featured', 'newest', 'price-low', 'price-high'].map(option => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-black capitalize"
                >
                  {option.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="bg-gray-50 p-6 mb-12 rounded-lg border border-gray-100 relative">
          <button onClick={() => setIsFilterOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black">
            <X className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-serif mb-4">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input 
                type="text" 
                name="brand" 
                value={filters.brand} 
                onChange={handleFilterChange}
                placeholder="e.g. Rolex, Omega"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Strap Material</label>
              <select 
                name="strapMaterial" 
                value={filters.strapMaterial} 
                onChange={handleFilterChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm p-2 border"
              >
                <option value="">All Materials</option>
                <option value="Leather">Leather</option>
                <option value="Stainless Steel">Stainless Steel</option>
                <option value="Titanium">Titanium</option>
                <option value="Rubber">Rubber</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price ($)</label>
              <input 
                type="number" 
                name="minPrice" 
                value={filters.minPrice} 
                onChange={handleFilterChange}
                placeholder="0"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price ($)</label>
              <input 
                type="number" 
                name="maxPrice" 
                value={filters.maxPrice} 
                onChange={handleFilterChange}
                placeholder="10000"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm p-2 border"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={clearFilters} className="text-sm text-gray-600 hover:text-black underline">
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {loading && products.length > 0 && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      )}

      {products.length === 0 && !loading ? (
        <div className="text-center py-20 text-gray-500">
          No products found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
