'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import confetti from 'canvas-confetti';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  ArrowRight,
  Sparkles,
  Users,
  MessageSquare,
  Shield,
  Clock,
  Luggage,
  CalendarDays,
  Send,
  Star,
  CheckCircle2,
  Share2,
  CheckSquare,
  Square,
  Calculator,
  Train,
  Check,
  Hotel,
  RefreshCw,
  Activity
} from 'lucide-react';

// Curated Group Expeditions Database
const CURATED_EXPEDITIONS = [
  {
    id: 'exp-1',
    title: 'Japan Golden Route & Alpine Ryokans',
    subtitle: 'Tokyo &bull; Hakone &bull; Kyoto &bull; Nara &bull; Osaka',
    duration: '12 Days / 11 Nights',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    organizer: {
      name: 'Kenji Takahashi',
      avatar: 'K',
      badge: 'Certified Master Guide &bull; 14 Yrs Exp',
      rating: 4.98,
      tripsLed: 42
    },
    capacity: '8 / 10 Booked',
    price: 3450,
    currency: 'USD',
    stops: ['Tokyo', 'Hakone Onsen', 'Kyoto Gion', 'Nara Deer Park', 'Osaka Dotonbori'],
    highlights: ['First-class JR Shinkansen bullet train passes included', 'Private traditional Kaiseki banquet in Gion', 'Forest thermal onsen stay with Mt. Fuji morning view'],
    category: 'Cultural Immersion',
    inclusions: [
      '7-Day JR Green Car (First Class) Shinkansen Pass',
      '11 Nights Luxury Boutique Lodging (including 2 Nights in Hakone Onsen Ryokan)',
      'Daily Artisan Breakfasts & 4 Michelin-recommended Gourmet Banquets',
      'All temple entry passes, private tea ceremony, and bullet train luggage forwarding',
      'English-speaking certified expedition leader & dedicated concierge'
    ],
    dailyPlan: [
      {
        day: 1,
        title: 'Arrival in Tokyo & Shinjuku Neon Night Walk',
        city: 'Tokyo',
        lodging: 'Cerulean Tower Tokyu Hotel (Shibuya)',
        activities: [
          { time: '14:00', title: 'Narita / Haneda VIP Express Transfer to Hotel', cost: 0, category: 'Transit' },
          { time: '18:30', title: 'Shinjuku Omoide Yokocho & Golden Gai Izakaya Food Crawl', cost: 65, category: 'Food & Dining' },
          { time: '21:00', title: 'Tokyo Metropolitan Government Building Night Skyline View', cost: 0, category: 'Sightseeing' }
        ]
      },
      {
        day: 2,
        title: 'Futuristic Tokyo & Digital Art Immersion',
        city: 'Tokyo',
        lodging: 'Cerulean Tower Tokyu Hotel (Shibuya)',
        activities: [
          { time: '09:00', title: 'Meiji Jingu Shinto Shrine & Harajuku Takeshita Street', cost: 0, category: 'Culture' },
          { time: '13:30', title: 'TeamLab Planets Immersive Digital Crystal Art Exhibit', cost: 36, category: 'Culture' },
          { time: '18:00', title: 'Shibuya Sky 360° Glass Rooftop Sunset Observatory', cost: 28, category: 'Sightseeing' }
        ]
      },
      {
        day: 3,
        title: 'Ancient Asakusa & Tsukiji Gastronomy',
        city: 'Tokyo',
        lodging: 'Cerulean Tower Tokyu Hotel (Shibuya)',
        activities: [
          { time: '08:30', title: 'Tsukiji Outer Fish Market Otoro Sashimi & Wagyu Safari', cost: 50, category: 'Food & Dining' },
          { time: '11:00', title: 'Senso-ji Temple & Nakamise Dori Traditional Artisan Stalls', cost: 0, category: 'Culture' },
          { time: '15:00', title: 'Sumida River Waterbus Cruise to Ginza Luxury District', cost: 22, category: 'Sightseeing' }
        ]
      },
      {
        day: 4,
        title: 'Scenic Romancecar to Hakone Thermal Springs',
        city: 'Hakone',
        lodging: 'Hakone Gora Byakudan Luxury Onsen Ryokan',
        activities: [
          { time: '09:30', title: 'Odakyu Romancecar First-Class Panorama Express to Hakone', cost: 28, category: 'Transit' },
          { time: '13:00', title: 'Lake Ashi Sightseeing Pirate Ship Cruise with Mt. Fuji Views', cost: 24, category: 'Nature' },
          { time: '18:00', title: '9-Course Seasonal Kaiseki Banquet & Forest Thermal Onsen Bath', cost: 0, category: 'Food & Dining' }
        ]
      },
      {
        day: 5,
        title: 'Owakudani Volcanic Valley & Open-Air Sculpture',
        city: 'Hakone',
        lodging: 'Hakone Gora Byakudan Luxury Onsen Ryokan',
        activities: [
          { time: '10:00', title: 'Hakone Ropeway Cable Car to Owakudani Active Volcanic Vents', cost: 18, category: 'Adventure' },
          { time: '14:00', title: 'Hakone Open-Air Museum & Picasso Pavilion Gardens', cost: 25, category: 'Culture' }
        ]
      },
      {
        day: 6,
        title: 'Shinkansen Bullet Train to Ancient Kyoto',
        city: 'Kyoto',
        lodging: 'Kyoto Gion Machiya Heritage Suites',
        activities: [
          { time: '10:00', title: 'Tokaido Shinkansen Green Car at 300 km/h to Kyoto Station', cost: 95, category: 'Transit' },
          { time: '14:00', title: 'Kiyomizu-dera Wooden Stage Temple Panoramic View', cost: 10, category: 'Culture' },
          { time: '17:30', title: 'Twilight Stroll through Hanamikoji Geisha Quarter', cost: 0, category: 'Culture' }
        ]
      },
      {
        day: 7,
        title: 'Fushimi Inari Torii Gates & Tea Ceremony',
        city: 'Kyoto',
        lodging: 'Kyoto Gion Machiya Heritage Suites',
        activities: [
          { time: '07:00', title: 'Fushimi Inari 10,000 Vermillion Torii Gates Sunrise Trek', cost: 0, category: 'Nature' },
          { time: '11:00', title: 'Arashiyama Bamboo Forest & Tenryu-ji Zen Rock Sanctuary', cost: 15, category: 'Nature' },
          { time: '15:30', title: 'Private Matcha Tea Ceremony with Master in 400-Year Temple', cost: 55, category: 'Culture' }
        ]
      },
      {
        day: 8,
        title: 'Golden Pavilion & Pontocho Riverside Dining',
        city: 'Kyoto',
        lodging: 'Kyoto Gion Machiya Heritage Suites',
        activities: [
          { time: '09:30', title: 'Kinkaku-ji Golden Pavilion Mirrored Lake Reflection', cost: 12, category: 'Culture' },
          { time: '14:00', title: 'Nishiki Food Market 100-Stall Culinary Tasting Tour', cost: 40, category: 'Food & Dining' },
          { time: '19:00', title: 'Pontocho Alley Riverbank Kamo Terrace Dinner', cost: 85, category: 'Food & Dining' }
        ]
      },
      {
        day: 9,
        title: 'Sacred Nara Deer Park & Giant Bronze Buddha',
        city: 'Nara',
        lodging: 'Kyoto Gion Machiya Heritage Suites',
        activities: [
          { time: '09:00', title: 'Kintetsu Limited Express Train to Nara', cost: 15, category: 'Transit' },
          { time: '10:30', title: 'Todai-ji Temple & Daibutsu Great Bronze Buddha', cost: 12, category: 'Culture' },
          { time: '14:00', title: 'Nara Deer Sanctuary Feeding & Kasuga Taisha Lanterns', cost: 5, category: 'Nature' }
        ]
      },
      {
        day: 10,
        title: 'Osaka Feudal Castle & Dotonbori Street Food',
        city: 'Osaka',
        lodging: 'Swissotel Nankai Osaka (Namba)',
        activities: [
          { time: '10:00', title: 'JR Rapid Hop from Kyoto to Osaka', cost: 12, category: 'Transit' },
          { time: '13:00', title: 'Osaka Castle Citadel & Nishinomaru Park Tour', cost: 18, category: 'Culture' },
          { time: '18:00', title: 'Dotonbori Neon Canal Takoyaki & Kushikatsu Crawl', cost: 45, category: 'Food & Dining' }
        ]
      },
      {
        day: 11,
        title: 'Shinsekai Nostalgia & Umeda Sky Views',
        city: 'Osaka',
        lodging: 'Swissotel Nankai Osaka (Namba)',
        activities: [
          { time: '11:00', title: 'Shinsekai Retro District & Tsutenkaku Tower Stroll', cost: 0, category: 'Sightseeing' },
          { time: '16:30', title: 'Umeda Sky Building Floating Garden Sunset Observatory', cost: 20, category: 'Sightseeing' },
          { time: '19:30', title: 'Farewell Gala Dinner at Michelin-Starred Teppanyaki Lounge', cost: 120, category: 'Food & Dining' }
        ]
      },
      {
        day: 12,
        title: 'Kansai Airport Departure & Sayonara Japan',
        city: 'Osaka',
        lodging: 'Departure',
        activities: [
          { time: '10:00', title: 'Haruka Airport Express First-Class Transfer to KIX Airport', cost: 0, category: 'Transit' }
        ]
      }
    ]
  },
  {
    id: 'exp-2',
    title: 'Swiss Alpine Glacier Express & Zermatt Chalets',
    subtitle: 'Zurich &bull; Lucerne &bull; Interlaken &bull; Zermatt &bull; Geneva',
    duration: '10 Days / 9 Nights',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    organizer: {
      name: 'Marcelle Dubois',
      avatar: 'M',
      badge: 'Swiss Alpine Federation Lead',
      rating: 4.95,
      tripsLed: 38
    },
    capacity: '6 / 8 Booked',
    price: 4200,
    currency: 'USD',
    stops: ['Zurich', 'Lucerne', 'Interlaken', 'Jungfraujoch', 'Zermatt (Matterhorn)'],
    highlights: ['Glacier Express panoramic carriage through Swiss Grand Canyon', 'Top of Europe Jungfraujoch 3,454m cogwheel railway', 'Luxury car-free chalet with direct Matterhorn views'],
    category: 'Alpine Luxury',
    inclusions: [
      'First-Class Swiss Travel Pass with panoramic seat reservations',
      '9 Nights in boutique Swiss alpine chalets & 5-star lakeside properties',
      'All mountain cogwheels, cable cars, and Jungfraujoch Top of Europe access',
      'Daily Swiss alpine breakfast buffets and artisanal cheese fondue banquets',
      'Dedicated Swiss mountain guide throughout the itinerary'
    ],
    dailyPlan: [
      {
        day: 1,
        title: 'Arrival in Zurich & Old Town Limmat River Walk',
        city: 'Zurich',
        lodging: 'Storchen Zurich (Historic Riverside)',
        activities: [
          { time: '14:00', title: 'Zurich Airport VIP SBB First-Class Transfer', cost: 0, category: 'Transit' },
          { time: '17:00', title: 'Altstadt Medieval Guild Houses & Lindenhof Hill Viewpoint', cost: 0, category: 'Culture' },
          { time: '19:30', title: 'Swiss Gastronomy Dinner with Zürcher Geschnetzeltes', cost: 75, category: 'Food & Dining' }
        ]
      },
      {
        day: 2,
        title: 'Lucerne Lake Steamboat & Chapel Bridge',
        city: 'Lucerne',
        lodging: 'Hotel des Balances Lucerne',
        activities: [
          { time: '09:00', title: 'SBB InterCity First-Class Train to Lucerne', cost: 25, category: 'Transit' },
          { time: '11:00', title: '14th-Century Covered Wooden Chapel Bridge & Water Tower', cost: 0, category: 'Sightseeing' },
          { time: '14:30', title: 'Historic Steamboat Cruise on Lake Lucerne', cost: 40, category: 'Nature' }
        ]
      },
      {
        day: 3,
        title: 'Mount Pilatus World Steepest Cogwheel Railway',
        city: 'Lucerne',
        lodging: 'Hotel des Balances Lucerne',
        activities: [
          { time: '09:30', title: 'Dragon Ride Aerial Cableway to Mount Pilatus Summit (2,128m)', cost: 78, category: 'Adventure' },
          { time: '14:00', title: 'World Steepest 48% Gradient Cogwheel Descent to Alpnachstad', cost: 0, category: 'Transit' }
        ]
      }
    ]
  },
  {
    id: 'exp-3',
    title: 'Italian Renaissance, Tuscan Hills & Amalfi Coast',
    subtitle: 'Rome &bull; Florence &bull; Siena &bull; Venice &bull; Positano',
    duration: '9 Days / 8 Nights',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    organizer: {
      name: 'Gianluca Rossi',
      avatar: 'G',
      badge: 'Italian Cultural Heritage Expert',
      rating: 4.97,
      tripsLed: 51
    },
    capacity: '10 / 12 Booked',
    price: 3890,
    currency: 'USD',
    stops: ['Rome', 'Florence', 'Siena Chianti', 'Venice Grand Canal', 'Positano Amalfi'],
    highlights: ['VIP early-access Vatican Sistine Chapel and Colosseum underground', 'Private Chianti vineyard estate wine tasting with sommelier', 'Private sunset wooden yacht cruise along Amalfi cliffs'],
    category: 'History & Gastronomy',
    inclusions: [
      'Frecciarossa 1000 Executive/Business class high-speed rail passes',
      '8 Nights in luxury historic Renaissance palazzos & cliffside Amalfi villas',
      'All VIP skip-the-line museum admissions (Uffizi, Vatican, Colosseum, Doge Palace)',
      'Daily Italian breakfasts, Chianti vineyard lunch, and Amalfi seafood dinners'
    ]
  }
];

