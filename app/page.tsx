'use client';

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
  Receipt
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white overflow-hidden relative font-sans flex flex-col items-center">
      
      {/* Background Ambient Glow Lights */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-purple-600/10 rounded-full blur-[140px] -z-10 pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[130px] -z-10 pointer-events-none" />
      
      {/* Subtle Geometric Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10 pointer-events-none" />

      {/* Floating Glassmorphic Navbar */}
      <nav className="fixed top-5 z-50 w-full max-w-5xl px-4 sm:px-6">
        <div className="mx-auto flex h-14 items-center justify-between rounded-full border border-slate-800/80 bg-slate-950/70 px-6 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center font-black text-xs text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
              GT
            </div>
            <span className="font-extrabold tracking-tight text-white flex items-center gap-1.5">
              GlobeTrotter
              <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                PRO
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-5">
            <Link 
              href="/explore" 
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors hidden sm:block"
            >
              Destinations
            </Link>
            <Link 
              href="/admin" 
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors hidden sm:block"
            >
              Analytics
            </Link>
            <Link 
              href="/login" 
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="text-xs font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all active:scale-95 duration-200"
            >
              Start Planning
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="w-full max-w-6xl px-4 sm:px-6 pt-36 pb-20 flex flex-col items-center text-center z-10">
        
        {/* Status Badge */}
        <div className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wide mb-8 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          GlobeTrotter v2.0 Live &bull; Powered by PostgreSQL &amp; Prisma ORM
        </div>
        
        {/* Hero Title with High-Impact Gradient */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.08] max-w-4xl text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400">
          Discover the world. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
            Design seamless journeys.
          </span>
        </h1>
        
        <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed font-medium">
          The ultimate intelligent operating system for multi-city travel planning. Model complex stops, auto-calculate daily budgets, track expenses, and clone public itineraries with one click.
        </p>
        
        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            href="/register" 
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            Create Your Itinerary Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/explore" 
            className="w-full sm:w-auto px-7 py-3.5 bg-slate-900/90 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-blue-400" />
            Explore Destinations Catalog
          </Link>
        </div>
      </main>

      {/* High-Fidelity App UI Mockup Preview */}
      <section className="w-full max-w-5xl px-4 sm:px-6 relative z-20 pb-28">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col">
          
          {/* OS Window Header Bar */}
          <div className="h-11 border-b border-slate-800 bg-slate-950 px-4 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>
            <div className="h-6 px-4 bg-slate-900 rounded-md text-[11px] text-slate-400 font-mono flex items-center justify-center border border-slate-800">
              globetrotter.io/trips/japan-autumn-escape-2026
            </div>
            <div className="w-12"></div>
          </div>

          {/* Interactive Mockup Body */}
          <div className="p-6 sm:p-8 bg-slate-950/60 space-y-6">
            
            {/* Top Itinerary Hero Strip */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-indigo-950/40 border border-blue-500/20">
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

      {/* Role-Based Workflows Feature Grid */}
      <section className="w-full max-w-6xl px-4 sm:px-6 py-16 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-14">
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
              For Travelers
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
              For Organizers
            </span>
            <h3 className="text-lg font-bold text-white mt-2 mb-2">Public Sharable Plans</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate public links with unique share codes. Anyone can view your complete day-by-day plan and clone it directly into their account with one click.
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
            <h3 className="text-lg font-bold text-white mt-2 mb-2">Platform Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitor global adoption trends, top visited destinations, and activity distributions with real-time Recharts analytics and catalog tools.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 bg-slate-950 py-10 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center font-black text-[10px] text-white">
              GT
            </div>
            <span className="font-bold text-white">GlobeTrotter</span>
          </div>
          <p>&copy; {new Date().getFullYear()} GlobeTrotter &bull; Built for the Odoo Hackathon</p>
        </div>
      </footer>
    </div>
  );
}