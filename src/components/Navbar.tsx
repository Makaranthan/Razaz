import React, { useState } from 'react';
import { Search, ShoppingBag, User, Heart, Menu, X, Globe, LogOut, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Navbar() {
  const { cartItems, setIsCartOpen } = useCart();
  const { user, logout, setIsAuthModalOpen } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const categories = ['Men', 'Women', 'Luxury', 'Smartwatch'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}#products`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleWishlistClick = () => {
    if (!user) {
      toast.error('Please login to view your wishlist');
      setIsAuthModalOpen(true);
    } else {
      toast.info('Your wishlist is currently empty');
    }
  };

  const handleGlobeClick = () => {
    toast.success('Localization settings updated to EUR / FR');
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600 hover:text-black">
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center lg:justify-start flex-1 lg:flex-none">
            <Link to="/" className="font-serif text-2xl tracking-widest uppercase font-bold text-gray-900">
              Luxe<span className="text-gray-400">Time</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
            <div className="flex space-x-8">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/?category=${category}#products`}
                  className="text-sm font-medium text-gray-600 hover:text-black uppercase tracking-wider transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {/* Utility Icons */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            <div 
              onClick={handleGlobeClick}
              className="hidden md:flex items-center text-sm text-gray-500 hover:text-black cursor-pointer"
            >
              <Globe className="h-4 w-4 mr-1" />
              <span>EN / USD</span>
            </div>
            
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.form 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    onSubmit={handleSearch}
                    className="absolute right-8 overflow-hidden"
                  >
                    <input
                      type="text"
                      placeholder="Search watches..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full border-b border-gray-300 py-1 px-2 text-sm focus:outline-none focus:border-black bg-transparent"
                      autoFocus
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-600 hover:text-black transition-colors z-10 bg-white"
              >
                {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </button>
            </div>

            {user ? (
              <div className="hidden md:flex items-center gap-4">
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="text-gray-600 hover:text-black transition-colors flex items-center" title="Admin Dashboard">
                    <Shield className="h-5 w-5" />
                  </Link>
                )}
                <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                  Hi, {user.firstName}
                </Link>
                <button onClick={logout} className="text-gray-600 hover:text-black transition-colors" title="Logout">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden md:block text-gray-600 hover:text-black transition-colors"
                title="Login / Register"
              >
                <User className="h-5 w-5" />
              </button>
            )}
            <button 
              onClick={handleWishlistClick}
              className="hidden md:block text-gray-600 hover:text-black transition-colors"
            >
              <Heart className="h-5 w-5" />
            </button>
            <button 
              className="text-gray-600 hover:text-black transition-colors relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 lg:hidden shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-serif text-xl font-bold uppercase tracking-widest">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4 flex flex-col space-y-4">
                <form onSubmit={handleSearch} className="flex items-center border-b border-gray-200 pb-2 mb-2">
                  <Search className="h-5 w-5 text-gray-400 mr-2" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full focus:outline-none text-lg"
                  />
                </form>
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/?category=${category}#products`}
                    className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category}
                  </Link>
                ))}
                {user ? (
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="pt-4 flex items-center space-x-4 text-gray-600 w-full text-left"
                  >
                    <User className="h-5 w-5" />
                    <span>Hi, {user.firstName} (Profile)</span>
                  </Link>
                ) : (
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="pt-4 flex items-center space-x-4 text-gray-600 w-full text-left"
                  >
                    <User className="h-5 w-5" />
                    <span>Account / Login</span>
                  </button>
                )}
                {user && user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-4 text-gray-600 w-full text-left"
                  >
                    <Shield className="h-5 w-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                {user && (
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center space-x-4 text-gray-600 w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                )}
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleWishlistClick();
                  }}
                  className="flex items-center space-x-4 text-gray-600 w-full text-left"
                >
                  <Heart className="h-5 w-5" />
                  <span>Wishlist</span>
                </button>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleGlobeClick();
                  }}
                  className="flex items-center space-x-4 text-gray-600 w-full text-left"
                >
                  <Globe className="h-5 w-5" />
                  <span>EN / USD</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
