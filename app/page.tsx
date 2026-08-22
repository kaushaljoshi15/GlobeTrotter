'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  ArrowRight, 
  Shield, 
  Users, 
  Layers, 
  CheckCircle2, 
  Globe2, 
  Star, 
  Clock, 
  TrendingUp, 
  Mountain, 
  Palmtree, 
  Building2, 
  ChevronRight, 
  ArrowUpRight, 
  Plane,
  ArrowDown
} from 'lucide-react';
import BackgroundCarousel, { SCENIC_SLIDES } from '@/components/BackgroundCarousel';

export default function Home() {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const currentSlide = SCENIC_SLIDES[activeSlideIdx];

  const handleSelectDestination = (index: number) => {
    setActiveSlideIdx(index);
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] selection:bg-[#c99a6b] selection:text-white font-sans relative overflow-x-hidden">
      
      {/* Full-Bleed Cinematic Background Carousel (Unobstructed) */}
      <BackgroundCarousel 
        currentIndex={activeSlideIdx} 
        onSlideChange={(newIdx) => setActiveSlideIdx(newIdx)} 
      />

      {/* Floating Editorial Luxury Header */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-6 rounded-full bg-[#14151a]/85 backdrop-blur-2xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
          
          {/* Left: Minimal Monogram Brand */}
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] flex items-center justify-center text-[#1a1816] font-serif font-bold text-xs shadow-md">
                GT
              </div>
              <span className="font-serif tracking-widest text-xs uppercase font-medium text-stone-300 group-hover:text-white transition-colors hidden sm:inline">
                GlobeTrotter &bull; Atelier
              </span>
            </Link>
          </div>

          {/* Center: Playfair Display Luxury Brand Name */}
          <div className="text-center">
            <Link href="/" className="font-serif text-lg sm:text-xl tracking-tight text-white font-medium hover:text-[#e4c29e] transition-colors">
              the <span className="font-bold italic">GLOBETROTTER</span>
            </Link>
          </div>

          {/* Right: Navigation Links & CTA */}
          <div className="flex items-center gap-4">
            <Link 
              href="/explore" 
              className="text-xs tracking-wider uppercase text-stone-300 hover:text-white font-medium transition-colors hidden md:block"
            >
              Destinations
            </Link>
            <Link 
              href="/admin" 
              className="text-xs tracking-wider uppercase text-stone-300 hover:text-white font-medium transition-colors hidden md:block"
            >
              Analytics
            </Link>
            <Link 
              href="/login" 
              className="text-xs tracking-wider uppercase text-stone-300 hover:text-white font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="text-xs font-semibold bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] hover:brightness-110 px-5 py-1.5 rounded-full shadow-lg transition-all active:scale-95 duration-200"
            >
              Plan a Journey &rarr;
            </Link>
          </div>

        </div>
      </header>

      {/* Main Hero Section (Directly on Full-Bleed Background without any white box) */}
      <main className="relative z-20 pt-36 sm:pt-44 pb-20 px-4 sm:px-8 max-w-6xl mx-auto flex flex-col items-center text-center">
        
        {/* Subtle Live Destination Tag */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#14151a]/70 backdrop-blur-xl border border-white/15 text-stone-200 text-xs font-sans font-medium mb-8 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-[#e4c29e] animate-ping" />
          <span className="text-stone-400 uppercase tracking-widest text-[10px] font-bold">Now Exploring:</span>
          <span className="text-white font-serif italic font-semibold">{currentSlide.title} ({currentSlide.country})</span>
        </div>

        {/* Playfair Display Statement Headline */}
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tight leading-[1.06] max-w-4xl text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] mb-6">
          Travel, <span className="font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-[#e4c29e] via-[#f7e3ce] to-[#c99a6b]">composed.</span>
        </h1>

        <p className="font-serif text-lg sm:text-2xl text-stone-200 leading-relaxed max-w-2xl font-normal drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] mb-10">
          We curate intelligent <span className="font-semibold italic text-white">multi-city journeys</span> across the world’s most evocative mountain hills, serene archipelagos &amp; timeless cultural capitals.
        </p>

        {/* Luxury CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] font-sans font-bold text-xs tracking-wider uppercase shadow-[0_10px_35px_rgba(201,154,107,0.4)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <span>Plan a Journey Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/explore"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#14151a]/80 hover:bg-[#1f2128] border border-white/20 text-stone-200 hover:text-white font-sans font-semibold text-xs tracking-wider uppercase backdrop-blur-xl shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#e4c29e]" />
            <span>Explore Destinations Catalog</span>
          </Link>
        </div>

        {/* Interactive Translucent Destination Switcher Bar */}
        <div className="w-full max-w-3xl bg-[#14151a]/80 backdrop-blur-2xl border border-white/10 p-3 rounded-full shadow-2xl flex items-center justify-between gap-2 overflow-x-auto">
          <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#c99a6b] pl-3 shrink-0 hidden sm:inline">
            Curated Views:
          </span>

          <div className="flex items-center gap-1.5 mx-auto">
            {SCENIC_SLIDES.map((slide, idx) => {
              const isSelected = activeSlideIdx === idx;
              return (
                <button
                  key={slide.id}
                  onClick={() => handleSelectDestination(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#FAF8F5] text-[#0c0d10] font-bold shadow-lg scale-105'
                      : 'text-stone-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {slide.location.split('&')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Curated Signature Itineraries Grid */}
        <div className="w-full mt-24 mb-16 text-left">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
                Signature Multi-City Routes
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-white tracking-tight mt-1">
                Featured Expeditions &bull; <span className="font-normal italic text-stone-300">Autumn &amp; Winter Dispatches</span>
              </h2>
            </div>

            <Link
              href="/explore"
              className="text-xs font-sans font-semibold uppercase tracking-wider text-[#c99a6b] hover:text-[#e4c29e] flex items-center gap-1 group"
            >
              <span>Explore all destinations</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Expedition 1 */}
            <div className="rounded-[28px] bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 p-6 flex flex-col justify-between hover:border-[#c99a6b]/50 transition-all duration-300 group shadow-2xl">
              <div>
                <div className="h-48 rounded-2xl overflow-hidden mb-4 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" 
                    alt="Swiss Alps"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-sans font-bold uppercase tracking-wider text-white">
                    8 Days &bull; Alpine Trail
                  </span>
                </div>

                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#c99a6b]">
                  Switzerland &bull; Valais
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-1 group-hover:text-[#e4c29e] transition-colors">
                  The Alpine Glacier Odyssey
                </h3>
                <p className="font-sans text-xs text-stone-400 mt-1.5 leading-relaxed">
                  Zermatt, Matterhorn Glacier Paradise &amp; panoramic Glacier Express railway stops.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-semibold">Budget Target</span>
                  <p className="font-sans font-bold text-white text-sm">$1,850 USD</p>
                </div>
                <Link
                  href="/trips/new"
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-[#c99a6b] hover:text-[#0c0d10] text-xs font-sans font-bold text-white transition-all"
                >
                  Plan Route &rarr;
                </Link>
              </div>
            </div>

            {/* Expedition 2 */}
            <div className="rounded-[28px] bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 p-6 flex flex-col justify-between hover:border-[#c99a6b]/50 transition-all duration-300 group shadow-2xl">
              <div>
                <div className="h-48 rounded-2xl overflow-hidden mb-4 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80" 
                    alt="Santorini"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-sans font-bold uppercase tracking-wider text-white">
                    10 Days &bull; Cyclades
                  </span>
                </div>

                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#c99a6b]">
                  Greece &bull; Aegean
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-1 group-hover:text-[#e4c29e] transition-colors">
                  The Cycladic Solitude
                </h3>
                <p className="font-sans text-xs text-stone-400 mt-1.5 leading-relaxed">
                  Santorini caldera sunsets, Milos moonscape beaches &amp; secluded Aegean coves.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-semibold">Budget Target</span>
                  <p className="font-sans font-bold text-white text-sm">$2,200 USD</p>
                </div>
                <Link
                  href="/trips/new"
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-[#c99a6b] hover:text-[#0c0d10] text-xs font-sans font-bold text-white transition-all"
                >
                  Plan Route &rarr;
                </Link>
              </div>
            </div>

            {/* Expedition 3 */}
            <div className="rounded-[28px] bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 p-6 flex flex-col justify-between hover:border-[#c99a6b]/50 transition-all duration-300 group shadow-2xl">
              <div>
                <div className="h-48 rounded-2xl overflow-hidden mb-4 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80" 
                    alt="Kyoto"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-sans font-bold uppercase tracking-wider text-white">
                    12 Days &bull; Heritage &amp; Hills
                  </span>
                </div>

                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#c99a6b]">
                  Japan &bull; Kansai
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-1 group-hover:text-[#e4c29e] transition-colors">
                  Kyoto Mist &amp; Tokyo Neon
                </h3>
                <p className="font-sans text-xs text-stone-400 mt-1.5 leading-relaxed">
                  Arashiyama bamboo hillside walks, Gion tea ceremonies &amp; Shinjuku nightscapes.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-semibold">Budget Target</span>
                  <p className="font-sans font-bold text-white text-sm">$2,450 USD</p>
                </div>
                <Link
                  href="/trips/new"
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-[#c99a6b] hover:text-[#0c0d10] text-xs font-sans font-bold text-white transition-all"
                >
                  Plan Route &rarr;
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* The Three Pillars of Travel Composition */}
        <div className="w-full mt-4 mb-16 rounded-[32px] bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 p-8 sm:p-12 text-left shadow-2xl">
          
          <div className="max-w-xl mb-10">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
              Why Discerning Travelers Choose GlobeTrotter
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight mt-1">
              Engineered with <span className="italic font-normal text-[#e4c29e]">architectural precision.</span>
            </h2>
            <p className="font-sans text-xs text-stone-400 mt-2">
              Everything needed to compose complex, unforgettable journeys without spreadsheets or guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="space-y-3">
              <span className="font-serif text-3xl font-bold text-[#c99a6b]">01</span>
              <h3 className="font-serif text-lg font-bold text-white">Smart Timeline Stop Builder</h3>
              <p className="font-sans text-xs text-stone-400 leading-relaxed">
                Seamlessly model multi-city sequences, arrival dates, and transport links with interactive route mapping.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-serif text-3xl font-bold text-[#c99a6b]">02</span>
              <h3 className="font-serif text-lg font-bold text-white">Intelligent Daily Spend Balancing</h3>
              <p className="font-sans text-xs text-stone-400 leading-relaxed">
                Auto-calculate daily allowances, categorize lodging &amp; activity expenses, and monitor budget health live.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-serif text-3xl font-bold text-[#c99a6b]">03</span>
              <h3 className="font-serif text-lg font-bold text-white">Public Sharable Expeditions</h3>
              <p className="font-sans text-xs text-stone-400 leading-relaxed">
                Distribute elegant read-only itinerary codes that fellow travelers can clone into their own atelier in seconds.
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* Editorial Boutique Footer */}
      <footer className="w-full border-t border-white/10 bg-[#0c0d10] py-12 px-6 text-center text-xs text-stone-500 font-sans relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#c99a6b] flex items-center justify-center font-serif font-bold text-xs text-[#0c0d10]">
              GT
            </div>
            <span className="font-serif font-bold text-stone-200 tracking-wider">
              the GLOBETROTTER ATELIER
            </span>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-sans font-medium uppercase tracking-wider text-stone-400">
            <Link href="/explore" className="hover:text-white transition-colors">Catalog</Link>
            <Link href="/login" className="hover:text-white transition-colors">Member Sign In</Link>
            <Link href="/register" className="hover:text-white transition-colors">Create Account</Link>
          </div>

          <p className="text-stone-500 text-[11px]">
            &copy; {new Date().getFullYear()} GlobeTrotter &bull; Luxury Travel Operating System
          </p>
        </div>
      </footer>

    </div>
  );
}