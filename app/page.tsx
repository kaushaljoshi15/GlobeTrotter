'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  Receipt,
  Flame,
  Repeat
} from 'lucide-react';
import BackgroundCarousel, { SCENIC_SLIDES } from '@/components/BackgroundCarousel';

export default function Home() {
  const [slideIndex, setSlideIndex] = useState(0);

  const switchToSlide = (idx: number) => {
    setSlideIndex(idx);
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-stone-100 selection:bg-[#c99a6b] selection:text-[#0c0d10] overflow-x-hidden relative font-sans flex flex-col items-center">
      
      {/* Dynamic Background Photo Carousel */}
      <BackgroundCarousel 
        currentIndex={slideIndex} 
        onSlideChange={(newIdx) => setSlideIndex(newIdx)} 
      />

      {/* Global Dynamic Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="w-full max-w-6xl px-4 sm:px-6 pt-36 pb-16 flex flex-col items-center text-center relative z-20">
        
        {/* Live Status & Promo Badge */}
        <div className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c99a6b]/30 bg-[#14151a]/85 backdrop-blur-xl text-[#e4c29e] text-xs font-sans font-medium tracking-wide mb-6 shadow-xl shadow-black/40">
          <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
          <span className="font-serif font-bold text-white tracking-wide">the GLOBETROTTER</span> &bull; Boutique Travel Architecture &amp; Multi-City Design
        </div>
        
        {/* High-Impact Hero Title in Playfair Display Serif */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight mb-6 leading-[1.12] max-w-4xl text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
          Discover the world. <br className="hidden md:block" />
          <span className="font-bold italic text-[#e4c29e] drop-shadow-[0_4px_30px_rgba(201,154,107,0.3)]">
            Design seamless journeys.
          </span>
        </h1>
        
        <p className="font-serif text-base sm:text-xl text-stone-200 max-w-2xl mb-8 leading-relaxed font-normal drop-shadow-[0_2px_15px_rgba(0,0,0,0.95)] bg-[#0c0d10]/60 backdrop-blur-md p-4 rounded-3xl border border-white/10">
          The intelligent operating system for multi-city travel composition. Model complex stops, auto-calculate daily budgets, track expenses, and clone public itineraries with one click.
        </p>
        
        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12">
          <Link 
            href="/register" 
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] rounded-2xl font-sans font-bold text-sm shadow-2xl shadow-[#c99a6b]/25 hover:shadow-[#c99a6b]/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5"
          >
            Create Your Itinerary Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/explore" 
            className="w-full sm:w-auto px-8 py-4 bg-[#14151a]/90 hover:bg-[#1a1b22] border border-white/15 text-stone-200 hover:text-white rounded-2xl font-sans font-bold text-sm shadow-xl backdrop-blur-md transition-all flex items-center justify-center gap-2.5"
          >
            <Compass className="w-4 h-4 text-[#c99a6b]" />
            Explore Destinations Catalog
          </Link>
        </div>

        {/* Featured Scenic Destination Cards Strip */}
        <div className="w-full max-w-5xl mt-2 mb-8">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b] flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#c99a6b] fill-[#c99a6b]" />
              Curated Expeditions &amp; Scenic Hill Routes
            </span>
            <span className="text-[11px] text-stone-400 font-sans hidden sm:inline">
              Click any destination to preview in background
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SCENIC_SLIDES.slice(0, 4).map((slide, idx) => {
              const isSelected = slideIndex === idx;
              return (
                <div
                  key={slide.id}
                  onClick={() => switchToSlide(idx)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border text-left p-3.5 flex flex-col justify-between h-36 ${
                    isSelected 
                      ? 'border-[#c99a6b] ring-2 ring-[#c99a6b]/50 shadow-2xl shadow-[#c99a6b]/20 scale-[1.03] bg-[#14151a]/95' 
                      : 'border-white/10 bg-[#0c0d10]/80 hover:border-white/20 hover:bg-[#14151a]/90'
                  }`}
                >
                  <img 
                    src={slide.imageUrl} 
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-[#0c0d10]/75 to-transparent" />

                  {/* Top Promo Tag */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#c99a6b]/20 text-[#e4c29e] border border-[#c99a6b]/30 backdrop-blur-md">
                      {slide.category}
                    </span>
                    <span className="text-[10px] font-sans font-bold text-amber-300 flex items-center gap-0.5">
                      ★ {slide.rating}
                    </span>
                  </div>

                  {/* Bottom Information */}
                  <div className="relative z-10">
                    <p className="font-serif text-sm font-bold text-white group-hover:text-[#e4c29e] transition-colors line-clamp-1">
                      {slide.title}
                    </p>
                    <p className="text-[10px] font-sans text-stone-300 truncate">
                      {slide.country} &bull; <span className="text-[#e4c29e] font-bold">${slide.pricePerDay}/d</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* High-Fidelity App UI Mockup Preview */}
      <section id="preview" className="w-full max-w-5xl px-4 sm:px-6 relative z-20 pb-28">
        <div className="rounded-3xl border border-white/15 bg-[#111217]/95 backdrop-blur-2xl shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)] overflow-hidden relative flex flex-col">
          
          {/* OS Window Header Bar */}
          <div className="h-11 border-b border-white/10 bg-[#0c0d10]/95 px-4 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>
            <div className="h-6 px-4 bg-[#14151a] rounded-md text-[11px] text-stone-400 font-mono flex items-center justify-center border border-white/10">
              globetrotter.io/trips/japan-autumn-escape-2026
            </div>
            <div className="w-12"></div>
          </div>

          {/* Interactive Mockup Body */}
          <div className="p-6 sm:p-8 bg-[#0c0d10]/85 space-y-6">
            
            {/* Top Itinerary Hero Strip */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#14151a] via-[#14151a] to-[#1c1d24] border border-[#c99a6b]/30">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#c99a6b]/20 text-[#e4c29e] text-[10px] font-sans font-bold uppercase tracking-wider">
                  Featured Multi-City Route
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-1">Japan Autumn Odyssey: Tokyo &rarr; Kyoto</h3>
                <p className="font-sans text-xs text-stone-400 mt-0.5">14 Days &bull; 2 Destinations &bull; 7 Curated Experiences</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold font-sans">Budget Target</span>
                  <p className="font-serif text-xl font-bold text-[#e4c29e]">$3,500 USD</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-right">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold font-sans">Stops</span>
                  <p className="font-serif text-xl font-bold text-white">2 Cities</p>
                </div>
              </div>
            </div>

            {/* Stop 1 Card Mockup */}
            <div className="p-5 rounded-2xl bg-[#14151a]/90 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#c99a6b]/20 text-[#e4c29e] font-serif font-bold flex items-center justify-center border border-[#c99a6b]/30 text-sm">
                  1
                </div>
                <img
                  src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=200&q=80"
                  alt="Tokyo"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-serif text-base font-bold text-white">Tokyo, Japan</h4>
                  <p className="font-sans text-xs text-stone-400">Oct 10 - Oct 17 &bull; Shibuya &amp; Shinjuku</p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-sans">
                <span className="px-3 py-1 rounded-xl bg-white/5 text-stone-300 text-xs font-semibold">
                  4 Scheduled Sights
                </span>
                <span className="px-3 py-1 rounded-xl bg-[#c99a6b]/15 text-[#e4c29e] text-xs font-bold border border-[#c99a6b]/30">
                  Stay: $980
                </span>
              </div>
            </div>

            {/* Stop 2 Card Mockup */}
            <div className="p-5 rounded-2xl bg-[#14151a]/90 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#c99a6b]/20 text-[#e4c29e] font-serif font-bold flex items-center justify-center border border-[#c99a6b]/30 text-sm">
                  2
                </div>
                <img
                  src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=200&q=80"
                  alt="Kyoto"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-serif text-base font-bold text-white">Kyoto, Japan</h4>
                  <p className="font-sans text-xs text-stone-400">Oct 17 - Oct 24 &bull; Gion &amp; Arashiyama</p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-sans">
                <span className="px-3 py-1 rounded-xl bg-white/5 text-stone-300 text-xs font-semibold">
                  3 Scheduled Sights
                </span>
                <span className="px-3 py-1 rounded-xl bg-[#c99a6b]/15 text-[#e4c29e] text-xs font-bold border border-[#c99a6b]/30">
                  Stay: $850
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section id="features" className="w-full max-w-6xl px-4 sm:px-6 py-16 border-t border-white/10 relative z-20">
        <div className="w-full rounded-[32px] bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 p-8 sm:p-12 text-left shadow-2xl space-y-8">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b] bg-[#c99a6b]/15 px-3 py-1 rounded-full border border-[#c99a6b]/30">
              Core Architecture
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-medium text-white tracking-tight mt-3">
              The Three Pillars of <span className="font-bold italic text-[#e4c29e]">Boutique Travel Orchestration</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm text-stone-400 mt-1">
              Everything needed to compose complex, unforgettable journeys without spreadsheets or guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-6 rounded-2xl bg-[#0c0d10]/90 border border-white/10">
              <span className="font-serif text-3xl font-bold text-[#c99a6b]">01</span>
              <h3 className="font-serif text-lg font-bold text-white">Smart Timeline Stop Builder</h3>
              <p className="font-sans text-xs text-stone-400 leading-relaxed">
                Seamlessly model multi-city sequences, arrival dates, and transport links with interactive route mapping.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-[#0c0d10]/90 border border-white/10">
              <span className="font-serif text-3xl font-bold text-[#c99a6b]">02</span>
              <h3 className="font-serif text-lg font-bold text-white">Intelligent Daily Spend Balancing</h3>
              <p className="font-sans text-xs text-stone-400 leading-relaxed">
                Auto-calculate daily allowances, categorize lodging &amp; activity expenses, and monitor budget health live.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-[#0c0d10]/90 border border-white/10">
              <span className="font-serif text-3xl font-bold text-[#c99a6b]">03</span>
              <h3 className="font-serif text-lg font-bold text-white">Public Sharable Expeditions</h3>
              <p className="font-sans text-xs text-stone-400 leading-relaxed">
                Distribute elegant read-only itinerary codes that fellow travelers can clone into their own atelier in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Workflows Feature Grid */}
      <section id="roles" className="w-full max-w-6xl px-4 sm:px-6 py-16 border-t border-white/10 relative z-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#e4c29e] text-xs font-sans font-medium mb-3">
            <Users className="w-3.5 h-3.5 text-[#c99a6b]" />
            <span>Dedicated User Roles</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-white tracking-tight">
            Engineered for Every <span className="font-bold italic text-[#e4c29e]">Travel Persona</span>
          </h2>
          <p className="text-stone-400 text-sm mt-2 font-sans">
            Tailored capabilities for personal explorers, group tour organizers, and platform administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Traveler */}
          <div className="p-8 rounded-3xl bg-[#14151a]/90 border border-white/10 hover:border-[#c99a6b]/50 shadow-xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 text-[#e4c29e] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#c99a6b] bg-[#c99a6b]/15 px-2 py-0.5 rounded-md">
              For Solo &amp; Family
            </span>
            <h3 className="font-serif text-xl font-bold text-white mt-2 mb-2">Smart Itinerary Builder</h3>
            <p className="text-xs font-sans text-stone-400 leading-relaxed">
              Construct multi-city timelines, assign activities into time blocks, and calculate daily budget forecasts with automatic currency conversions.
            </p>
          </div>

          {/* Card 2: Organizer */}
          <div className="p-8 rounded-3xl bg-[#14151a]/90 border border-white/10 hover:border-[#c99a6b]/50 shadow-xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 text-[#e4c29e] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-300 bg-white/10 px-2 py-0.5 rounded-md">
              For Tour Guides
            </span>
            <h3 className="font-serif text-xl font-bold text-white mt-2 mb-2">Group Expeditions &amp; Rosters</h3>
            <p className="text-xs font-sans text-stone-400 leading-relaxed">
              Manage participant rosters, publish broadcast advisories, and track public clone metrics for curated group expeditions.
            </p>
          </div>

          {/* Card 3: Admin */}
          <div className="p-8 rounded-3xl bg-[#14151a]/90 border border-white/10 hover:border-[#c99a6b]/50 shadow-xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-md">
              For Administrators
            </span>
            <h3 className="font-serif text-xl font-bold text-white mt-2 mb-2">Platform Telemetry &amp; Access</h3>
            <p className="text-xs font-sans text-stone-400 leading-relaxed">
              Monitor global adoption trends, top visited destinations, and activity distributions with real-time Recharts analytics and catalog tools.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}