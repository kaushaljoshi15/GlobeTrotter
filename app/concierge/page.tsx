'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import confetti from 'canvas-confetti';
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
  ArrowRight,
  ArrowUpDown,
  Repeat,
  Check,
  Copy,
  PhoneCall,
  CreditCard,
  Wifi,
  Zap,
  Info,
  Thermometer,
  Sun,
  CloudRain,
  Snowflake,
  Wind
} from 'lucide-react';

// Master Exchange Rates relative to 1 USD
const FX_RATES: Record<string, { rate: number; symbol: string; name: string; tag: string }> = {
  INR: { rate: 83.45, symbol: '₹', name: 'Indian Rupee', tag: 'IND' },
  USD: { rate: 1.0, symbol: '$', name: 'US Dollar', tag: 'USA' },
  EUR: { rate: 0.92, symbol: '€', name: 'Euro', tag: 'EUR' },
  GBP: { rate: 0.79, symbol: '£', name: 'British Pound', tag: 'GBR' },
  AED: { rate: 3.67, symbol: 'د.إ', name: 'UAE Dirham', tag: 'UAE' },
  JPY: { rate: 154.5, symbol: '¥', name: 'Japanese Yen', tag: 'JPN' },
  CHF: { rate: 0.89, symbol: 'CHF', name: 'Swiss Franc', tag: 'CHE' },
  SGD: { rate: 1.34, symbol: 'S$', name: 'Singapore Dollar', tag: 'SGP' },
  THB: { rate: 36.2, symbol: '฿', name: 'Thai Baht', tag: 'THA' },
  CAD: { rate: 1.36, symbol: 'CA$', name: 'Canadian Dollar', tag: 'CAN' },
  AUD: { rate: 1.51, symbol: 'AU$', name: 'Australian Dollar', tag: 'AUS' },
};

