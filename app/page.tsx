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
import CityAdaptiveBackground from '@/components/CityAdaptiveBackground';
import Footer from '@/components/Footer';

const PROMPT_PRESETS = [
  { label: '⛰️ Himalayas & Manali', query: 'I want to travel Himalayas and Manali mountains for 5 days with ₹30,000' },
  { label: '🗽 New York Skyline', query: 'I want to travel New York City for 4 days exploring Manhattan' },
  { label: '⛩️ Kyoto & Tokyo', query: '7 days Zen temples and ramen tours in Kyoto and Tokyo Japan' },
  { label: '🏔️ Swiss Alps', query: '5 days Swiss Alps glacier express in Zermatt Switzerland' },
  { label: '🏖️ Bali & Tropical Coast', query: '6 days tropical beach paradise in Bali Indonesia' },
  { label: '🗼 Paris Romance', query: '4 days romantic cafes and museums in Paris France' },
];

export default function Home() {
  const router = useRouter();
  const [homePrompt, setHomePrompt] = useState('I want to travel Himalayas and Manali mountains for 5 days with ₹30,000');
  const [detectedPlace, setDetectedPlace] = useState({ city: 'Himalayas', country: 'India', location: 'Rohtang Pass & Solang Ridge' });

  const handleAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homePrompt.trim()) return;
    router.push(`/ai-planner?prompt=${encodeURIComponent(homePrompt.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] selection:bg-[#c99a6b] selection:text-white font-sans relative overflow-x-hidden">
      
      {/* City-Adaptive Dynamic Background (Switches scenarios as user types city) */}
      <CityAdaptiveBackground 
        query={homePrompt}
        onPlaceDetected={(place) => setDetectedPlace(place)}
        showLiveTag={true}
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
        
        {/* Live Dynamic City Scenario Tag */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#14151a]/80 backdrop-blur-xl border border-white/15 text-stone-200 text-xs font-sans font-medium mb-8 shadow-2xl transition-all">
          <span className="w-2 h-2 rounded-full bg-[#e4c29e] animate-ping" />
          <span className="text-stone-400 uppercase tracking-widest text-[10px] font-bold">Dynamic Background Scenario:</span>
          <span className="text-white font-serif italic font-semibold">{detectedPlace.city} ({detectedPlace.country})</span>
        </div>

        {/* Playfair Display Statement Headline */}
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tight leading-[1.06] max-w-4xl text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] mb-6">
          Travel, <span className="font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-[#e4c29e] via-[#f7e3ce] to-[#c99a6b]">composed.</span>
        </h1>

        <p className="font-serif text-lg sm:text-2xl text-stone-200 leading-relaxed max-w-2xl font-normal drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] mb-8">
          Type any destination below — watch the background transform into that city's live panoramic scenery with auto-rotating views.
        </p>

        {/* Dynamic City-Aware AI Search Command Bar */}
        <div className="w-full max-w-2xl mb-8">
          <form 
            onSubmit={handleAISubmit}
            className="relative bg-[#14151a]/95 backdrop-blur-2xl border border-white/20 p-1.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-[#c99a6b] ml-4 shrink-0" />
            <input
              type="text"
              value={homePrompt}
              onChange={(e) => setHomePrompt(e.target.value)}
              placeholder='Type any place: "Himalayas", "New York", "Paris", "Kyoto", "Bali"...'
              className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none px-2 font-sans"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] font-sans font-bold text-xs uppercase tracking-wider shadow-lg shrink-0 cursor-pointer transition-transform active:scale-95"
            >
              Compose Itinerary &rarr;
            </button>
          </form>

          {/* Quick Destination Pill Switchers (Instant Scenario Switching) */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">
            {PROMPT_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setHomePrompt(preset.query)}
                className="px-3.5 py-1.5 rounded-full bg-[#14151a]/80 hover:bg-white/15 text-xs text-stone-300 hover:text-white border border-white/10 backdrop-blur-md transition-all cursor-pointer font-sans"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2 Core Feature Highlights: AI Architect + Smart Budget */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-16 font-sans">
          
          {/* Feature 1: AI Itinerary Architect */}
          <div className="p-8 rounded-[32px] bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 hover:border-[#c99a6b]/50 shadow-2xl transition-all flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#e4c29e] text-[10px] font-bold uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
                <span>Dynamic Scenarios &bull; Flagship Engine</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-2">
                AI Itinerary Architect
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed mb-6 font-serif">
                Enter any destination — from Himalayas to New York, Kyoto to Swiss Alps — and receive a day-by-day expedition with itemized activity costs and hotel suggestions.
              </p>
            </div>

            <Link
              href={`/ai-planner?prompt=${encodeURIComponent(homePrompt)}`}
              className="inline-flex items-center justify-between p-4 rounded-2xl bg-[#0c0d10] border border-white/10 hover:border-[#c99a6b] text-xs font-bold text-white transition-all group"
            >
              <span>Generate Itinerary for {detectedPlace.city}</span>
              <ArrowRight className="w-4 h-4 text-[#e4c29e] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Feature 2: Smart Budget Atelier */}
          <div className="p-8 rounded-[32px] bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 hover:border-[#c99a6b]/50 shadow-2xl transition-all flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#e4c29e] text-[10px] font-bold uppercase tracking-widest mb-3">
                <Wallet className="w-3.5 h-3.5 text-[#c99a6b]" />
                <span>Zero-Math Spend Balancing</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-2">
                Smart Travel Budget Atelier
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed mb-6 font-serif">
                Auto-split your total budget across accommodations (35%), transit (22%), food (23%), and experiences (15%). View safe daily spending caps and split bills with companions.
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
              Everything needed to compose complex, unforgettable journeys with dynamic background atmosphere.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="font-serif text-3xl font-bold text-[#c99a6b]">01</span>
              <h4 className="font-bold text-white text-sm">Dynamic City Scenarios</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Background transforms live to match whatever destination you type, rotating through panoramic high-res photos every few seconds.
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