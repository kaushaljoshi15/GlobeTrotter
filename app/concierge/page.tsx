'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Calculator,
  Luggage,
  CloudSun,
  Shield,
  Sparkles,
  CheckSquare,
  Square,
  Plus,
  Trash2,
  DollarSign,
  Globe2,
  AlertCircle,
  Clock,
  Compass,
  ArrowRight
} from 'lucide-react';

const WEATHER_RADAR = [
  { city: 'Tokyo, Japan', temp: '22°C', condition: 'Sunny / Clear', season: 'Autumn Foliage (Prime Season)', icon: '☀️' },
  { city: 'Zurich, Switzerland', temp: '16°C', condition: 'Crisp Alpine', season: 'Hiking & Scenic Rail Pass', icon: '⛅' },
  { city: 'Rome, Italy', temp: '25°C', condition: 'Warm Mediterranean', season: 'Harvest Wine Tours', icon: '🍷' },
  { city: 'Zermatt, Switzerland', temp: '8°C', condition: 'Mountain Fresh', season: 'Glacier Express Season', icon: '🏔️' },
  { city: 'Reykjavik, Iceland', temp: '5°C', condition: 'Northern Lights Active', season: 'Aurora Borealis Peak', icon: '🌌' },
  { city: 'Kyoto, Japan', temp: '21°C', condition: 'Mild Autumn', season: 'Temple Garden Illuminations', icon: '🍁' },
];