// Curated Destination Climate Radar & Best Travel Seasons (Carefully balanced into exact multiples of 4 for a perfect grid)
const CLIMATE_DATABASE = [
  // ===== 🇮🇳 INDIA TOURISM HUBS (12 items = 3 perfect rows of 4) =====
  { id: 'c-in-1', city: 'Jaipur', country: 'Rajasthan', countryTag: 'IND', region: 'India', tempC: 28, tempF: 82, condition: 'Pleasant & Sunny', season: 'Oct - Mar (Royal Palaces & Forts)', icon: '☀️' },
  { id: 'c-in-2', city: 'Goa', country: 'Coastal India', countryTag: 'IND', region: 'India', tempC: 29, tempF: 84, condition: 'Tropical Sea Breeze', season: 'Nov - Apr (Sun, Beaches & Festivities)', icon: '🌴' },
  { id: 'c-in-3', city: 'Kerala', country: 'Munnar & Alleppey', countryTag: 'IND', region: 'India', tempC: 24, tempF: 75, condition: 'Lush Green Backwaters', season: 'Sep - Mar (Houseboats & Tea Hills)', icon: '🚤' },
  { id: 'c-in-4', city: 'Agra', country: 'Uttar Pradesh', countryTag: 'IND', region: 'India', tempC: 26, tempF: 78, condition: 'Clear Skies', season: 'Oct - Mar (Taj Mahal Sunrise)', icon: '🕌' },
  { id: 'c-in-5', city: 'Delhi', country: 'National Capital', countryTag: 'IND', region: 'India', tempC: 25, tempF: 77, condition: 'Comfortable Autumn', season: 'Oct - Mar (Historic Monuments & Food)', icon: '🏛️' },
  { id: 'c-in-6', city: 'Manali', country: 'Himachal Pradesh', countryTag: 'IND', region: 'India', tempC: 14, tempF: 57, condition: 'Crisp Mountain Breeze', season: 'Mar - Jun & Oct - Feb (Snow)', icon: '🏔️' },
  { id: 'c-in-7', city: 'Kashmir', country: 'Srinagar & Gulmarg', countryTag: 'IND', region: 'India', tempC: 11, tempF: 52, condition: 'Alpine Fresh', season: 'Apr - Oct (Tulips) & Dec - Feb (Snow)', icon: '❄️' },
  { id: 'c-in-8', city: 'Varanasi', country: 'Uttar Pradesh', countryTag: 'IND', region: 'India', tempC: 27, tempF: 80, condition: 'Mild Evenings', season: 'Oct - Mar (Ganga Aarti & Boat Safaris)', icon: '🪔' },
  { id: 'c-in-9', city: 'Ladakh', country: 'Leh & Pangong', countryTag: 'IND', region: 'India', tempC: 12, tempF: 54, condition: 'High Altitude Sun', season: 'May - Sep (Azure Lakes & Passes)', icon: '🦅' },
  { id: 'c-in-10', city: 'Andaman', country: 'Havelock Island', countryTag: 'IND', region: 'India', tempC: 29, tempF: 84, condition: 'Tropical Island Air', season: 'Oct - May (Scuba & Sunset Beaches)', icon: '🤿' },
  { id: 'c-in-11', city: 'Amritsar', country: 'Punjab', countryTag: 'IND', region: 'India', tempC: 22, tempF: 72, condition: 'Clear & Crisp', season: 'Oct - Mar (Harmandir Sahib & Langar)', icon: '✨' },
  { id: 'c-in-12', city: 'Udaipur', country: 'Rajasthan', countryTag: 'IND', region: 'India', tempC: 27, tempF: 80, condition: 'Serene Lake Breeze', season: 'Sep - Mar (Marble Palaces & Boat Trips)', icon: '🏰' },

  // ===== 🌏 ASIA & EAST HUBS (8 items = 2 perfect rows of 4) =====
  { id: 'c-as-1', city: 'Tokyo', country: 'Japan', countryTag: 'JPN', region: 'Asia', tempC: 22, tempF: 72, condition: 'Sunny & Crisp', season: 'Mar - May (Sakura) & Oct - Nov', icon: '🌸' },
  { id: 'c-as-2', city: 'Kyoto', country: 'Japan', countryTag: 'JPN', region: 'Asia', tempC: 21, tempF: 70, condition: 'Mild Autumn Foliage', season: 'Oct - Dec & Apr - May (Temples)', icon: '🍁' },
  { id: 'c-as-3', city: 'Singapore', country: 'Garden City', countryTag: 'SGP', region: 'Asia', tempC: 30, tempF: 86, condition: 'Tropical Warmth', season: 'All Year (Marina Bay & Dining)', icon: '🏙️' },
  { id: 'c-as-4', city: 'Bali', country: 'Indonesia', countryTag: 'IDN', region: 'Asia', tempC: 28, tempF: 82, condition: 'Balmy Island Breeze', season: 'Apr - Oct (Rice Terraces & Beaches)', icon: '🌴' },
  { id: 'c-as-5', city: 'Bangkok', country: 'Thailand', countryTag: 'THA', region: 'Asia', tempC: 31, tempF: 88, condition: 'Warm & Vibrant', season: 'Nov - Feb (Grand Palace & Street Food)', icon: '🛕' },
  { id: 'c-as-6', city: 'Seoul', country: 'South Korea', countryTag: 'KOR', region: 'Asia', tempC: 18, tempF: 64, condition: 'Crisp & Sunny', season: 'Mar - May & Sep - Nov (Palaces)', icon: '🏮' },
  { id: 'c-as-7', city: 'Dubai', country: 'UAE', countryTag: 'UAE', region: 'Asia', tempC: 29, tempF: 84, condition: 'Warm Desert Sun', season: 'Nov - Mar (Desert Safaris & Skyline)', icon: '🏙️' },
  { id: 'c-as-8', city: 'Maldives', country: 'Indian Ocean', countryTag: 'MDV', region: 'Asia', tempC: 29, tempF: 84, condition: 'Turquoise Lagoons', season: 'Nov - Apr (Overwater Villas & Diving)', icon: '🐠' },

  // ===== 🏔️ EUROPE & ALPS HUBS (8 items = 2 perfect rows of 4) =====
  { id: 'c-eu-1', city: 'Zurich', country: 'Switzerland', countryTag: 'CHE', region: 'Europe', tempC: 16, tempF: 61, condition: 'Crisp Alpine Breeze', season: 'May - Sep (Scenic Trains & Lakes)', icon: '⛅' },
  { id: 'c-eu-2', city: 'Zermatt', country: 'Matterhorn', countryTag: 'CHE', region: 'Europe', tempC: 8, tempF: 46, condition: 'Fresh Glacial Air', season: 'Jun - Sep (Hiking) & Dec - Apr (Ski)', icon: '🏔️' },
  { id: 'c-eu-3', city: 'Rome', country: 'Italy', countryTag: 'ITA', region: 'Europe', tempC: 25, tempF: 77, condition: 'Warm Mediterranean', season: 'Apr - Jun & Sep - Oct (Colosseum)', icon: '🍷' },
  { id: 'c-eu-4', city: 'Paris', country: 'France', countryTag: 'FRA', region: 'Europe', tempC: 19, tempF: 66, condition: 'Mild & Romantic', season: 'Apr - Jun & Sep - Nov (Louvre & Seine)', icon: '🥐' },
  { id: 'c-eu-5', city: 'London', country: 'United Kingdom', countryTag: 'GBR', region: 'Europe', tempC: 17, tempF: 63, condition: 'Mild Overcast / Sun', season: 'May - Sep (Royal Sights & Theatres)', icon: '🎡' },
  { id: 'c-eu-6', city: 'Santorini', country: 'Greece', countryTag: 'GRC', region: 'Europe', tempC: 26, tempF: 79, condition: 'Aegean Sun & Sea Breeze', season: 'May - Oct (Caldera Sunsets)', icon: '⛵' },
  { id: 'c-eu-7', city: 'Venice', country: 'Grand Canal', countryTag: 'ITA', region: 'Europe', tempC: 22, tempF: 72, condition: 'Lagoon Breeze', season: 'Apr - Jun & Sep - Oct (Gondola Tours)', icon: '🎭' },
  { id: 'c-eu-8', city: 'Reykjavik', country: 'Iceland', countryTag: 'ISL', region: 'Europe', tempC: 5, tempF: 41, condition: 'Aurora Active', season: 'Sep - Mar (Northern Lights Hunt)', icon: '🌌' },

  // ===== 🌐 GLOBAL HOTSPOTS (8 items = 2 perfect rows of 4) =====
  { id: 'c-gl-1', city: 'Dubai', country: 'United Arab Emirates', countryTag: 'UAE', region: 'Global', tempC: 29, tempF: 84, condition: 'Warm Desert Sun', season: 'Nov - Mar (Desert Safaris & Skyline)', icon: '🏙️' },
  { id: 'c-gl-2', city: 'New York City', country: 'United States', countryTag: 'USA', region: 'Global', tempC: 20, tempF: 68, condition: 'Brisk Autumn Sky', season: 'Sep - Nov & Apr - Jun (Central Park)', icon: '🗽' },
  { id: 'c-gl-3', city: 'London', country: 'United Kingdom', countryTag: 'GBR', region: 'Global', tempC: 17, tempF: 63, condition: 'Mild Autumn', season: 'May - Sep (West End & Museums)', icon: '🎡' },
  { id: 'c-gl-4', city: 'Singapore', country: 'Southeast Asia', countryTag: 'SGP', region: 'Global', tempC: 30, tempF: 86, condition: 'Warm & Tropical', season: 'All Year (Gardens by the Bay)', icon: '🏙️' },
  { id: 'c-gl-5', city: 'Bali', country: 'Indonesia', countryTag: 'IDN', region: 'Global', tempC: 28, tempF: 82, condition: 'Balmy Island Air', season: 'Apr - Oct (Ubud & Cliff Temples)', icon: '🌴' },
  { id: 'c-gl-6', city: 'Tokyo', country: 'Japan', countryTag: 'JPN', region: 'Global', tempC: 22, tempF: 72, condition: 'Sunny & Clear', season: 'Mar - May & Oct - Nov (Shibuya)', icon: '🌸' },
  { id: 'c-gl-7', city: 'Sydney', country: 'Australia', countryTag: 'AUS', region: 'Global', tempC: 23, tempF: 73, condition: 'Pacific Breeze', season: 'Sep - Nov & Mar - May (Harbour)', icon: '🦘' },
  { id: 'c-gl-8', city: 'Reykjavik', country: 'Iceland', countryTag: 'ISL', region: 'Global', tempC: 5, tempF: 41, condition: 'Aurora Active', season: 'Sep - Mar (Northern Lights Hunt)', icon: '🌌' },
];

