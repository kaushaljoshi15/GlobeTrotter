'use client';

import { useState, useEffect } from 'react';
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
  Square 
} from 'lucide-react';

export default function TravelerDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [savedDestinations, setSavedDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Interactive Checklist
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Renew International Passport & verify visa validity', done: true },
    { id: 2, text: 'Confirm flight tickets & high-speed rail reservations', done: true },
    { id: 3, text: 'Purchase universal power adapter & eSIM global data', done: false },
    { id: 4, text: 'Arrange local currency / notify card issuer of travel', done: false },
    { id: 5, text: 'Pack alpine/coastal weather apparel & footwear', done: false },
  ]);

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

  const toggleChecklistItem = (id: number) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const totalTrips = trips.length;
  const activeTrip = trips.find((t) => t.status === 'active' || t.status === 'planning') || trips[0];
  const totalBudgetPlanned = trips.reduce((acc, t) => acc + parseFloat(t.total_budget || 0), 0);
  const totalStops = trips.reduce((acc, t) => acc + (t.total_stops || 0), 0);

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        
        {/* Traveler Personal Hero Banner */}
        <div className="relative rounded-[32px] overflow-hidden bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#c99a6b]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#e4c29e] text-[11px] font-sans font-medium mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
                <span>Personal Traveler Atelier &bull; Private Portfolio</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium text-white tracking-tight mb-2">
                Welcome, <span className="font-bold italic text-[#e4c29e]">{user?.name || 'Explorer'}</span>.
              </h1>
              <p className="font-serif text-stone-300 text-sm max-w-xl">
                You have <span className="text-[#e4c29e] font-semibold">{totalTrips} bespoke journeys</span> in your atelier. Balance your daily allowances and check off departure items.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/trips/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#c99a6b]/30 hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Plan New Journey</span>
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0c0d10] hover:bg-white/10 border border-white/15 text-stone-200 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <Compass className="w-4 h-4 text-[#e4c29e]" />
                <span>Explore Catalog</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Traveler KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">My Itineraries</span>
            <p className="font-serif text-3xl font-bold text-white mt-1">{totalTrips}</p>
            <span className="text-[11px] text-[#e4c29e] font-medium">Personal plans</span>
          </div>

          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Total Stops</span>
            <p className="font-serif text-3xl font-bold text-white mt-1">{totalStops}</p>
            <span className="text-[11px] text-stone-400">Across world cities</span>
          </div>

          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Planned Budget</span>
            <p className="font-serif text-3xl font-bold text-emerald-400 mt-1">
              ${totalBudgetPlanned.toLocaleString()}
            </p>
            <span className="text-[11px] text-emerald-400/80">Calculated allowance</span>
          </div>

          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Checklist Ready</span>
            <p className="font-serif text-3xl font-bold text-[#e4c29e] mt-1">
              {checklist.filter((i) => i.done).length}/{checklist.length} Done
            </p>
            <span className="text-[11px] text-stone-400">Pre-departure items</span>
          </div>
        </div>

        {/* Featured Itinerary */}
        {activeTrip ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
                  Current Expedition
                </span>
                <h2 className="font-serif text-2xl font-medium text-white tracking-tight flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#c99a6b]" />
                  Active Journey Plan
                </h2>
              </div>
              <Link href={`/trips/${activeTrip.id}`} className="text-xs font-bold uppercase tracking-wider text-[#e4c29e] hover:underline flex items-center gap-1">
                Open Full Atelier <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
              <div className="lg:w-2/5 h-64 lg:h-auto relative overflow-hidden">
                <img
                  src={activeTrip.cover_image_url || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'}
                  alt={activeTrip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14151a] via-[#14151a]/30 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#e4c29e] text-[10px] font-sans font-bold uppercase tracking-widest border border-white/20">
                    {activeTrip.status || 'Planning'}
                  </span>
                </div>
              </div>

              <div className="lg:w-3/5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">{activeTrip.title}</h3>
                  <p className="text-stone-300 text-xs sm:text-sm mb-6 line-clamp-2 leading-relaxed font-sans">{activeTrip.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 font-sans">
                    <div className="bg-[#0c0d10] p-3.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">Dates</span>
                      <p className="text-xs font-bold text-white mt-0.5">
                        {new Date(activeTrip.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} -{' '}
                        {new Date(activeTrip.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>

                    <div className="bg-[#0c0d10] p-3.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">Total Budget</span>
                      <p className="text-xs font-bold text-emerald-400 mt-0.5">
                        ${parseFloat(activeTrip.total_budget || 0).toLocaleString()} {activeTrip.currency}
                      </p>
                    </div>

                    <div className="bg-[#0c0d10] p-3.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">Destinations</span>
                      <p className="text-xs font-bold text-[#e4c29e] mt-0.5">
                        {activeTrip.total_stops || 2} Stops
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400">Share Code:</span>
                    <span className="font-mono text-xs text-stone-200 bg-[#0c0d10] px-2.5 py-1 rounded border border-white/15">
                      {activeTrip.share_code}
                    </span>
                  </div>
                  <Link
                    href={`/trips/${activeTrip.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-md shadow-[#c99a6b]/20 transition-all"
                  >
                    <span>Manage Itinerary</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-10 rounded-[32px] bg-[#14151a]/60 border border-white/10 text-center">
            <Compass className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-white mb-1">No journeys created yet</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto mb-5 font-sans">
              Start composing your first multi-city adventure with bespoke destinations and activities.
            </p>
            <Link
              href="/trips/new"
              className="px-6 py-3 bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] rounded-full text-xs font-bold uppercase tracking-wider shadow-lg inline-block"
            >
              Plan Your First Journey &rarr;
            </Link>
          </div>
        )}

        {/* Departure Checklist & Saved Wishlist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
          
          {/* Packing & Pre-Travel Checklist Widget */}
          <div className="lg:col-span-7 bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <Luggage className="w-4 h-4 text-[#c99a6b]" />
                  Departure Checklist &amp; Essentials
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">Check off items before leaving for your journey</p>
              </div>
              <span className="text-xs font-bold text-[#e4c29e] bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {checklist.filter((i) => i.done).length} / {checklist.length} Ready
              </span>
            </div>

            <div className="space-y-2.5 pt-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                    item.done
                      ? 'bg-[#0c0d10]/60 border-white/5 text-stone-500'
                      : 'bg-[#0c0d10] border-white/10 text-stone-200 hover:border-[#c99a6b]/50'
                  }`}
                >
                  {item.done ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-500 flex-shrink-0" />
                  )}
                  <span className={`text-xs ${item.done ? 'line-through' : 'font-medium'}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Destinations Wishlist */}
          <div className="lg:col-span-5 bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-[#c99a6b]" />
                  Saved Destinations ({savedDestinations.length})
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">Quickly start plans in your dream cities</p>
              </div>
              <Link href="/explore" className="text-xs font-semibold text-[#e4c29e] hover:underline">
                Explore More
              </Link>
            </div>

            {savedDestinations.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-white/10 rounded-2xl">
                <Bookmark className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                <p className="text-xs text-stone-400">No saved destinations yet</p>
                <Link href="/explore" className="text-xs font-semibold text-[#e4c29e] hover:underline mt-1 inline-block">
                  Discover destinations &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {savedDestinations.slice(0, 3).map((dest) => (
                  <div
                    key={dest.id}
                    className="p-3 bg-[#0c0d10] border border-white/10 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img src={dest.image_url} alt={dest.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="font-serif text-xs font-bold text-white">{dest.name}</p>
                        <p className="text-[10px] text-stone-400">{dest.country} &bull; ${dest.avg_daily_cost}/day</p>
                      </div>
                    </div>

                    <Link
                      href={`/trips/new`}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] rounded-full text-[11px] font-bold uppercase tracking-wider"
                    >
                      + Plan
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
