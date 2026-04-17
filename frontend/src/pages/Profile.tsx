import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import type { Order } from '../types';
import { ordersAPI } from '../api';
import Loader from '../components/Loader';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await ordersAPI.getMyOrders();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Failed to load orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing': return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped': return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-6">
      
      {/* Profile Header */}
      <div className="glass p-8 rounded-2xl mb-12 flex flex-col md:flex-row items-center gap-6 text-center md:text-left bg-[#242526]">
        <div className="w-20 h-20 rounded-full bg-[#3a3b3c] flex items-center justify-center text-3xl font-bold text-[#1877F2]">
          {user?.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">{user?.name}</h1>
          <p className="text-gray-400">{user?.email}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">Order History</h2>

      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl border border-[#3e4042] bg-[#242526]">
          <h3 className="text-xl text-white mb-2">No orders placed yet</h3>
          <p className="text-gray-400 mb-6">Start building your exclusive fine art collection today.</p>
          <Link to="/gallery" className="btn-primary">Explore the Gallery</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="glass rounded-xl border border-[#3e4042] overflow-hidden bg-[#242526]">
              
              <div className="bg-[#1c1e21] px-6 py-4 border-b border-[#3e4042] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    Order Placed: <span className="text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Total: <span className="text-[#1877F2] font-bold">${order.totalPrice.toLocaleString()}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 capitalize font-medium text-sm px-3 py-1.5 rounded-full bg-[#18191a] border border-[#3e4042]">
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      {item.painting && (
                        <>
                          <img 
                            src={item.painting.image} 
                            alt={item.painting.title}
                            className="w-16 h-16 object-cover rounded shadow-md"
                          />
                          <div className="flex-1">
                            <Link to={`/gallery/${item.painting._id}`} className="text-white hover:text-[#1877F2] transition-colors font-medium">
                              {item.painting.title}
                            </Link>
                            <div className="text-sm text-gray-400">Qty: {item.quantity}</div>
                          </div>
                          <div className="text-gray-300 font-medium">
                            ${item.price.toLocaleString()}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
