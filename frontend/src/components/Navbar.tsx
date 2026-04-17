import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Palette, LogOut, Shield, Heart } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemsCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <nav className="fixed w-full z-50 glass border-b border-white/10 px-6 py-4 transition-all top-0">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Palette className="w-8 h-8 text-[#c9a84c] group-hover:rotate-12 transition-transform" />
          <span className="text-2xl font-bold tracking-tighter gradient-text">KPaint</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-300 hover:text-[#c9a84c] transition-colors font-medium">Home</Link>
          <Link to="/gallery" className="text-gray-300 hover:text-[#c9a84c] transition-colors font-medium">Gallery</Link>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative group p-2">
            <ShoppingCart className="w-6 h-6 text-gray-300 group-hover:text-[#c9a84c] transition-colors" />
            {cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#c9a84c] text-[#0a0a0f] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center -mt-1 -mr-1">
                {cartItemsCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="group relative">
              <button className="flex items-center gap-2 text-gray-300 hover:text-[#c9a84c] transition-colors font-medium">
                <User className="w-6 h-6" />
                <span className="hidden md:block">{user?.name.split(' ')[0]}</span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#12121a] border border-[#2a2a40] py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all glass shadow-xl shadow-black/50">
                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-[#c9a84c] transition-colors">
                  <User className="w-4 h-4" /> My Profile
                </Link>
                <Link to="/wishlist" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-[#c9a84c] transition-colors">
                  <Heart className="w-4 h-4" /> Wishlist
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-[#c9a84c] transition-colors">
                    <Shield className="w-4 h-4" /> Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-secondary text-sm">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