// Pre-Departure Essentials Checklist Items with Categories
const INITIAL_PACKING_ITEMS = [
  { id: 1, text: 'Original Passport & Visa (Ensure 6+ months validity from departure date)', category: 'documents', done: true },
  { id: 2, text: 'Flight Tickets & Rail Passes (Vande Bharat / Shinkansen / Swiss Travel Pass)', category: 'documents', done: true },
  { id: 3, text: 'Zero-Forex Travel Card & Backup Credit Card with International Usage activated', category: 'money', done: true },
  { id: 4, text: 'Local Cash Reserve in destination currency (₹ INR, USD, EUR, or JPY)', category: 'money', done: false },
  { id: 5, text: 'International eSIM or Roaming Pass activated (Airalo, Ubigi, Jio/Airtel World Pass)', category: 'tech', done: false },
  { id: 6, text: 'Universal Plug Adapter (Type C/D/G/A) & 20,000 mAh Flight-approved Power Bank', category: 'tech', done: true },
  { id: 7, text: 'Comprehensive Travel Health Insurance & Emergency Policy Copy', category: 'documents', done: true },
  { id: 8, text: 'Destination-specific Clothing (Thermal layers for Himalayas/Alps, breathable cotton for Goa)', category: 'clothing', done: false },
  { id: 9, text: 'Personal Medical Kit (Prescriptions, motion sickness pills, electrolyte ORS sachets)', category: 'health', done: false },
  { id: 10, text: 'Offline Google Maps and City Translation Packs pre-downloaded on phone', category: 'tech', done: false },
];