function TravelerDashboardContent() {
  const searchParams = useSearchParams();

  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  // Selected Expedition for Details Modal
  const [selectedExpedition, setSelectedExpedition] = useState<any>(null);
  const [modalTab, setModalTab] = useState<'itinerary' | 'inclusions' | 'stops'>('itinerary');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [clonedSuccess, setClonedSuccess] = useState(false);

  // Smart Pre-Trip Packing Checklist state
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Passport & Visa Documentation valid for 6+ months', done: true },
    { id: 2, text: 'International eSIM / Roaming Data activated', done: true },
    { id: 3, text: 'Universal Power Adapter & Portable Power Bank', done: false },
    { id: 4, text: 'Multi-Currency Travel Card & Local Cash Backup', done: false },
    { id: 5, text: 'Travel Medical Insurance & Emergency Policy Copy', done: true },
  ]);
  const [newChecklistText, setNewChecklistText] = useState('');

  const loadTravelerData = useCallback(async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) setLoading(true);
    setIsSyncing(true);

    try {
      let currentUserId = 1;
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          setUser(u);
          if (u.id) currentUserId = u.id;
        } catch (e) {}
      }

      const token = localStorage.getItem('token');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const [tripsRes, destsRes] = await Promise.all([
        fetch(`/api/trips?userId=${currentUserId}`, { headers, cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/destinations?limit=6', { cache: 'no-store' }).then((r) => r.json()),
      ]);

      if (tripsRes.success) setTrips(tripsRes.data || []);
      if (destsRes.success) setDestinations(destsRes.data || []);
      setLastSyncTime(new Date());
    } catch (err) {
      console.error('Error loading traveler data:', err);
    } finally {
      if (showLoadingSpinner) setLoading(false);
      setIsSyncing(false);
    }
  }, []);

  // Initial mount + Dynamic Real-Time Refresh Polling & Window Focus Events
  useEffect(() => {
    loadTravelerData(true);

    // Dynamic background polling every 10 seconds
    const interval = setInterval(() => {
      loadTravelerData(false);
    }, 10000);

    // Refresh immediately when window regain focus
    const handleFocus = () => {
      loadTravelerData(false);
    };

    // Refresh when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadTravelerData(false);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadTravelerData]);

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

  const handleCloneExpedition = async (exp: any) => {
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: exp.title,
          description: `Group expedition led by ${exp.organizer.name}. ${exp.highlights.join('. ')}`,
          startDate: '2026-09-15',
          endDate: '2026-09-27',
          totalBudget: exp.price,
          currency: exp.currency,
          coverImageUrl: exp.image,
          isPublic: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        setClonedSuccess(true);
        if (data.data) {
          setTrips([data.data, ...trips]);
        }
        setTimeout(() => {
          setClonedSuccess(false);
          setSelectedExpedition(null);
        }, 2000);
      }
    } catch (e) {
      console.error('Error cloning trip:', e);
    }
  };

  const totalTrips = trips.length;
  const totalBudgetPlanned = trips.reduce((acc, t) => acc + parseFloat(t.total_budget || 0), 0);
  const totalStops = trips.reduce((acc, t) => acc + (t.total_stops || 0), 0);
  const checklistDoneCount = checklist.filter((c) => c.done).length;

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-[#0c0d10]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
        
        {/* ================= 1. TRAVELER ATELIER HERO BANNER ================= */}
        <div className="relative rounded-[32px] overflow-hidden bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#c99a6b]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#e4c29e] text-[11px] font-sans font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
                  <span>Personal Traveler Atelier &bull; Executive Portal</span>
                </div>

                {/* Real-Time Live Sync Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Sync</span>
                </div>
              </div>
              
              <h1 className="font-serif text-3xl sm:text-5xl font-medium text-white tracking-tight leading-tight">
                Welcome, <span className="font-bold italic text-[#e4c29e]">{user?.name || 'Explorer'}.</span>
              </h1>
              
              <p className="font-serif text-base text-stone-300 mt-2 max-w-xl leading-relaxed">
                Compose multi-city timelines, join curated group expeditions led by verified tour organizers, and monitor daily allowances in real-time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-sans">
              <button
                onClick={() => loadTravelerData(false)}
                disabled={isSyncing}
                title="Force refresh latest data"
                className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-2xl bg-[#0c0d10] hover:bg-white/10 text-stone-300 hover:text-white text-xs font-bold border border-white/15 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#c99a6b]' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Live'}</span>
              </button>

              <Link
                href="/trips/new"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold shadow-xl shadow-[#c99a6b]/20 hover:shadow-[#c99a6b]/35 hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Plan New Journey</span>
              </Link>
              
              <Link
                href="/expeditions"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#0c0d10] hover:bg-[#1a1b22] text-stone-200 hover:text-white text-xs font-bold border border-white/15 transition-all"
              >
                <Compass className="w-4 h-4 text-[#c99a6b]" />
                <span>Explore Expeditions</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ================= 2. TRAVEL KPI TILES ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#14151a]/90 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-[#c99a6b]/40 transition-all">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b] block">My Itineraries</span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2">{totalTrips}</p>
            <span className="text-[10px] text-stone-400 font-sans mt-1 inline-block">Personal portfolio</span>
          </div>

          <div className="bg-[#14151a]/90 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-[#c99a6b]/40 transition-all">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b] block">Total Stops</span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#e4c29e] mt-2">{totalStops}</p>
            <span className="text-[10px] text-stone-400 font-sans mt-1 inline-block">Across world cities</span>
          </div>

          <div className="bg-[#14151a]/90 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-[#c99a6b]/40 transition-all">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b] block">Planned Budget</span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#e4c29e] mt-2">
              ${totalBudgetPlanned.toLocaleString()}
            </p>
            <span className="text-[10px] text-stone-400 font-sans mt-1 inline-block">Calculated allowance</span>
          </div>

          <div className="bg-[#14151a]/90 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-[#c99a6b]/40 transition-all">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b] block">Checklist Ready</span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2">
              {checklistDoneCount}/{checklist.length} <span className="font-sans text-lg font-normal text-stone-400">Done</span>
            </p>
            <span className="text-[10px] text-stone-400 font-sans mt-1 inline-block">Pre-departure essentials</span>
          </div>

        </div>

        {/* ================= 3. FOUR DEDICATED PORTALS JUMP CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
          
          <Link
            href="/trips"
            className="p-6 rounded-[28px] bg-[#14151a]/90 border border-white/10 hover:border-[#c99a6b]/50 transition-all shadow-xl group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#c99a6b]/15 text-[#e4c29e] flex items-center justify-center">
                <Luggage className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#e4c29e] transition-colors">
                Itineraries Portfolio
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Manage, search, sort, and edit your custom multi-city route plans.
              </p>
            </div>
          </Link>

          <Link
            href="/expeditions"
            className="p-6 rounded-[28px] bg-[#14151a]/90 border border-white/10 hover:border-[#c99a6b]/50 transition-all shadow-xl group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#c99a6b]/15 text-[#e4c29e] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#e4c29e] transition-colors">
                Group Expeditions
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Explore day-by-day itineraries curated by certified tour leaders.
              </p>
            </div>
          </Link>

          <Link
            href="/community"
            className="p-6 rounded-[28px] bg-[#14151a]/90 border border-white/10 hover:border-[#c99a6b]/50 transition-all shadow-xl group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#c99a6b]/15 text-[#e4c29e] flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#e4c29e] transition-colors">
                Traveler Community
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Ask tour guides, discuss routes, and join active traveler discussions.
              </p>
            </div>
          </Link>

          <Link
            href="/concierge"
            className="p-6 rounded-[28px] bg-[#14151a]/90 border border-white/10 hover:border-[#c99a6b]/50 transition-all shadow-xl group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#c99a6b]/15 text-[#e4c29e] flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#e4c29e] transition-colors">
                Smart Concierge
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Live currency conversions, packing tools, and airport VIP lounge tips.
              </p>
            </div>
          </Link>

        </div>

        {/* ================= 4. MY ACTIVE ITINERARIES PORTFOLIO ================= */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b]">Portfolio Overview</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight">
                My Composed Itineraries
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/trips"
                className="text-xs font-bold text-[#e4c29e] hover:text-white transition-colors"
              >
                View All Portfolios &rarr;
              </Link>
              
              <Link
                href="/trips/new"
                className="px-4 py-2 rounded-full bg-[#c99a6b] hover:bg-[#dfb182] text-[#0c0d10] text-xs font-bold transition-all"
              >
                + New Itinerary
              </Link>
            </div>
          </div>

          {trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
              {trips.slice(0, 3).map((trip) => (
                <div
                  key={trip.id}
                  className="group bg-[#14151a]/95 border border-white/10 hover:border-[#c99a6b]/50 rounded-[32px] overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="p-6 sm:p-7 space-y-4">
                    
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#c99a6b]/15 border border-[#c99a6b]/30 text-[#e4c29e] text-[10px] font-sans font-bold uppercase tracking-wider">
                        {trip.status || 'Active Plan'}
                      </span>

                      <span className="text-[11px] font-mono text-stone-400">
                        {trip.stops?.length || trip.total_stops || 0} Stops
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#e4c29e] transition-colors line-clamp-1">
                        {trip.title}
                      </h3>
                      <p className="text-xs font-sans text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                        {trip.description || 'Custom multi-city timeline with assigned lodging and activities.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0c0d10] border border-white/10 space-y-2 font-sans">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-400">Dates</span>
                        <span className="text-white font-medium">
                          {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} &rarr; {new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-400">Total Budget</span>
                        <span className="text-[#e4c29e] font-bold">
                          ${parseFloat(trip.total_budget || 0).toLocaleString()} {trip.currency || 'USD'}
                        </span>
                      </div>
                    </div>

                  </div>

                  <div className="px-6 sm:px-7 py-4 border-t border-white/10 bg-[#0c0d10]/60 flex items-center justify-between font-sans">
                    <Link
                      href={`/trips/${trip.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e4c29e] hover:text-white transition-colors"
                    >
                      <span>Open Itinerary Atelier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/trips/share/${trip.share_code || 'public'}`}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
                      title="Share Route Code"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[32px] bg-[#14151a]/95 border border-white/10 p-10 text-center shadow-xl space-y-4">
              <Compass className="w-12 h-12 text-[#c99a6b] mx-auto" />
              <h3 className="font-serif text-2xl font-medium text-white">No custom journeys created yet</h3>
              <p className="font-serif text-sm text-stone-400 max-w-md mx-auto">
                Start composing your first multi-city adventure with bespoke destinations, daily allowance balancing, and activity scheduling.
              </p>
              <div className="pt-2">
                <Link
                  href="/trips/new"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] font-sans font-bold text-xs shadow-lg shadow-[#c99a6b]/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Plan Your First Journey</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ================= 5. TWO-COLUMN WORKSPACE: EXPEDITIONS SPOTLIGHT & PACKING ESSENTIALS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Featured Expeditions Spotlight (7 Cols) */}
          <div className="lg:col-span-7 bg-[#14151a]/95 border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b]">Curated Tours</span>
                <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                  Featured Group Expeditions
                </h3>
              </div>

              <Link
                href="/expeditions"
                className="text-xs font-bold text-[#e4c29e] hover:underline"
              >
                View All Expeditions &rarr;
              </Link>
            </div>

            <div className="space-y-4 font-sans">
              {CURATED_EXPEDITIONS.slice(0, 2).map((exp) => (
                <div
                  key={exp.id}
                  className="bg-[#0c0d10] border border-white/10 hover:border-[#c99a6b]/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-[#e4c29e] uppercase">{exp.category} &bull; {exp.duration}</span>
                      <h4 className="font-serif text-base font-bold text-white mt-0.5 line-clamp-1">{exp.title}</h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">Led by {exp.organizer.name} &bull; ⭐ {exp.organizer.rating}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                    <button
                      onClick={() => setSelectedExpedition(exp)}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 text-xs font-bold border border-white/10 cursor-pointer"
                    >
                      View Stops
                    </button>

                    <button
                      onClick={() => handleCloneExpedition(exp)}
                      className="px-4 py-2 rounded-xl bg-[#c99a6b] hover:bg-[#dfb182] text-[#0c0d10] text-xs font-bold shadow-md cursor-pointer"
                    >
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Departure Packing Checklist (5 Cols) */}
          <div className="lg:col-span-5 bg-[#14151a]/95 border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-5 font-sans">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b]">Travel Readiness</span>
                <h3 className="font-serif text-xl font-bold text-white mt-0.5 flex items-center gap-2">
                  <Luggage className="w-4 h-4 text-[#c99a6b]" />
                  Packing Checklist
                </h3>
              </div>

              <span className="text-xs font-bold text-[#e4c29e]">
                {Math.round((checklistDoneCount / checklist.length) * 100)}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] h-full transition-all duration-500"
                style={{ width: `${(checklistDoneCount / checklist.length) * 100}%` }}
              />
            </div>

            {/* Checklist Items */}
            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 cursor-pointer ${
                    item.done
                      ? 'bg-[#0c0d10]/40 border-white/5 text-stone-500'
                      : 'bg-[#0c0d10] border-white/10 text-stone-200 hover:border-[#c99a6b]/40'
                  }`}
                >
                  {item.done ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-stone-500 flex-shrink-0" />
                  )}
                  <span className={`text-xs ${item.done ? 'line-through text-stone-500' : 'text-stone-200'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Custom Item */}
            <form onSubmit={handleAddChecklistItem} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add packing item..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                className="flex-1 bg-[#0c0d10] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#c99a6b] hover:text-[#0c0d10] text-stone-200 text-xs font-bold transition-all cursor-pointer"
              >
                Add
              </button>
            </form>
          </div>

        </div>

        {/* ================= COMPREHENSIVE EXPEDITION ITINERARY MODAL ================= */}
        {selectedExpedition && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4">
            <div className="bg-[#14151a] border border-white/15 rounded-[32px] max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in max-h-[90vh] overflow-y-auto font-sans">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#c99a6b]">{selectedExpedition.category}</span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-0.5">{selectedExpedition.title}</h3>
                  <p className="text-xs text-stone-400 font-sans mt-0.5">
                    {selectedExpedition.duration} &bull; Led by {selectedExpedition.organizer.name} ({selectedExpedition.organizer.badge})
                  </p>
                </div>

                <button
                  onClick={() => setSelectedExpedition(null)}
                  className="p-2 rounded-xl bg-white/5 text-stone-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* 3 Modal Tabs */}
              <div className="flex items-center gap-2 bg-[#0c0d10] p-1.5 rounded-2xl border border-white/10 text-xs">
                <button
                  onClick={() => setModalTab('itinerary')}
                  className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    modalTab === 'itinerary'
                      ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Day-by-Day Full Itinerary ({selectedExpedition.dailyPlan?.length || 0} Days)</span>
                </button>

                <button
                  onClick={() => setModalTab('inclusions')}
                  className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    modalTab === 'inclusions'
                      ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Inclusions &amp; Lodging</span>
                </button>

                <button
                  onClick={() => setModalTab('stops')}
                  className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    modalTab === 'stops'
                      ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Route Map</span>
                </button>
              </div>

              {/* TAB 1: DAY-BY-DAY EXPANDABLE ITINERARY */}
              {modalTab === 'itinerary' && selectedExpedition.dailyPlan && (
                <div className="space-y-4">
                  {/* Day Pills Bar */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5">
                    {selectedExpedition.dailyPlan.map((plan: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedDayIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          selectedDayIndex === idx
                            ? 'bg-[#c99a6b] text-[#0c0d10] shadow-sm'
                            : 'bg-[#0c0d10] text-stone-400 hover:text-white border border-white/5'
                        }`}
                      >
                        Day {plan.day} ({plan.city})
                      </button>
                    ))}
                  </div>

                  {/* Selected Day View Card */}
                  {(() => {
                    const currentPlan = selectedExpedition.dailyPlan[selectedDayIndex] || selectedExpedition.dailyPlan[0];
                    return (
                      <div className="p-5 rounded-2xl bg-[#0c0d10] border border-[#c99a6b]/30 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#c99a6b]">Day {currentPlan.day} &bull; {currentPlan.city}</span>
                            <h4 className="font-serif text-xl font-bold text-white mt-0.5">{currentPlan.title}</h4>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-stone-300">
                            <Hotel className="w-4 h-4 text-[#c99a6b]" />
                            <span className="truncate max-w-[200px]">{currentPlan.lodging}</span>
                          </div>
                        </div>

                        {/* Activities List */}
                        <div className="space-y-2.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Scheduled Experiences:</span>
                          {currentPlan.activities?.map((act: any, i: number) => (
                            <div key={i} className="p-3.5 rounded-xl bg-[#14151a] border border-white/10 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-[#c99a6b]/15 text-[#e4c29e] text-xs font-bold font-mono">
                                  {act.time}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-white font-serif">{act.title}</p>
                                  <span className="text-[10px] text-[#e4c29e]">{act.category}</span>
                                </div>
                              </div>

                              <span className="font-serif text-xs font-bold text-emerald-400">
                                {act.cost === 0 ? 'Included' : `$${act.cost}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 2: INCLUSIONS & LODGING */}
              {modalTab === 'inclusions' && selectedExpedition.inclusions && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-300">Everything Included in this Expedition:</span>
                  <div className="space-y-2">
                    {selectedExpedition.inclusions.map((item: string, i: number) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-[#0c0d10] border border-white/10 flex items-center gap-3 text-xs text-stone-200">
                        <Check className="w-4 h-4 text-[#c99a6b] flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ROUTE MAP */}
              {modalTab === 'stops' && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-300">Scheduled Multi-City Sequence:</span>
                  {selectedExpedition.stops.map((stop: string, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-[#0c0d10] border border-white/10 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#c99a6b]/20 text-[#e4c29e] font-serif font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <span className="text-xs font-bold text-white">{stop}</span>
                    </div>
                  ))}
                </div>
              )}

              {clonedSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Expedition cloned into your private itineraries portfolio!</span>
                </div>
              )}

              {/* Action Bar */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-stone-400 font-semibold block">All-Inclusive Price</span>
                  <span className="font-serif text-2xl font-bold text-[#e4c29e]">
                    ${selectedExpedition.price.toLocaleString()} <span className="font-sans text-xs text-stone-400">/ person</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedExpedition(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-bold cursor-pointer"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => handleCloneExpedition(selectedExpedition)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold shadow-lg shadow-[#c99a6b]/20 cursor-pointer"
                  >
                    Clone into My Itineraries
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default function TravelerDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0c0d10] text-stone-100 flex items-center justify-center font-sans">
        <div className="w-10 h-10 rounded-full border-2 border-[#c99a6b] border-t-transparent animate-spin" />
      </div>
    }>
      <TravelerDashboardContent />
    </Suspense>
  );
}
