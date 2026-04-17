import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../types';
import type { Painting } from '../types';
import { paintingsAPI } from '../api';
import toast from 'react-hot-toast';
import { Trash2, Plus, Image as ImageIcon, X } from 'lucide-react';
import Loader from '../components/Loader';

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPainting, setEditingPainting] = useState<Painting | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, isAuthenticated, navigate]);

  const fetchPaintings = async () => {
    try {
      const { data } = await paintingsAPI.getAll({ limit: 100 });
      if (data.success) {
        setPaintings(data.paintings);
      }
    } catch (error) {
      toast.error('Failed to fetch paintings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchPaintings();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this artwork?')) return;
    try {
      await paintingsAPI.delete(id);
      toast.success('Painting deleted');
      setPaintings((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error('Failed to delete painting');
    }
  };

  const handleAddPainting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await paintingsAPI.create(formData);
      toast.success('Painting added successfully');
      setShowAddModal(false);
      fetchPaintings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add painting');
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = (p: Painting) => {
    setEditingPainting(p);
    setShowEditModal(true);
  };

  const handleUpdatePainting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPainting) return;
    setUploading(true);

    const formData = new FormData(e.currentTarget);
    
    // Quick validation to prevent empty file submission rewriting data incorrectly
    const file = formData.get('image') as File;
    if (file && file.size === 0) {
      formData.delete('image');
    }

    try {
      await paintingsAPI.update(editingPainting._id, formData);
      toast.success('Painting updated successfully');
      setShowEditModal(false);
      setEditingPainting(null);
      fetchPaintings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update painting');
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400">Manage catalog and inventory</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus className="w-5 h-5" /> Add Artwork
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="glass rounded-xl border border-[#3e4042] overflow-hidden bg-[#242526]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1c1e21] border-b border-[#3e4042]">
                  <th className="p-4 font-semibold text-gray-300">Image</th>
                  <th className="p-4 font-semibold text-gray-300">Title</th>
                  <th className="p-4 font-semibold text-gray-300">Artist</th>
                  <th className="p-4 font-semibold text-gray-300">Price</th>
                  <th className="p-4 font-semibold text-gray-300">Stock</th>
                  <th className="p-4 font-semibold text-gray-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paintings.map((painting) => (
                  <tr key={painting._id} className="border-b border-[#3e4042] hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <img src={painting.image} alt={painting.title} className="w-12 h-12 object-cover rounded shadow-md" />
                    </td>
                    <td className="p-4 font-medium text-white">{painting.title}</td>
                    <td className="p-4 text-gray-400">{painting.artist}</td>
                    <td className="p-4 text-[#1877F2] font-medium">${painting.price.toLocaleString()}</td>
                    <td className="p-4">
                      {painting.stock > 0 ? (
                        <span className="text-green-400">{painting.stock}</span>
                      ) : (
                        <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded">Out of Stock</span>
                      )}
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleEditClick(painting)} className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button onClick={() => handleDelete(painting._id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {paintings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">No paintings found. Add your first artwork!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Painting Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#242526] border border-[#3e4042] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl glass">
            <div className="p-6 border-b border-[#3e4042] flex justify-between items-center sticky top-0 bg-[#242526]/90 backdrop-blur">
              <h2 className="text-xl font-bold text-white">Add New Artwork</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddPainting} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input type="text" name="title" required className="input-field" placeholder="Starry Night" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Artist</label>
                  <input type="text" name="artist" required className="input-field" placeholder="Vincent van Gogh" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select name="category" required className="input-field bg-[#242526]">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
                  <input type="number" name="price" required min="0" className="input-field" placeholder="1000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Stock</label>
                  <input type="number" name="stock" required min="1" defaultValue="1" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Dimensions (Optional)</label>
                  <input type="text" name="dimensions" className="input-field" placeholder="24 x 36 inches" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea name="description" required rows={3} className="input-field resize-none" placeholder="Details about this masterpiece..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Image Upload</label>
                  <div className="border-2 border-dashed border-[#3e4042] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-[#1877F2] transition-colors relative">
                    <ImageIcon className="w-10 h-10 text-gray-500 mb-2" />
                    <span className="text-gray-400">Click to upload image</span>
                    <input type="file" name="image" accept="image/*" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                </div>
                <div className="md:col-span-2 flex items-center gap-2">
                  <input type="checkbox" name="featured" id="featured" className="w-4 h-4 rounded bg-[#242526] border-[#3e4042] text-[#1877F2] focus:ring-[#1877F2]" value="true" />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-300">Feature this artwork on the home page</label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-[#3e4042]">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={uploading} className="btn-primary">
                  {uploading ? 'Uploading...' : 'Save Artwork'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Painting Modal */}
      {showEditModal && editingPainting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#242526] border border-[#3e4042] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl glass">
            <div className="p-6 border-b border-[#3e4042] flex justify-between items-center sticky top-0 bg-[#242526]/90 backdrop-blur">
              <h2 className="text-xl font-bold text-white">Edit Artwork</h2>
              <button onClick={() => {setShowEditModal(false); setEditingPainting(null);}} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdatePainting} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input type="text" name="title" defaultValue={editingPainting.title} required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Artist</label>
                  <input type="text" name="artist" defaultValue={editingPainting.artist} required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select name="category" defaultValue={editingPainting.category} required className="input-field bg-[#242526]">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
                  <input type="number" name="price" defaultValue={editingPainting.price} required min="0" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Stock</label>
                  <input type="number" name="stock" defaultValue={editingPainting.stock} required min="0" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Dimensions</label>
                  <input type="text" name="dimensions" defaultValue={editingPainting.dimensions} className="input-field" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea name="description" defaultValue={editingPainting.description} required rows={3} className="input-field resize-none"></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Replace Image (Optional)</label>
                  <div className="border-2 border-dashed border-[#3e4042] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-[#1877F2] transition-colors relative">
                    <ImageIcon className="w-10 h-10 text-gray-500 mb-2" />
                    <span className="text-gray-400">Select new file to overwrite current image</span>
                    <input type="file" name="image" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                </div>
                <div className="md:col-span-2 flex items-center gap-2">
                  <input type="checkbox" name="featured" id="edit-featured" defaultChecked={editingPainting.featured} className="w-4 h-4 rounded bg-[#242526] border-[#3e4042] text-[#1877F2] focus:ring-[#1877F2]" value="true" />
                  <label htmlFor="edit-featured" className="text-sm font-medium text-gray-300">Feature this artwork on the home page</label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-[#3e4042]">
                <button type="button" onClick={() => {setShowEditModal(false); setEditingPainting(null);}} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={uploading} className="btn-primary">
                  {uploading ? 'Updating...' : 'Update Artwork'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
