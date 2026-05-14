import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../api';
import { useAuthStore } from '../store/authStore';
import Loader from '../components/Loader';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderItem {
  _id: string;
  painting: {
    _id: string;
    title: string;
    image: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
}

const Orders: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data } = await ordersAPI.getMyOrders();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'shipped':
        return <Package className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'cancelled':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'shipped':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-20 text-center max-w-lg mx-auto">
        <h2 className="text-3xl font-bold mb-4">Your Orders</h2>
        <p className="text-gray-400 mb-8">Please sign in to view your order history.</p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  if (isLoading) return <div className="pt-32"><Loader /></div>;

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-6">
      <h1 className="text-4xl font-bold mb-10 tracking-tight flex items-center gap-3">
        <Package className="w-8 h-8 text-[#1877F2]" /> Order History
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl border border-[#3e4042] bg-[#242526]">
          <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No orders found</h2>
          <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
          <Link to="/gallery" className="btn-primary inline-block">Explore Gallery</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="glass p-6 rounded-2xl border border-[#3e4042] bg-[#242526]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-[#3e4042]">
                <div>
                  <p className="text-sm text-gray-400">Order #{order._id.substring(order._id.length - 8)}</p>
                  <p className="text-sm text-gray-400 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`mt-4 sm:mt-0 flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 p-4 rounded-xl bg-[#18191a] border border-[#3e4042]/50">
                    <img 
                      src={item.painting?.image || '/placeholder-painting.jpg'} 
                      alt={item.painting?.title || 'Painting'} 
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <Link 
                        to={`/gallery/${item.painting?._id}`} 
                        className="text-lg font-bold hover:text-[#1877F2] transition-colors"
                      >
                        {item.painting?.title || 'Unknown Painting'}
                      </Link>
                      <p className="text-gray-400 text-sm mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#1877F2] font-bold">${item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-[#3e4042] flex justify-between items-center">
                <div>
                  <span className="text-gray-400 mr-2">Payment Status:</span>
                  <span className={`font-medium capitalize ${
                    order.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 mr-4">Total Amount</span>
                  <span className="text-2xl font-bold text-white">${order.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
