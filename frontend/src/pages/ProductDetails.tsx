import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Heart, CheckCircle2, Ruler, Paintbrush } from 'lucide-react';
import type { Painting } from '../types';
import { paintingsAPI, authAPI } from '../api';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [painting, setPainting] = useState<Painting | null>(null);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, user, toggleWishlistIcon } = useAuthStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchPainting = async () => {
      try {
        const { data } = await paintingsAPI.getById(id!);
        if (data.success) {
          setPainting(data.painting);
        }
      } catch (error) {
        toast.error('Could not load painting details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPainting();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) return toast.error('Please login first');
    if (!painting || painting.stock < 1) return;
    try {
      await addToCart(painting._id, 1);
      toast.success('Artwork added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) return toast.error('Please login first');
    if (!painting) return;
    try {
      toggleWishlistIcon(painting._id);
      await authAPI.toggleWishlist(painting._id);
    } catch {
      toast.error('Failed to update wishlist');
      toggleWishlistIcon(painting._id);
    }
  };

  if (loading) return <div className="pt-32"><Loader /></div>;
  if (!painting) return <div className="pt-32 text-center text-white text-2xl">Artwork not found</div>;

  const isWishlisted = user?.wishlist?.includes(painting._id);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-6">
      <Link to="/gallery" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#c9a84c] mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Gallery
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left: Image Viewer */}
        <div className="relative group rounded-2xl overflow-hidden glass border-white/5 bg-[#0a0a0f] p-2 hover:border-[#c9a84c]/30 transition-colors">
          <img 
            src={painting.image} 
            alt={painting.title} 
            className="w-full h-auto object-cover rounded-xl"
          />
        </div>

        {/* Right: Details */}
        <div className="flex flex-col justify-center">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[#c9a84c] font-medium tracking-wider uppercase text-sm">{painting.category}</span>
            {painting.stock > 0 ? (
              <span className="flex items-center gap-1 text-green-400 text-sm font-medium"><CheckCircle2 className="w-4 h-4"/> In Stock</span>
            ) : (
              <span className="text-red-400 text-sm font-medium">Out of Stock</span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{painting.title}</h1>
          <p className="text-xl text-gray-400 mb-8">By <span className="text-white font-medium">{painting.artist}</span></p>

          <div className="text-4xl font-bold text-white mb-8">
            ${painting.price.toLocaleString()}
          </div>

          <p className="text-gray-300 leading-relaxed mb-10 whitespace-pre-wrap">
            {painting.description}
          </p>

          {(painting.dimensions || painting.medium) && (
            <div className="grid grid-cols-2 gap-4 mb-10 py-6 border-y border-[#2a2a40]">
              {painting.dimensions && (
                <div>
                  <div className="text-gray-500 text-sm flex items-center gap-2 mb-1"><Ruler className="w-4 h-4" /> Dimensions</div>
                  <div className="text-white font-medium">{painting.dimensions}</div>
                </div>
              )}
              {painting.medium && (
                <div>
                  <div className="text-gray-500 text-sm flex items-center gap-2 mb-1"><Paintbrush className="w-4 h-4" /> Medium</div>
                  <div className="text-white font-medium">{painting.medium}</div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button 
              onClick={handleAddToCart}
              disabled={painting.stock < 1}
              className={`flex-1 py-4 flex items-center justify-center text-lg ${painting.stock < 1 ? 'bg-[#2a2a40] text-gray-500 cursor-not-allowed rounded-xl font-semibold' : 'btn-primary'}`}
            >
              <ShoppingBag className="w-5 h-5 mr-2" /> {painting.stock < 1 ? 'Sold Out' : 'Add to Collection'}
            </button>
            <button 
              onClick={handleWishlist}
              className={`btn-secondary py-4 px-6 flex justify-center !border-[#2a2a40] hover:!border-[#c9a84c] ${isWishlisted ? 'text-[#c9a84c] bg-[#c9a84c]/10' : 'text-white'}`}
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-[#c9a84c]' : ''}`} />
            </button>
          </div>

          <div className="mt-8 text-sm text-gray-500 bg-[#12121a] p-4 rounded-xl border border-[#2a2a40]">
            <p className="mb-2">✓ Free secure international shipping</p>
            <p className="mb-2">✓ Certificate of Authenticity included</p>
            <p>✓ 14-day return policy</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
