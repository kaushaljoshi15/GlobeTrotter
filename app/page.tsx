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
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white overflow-x-hidden relative font-sans flex flex-col items-center">
      
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
        <div className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-400/40 bg-blue-950/60 backdrop-blur-xl text-blue-300 text-xs font-bold tracking-wide mb-6 shadow-lg shadow-blue-950/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-white font-extrabold">GlobeTrotter v2.0</span> &bull; Scenic World Expeditions &amp; Smart Planning
        </div>
        
        {/* High-Impact Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.08] max-w-4xl text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
          Discover the world. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-200 to-indigo-300">
            Design seamless journeys.
          </span>
        </h1>
        
        <p className="text-sm sm:text-lg text-slate-200 max-w-2xl mb-8 leading-relaxed font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] bg-slate-950/40 backdrop-blur-sm p-3 rounded-2xl border border-slate-800/40">
          The ultimate intelligent operating system for multi-city travel planning. Model complex stops, auto-calculate daily budgets, track expenses, and clone public itineraries with one click.
        </p>
        
        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10">
          <Link 
            href="/register" 
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/40 hover:shadow-blue-600/60 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5"
          >
            Create Your Itinerary Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/explore" 
            className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white rounded-2xl font-bold text-sm shadow-xl backdrop-blur-md transition-all flex items-center justify-center gap-2.5"
          >
            <Compass className="w-4 h-4 text-blue-400" />
            Explore Destinations Catalog
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SCENIC_SLIDES.slice(0, 4).map((slide, idx) => {
              const isSelected = slideIndex === idx;
              return (
                <div
                  key={slide.id}
                  onClick={() => switchToSlide(idx)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border text-left p-3 flex flex-col justify-between h-36 ${
                    isSelected 
                      ? 'border-blue-400 ring-2 ring-blue-500 shadow-xl shadow-blue-500/30 scale-[1.03] bg-slate-900/95' 
                      : 'border-slate-800/80 bg-slate-950/80 hover:border-slate-600 hover:bg-slate-900/90'
                  }`}
                >
                  {/* Card Background Thumbnail */}
                  <img 
                    src={slide.imageUrl} 
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-45 group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

                  {/* Top Promo Tag */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/30 backdrop-blur-md">
                      {slide.category}
                    </span>
                    <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
                      ★ {slide.rating}
                    </span>
                  </div>

                  {/* Bottom Information */}
                  <div className="relative z-10">
                    <p className="text-xs font-black text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                      {slide.title}
                    </p>
                    <p className="text-[10px] text-slate-300 truncate">
                      {slide.country} &bull; <span className="text-emerald-400 font-bold">${slide.pricePerDay}/d</span>
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
        <div className="rounded-3xl border border-slate-800/90 bg-slate-900/95 backdrop-blur-2xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] overflow-hidden relative flex flex-col">
          
          {/* OS Window Header Bar */}
          <div className="h-11 border-b border-slate-800 bg-slate-950/90 px-4 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>
            <div className="h-6 px-4 bg-slate-900/80 rounded-md text-[11px] text-slate-400 font-mono flex items-center justify-center border border-slate-800">
              globetrotter.io/trips/japan-autumn-escape-2026
            </div>
            <div className="w-12"></div>
          </div>

          {/* Interactive Mockup Body */}
          <div className="p-6 sm:p-8 bg-slate-950/80 space-y-6">
            
            {/* Top Itinerary Hero Strip */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 to-indigo-950/50 border border-blue-500/20">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                  Featured Multi-City Route
                </span>
                <h3 className="text-xl font-bold text-white mt-1">Japan Autumn Odyssey: Tokyo &rarr; Kyoto</h3>
                <p className="text-xs text-slate-400 mt-0.5">14 Days &bull; 2 Destinations &bull; 7 Curated Experiences</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Budget Target</span>
                  <p className="text-lg font-black text-emerald-400">$3,500 USD</p>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Stops</span>
                  <p className="text-lg font-black text-blue-400">2 Cities</p>
                </div>
              </div>
            </div>

            {/* Stop 1 Card Mockup */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 font-black flex items-center justify-center border border-blue-500/30 text-sm">
                  1
                </div>
                <img
                  src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=200&q=80"
                  alt="Tokyo"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="text-base font-bold text-white">Tokyo, Japan</h4>
                  <p className="text-xs text-slate-400">Oct 10 - Oct 17 &bull; Shibuya &amp; Shinjuku</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                  4 Scheduled Sights
                </span>
                <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  Stay: $980
                </span>
              </div>
            </div>

            {/* Stop 2 Card Mockup */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 font-black flex items-center justify-center border border-indigo-500/30 text-sm">
                  2
                </div>
                <img
                  src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=200&q=80"
                  alt="Kyoto"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="text-base font-bold text-white">Kyoto, Japan</h4>
                  <p className="text-xs text-slate-400">Oct 17 - Oct 24 &bull; Gion &amp; Arashiyama</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                  3 Scheduled Sights
                </span>
                <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  Stay: $850
                </span>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Traveler */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 shadow-xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
              For Solo &amp; Family
            </span>
            <h3 className="text-lg font-bold text-white mt-2 mb-2">Smart Itinerary Builder</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Construct multi-city timelines, assign activities into time blocks, and calculate daily budget forecasts with automatic currency conversions.
            </p>
          </div>

          {/* Card 2: Organizer */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 shadow-xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
              For Tour Guides
            </span>
            <h3 className="text-lg font-bold text-white mt-2 mb-2">Group Expeditions &amp; Rosters</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manage participant rosters, publish broadcast advisories, and track public clone metrics for curated group expeditions.
            </p>
          </div>

          {/* Card 3: Admin */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 shadow-xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
              For Administrators
            </span>
            <h3 className="text-lg font-bold text-white mt-2 mb-2">Platform Telemetry &amp; Access</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
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