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
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Compass,
  Check,
  Receipt,
  Layers,
  CalendarDays,
  PieChart as PieIcon,
  Tag,
  Eye,
  ExternalLink
} from 'lucide-react';

const CATEGORY_COLORS: { [key: string]: string } = {
  stay: '#3B82F6', // Blue
  transport: '#6366F1', // Indigo
  activities: '#10B981', // Emerald
  meals: '#F59E0B', // Amber
  misc: '#EC4899', // Pink
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
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        
        {/* Top Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl mb-8">
          <div className="h-64 sm:h-80 relative">
            <img
              src={trip.cover_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
              alt={trip.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            
            {/* Status & Share Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-blue-400 text-xs font-bold uppercase tracking-wider border border-slate-800">
                {trip.status}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href={`/trips/share/${trip.share_code}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold backdrop-blur-md border border-slate-700 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Public View</span>
                </Link>
                <button
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold backdrop-blur-md shadow-md shadow-blue-500/20 transition-all"
                >
                  {shareCopied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{shareCopied ? 'Link Copied!' : 'Share Trip'}</span>
                </button>
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {trip.title}
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mt-1 line-clamp-2">
                  {trip.description}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-md">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Budget</span>
                  <p className="text-sm font-black text-emerald-400">
                    ${parseFloat(trip.total_budget || 0).toLocaleString()} {trip.currency}
                  </p>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Duration</span>
                  <p className="text-sm font-bold text-blue-400">
                    {financials?.durationDays || 7} Days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Interactive Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-8 overflow-x-auto">
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
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ITINERARY BUILDER */}
        {activeTab === 'builder' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Destination Stops & Daily Schedule</h2>
                <p className="text-slate-400 text-xs mt-0.5">Organize city stops, adjust stay dates, and schedule activities</p>
              </div>

              <button
                onClick={() => setShowAddStopModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Destination Stop</span>
              </button>
            </div>

            {/* Stops Accordion List */}
            {trip.stops?.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                <MapPin className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No destination stops added yet</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto mb-4">
                  Add your first city stop (e.g. Tokyo, Paris, Rome) to start scheduling day-by-day activities.
                </p>
                <button
                  onClick={() => setShowAddStopModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  + Add First Stop
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {trip.stops?.map((stop: any, index: number) => (
                  <div
                    key={stop.id}
                    className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl"
                  >
                    {/* Stop Header */}
                    <div className="p-5 sm:p-6 bg-slate-900 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <img
                          src={stop.city_image_url}
                          alt={stop.city_name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">{stop.city_name}</h3>
                            <span className="text-xs text-slate-400">({stop.country})</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                            <span>
                              {new Date(stop.arrival_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} -{' '}
                              {new Date(stop.departure_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => openActivityModalForStop(stop)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-semibold transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Schedule Activity</span>
                        </button>
                        <button
                          onClick={() => handleDeleteStop(stop.id)}
                          title="Delete Stop"
                          className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Scheduled Activities for this Stop */}
                    <div className="p-5 sm:p-6 bg-slate-950/50">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Scheduled Experiences & Sightseeing ({stop.activities?.length || 0})
                      </h4>

                      {stop.activities?.length === 0 ? (
                        <p className="text-xs text-slate-500 italic py-2">
                          No activities scheduled for {stop.city_name} yet. Click "Schedule Activity" above to add sightseeing or food tours!
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {stop.activities?.map((act: any) => (
                            <div
                              key={act.id}
                              className="bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                                  <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-white">
                                    {act.custom_title || act.original_activity_name || 'Activity'}
                                  </p>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                                    <span className="capitalize text-blue-400 font-semibold">{act.category}</span>
                                    <span>&bull;</span>
                                    <span>{act.start_time} - {act.end_time}</span>
                                    <span>&bull;</span>
                                    <span className="text-emerald-400 font-bold">${parseFloat(act.cost).toFixed(0)}</span>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => handleDeleteActivity(act.id)}
                                className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
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
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white tracking-tight mb-2 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-400" />
              Day-by-Day Journey Flow
            </h2>
            <p className="text-slate-400 text-xs mb-8">A chronological overview of all destinations, dates, and experiences</p>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-blue-500/30 space-y-8">
              {trip.stops?.map((stop: any, idx: number) => (
                <div key={stop.id} className="relative">
                  {/* Timeline Dot Marker */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-blue-600 border-4 border-slate-950 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                    {idx + 1}
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded-md">
                          Stop {idx + 1} &bull; {stop.country}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1">{stop.city_name}</h3>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(stop.arrival_date).toLocaleDateString()} &rarr; {new Date(stop.departure_date).toLocaleDateString()}
                      </span>
                    </div>

                    {stop.notes && (
                      <p className="text-xs text-slate-400 bg-slate-950/50 p-2.5 rounded-xl mb-3">
                        📌 {stop.notes}
                      </p>
                    )}

                    <div className="space-y-2">
                      {stop.activities?.map((act: any) => (
                        <div key={act.id} className="text-xs flex items-center justify-between bg-slate-950 p-2.5 rounded-xl text-slate-300">
                          <span className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
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
          <div className="space-y-8">
            
            {/* Overbudget Warning Alert (if spending exceeds target) */}
            {financials?.isOverBudget && (
              <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-4 shadow-xl">
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
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Target Budget</span>
                <div className="text-2xl font-black text-white mt-1">${financials?.totalBudget || trip.total_budget}</div>
                <div className="text-[11px] text-slate-400 mt-1">Planned allocation</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Total Spent</span>
                <div className="text-2xl font-black text-emerald-400 mt-1">${financials?.totalSpent || 0}</div>
                <div className="text-[11px] text-slate-400 mt-1">{financials?.budgetUsagePercent || 0}% of budget used</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Remaining Funds</span>
                <div className="text-2xl font-black text-blue-400 mt-1">${financials?.remainingBudget || 0}</div>
                <div className="text-[11px] text-slate-400 mt-1">Available buffer</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Daily Budget Avg</span>
                <div className="text-2xl font-black text-amber-400 mt-1">${financials?.dailyBudgetAllowance || 0} / day</div>
                <div className="text-[11px] text-slate-400 mt-1">Avg spent: ${financials?.avgDailySpent || 0}</div>
              </div>
            </div>

            {/* Recharts Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Category Breakdown Pie Chart */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-blue-400" />
                  Expenses by Category
                </h3>

                {pieData.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-xs text-slate-500">
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
                        <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', fontSize: '12px' }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Daily Spend Timeline Bar Chart */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  Daily Spend Trajectory ($)
                </h3>

                {(!financials?.dailyTimeline || financials?.dailyTimeline.length === 0) ? (
                  <div className="h-64 flex items-center justify-center text-xs text-slate-500">
                    No timeline records available yet.
                  </div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financials.dailyTimeline}>
                        <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickFormatter={(val) => val.substring(5)} />
                        <YAxis stroke="#64748B" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', fontSize: '12px' }} />
                        <Bar dataKey="amount" fill="#3B82F6" radius={[6, 6, 0, 0]} />
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
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Itemized Trip Expenses</h2>
                <p className="text-slate-400 text-xs mt-0.5">Track actual receipts, stays, and meals</p>
              </div>

              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Log Expense</span>
              </button>
            </div>

            {trip.expenses?.length === 0 ? (
              <p className="text-xs text-slate-500 py-10 text-center">No expenses logged yet. Click "+ Log Expense" to start tracking!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {trip.expenses?.map((exp: any) => (
                      <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 text-slate-400 font-mono">
                          {new Date(exp.expense_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 font-bold text-white">{exp.title}</td>
                        <td className="py-3 px-4">
                          <span
                            className="px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase"
                            style={{
                              backgroundColor: `${CATEGORY_COLORS[exp.category] || '#64748B'}20`,
                              color: CATEGORY_COLORS[exp.category] || '#94A3B8',
                            }}
                          >
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{exp.payment_method || 'Card'}</td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-400">
                          ${parseFloat(exp.amount).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Add Destination Stop</h3>
            <p className="text-xs text-slate-400 mb-6">Select a world city to add to this multi-city itinerary</p>

            <form onSubmit={handleAddStopSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Select City *</label>
                <select
                  required
                  value={newStopData.cityId}
                  onChange={(e) => setNewStopData({ ...newStopData, cityId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
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
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Arrival Date *</label>
                  <input
                    type="date"
                    required
                    value={newStopData.arrivalDate}
                    onChange={(e) => setNewStopData({ ...newStopData, arrivalDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Departure Date *</label>
                  <input
                    type="date"
                    required
                    value={newStopData.departureDate}
                    onChange={(e) => setNewStopData({ ...newStopData, departureDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Stay Notes / Hotel</label>
                <input
                  type="text"
                  placeholder="e.g. Traditional Ryokan or Central Hotel"
                  value={newStopData.notes}
                  onChange={(e) => setNewStopData({ ...newStopData, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddStopModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">
              Schedule Experience in {selectedStopForActivity?.city_name}
            </h3>
            <p className="text-xs text-slate-400 mb-6">Choose a curated experience or type a custom activity</p>

            <form onSubmit={handleAddActivitySubmit} className="space-y-4">
              {cityActivitiesCatalog.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
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
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
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
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Activity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunset Rickshaw Tour"
                  value={newActivityData.customTitle}
                  onChange={(e) => setNewActivityData({ ...newActivityData, customTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Category</label>
                  <select
                    value={newActivityData.category}
                    onChange={(e) => setNewActivityData({ ...newActivityData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
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
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Estimated Cost ($)</label>
                  <input
                    type="number"
                    value={newActivityData.cost}
                    onChange={(e) => setNewActivityData({ ...newActivityData, cost: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newActivityData.activityDate}
                    onChange={(e) => setNewActivityData({ ...newActivityData, activityDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newActivityData.startTime}
                    onChange={(e) => setNewActivityData({ ...newActivityData, startTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newActivityData.endTime}
                    onChange={(e) => setNewActivityData({ ...newActivityData, endTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Log Actual Expense</h3>
            <p className="text-xs text-slate-400 mb-6">Track itemized receipts and stays against your target budget</p>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Title / Vendor *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shinkansen Bullet Train Ticket"
                  value={newExpenseData.title}
                  onChange={(e) => setNewExpenseData({ ...newExpenseData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Category</label>
                  <select
                    value={newExpenseData.category}
                    onChange={(e) => setNewExpenseData({ ...newExpenseData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="stay">Stay & Hotel</option>
                    <option value="transport">Transport & Transit</option>
                    <option value="activities">Activities & Entry</option>
                    <option value="meals">Food & Dining</option>
                    <option value="misc">Miscellaneous</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Amount ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={newExpenseData.amount}
                    onChange={(e) => setNewExpenseData({ ...newExpenseData, amount: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newExpenseData.expenseDate}
                    onChange={(e) => setNewExpenseData({ ...newExpenseData, expenseDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Payment Method</label>
                  <select
                    value={newExpenseData.paymentMethod}
                    onChange={(e) => setNewExpenseData({ ...newExpenseData, paymentMethod: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Card">Credit/Debit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Online">Online / Wire</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
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
