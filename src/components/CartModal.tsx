import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function CartModal() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user, setIsAuthModalOpen } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      setIsCartOpen(false);
      setIsAuthModalOpen(true);
      toast.error('Please login to checkout');
      return;
    }

    try {
      setIsCheckingOut(true);
      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          shippingDetails: {
            addressLine1: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            postalCode: '12345',
            country: 'USA'
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Checkout failed');
      }

      // In a real app, redirect to Stripe checkout URL
      // window.location.href = data.data.url;
      
      // For demo purposes, just clear cart and show success
      toast.success('Order placed successfully! (Demo mode)');
      clearCart();
      setIsCartOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-serif uppercase tracking-widest flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Your Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-gray-400 hover:text-black transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <ShoppingBag className="h-12 w-12 opacity-20" />
                  <p className="text-sm uppercase tracking-wider">Your cart is empty</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-black border-b border-black pb-1 text-sm uppercase tracking-wider font-semibold"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-24 h-32 bg-gray-50 flex-shrink-0">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.brand}</p>
                              <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">${item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center border border-gray-200 w-fit">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 text-gray-500 hover:text-black"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-gray-500 hover:text-black"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm uppercase tracking-wider text-gray-600">Subtotal</span>
                  <span className="text-lg font-medium">${cartTotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mb-6">Shipping and taxes calculated at checkout.</p>
                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-black text-white py-4 text-sm uppercase tracking-widest font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
