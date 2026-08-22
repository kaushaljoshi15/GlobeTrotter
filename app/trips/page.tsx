'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Share2, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Check, 
  Globe2, 
  Sparkles,
  LayoutGrid,
  List
} from 'lucide-react';

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchTrips();
  }, [statusFilter]);

  async function fetchTrips() {
    setLoading(true);
    try {
      let url = '/api/trips?';
      if (statusFilter !== 'all') url += `status=${statusFilter}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setTrips(data.data || []);
      }
    } catch (err) {
      console.error('Error loading trips:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrips();
  };

  const handleShare = (shareCode: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/trips/share/${shareCode}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedCode(shareCode);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleDeleteTrip = async (tripId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this trip itinerary? This cannot be undone.')) return;

    try {
      const res = await fetch(`/api/trips/${tripId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTrips(trips.filter((t) => t.id !== tripId));
      }
    } catch (err) {
      console.error('Error deleting trip:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Globe2 className="w-8 h-8 text-blue-500" />
              My Travel Itineraries
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage and track your multi-city journeys and budgets</p>
          </div>

          <Link
            href="/trips/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Trip</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
          {/* Status Pills */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['all', 'planning', 'active', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Form & View Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search itineraries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </form>

            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-white'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Trips Grid / List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-900/60 border border-slate-800 rounded-3xl h-72 animate-pulse" />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No trip itineraries found</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto mb-6">
              You haven't created any trips matching this filter yet. Start your next adventure now!
            </p>
            <Link
              href="/trips/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Trip</span>
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="group bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col"
              >
                {/* Cover Image Header */}
                <div className="h-44 relative overflow-hidden">
                  <img
                    src={trip.cover_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-slate-800">
                      {trip.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleShare(trip.share_code, e)}
                      title="Copy Public Share Link"
                      className="p-2 rounded-full bg-slate-950/80 hover:bg-blue-600 backdrop-blur-md text-slate-300 hover:text-white border border-slate-800 transition-colors"
                    >
                      {copiedCode === trip.share_code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={(e) => handleDeleteTrip(trip.id, e)}
                      title="Delete Trip"
                      className="p-2 rounded-full bg-slate-950/80 hover:bg-red-600 backdrop-blur-md text-slate-300 hover:text-white border border-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-white leading-tight group-hover:text-blue-300 transition-colors line-clamp-1">
                      {trip.title}
                    </h3>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span>
                        {new Date(trip.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} &bull;{' '}
                        {new Date(trip.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      <span>{trip.total_stops || 0} Destination Stops</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>
                        Budget: <strong className="text-emerald-400">${parseFloat(trip.total_budget || 0).toLocaleString()} {trip.currency}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Footer Card Info */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">Code: {trip.share_code.substring(0, 14)}...</span>
                    <span className="text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Open <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* List Mode */
          <div className="space-y-4">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="group bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={trip.cover_image_url}
                    alt={trip.title}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                      {trip.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                      <span>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
                      <span>&bull;</span>
                      <span>{trip.total_stops || 0} Stops</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Budget</span>
                    <p className="text-xs font-bold text-emerald-400">${parseFloat(trip.total_budget).toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleShare(trip.share_code, e)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteTrip(trip.id, e)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
