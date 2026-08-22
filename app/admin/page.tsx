'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  BarChart3,
  Users,
  MapPin,
  Globe2,
  TrendingUp,
  DollarSign,
  Layers,
  Sparkles,
  Calendar,
  Eye,
  Plus,
  Shield,
  Check,
  Compass,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#3B82F6', '#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddDestModal, setShowAddDestModal] = useState(false);
  const [destSuccess, setDestSuccess] = useState(false);

  // New Destination Form
  const [newDest, setNewDest] = useState({
    name: '',
    country: '',
    continent: 'Europe',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    costIndex: 'moderate',
    avgDailyCost: '140',
    currency: 'EUR',
    bestTimeToVisit: 'Spring / Autumn',
  });

  useEffect(() => {
    loadAdminMetrics();
  }, []);

  async function loadAdminMetrics() {
    try {
      const res = await fetch('/api/analytics/admin');
      const data = await res.json();
      if (data.success) setMetrics(data.data);
    } catch (err) {
      console.error('Error fetching admin metrics:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDest),
      });
      const data = await res.json();
      if (data.success) {
        setDestSuccess(true);
        setTimeout(() => {
          setDestSuccess(false);
          setShowAddDestModal(false);
          loadAdminMetrics();
        }, 1500);
      }
    } catch (e) {
      console.error('Error creating destination:', e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans">
        <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const destinationBarData = metrics?.topDestinations?.map((d: any) => ({
    name: d.name,
    trips: d.trip_count,
  })) || [];

  const categoryPieData = metrics?.categoryStats?.map((c: any, i: number) => ({
    name: c.category.toUpperCase().replace('_', ' '),
    value: c.count,
    color: COLORS[i % COLORS.length],
  })) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        
        {/* Header with Admin Badges & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Administrator &amp; Organizer Intelligence Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Platform Analytics &amp; Control
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Live metrics on user adoption, top global destinations, and itinerary planning trends
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddDestModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add City to Catalog</span>
            </button>
          </div>
        </div>

        {/* 6 High-Level KPI Cards with Rich Vibrant Accents */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <div className="bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-colors">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Users</span>
            <p className="text-2xl font-black text-white mt-1">{metrics?.kpis?.totalUsers || 0}</p>
            <span className="text-[10px] text-blue-400 font-semibold">Active accounts</span>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-colors">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trips Created</span>
            <p className="text-2xl font-black text-white mt-1">{metrics?.kpis?.totalTrips || 0}</p>
            <span className="text-[10px] text-indigo-400 font-semibold">Multi-city plans</span>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-colors">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Stops</span>
            <p className="text-2xl font-black text-blue-400 mt-1">{metrics?.kpis?.totalStops || 0}</p>
            <span className="text-[10px] text-slate-400 font-semibold">Destination visits</span>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-colors">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experiences</span>
            <p className="text-2xl font-black text-amber-400 mt-1">{metrics?.kpis?.totalActivitiesScheduled || 0}</p>
            <span className="text-[10px] text-slate-400 font-semibold">Activities booked</span>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-colors">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Budget Target</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">
              ${(metrics?.kpis?.totalBudgetPlanned || 0).toLocaleString()}
            </p>
            <span className="text-[10px] text-emerald-400/80 font-semibold">Planned capital</span>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-colors">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expenses Logged</span>
            <p className="text-2xl font-black text-cyan-400 mt-1">
              ${(metrics?.kpis?.totalExpensesLogged || 0).toLocaleString()}
            </p>
            <span className="text-[10px] text-cyan-400/80 font-semibold">Actual receipts</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Top Destinations Bar Chart */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                Most Popular Destinations Visited
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">Top cities by number of scheduled multi-day stops</p>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={destinationBarData}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="trips" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Categories Distribution */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Activity Category Preference Breakdown
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">Distribution of experiences scheduled by travelers</p>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={4}
                  >
                    {categoryPieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Recent Itineraries Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Recent Platform Itineraries &amp; Groups
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">Live feed of multi-city itineraries created on GlobeTrotter</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Trip Title</th>
                  <th className="py-3 px-4">Organizer / Traveler</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Budget Target</th>
                  <th className="py-3 px-4 text-right">Created</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {metrics?.recentTrips?.map((trip: any) => (
                  <tr key={trip.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{trip.title}</td>
                    <td className="py-3.5 px-4 text-slate-300 flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 text-[10px] font-black flex items-center justify-center">
                        {trip.user_name ? trip.user_name[0] : 'U'}
                      </div>
                      <span>{trip.user_name || trip.user_email}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      ${parseFloat(trip.total_budget || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500 font-mono">
                      {new Date(trip.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/trips/${trip.id}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white font-semibold transition-colors"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* ================= ADD NEW DESTINATION MODAL ================= */}
      {showAddDestModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-blue-400" />
                Add City to Catalog
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">Expand GlobeTrotter's database of global travel destinations</p>

            {destSuccess ? (
              <div className="py-8 text-center text-emerald-400 font-bold text-sm flex flex-col items-center gap-2">
                <Check className="w-8 h-8 rounded-full bg-emerald-500/20 p-1.5" />
                <span>Destination successfully published to catalog!</span>
              </div>
            ) : (
              <form onSubmit={handleCreateDestination} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">City Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zurich"
                      value={newDest.name}
                      onChange={(e) => setNewDest({ ...newDest, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Country *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Switzerland"
                      value={newDest.country}
                      onChange={(e) => setNewDest({ ...newDest, country: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Continent</label>
                    <select
                      value={newDest.continent}
                      onChange={(e) => setNewDest({ ...newDest, continent: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="Europe">Europe</option>
                      <option value="Asia">Asia</option>
                      <option value="North America">North America</option>
                      <option value="Africa">Africa</option>
                      <option value="Middle East">Middle East</option>
                      <option value="Oceania">Oceania</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Cost Index</label>
                    <select
                      value={newDest.costIndex}
                      onChange={(e) => setNewDest({ ...newDest, costIndex: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="budget">Budget ($)</option>
                      <option value="moderate">Moderate ($$)</option>
                      <option value="luxury">Luxury ($$$)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Avg Daily Cost ($)</label>
                    <input
                      type="number"
                      value={newDest.avgDailyCost}
                      onChange={(e) => setNewDest({ ...newDest, avgDailyCost: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Best Season</label>
                    <input
                      type="text"
                      placeholder="e.g. May - October"
                      value={newDest.bestTimeToVisit}
                      onChange={(e) => setNewDest({ ...newDest, bestTimeToVisit: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Short description of highlights and architecture..."
                    value={newDest.description}
                    onChange={(e) => setNewDest({ ...newDest, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddDestModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                  >
                    Save &amp; Publish
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
