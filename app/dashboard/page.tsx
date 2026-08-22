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
  Users
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

        const [tripsRes, destsRes] = await Promise.all([
          fetch(`/api/trips?userId=${currentUserId}`, { headers }).then((r) => r.json()),
          fetch('/api/destinations?limit=6').then((r) => r.json()),
        ]);

        if (tripsRes.success) setTrips(tripsRes.data || []);
        if (destsRes.success) setDestinations(destsRes.data || []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Compute metrics
  const totalTrips = trips.length;
  const activeTrip = trips.find((t) => t.status === 'active' || t.status === 'planning') || trips[0];
  const totalBudgetPlanned = trips.reduce((acc, t) => acc + parseFloat(t.total_budget || 0), 0);
  const totalStops = trips.reduce((acc, t) => acc + (t.total_stops || 0), 0);

  const role = user?.role || 'traveler';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        
        {/* Top Hero Banner / Welcome */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/60 border border-slate-800 p-8 sm:p-10 mb-10 shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="capitalize">{role} Travel Hub</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                Welcome back, {user?.name || 'Traveler'} 👋
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl">
                {role === 'organizer'
                  ? 'Manage your group itineraries, publish sharable plans, and monitor participant stops.'
                  : role === 'admin'
                  ? 'Platform Administrator Portal — Oversee global destinations catalog and platform health.'
                  : `Ready to plan your next journey? You currently have ${totalTrips} private itineraries.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/trips/new"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Plan New Trip</span>
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-200 text-sm font-semibold transition-colors"
              >
                <Compass className="w-4 h-4 text-blue-400" />
                <span>Explore World</span>
              </Link>
              {role === 'admin' && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-semibold transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">My Itineraries</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{totalTrips}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>Personal plans</span>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">Planned Stops</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Globe2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{totalStops}</div>
            <div className="text-[11px] text-slate-500 mt-1">Across global cities</div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">Total Budget</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              ${totalBudgetPlanned.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Calculated budget target</div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">Account Role</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 capitalize">{role}</div>
            <div className="text-[11px] text-slate-500 mt-1">Strict RBAC Active</div>
          </div>
        </div>

        {/* Featured / Active Trip Spotlight (if exists) */}
        {activeTrip ? (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Featured Itinerary
              </h2>
              <Link href={`/trips/${activeTrip.id}`} className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Open Full Planner <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col lg:flex-row">
              {/* Cover Image */}
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

              {/* Details & Stops */}
              <div className="lg:w-3/5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{activeTrip.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-2">{activeTrip.description}</p>

                  {/* Date & Budget Badges */}
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
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center mb-12">
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

        {/* Trending Destinations Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Trending Global Destinations
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">Explore popular cities and add them directly into your trips</p>
            </div>
            <Link href="/explore" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View All Destinations <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="group bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={dest.image_url}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Cost Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                      dest.cost_index === 'budget' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : dest.cost_index === 'luxury'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {dest.cost_index}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4">
                    <h4 className="text-xl font-bold text-white leading-none">{dest.name}</h4>
                    <p className="text-xs text-slate-300 mt-1">{dest.country} &bull; {dest.continent}</p>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">{dest.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Avg Daily Cost</span>
                      <p className="text-xs font-bold text-slate-200">${dest.avg_daily_cost} / day</p>
                    </div>
                    <Link
                      href={`/explore?city=${encodeURIComponent(dest.name)}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-semibold transition-colors"
                    >
                      View Activities
                    </Link>
                  </div>
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
