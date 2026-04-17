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

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Abstract dark gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1a28] via-[#0a0a0f] to-[#0a0a0f]"></div>
          {/* Decorative glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c9a84c] rounded-full mix-blend-screen filter blur-[120px] opacity-10"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a67c52] rounded-full mix-blend-screen filter blur-[120px] opacity-10"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
            <Brush className="w-4 h-4 text-[#c9a84c]" />
            <span className="text-sm font-medium tracking-wider uppercase text-[#c9a84c]">Discover Mastery</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6">
            Timeless Art for <br />
            <span className="gradient-text italic opacity-90">Modern Spaces</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Curated exclusive masterpieces from renowned and emerging artists worldwide. Elevate your environment with pure aesthetic brilliance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/gallery" className="btn-primary text-lg px-8 py-4">
              Explore Gallery <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/about" className="btn-secondary text-lg px-8 py-4 border-transparent hover:border-[#c9a84c]">
              Our Philosophy
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
            <Link to="/gallery" className="hidden md:flex items-center gap-2 text-[#c9a84c] hover:text-[#e8c97a] transition-colors font-medium">
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