export default function ConciergePage() {
  // Currency Converter State
  const [calcAmount, setCalcAmount] = useState<string>('10000');
  const [fromCurrency, setFromCurrency] = useState<string>('INR');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [calcResult, setCalcResult] = useState<number | null>(null);

  // Packing Checklist State
  const [checklist, setChecklist] = useState(INITIAL_PACKING_ITEMS);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [newChecklistCategory, setNewChecklistCategory] = useState('documents');
  const [selectedPackingFilter, setSelectedPackingFilter] = useState('all');

  // Weather & Climate State
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');

  // Copied Helpline Number State
  const [copiedHelpline, setCopiedHelpline] = useState<string | null>(null);

  // Live Currency Conversion Calculator
  useEffect(() => {
    const val = parseFloat(calcAmount);
    if (!isNaN(val) && val >= 0 && FX_RATES[fromCurrency] && FX_RATES[toCurrency]) {
      const fromObj = FX_RATES[fromCurrency];
      const toObj = FX_RATES[toCurrency];
      const inUSD = val / fromObj.rate;
      const converted = inUSD * toObj.rate;
      setCalcResult(Math.round(converted * 100) / 100);
    } else {
      setCalcResult(null);
    }
  }, [calcAmount, fromCurrency, toCurrency]);

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleQuickAmount = (amt: number) => {
    setCalcAmount(amt.toString());
  };

  // Packing Checklist Controls
  const toggleChecklistItem = (id: number) => {
    const updated = checklist.map((item) => (item.id === id ? { ...item, done: !item.done } : item));
    setChecklist(updated);

    const allDone = updated.every(item => item.done);
    if (allDone && updated.length > 0) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;

    const newItem = {
      id: Date.now(),
      text: newChecklistText.trim(),
      category: newChecklistCategory,
      done: false
    };

    setChecklist([newItem, ...checklist]);
    setNewChecklistText('');
  };

  const handleDeleteChecklistItem = (id: number) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const filteredChecklist = useMemo(() => {
    if (selectedPackingFilter === 'all') return checklist;
    return checklist.filter(c => c.category === selectedPackingFilter);
  }, [checklist, selectedPackingFilter]);

  const checklistDoneCount = checklist.filter(c => c.done).length;
  const progressPercent = checklist.length > 0 ? Math.round((checklistDoneCount / checklist.length) * 100) : 0;

  // Filtered Weather Cities
  const filteredWeather = useMemo(() => {
    if (selectedRegion === 'all') return CLIMATE_DATABASE;
    return CLIMATE_DATABASE.filter(c => c.region.toLowerCase() === selectedRegion.toLowerCase());
  }, [selectedRegion]);

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedHelpline(num);
    setTimeout(() => setCopiedHelpline(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-[#0c0d10]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-12">
        
        {/* ================= 1. HERO HEADER BANNER ================= */}
        <div className="relative rounded-[32px] overflow-hidden bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#c99a6b]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#e4c29e] text-[11px] font-sans font-medium mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
                <span>Smart Travel Concierge &bull; Global &amp; Indian Utilities Suite</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-medium text-white tracking-tight leading-tight">
                Smart Travel Toolkit &amp; <span className="font-bold italic text-[#e4c29e]">Concierge.</span>
              </h1>
              
              <p className="font-serif text-base text-stone-300 mt-2 max-w-2xl leading-relaxed">
                Everything you need for seamless domestic &amp; international journeys — live currency exchange rates (₹ INR &amp; Forex), pre-departure packing checklists, climate radars, and 24/7 tourist emergency helplines.
              </p>
            </div>

            {/* Quick Portal Jump Cards */}
            <div className="flex flex-wrap items-center gap-2 font-sans">
              <a
                href="#forex-calculator"
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-bold border border-white/10 transition-all flex items-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5 text-[#c99a6b]" />
                <span>Forex Calculator</span>
              </a>

              <a
                href="#packing-checklist"
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-bold border border-white/10 transition-all flex items-center gap-1.5"
              >
                <Luggage className="w-3.5 h-3.5 text-[#c99a6b]" />
                <span>Packing List</span>
              </a>

              <a
                href="#climate-radar"
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-bold border border-white/10 transition-all flex items-center gap-1.5"
              >
                <CloudSun className="w-3.5 h-3.5 text-[#c99a6b]" />
                <span>Weather Radar</span>
              </a>

              <a
                href="#emergency-directory"
                className="px-4 py-2 rounded-xl bg-[#c99a6b]/20 hover:bg-[#c99a6b]/30 text-[#e4c29e] text-xs font-bold border border-[#c99a6b]/40 transition-all flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-[#c99a6b]" />
                <span>Helplines</span>
              </a>
            </div>
          </div>
        </div>

        {/* ================= 2. TWO-COLUMN MAIN TOOLS (FOREX & PACKING) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* TOOL 1: LIVE MULTI-CURRENCY FOREX CONVERTER (6 Cols) */}
          <div id="forex-calculator" className="lg:col-span-6 bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 font-sans">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b] block">
                  Foreign Exchange (FX) &bull; Live Rates
                </span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Dynamic Sync
                </span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2 mt-1">
                <Calculator className="w-5 h-5 text-[#c99a6b]" />
                Live Currency &amp; Forex Calculator
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Convert Indian Rupees (₹ INR) to foreign currencies with zero hidden calculation markup.
              </p>
            </div>

            <div className="space-y-4">
              {/* Input Amount */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  Amount to Convert
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-[#c99a6b]">
                    {FX_RATES[fromCurrency]?.symbol || '$'}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(e.target.value)}
                    placeholder="Enter amount..."
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-2xl pl-10 pr-4 py-3.5 text-xl font-bold text-white focus:outline-none focus:border-[#c99a6b] transition-all font-mono"
                  />
                </div>
              </div>

              {/* Quick Amount Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 mr-1">Quick:</span>
                {[1000, 5000, 10000, 25000, 50000, 100000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickAmount(amt)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-stone-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                  >
                    ₹{amt >= 100000 ? `${amt / 100000}L` : `${amt / 1000}k`}
                  </button>
                ))}
              </div>

              {/* Currencies Dropdowns with Swap Button */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-2">
                <div className="sm:col-span-5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">From Currency</label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white cursor-pointer focus:outline-none focus:border-[#c99a6b]"
                  >
                    {Object.entries(FX_RATES).map(([code, info]) => (
                      <option key={code} value={code} className="bg-[#14151a] text-white">
                        [{info.tag}] {code} ({info.symbol} - {info.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <div className="sm:col-span-2 flex justify-center pt-4 sm:pt-4">
                  <button
                    type="button"
                    onClick={handleSwapCurrencies}
                    title="Swap Currencies"
                    className="p-2.5 rounded-full bg-[#0c0d10] hover:bg-white/10 text-[#c99a6b] hover:text-white border border-white/15 transition-all hover:rotate-180 cursor-pointer shadow-md"
                  >
                    <Repeat className="w-4 h-4" />
                  </button>
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">To Currency</label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white cursor-pointer focus:outline-none focus:border-[#c99a6b]"
                  >
                    {Object.entries(FX_RATES).map(([code, info]) => (
                      <option key={code} value={code} className="bg-[#14151a] text-white">
                        [{info.tag}] {code} ({info.symbol} - {info.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Converted Total Result Display */}
              {calcResult !== null && (
                <div className="p-5 rounded-2xl bg-[#0c0d10] border border-[#c99a6b]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                      Calculated Exchange Output
                    </span>
                    <span className="text-[10px] text-stone-400">
                      1 {fromCurrency} = {(FX_RATES[toCurrency].rate / FX_RATES[fromCurrency].rate).toFixed(4)} {toCurrency}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs text-stone-300 font-mono">
                      {parseFloat(calcAmount).toLocaleString()} {fromCurrency} &rarr;
                    </span>
                    <span className="font-serif text-3xl font-bold text-[#e4c29e] font-mono">
                      {FX_RATES[toCurrency]?.symbol} {calcResult.toLocaleString()} {toCurrency}
                    </span>
                  </div>
                </div>
              )}

              {/* Zero Markup Tip */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-[11px] text-stone-300">
                <CreditCard className="w-4 h-4 text-[#c99a6b] flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Traveler Pro-Tip:</strong> Use zero-forex markup debit/credit cards (Niyo, Scapia, Fi) to avoid 3.5% foreign transaction fees when swiping abroad.
                </span>
              </div>
            </div>
          </div>

          {/* TOOL 2: SMART DEPARTURE PACKING CHECKLIST (6 Cols) */}
          <div id="packing-checklist" className="lg:col-span-6 bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 font-sans">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b] block">
                    Departure Readiness
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2 mt-1">
                    <Luggage className="w-5 h-5 text-[#c99a6b]" />
                    Packing &amp; Essentials Checklist
                  </h2>
                </div>

                <div className="text-right">
                  <span className="font-serif text-xl font-bold text-[#e4c29e] block">
                    {progressPercent}%
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {checklistDoneCount}/{checklist.length} packed
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Category Filter Pills (Clean Wrapping - No Ugly Scrollbar) */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Items', count: checklist.length },
                { id: 'documents', label: '🛂 Documents', count: checklist.filter(c => c.category === 'documents').length },
                { id: 'money', label: '💳 Money & Cards', count: checklist.filter(c => c.category === 'money').length },
                { id: 'tech', label: '🔌 Electronics', count: checklist.filter(c => c.category === 'tech').length },
                { id: 'clothing', label: '👔 Clothing', count: checklist.filter(c => c.category === 'clothing').length },
                { id: 'health', label: '💊 Health', count: checklist.filter(c => c.category === 'health').length },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedPackingFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedPackingFilter === filter.id
                      ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-sm'
                      : 'bg-[#0c0d10] text-stone-400 border border-white/10 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${selectedPackingFilter === filter.id ? 'bg-[#0c0d10]/30 text-[#0c0d10]' : 'bg-white/10 text-stone-300'}`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Checklist Items Container */}
            <div className="space-y-2.5">
              {filteredChecklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 group cursor-pointer ${
                    item.done
                      ? 'bg-[#0c0d10]/40 border-white/5 text-stone-500'
                      : 'bg-[#0c0d10] border-white/10 text-stone-200 hover:border-[#c99a6b]/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5 flex-shrink-0">
                      {item.done ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-500" />
                      )}
                    </div>
                    <div>
                      <span className={`text-xs leading-relaxed ${item.done ? 'line-through text-stone-500' : 'text-stone-200'}`}>
                        {item.text}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-stone-500 block mt-0.5 tracking-wider">
                        #{item.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChecklistItem(item.id);
                    }}
                    title="Remove item"
                    className="p-1 text-stone-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Packing Item */}
            <form onSubmit={handleAddChecklistItem} className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Add Custom Packing Item</span>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={newChecklistCategory}
                  onChange={(e) => setNewChecklistCategory(e.target.value)}
                  className="bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                >
                  <option value="documents">🛂 Documents</option>
                  <option value="money">💳 Money</option>
                  <option value="tech">🔌 Electronics</option>
                  <option value="clothing">👔 Clothing</option>
                  <option value="health">💊 Health</option>
                </select>

                <input
                  type="text"
                  placeholder="e.g. Carry warm socks, umbrella, extra passport photos..."
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  className="flex-1 bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b]"
                />

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold transition-all cursor-pointer flex-shrink-0"
                >
                  + Add
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* ================= 3. CLIMATE RADAR & BEST TRAVEL SEASONS ================= */}
        <div id="climate-radar" className="bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b] block">
                Climate &amp; Seasonal Timing
              </span>
              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2 mt-1">
                <CloudSun className="w-5 h-5 text-[#c99a6b]" />
                Destination Climate &amp; Prime Travel Windows
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Real-time weather indicators and optimal travel seasons for top Indian tourist corridors &amp; global cities.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
              {/* Region Filter */}
              <div className="flex items-center gap-1 bg-[#0c0d10] p-1 rounded-xl border border-white/10 text-xs">
                {[
                  { id: 'all', label: 'All Cities (24)' },
                  { id: 'India', label: '🇮🇳 India (12)' },
                  { id: 'Asia', label: '🌏 Asia (8)' },
                  { id: 'Europe', label: '🏔️ Europe (8)' },
                  { id: 'Global', label: '🌐 Global (8)' },
                ].map((reg) => (
                  <button
                    key={reg.id}
                    onClick={() => setSelectedRegion(reg.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedRegion === reg.id
                        ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-sm'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {reg.label}
                  </button>
                ))}
              </div>

              {/* Temperature Unit Switcher */}
              <div className="flex items-center bg-[#0c0d10] p-1 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setTempUnit('C')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    tempUnit === 'C' ? 'bg-[#c99a6b] text-[#0c0d10]' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  °C
                </button>
                <button
                  onClick={() => setTempUnit('F')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    tempUnit === 'F' ? 'bg-[#c99a6b] text-[#0c0d10]' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  °F
                </button>
              </div>
            </div>
          </div>

          {/* Climate Cards Grid - Perfectly Balanced 4-column layout with zero blank slots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredWeather.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#0c0d10] border border-white/10 hover:border-[#c99a6b]/40 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-serif text-2xl font-bold text-white group-hover:text-[#e4c29e] transition-colors font-mono">
                      {tempUnit === 'C' ? `${item.tempC}°C` : `${item.tempF}°F`}
                    </span>
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-base font-bold text-white group-hover:text-[#e4c29e] transition-colors">
                        {item.city}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono font-bold text-[#e4c29e]">
                        {item.countryTag}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400">{item.country}</p>
                    <p className="text-xs text-[#e4c29e] font-medium mt-1">{item.condition}</p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-white/10">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Prime Season:</span>
                  <p className="text-[11px] text-stone-300 mt-0.5 font-medium leading-relaxed">
                    {item.season}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 4. 24/7 TOURIST EMERGENCY HELPLINE DIRECTORY ================= */}
        <div id="emergency-directory" className="bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 font-sans">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b] block">
              Travel Safety &amp; Immediate Assistance
            </span>
            <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2 mt-1">
              <Shield className="w-5 h-5 text-[#c99a6b]" />
              24/7 Tourist Emergency Helplines &amp; Safety Directory
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Direct emergency contact numbers for immediate police, medical, railway, and tourism assistance in India and worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* India Emergency Card */}
            <div className="p-5 rounded-2xl bg-[#0c0d10] border border-red-500/30 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">🇮🇳 India Emergency</span>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold">24x7 Active</span>
              </div>

              <div>
                <p className="font-serif text-2xl font-bold text-white font-mono">112</p>
                <p className="text-xs text-stone-400 mt-0.5">National Unified Emergency Services (Police, Fire, Medical)</p>
              </div>

              <button
                onClick={() => handleCopyNumber('112')}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedHelpline === '112' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHelpline === '112' ? 'Copied Number!' : 'Copy 112'}</span>
              </button>
            </div>

            {/* Incredible India Tourist Helpline */}
            <div className="p-5 rounded-2xl bg-[#0c0d10] border border-[#c99a6b]/40 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#e4c29e] uppercase tracking-wider">🇮🇳 Tourist Helpline</span>
                <span className="px-2 py-0.5 rounded-full bg-[#c99a6b]/20 text-[#e4c29e] text-[10px] font-bold">Multi-Lingual</span>
              </div>

              <div>
                <p className="font-serif text-2xl font-bold text-white font-mono">1363</p>
                <p className="text-xs text-stone-400 mt-0.5">Ministry of Tourism 24x7 Helpline (English, Hindi &amp; 10 Global Languages)</p>
              </div>

              <button
                onClick={() => handleCopyNumber('1363')}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-xs font-bold text-[#0c0d10] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedHelpline === '1363' ? <Check className="w-3.5 h-3.5 text-emerald-900" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHelpline === '1363' ? 'Copied 1363!' : 'Copy 1363'}</span>
              </button>
            </div>

            {/* Indian Railways 139 */}
            <div className="p-5 rounded-2xl bg-[#0c0d10] border border-white/10 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">🚆 Indian Rail Helpline</span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-stone-300 text-[10px] font-bold">IRCTC</span>
              </div>

              <div>
                <p className="font-serif text-2xl font-bold text-white font-mono">139</p>
                <p className="text-xs text-stone-400 mt-0.5">Vande Bharat &amp; Express Trains (Security, Medical &amp; PNR Status)</p>
              </div>

              <button
                onClick={() => handleCopyNumber('139')}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedHelpline === '139' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHelpline === '139' ? 'Copied 139!' : 'Copy 139'}</span>
              </button>
            </div>

            {/* International Global Emergency */}
            <div className="p-5 rounded-2xl bg-[#0c0d10] border border-white/10 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">🌐 Global Standards</span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-stone-300 text-[10px] font-bold">Worldwide</span>
              </div>

              <div>
                <p className="font-serif text-xl font-bold text-white font-mono">911 / 112 / 999</p>
                <p className="text-xs text-stone-400 mt-0.5">USA (911), Europe (112), Japan (110), UK/UAE (999)</p>
              </div>

              <button
                onClick={() => handleCopyNumber('112')}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedHelpline === '112' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHelpline === '112' ? 'Copied Global 112!' : 'Copy EU 112'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* ================= 5. TRAVEL ESSENTIALS QUICK REFERENCE TILES ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          
          <div className="p-6 rounded-[28px] bg-[#14151a]/95 border border-white/10 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c99a6b]/20 text-[#e4c29e] flex items-center justify-center">
              <Wifi className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">eSIM &amp; High-Speed Data</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Install digital eSIMs (Airalo / Ubigi) before boarding your international flight, or activate Jio/Airtel International Roaming Packs starting from ₹499/day.
            </p>
          </div>

          <div className="p-6 rounded-[28px] bg-[#14151a]/95 border border-white/10 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c99a6b]/20 text-[#e4c29e] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">Zero Forex Card Savings</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Standard Indian credit cards charge 3.5% + 18% GST on international transactions. Zero-markup forex cards save you ₹3,500 to ₹10,000 on average vacations.
            </p>
          </div>

          <div className="p-6 rounded-[28px] bg-[#14151a]/95 border border-white/10 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c99a6b]/20 text-[#e4c29e] flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">Universal Plug Standards</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              India uses Type C &amp; D. Europe uses Type C/E/F. Japan &amp; USA use Type A/B flat pins. UK &amp; UAE use Type G. Always carry a multi-country surge adapter.
            </p>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
