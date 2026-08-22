'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Bookmark, 
  Luggage, 
  CheckSquare, 
  Square,
  Users,
  MessageSquare,
  Globe2,
  Share2,
  Flame,
  Shield,
  Star,
  Send,
  HelpCircle,
  TrendingUp,
  Receipt,
  Calculator,
  CloudSun,
  AlertCircle,
  Award,
  Check,
  Search
} from 'lucide-react';

// Industry-Grade Curated Expeditions Dataset
const CURATED_EXPEDITIONS = [
  {
    id: 'exp-1',
    title: 'Alpine Glacier Express & Grand Swiss Peaks',
    subtitle: 'Zurich &bull; Lucerne &bull; Interlaken &bull; Zermatt',
    duration: '10 Days / 9 Nights',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    organizer: {
      name: 'Marcus Vance',
      avatar: 'M',
      badge: 'Certified Alpine Master',
      rating: 4.9,
      tripsLed: 42
    },
    capacity: '9 / 12 Booked',
    price: 2850,
    currency: 'USD',
    stops: ['Zurich', 'Lucerne', 'Interlaken', 'Zermatt (Matterhorn)'],
    highlights: ['First-class Glacier Express scenic train', 'Jungfraujoch Top of Europe ascent', 'Zermatt Fondue masterclass'],
    category: 'Alpine Adventure'
  },
  {
    id: 'exp-2',
    title: 'Kyoto Tea Sanctuary & Tokyo Neon Odyssey',
    subtitle: 'Tokyo &bull; Hakone &bull; Kyoto &bull; Nara',
    duration: '12 Days / 11 Nights',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    organizer: {
      name: 'Kenjiro Sato',
      avatar: 'K',
      badge: 'Historic Kyoto Curator',
      rating: 5.0,
      tripsLed: 58
    },
    capacity: '10 / 14 Booked',
    price: 3400,
    currency: 'USD',
    stops: ['Tokyo (Shinjuku)', 'Hakone (Mt Fuji View)', 'Kyoto (Gion)', 'Nara Deer Park'],
    highlights: ['Private tea ceremony in 400-year-old temple', 'Shinkansen bullet train speed pass', 'Michelin-starred Kaiseki dining'],
    category: 'Culture & Gastronomy'
  },
  {
    id: 'exp-3',
    title: 'Amalfi Cliffside & Tuscan Vineyard Safari',
    subtitle: 'Rome &bull; Florence &bull; Siena &bull; Positano',
    duration: '9 Days / 8 Nights',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    organizer: {
      name: 'Sofia Rossi',
      avatar: 'S',
      badge: 'Italian Heritage Specialist',
      rating: 4.95,
      tripsLed: 37
    },
    capacity: '7 / 10 Booked',
    price: 2600,
    currency: 'USD',
    stops: ['Rome', 'Florence', 'Siena', 'Positano (Amalfi)'],
    highlights: ['Chianti private estate wine tasting', 'Sunset yacht cruise past Capri Faraglioni', 'Skip-the-line Uffizi Gallery tour'],
    category: 'Coastal Luxury'
  },
  {
    id: 'exp-4',
    title: 'Icelandic Ring Road & Aurora Borealis Hunt',
    subtitle: 'Reykjavik &bull; Vik &bull; Akureyri &bull; Blue Lagoon',
    duration: '8 Days / 7 Nights',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80',
    organizer: {
      name: 'Astrid Lind',
      avatar: 'A',
      badge: 'Arctic Expedition Lead',
      rating: 4.88,
      tripsLed: 29
    },
    capacity: '11 / 12 Booked',
    price: 3150,
    currency: 'USD',
    stops: ['Reykjavik', 'Vik Black Sand Beach', 'Jokulsarlon Glacier', 'Akureyri'],
    highlights: ['Superjeep glacier ice cave exploration', 'Nightly Northern Lights tracking', 'Geo-thermal mineral soak at Blue Lagoon'],
    category: 'Arctic & Aurora'
  }
];

