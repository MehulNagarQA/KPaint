import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-t-2 border-[#c9a84c] animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-b-2 border-white/20 animate-spin-slow"></div>
      </div>
    </div>
  );
};

export default Loader;
