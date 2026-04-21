import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../api';
import toast from 'react-hot-toast';
import { Palette, Mail, Lock, User } from 'lucide-react';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.register({ name, email, password });
      if (data.success) {
        login(data.user, data.token);
        toast.success(`Welcome to KPaint, ${data.user.name}`);
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[#0a0a0f] z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1877F2]/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2d88ff]/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#18191a] to-[#242526] border border-[#3e4042] mb-6 shadow-xl transform transition-transform hover:scale-105">
            <Palette className="w-10 h-10 text-[#1877F2]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Join the Gallery</h1>
          <p className="text-gray-400 font-medium">Start your exclusive art collection</p>
        </div>

        <form onSubmit={handleSubmit} className="glass p-10 rounded-3xl border-[#3e4042]/50 space-y-5 shadow-2xl animate-slide-up">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 ml-1">Full Name</label>
            <div className="relative group">
              <User 
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 watermark-icon
                  ${name ? 'hidden' : 'text-gray-500 group-focus-within:text-[#1877F2]'}`} 
              />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`input-field ${name ? '' : 'input-with-icon'}`}
                placeholder={name ? '' : 'Leonardo da Vinci'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 ml-1">Email Address</label>
            <div className="relative group">
              <Mail 
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 watermark-icon
                  ${email ? 'hidden' : 'text-gray-500 group-focus-within:text-[#1877F2]'}`} 
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input-field ${email ? '' : 'input-with-icon'}`}
                placeholder={email ? '' : 'master@art.com'}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 ml-1">Password</label>
            <div className="relative group">
              <Lock 
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 watermark-icon
                  ${password ? 'hidden' : 'text-gray-500 group-focus-within:text-[#1877F2]'}`} 
              />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input-field ${password ? '' : 'input-with-icon'}`}
                placeholder={password ? '' : 'Min. 6 characters'}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center text-lg py-3.5 rounded-xl shadow-lg ring-offset-2 ring-offset-[#0a0a0f] focus:ring-2 focus:ring-[#1877F2]/50 transition-all active:scale-95"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p className="text-gray-400">
            Already a member?{' '}
            <Link to="/login" className="text-[#1877F2] hover:text-white transition-all font-semibold underline-offset-4 hover:underline decoration-2">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
