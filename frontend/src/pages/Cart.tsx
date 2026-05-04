import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import Loader from '../components/Loader';
import { ordersAPI } from '../api';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const { cart, isLoading, fetchCart, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [placingOrder, setPlacingOrder] = useState(false);

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-20 text-center max-w-lg mx-auto">
        <h2 className="text-3xl font-bold mb-4">Your Cart</h2>
        <p className="text-gray-400 mb-8">Please sign in to view and manage your collection.</p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  if (isLoading) return <div className="pt-32"><Loader /></div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="pt-32 pb-20 text-center max-w-lg mx-auto">
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-400 mb-8">You haven't added any artworks to your collection yet.</p>
        <Link to="/gallery" className="btn-primary">Explore Gallery</Link>
      </div>
    );
  }

  const handleCheckout = async () => {
    setPlacingOrder(true);
    try {
      // 1. Load Razorpay script
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setPlacingOrder(false);
        return;
      }

      // Basic checkout flow - mock address
      const shippingAddress = {
        street: '123 Art Avenue',
        city: 'Metropolis',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      };
      
      // 2. Create Razorpay order on backend
      const { data } = await ordersAPI.createRazorpayOrder();
      
      if (!data.success) {
        toast.error('Failed to create order');
        setPlacingOrder(false);
        return;
      }

      // 3. Initialize Razorpay modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mockkeyid123',
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'KPaint',
        description: 'Artwork Purchase',
        order_id: data.order.id,
        handler: async function (response: any) {
          try {
            // 4. Verify payment on backend
            const verifyRes = await ordersAPI.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress
            });

            if (verifyRes.data.success) {
              toast.success('Payment successful! Welcome to your new collection.');
              await clearCart();
              navigate('/');
            }
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: 'KPaint User',
          email: 'user@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#1877F2'
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      toast.error('Failed to initiate checkout');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-6">
      <h1 className="text-4xl font-bold mb-10 tracking-tight">Your Collection</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.items.map((item) => (
            <div key={item.painting._id} className="flex flex-col sm:flex-row items-center gap-6 p-4 glass rounded-xl border border-[#3e4042] bg-[#242526]">
              <img 
                src={item.painting.image} 
                alt={item.painting.title} 
                className="w-32 h-32 object-cover rounded-lg"
              />
              
              <div className="flex-1 text-center sm:text-left">
                <Link to={`/gallery/${item.painting._id}`} className="text-xl font-bold hover:text-[#1877F2] transition-colors">
                  {item.painting.title}
                </Link>
                <p className="text-gray-400 text-sm mt-1">{item.painting.artist}</p>
                <p className="text-[#1877F2] font-bold mt-2">${item.price.toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-[#18191a] rounded-lg border border-[#3e4042]">
                  <button 
                    onClick={() => updateQuantity(item.painting._id, Math.max(1, item.quantity - 1))}
                    className="p-2 hover:text-[#1877F2] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.painting._id, item.quantity + 1)}
                    className="p-2 hover:text-[#1877F2] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.painting._id)}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass p-8 rounded-2xl border border-[#3e4042] sticky top-28 bg-[#242526]">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal ({cart.items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span>${cart.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-400">Complimentary</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-[#3e4042] pt-4 mb-8">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total</span>
                <span className="text-[#1877F2]">${cart.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={placingOrder}
              className="w-full btn-primary justify-center text-lg py-4 mb-4"
            >
              {placingOrder ? 'Processing...' : 'Proceed to Checkout'} <ArrowRight className="w-5 h-5 ml-2" />
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <ShieldCheck className="w-4 h-4" /> Secure, Encrypted Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
