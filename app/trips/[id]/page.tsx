'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import confetti from 'canvas-confetti';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import {
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  ArrowRight,
  Clock,
  Share2,
  Trash2,
  AlertTriangle,
  Sparkles,
  Check,
  Receipt,
  Layers,
  CalendarDays,
  PieChart as PieIcon,
  Eye
} from 'lucide-react';

const CATEGORY_COLORS: { [key: string]: string } = {
  stay: '#c99a6b', // Gold
  transport: '#e4c29e', // Light Gold
  activities: '#10B981', // Emerald
  meals: '#F59E0B', // Amber
  misc: '#8B5CF6', // Purple
};

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const tripId = parseInt(id);

  const [trip, setTrip] = useState<any>(null);
  const [financials, setFinancials] = useState<any>(null);
  const [availableDestinations, setAvailableDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'builder' | 'timeline' | 'analytics' | 'expenses'>('builder');

  // Modals state
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [selectedStopForActivity, setSelectedStopForActivity] = useState<any>(null);
  const [cityActivitiesCatalog, setCityActivitiesCatalog] = useState<any[]>([]);

  // Add Stop Form State
  const [newStopData, setNewStopData] = useState({
    cityId: '',
    arrivalDate: '',
    departureDate: '',
    stayCostEstimated: '150',
    transportCostEstimated: '80',
    notes: '',
  });

  // Add Activity Form State
  const [newActivityData, setNewActivityData] = useState({
    activityId: '',
    customTitle: '',
    category: 'sightseeing',
    activityDate: '',
    startTime: '10:00',
    endTime: '12:30',
    cost: '30',
    notes: '',
  });

  // Add Expense Form State
  const [newExpenseData, setNewExpenseData] = useState({
    tripStopId: '',
    category: 'meals',
    title: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Card',
  });

  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    loadTripData();
    loadDestinations();
  }, [tripId]);

  async function loadTripData() {
    try {
      const [tripRes, finRes] = await Promise.all([
        fetch(`/api/trips/${tripId}`).then((r) => r.json()),
        fetch(`/api/trips/${tripId}/expenses`).then((r) => r.json()),
      ]);

      if (tripRes.success) setTrip(tripRes.data);
      if (finRes.success) setFinancials(finRes.data);
    } catch (err) {
      console.error('Error loading trip details:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadDestinations() {
    try {
      const res = await fetch('/api/destinations');
      const data = await res.json();
      if (data.success) setAvailableDestinations(data.data || []);
    } catch (e) {}
  }

  // Add Stop Handler
  const handleAddStopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/trips/${tripId}/stops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStopData),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddStopModal(false);
        setNewStopData({
          cityId: '',
          arrivalDate: '',
          departureDate: '',
          stayCostEstimated: '150',
          transportCostEstimated: '80',
          notes: '',
        });
        loadTripData();
      }
    } catch (err) {
      console.error('Error adding stop:', err);
    }
  };

  // Delete Stop Handler
  const handleDeleteStop = async (stopId: number) => {
    if (!confirm('Are you sure you want to remove this destination stop?')) return;
    try {
      const res = await fetch(`/api/trips/${tripId}/stops/${stopId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) loadTripData();
    } catch (err) {
      console.error('Error deleting stop:', err);
    }
  };

  // Open Add Activity Modal for a Stop
  const openActivityModalForStop = async (stop: any) => {
    setSelectedStopForActivity(stop);
    setNewActivityData({
      ...newActivityData,
      activityDate: stop.arrival_date ? stop.arrival_date.split('T')[0] : '',
    });

    // Fetch activities for this city
    try {
      const res = await fetch(`/api/activities?city_id=${stop.city_id}`);
      const data = await res.json();
      if (data.success) setCityActivitiesCatalog(data.data || []);
    } catch (e) {}

    setShowAddActivityModal(true);
  };

  // Add Activity Handler
  const handleAddActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStopForActivity) return;

    try {
      const res = await fetch(`/api/trips/${tripId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripStopId: selectedStopForActivity.id,
          ...newActivityData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddActivityModal(false);
        loadTripData();
      }
    } catch (err) {
      console.error('Error adding activity:', err);
    }
  };

  // Delete Activity Handler
  const handleDeleteActivity = async (activityId: number) => {
    try {
      const res = await fetch(`/api/trips/${tripId}/activities/${activityId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) loadTripData();
    } catch (err) {
      console.error('Error removing activity:', err);
    }
  };

  // Add Expense Handler
  const handleAddExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpenseData),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddExpenseModal(false);
        setNewExpenseData({
          tripStopId: '',
          category: 'meals',
          title: '',
          amount: '',
          expenseDate: new Date().toISOString().split('T')[0],
          paymentMethod: 'Card',
        });
        loadTripData();
      }
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  // Delete Expense Handler
  const handleDeleteExpense = async (expenseId: number) => {
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses/${expenseId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) loadTripData();
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  // Share Copy
  const handleCopyShareLink = () => {
    if (!trip) return;
    const url = `${window.location.origin}/trips/share/${trip.share_code}`;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  if (loading || !trip) {
    return (
      <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#c99a6b] border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  // Prepare chart data
  const pieData = financials?.categories?.map((cat: any) => ({
    name: cat.category.toUpperCase(),
    value: parseFloat(cat.total_amount),
    color: CATEGORY_COLORS[cat.category] || '#94A3B8',
  })) || [];

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        
        {/* Top Hero Banner */}
        <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl mb-10">
          <div className="h-64 sm:h-80 relative">
            <img
              src={trip.cover_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
              alt={trip.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-[#0c0d10]/60 to-transparent" />
            
            {/* Status & Share Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between font-sans">
              <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#e4c29e] text-[10px] font-bold uppercase tracking-widest border border-white/20">
                {trip.status}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href={`/trips/share/${trip.share_code}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-white/10 text-stone-200 text-xs font-semibold backdrop-blur-md border border-white/20 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Public Atelier</span>
                </Link>
                <button
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md shadow-[#c99a6b]/20 transition-all cursor-pointer"
                >
                  {shareCopied ? <Check className="w-3.5 h-3.5 font-bold" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{shareCopied ? 'Link Copied!' : 'Share Itinerary'}</span>
                </button>
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
                  Composed Expedition
                </span>
                <h1 className="font-serif text-2xl sm:text-4xl font-medium text-white tracking-tight leading-tight mt-0.5">
                  {trip.title}
                </h1>
                <p className="font-serif text-stone-300 text-xs sm:text-sm max-w-2xl mt-1 line-clamp-2">
                  {trip.description}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-[#14151a]/90 p-3.5 rounded-2xl border border-white/10 backdrop-blur-md font-sans">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Total Budget</span>
                  <p className="font-serif text-base font-bold text-emerald-400">
                    ${parseFloat(trip.total_budget || 0).toLocaleString()} {trip.currency}
                  </p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Duration</span>
                  <p className="font-serif text-base font-bold text-[#e4c29e]">
                    {financials?.durationDays || 7} Days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Interactive Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-8 overflow-x-auto font-sans">
          {[
            { id: 'builder', label: 'Itinerary Builder', icon: Layers, count: trip.stops?.length },
            { id: 'timeline', label: 'Visual Timeline', icon: CalendarDays },
            { id: 'analytics', label: 'Budget Analytics', icon: PieIcon },
            { id: 'expenses', label: 'Expense Ledger', icon: Receipt, count: trip.expenses?.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] shadow-lg shadow-[#c99a6b]/20'
                    : 'bg-[#14151a] text-stone-400 border border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-stone-400'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ITINERARY BUILDER */}
        {activeTab === 'builder' && (
          <div className="space-y-8 font-sans">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
                  Route Architecture
                </span>
                <h2 className="font-serif text-2xl font-medium text-white tracking-tight mt-0.5">Destination Stops &amp; Daily Schedule</h2>
                <p className="text-stone-400 text-xs mt-0.5">Organize city stops, adjust stay dates, and schedule experiences</p>
              </div>

              <button
                onClick={() => setShowAddStopModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-md shadow-[#c99a6b]/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Destination Stop</span>
              </button>
            </div>

            {/* Stops Accordion List */}
            {trip.stops?.length === 0 ? (
              <div className="text-center py-16 bg-[#14151a]/60 border border-white/10 rounded-[32px] p-6">
                <MapPin className="w-10 h-10 text-[#c99a6b] mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-white mb-1">No destination stops added yet</h3>
                <p className="text-stone-400 text-xs max-w-sm mx-auto mb-4">
                  Add your first city stop (e.g. Kyoto, Zermatt, Positano) to start scheduling day-by-day activities.
                </p>
                <button
                  onClick={() => setShowAddStopModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  + Add First Stop
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {trip.stops?.map((stop: any, index: number) => (
                  <div
                    key={stop.id}
                    className="bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
                  >
                    {/* Stop Header */}
                    <div className="p-5 sm:p-6 bg-[#14151a] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] flex items-center justify-center font-serif font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <img
                          src={stop.city_image_url}
                          alt={stop.city_name}
                          className="w-14 h-14 rounded-2xl object-cover border border-white/10"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif text-xl font-bold text-white">{stop.city_name}</h3>
                            <span className="text-xs text-stone-400 font-sans">({stop.country})</span>
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-2 font-sans">
                            <Calendar className="w-3.5 h-3.5 text-[#c99a6b]" />
                            <span>
                              {new Date(stop.arrival_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} -{' '}
                              {new Date(stop.departure_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto font-sans">
                        <button
                          onClick={() => openActivityModalForStop(stop)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-[#e4c29e] border border-white/15 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Schedule Activity</span>
                        </button>
                        <button
                          onClick={() => handleDeleteStop(stop.id)}
                          title="Delete Stop"
                          className="p-2 rounded-full bg-[#0c0d10] hover:bg-red-500/20 text-stone-400 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Scheduled Activities for this Stop */}
                    <div className="p-5 sm:p-6 bg-[#0c0d10]/60">
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-3 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
                        Scheduled Experiences &amp; Sightseeing ({stop.activities?.length || 0})
                      </h4>

                      {stop.activities?.length === 0 ? (
                        <p className="text-xs text-stone-500 italic py-2">
                          No activities scheduled for {stop.city_name} yet. Click "Schedule Activity" above to add sightseeing or culinary experiences!
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {stop.activities?.map((act: any) => (
                            <div
                              key={act.id}
                              className="bg-[#14151a] border border-white/10 hover:border-white/20 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-white/5 text-[#e4c29e]">
                                  <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-white font-serif">
                                    {act.custom_title || act.original_activity_name || 'Activity'}
                                  </p>
                                  <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                                    <span className="capitalize text-[#e4c29e] font-semibold">{act.category}</span>
                                    <span>&bull;</span>
                                    <span>{act.start_time} - {act.end_time}</span>
                                    <span>&bull;</span>
                                    <span className="text-emerald-400 font-bold">${parseFloat(act.cost).toFixed(0)}</span>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => handleDeleteActivity(act.id)}
                                className="p-1.5 text-stone-500 hover:text-red-400 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VISUAL TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl font-sans">
            <h2 className="font-serif text-2xl font-medium text-white tracking-tight mb-2 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#c99a6b]" />
              Day-by-Day Journey Flow
            </h2>
            <p className="text-stone-400 text-xs mb-8">A chronological overview of all destinations, dates, and experiences</p>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-[#c99a6b]/30 space-y-8">
              {trip.stops?.map((stop: any, idx: number) => (
                <div key={stop.id} className="relative">
                  {/* Timeline Dot Marker */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] border-4 border-[#0c0d10] flex items-center justify-center text-[9px] font-bold text-[#0c0d10] shadow-md">
                    {idx + 1}
                  </div>

                  <div className="bg-[#0c0d10] border border-white/10 rounded-2xl p-5 shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-bold text-[#e4c29e] uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                          Stop {idx + 1} &bull; {stop.country}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-white mt-1">{stop.city_name}</h3>
                      </div>
                      <span className="text-xs text-stone-400">
                        {new Date(stop.arrival_date).toLocaleDateString()} &rarr; {new Date(stop.departure_date).toLocaleDateString()}
                      </span>
                    </div>

                    {stop.notes && (
                      <p className="text-xs text-stone-400 bg-[#14151a] p-2.5 rounded-xl mb-3">
                        📌 {stop.notes}
                      </p>
                    )}

                    <div className="space-y-2">
                      {stop.activities?.map((act: any) => (
                        <div key={act.id} className="text-xs flex items-center justify-between bg-[#14151a] p-2.5 rounded-xl text-stone-300">
                          <span className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-[#c99a6b]" />
                            <strong>{act.start_time}</strong> — {act.custom_title || act.original_activity_name}
                          </span>
                          <span className="text-emerald-400 font-bold">${parseFloat(act.cost)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SMART BUDGET ANALYTICS (Recharts) */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 font-sans">
            
            {/* Overbudget Warning Alert */}
            {financials?.isOverBudget && (
              <div className="p-5 rounded-[24px] bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-4 shadow-xl">
                <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold">Trip Budget Overrun Alert!</h4>
                  <p className="text-xs text-amber-200/80 mt-1">
                    Your current total expenses (${financials?.totalSpent}) exceed your planned budget target of ${financials?.totalBudget}. Consider reviewing your accommodation or transit entries.
                  </p>
                </div>
              </div>
            )}

            {/* Financial KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Target Budget</span>
                <div className="font-serif text-2xl font-bold text-white mt-1">${financials?.totalBudget || trip.total_budget}</div>
                <div className="text-[11px] text-stone-400 mt-1">Planned allocation</div>
              </div>

              <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total Spent</span>
                <div className="font-serif text-2xl font-bold text-emerald-400 mt-1">${financials?.totalSpent || 0}</div>
                <div className="text-[11px] text-stone-400 mt-1">{financials?.budgetUsagePercent || 0}% used</div>
              </div>

              <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Remaining Funds</span>
                <div className="font-serif text-2xl font-bold text-[#e4c29e] mt-1">${financials?.remainingBudget || 0}</div>
                <div className="text-[11px] text-stone-400 mt-1">Available buffer</div>
              </div>

              <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Daily Allowance</span>
                <div className="font-serif text-2xl font-bold text-amber-400 mt-1">${financials?.dailyBudgetAllowance || 0} / day</div>
                <div className="text-[11px] text-stone-400 mt-1">Avg spent: ${financials?.avgDailySpent || 0}</div>
              </div>
            </div>

            {/* Recharts Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Category Breakdown Pie Chart */}
              <div className="bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl flex flex-col justify-between">
                <h3 className="font-serif text-base font-bold text-white mb-4 flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-[#c99a6b]" />
                  Expenses by Category
                </h3>

                {pieData.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-xs text-stone-500">
                    No expense data logged yet. Add expenses in the ledger.
                  </div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={45}
                          paddingAngle={4}
                        >
                          {pieData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#14151a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px' }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Daily Spend Timeline Bar Chart */}
              <div className="bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl flex flex-col justify-between">
                <h3 className="font-serif text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#e4c29e]" />
                  Daily Spend Trajectory ($)
                </h3>

                {(!financials?.dailyTimeline || financials?.dailyTimeline.length === 0) ? (
                  <div className="h-64 flex items-center justify-center text-xs text-stone-500">
                    No timeline records available yet.
                  </div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financials.dailyTimeline}>
                        <XAxis dataKey="date" stroke="#78716c" fontSize={10} tickFormatter={(val) => val.substring(5)} />
                        <YAxis stroke="#78716c" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#14151a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px' }} />
                        <Bar dataKey="amount" fill="#c99a6b" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: EXPENSE LEDGER */}
        {activeTab === 'expenses' && (
          <div className="bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 font-sans">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
                  Financial Accounting
                </span>
                <h2 className="font-serif text-2xl font-medium text-white tracking-tight mt-0.5">Itemized Trip Expenses</h2>
                <p className="text-stone-400 text-xs mt-0.5">Track actual receipts, stays, and culinary experiences</p>
              </div>

              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-md shadow-[#c99a6b]/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Log Expense</span>
              </button>
            </div>

            {trip.expenses?.length === 0 ? (
              <p className="text-xs text-stone-500 py-10 text-center">No expenses logged yet. Click "+ Log Expense" to start tracking!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-stone-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {trip.expenses?.map((exp: any) => (
                      <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 text-stone-400 font-mono">
                          {new Date(exp.expense_date).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">{exp.title}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className="px-2.5 py-0.5 rounded-full font-semibold text-[10px] uppercase border"
                            style={{
                              backgroundColor: `${CATEGORY_COLORS[exp.category] || '#64748B'}20`,
                              borderColor: `${CATEGORY_COLORS[exp.category] || '#64748B'}40`,
                              color: CATEGORY_COLORS[exp.category] || '#94A3B8',
                            }}
                          >
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-stone-400">{exp.payment_method || 'Card'}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-emerald-400 font-serif text-sm">
                          ${parseFloat(exp.amount).toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="p-1 text-stone-500 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>

      {/* ================= ADD STOP MODAL ================= */}
      {showAddStopModal && (
        <div className="fixed inset-0 z-50 bg-[#0c0d10]/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#14151a] border border-white/15 rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl font-sans">
            <h3 className="font-serif text-xl font-bold text-white mb-1">Add Destination Stop</h3>
            <p className="text-xs text-stone-400 mb-6">Select a world city to add to this multi-city itinerary</p>

            <form onSubmit={handleAddStopSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Select City *</label>
                <select
                  required
                  value={newStopData.cityId}
                  onChange={(e) => setNewStopData({ ...newStopData, cityId: e.target.value })}
                  className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                >
                  <option value="">-- Choose a Destination --</option>
                  {availableDestinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}, {d.country} ({d.continent}) &bull; ${d.avg_daily_cost}/day
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Arrival Date *</label>
                  <input
                    type="date"
                    required
                    value={newStopData.arrivalDate}
                    onChange={(e) => setNewStopData({ ...newStopData, arrivalDate: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-4 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Departure Date *</label>
                  <input
                    type="date"
                    required
                    value={newStopData.departureDate}
                    onChange={(e) => setNewStopData({ ...newStopData, departureDate: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Stay Notes / Hotel</label>
                <input
                  type="text"
                  placeholder="e.g. Traditional Ryokan or Alpine Chalet"
                  value={newStopData.notes}
                  onChange={(e) => setNewStopData({ ...newStopData, notes: e.target.value })}
                  className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddStopModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-md shadow-[#c99a6b]/20"
                >
                  Add Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD ACTIVITY MODAL ================= */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 bg-[#0c0d10]/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#14151a] border border-white/15 rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl font-sans">
            <h3 className="font-serif text-xl font-bold text-white mb-1">
              Schedule Experience in {selectedStopForActivity?.city_name}
            </h3>
            <p className="text-xs text-stone-400 mb-6">Choose a curated experience or type a custom activity</p>

            <form onSubmit={handleAddActivitySubmit} className="space-y-4">
              {cityActivitiesCatalog.length > 0 && (
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                    Pick from Curated Catalog
                  </label>
                  <select
                    value={newActivityData.activityId}
                    onChange={(e) => {
                      const selected = cityActivitiesCatalog.find((a) => a.id === parseInt(e.target.value));
                      if (selected) {
                        setNewActivityData({
                          ...newActivityData,
                          activityId: e.target.value,
                          customTitle: selected.name,
                          category: selected.category,
                          cost: selected.cost.toString(),
                        });
                      } else {
                        setNewActivityData({ ...newActivityData, activityId: '' });
                      }
                    }}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-4 py-2.5 text-xs text-white"
                  >
                    <option value="">-- Custom Activity / Type Below --</option>
                    {cityActivitiesCatalog.map((act) => (
                      <option key={act.id} value={act.id}>
                        {act.name} (${act.cost} &bull; {act.category})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Activity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunset Rickshaw Tour or Alpine Hike"
                  value={newActivityData.customTitle}
                  onChange={(e) => setNewActivityData({ ...newActivityData, customTitle: e.target.value })}
                  className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Category</label>
                  <select
                    value={newActivityData.category}
                    onChange={(e) => setNewActivityData({ ...newActivityData, category: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-4 py-2.5 text-xs text-white"
                  >
                    <option value="sightseeing">Sightseeing</option>
                    <option value="food_tour">Food & Dining</option>
                    <option value="adventure">Adventure</option>
                    <option value="culture">Culture & History</option>
                    <option value="nightlife">Nightlife</option>
                    <option value="nature">Nature</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Estimated Cost ($)</label>
                  <input
                    type="number"
                    value={newActivityData.cost}
                    onChange={(e) => setNewActivityData({ ...newActivityData, cost: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newActivityData.activityDate}
                    onChange={(e) => setNewActivityData({ ...newActivityData, activityDate: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-4 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newActivityData.startTime}
                    onChange={(e) => setNewActivityData({ ...newActivityData, startTime: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-4 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newActivityData.endTime}
                    onChange={(e) => setNewActivityData({ ...newActivityData, endTime: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-md shadow-[#c99a6b]/20"
                >
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD EXPENSE MODAL ================= */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-[#0c0d10]/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#14151a] border border-white/15 rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl font-sans">
            <h3 className="font-serif text-xl font-bold text-white mb-1">Log Actual Expense</h3>
            <p className="text-xs text-stone-400 mb-6">Track itemized receipts and stays against your target budget</p>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Title / Vendor *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shinkansen Bullet Train Ticket"
                  value={newExpenseData.title}
                  onChange={(e) => setNewExpenseData({ ...newExpenseData, title: e.target.value })}
                  className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Category</label>
                  <select
                    value={newExpenseData.category}
                    onChange={(e) => setNewExpenseData({ ...newExpenseData, category: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-4 py-2.5 text-xs text-white"
                  >
                    <option value="stay">Stay & Hotel</option>
                    <option value="transport">Transport & Transit</option>
                    <option value="activities">Activities & Entry</option>
                    <option value="meals">Food & Dining</option>
                    <option value="misc">Miscellaneous</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Amount ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={newExpenseData.amount}
                    onChange={(e) => setNewExpenseData({ ...newExpenseData, amount: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newExpenseData.expenseDate}
                    onChange={(e) => setNewExpenseData({ ...newExpenseData, expenseDate: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-4 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Payment Method</label>
                  <select
                    value={newExpenseData.paymentMethod}
                    onChange={(e) => setNewExpenseData({ ...newExpenseData, paymentMethod: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-4 py-2.5 text-xs text-white"
                  >
                    <option value="Card">Credit/Debit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Online">Online / Wire</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-md shadow-[#c99a6b]/20"
                >
                  Log Expense
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
