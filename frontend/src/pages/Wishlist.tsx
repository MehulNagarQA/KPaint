import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import type { Painting } from '../types';
import { authAPI } from '../api';
import Loader from '../components/Loader';
import PaintingCard from '../components/PaintingCard';
import { Link } from 'react-router-dom';

const Wishlist: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [wishlistItems, setWishlistItems] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) return;
      try {
        const { data } = await authAPI.getMe();
        if (data.success && data.user?.wishlist) {
          setWishlistItems(data.user.wishlist);
        }
      } catch (error) {
        console.error('Failed to fetch wishlist', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-20 text-center max-w-lg mx-auto">
        <h2 className="text-3xl font-bold mb-4">Your Wishlist</h2>
        <p className="text-gray-400 mb-8">Please sign in to view your saved artwork.</p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-6">
      <h1 className="text-4xl font-bold mb-4">Your Wishlist</h1>
      <p className="text-gray-400 mb-12">Your personal collection of favorite masterpieces.</p>

      {loading ? (
        <Loader />
      ) : wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistItems.map((painting) => (
            <PaintingCard key={painting._id} painting={painting} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#242526] rounded-2xl border border-[#3e4042]">
          <h3 className="text-2xl font-semibold text-white mb-2">No saved artworks yet</h3>
          <p className="text-gray-400 mb-6">Explore the gallery and add paintings you love to your wishlist.</p>
          <Link to="/gallery" className="btn-primary">Explore Gallery</Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
