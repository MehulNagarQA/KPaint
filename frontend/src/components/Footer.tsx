import React from 'react';
import logo from '../assets/newpainting.jpg';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#2a2a40] bg-[#0a0a0f] py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/*  */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={logo} 
              alt="KPaint Logo" 
              className="w-10 h-10 object-cover rounded-lg" 
            />
            <h3 className="text-2xl font-bold tracking-tighter gradient-text">
              KPaint Website for selling online paintings
            </h3>
          </div>

          <p className="text-gray-400 max-w-sm">
             Premium paiting in affordable prices
          </p>
        </div>

        {/* EXPLORE */}
        <div>
          <h4 className="text-white font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/gallery" className="hover:text-[#1877F2]">Gallery</a></li>
            <li><a href="#" className="hover:text-[#1877F2]">Artists</a></li>
            <li><a href="#" className="hover:text-[#1877F2]">Exhibitions</a></li>
            <li><a href="/login" className="hover:text-[#1877F2]">Payment</a></li>
            <li><a href="/login" className="hover:text-[#1877F2]">Login</a></li>
          </ul>
        </div>

        {/* LEGAL */}
        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Returns</a></li>
          </ul>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-[#2a2a40] text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} KPaint Gallery. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;