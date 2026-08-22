'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CityAdaptiveBackground from '@/components/CityAdaptiveBackground';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Check,
  Luggage,
  Lightbulb,
  Hotel,
  Plane,
  Utensils,
  Ticket,
  ChevronRight,
  Bookmark,
  Share2,
  Layers,
  Send
} from 'lucide-react';
import { GeneratedItinerary } from '@/lib/services/ai-generator.service';

const PRESET_PROMPTS = [
  {
    icon: '⛰️',
    title: 'Himalayas & Manali (₹30k / 5 Days)',
    text: 'I have ₹30,000 and 5 days. Suggest mountains in Himalayas.',
  },
  {
    icon: '🗽',
    title: 'New York City (4 Days)',
    text: 'I want to travel New York City for 4 days exploring Manhattan skyline and Central park on $1,500',
  },
  {
    icon: '⛩️',
    title: 'Kyoto & Tokyo (7 Days)',
    text: '7 days Zen temples, tea ceremonies & food tour in Kyoto on $1,800',
  },
  {
    icon: '🏔️',
    title: 'Swiss Alps (5 Days)',
    text: '5 days Swiss Alpine Glacier Passes & mountain railways on €1,800',
  },
  {
    icon: '🏖️',
    title: 'Bali Archipelagos (6 Days)',
    text: '6 days in Bali Tropical Archipelagos & Beach Coves on $1,400',
  },
  {
    icon: '🗼',
    title: 'Paris Romance (4 Days)',
    text: '4 days romantic cafes, Eiffel tower and museums in Paris on €1,200',
  },
];

function AIPlannerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || 'I have ₹30,000 and 5 days. Suggest mountains in Himalayas.';

  const [prompt, setPrompt] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [reasoningStep, setReasoningStep] = useState(0);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [detectedPlace, setDetectedPlace] = useState({ city: 'Himalayas', country: 'India', location: 'Rohtang Pass & Solang Ridge' });

  const REASONING_STEPS = [
    '🔍 Analyzing prompt: extracting destination, budget, duration & currency...',
    '🏔️ Synthesizing geographic panorama & matching live photo scenario...',
    '💰 Running intelligent spend balancer across stays, transit, dining & experiences...',
    '✨ Assembling day-by-day expedition timeline with insider tips & packing essentials...',
  ];

  const handleGenerate = async (queryText?: string) => {
    const q = queryText || prompt;
    if (!q.trim()) return;

    setLoading(true);
    setItinerary(null);
    setReasoningStep(0);

    const stepInterval = setInterval(() => {
      setReasoningStep((prev) => {
        if (prev < REASONING_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 450);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q }),
      });

      const data = await res.json();
      clearInterval(stepInterval);

      if (data.success) {
        setItinerary(data.data);
      }
    } catch (err) {
      console.error('Error generating AI itinerary:', err);
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialPrompt) {
      handleGenerate(initialPrompt);
    }
  }, []);

  const handleSaveItinerary = async () => {
    if (!itinerary) return;
    setSaving(true);

    try {
      const storedUser = localStorage.getItem('user');
      let userId = 1;
      if (storedUser) {
        try {
          userId = JSON.parse(storedUser).id || 1;
        } catch (e) {}
      }

      const res = await fetch('/api/ai/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary, userId }),
      });

      const data = await res.json();
      if (data.success) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });

        setSavedSuccess(true);
        setTimeout(() => {
          router.push(`/trips/${data.data.tripId}`);
        }, 1200);
      }
    } catch (e) {
      console.error('Error saving trip:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative z-10 space-y-12">
      
      {/* City-Adaptive Dynamic Background tied to user prompt */}
      <CityAdaptiveBackground 
        query={prompt}
        onPlaceDetected={(place) => setDetectedPlace(place)}
        showLiveTag={true}
      />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#14151a]/80 backdrop-blur-xl border border-white/15 text-[#e4c29e] text-[11px] font-sans font-medium mb-3 shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
          <span>Live Dynamic Scenarios &bull; {detectedPlace.city}, {detectedPlace.country}</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-medium text-white tracking-tight mb-3 drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
          AI Itinerary <span className="font-bold italic text-[#e4c29e]">Architect.</span>
        </h1>
        <p className="font-serif text-stone-200 text-sm sm:text-base leading-relaxed drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
          Type any place (e.g. <em>"Himalayas"</em>, <em>"New York"</em>, <em>"Paris"</em>). The background transforms live into that destination's scenery while AI creates your complete itinerary.
        </p>
      </div>

      {/* Prompt Search Command Box */}
      <div className="max-w-4xl mx-auto bg-[#14151a]/95 backdrop-blur-2xl border border-white/15 rounded-[32px] p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-4 font-sans">
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="relative flex items-center"
        >
          <Sparkles className="w-5 h-5 text-[#c99a6b] absolute left-5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='Type place: "Himalayas", "New York", "Paris", "Kyoto", "Bali"...'
            className="w-full bg-[#0c0d10] border border-white/15 rounded-full pl-14 pr-36 py-4 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b] focus:ring-1 focus:ring-[#c99a6b] transition-all font-sans"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#c99a6b]/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Synthesizing...' : 'Generate →'}
          </button>
        </form>

        {/* Quick Inspiration Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mr-1">
            Explore Scenarios:
          </span>
          {PRESET_PROMPTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(preset.text);
                handleGenerate(preset.text);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c0d10] hover:bg-white/15 text-stone-300 hover:text-white border border-white/10 text-[11px] font-medium transition-all cursor-pointer"
            >
              <span>{preset.icon}</span>
              <span>{preset.title}</span>
            </button>
          ))}
        </div>

      </div>

      {/* Real-time Multi-Stage AI Reasoning Stream */}
      {loading && (
        <div className="max-w-3xl mx-auto p-8 rounded-[32px] bg-[#14151a]/90 backdrop-blur-2xl border border-white/15 text-center space-y-4 font-sans shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] flex items-center justify-center text-[#0c0d10] mx-auto shadow-xl">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="font-serif text-2xl font-medium text-white">Composing Your {detectedPlace.city} Expedition</h3>
          <p className="text-xs text-[#e4c29e] font-mono tracking-wide">
            {REASONING_STEPS[reasoningStep]}
          </p>
        </div>
      )}

      {/* Generated Itinerary Display */}
      {itinerary && !loading && (
        <div className="space-y-10 font-sans">
          
          {/* Header Banner */}
          <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
            <div className="h-80 sm:h-96 relative">
              <img
                src={itinerary.coverImageUrl}
                alt={itinerary.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-[#0c0d10]/60 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#e4c29e] text-[10px] font-bold uppercase tracking-widest border border-white/20">
                      {itinerary.theme}
                    </span>
                    <span className="px-3.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30">
                      ✓ 100% Within Budget ({itinerary.budget.formatted})
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-5xl font-medium text-white tracking-tight leading-tight">
                    {itinerary.title}
                  </h2>
                  <p className="font-serif text-stone-300 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
                    {itinerary.tagline}
                  </p>
                </div>

                {/* Save CTA Button */}
                <div className="flex items-center gap-3 self-start md:self-auto">
                  <button
                    onClick={handleSaveItinerary}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-xl shadow-[#c99a6b]/30 hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>{savedSuccess ? 'Saved to Atelier!' : saving ? 'Saving Itinerary...' : 'Save Itinerary & Start Planning →'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 5 Financial Budget Allocation Pills */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <span className="text-[10px] font-bold uppercase text-stone-400 flex items-center gap-1.5">
                <Hotel className="w-3.5 h-3.5 text-[#c99a6b]" /> Stays
              </span>
              <p className="font-serif text-xl font-bold text-white mt-1">
                {itinerary.budget.currency === 'INR' ? '₹' : '$'}{itinerary.budget.stays.toLocaleString()}
              </p>
              <span className="text-[10px] text-stone-400">Accommodations</span>
            </div>

            <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <span className="text-[10px] font-bold uppercase text-stone-400 flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-[#e4c29e]" /> Transit
              </span>
              <p className="font-serif text-xl font-bold text-white mt-1">
                {itinerary.budget.currency === 'INR' ? '₹' : '$'}{itinerary.budget.transport.toLocaleString()}
              </p>
              <span className="text-[10px] text-stone-400">Road / Rail / Flights</span>
            </div>

            <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <span className="text-[10px] font-bold uppercase text-stone-400 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-amber-400" /> Food
              </span>
              <p className="font-serif text-xl font-bold text-white mt-1">
                {itinerary.budget.currency === 'INR' ? '₹' : '$'}{itinerary.budget.food.toLocaleString()}
              </p>
              <span className="text-[10px] text-stone-400">Dining &amp; Cafes</span>
            </div>

            <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <span className="text-[10px] font-bold uppercase text-stone-400 flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-emerald-400" /> Sights
              </span>
              <p className="font-serif text-xl font-bold text-white mt-1">
                {itinerary.budget.currency === 'INR' ? '₹' : '$'}{itinerary.budget.activities.toLocaleString()}
              </p>
              <span className="text-[10px] text-stone-400">Passes &amp; Treks</span>
            </div>

            <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <span className="text-[10px] font-bold uppercase text-stone-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Buffer
              </span>
              <p className="font-serif text-xl font-bold text-white mt-1">
                {itinerary.budget.currency === 'INR' ? '₹' : '$'}{itinerary.budget.buffer.toLocaleString()}
              </p>
              <span className="text-[10px] text-stone-400">Contingency</span>
            </div>
          </div>

          {/* Stops & Day-by-Day Experience Flow */}
          <div className="space-y-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
                Detailed Itinerary Flow
              </span>
              <h3 className="font-serif text-3xl font-medium text-white tracking-tight mt-0.5">
                Day-by-Day Expedition Timeline
              </h3>
            </div>

            {itinerary.stops.map((stop, sIdx) => (
              <div
                key={sIdx}
                className="bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
              >
                {/* Stop Header */}
                <div className="p-6 bg-[#14151a] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] flex items-center justify-center font-serif font-bold text-sm">
                      {sIdx + 1}
                    </div>
                    <div>
                      <h4 className="font-serif text-2xl font-bold text-white">{stop.cityName}</h4>
                      <p className="text-xs text-stone-400 mt-0.5">{stop.country} &bull; {stop.daysCount} Days &bull; Recommended Stay: <strong className="text-stone-200">{stop.recommendedHotel}</strong></p>
                    </div>
                  </div>
                </div>

                {/* Days Schedule */}
                <div className="p-6 sm:p-8 space-y-6">
                  {stop.days.map((day) => (
                    <div
                      key={day.dayNumber}
                      className="bg-[#0c0d10] border border-white/10 rounded-2xl p-5 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#e4c29e]">
                            Day {day.dayNumber}
                          </span>
                          <h5 className="font-serif text-base font-bold text-white">{day.dayTitle}</h5>
                        </div>
                        <span className="text-[11px] text-stone-400 font-mono">
                          Est. Daily Spend: {itinerary.budget.currency === 'INR' ? '₹' : '$'}{day.dayEstimatedCost.toLocaleString()}
                        </span>
                      </div>

                      {/* Activities */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {day.activities.map((act, aIdx) => (
                          <div
                            key={aIdx}
                            className="bg-[#14151a] border border-white/10 rounded-xl p-3.5 flex items-start justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-[#e4c29e] uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-full">
                                {act.startTime} - {act.endTime} &bull; {act.category}
                              </span>
                              <p className="font-serif text-sm font-bold text-white mt-1">{act.title}</p>
                              <p className="text-xs text-stone-400 leading-relaxed">{act.description}</p>
                            </div>
                            <span className="font-serif text-xs font-bold text-emerald-400 shrink-0">
                              {act.cost > 0 ? `${itinerary.budget.currency === 'INR' ? '₹' : '$'}${act.cost.toLocaleString()}` : 'Free'}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Day Tip */}
                      {day.insiderTip && (
                        <p className="text-xs text-[#e4c29e] bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-[#c99a6b] shrink-0" />
                          <span><strong>Atelier Tip:</strong> {day.insiderTip}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pro Travel Tips & Packing Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Pro Tips */}
            <div className="bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-4">
              <h4 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#c99a6b]" />
                Atelier Insider Recommendations
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-300">
                {itinerary.proTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#0c0d10] border border-white/10">
                    <Check className="w-4 h-4 text-[#e4c29e] shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Packing Checklist */}
            <div className="bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-4">
              <h4 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Luggage className="w-5 h-5 text-[#c99a6b]" />
                Pre-Departure Packing Essentials
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-300">
                {itinerary.packingChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0c0d10] border border-white/10">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Bottom Save Action CTA */}
          <div className="p-10 rounded-[32px] bg-[#14151a]/95 border border-white/15 text-center shadow-2xl flex flex-col items-center">
            <Sparkles className="w-8 h-8 text-[#c99a6b] mb-3" />
            <h3 className="font-serif text-3xl font-medium text-white mb-2">Ready to embark on this journey?</h3>
            <p className="font-serif text-xs sm:text-sm text-stone-300 max-w-md mb-6 leading-relaxed">
              Save this entire day-by-day plan directly into your GlobeTrotter account to track expenses, customize stops, and share with travel companions.
            </p>
            <button
              onClick={handleSaveItinerary}
              disabled={saving}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-xl shadow-[#c99a6b]/30 transition-all cursor-pointer active:scale-95"
            >
              {savedSuccess ? 'Saved to Your Atelier!' : saving ? 'Saving Itinerary...' : 'Save Itinerary & Open Planner →'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

export default function AIPlannerPage() {
  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-white relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <Suspense fallback={<div className="text-center text-xs text-stone-400 py-20">Loading AI Atelier...</div>}>
          <AIPlannerContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
