'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Calendar, 
  DollarSign, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Globe2 
} from 'lucide-react';

const COVER_PRESETS = [
  {
    name: 'Kyoto Mist & Hillside Temples',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Swiss Alpine Passes',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Amalfi Coast Terraces',
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Banff Rockies Glacial Lakes',
    url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Tokyo Shibuya Neon Nightscape',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Santorini Volcanic Caldera',
    url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function CreateTripPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '2026-09-01',
    endDate: '2026-09-14',
    totalBudget: '3000',
    currency: 'USD',
    coverImageUrl: COVER_PRESETS[0].url,
    isPublic: true,
  });

  // Calculate duration
  const start = new Date(formData.startDate);
  const end = new Date(formData.endDate);
  const durationDays = isNaN(start.getTime()) || isNaN(end.getTime()) 
    ? 0 
    : Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  const handleNext = () => {
    if (step === 1 && !formData.title.trim()) {
      setError('Please provide a name for your trip.');
      return;
    }
    if (step === 2 && (!formData.startDate || !formData.endDate || start > end)) {
      setError('Please provide valid start and end dates.');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to create trip');

      // Trigger Confetti Celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Redirect to newly created trip's itinerary builder
      setTimeout(() => {
        router.push(`/trips/${data.data.id}`);
      }, 1000);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#e4c29e] text-[11px] font-sans font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
            <span>Itinerary Creator Atelier</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-white">
            Compose Your Grand <span className="font-bold italic text-[#e4c29e]">Odyssey.</span>
          </h1>
          <p className="font-serif text-stone-300 text-sm mt-1">Set up your voyage essentials and begin scheduling your multi-city timeline</p>
        </div>

        {/* Wizard Progress Stepper */}
        <div className="flex items-center justify-between max-w-xl mb-10 font-sans">
          {[
            { num: 1, title: 'Concept' },
            { num: 2, title: 'Schedule' },
            { num: 3, title: 'Budget & Theme' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] shadow-lg shadow-[#c99a6b]/30'
                    : step > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#14151a] text-stone-500 border border-white/10'
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-xs font-semibold hidden sm:inline ${step === s.num ? 'text-white' : 'text-stone-500'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium max-w-2xl font-sans">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
          
          {/* Left Form Column */}
          <div className="lg:col-span-7 bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl">
            
            {/* Step 1: Concept */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Journey Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Grand Tour of Kyoto &amp; Swiss Alps"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-5 py-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#c99a6b] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Description &amp; Highlights
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe what you want to experience, must-see sights, or travel vibes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-2xl p-4 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#c99a6b] transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Dates & Duration */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                      Departure Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-5 py-3 text-xs text-white focus:outline-none focus:border-[#c99a6b] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                      Return Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-5 py-3 text-xs text-white focus:outline-none focus:border-[#c99a6b] transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#c99a6b]" />
                    <div>
                      <p className="text-xs font-bold text-white">Calculated Duration</p>
                      <p className="text-[11px] text-stone-400">Total days for multi-city scheduling</p>
                    </div>
                  </div>
                  <span className="font-serif text-xl font-bold text-[#e4c29e]">{durationDays} Days</span>
                </div>
              </div>
            )}

            {/* Step 3: Budget & Cover Image */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                      Total Target Budget ($)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.totalBudget}
                      onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-5 py-3 text-xs text-white focus:outline-none focus:border-[#c99a6b] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-5 py-3 text-xs text-white focus:outline-none focus:border-[#c99a6b] transition-all"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-3">
                    Select Cover Photo Preset
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {COVER_PRESETS.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => setFormData({ ...formData, coverImageUrl: preset.url })}
                        className={`group relative h-20 rounded-2xl overflow-hidden cursor-pointer border transition-all ${
                          formData.coverImageUrl === preset.url
                            ? 'border-[#c99a6b] ring-2 ring-[#c99a6b]/40 scale-105'
                            : 'border-white/10 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-[#0c0d10]/40" />
                        {formData.coverImageUrl === preset.url && (
                          <div className="absolute top-1 right-1 bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] rounded-full p-0.5">
                            <Check className="w-3 h-3 font-bold" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/10 font-sans">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0c0d10] hover:bg-white/10 text-stone-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : <div />}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#c99a6b]/20 transition-all cursor-pointer"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#c99a6b]/30 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Creating...' : 'Create Itinerary & Add Stops →'}
                </button>
              )}
            </div>
          </div>

          {/* Right Live Preview Card */}
          <div className="lg:col-span-5 bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl sticky top-28 font-sans">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#c99a6b] mb-4 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#c99a6b]" />
              Live Itinerary Card Preview
            </h3>

            <div className="bg-[#0c0d10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="h-44 relative">
                <img
                  src={formData.coverImageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-[#0c0d10]/30 to-transparent" />
                <div className="absolute bottom-3.5 left-4 right-4">
                  <h4 className="font-serif text-lg font-bold text-white truncate">
                    {formData.title || 'Untitled Itinerary'}
                  </h4>
                  <p className="text-xs text-stone-300 line-clamp-1 mt-0.5">
                    {formData.description || 'No description added yet.'}
                  </p>
                </div>
              </div>

              <div className="p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between text-stone-300">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#c99a6b]" />
                    {formData.startDate} - {formData.endDate}
                  </span>
                  <span className="font-bold text-[#e4c29e] bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                    {durationDays} Days
                  </span>
                </div>

                <div className="flex items-center justify-between text-stone-300 pt-2 border-t border-white/10">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    Target Budget
                  </span>
                  <span className="font-bold text-emerald-400">
                    ${parseFloat(formData.totalBudget || '0').toLocaleString()} {formData.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
