'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Compass,
  Search,
  MapPin,
  Star,
  Clock,
  Plus,
  Sparkles,
  Check,
  ChevronRight,
  ArrowUpRight,
  X
} from 'lucide-react';

import CityAdaptiveBackground from '@/components/CityAdaptiveBackground';

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
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-white relative overflow-x-hidden">
      <CityAdaptiveBackground query={search || selectedCity?.name || 'kyoto'} showLiveTag={false} />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#e4c29e] text-[11px] font-sans font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
            <span>Global Travel Atlas &bull; Edition 2026</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-white tracking-tight mb-3">
            Curated Global <span className="font-bold italic text-[#e4c29e]">Destinations.</span>
          </h1>
          <p className="font-serif text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
            Explore world-renowned regions, review daily budget indexes, and compose curated stops into your bespoke itinerary.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 p-5 sm:p-6 rounded-[32px] mb-12 shadow-2xl space-y-4">
          
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city (e.g. Tokyo, Paris, Rome, Bali, Zermatt) or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0c0d10] border border-white/15 rounded-full pl-12 pr-32 py-3.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b] focus:ring-1 focus:ring-[#c99a6b] transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Continent Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-2 font-sans">Continent:</span>
            {['all', 'Europe', 'Asia', 'North America', 'Africa', 'Middle East'].map((cont) => (
              <button
                key={cont}
                onClick={() => setSelectedContinent(cont)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  selectedContinent === cont
                    ? 'bg-[#FAF8F5] text-[#0c0d10] font-bold shadow-md'
                    : 'bg-[#14151a] text-stone-300 border border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                {cont === 'all' ? 'All Continents' : cont}
              </button>
            ))}
          </div>

          {/* Cost Index Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-2 font-sans">Budget Index:</span>
            {['all', 'budget', 'moderate', 'luxury'].map((cost) => (
              <button
                key={cost}
                onClick={() => setSelectedCostIndex(cost)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCostIndex === cost
                    ? 'bg-[#c99a6b] text-[#0c0d10] font-bold shadow-md'
                    : 'bg-[#14151a] text-stone-400 border border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                {cost === 'all' ? 'All Budgets' : cost}
              </button>
            ))}
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-20">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => openCityDetails(dest.id)}
              className="group rounded-[28px] bg-[#14151a]/90 backdrop-blur-xl border border-white/10 hover:border-[#c99a6b]/50 overflow-hidden shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
            >
              <div className="h-56 relative overflow-hidden">
                <img
                  src={dest.image_url}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14151a] via-[#14151a]/30 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                    dest.cost_index === 'budget' 
                      ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30'
                      : dest.cost_index === 'luxury'
                      ? 'bg-amber-950/70 text-[#e4c29e] border-amber-500/30'
                      : 'bg-stone-900/80 text-stone-300 border-white/20'
                  }`}>
                    {dest.cost_index}
                  </span>
                </div>

                <div className="absolute bottom-3.5 left-5 right-5">
                  <h3 className="font-serif text-2xl font-bold text-white leading-tight group-hover:text-[#e4c29e] transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-stone-300 mt-0.5 font-sans">{dest.country} &bull; {dest.continent}</p>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-xs text-stone-300 mb-5 line-clamp-2 leading-relaxed font-sans">{dest.description}</p>

                <div className="flex items-center justify-between pt-3.5 border-t border-white/10 text-xs font-sans">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold">Avg Daily Spend</span>
                    <p className="font-bold text-white text-sm mt-0.5">${dest.avg_daily_cost} USD / day</p>
                  </div>

                  <span className="inline-flex items-center gap-1 font-bold text-[#e4c29e] group-hover:translate-x-1 transition-transform">
                    Explore Details <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Curated Experiences Spotlight */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
                Signature Experiences
              </span>
              <h2 className="font-serif text-3xl font-medium text-white tracking-tight mt-1 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                Curated Travel Experiences &amp; Sights
              </h2>
              <p className="text-stone-400 text-xs mt-0.5 font-sans">Handcrafted activities filtered by category</p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {['all', 'sightseeing', 'food_tour', 'adventure', 'culture', 'nightlife'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] font-bold shadow-md'
                      : 'bg-[#14151a] text-stone-300 border border-white/10 hover:text-white'
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
                className="bg-[#14151a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-[#c99a6b]/50 transition-all font-sans"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#e4c29e] uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                      {act.city_name}
                    </span>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      ★ {act.rating}
                    </span>
                  </div>

                  <h4 className="font-serif text-base font-bold text-white mb-1.5 line-clamp-1">{act.name}</h4>
                  <p className="text-xs text-stone-400 line-clamp-2 mb-3 leading-relaxed">{act.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                  <span className="text-emerald-400 font-bold">${parseFloat(act.cost).toFixed(0)} USD</span>
                  <span className="text-stone-400 flex items-center gap-1">
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
        <div className="fixed inset-0 z-50 bg-[#0c0d10]/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#14151a] border border-white/15 rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative font-sans">
            <button
              onClick={() => setSelectedCity(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-[#0c0d10]/80 text-stone-300 hover:text-white border border-white/20 z-10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* City Cover Banner */}
            <div className="h-60 relative">
              <img src={selectedCity.image_url} alt={selectedCity.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14151a] via-[#14151a]/40 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6">
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white">{selectedCity.name}</h3>
                <p className="text-xs text-stone-300 mt-1 font-sans">{selectedCity.country} &bull; {selectedCity.continent}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <p className="font-serif text-sm text-stone-300 leading-relaxed">{selectedCity.description}</p>

              {/* City Facts Grid */}
              <div className="grid grid-cols-3 gap-3 bg-[#0c0d10] p-4 rounded-2xl border border-white/10 text-center font-sans">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Budget Tier</span>
                  <p className="text-xs font-bold text-white capitalize mt-0.5">{selectedCity.cost_index}</p>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Daily Avg</span>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5">${selectedCity.avg_daily_cost} USD</p>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Best Season</span>
                  <p className="text-xs font-bold text-[#e4c29e] truncate mt-0.5">{selectedCity.best_time_to_visit || 'Spring/Autumn'}</p>
                </div>
              </div>

              {/* Curated Activities */}
              <div>
                <h4 className="text-xs font-bold uppercase text-stone-300 tracking-wider mb-3">
                  Top Curated Experiences ({selectedCity.activities?.length || 0})
                </h4>
                <div className="space-y-2.5">
                  {selectedCity.activities?.map((act: any) => (
                    <div key={act.id} className="bg-[#0c0d10] border border-white/10 p-3.5 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">{act.name}</p>
                        <p className="text-[11px] text-stone-400 mt-0.5 capitalize">{act.category} &bull; {act.duration_hours} hrs</p>
                      </div>
                      <span className="font-bold text-emerald-400">${act.cost}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => setSelectedCity(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-stone-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowAddToTripModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold shadow-lg shadow-[#c99a6b]/30 cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-[#0c0d10]/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#14151a] border border-white/15 rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl font-sans">
            <h3 className="font-serif text-xl font-bold text-white mb-1">Add {selectedCity?.name} to Itinerary</h3>
            <p className="text-xs text-stone-400 mb-6">Select which trip itinerary to add this destination stop into</p>

            {addedSuccess ? (
              <div className="py-6 text-center text-emerald-400 font-bold text-sm flex flex-col items-center gap-2">
                <Check className="w-8 h-8 rounded-full bg-emerald-500/20 p-1.5" />
                <span>Successfully added {selectedCity?.name} to your trip!</span>
              </div>
            ) : userTrips.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-stone-400 mb-4">You have no active trips yet. Create one first!</p>
                <Link
                  href="/trips/new"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] rounded-full text-xs font-bold shadow-md inline-block"
                >
                  Create New Trip
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-1.5">Choose Itinerary</label>
                  <select
                    value={selectedTripId}
                    onChange={(e) => setSelectedTripId(e.target.value)}
                    className="w-full bg-[#0c0d10] border border-white/20 rounded-full px-4 py-2.5 text-xs text-white"
                  >
                    {userTrips.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({new Date(t.start_date).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setShowAddToTripModal(false)}
                    className="px-5 py-2 rounded-full text-xs font-semibold text-stone-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCityToTrip}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold shadow-md shadow-[#c99a6b]/30"
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
