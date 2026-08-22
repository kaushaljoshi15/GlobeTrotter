'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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
  List,
  ArrowUpDown,
  SlidersHorizontal,
  Sparkles,
  X,
  RefreshCw
} from 'lucide-react';

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchTrips = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setIsSyncing(true);

    try {
      let url = '/api/trips?';
      if (statusFilter !== 'all') url += `status=${statusFilter}&`;

      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setTrips(data.data || []);
      }
    } catch (err) {
      console.error('Error loading trips:', err);
    } finally {
      if (showLoading) setLoading(false);
      setIsSyncing(false);
    }
  }, [statusFilter]);

  // Initial fetch + Background Live Sync + Window Focus listener
  useEffect(() => {
    fetchTrips(true);

    // Auto sync every 10 seconds
    const interval = setInterval(() => {
      fetchTrips(false);
    }, 10000);

    const handleFocus = () => fetchTrips(false);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchTrips(false);
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [fetchTrips]);

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

  // Instant Multi-Field Deep Search & Sorting
  const sortedTrips = useMemo(() => {
    let list = [...trips];
    
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(t => {
        const titleMatch = t.title?.toLowerCase().includes(q);
        const descMatch = t.description?.toLowerCase().includes(q);
        const statusMatch = t.status?.toLowerCase().includes(q);
        const currencyMatch = t.currency?.toLowerCase().includes(q);
        
        // Deep search stops and activities
        const stopsMatch = t.stops?.some((s: any) => 
          s.city_name?.toLowerCase().includes(q) ||
          s.country?.toLowerCase().includes(q) ||
          s.notes?.toLowerCase().includes(q) ||
          s.activities?.some((a: any) => 
            (a.custom_title || a.name || '')?.toLowerCase().includes(q) ||
            a.category?.toLowerCase().includes(q)
          )
        );

        return titleMatch || descMatch || statusMatch || currencyMatch || stopsMatch;
      });
    }

    switch (sortBy) {
      case 'newest':
        return list.sort((a, b) => new Date(b.created_at || b.start_date).getTime() - new Date(a.created_at || a.start_date).getTime());
      case 'oldest':
        return list.sort((a, b) => new Date(a.created_at || a.start_date).getTime() - new Date(b.created_at || b.start_date).getTime());
      case 'budget-desc':
        return list.sort((a, b) => parseFloat(b.total_budget || 0) - parseFloat(a.total_budget || 0));
      case 'budget-asc':
        return list.sort((a, b) => parseFloat(a.total_budget || 0) - parseFloat(b.total_budget || 0));
      case 'stops':
        return list.sort((a, b) => (b.total_stops || b.stops?.length || 0) - (a.total_stops || a.stops?.length || 0));
      case 'title':
        return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      default:
        return list;
    }
  }, [trips, search, sortBy]);

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#e4c29e] text-[11px] font-sans font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
                <span>Personal Itineraries Portfolio</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Real-Time Sync</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-white">
              My Travel <span className="font-bold italic text-[#e4c29e]">Itineraries.</span>
            </h1>
            <p className="font-serif text-stone-300 text-xs sm:text-sm mt-1">
              Curate, review, and track your multi-city journeys and daily budget allowances.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto font-sans">
            <button
              onClick={() => fetchTrips(false)}
              disabled={isSyncing}
              title="Refresh latest itineraries"
              className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-full bg-[#14151a] hover:bg-white/10 text-stone-300 hover:text-white text-xs font-bold border border-white/15 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#c99a6b]' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
            </button>

            <Link
              href="/trips/new"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#c99a6b]/30 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Itinerary</span>
            </Link>
          </div>
        </div>

        {/* Filter & Sorting Controls Strip */}
        <div className="bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 p-5 rounded-[32px] mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-2xl font-sans">
          
          {/* Status Filter Pills */}
          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
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

          {/* Search & Sorting Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            
            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 bg-[#0c0d10] border border-white/15 rounded-full px-3.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#c99a6b]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-stone-200 focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-[#14151a] text-white">Date: Newest First</option>
                <option value="oldest" className="bg-[#14151a] text-white">Date: Oldest First</option>
                <option value="budget-desc" className="bg-[#14151a] text-white">Budget: High to Low</option>
                <option value="budget-asc" className="bg-[#14151a] text-white">Budget: Low to High</option>
                <option value="stops" className="bg-[#14151a] text-white">Most Destination Stops</option>
                <option value="title" className="bg-[#14151a] text-white">Alphabetical (A - Z)</option>
              </select>
            </div>

            {/* Instant Real-Time Search Bar */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search itineraries, cities, sights..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0c0d10] border border-white/15 rounded-full pl-10 pr-9 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b] transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Grid/List Switcher */}
            <div className="flex items-center bg-[#0c0d10] border border-white/10 rounded-full p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#c99a6b] text-[#0c0d10]' : 'text-stone-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#c99a6b] text-[#0c0d10]' : 'text-stone-400 hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Results Counter if searching */}
        {search && (
          <div className="mb-4 flex items-center justify-between text-xs text-stone-400 font-sans">
            <span>
              Found <strong className="text-[#e4c29e]">{sortedTrips.length}</strong> matching {sortedTrips.length === 1 ? 'itinerary' : 'itineraries'} for &ldquo;{search}&rdquo;
            </span>
            <button
              onClick={() => setSearch('')}
              className="text-xs text-[#e4c29e] hover:underline cursor-pointer"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-[#c99a6b] border-t-transparent animate-spin" />
          </div>
        ) : sortedTrips.length === 0 ? (
          <div className="text-center py-20 bg-[#14151a]/60 border border-white/10 rounded-[32px] p-8 max-w-lg mx-auto space-y-4 font-sans">
            <Globe2 className="w-12 h-12 text-[#c99a6b] mx-auto mb-2 opacity-80" />
            <h3 className="font-serif text-2xl font-bold text-white">
              {search ? 'No Matching Itineraries Found' : 'No Itineraries Yet'}
            </h3>
            <p className="font-serif text-xs text-stone-300">
              {search 
                ? `No journeys match your search term "${search}". Try adjusting your keywords or clearing the search bar.`
                : 'Start crafting your bespoke journey with multi-city stops, activity scheduling, and financial allowance.'
              }
            </p>
            <div className="pt-2">
              {search ? (
                <button
                  onClick={() => setSearch('')}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Clear Search Filter
                </button>
              ) : (
                <Link
                  href="/trips/new"
                  className="px-6 py-3 bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#c99a6b]/20"
                >
                  + Plan First Journey
                </Link>
              )}
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
            {sortedTrips.map((trip) => (
              <div
                key={trip.id}
                className="group bg-[#14151a]/95 border border-white/10 hover:border-[#c99a6b]/50 rounded-[32px] overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Cover Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={trip.cover_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14151a] via-transparent to-transparent" />
                  
                  {/* Status Badge */}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#e4c29e] text-[10px] font-bold uppercase tracking-wider border border-white/15">
                    {trip.status}
                  </span>

                  {/* Public Badge */}
                  <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-stone-300 text-[10px] border border-white/15">
                    {trip.is_public ? 'Public' : 'Private'}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#e4c29e] transition-colors line-clamp-1">
                      {trip.title}
                    </h3>
                    <p className="font-serif text-stone-300 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {trip.description || 'Custom multi-city journey itinerary.'}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5 font-sans">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#c99a6b]" />
                        <span>Dates</span>
                      </span>
                      <span className="text-white font-medium">
                        {new Date(trip.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} -{' '}
                        {new Date(trip.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#c99a6b]" />
                        <span>Stops</span>
                      </span>
                      <span className="text-white font-medium">{trip.total_stops || trip.stops?.length || 0} Destinations</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-[#c99a6b]" />
                        <span>Total Budget</span>
                      </span>
                      <span className="text-emerald-400 font-bold font-mono">
                        ${parseFloat(trip.total_budget || 0).toLocaleString()} {trip.currency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="px-6 py-4 bg-[#0c0d10]/60 border-t border-white/10 flex items-center justify-between font-sans">
                  <Link
                    href={`/trips/${trip.id}`}
                    className="text-xs font-bold text-[#e4c29e] hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors"
                  >
                    <span>Open Atelier</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleShare(trip.share_code, e)}
                      title="Share Itinerary Link"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedCode === trip.share_code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={(e) => handleDeleteTrip(trip.id, e)}
                      title="Delete Itinerary"
                      className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-stone-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          
          /* COMPACT LIST VIEW */
          <div className="bg-[#14151a]/95 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl divide-y divide-white/10 font-sans">
            {sortedTrips.map((trip) => (
              <div
                key={trip.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={trip.cover_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80'}
                    alt={trip.title}
                    className="w-16 h-16 rounded-2xl object-cover border border-white/10 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#e4c29e] transition-colors">
                        {trip.title}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-[#e4c29e] text-[9px] font-bold uppercase tracking-wider border border-white/10">
                        {trip.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-1 flex flex-wrap items-center gap-3">
                      <span>📅 {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
                      <span>&bull;</span>
                      <span>📍 {trip.total_stops || trip.stops?.length || 0} Stops</span>
                      <span>&bull;</span>
                      <span className="text-emerald-400 font-bold">${parseFloat(trip.total_budget || 0).toLocaleString()} {trip.currency}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={(e) => handleShare(trip.share_code, e)}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCode === trip.share_code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedCode === trip.share_code ? 'Copied' : 'Share'}</span>
                  </button>

                  <Link
                    href={`/trips/${trip.id}`}
                    className="px-4 py-2 rounded-xl bg-[#c99a6b] hover:bg-[#dfb182] text-[#0c0d10] text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={(e) => handleDeleteTrip(trip.id, e)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-stone-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
