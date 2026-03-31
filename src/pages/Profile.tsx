import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Package, User as UserIcon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, token, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.data.orders);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white shadow-sm rounded-lg p-6 flex-shrink-0 h-fit">
            <div className="flex items-center space-x-4 mb-8">
              <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{user.firstName} {user.lastName}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-100 text-black rounded-md font-medium">
                <Package className="h-5 w-5" />
                <span>Order History</span>
              </button>
              <button 
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white shadow-sm rounded-lg p-6 md:p-8">
            <h1 className="text-2xl font-serif mb-8">Order History</h1>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order: any) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Order Placed</p>
                        <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order #</p>
                        <p className="font-medium">{order.id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full 
                          ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                            order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : 
                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex items-center py-4 first:pt-0 last:pb-0 border-b last:border-0 border-gray-100">
                          <img src={item.product.images[0]} alt={item.product.name} className="h-20 w-20 object-cover rounded-md" />
                          <div className="ml-6 flex-1">
                            <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${item.unitPrice.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
