import React, { useEffect, useState, useCallback } from 'react';
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../types';
import type { Category, Painting } from '../types';
import { paintingsAPI } from '../api';
import PaintingCard from '../components/PaintingCard';
import Loader from '../components/Loader';
import { useSearchParams } from 'react-router-dom';

const Gallery: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPaintings = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const { data } = await paintingsAPI.getAll({ ...params, limit: 12 });
      if (data.success) {
        setPaintings(data.paintings);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      }
    } catch (error) {
      console.error('Failed to fetch paintings', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchPaintings();
  }, [fetchPaintings]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    const minPrice = formData.get('minPrice') as string;
    const maxPrice = formData.get('maxPrice') as string;
    
    if (search) searchParams.set('search', search);
    else searchParams.delete('search');

    if (minPrice) searchParams.set('minPrice', minPrice);
    else searchParams.delete('minPrice');

    if (maxPrice) searchParams.set('maxPrice', maxPrice);
    else searchParams.delete('maxPrice');

    searchParams.delete('page');
    setSearchParams(searchParams);
  };

  const setCategoryFilter = (cat: string) => {
    if (searchParams.get('category') === cat) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    searchParams.delete('page');
    setSearchParams(searchParams);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
    // Scroll near the top smoothly
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const currentCategory = searchParams.get('category');

  return (
    <div className="pt-28 pb-20 min-h-screen max-w-7xl mx-auto px-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">The Gallery</h1>
          <p className="text-gray-400">Discover our expansive collection of fine art.</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                name="search"
                placeholder="Search artworks..." 
                defaultValue={searchParams.get('search') || ''}
                className="input-field pl-10 bg-[#242526]"
              />
            </div>
            
            <input 
              type="number" 
              name="minPrice"
              placeholder="Min $" 
              defaultValue={searchParams.get('minPrice') || ''}
              className="input-field bg-[#242526] w-24 hidden md:block"
            />
            <input 
              type="number" 
              name="maxPrice"
              placeholder="Max $" 
              defaultValue={searchParams.get('maxPrice') || ''}
              className="input-field bg-[#242526] w-24 hidden md:block"
            />
            <button type="submit" className="hidden" />
          </form>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-lg border transition-colors ${showFilters ? 'bg-[#1877F2] text-white border-[#1877F2]' : 'glass border-[#3e4042] text-gray-300 hover:text-white'}`}
          >
            {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="glass p-6 rounded-xl mb-12 animate-fade-in-up">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentCategory === cat 
                    ? 'bg-[#1877F2] text-white' 
                    : 'bg-[#242526] text-gray-300 border border-[#3e4042] hover:border-[#1877F2] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : paintings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {paintings.map(painting => (
              <PaintingCard key={painting._id} painting={painting} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border transition-colors ${
                  currentPage === 1 
                    ? 'bg-transparent border-[#3e4042] text-gray-600 cursor-not-allowed' 
                    : 'glass border-[#3e4042] text-gray-300 hover:text-white hover:border-[#1877F2]'
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="text-gray-400 font-medium">
                Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border transition-colors ${
                  currentPage === totalPages 
                    ? 'bg-transparent border-[#3e4042] text-gray-600 cursor-not-allowed' 
                    : 'glass border-[#3e4042] text-gray-300 hover:text-white hover:border-[#1877F2]'
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-[#18191a] rounded-2xl border border-[#3e4042]">
          <h3 className="text-2xl font-semibold text-white mb-2">No artworks found</h3>
          <p className="text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
          {(searchParams.has('search') || searchParams.has('category')) && (
            <button 
              onClick={() => setSearchParams(new URLSearchParams())}
              className="mt-6 btn-secondary"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Gallery;
