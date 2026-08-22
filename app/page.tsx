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
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const currentSlide = SCENIC_SLIDES[activeSlideIdx];

  const switchToSlide = (idx: number) => {
    setSlideIndex(idx);
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] selection:bg-[#c99a6b] selection:text-white font-sans relative overflow-x-hidden">
      
      {/* Dynamic Background Photo Carousel */}
      <BackgroundCarousel 
        currentIndex={activeSlideIdx} 
        onSlideChange={(newIdx) => setActiveSlideIdx(newIdx)} 
      />

      {/* Global Dynamic Navbar */}
      <Navbar />

      {/* Main Hero Section (Directly on Full-Bleed Background without any white box) */}
      <main className="relative z-20 pt-36 sm:pt-44 pb-20 px-4 sm:px-8 max-w-6xl mx-auto flex flex-col items-center text-center">
        
        {/* Subtle Live Destination Tag */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#14151a]/70 backdrop-blur-xl border border-white/15 text-stone-200 text-xs font-sans font-medium mb-8 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-[#e4c29e] animate-ping" />
          <span className="text-stone-400 uppercase tracking-widest text-[10px] font-bold">Now Exploring:</span>
          <span className="text-white font-serif italic font-semibold">{currentSlide.title} ({currentSlide.country})</span>
        </div>
        
        {/* High-Impact Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.08] max-w-4xl text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
          Discover the world. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-200 to-indigo-300">
            Design seamless journeys.
          </span>
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

        {/* Featured Scenic Destination Cards Strip */}
        <div className="w-full max-w-5xl mt-2 mb-8">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              Featured Expeditions &amp; Scenic Hill Routes
            </span>
            <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
              Click any destination to preview in background
            </span>
          </div>

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

      </main>

      {/* High-Fidelity App UI Mockup Preview */}
      <section id="preview" className="w-full max-w-5xl px-4 sm:px-6 relative z-20 pb-28">
        <div className="rounded-3xl border border-slate-800/90 bg-slate-900/95 backdrop-blur-2xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] overflow-hidden relative flex flex-col">
          
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
      </section>

      {/* Core Features & Highlights Section */}
      <section id="features" className="w-full max-w-6xl px-4 sm:px-6 py-16 border-t border-slate-800/80 relative z-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built for High-Precision Travel</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Everything You Need to Plan and Manage Trips
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Powerful multi-city orchestration backed by PostgreSQL relational modeling and automated budget ledgers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/30 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Multi-City Stop Sequencing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Order your itinerary across multiple destinations with chronological dates, estimated accommodations, and transport expenses.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Live Budget &amp; Daily Burn Rate</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatic category breakdown with Recharts visual charts, receipt logger, and instant overbudget threshold alerts.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/30 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <Repeat className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">1-Click Itinerary Cloner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Share your custom route publicly. Friends or travelers can copy the full multi-day plan directly into their own account.
            </p>
          </div>
        </div>
      </section>

      {/* Role-Based Workflows Feature Grid */}
      <section id="roles" className="w-full max-w-6xl px-4 sm:px-6 py-16 border-t border-slate-800/80 relative z-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Dedicated User Roles</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Engineered for Every Type of Traveler
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Tailored capabilities for personal explorers, group tour organizers, and platform administrators.
          </p>
        </div>

        {/* The Three Pillars of Travel Composition */}
        <div className="w-full mt-4 mb-16 rounded-[32px] bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 p-8 sm:p-12 text-left shadow-2xl">
          
          {/* Card 1: Traveler */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 shadow-xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
              For Solo &amp; Family
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
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
              For Tour Guides
            </span>
            <h3 className="text-lg font-bold text-white mt-2 mb-2">Group Expeditions &amp; Rosters</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manage participant rosters, publish broadcast advisories, and track public clone metrics for curated group expeditions.
            </p>
          </div>

            <div className="space-y-3">
              <span className="font-serif text-3xl font-bold text-[#c99a6b]">02</span>
              <h3 className="font-serif text-lg font-bold text-white">Intelligent Daily Spend Balancing</h3>
              <p className="font-sans text-xs text-stone-400 leading-relaxed">
                Auto-calculate daily allowances, categorize lodging &amp; activity expenses, and monitor budget health live.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
              For Administrators
            </span>
            <h3 className="text-lg font-bold text-white mt-2 mb-2">Platform Telemetry &amp; Access</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitor global adoption trends, top visited destinations, and activity distributions with real-time Recharts analytics and catalog tools.
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

      {/* Footer */}
      <Footer />
    </div>
  );
}