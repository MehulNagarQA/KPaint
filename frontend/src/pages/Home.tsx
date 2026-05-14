import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brush } from 'lucide-react';
import type { Painting } from '../types';
import { paintingsAPI } from '../api';
import PaintingCard from '../components/PaintingCard';
import Loader from '../components/Loader';

const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await paintingsAPI.getAll({ featured: true, limit: 3 });
        if (data.success) {
          setFeatured(data.paintings);
        }
      } catch (error) {
        console.error('Failed to load featured paintings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const designCategories = [
    { name: 'Wall painting', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80' },
    { name: 'Hall painting', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80' },
    { name: 'Drawing room', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80' },
    { name: 'Rest room', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&q=80' },
    { name: 'Office painting', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80' },
    { name: 'Nature', image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&q=80' },
    { name: 'Human face', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Abstract dark blue gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#242526] via-[#18191a] to-[#18191a]"></div>
          {/* Decorative glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1877F2] rounded-full mix-blend-screen filter blur-[120px] opacity-10"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2d88ff] rounded-full mix-blend-screen filter blur-[120px] opacity-10"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
            <Brush className="w-4 h-4 text-[#1877F2]" />
            <span className="text-sm font-medium tracking-wider uppercase text-[#1877F2]">Painting for Art</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6">
            Painting for life <br />
            <span className="gradient-text italic opacity-90">Modern Spaces</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Exclusive masterpieces from worldwide.Breeze your home with colours and feel happiness
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/gallery" className="btn-primary text-lg px-8 py-4">
              Explore Gallery  <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/about" className="btn-secondary text-lg px-8 py-4 border-transparent hover:border-[#1877F2]">
              Our Philosophy
            </Link>
          </div>
        </div>
      </section>

      {/* Design Categories Section */}
      <section className="py-24 bg-[#18191a] relative border-t border-b border-[#3e4042]/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="section-title mb-4">Explore by Design</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Find the perfect masterpiece tailored for every room and aesthetic.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {designCategories.map((category, index) => (
              <Link 
                to={`/gallery?category=${encodeURIComponent(category.name)}`} 
                key={index}
                className="group relative h-48 md:h-64 rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <h3 className="text-white font-bold text-xl md:text-2xl tracking-wide shadow-black drop-shadow-md text-center px-4">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
            
            {/* Explore More Card */}
            <Link 
              to="/gallery" 
              className="group relative h-48 md:h-64 rounded-2xl overflow-hidden cursor-pointer bg-[#242526] border border-[#3e4042] flex flex-col items-center justify-center hover:bg-[#2d2f31] transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[#1877F2]/20 text-[#1877F2] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ArrowRight className="w-6 h-6" />
              </div>
              <span className="text-white font-medium text-lg">Explore All</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-[#12121a] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="section-title mb-4">Featured Collections</h2>
              <p className="text-gray-400 max-w-lg">
                Hand-picked selections representing the pinnacle of artistic achievement in our current exhibition.
              </p>
            </div>
            <Link to="/gallery" className="hidden md:flex items-center gap-2 text-[#1877F2] hover:text-[#2d88ff] transition-colors font-medium">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((painting) => (
                <PaintingCard key={painting._id} painting={painting} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link to="/gallery" className="btn-secondary">
              View All Artworks
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
