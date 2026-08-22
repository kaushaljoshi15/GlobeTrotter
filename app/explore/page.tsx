'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Compass,
  Search,
  Filter,
  MapPin,
  Star,
  DollarSign,
  Clock,
  Plus,
  Sparkles,
  Check,
  ChevronRight,
  Globe2,
  Calendar,
  X
} from 'lucide-react';

export default function ExplorePage() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [userTrips, setUserTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [selectedCostIndex, setSelectedCostIndex] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Selected City Detail Modal
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [showAddToTripModal, setShowAddToTripModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    fetchDestinations();
    fetchUserTrips();
  }, [selectedContinent, selectedCostIndex]);

  useEffect(() => {
    fetchActivities();
  }, [selectedCategory]);

  async function fetchDestinations() {
    try {
      let url = '/api/destinations?';
      if (selectedContinent !== 'all') url += `continent=${selectedContinent}&`;
      if (selectedCostIndex !== 'all') url += `cost_index=${selectedCostIndex}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setDestinations(data.data || []);
    } catch (e) {
      console.error('Error fetching destinations:', e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchActivities() {
    try {
      let url = '/api/activities?';
      if (selectedCategory !== 'all') url += `category=${selectedCategory}&`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setActivities(data.data || []);
    } catch (e) {}
  }

  async function fetchUserTrips() {
    try {
      const res = await fetch('/api/trips');
      const data = await res.json();
      if (data.success) {
        setUserTrips(data.data || []);
        if (data.data?.length > 0) setSelectedTripId(data.data[0].id.toString());
      }
    } catch (e) {}
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDestinations();
  };

  const openCityDetails = async (cityId: number) => {
    try {
      const res = await fetch(`/api/destinations/${cityId}`);
      const data = await res.json();
      if (data.success) setSelectedCity(data.data);
    } catch (e) {}
  };

  const handleAddCityToTrip = async () => {
    if (!selectedTripId || !selectedCity) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

      const res = await fetch(`/api/trips/${selectedTripId}/stops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityId: selectedCity.id,
          arrivalDate: today,
          departureDate: nextWeek,
          stayCostEstimated: selectedCity.avg_daily_cost * 5,
          transportCostEstimated: 120,
          notes: `Added from Explore catalog: ${selectedCity.name}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAddedSuccess(true);
        setTimeout(() => {
          setAddedSuccess(false);
          setShowAddToTripModal(false);
        }, 2000);
      }
    } catch (e) {
      console.error('Error adding city to trip:', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Global Travel Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Discover Global Destinations
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Browse world-class cities, check cost indexes, and add curated experiences into your custom itineraries.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-3xl mb-10 shadow-xl space-y-4">
          
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city (e.g. Tokyo, Paris, Rome, Bali) or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-11 pr-28 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
            >
              Search
            </button>
          </form>

          {/* Continent Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-xs font-bold text-slate-500 uppercase mr-2">Continent:</span>
            {['all', 'Europe', 'Asia', 'North America', 'Africa', 'Middle East'].map((cont) => (
              <button
                key={cont}
                onClick={() => setSelectedContinent(cont)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedContinent === cont
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cont === 'all' ? 'All Continents' : cont}
              </button>
            ))}
          </div>

          {/* Cost Index Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase mr-2">Cost Index:</span>
            {['all', 'budget', 'moderate', 'luxury'].map((cost) => (
              <button
                key={cost}
                onClick={() => setSelectedCostIndex(cost)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCostIndex === cost
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cost === 'all' ? 'All Budgets' : cost}
              </button>
            ))}
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => openCityDetails(dest.id)}
              className="group bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col cursor-pointer"
            >
              <div className="h-52 relative overflow-hidden">
                <img
                  src={dest.image_url}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
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

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-xl font-black text-white leading-tight group-hover:text-blue-300 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">{dest.country} &bull; {dest.continent}</p>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-400 mb-4 line-clamp-2">{dest.description}</p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Avg Daily Spend</span>
                    <p className="font-bold text-slate-200">${dest.avg_daily_cost} / day</p>
                  </div>

                  <span className="inline-flex items-center gap-1 font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                    Explore <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Curated Experiences Spotlight */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                Curated Travel Experiences & Sights
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">Top-rated activities filtered by category</p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {['all', 'sightseeing', 'food_tour', 'adventure', 'culture', 'nightlife'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activities.slice(0, 8).map((act) => (
              <div
                key={act.id}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded-md">
                      {act.city_name}
                    </span>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      ★ {act.rating}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1.5 line-clamp-1">{act.name}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">{act.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                  <span className="text-emerald-400 font-bold">${parseFloat(act.cost).toFixed(0)}</span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {act.duration_hours}h
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* ================= CITY DETAIL MODAL / DRAWER ================= */}
      {selectedCity && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedCity(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-slate-400 hover:text-white border border-slate-700 z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* City Cover Banner */}
            <div className="h-56 relative">
              <img src={selectedCity.image_url} alt={selectedCity.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <h3 className="text-3xl font-black text-white">{selectedCity.name}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{selectedCity.country} &bull; {selectedCity.continent}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-sm text-slate-300 leading-relaxed">{selectedCity.description}</p>

              {/* City Facts Grid */}
              <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Cost Index</span>
                  <p className="text-xs font-bold text-white capitalize">{selectedCity.cost_index}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Daily Avg</span>
                  <p className="text-xs font-bold text-emerald-400">${selectedCity.avg_daily_cost}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Best Time</span>
                  <p className="text-xs font-bold text-blue-400 truncate">{selectedCity.best_time_to_visit || 'Spring/Autumn'}</p>
                </div>
              </div>

              {/* Curated Activities */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
                  Top Curated Experiences ({selectedCity.activities?.length || 0})
                </h4>
                <div className="space-y-2.5">
                  {selectedCity.activities?.map((act: any) => (
                    <div key={act.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">{act.name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 capitalize">{act.category} &bull; {act.duration_hours} hrs</p>
                      </div>
                      <span className="font-black text-emerald-400">${act.cost}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setSelectedCity(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowAddToTripModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add {selectedCity.name} to My Itinerary</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD TO TRIP SELECTOR MODAL ================= */}
      {showAddToTripModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Add {selectedCity?.name} to Itinerary</h3>
            <p className="text-xs text-slate-400 mb-6">Select which trip itinerary to add this destination stop into</p>

            {addedSuccess ? (
              <div className="py-6 text-center text-emerald-400 font-bold text-sm flex flex-col items-center gap-2">
                <Check className="w-8 h-8 rounded-full bg-emerald-500/20 p-1.5" />
                <span>Successfully added {selectedCity?.name} to your trip!</span>
              </div>
            ) : userTrips.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-slate-400 mb-4">You have no active trips yet. Create one first!</p>
                <Link
                  href="/trips/new"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  Create New Trip
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Choose Itinerary</label>
                  <select
                    value={selectedTripId}
                    onChange={(e) => setSelectedTripId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {userTrips.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({new Date(t.start_date).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setShowAddToTripModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCityToTrip}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20"
                  >
                    Confirm &amp; Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
