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
  Shield,
  Users,
  CheckSquare,
  Square,
  Megaphone,
  Copy,
  Eye,
  Bookmark,
  Activity,
  Layers,
  Crown,
  Luggage,
  Award
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [savedDestinations, setSavedDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Traveler Interactive Checklist State
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Renew International Passport & Check Visa validity', done: true },
    { id: 2, text: 'Confirm Flight & High-Speed Train bookings', done: true },
    { id: 3, text: 'Purchase Universal Power Adapter & eSIM data plan', done: false },
    { id: 4, text: 'Exchange local currency / notify bank of travel', done: false },
    { id: 5, text: 'Pack weather-appropriate apparel & rain gear', done: false },
  ]);

  // Organizer Broadcast Message State
  const [broadcastMsg, setBroadcastMsg] = useState('Welcome to the Japan Expedition! Please ensure your JR Rail Pass vouchers are activated prior to Oct 10.');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [newBroadcastInput, setNewBroadcastInput] = useState('');

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

    async function loadDashboardData() {
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
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const toggleChecklistItem = (id: number) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleUpdateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBroadcastInput.trim()) {
      setBroadcastMsg(newBroadcastInput);
      setShowBroadcastModal(false);
      setNewBroadcastInput('');
    }
  };

  const role = user?.role || 'traveler';
  const totalTrips = trips.length;
  const activeTrip = trips.find((t) => t.status === 'active' || t.status === 'planning') || trips[0];
  const totalBudgetPlanned = trips.reduce((acc, t) => acc + parseFloat(t.total_budget || 0), 0);
  const totalStops = trips.reduce((acc, t) => acc + (t.total_stops || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">
        
        {/* ========================================================================= */}
        {/* ROLE-SPECIFIC HERO BANNER */}
        {/* ========================================================================= */}
        {role === 'admin' ? (
          // ADMIN HERO BANNER
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 p-8 sm:p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Platform Administrator Command Center</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
                  System Overview, {user?.name || 'Administrator'} 👑
                </h1>
                <p className="text-slate-400 text-sm max-w-xl">
                  Oversee platform health, audit multi-city itineraries, manage the global destinations catalog, and control user access permissions.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Shield className="w-4 h-4" />
                  <span>Open Full Admin Portal</span>
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  <Globe2 className="w-4 h-4 text-blue-400" />
                  <span>Explore Catalog</span>
                </Link>
              </div>
            </div>
          </div>
        ) : role === 'organizer' ? (
          // ORGANIZER HERO BANNER
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 border border-indigo-500/30 p-8 sm:p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold mb-3">
                  <Users className="w-4 h-4" />
                  <span>Trip Organizer &amp; Group Expedition Hub</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
                  Welcome back, Lead Organizer {user?.name || ''} 🧭
                </h1>
                <p className="text-slate-400 text-sm max-w-xl">
                  Manage your group expeditions, broadcast travel notices to participants, and monitor public itinerary copy analytics.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/trips/new"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create Group Expedition</span>
                </Link>
                <button
                  onClick={() => setShowBroadcastModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold"
                >
                  <Megaphone className="w-4 h-4 text-amber-400" />
                  <span>Post Notice</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // TRAVELER HERO BANNER
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/60 border border-slate-800 p-8 sm:p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Personal Traveler Passport</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
                  Welcome back, {user?.name || 'Traveler'} 👋
                </h1>
                <p className="text-slate-400 text-sm max-w-xl">
                  You have <span className="text-blue-400 font-semibold">{totalTrips} private itineraries</span> planned. Keep tracking your daily allowance and packing checklist.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/trips/new"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Plan New Trip</span>
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
        )}

        {/* ========================================================================= */}
        {/* ROLE-SPECIFIC KPI METRICS */}
        {/* ========================================================================= */}
        {role === 'organizer' ? (
          // ORGANIZER KPIS
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Expeditions Hosted</span>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">{totalTrips}</p>
              <span className="text-[11px] text-indigo-400 font-semibold">Group itineraries</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Group Capacity</span>
              <p className="text-2xl sm:text-3xl font-black text-blue-400 mt-1">28 / 35</p>
              <span className="text-[11px] text-slate-400">80% spots filled</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Public Clones &amp; Copies</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">42 Clones</p>
              <span className="text-[11px] text-emerald-400/80">From shared links</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lead Status</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">Verified Guide</p>
              <span className="text-[11px] text-slate-400">High rating (4.9★)</span>
            </div>
          </div>
        ) : (
          // TRAVELER & GENERAL KPIS
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">My Itineraries</span>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">{totalTrips}</p>
              <span className="text-[11px] text-blue-400 font-semibold">Personal journeys</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Planned Stops</span>
              <p className="text-2xl sm:text-3xl font-black text-indigo-400 mt-1">{totalStops}</p>
              <span className="text-[11px] text-slate-400">Across world cities</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Planned Budget</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
                ${totalBudgetPlanned.toLocaleString()}
              </p>
              <span className="text-[11px] text-emerald-400/80">Calculated allowance</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Passport Status</span>
              <p className="text-2xl sm:text-3xl font-black text-cyan-400 mt-1">Active</p>
              <span className="text-[11px] text-slate-400">Ready for takeoff</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ORGANIZER-SPECIFIC NOTICE BOARD */}
        {/* ========================================================================= */}
        {role === 'organizer' && (
          <div className="p-6 rounded-3xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Active Organizer Advisory Notice
                </span>
                <p className="text-sm font-semibold text-white mt-0.5">{broadcastMsg}</p>
              </div>
            </div>

            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold whitespace-nowrap self-start sm:self-auto"
            >
              Edit Broadcast
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FEATURED ITINERARY SPOTLIGHT */}
        {/* ========================================================================= */}
        {activeTrip ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                {role === 'organizer' ? 'Lead Expedition Spotlight' : 'Featured Personal Journey'}
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

        {/* ========================================================================= */}
        {/* TRAVELER CHECKLIST & WISHLIST SPLIT (ROLE-SPECIFIC FEATURE) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Packing & Pre-Travel Checklist Widget (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Luggage className="w-4 h-4 text-amber-400" />
                  Departure Checklist &amp; Essentials
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Track pre-departure requirements and documents</p>
              </div>
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                {checklist.filter((i) => i.done).length} / {checklist.length} Completed
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

      {/* ================= EDIT BROADCAST MODAL ================= */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <Megaphone className="w-5 h-5 text-indigo-400" />
              Update Expedition Notice
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Broadcast an updated travel advisory to all group participants
            </p>

            <form onSubmit={handleUpdateBroadcast} className="space-y-4">
              <textarea
                rows={3}
                required
                placeholder="Enter important meeting points, visa alerts, or packing notices..."
                value={newBroadcastInput}
                onChange={(e) => setNewBroadcastInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white resize-none"
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
