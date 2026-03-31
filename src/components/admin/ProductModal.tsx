import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any | null;
  onSuccess: () => void;
}

export default function ProductModal({ isOpen, onClose, product, onSuccess }: ProductModalProps) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    category: 'Men',
    stockQuantity: '',
    sku: '',
    images: '',
    isFeatured: false,
    isBestseller: false,
    strapMaterial: '',
    dialColor: '',
    movement: '',
    waterResistance: '',
    caseSize: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        brand: product.brand || '',
        category: product.category || 'Men',
        stockQuantity: product.stockQuantity?.toString() || '',
        sku: product.sku || '',
        images: product.images ? product.images.join(', ') : '',
        isFeatured: product.isFeatured || false,
        isBestseller: product.isBestseller || false,
        strapMaterial: product.strapMaterial || '',
        dialColor: product.dialColor || '',
        movement: product.movement || '',
        waterResistance: product.waterResistance || '',
        caseSize: product.caseSize || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        brand: '',
        category: 'Men',
        stockQuantity: '',
        sku: '',
        images: '',
        isFeatured: false,
        isBestseller: false,
        strapMaterial: '',
        dialColor: '',
        movement: '',
        waterResistance: '',
        caseSize: ''
      });
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10),
        images: formData.images.split(',').map(s => s.trim()).filter(Boolean)
      };

      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        toast.success(product ? 'Product updated successfully' : 'Product created successfully');
        onSuccess();
        onClose();
      } else {
        toast.error(data.error?.message || 'Failed to save product');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl z-50 rounded-sm"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h2 className="text-2xl font-serif mb-6">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                  <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:border-black">
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Smartwatch">Smartwatch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:border-black" placeholder="Leave empty to auto-generate" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:border-black" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma separated) *</label>
                <textarea name="images" value={formData.images} onChange={handleChange} required rows={2} className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:border-black" placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Strap Material</label>
                  <input type="text" name="strapMaterial" value={formData.strapMaterial} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dial Color</label>
                  <input type="text" name="dialColor" value={formData.dialColor} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Movement</label>
                  <input type="text" name="movement" value={formData.movement} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Water Resistance</label>
                  <input type="text" name="waterResistance" value={formData.waterResistance} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Case Size</label>
                  <input type="text" name="caseSize" value={formData.caseSize} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:border-black" />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center">
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="mr-2" />
                  <span className="text-sm">Featured</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="isBestseller" checked={formData.isBestseller} onChange={handleChange} className="mr-2" />
                  <span className="text-sm">Bestseller</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-sm hover:bg-gray-900 transition-colors flex items-center justify-center font-medium uppercase tracking-wider text-sm mt-6"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (product ? 'Update Product' : 'Create Product')}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
