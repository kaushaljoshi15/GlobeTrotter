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
  MapPin, 
  Image as ImageIcon, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Globe2 
} from 'lucide-react';

const COVER_PRESETS = [
  {
    name: 'Kyoto Pagoda & Autumn Leaves',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Paris Eiffel Tower Twilight',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Rome Ancient Colosseum',
    url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Bali Tropical Rice Terraces',
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Tokyo Shibuya Neon Nightscape',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'New York Manhattan Skyline',
    url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
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

      // Trigger Confetti Celebration!
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Itinerary Creator Wizard</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Plan Your Next Grand Odyssey
          </h1>
          <p className="text-slate-400 text-sm mt-1">Set up your trip essentials and start crafting your multi-city timeline</p>
        </div>

        {/* Wizard Progress Stepper */}
        <div className="flex items-center justify-between max-w-2xl mb-10">
          {[
            { num: 1, title: 'Trip Concept' },
            { num: 2, title: 'Dates & Duration' },
            { num: 3, title: 'Budget & Theme' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : step > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-xs font-semibold hidden sm:inline ${step === s.num ? 'text-white' : 'text-slate-500'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium max-w-2xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Column (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            
            {/* Step 1: Concept */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Trip Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Grand Tour of Western Europe"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Description & Highlights
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe what you want to experience, must-see sights, or travel vibes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Dates & Duration */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Departure Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Return Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Calculated Duration</p>
                      <p className="text-[11px] text-slate-400">Total days for multi-city scheduling</p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-blue-400">{durationDays} Days</span>
                </div>
              </div>
            )}

            {/* Step 3: Budget & Cover Image */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Total Target Budget ($)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.totalBudget}
                      onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Select Cover Photo Preset
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {COVER_PRESETS.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => setFormData({ ...formData, coverImageUrl: preset.url })}
                        className={`group relative h-20 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                          formData.coverImageUrl === preset.url
                            ? 'border-blue-500 ring-2 ring-blue-500/30 scale-105'
                            : 'border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-600'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/40" />
                        {formData.coverImageUrl === preset.url && (
                          <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : <div />}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating Itinerary...' : 'Create Itinerary & Add Stops 🚀'}
                </button>
              )}
            </div>
          </div>

          {/* Right Live Preview Card (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-28">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-400" />
              Live Itinerary Card Preview
            </h3>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="h-44 relative">
                <img
                  src={formData.coverImageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h4 className="text-lg font-bold text-white truncate">
                    {formData.title || 'Untitled Itinerary'}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                    {formData.description || 'No description added yet.'}
                  </p>
                </div>
              </div>

              <div className="p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    {formData.startDate} - {formData.endDate}
                  </span>
                  <span className="font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                    {durationDays} Days
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400 pt-2 border-t border-slate-900">
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
