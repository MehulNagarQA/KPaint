import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import type { Painting } from '../types';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../api';
import toast from 'react-hot-toast';
import { useCartStore } from '../store/cartStore';

interface Props {
  painting: Painting;
}

const PaintingCard: React.FC<Props> = ({ painting }) => {
  const { user, isAuthenticated, toggleWishlistIcon } = useAuthStore();
  const { addToCart } = useCartStore();

  const isWishlisted = user?.wishlist?.includes(painting._id);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to save to wishlist');

    try {
      toggleWishlistIcon(painting._id); // Optimistic UI update
      await authAPI.toggleWishlist(painting._id);
    } catch {
      toast.error('Failed to update wishlist');
      toggleWishlistIcon(painting._id); // Revert on failure
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
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
    <Link to={`/gallery/${painting._id}`} className="block group">
      <div className="card h-full flex flex-col hover-lift bg-[#242526]">
        
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#18191a]">
          <img
            src={painting.image}
            alt={painting.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#18191a] via-transparent to-transparent opacity-60"></div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {painting.featured && <span className="badge badge-accent">Featured</span>}
            {painting.stock === 0 && <span className="badge bg-red-900/80 text-red-100 accent-border">Out of Stock</span>}
          </div>

          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 p-2 rounded-full glass hover:bg-white/10 transition-colors z-10"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#1877F2] text-[#1877F2]' : 'text-white'}`} />
          </button>

          {/* Quick Actions overlay */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              className="btn-primary py-2 px-4 shadow-xl"
            >
              <ShoppingBag className="w-4 h-4" /> Add
            </button>
            <div className="btn-secondary py-2 px-4 shadow-xl bg-black/40 backdrop-blur-md">
              <Eye className="w-4 h-4" /> View
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white group-hover:text-[#1877F2] transition-colors line-clamp-1">{painting.title}</h3>
              <span className="text-[#1877F2] font-bold text-lg">${painting.price.toLocaleString()}</span>
            </div>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{painting.description}</p>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300 font-medium">By {painting.artist}</span>
            <span className="text-gray-500">{painting.category}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PaintingCard;
