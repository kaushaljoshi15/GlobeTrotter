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
  Share2, 
  Trash2, 
  ExternalLink, 
  Check, 
  Globe2, 
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
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
              Personal Portfolios
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-white mt-1">
              My Travel <span className="font-bold italic text-[#e4c29e]">Itineraries.</span>
            </h1>
            <p className="font-serif text-stone-300 text-xs sm:text-sm mt-1">
              Curate, review, and track your multi-city journeys and daily budget allowances.
            </p>
          </div>

          <Link
            href="/trips/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#c99a6b]/30 hover:-translate-y-0.5 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Itinerary</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 p-4 sm:p-5 rounded-[28px] mb-10 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xl font-sans">
          {/* Status Pills */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['all', 'planning', 'active', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === status
                    ? 'bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] shadow-md'
                    : 'bg-[#0c0d10] text-stone-400 border border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Form & View Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search itineraries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0c0d10] border border-white/15 rounded-full pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b] transition-all"
              />
            </form>

            <div className="flex items-center bg-[#0c0d10] border border-white/10 rounded-full p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-[#14151a] text-[#e4c29e]' : 'text-stone-500 hover:text-white'}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-[#14151a] text-[#e4c29e]' : 'text-stone-500 hover:text-white'}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Trips Grid / List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-[#14151a]/60 border border-white/10 rounded-[32px] h-72 animate-pulse" />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20 bg-[#14151a]/60 border border-white/10 rounded-[32px] p-8 font-sans">
            <div className="w-16 h-16 rounded-full bg-white/5 text-[#e4c29e] flex items-center justify-center mx-auto mb-4 border border-white/10">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-white mb-1">No itineraries found</h3>
            <p className="text-stone-400 text-xs max-w-sm mx-auto mb-6">
              You haven't composed any trips matching this filter yet. Start your next journey now!
            </p>
            <Link
              href="/trips/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#c99a6b]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Itinerary</span>
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="group bg-[#14151a]/90 backdrop-blur-xl border border-white/10 hover:border-[#c99a6b]/50 rounded-[32px] overflow-hidden shadow-2xl transition-all duration-300 flex flex-col font-sans"
              >
                {/* Cover Image Header */}
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={trip.cover_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14151a] via-[#14151a]/30 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#e4c29e] text-[10px] font-bold uppercase tracking-wider border border-white/20">
                      {trip.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleShare(trip.share_code, e)}
                      title="Copy Public Share Link"
                      className="p-2 rounded-full bg-black/60 hover:bg-[#c99a6b] hover:text-[#0c0d10] backdrop-blur-md text-stone-200 border border-white/20 transition-all cursor-pointer"
                    >
                      {copiedCode === trip.share_code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={(e) => handleDeleteTrip(trip.id, e)}
                      title="Delete Trip"
                      className="p-2 rounded-full bg-black/60 hover:bg-red-600 backdrop-blur-md text-stone-200 hover:text-white border border-white/20 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="absolute bottom-3.5 left-5 right-5">
                    <h3 className="font-serif text-xl font-bold text-white leading-tight group-hover:text-[#e4c29e] transition-colors line-clamp-1">
                      {trip.title}
                    </h3>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3 mb-5 text-xs">
                    <div className="flex items-center gap-2 text-stone-300">
                      <Calendar className="w-3.5 h-3.5 text-[#c99a6b] flex-shrink-0" />
                      <span>
                        {new Date(trip.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} &bull;{' '}
                        {new Date(trip.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-stone-300">
                      <MapPin className="w-3.5 h-3.5 text-[#e4c29e] flex-shrink-0" />
                      <span>{trip.total_stops || 0} Destination Stops</span>
                    </div>

                    <div className="flex items-center gap-2 text-stone-300">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>
                        Budget: <strong className="text-emerald-400">${parseFloat(trip.total_budget || 0).toLocaleString()} {trip.currency}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Footer Card Info */}
                  <div className="pt-3.5 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400 font-mono">Code: {trip.share_code.substring(0, 12)}...</span>
                    <span className="text-xs font-bold text-[#e4c29e] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Open Atelier <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* List Mode */
          <div className="space-y-4 font-sans">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="group bg-[#14151a]/90 backdrop-blur-xl border border-white/10 hover:border-[#c99a6b]/50 rounded-2xl p-5 transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={trip.cover_image_url}
                    alt={trip.title}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#e4c29e] transition-colors">
                      {trip.title}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-3">
                      <span>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
                      <span>&bull;</span>
                      <span>{trip.total_stops || 0} Stops</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold">Budget</span>
                    <p className="text-xs font-bold text-emerald-400">${parseFloat(trip.total_budget).toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleShare(trip.share_code, e)}
                      className="p-2 rounded-xl bg-[#0c0d10] hover:bg-[#c99a6b] hover:text-[#0c0d10] text-stone-300 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteTrip(trip.id, e)}
                      className="p-2 rounded-xl bg-[#0c0d10] hover:bg-red-600 text-stone-300 hover:text-white transition-colors"
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
