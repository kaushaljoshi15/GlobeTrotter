'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Wallet,
  Calculator,
  Hotel,
  Utensils,
  Ticket
} from 'lucide-react';
import BackgroundCarousel, { SCENIC_SLIDES } from '@/components/BackgroundCarousel';
import Footer from '@/components/Footer';

export default function Home() {
  const router = useRouter();
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const currentSlide = SCENIC_SLIDES[activeSlideIdx];

  // Quick Home AI Prompt State
  const [homePrompt, setHomePrompt] = useState('I have ₹30,000 and 5 days. Suggest mountains.');

  const handleSelectDestination = (index: number) => {
    setActiveSlideIdx(index);
  };

  const handleAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homePrompt.trim()) return;
    router.push(`/ai-planner?prompt=${encodeURIComponent(homePrompt.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] selection:bg-[#c99a6b] selection:text-white font-sans relative overflow-x-hidden">
      
      {/* Full-Bleed Cinematic Background Carousel */}
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
              href="/ai-planner" 
              className="text-xs tracking-wider uppercase text-[#e4c29e] hover:text-white font-bold transition-colors hidden md:flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
              <span>AI Planner</span>
            </Link>
            <Link 
              href="/budget" 
              className="text-xs tracking-wider uppercase text-stone-300 hover:text-white font-medium transition-colors hidden md:block"
            >
              Smart Budget
            </Link>
            <Link 
              href="/explore" 
              className="text-xs tracking-wider uppercase text-stone-300 hover:text-white font-medium transition-colors hidden md:block"
            >
              Destinations
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

      {/* Main Hero Section */}
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

        <p className="font-serif text-lg sm:text-2xl text-stone-200 leading-relaxed max-w-2xl font-normal drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] mb-8">
          We curate intelligent <span className="font-semibold italic text-white">multi-city journeys</span> across evocative mountain hills, serene archipelagos &amp; timeless cultural capitals.
        </p>

        {/* AI Itinerary Prompt Bar in Hero */}
        <div className="w-full max-w-2xl mb-8">
          <form 
            onSubmit={handleAISubmit}
            className="relative bg-[#14151a]/90 backdrop-blur-2xl border border-white/20 p-1.5 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-[#c99a6b] ml-4 shrink-0" />
            <input
              type="text"
              value={homePrompt}
              onChange={(e) => setHomePrompt(e.target.value)}
              placeholder='e.g. "I have ₹30,000 and 5 days. Suggest mountains."'
              className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none px-2 font-sans"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] font-sans font-bold text-xs uppercase tracking-wider shadow-lg shrink-0 cursor-pointer"
            >
              Ask AI &rarr;
            </button>
          </form>

          {/* Quick Preset Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            {[
              '⛰️ ₹30k / 5 Days Mountains',
              '🏖️ $1,400 / 6 Days Bali & Coves',
              '⛩️ $1,800 / 7 Days Kyoto & Tokyo',
              '🏔️ €1,800 / 5 Days Swiss Alps'
            ].map((tag, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const promptMap: { [key: number]: string } = {
                    0: 'I have ₹30,000 and 5 days. Suggest mountains.',
                    1: '6 days in Tropical Archipelagos & Beach Coves on $1,400',
                    2: '7 days Zen temples, tea ceremonies & food tour in Kyoto on $1,800',
                    3: '5 days Swiss Alpine Glacier Passes & mountain railways on €1,800'
                  };
                  router.push(`/ai-planner?prompt=${encodeURIComponent(promptMap[idx])}`);
                }}
                className="px-3 py-1 rounded-full bg-[#14151a]/80 hover:bg-white/15 text-[11px] text-stone-300 hover:text-white border border-white/10 backdrop-blur-md transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Translucent Destination Switcher Bar */}
        <div className="w-full max-w-3xl bg-[#14151a]/80 backdrop-blur-2xl border border-white/10 p-3 rounded-full shadow-2xl flex items-center justify-between gap-2 overflow-x-auto mb-16">
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

        {/* 2 Core Feature Highlights: AI Architect + Smart Budget */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-16 font-sans">
          
          {/* Feature 1: AI Itinerary Architect */}
          <div className="p-8 rounded-[32px] bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 hover:border-[#c99a6b]/50 shadow-2xl transition-all flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#e4c29e] text-[10px] font-bold uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
                <span>Flagship WOW Engine</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-2">
                AI Itinerary Architect
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed mb-6 font-serif">
                Simply type: <em>"I have ₹30,000 and 5 days. Suggest mountains."</em> — our AI engine immediately generates a complete, multi-city day-by-day expedition with activity costs and hotel suggestions.
              </p>
            </div>

            <Link
              href="/ai-planner"
              className="inline-flex items-center justify-between p-4 rounded-2xl bg-[#0c0d10] border border-white/10 hover:border-[#c99a6b] text-xs font-bold text-white transition-all group"
            >
              <span>Try AI Planner with Your Budget</span>
              <ArrowRight className="w-4 h-4 text-[#e4c29e] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Feature 2: Smart Budget Atelier */}
          <div className="p-8 rounded-[32px] bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 hover:border-[#c99a6b]/50 shadow-2xl transition-all flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#e4c29e] text-[10px] font-bold uppercase tracking-widest mb-3">
                <Wallet className="w-3.5 h-3.5 text-[#c99a6b]" />
                <span>Zero-Math Finance</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-2">
                Smart Travel Budget Atelier
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed mb-6 font-serif">
                Auto-split your total budget across accommodations (35%), transit (22%), food (23%), and experiences (15%). View safe daily spending caps and split bills with travel companions.
              </p>
            </div>

            <Link
              href="/budget"
              className="inline-flex items-center justify-between p-4 rounded-2xl bg-[#0c0d10] border border-white/10 hover:border-[#c99a6b] text-xs font-bold text-white transition-all group"
            >
              <span>Open Smart Budget Calculator</span>
              <ArrowRight className="w-4 h-4 text-[#e4c29e] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

        {/* Curated Signature Itineraries Grid */}
        <div className="w-full mb-16 text-left">
          
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            
            {/* Expedition 1 */}
            <div className="rounded-[28px] bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 p-6 flex flex-col justify-between hover:border-[#c99a6b]/50 transition-all duration-300 group shadow-2xl">
              <div>
                <div className="h-48 rounded-2xl overflow-hidden mb-4 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" 
                    alt="Swiss Alps"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-white/10">
                    High Alps &bull; 7 Days
                  </div>
                </div>

                <h3 className="font-serif text-xl font-bold text-white mb-2">The Alpine Glacier Odyssey</h3>
                <p className="font-serif text-xs text-stone-400 line-clamp-2 mb-4">
                  Zermatt, Matterhorn Glacier Paradise &amp; panoramic Glacier Express railway stops.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">Budget Target</span>
                  <span className="font-serif font-bold text-white text-sm">$1,850 USD</span>
                </div>
                <Link
                  href="/trips/new"
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-stone-200 hover:text-white text-xs font-semibold transition-all"
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
                    src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80" 
                    alt="Santorini"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-white/10">
                    Aegean &bull; 9 Days
                  </div>
                </div>

                <h3 className="font-serif text-xl font-bold text-white mb-2">The Cycladic Solitude</h3>
                <p className="font-serif text-xs text-stone-400 line-clamp-2 mb-4">
                  Santorini caldera sunsets, Milos moonscape beaches &amp; secluded Aegean coves.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">Budget Target</span>
                  <span className="font-serif font-bold text-white text-sm">$2,200 USD</span>
                </div>
                <Link
                  href="/trips/new"
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-stone-200 hover:text-white text-xs font-semibold transition-all"
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
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-white/10">
                    Japan &bull; 10 Days
                  </div>
                </div>

                <h3 className="font-serif text-xl font-bold text-white mb-2">Kyoto Mist &amp; Tokyo Neon</h3>
                <p className="font-serif text-xs text-stone-400 line-clamp-2 mb-4">
                  Arashiyama bamboo hillside walks, Gion tea ceremonies &amp; Shinjuku nightscapes.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">Budget Target</span>
                  <span className="font-serif font-bold text-white text-sm">$2,450 USD</span>
                </div>
                <Link
                  href="/trips/new"
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-stone-200 hover:text-white text-xs font-semibold transition-all"
                >
                  Plan Route &rarr;
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* Bespoke Architecture Pillars */}
        <div className="w-full rounded-[32px] bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 p-8 sm:p-12 text-left shadow-2xl mb-12 font-sans">
          <div className="max-w-xl mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
              Why Discerning Travelers Choose GlobeTrotter
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-white tracking-tight mt-1">
              Engineered with <span className="font-bold italic text-[#e4c29e]">architectural precision.</span>
            </h2>
            <p className="text-xs text-stone-400 mt-2 font-serif">
              Everything needed to compose complex, unforgettable journeys without spreadsheets or guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="font-serif text-3xl font-bold text-[#c99a6b]">01</span>
              <h4 className="font-bold text-white text-sm">Smart Timeline Stop Builder</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Seamlessly model multi-city sequences, arrival dates, and transport links with interactive route mapping.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-serif text-3xl font-bold text-[#e4c29e]">02</span>
              <h4 className="font-bold text-white text-sm">Intelligent Daily Spend Balancing</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Auto-calculate daily allowances, categorize lodging &amp; activity expenses, and monitor budget health live.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-serif text-3xl font-bold text-stone-200">03</span>
              <h4 className="font-bold text-white text-sm">Public Sharable Expeditions</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Distribute elegant read-only itinerary codes that fellow travelers can clone into their own atelier in seconds.
              </p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}