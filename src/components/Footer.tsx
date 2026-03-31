import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <a href="#" className="font-serif text-3xl tracking-widest uppercase font-bold mb-6 block">
              Luxe<span className="text-gray-500">Time</span>
            </a>
            <p className="text-gray-400 text-sm mb-8 max-w-md leading-relaxed">
              Join our newsletter to receive updates on new arrivals, special offers and other discount information.
            </p>
            <form className="flex max-w-md border-b border-gray-700 pb-2">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-transparent w-full focus:outline-none text-sm placeholder-gray-500"
              />
              <button type="submit" className="text-white hover:text-gray-300 transition-colors">
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm uppercase tracking-widest font-semibold mb-6">Customer Care</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Order Tracking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Watch Care Guide</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest font-semibold mb-6">The Company</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Boutiques</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-6 text-gray-400">
            <a href="#" className="hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Youtube className="h-5 w-5" /></a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Accessibility</a>
          </div>
          
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} LuxeTime. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
