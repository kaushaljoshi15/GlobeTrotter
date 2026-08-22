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
  ShieldAlert
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

  useEffect(() => {
    async function loadAdminMetrics() {
      try {
        const res = await fetch('/api/analytics/admin');
        const data = await res.json();
        if (data.success) {
          setMetrics(data.data);
        }
      } catch (err) {
        console.error('Error fetching admin metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminMetrics();
  }, []);

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
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Platform Intelligence</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Global Platform Analytics &amp; KPIs
            </h1>
            <p className="text-slate-400 text-sm mt-1">Real-time metrics on user adoption, top destinations, and itinerary planning trends</p>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            System Live &bull; PostgreSQL Synchronized
          </span>
        </div>

        {/* 6 High-Level KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Users</span>
            <p className="text-2xl font-black text-white mt-1">{metrics?.kpis?.totalUsers || 0}</p>
            <span className="text-[10px] text-blue-400">Registered</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Trips Created</span>
            <p className="text-2xl font-black text-white mt-1">{metrics?.kpis?.totalTrips || 0}</p>
            <span className="text-[10px] text-indigo-400">Itineraries</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Total Stops</span>
            <p className="text-2xl font-black text-blue-400 mt-1">{metrics?.kpis?.totalStops || 0}</p>
            <span className="text-[10px] text-slate-400">City segments</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Experiences</span>
            <p className="text-2xl font-black text-amber-400 mt-1">{metrics?.kpis?.totalActivitiesScheduled || 0}</p>
            <span className="text-[10px] text-slate-400">Scheduled</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Budget Volume</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">
              ${(metrics?.kpis?.totalBudgetPlanned || 0).toLocaleString()}
            </p>
            <span className="text-[10px] text-emerald-400/80">Target volume</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Expenses Logged</span>
            <p className="text-2xl font-black text-cyan-400 mt-1">
              ${(metrics?.kpis?.totalExpensesLogged || 0).toLocaleString()}
            </p>
            <span className="text-[10px] text-cyan-400/80">Receipt total</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Top Destinations Bar Chart */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              Most Popular Travel Destinations
            </h3>

            <div className="h-64">
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
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Activity Preference Breakdown
            </h3>

            <div className="h-64">
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
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            Recent Platform Itinerary Activity
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Trip Title</th>
                  <th className="py-3 px-4">Traveler</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Budget Target</th>
                  <th className="py-3 px-4 text-right">Created</th>
                  <th className="py-3 px-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {metrics?.recentTrips?.map((trip: any) => (
                  <tr key={trip.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{trip.title}</td>
                    <td className="py-3.5 px-4 text-slate-300">{trip.user_name || trip.user_email}</td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      ${parseFloat(trip.total_budget || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500">
                      {new Date(trip.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/trips/${trip.id}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
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

      <Footer />
    </div>
  );
}
