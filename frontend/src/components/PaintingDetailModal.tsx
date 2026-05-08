import React, { useEffect, useRef } from 'react';
import { X, ShoppingBag, Heart, CheckCircle2, Ruler, Paintbrush, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Painting } from '../types';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { authAPI } from '../api';
import toast from 'react-hot-toast';

interface Props {
  painting: Painting;
  onClose: () => void;
}

const PaintingDetailModal: React.FC<Props> = ({ painting, onClose }) => {
  const { user, isAuthenticated, toggleWishlistIcon } = useAuthStore();
  const { addToCart } = useCartStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  const isWishlisted = user?.wishlist?.includes(painting._id);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) return toast.error('Please login to save to wishlist');
    try {
      toggleWishlistIcon(painting._id);
      await authAPI.toggleWishlist(painting._id);
    } catch {
      toast.error('Failed to update wishlist');
      toggleWishlistIcon(painting._id);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) return toast.error('Please login to add to cart');
    if (painting.stock < 1) return toast.error('Painting out of stock');
    try {
      await addToCart(painting._id);
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="painting-modal-overlay"
    >
      <div className="painting-modal-content">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Left: Image */}
          <div className="lg:w-3/5 relative bg-black flex items-center justify-center p-4 lg:p-8">
            <img
              src={painting.image}
              alt={painting.title}
              className="max-w-full max-h-[50vh] lg:max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Right: Details */}
          <div className="lg:w-2/5 p-6 lg:p-8 overflow-y-auto flex flex-col">
            {/* Category & Stock */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#1877F2] font-medium tracking-wider uppercase text-xs">
                {painting.category}
              </span>
              {painting.stock > 0 ? (
                <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                </span>
              ) : (
                <span className="text-red-400 text-xs font-medium">Out of Stock</span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1 leading-tight">
              {painting.title}
            </h2>

            {/* Artist */}
            <p className="text-gray-400 mb-5">
              By <span className="text-white font-medium">{painting.artist}</span>
            </p>

            {/* Price */}
            <div className="text-3xl font-bold text-white mb-6">
              ${painting.price.toLocaleString()}
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
              {painting.description}
            </p>

            {/* Dimensions & Medium */}
            {(painting.dimensions || painting.medium) && (
              <div className="grid grid-cols-2 gap-3 mb-6 py-4 border-y border-[#3e4042]">
                {painting.dimensions && (
                  <div>
                    <div className="text-gray-500 text-xs flex items-center gap-1.5 mb-1">
                      <Ruler className="w-3.5 h-3.5" /> Dimensions
                    </div>
                    <div className="text-white text-sm font-medium">{painting.dimensions}</div>
                  </div>
                )}
                {painting.medium && (
                  <div>
                    <div className="text-gray-500 text-xs flex items-center gap-1.5 mb-1">
                      <Paintbrush className="w-3.5 h-3.5" /> Medium
                    </div>
                    <div className="text-white text-sm font-medium">{painting.medium}</div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={painting.stock < 1}
                className={`flex-1 py-3 flex items-center justify-center text-sm font-semibold rounded-xl ${
                  painting.stock < 1
                    ? 'bg-[#3a3b3c] text-gray-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                {painting.stock < 1 ? 'Sold Out' : 'Add to Cart'}
              </button>
              <button
                onClick={handleWishlist}
                className={`p-3 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'border-[#1877F2] bg-[#1877F2]/10 text-[#1877F2]'
                    : 'border-[#3e4042] text-white hover:border-[#1877F2]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#1877F2]' : ''}`} />
              </button>
            </div>

            {/* View Full Page link */}
            <Link
              to={`/gallery/${painting._id}`}
              onClick={onClose}
              className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-[#1877F2] transition-colors py-2"
            >
              <ExternalLink className="w-4 h-4" /> View Full Details
            </Link>

            {/* Trust badges */}
            <div className="mt-4 text-xs text-gray-500 bg-[#242526] p-3 rounded-xl border border-[#3e4042]">
              <p className="mb-1">✓ Free secure international shipping</p>
              <p className="mb-1">✓ Certificate of Authenticity included</p>
              <p>✓ 14-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintingDetailModal;
