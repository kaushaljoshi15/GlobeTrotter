'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  DollarSign,
  PieChart as PieIcon,
  Sparkles,
  Users,
  Calendar,
  Hotel,
  Plane,
  Utensils,
  Ticket,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  MapPin,
  RefreshCw,
  Plus,
  Trash2,
  Check,
  Compass
} from 'lucide-react';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)', defaultBudget: 30000 },
  { code: 'USD', symbol: '$', name: 'US Dollar ($)', defaultBudget: 2000 },
  { code: 'EUR', symbol: '€', name: 'Euro (€)', defaultBudget: 1800 },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)', defaultBudget: 1500 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)', defaultBudget: 250000 },
];

const TRAVEL_STYLES = [
  {
    id: 'budget',
    title: '🎒 Smart Saver & Backpacker',
    desc: 'Cozy homestays, hostels, street culinary trails & scenic rail passes',
    staysPct: 30,
    transportPct: 25,
    foodPct: 25,
    activitiesPct: 15,
    bufferPct: 5,
    dailyMultiplier: 0.7,
  },
  {
    id: 'comfort',
    title: '🏨 Comfort & Boutique Atelier',
    desc: 'Boutique 3-4 star hotels, curated bistros & comfortable transit',
    staysPct: 35,
    transportPct: 22,
    foodPct: 23,
    activitiesPct: 15,
    bufferPct: 5,
    dailyMultiplier: 1.0,
  },
  {
    id: 'luxury',
    title: '👑 Luxury & High-End',
    desc: '5-star panoramic resorts, fine dining & private bespoke excursions',
    staysPct: 45,
    transportPct: 20,
    foodPct: 20,
    activitiesPct: 10,
    bufferPct: 5,
    dailyMultiplier: 1.8,
  },
];

const DESTINATION_BENCHMARKS = [
  { name: 'Himachal & Parvati Mountains', country: 'India', minDailyINR: 2500, minDailyUSD: 35, category: 'Alpine & Valleys', tag: 'High Affordability' },
  { name: 'Goa Coastal Terraces', country: 'India', minDailyINR: 3000, minDailyUSD: 40, category: 'Coastal & Beaches', tag: 'High Affordability' },
  { name: 'Bali Highlands & Ubud', country: 'Indonesia', minDailyINR: 4000, minDailyUSD: 50, category: 'Tropical Hills', tag: 'Moderate' },
  { name: 'Kyoto Heritage & Arashiyama', country: 'Japan', minDailyINR: 9000, minDailyUSD: 110, category: 'Heritage & Temples', tag: 'Moderate' },
  { name: 'Amalfi Coast & Positano', country: 'Italy', minDailyINR: 14000, minDailyUSD: 170, category: 'Cliffside Coast', tag: 'Luxury Tier' },
  { name: 'Swiss Alps & Zermatt', country: 'Switzerland', minDailyINR: 18000, minDailyUSD: 220, category: 'High Mountain Pass', tag: 'First-Class' },
];