export default function ConciergePage() {
  // Currency State
  const [calcAmount, setCalcAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [calcResult, setCalcResult] = useState<number | null>(null);

  // Dynamic Departure Checklist
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Renew International Passport & verify 6-month validity rule', done: true },
    { id: 2, text: 'Confirm international flight & high-speed rail reservations (Shinkansen / Eurail)', done: true },
    { id: 3, text: 'Purchase universal power adapter & eSIM global data bundle (Airalo / Ubigi)', done: false },
    { id: 4, text: 'Notify credit card provider of international travel destinations & enable zero-FX fee', done: false },
    { id: 5, text: 'Pack alpine thermal layers & waterproof trail footwear', done: false },
    { id: 6, text: 'Download offline Google Maps and translation packs for all transit cities', done: false },
  ]);
  const [newChecklistText, setNewChecklistText] = useState('');

  // Live Currency Calculator Conversion
  useEffect(() => {
    const RATES: Record<string, number> = {
      USD: 1.0,
      EUR: 0.92,
      GBP: 0.79,
      JPY: 154.5,
      INR: 83.2,
      CAD: 1.35,
      AUD: 1.52,
      CHF: 0.89,
    };

    const val = parseFloat(calcAmount);
    if (!isNaN(val) && RATES[fromCurrency] && RATES[toCurrency]) {
      const inUSD = val / RATES[fromCurrency];
      setCalcResult(Math.round(inUSD * RATES[toCurrency] * 100) / 100);
    }
  }, [calcAmount, fromCurrency, toCurrency]);

  const toggleChecklistItem = (id: number) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    setChecklist([
      ...checklist,
      { id: Date.now(), text: newChecklistText.trim(), done: false }
    ]);
    setNewChecklistText('');
  };

  const handleDeleteChecklistItem = (id: number) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const checklistDoneCount = checklist.filter((c) => c.done).length;

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-[#0c0d10]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
        
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#e4c29e] text-[11px] font-sans font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
            <span>Smart Travel Concierge &bull; Global Utilities Suite</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-white tracking-tight mb-3">
            Smart Concierge &amp; <span className="font-bold italic text-[#e4c29e]">Utilities.</span>
          </h1>

          <p className="font-serif text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
            Real-time currency exchange rates, smart pre-departure packing checklists, weather radars, and emergency safeguards for your journey.
          </p>
        </div>

        {/* 2 Main Modules Grid (Currency + Packing) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Module 1: Currency Calculator (6 Cols) */}
          <div className="lg:col-span-6 bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 font-sans">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b] block">
                FX Travel Converter
              </span>
              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2 mt-1">
                <Calculator className="w-5 h-5 text-[#c99a6b]" />
                Live Multi-Currency Calculator
              </h2>
              <p className="text-xs text-stone-400 mt-1">Real-time daily expense conversions across your multi-city stops</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Amount to Convert</label>
                <input
                  type="number"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(e.target.value)}
                  className="w-full bg-[#0c0d10] border border-white/15 rounded-2xl px-5 py-3.5 text-xl font-bold text-white focus:outline-none focus:border-[#c99a6b] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">From Currency</label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-3 text-xs text-white"
                  >
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                    <option value="JPY">JPY (¥ - Japanese Yen)</option>
                    <option value="CHF">CHF (Fr - Swiss Franc)</option>
                    <option value="INR">INR (₹ - Indian Rupee)</option>
                    <option value="CAD">CAD ($ - Canadian Dollar)</option>
                    <option value="AUD">AUD ($ - Australian Dollar)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">To Currency</label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-3 text-xs text-white"
                  >
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="JPY">JPY (¥ - Japanese Yen)</option>
                    <option value="CHF">CHF (Fr - Swiss Franc)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                    <option value="INR">INR (₹ - Indian Rupee)</option>
                    <option value="CAD">CAD ($ - Canadian Dollar)</option>
                    <option value="AUD">AUD ($ - Australian Dollar)</option>
                  </select>
                </div>
              </div>

              {calcResult !== null && (
                <div className="p-5 rounded-2xl bg-[#0c0d10] border border-[#c99a6b]/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">Converted Total</span>
                    <span className="text-xs text-stone-400">{calcAmount} {fromCurrency} equals</span>
                  </div>
                  <span className="font-serif text-3xl font-bold text-[#e4c29e]">
                    {calcResult.toLocaleString()} {toCurrency}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Module 2: Departure Packing Checklist (6 Cols) */}
          <div className="lg:col-span-6 bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 font-sans">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b] block">
                  Departure Readiness
                </span>
                <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2 mt-1">
                  <Luggage className="w-5 h-5 text-[#c99a6b]" />
                  Packing &amp; Essentials Checklist
                </h2>
                <p className="text-xs text-stone-400 mt-1">{checklistDoneCount} of {checklist.length} essential items completed</p>
              </div>

              <span className="text-sm font-bold text-[#e4c29e] font-serif">
                {Math.round((checklistDoneCount / checklist.length) * 100)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] h-full transition-all duration-500"
                style={{ width: `${(checklistDoneCount / checklist.length) * 100}%` }}
              />
            </div>

            {/* Checklist Items */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                    item.done
                      ? 'bg-[#0c0d10]/40 border-white/5 text-stone-500'
                      : 'bg-[#0c0d10] border-white/10 text-stone-200 hover:border-[#c99a6b]/40'
                  }`}
                  onClick={() => toggleChecklistItem(item.id)}
                >
                  <div className="flex items-center gap-3">
                    {item.done ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-stone-500 flex-shrink-0" />
                    )}
                    <span className={`text-xs ${item.done ? 'line-through text-stone-500' : 'text-stone-200'}`}>
                      {item.text}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChecklistItem(item.id);
                    }}
                    className="p-1 text-stone-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Item */}
            <form onSubmit={handleAddChecklistItem} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add custom packing item..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                className="flex-1 bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-[#c99a6b] hover:text-[#0c0d10] text-stone-200 text-xs font-bold transition-all cursor-pointer"
              >
                Add
              </button>
            </form>
          </div>

        </div>

        {/* Module 3: Live Weather Radar & Best Travel Season */}
        <div className="bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 font-sans">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b] block">
              Climate &amp; Seasonal Advisor
            </span>
            <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2 mt-1">
              <CloudSun className="w-5 h-5 text-[#c99a6b]" />
              Destination Weather &amp; Prime Travel Windows
            </h2>
            <p className="text-xs text-stone-400 mt-1">Real-time condition indicators for top worldwide multi-city destinations</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WEATHER_RADAR.map((item, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#0c0d10] border border-white/10 hover:border-[#c99a6b]/40 transition-all flex items-start justify-between">
                <div>
                  <span className="text-2xl mb-1 block">{item.icon}</span>
                  <h3 className="font-serif text-base font-bold text-white">{item.city}</h3>
                  <p className="text-xs text-[#e4c29e] mt-0.5">{item.condition}</p>
                  <span className="text-[10px] text-stone-400 block mt-2">{item.season}</span>
                </div>
                <span className="font-serif text-2xl font-bold text-white">{item.temp}</span>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