// Initial Community Discussions
const INITIAL_COMMUNITY_POSTS = [
  {
    id: 'post-1',
    author: 'Elena Rostova',
    role: 'Traveler',
    avatar: 'E',
    time: '2 hours ago',
    title: 'Best rail pass strategy for Zurich to Zermatt multi-city leg?',
    content: 'We are planning a 7-day multi-city trip across Switzerland. Does the Swiss Travel Pass cover the cable cars up to the Matterhorn Glacier Paradise or just up to Zermatt village?',
    tags: ['Switzerland', 'Trains', 'Budget'],
    upvotes: 14,
    repliesCount: 3,
    replies: [
      {
        author: 'Marcus Vance',
        isOrganizer: true,
        badge: 'Expedition Organizer',
        text: 'The Swiss Travel Pass covers 100% of the train from Zurich to Zermatt, and gives you a 50% discount on the Matterhorn Glacier Paradise cable car! Feel free to clone our Alpine route.'
      }
    ]
  },
  {
    id: 'post-2',
    author: 'David Chen',
    role: 'Traveler',
    avatar: 'D',
    time: '5 hours ago',
    title: 'Pocket Wi-Fi vs e-SIM for high-speed train travel in Japan?',
    content: 'Traveling with 2 friends between Tokyo, Kyoto, and Osaka. Is Ubigi/Airalo eSIM fast enough on the Shinkansen, or is a dedicated pocket router better for multi-device connectivity?',
    tags: ['Japan', 'Tech & Connectivity'],
    upvotes: 21,
    repliesCount: 2,
    replies: [
      {
        author: 'Kenjiro Sato',
        isOrganizer: true,
        badge: 'Expedition Organizer',
        text: 'eSIM works flawlessly on 5G across all Shinkansen routes. Airalo and Ubigi connect to NTT Docomo with zero dropouts in the tunnels!'
      }
    ]
  }
];