export default function SmartBudgetPage() {
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [totalBudget, setTotalBudget] = useState(30000);
  const [days, setDays] = useState(5);
  const [travelers, setTravelers] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState(TRAVEL_STYLES[1]);

  // Custom Category Percentages
  const [staysPct, setStaysPct] = useState(35);
  const [transportPct, setTransportPct] = useState(22);
  const [foodPct, setFoodPct] = useState(23);
  const [activitiesPct, setActivitiesPct] = useState(15);
  const [bufferPct, setBufferPct] = useState(5);

  // Group Splitter State
  const [groupExpenses, setGroupExpenses] = useState<{ id: number; title: string; payer: string; amount: number }[]>([
    { id: 1, title: 'Mountain Chalet Booking', payer: 'Alex', amount: 12000 },
    { id: 2, title: 'Scenic Car / Train Transit', payer: 'Sam', amount: 4500 },
    { id: 3, title: 'Group Dinner Feast', payer: 'Alex', amount: 3200 },
  ]);
  const [newExpenseTitle, setNewExpenseTitle] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpensePayer, setNewExpensePayer] = useState('Alex');
  const [friendsList, setFriendsList] = useState(['Alex', 'Sam', 'Jordan']);

  const handleCurrencyChange = (currCode: string) => {
    const curr = CURRENCIES.find((c) => c.code === currCode) || CURRENCIES[0];
    setSelectedCurrency(curr);
    setTotalBudget(curr.defaultBudget);
  };

  const handleStyleChange = (style: typeof TRAVEL_STYLES[0]) => {
    setSelectedStyle(style);
    setStaysPct(style.staysPct);
    setTransportPct(style.transportPct);
    setFoodPct(style.foodPct);
    setActivitiesPct(style.activitiesPct);
    setBufferPct(style.bufferPct);
  };

  // Calculations
  const sym = selectedCurrency.symbol;
  const dailyTotal = useMemo(() => Math.round(totalBudget / Math.max(1, days)), [totalBudget, days]);
  const dailyPerPerson = useMemo(() => Math.round(dailyTotal / Math.max(1, travelers)), [dailyTotal, travelers]);

  const stayAmount = useMemo(() => Math.round((totalBudget * staysPct) / 100), [totalBudget, staysPct]);
  const transportAmount = useMemo(() => Math.round((totalBudget * transportPct) / 100), [totalBudget, transportPct]);
  const foodAmount = useMemo(() => Math.round((totalBudget * foodPct) / 100), [totalBudget, foodPct]);
  const activitiesAmount = useMemo(() => Math.round((totalBudget * activitiesPct) / 100), [totalBudget, activitiesPct]);
  const bufferAmount = useMemo(() => Math.round((totalBudget * bufferPct) / 100), [totalBudget, bufferPct]);

  const maxNightlyHotel = useMemo(() => Math.round(stayAmount / Math.max(1, days - 1 || 1)), [stayAmount, days]);
  const dailyMealCap = useMemo(() => Math.round(foodAmount / Math.max(1, days)), [foodAmount, days]);

  // Group split calculations
  const totalGroupExpense = groupExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const perPersonShare = Math.round(totalGroupExpense / Math.max(1, friendsList.length));

  const handleAddGroupExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseTitle.trim() || !newExpenseAmount) return;
    setGroupExpenses([
      ...groupExpenses,
      {
        id: Date.now(),
        title: newExpenseTitle.trim(),
        payer: newExpensePayer,
        amount: parseFloat(newExpenseAmount),
      },
    ]);
    setNewExpenseTitle('');
    setNewExpenseAmount('');
  };

  const handleRemoveGroupExpense = (id: number) => {
    setGroupExpenses(groupExpenses.filter((g) => g.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-12">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#e4c29e] text-[11px] font-sans font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
            <span>Smart Travel Budget Architecture &bull; Effortless Clarity</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-white tracking-tight mb-3">
            Smart Budget <span className="font-bold italic text-[#e4c29e]">Atelier.</span>
          </h1>
          <p className="font-serif text-stone-300 text-sm sm:text-base leading-relaxed">
            Plan your exact travel allowances with zero guesswork. Auto-split your budget across stays, transit, culinary experiences &amp; sights.
          </p>
        </div>

        {/* 1. Main Budget Input Control Center */}
        <div className="bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-10 shadow-2xl space-y-8 font-sans">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            
            {/* Currency Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                Currency
              </label>
              <select
                value={selectedCurrency.code}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-5 py-3.5 text-xs text-white focus:outline-none focus:border-[#c99a6b] transition-all cursor-pointer font-sans"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Budget Amount Input */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Total Travel Budget ({sym})
                </label>
                <div className="flex items-center gap-1.5">
                  {[15000, 30000, 50000, 100000].map((val) => {
                    const displayVal = selectedCurrency.code === 'INR' ? `₹${(val / 1000)}k` : `$${Math.round(val / 20)}`;
                    const realVal = selectedCurrency.code === 'INR' ? val : Math.round(val / 20);
                    return (
                      <button
                        key={val}
                        onClick={() => setTotalBudget(realVal)}
                        className="px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-[10px] font-bold text-[#e4c29e] border border-white/10 transition-colors"
                      >
                        {displayVal}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-serif font-bold text-lg text-[#c99a6b]">
                  {sym}
                </span>
                <input
                  type="number"
                  min={100}
                  step={100}
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-[#0c0d10] border border-white/15 rounded-full pl-12 pr-6 py-3 text-lg font-serif font-bold text-white focus:outline-none focus:border-[#c99a6b] transition-all"
                />
              </div>
            </div>

            {/* Days & Travelers Controls */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Duration ({days}d)
                </label>
                <select
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-4 py-3.5 text-xs text-white"
                >
                  {[3, 4, 5, 7, 10, 14, 21, 30].map((d) => (
                    <option key={d} value={d}>
                      {d} Days
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                  People ({travelers})
                </label>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(parseInt(e.target.value))}
                  className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-4 py-3.5 text-xs text-white"
                >
                  {[1, 2, 3, 4, 6, 8].map((t) => (
                    <option key={t} value={t}>
                      {t === 1 ? 'Solo (1)' : t === 2 ? 'Couple (2)' : `Group (${t})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Travel Style Profile Cards */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-3">
              Select Trip Style Profile
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TRAVEL_STYLES.map((style) => {
                const isSelected = selectedStyle.id === style.id;
                return (
                  <div
                    key={style.id}
                    onClick={() => handleStyleChange(style)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#0c0d10] border-[#c99a6b] ring-1 ring-[#c99a6b]/30 shadow-lg'
                        : 'bg-[#0c0d10]/50 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <p className="text-xs font-bold text-white flex items-center justify-between">
                      <span>{style.title}</span>
                      {isSelected && <span className="text-[10px] text-[#e4c29e] font-bold">✓ Active</span>}
                    </p>
                    <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">{style.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* 2. Live Key Financial Breakdown Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
          
          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Daily Total Spend</span>
              <Calendar className="w-4 h-4 text-[#c99a6b]" />
            </div>
            <p className="font-serif text-3xl font-bold text-white mt-1">
              {sym}{dailyTotal.toLocaleString()}
            </p>
            <span className="text-[11px] text-stone-400">For whole group per day</span>
          </div>

          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Per Person / Day</span>
              <Users className="w-4 h-4 text-[#e4c29e]" />
            </div>
            <p className="font-serif text-3xl font-bold text-[#e4c29e] mt-1">
              {sym}{dailyPerPerson.toLocaleString()}
            </p>
            <span className="text-[11px] text-stone-400">Individual daily burn allowance</span>
          </div>

          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Max Nightly Stay</span>
              <Hotel className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="font-serif text-3xl font-bold text-emerald-400 mt-1">
              {sym}{maxNightlyHotel.toLocaleString()}
            </p>
            <span className="text-[11px] text-stone-400">Recommended hotel target / night</span>
          </div>

          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Daily Dining Allowance</span>
              <Utensils className="w-4 h-4 text-amber-400" />
            </div>
            <p className="font-serif text-3xl font-bold text-amber-400 mt-1">
              {sym}{dailyMealCap.toLocaleString()}
            </p>
            <span className="text-[11px] text-stone-400">Breakfast, Lunch &amp; Dinner budget</span>
          </div>

        </div>

        {/* 3. Interactive Category Allocation Breakdown */}
        <div className="bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 font-sans">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
                Category Breakdown
              </span>
              <h2 className="font-serif text-2xl font-medium text-white tracking-tight mt-0.5">
                Intelligent Allocation Buckets
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/ai-planner`}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-md shadow-[#c99a6b]/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Itinerary with this Budget</span>
              </Link>
            </div>
          </div>

          {/* Visual Percentage Stacked Bar */}
          <div className="w-full h-4 rounded-full overflow-hidden flex shadow-inner">
            <div style={{ width: `${staysPct}%` }} className="bg-[#c99a6b] transition-all" title={`Stays: ${staysPct}%`} />
            <div style={{ width: `${transportPct}%` }} className="bg-[#e4c29e] transition-all" title={`Transit: ${transportPct}%`} />
            <div style={{ width: `${foodPct}%` }} className="bg-amber-400 transition-all" title={`Food: ${foodPct}%`} />
            <div style={{ width: `${activitiesPct}%` }} className="bg-emerald-400 transition-all" title={`Activities: ${activitiesPct}%`} />
            <div style={{ width: `${bufferPct}%` }} className="bg-purple-400 transition-all" title={`Buffer: ${bufferPct}%`} />
          </div>

          {/* 5 Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* 1. Accommodations */}
            <div className="bg-[#0c0d10] border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Hotel className="w-3.5 h-3.5 text-[#c99a6b]" />
                  Stays ({staysPct}%)
                </span>
              </div>
              <p className="font-serif text-xl font-bold text-white">
                {sym}{stayAmount.toLocaleString()}
              </p>
              <p className="text-[10px] text-stone-400">Hotels, chalets &amp; homestays</p>
            </div>

            {/* 2. Transit */}
            <div className="bg-[#0c0d10] border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Plane className="w-3.5 h-3.5 text-[#e4c29e]" />
                  Transit ({transportPct}%)
                </span>
              </div>
              <p className="font-serif text-xl font-bold text-white">
                {sym}{transportAmount.toLocaleString()}
              </p>
              <p className="text-[10px] text-stone-400">Flights, trains, cabs &amp; ferries</p>
            </div>

            {/* 3. Food */}
            <div className="bg-[#0c0d10] border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Utensils className="w-3.5 h-3.5 text-amber-400" />
                  Food ({foodPct}%)
                </span>
              </div>
              <p className="font-serif text-xl font-bold text-white">
                {sym}{foodAmount.toLocaleString()}
              </p>
              <p className="text-[10px] text-stone-400">Dining, cafes, street eats</p>
            </div>

            {/* 4. Activities */}
            <div className="bg-[#0c0d10] border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                  Sights ({activitiesPct}%)
                </span>
              </div>
              <p className="font-serif text-xl font-bold text-white">
                {sym}{activitiesAmount.toLocaleString()}
              </p>
              <p className="text-[10px] text-stone-400">Passes, adventures &amp; tickets</p>
            </div>

            {/* 5. Buffer */}
            <div className="bg-[#0c0d10] border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  Cushion ({bufferPct}%)
                </span>
              </div>
              <p className="font-serif text-xl font-bold text-white">
                {sym}{bufferAmount.toLocaleString()}
              </p>
              <p className="text-[10px] text-stone-400">Emergency &amp; tips cushion</p>
            </div>

          </div>

        </div>

        {/* 4. Real-World Destination Feasibility Matcher */}
        <div className="bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 font-sans">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
              Destination Compatibility
            </span>
            <h2 className="font-serif text-2xl font-medium text-white tracking-tight mt-0.5">
              Where can you travel comfortably on this budget?
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">Real-world benchmark matching your {sym}{dailyPerPerson.toLocaleString()} / person / day allowance</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DESTINATION_BENCHMARKS.map((dest, idx) => {
              const reqDaily = selectedCurrency.code === 'INR' ? dest.minDailyINR : dest.minDailyUSD;
              const isAffordable = dailyPerPerson >= reqDaily;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                    isAffordable
                      ? 'bg-[#0c0d10] border-emerald-500/30 ring-1 ring-emerald-500/20'
                      : 'bg-[#0c0d10]/40 border-white/10 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        {dest.category}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isAffordable ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-stone-800 text-stone-400'
                      }`}>
                        {isAffordable ? '✓ Perfect Match' : 'Stretch Budget'}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-white">{dest.name}</h3>
                    <p className="text-xs text-stone-400">{dest.country} &bull; Min {sym}{reqDaily.toLocaleString()} / day</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone-400">{dest.tag}</span>
                    <Link
                      href={`/ai-planner?prompt=${encodeURIComponent(`I have ${sym}${totalBudget.toLocaleString()} and ${days} days for ${dest.name}`)}`}
                      className="font-bold text-[#e4c29e] hover:underline flex items-center gap-1"
                    >
                      Plan Route &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Group Expense Splitter & Fair Share Tool */}
        <div className="bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 font-sans">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
                Group Travel Finance
              </span>
              <h2 className="font-serif text-2xl font-medium text-white tracking-tight mt-0.5">
                Fair Share Companion Splitter
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">Track group expenses and auto-calculate who owes whom without awkward math</p>
            </div>

            <div className="bg-[#0c0d10] p-3 rounded-2xl border border-white/10 text-right">
              <span className="text-[10px] font-bold uppercase text-stone-400">Total Group Spend</span>
              <p className="font-serif text-xl font-bold text-emerald-400">
                {sym}{totalGroupExpense.toLocaleString()}
              </p>
              <span className="text-[10px] text-stone-400">{sym}{perPersonShare.toLocaleString()} / person share</span>
            </div>
          </div>

          {/* Add Expense Form */}
          <form onSubmit={handleAddGroupExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#0c0d10] p-4 rounded-2xl border border-white/10 items-end">
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Expense Title</label>
              <input
                type="text"
                placeholder="e.g. Rafting &amp; Paragliding Passes"
                value={newExpenseTitle}
                onChange={(e) => setNewExpenseTitle(e.target.value)}
                className="w-full bg-[#14151a] border border-white/15 rounded-full px-4 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#c99a6b]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Amount ({sym})</label>
              <input
                type="number"
                placeholder="0"
                value={newExpenseAmount}
                onChange={(e) => setNewExpenseAmount(e.target.value)}
                className="w-full bg-[#14151a] border border-white/15 rounded-full px-4 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#c99a6b]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Paid By</label>
              <select
                value={newExpensePayer}
                onChange={(e) => setNewExpensePayer(e.target.value)}
                className="w-full bg-[#14151a] border border-white/15 rounded-full px-4 py-2.5 text-xs text-white focus:outline-none"
              >
                {friendsList.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
            >
              + Add Bill
            </button>
          </form>

          {/* Group Expenses List */}
          <div className="space-y-2.5">
            {groupExpenses.map((exp) => (
              <div
                key={exp.id}
                className="bg-[#0c0d10] border border-white/10 rounded-xl p-3.5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#c99a6b]" />
                  <div>
                    <p className="font-bold text-white">{exp.title}</p>
                    <p className="text-[11px] text-stone-400">Paid by <strong className="text-stone-200">{exp.payer}</strong> for all 3 members</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-emerald-400 font-serif text-sm">
                    {sym}{exp.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleRemoveGroupExpense(exp.id)}
                    className="text-stone-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
