import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, ShoppingCart, Users, Settings, LogOut, Plus, Edit, Trash2 } from 'lucide-react';
import ProductModal from '../components/admin/ProductModal';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const { user, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    if (token && user?.role === 'ADMIN') {
      fetchProducts();
      fetchOrders();
    }
  }, [token, user]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      fetchOrders();
      toast.success('Order status updated');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        toast.success('Product deleted successfully');
        fetchProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('An error occurred');
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: any) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  if (!user || user.role !== 'ADMIN') {
    return <div className="p-8 text-center">Access Denied. Admins only.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-md flex-shrink-0">
        <div className="p-4 md:p-6 flex justify-between items-center md:block">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Admin Panel</h2>
          <button onClick={logout} className="md:hidden text-red-600 p-2">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible border-b md:border-b-0 md:mt-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 md:w-full flex items-center justify-center md:justify-start px-4 md:px-6 py-3 md:py-4 text-sm md:text-base whitespace-nowrap ${activeTab === 'products' ? 'bg-gray-100 border-b-2 md:border-b-0 md:border-r-4 border-black text-black' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Package className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 md:w-full flex items-center justify-center md:justify-start px-4 md:px-6 py-3 md:py-4 text-sm md:text-base whitespace-nowrap ${activeTab === 'orders' ? 'bg-gray-100 border-b-2 md:border-b-0 md:border-r-4 border-black text-black' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" />
            Orders
          </button>
          <button
            onClick={logout}
            className="hidden md:flex w-full items-center px-6 py-4 text-left text-red-600 hover:bg-red-50 mt-auto"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <h1 className="text-xl md:text-2xl font-bold">Product Management</h1>
              <button 
                onClick={openAddProductModal}
                className="bg-black text-white px-4 py-2 rounded text-sm md:text-base w-full sm:w-auto flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product: any) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-10 w-10 rounded-full object-cover" src={product.images[0]} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stockQuantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => openEditProductModal(product)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Edit className="h-4 w-4 inline" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4 inline" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h1 className="text-xl md:text-2xl font-bold mb-6">Order Management</h1>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order: any) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.id.slice(-8)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.user.firstName} {order.user.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.totalAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                            order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : 
                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ProductModal 
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={editingProduct}
        onSuccess={fetchProducts}
      />
    </div>
  );
}