function TravelerDashboardContent() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [savedDestinations, setSavedDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tab State
  const initialTab = (searchParams.get('tab') as any) || 'journeys';
  const [activeTab, setActiveTab] = useState<'journeys' | 'expeditions' | 'community' | 'concierge'>(
    ['journeys', 'expeditions', 'community', 'concierge'].includes(initialTab) ? initialTab : 'journeys'
  );

  // Synchronize Tab with URL query params
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['journeys', 'expeditions', 'community', 'concierge'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'journeys' | 'expeditions' | 'community' | 'concierge') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState(null, '', url.toString());
    }
  };

  // Selected Expedition Modal State
  const [selectedExpedition, setSelectedExpedition] = useState<any>(null);
  const [clonedSuccess, setClonedSuccess] = useState(false);

  // Community State
  const [posts, setPosts] = useState<any[]>(INITIAL_COMMUNITY_POSTS);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  // Concierge Currency Converter State
  const [calcAmount, setCalcAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [calcResult, setCalcResult] = useState<number | null>(null);

  // Interactive Checklist State
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Renew International Passport & verify 6-month validity', done: true },
    { id: 2, text: 'Confirm international flight & high-speed rail reservations', done: true },
    { id: 3, text: 'Purchase universal power adapter & eSIM global data bundle', done: false },
    { id: 4, text: 'Notify credit card provider of international travel dates', done: false },
    { id: 5, text: 'Pack weather-appropriate footwear & alpine rain gear', done: false },
  ]);
  const [newChecklistText, setNewChecklistText] = useState('');

  useEffect(() => {
    let currentUserId = 1;
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setUser(u);
        if (u.id) currentUserId = u.id;
      } catch (e) {}
    }

    async function loadTravelerData() {
      try {
        const token = localStorage.getItem('token');
        const headers: any = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const [tripsRes, destsRes, savedRes] = await Promise.all([
          fetch(`/api/trips?userId=${currentUserId}`, { headers }).then((r) => r.json()),
          fetch('/api/destinations?limit=6').then((r) => r.json()),
          fetch(`/api/user/saved-destinations?userId=${currentUserId}`).then((r) => r.json()),
        ]);

        if (tripsRes.success) setTrips(tripsRes.data || []);
        if (destsRes.success) setDestinations(destsRes.data || []);
        if (savedRes.success) setSavedDestinations(savedRes.data || []);
      } catch (err) {
        console.error('Error loading traveler data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTravelerData();
  }, []);

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

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost = {
      id: `post-${Date.now()}`,
      author: user?.name || 'Explorer',
      role: 'Traveler',
      avatar: (user?.name || 'E')[0].toUpperCase(),
      time: 'Just now',
      title: newPostTitle,
      content: newPostContent,
      tags: ['Travel Advice', 'Expedition'],
      upvotes: 1,
      repliesCount: 0,
      replies: []
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setShowNewPostModal(false);
  };

  const handleCloneExpedition = async (exp: any) => {
    try {
      const token = localStorage.getItem('token');
      const userId = user?.id || 1;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/trips', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userId,
          title: `${exp.title} (Cloned)`,
          description: `Curated group itinerary led by ${exp.organizer.name}. Includes ${exp.stops.join(' -> ')}.`,
          startDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          endDate: new Date(Date.now() + 24 * 86400000).toISOString().split('T')[0],
          totalBudget: exp.price,
          currency: exp.currency,
          visibility: 'private',
        }),
      });

      const data = await res.json();
      if (data.success) {
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        
        {/* ================= 1. TRAVELER ATELIER HERO BANNER ================= */}
        <div className="relative rounded-[32px] overflow-hidden bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#c99a6b]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#e4c29e] text-[11px] font-sans font-medium mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
                <span>Personal Traveler Atelier &bull; Private Portfolio</span>
              </div>
              
              <h1 className="font-serif text-3xl sm:text-5xl font-medium text-white tracking-tight leading-tight">
                Welcome, <span className="font-bold italic text-[#e4c29e]">{user?.name || 'Explorer'}.</span>
              </h1>
              
              <p className="font-serif text-base text-stone-300 mt-2 max-w-xl leading-relaxed">
                Compose multi-city timelines, join curated group expeditions led by verified tour organizers, and monitor daily allowances in real-time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-sans">
              <Link
                href="/trips/new"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold shadow-xl shadow-[#c99a6b]/20 hover:shadow-[#c99a6b]/35 hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Plan New Journey</span>
              </Link>
              
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#0c0d10] hover:bg-[#1a1b22] text-stone-200 hover:text-white text-xs font-bold border border-white/15 transition-all"
              >
                <Compass className="w-4 h-4 text-[#c99a6b]" />
                <span>Explore Catalog</span>
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

        {/* ================= 3. FOUR INDUSTRY-GRADE TABS ================= */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-sans overflow-x-auto">
          
          <button
            onClick={() => handleTabChange('journeys')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'journeys'
                ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-md shadow-[#c99a6b]/20'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Luggage className="w-3.5 h-3.5" />
            <span>My Custom Itineraries ({trips.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('expeditions')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'expeditions'
                ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-md shadow-[#c99a6b]/20'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Group Expeditions ({CURATED_EXPEDITIONS.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('community')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'community'
                ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-md shadow-[#c99a6b]/20'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Traveler ↔ Organizer Community</span>
          </button>

          <button
            onClick={() => handleTabChange('concierge')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'concierge'
                ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-md shadow-[#c99a6b]/20'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Smart Concierge &amp; Utilities</span>
          </button>

        </div>

        {/* ================= TAB 1: MY CUSTOM ITINERARIES ================= */}
        {activeTab === 'journeys' && (
          <div className="space-y-6">
            
            {trips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
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
              <div className="rounded-[32px] bg-[#14151a]/95 border border-white/10 p-12 text-center shadow-xl space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#c99a6b]/10 border border-[#c99a6b]/30 text-[#e4c29e] flex items-center justify-center mx-auto text-2xl">
                  <Compass className="w-8 h-8" />
                </div>
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
        )}

        {/* ================= TAB 2: CURATED GROUP EXPEDITIONS ================= */}
        {activeTab === 'expeditions' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight">
                  Curated Multi-City <span className="font-bold italic text-[#e4c29e]">Group Expeditions</span>
                </h2>
                <p className="font-sans text-xs text-stone-400 mt-0.5">
                  Hand-crafted multi-destination routes designed and led by certified expedition organizers.
                </p>
              </div>

              <span className="text-[11px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#c99a6b]/15 text-[#e4c29e] border border-[#c99a6b]/30 self-start sm:self-auto">
                ★ 100% Guaranteed Departures
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CURATED_EXPEDITIONS.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-[#14151a]/95 border border-white/10 hover:border-[#c99a6b]/50 rounded-[32px] overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Expedition Cover Image */}
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14151a] via-[#14151a]/40 to-transparent" />

                    {/* Category & Duration Tag */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#0c0d10]/90 backdrop-blur-md border border-white/15 text-[#e4c29e] text-[10px] font-sans font-bold uppercase tracking-wider">
                        {exp.category}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#0c0d10]/90 backdrop-blur-md border border-white/15 text-stone-300 text-[10px] font-sans font-medium">
                        {exp.duration}
                      </span>
                    </div>

                    {/* Capacity Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[10px] font-sans font-bold">
                        ● {exp.capacity}
                      </span>
                    </div>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-3 left-6 right-6">
                      <h3 className="font-serif text-2xl font-bold text-white leading-snug drop-shadow-md">
                        {exp.title}
                      </h3>
                      <p className="text-xs font-sans text-stone-300 mt-0.5">{exp.subtitle}</p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 space-y-5">
                    
                    {/* Organizer Profile Card */}
                    <div className="p-3.5 rounded-2xl bg-[#0c0d10] border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] font-serif font-bold flex items-center justify-center text-sm shadow-md">
                          {exp.organizer.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white font-sans">{exp.organizer.name}</p>
                          <p className="text-[11px] text-[#e4c29e] font-sans">{exp.organizer.badge}</p>
                        </div>
                      </div>

                      <div className="text-right font-sans">
                        <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1 justify-end">
                          ★ {exp.organizer.rating}
                        </span>
                        <span className="text-[10px] text-stone-400">{exp.organizer.tripsLed} Tours Led</span>
                      </div>
                    </div>

                    {/* Highlights List */}
                    <div className="space-y-1.5 font-sans">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 block mb-1">Expedition Highlights:</span>
                      {exp.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-stone-300">
                          <Check className="w-3.5 h-3.5 text-[#c99a6b] flex-shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Action Bar */}
                  <div className="px-6 sm:px-7 py-5 border-t border-white/10 bg-[#0c0d10]/70 flex items-center justify-between font-sans">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">All-Inclusive Price</span>
                      <p className="font-serif text-2xl font-bold text-[#e4c29e]">
                        ${exp.price.toLocaleString()} <span className="font-sans text-xs font-normal text-stone-400">/ traveler</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedExpedition(exp)}
                        className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-stone-200 hover:text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
                      >
                        View Stops
                      </button>

                      <button
                        onClick={() => handleCloneExpedition(exp)}
                        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold shadow-lg shadow-[#c99a6b]/20 transition-all cursor-pointer"
                      >
                        Clone &amp; Join
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================= TAB 3: TRAVELER ↔ ORGANIZER COMMUNITY ================= */}
        {activeTab === 'community' && (
          <div className="space-y-6">
            
            <div className="bg-[#14151a]/95 border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight">
                  Traveler &amp; Tour Guide <span className="font-bold italic text-[#e4c29e]">Community Lounge</span>
                </h2>
                <p className="font-sans text-xs sm:text-sm text-stone-400 mt-1">
                  Connect with experienced expedition organizers, ask questions about destinations, and share route advice.
                </p>
              </div>

              <button
                onClick={() => setShowNewPostModal(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] font-sans font-bold text-xs shadow-lg shadow-[#c99a6b]/20 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Ask Tour Guides</span>
              </button>
            </div>

            {/* Community Threads Feed */}
            <div className="space-y-4 font-sans">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-[#14151a]/90 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4 hover:border-white/20 transition-all"
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#0c0d10] border border-white/15 text-[#e4c29e] font-serif font-bold flex items-center justify-center text-sm">
                        {post.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white">{post.author}</p>
                          <span className="text-[10px] text-stone-400">&bull; {post.time}</span>
                        </div>
                        <span className="text-[10px] text-stone-400">{post.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {post.tags?.map((t: string, i: number) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-stone-300">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Post Question */}
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">{post.title}</h3>
                    <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">{post.content}</p>
                  </div>

                  {/* Organizer Replies Section */}
                  {post.replies?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-[#0c0d10] border border-[#c99a6b]/30 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#c99a6b] flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5" />
                        Verified Organizer Response
                      </span>
                      {post.replies.map((reply: any, idx: number) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{reply.author}</span>
                            <span className="text-[9px] px-2 py-0.2 rounded-full bg-[#c99a6b]/20 text-[#e4c29e] border border-[#c99a6b]/30 font-bold">
                              {reply.badge}
                            </span>
                          </div>
                          <p className="text-xs text-stone-300 leading-relaxed italic">&ldquo;{reply.text}&rdquo;</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs text-stone-400">
                    <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                      ▲ {post.upvotes} Helpful votes
                    </span>
                    <span>{post.repliesCount || post.replies?.length || 0} Replies</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================= TAB 4: SMART CONCIERGE & UTILITIES ================= */}
        {activeTab === 'concierge' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Currency Converter (6 Cols) */}
            <div className="lg:col-span-6 bg-[#14151a]/95 border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-xl space-y-5 font-sans">
              <div>
                <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#c99a6b]" />
                  Live Multi-Currency Travel Calculator
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">Real-time daily expense conversions across your multi-city stops</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Amount to Convert</label>
                  <input
                    type="number"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(e.target.value)}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-[#c99a6b]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">From Currency</label>
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                    >
                      <option value="USD">USD ($ - US Dollar)</option>
                      <option value="EUR">EUR (€ - Euro)</option>
                      <option value="GBP">GBP (£ - British Pound)</option>
                      <option value="JPY">JPY (¥ - Japanese Yen)</option>
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
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                    >
                      <option value="EUR">EUR (€ - Euro)</option>
                      <option value="USD">USD ($ - US Dollar)</option>
                      <option value="JPY">JPY (¥ - Japanese Yen)</option>
                      <option value="GBP">GBP (£ - British Pound)</option>
                      <option value="INR">INR (₹ - Indian Rupee)</option>
                      <option value="CAD">CAD ($ - Canadian Dollar)</option>
                      <option value="AUD">AUD ($ - Australian Dollar)</option>
                    </select>
                  </div>
                </div>

                {calcResult !== null && (
                  <div className="p-4 rounded-2xl bg-[#0c0d10] border border-[#c99a6b]/30 flex items-center justify-between">
                    <span className="text-xs text-stone-400">Converted Value:</span>
                    <span className="font-serif text-2xl font-bold text-[#e4c29e]">
                      {calcResult.toLocaleString()} {toCurrency}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Smart Departure Packing Checklist (6 Cols) */}
            <div className="lg:col-span-6 bg-[#14151a]/95 border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-xl space-y-5 font-sans">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                    <Luggage className="w-5 h-5 text-[#c99a6b]" />
                    Departure Packing Checklist
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">{checklistDoneCount} of {checklist.length} essential items completed</p>
                </div>

                <span className="text-xs font-bold text-[#e4c29e]">
                  {Math.round((checklistDoneCount / checklist.length) * 100)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
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
                    className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                      item.done
                        ? 'bg-[#0c0d10]/40 border-white/5 text-stone-500'
                        : 'bg-[#0c0d10] border-white/10 text-stone-200 hover:border-[#c99a6b]/40'
                    }`}
                  >
                    {item.done ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-stone-500 flex-shrink-0" />
                    )}
                    <span className={`text-xs ${item.done ? 'line-through text-stone-500' : 'text-stone-200'}`}>
                      {item.text}
                    </span>
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
                  className="flex-1 bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#c99a6b] hover:text-[#0c0d10] text-stone-200 text-xs font-bold transition-all cursor-pointer"
                >
                  Add
                </button>
              </form>
            </div>

          </div>
        )}

        {/* ================= EXPEDITION STOPS MODAL ================= */}
        {selectedExpedition && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#14151a] border border-white/15 rounded-[32px] max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#c99a6b]">{selectedExpedition.category}</span>
                  <h3 className="font-serif text-2xl font-bold text-white mt-0.5">{selectedExpedition.title}</h3>
                  <p className="text-xs text-stone-400 font-sans mt-0.5">{selectedExpedition.duration} &bull; Led by {selectedExpedition.organizer.name}</p>
                </div>

                <button
                  onClick={() => setSelectedExpedition(null)}
                  className="p-2 rounded-xl bg-white/5 text-stone-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 font-sans">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-300">Scheduled Multi-City Stops:</span>
                <div className="space-y-2">
                  {selectedExpedition.stops.map((stop: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#0c0d10] border border-white/10 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#c99a6b]/20 text-[#e4c29e] font-serif font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <span className="text-xs font-bold text-white">{stop}</span>
                    </div>
                  ))}
                </div>
              </div>

              {clonedSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Expedition cloned into your private itineraries portfolio!</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3 font-sans">
                <button
                  onClick={() => setSelectedExpedition(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-bold"
                >
                  Close
                </button>

                <button
                  onClick={() => handleCloneExpedition(selectedExpedition)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold shadow-lg shadow-[#c99a6b]/20"
                >
                  Clone into My Itineraries
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= ASK TOUR GUIDES MODAL ================= */}
        {showNewPostModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
            <div className="bg-[#14151a] border border-white/15 rounded-[32px] max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white">Ask Expedition Guides</h3>
                  <p className="text-xs text-stone-400 mt-0.5">Post a question to our certified tour organizers and global travel community</p>
                </div>

                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="p-2 rounded-xl bg-white/5 text-stone-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Question Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Best transport pass for Rome -> Florence -> Positano?"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Details &amp; Context</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details such as number of travelers, budget, or dates..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl p-4 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewPostModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 text-stone-400 hover:text-white text-xs font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] text-xs font-bold shadow-lg shadow-[#c99a6b]/20"
                  >
                    Post Question
                  </button>
                </div>
              </form>
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
