import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Heart, CheckCircle2, Ruler, Paintbrush, ZoomIn, ZoomOut, X } from 'lucide-react';
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 1));

  const openZoomModal = () => {
    setZoomLevel(1);
    setIsZoomModalOpen(true);
  };

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
      <Link to="/gallery" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#1877F2] mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Gallery
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left: Image Viewer */}
        <div className="relative group rounded-2xl glass border-white/5 bg-[#18191a] p-2 hover:border-[#1877F2]/30 transition-colors">
          <div 
            className="overflow-hidden rounded-xl relative h-full flex items-center justify-center cursor-pointer"
            onDoubleClick={openZoomModal}
            title="Double click to open full view"
          >
            <img 
              src={painting.image} 
              alt={painting.title} 
              className="w-full h-auto object-cover transition-transform duration-300 ease-out hover:scale-105"
            />
            {/* Overlay hint */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="text-white bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm flex items-center gap-2 font-medium">
                <ZoomIn className="w-5 h-5" /> Double click to zoom
              </span>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col justify-center">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[#1877F2] font-medium tracking-wider uppercase text-sm">{painting.category}</span>
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
            <div className="grid grid-cols-2 gap-4 mb-10 py-6 border-y border-[#3e4042]">
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
              className={`flex-1 py-4 flex items-center justify-center text-lg ${painting.stock < 1 ? 'bg-[#3a3b3c] text-gray-500 cursor-not-allowed rounded-xl font-semibold' : 'btn-primary'}`}
            >
              <ShoppingBag className="w-5 h-5 mr-2" /> {painting.stock < 1 ? 'Sold Out' : 'Add to Collection'}
            </button>
            <button 
              onClick={handleWishlist}
              className={`btn-secondary py-4 px-6 flex justify-center !border-[#3e4042] hover:!border-[#1877F2] ${isWishlisted ? 'text-[#1877F2] bg-[#1877F2]/10' : 'text-white'}`}
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-[#1877F2]' : ''}`} />
            </button>
          </div>

          <div className="mt-8 text-sm text-gray-500 bg-[#242526] p-4 rounded-xl border border-[#3e4042]">
            <p className="mb-2">✓ Free secure international shipping</p>
            <p className="mb-2">✓ Certificate of Authenticity included</p>
            <p>✓ 14-day return policy</p>
          </div>
        </div>

      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl" onClick={() => setIsZoomModalOpen(false)}>
          <button 
            className="absolute top-6 right-6 text-white hover:text-[#1877F2] p-2 bg-white/10 rounded-full transition-colors z-50"
            onClick={() => setIsZoomModalOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={painting.image} 
              alt={painting.title} 
              className="max-w-[95vw] max-h-[95vh] object-contain transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>

          <div 
            className="absolute bottom-8 flex gap-4 bg-black/60 p-3 rounded-xl backdrop-blur-md border border-white/10 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={handleZoomOut} 
              disabled={zoomLevel <= 1}
              className="p-2 text-white hover:text-[#1877F2] disabled:opacity-30 disabled:hover:text-white transition-colors bg-white/5 rounded-lg hover:bg-white/10"
              title="Zoom Out"
            >
              <ZoomOut className="w-6 h-6" />
            </button>
            <button 
              onClick={handleZoomIn}
              disabled={zoomLevel >= 4}
              className="p-2 text-white hover:text-[#1877F2] disabled:opacity-30 disabled:hover:text-white transition-colors bg-white/5 rounded-lg hover:bg-white/10"
              title="Zoom In"
            >
              <ZoomIn className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
