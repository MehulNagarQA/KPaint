import React from 'react';
import { Award, Clock, Palette, Sparkles, BookOpen, Layers } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-24 pb-20">
      {/* Hero Section with Artist Image */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#1877F2] to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative rounded-2xl overflow-hidden glass border-white/10 p-2">
              <img 
                src="/artist-portrait.png" 
                alt="Master Artist" 
                className="w-full h-auto rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            {/* Stats Badge */}
            <div className="absolute -bottom-8 -right-8 glass p-8 rounded-2xl border-white/10 shadow-2xl animate-bounce-slow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1877F2]/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#1877F2]" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">40+</p>
                  <p className="text-sm text-gray-400 font-medium tracking-wider uppercase">Years Experience</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-[#1877F2]/30 mb-6">
              <Award className="w-4 h-4 text-[#1877F2]" />
              <span className="text-sm font-semibold tracking-wider uppercase text-[#1877F2]">Master of Arts</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight">
              A Lifetime Dedicated to <span className="gradient-text italic">The Canvas</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed mb-8">
              For over four decades, I have been translating the whispers of the world onto the silent stage of canvas. My journey began in a small sunlit attic, fueled by a singular obsession: to capture the ephemeral beauty of existence through color and light.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#1877F2]" /> Legacy
                </h3>
                <p className="text-sm text-gray-400">Founded on traditional techniques, evolved through modern exploration.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#1877F2]" /> Vision
                </h3>
                <p className="text-sm text-gray-400">Turning abstract emotions into tangible masterpieces that breathe life into spaces.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Painting Concepts Section */}
      <section className="bg-[#0a0a0f] py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Foundational Concepts</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Every stroke is a deliberate choice, guided by principles refined over 40 years of artistic evolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-3xl border-white/5 hover:border-[#1877F2]/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-[#1877F2]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-7 h-7 text-[#1877F2]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Texture & Depth</h3>
              <p className="text-gray-400 leading-relaxed">
                Utilizing impasto techniques and glazing layers to create physical presence. The painting isn't just seen; it's felt through the dimensionality of the paint.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl border-white/5 hover:border-[#1877F2]/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-[#1877F2]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Palette className="w-7 h-7 text-[#1877F2]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Harmonic Palette</h3>
              <p className="text-gray-400 leading-relaxed">
                Color theory is the soul of my work. I explore complementary vibrations and atmospheric perspective to evoke specific emotional responses in the viewer.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl border-white/5 hover:border-[#1877F2]/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-[#1877F2]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7 text-[#1877F2]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Visual Storytelling</h3>
              <p className="text-gray-400 leading-relaxed">
                Beyond aesthetics, each collection explores a narrative. Whether it's the dance of light at dawn or the chaos of urban life, there is always a story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold mb-8 italic">"Art is not what you see, but what you make others see."</h2>
        <div className="h-1 w-24 bg-[#1877F2] mx-auto mb-8 rounded-full"></div>
        <p className="text-lg text-gray-400 leading-relaxed italic">
          Forty years of experience has taught me that a painting is never truly finished; it only pauses when it has enough energy to speak for itself. My goal is to provide a voice for the silent moments of beauty in our busy lives.
        </p>
      </section>
    </div>
  );
};

export default About;
