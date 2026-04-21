import React, { useState } from 'react';
import { X, Upload, Plus, AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../types';
import { paintingsAPI } from '../api';
import toast from 'react-hot-toast';

interface AddArtworkModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddArtworkModal: React.FC<AddArtworkModalProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    category: 'Abstract',
    price: '',
    stock: '1',
    description: '',
    featured: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('artist', formData.artist);
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('description', formData.description);
    data.append('featured', String(formData.featured));
    data.append('image', selectedFile);

    try {
      const response = await paintingsAPI.create(data);
      if (response.data.success) {
        toast.success('Artwork added successfully!');
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error('Upload failed', error);
      toast.error(error.response?.data?.message || 'Failed to upload artwork');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a0a0f]/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#18191a] border border-[#3e4042]/50 rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-slide-up">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-[#3e4042]/30 bg-[#1c1d1e]">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#1877F2]/10">
                <Plus className="w-5 h-5 text-[#1877F2]" />
              </div>
              Add New Artwork
            </h2>
            <p className="text-xs text-gray-400 mt-1 ml-11">Register a masterpiece to your digital collection</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-all transform hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          
          {/* Image Upload Area */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-300 ml-1">Artwork Image</label>
            <div 
              className={`relative border-2 border-dashed rounded-2xl transition-all h-72 overflow-hidden group cursor-pointer
                ${imagePreview ? 'border-[#1877F2]/50' : 'border-[#3e4042] hover:border-[#1877F2]/50 bg-white/[0.02]'}`}
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain bg-black/40" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white/10 p-4 rounded-full border border-white/20">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-10 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-[#1877F2]/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#1877F2]/20 transition-all duration-300">
                    <Upload className="w-8 h-8 text-[#1877F2]" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Click to upload image</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG, or WebP (max 5MB)</p>
                  </div>
                </div>
              )}
              <input 
                id="image-upload" 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300 ml-1">Title</label>
              <input 
                type="text" 
                name="title" 
                required
                value={formData.title}
                onChange={handleInputChange}
                className="input-field" 
                placeholder="Starry Night"
              />
            </div>

            {/* Artist */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300 ml-1">Artist</label>
              <input 
                type="text" 
                name="artist" 
                required
                value={formData.artist}
                onChange={handleInputChange}
                className="input-field" 
                placeholder="Vincent van Gogh"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300 ml-1">Category</label>
              <select 
                name="category" 
                value={formData.category}
                onChange={handleInputChange}
                className="input-field appearance-none cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-[#18191a]">{cat}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300 ml-1">Price ($)</label>
              <input 
                type="number" 
                name="price" 
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className="input-field"
                placeholder="99.99"
              />
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300 ml-1">Stock</label>
              <input 
                type="number" 
                name="stock" 
                required
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            {/* Featured */}
            <div className="flex items-center gap-4 pt-10">
              <div className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="featured" 
                  id="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-6 h-6 rounded-lg border-[#3e4042] bg-[#242526] text-[#1877F2] focus:ring-[#1877F2] focus:ring-offset-0 ring-offset-transparent transition-all"
                />
                <label htmlFor="featured" className="ml-3 text-sm font-semibold text-gray-300 cursor-pointer select-none">
                  Mark as Featured
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 pb-4">
            <label className="block text-sm font-semibold text-gray-300 ml-1">Description</label>
            <textarea 
              name="description" 
              required
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="input-field resize-none min-h-[120px]"
              placeholder="Describe the masterpiece..."
            />
          </div>

          {/* Alert for storage limits */}
          <div className="flex items-start gap-4 p-5 bg-[#1877F2]/5 rounded-2xl border border-[#1877F2]/10 mb-2">
            <div className="p-2 rounded-lg bg-[#1877F2]/10">
              <AlertCircle className="w-5 h-5 text-[#1877F2]" />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Images will be securely hosted on Cloudinary and indexed in MongoDB. High-resolution images (up to 5MB) are recommended for professional gallery presentation.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-[#3e4042]/30 bg-[#1c1d1e] flex justify-end gap-4">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-all"
            disabled={loading}
          >
            Discard
          </button>
          <button 
            type="submit" 
            form="modal-form"
            onClick={(e) => {
              const form = (e.currentTarget as HTMLButtonElement).form;
              if (form) form.requestSubmit();
            }}
            className="btn-primary px-10 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Publish Artwork</span>
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              </div>
            )}
          </button>
          <form id="modal-form" onSubmit={handleSubmit} className="hidden" />
        </div>
      </div>
    </div>
  );
};

export default AddArtworkModal;
