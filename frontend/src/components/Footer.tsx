import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#2a2a40] bg-[#0a0a0f] py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-2xl font-bold tracking-tighter gradient-text mb-4">KPaint</h3>
          <p className="text-gray-400 max-w-sm">
            Curated premium artworks for your exceptional spaces. Elevate your walls with mastery and vision.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/gallery" className="hover:text-[#1877F2] transition-colors">Gallery</a></li>
            <li><a href="#" className="hover:text-[#1877F2] transition-colors">Artists</a></li>
            <li><a href="#" className="hover:text-[#1877F2] transition-colors">Exhibitions</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-[#1877F2] transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#1877F2] transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-[#1877F2] transition-colors">Returns</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-[#2a2a40] text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} KPaint Gallery. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
