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
  TrendingUp,
  Globe2,
  Share2,
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
    { id: 1, text: 'Renew International Passport & Check Visa requirements', done: true },
    { id: 2, text: 'Confirm Flight & High-Speed Train bookings', done: true },
    { id: 3, text: 'Purchase Universal Power Adapter & eSIM data package', done: false },
    { id: 4, text: 'Exchange local currency / notify bank of travel', done: false },
    { id: 5, text: 'Pack weather-appropriate footwear & apparel', done: false },
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">
        
        {/* Traveler Personal Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/60 border border-slate-800 p-8 sm:p-10 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personal Traveler Passport &bull; Private Access</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
                Welcome back, {user?.name || 'Explorer'} 👋
              </h1>
              <p className="text-slate-400 text-sm max-w-xl">
                You have <span className="text-blue-400 font-semibold">{totalTrips} personal journeys</span> saved. Model your daily allowances and check off your departure items.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/trips/new"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Plan New Journey</span>
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-200 text-xs font-semibold transition-colors"
              >
                <Compass className="w-4 h-4 text-blue-400" />
                <span>Explore World</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Traveler KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">My Itineraries</span>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1">{totalTrips}</p>
            <span className="text-[11px] text-blue-400 font-semibold">Personal plans</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Stops</span>
            <p className="text-2xl sm:text-3xl font-black text-indigo-400 mt-1">{totalStops}</p>
            <span className="text-[11px] text-slate-400">Across world cities</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Planned Budget</span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
              ${totalBudgetPlanned.toLocaleString()}
            </p>
            <span className="text-[11px] text-emerald-400/80">Calculated allowance</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Checklist Status</span>
            <p className="text-2xl sm:text-3xl font-black text-cyan-400 mt-1">
              {checklist.filter((i) => i.done).length}/{checklist.length} Done
            </p>
            <span className="text-[11px] text-slate-400">Ready for takeoff</span>
          </div>
        </div>

        {/* Featured Itinerary */}
        {activeTrip ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Featured Personal Itinerary
              </h2>
              <Link href={`/trips/${activeTrip.id}`} className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Open Full Planner <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col lg:flex-row">
              <div className="lg:w-2/5 h-64 lg:h-auto relative overflow-hidden">
                <img
                  src={activeTrip.cover_image_url || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'}
                  alt={activeTrip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                    {activeTrip.status || 'Planning'}
                  </span>
                </div>
              </div>

              <div className="lg:w-3/5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{activeTrip.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-2">{activeTrip.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Dates</span>
                      <p className="text-xs font-bold text-white mt-0.5">
                        {new Date(activeTrip.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} -{' '}
                        {new Date(activeTrip.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>

                    <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Budget</span>
                      <p className="text-xs font-bold text-emerald-400 mt-0.5">
                        ${parseFloat(activeTrip.total_budget || 0).toLocaleString()} {activeTrip.currency}
                      </p>
                    </div>

                    <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Destinations</span>
                      <p className="text-xs font-bold text-blue-400 mt-0.5">
                        {activeTrip.total_stops || 2} Stops
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Share Code:</span>
                    <span className="font-mono text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {activeTrip.share_code}
                    </span>
                  </div>
                  <Link
                    href={`/trips/${activeTrip.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
                  >
                    <span>Manage Itinerary</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center">
            <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No trips created yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
              Start building your first multi-city adventure with custom destinations and activities.
            </p>
            <Link
              href="/trips/new"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20"
            >
              Plan Your First Trip
            </Link>
          </div>
        )}

        {/* Departure Checklist & Saved Wishlist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Packing & Pre-Travel Checklist Widget (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Luggage className="w-4 h-4 text-amber-400" />
                  Departure Checklist &amp; Essentials
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Check off items before leaving for your journey</p>
              </div>
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                {checklist.filter((i) => i.done).length} / {checklist.length} Done
              </span>
            </div>

            <div className="space-y-2.5 pt-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                    item.done
                      ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                      : 'bg-slate-950 border-slate-700/70 text-slate-200 hover:border-slate-600'
                  }`}
                >
                  {item.done ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  )}
                  <span className={`text-xs ${item.done ? 'line-through' : 'font-medium'}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Destinations Wishlist (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-indigo-400" />
                  Saved Wishlist ({savedDestinations.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Quickly start plans in your dream cities</p>
              </div>
              <Link href="/explore" className="text-xs text-blue-400 hover:underline">
                Explore More
              </Link>
            </div>

            {savedDestinations.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-800 rounded-2xl">
                <Bookmark className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No saved destinations yet</p>
                <Link href="/explore" className="text-xs font-semibold text-blue-400 hover:underline mt-1 inline-block">
                  Discover destinations &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {savedDestinations.slice(0, 3).map((dest) => (
                  <div
                    key={dest.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img src={dest.image_url} alt={dest.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-xs font-bold text-white">{dest.name}</p>
                        <p className="text-[10px] text-slate-400">{dest.country} &bull; ${dest.avg_daily_cost}/day</p>
                      </div>
                    </div>

                    <Link
                      href={`/trips/new`}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[11px] font-semibold"
                    >
                      + Plan Trip
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
