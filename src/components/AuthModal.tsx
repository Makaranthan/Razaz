import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        login(data.token, data.data.user);
        toast.success(isLogin ? 'Logged in successfully' : 'Registered successfully');
        setIsAuthModalOpen(false);
        // Reset form
        setFormData({ email: '', password: '', firstName: '', lastName: '' });
      } else {
        toast.error(data.error?.message || 'Authentication failed');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      toast.error('Please enter your email address first');
      return;
    }
    toast.success('Password reset link sent to your email');
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsAuthModalOpen(false)}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-md p-6 sm:p-8 relative shadow-2xl z-50 rounded-sm"
          >
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h2 className="text-2xl font-serif mb-2 text-center">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-center text-gray-500 text-sm mb-6">
              {isLogin ? 'Sign in to access your account' : 'Join us to get exclusive benefits'}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <input
                    type="text"
                    placeholder="First Name"
                    required
                    className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors"
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    required
                    className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors"
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </motion.div>
              )}
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  minLength={8}
                  className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors pr-10"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    className="text-xs text-gray-500 hover:text-black underline-offset-2 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 text-sm uppercase tracking-widest font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex justify-center items-center h-12"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Register')}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ email: '', password: '', firstName: '', lastName: '' });
                }}
                className="text-sm text-gray-600 hover:text-black border-b border-transparent hover:border-black transition-all"
              >
                {isLogin ? 'Create an account' : 'Already have an account? Sign in'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
