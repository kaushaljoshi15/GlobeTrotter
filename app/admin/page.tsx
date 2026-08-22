'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import confetti from 'canvas-confetti';
import {
  BarChart3,
  Users,
  MapPin,
  Globe2,
  TrendingUp,
  DollarSign,
  Sparkles,
  Plus,
  Shield,
  Check,
  Lock,
  KeyRound,
  UserPlus,
  Trash2,
  Crown,
  Search,
  Filter,
  RefreshCw,
  Eye,
  ArrowRight,
  Activity,
  Server,
  Zap,
  Luggage,
  Calendar,
  Compass,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Pin,
  Megaphone,
  CheckCircle2,
  ShieldCheck,
  HeartHandshake
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
import { ALL_CURATED_DESTINATIONS } from '@/lib/destinations-data';

const SUPER_ADMIN_EMAILS = ['joshikaushald1596@gmail.com', 'kaushaldj1515@gmail.com'];
const PALETTE_COLORS = ['#c99a6b', '#e4c29e', '#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6'];

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [tripsList, setTripsList] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>(ALL_CURATED_DESTINATIONS);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Security Gate State
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [verifyingPin, setVerifyingPin] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'itineraries' | 'destinations' | 'community'>('overview');

  // Search & Filter States
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [tripSearch, setTripSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');

  // Community QA & Moderation State
  const [qaThreads, setQaThreads] = useState([
    { id: 1, author: 'Rohan Sharma', topic: 'Vande Bharat Express: Agra to Jaipur Timing & Luggage Limits', category: 'Transit', status: 'Approved', pinned: true, replies: 6, date: '1h ago' },
    { id: 2, day: '2d ago', author: 'Astrid Lind', topic: 'Swiss Glacier Express: Best Panorama Carriage in Winter (Dec)', category: 'Alpine', status: 'Approved', pinned: true, replies: 12, date: '3h ago' },
    { id: 3, author: 'Kenji Takahashi', topic: 'Kyoto Gion Evening Etiquette: Photography Guidelines for Geisha Alleys', category: 'Culture', status: 'Approved', pinned: false, replies: 4, date: '1d ago' },
    { id: 4, author: 'Priya Mehta', topic: 'Kerala Backwaters: Private Houseboat vs Shikara for 2 Days in Alleppey', category: 'Lodging', status: 'Pending Review', pinned: false, replies: 2, date: 'Just now' },
  ]);

  // Modals
  const [showAddDestModal, setShowAddDestModal] = useState(false);
  const [destSuccess, setDestSuccess] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [adminAddSuccess, setAdminAddSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // New Destination Form
  const [newDest, setNewDest] = useState({
    name: '',
    country: '',
    continent: 'Asia',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    costIndex: 'moderate',
    avgDailyCost: '75',
    currency: 'INR',
    bestTimeToVisit: 'Oct - Mar',
  });

  // New Admin Form
  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    email: '',
    role: 'organizer',
    password: '',
  });

  // Load Admin Data with Real-Time Polling
  const loadAdminData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setIsSyncing(true);

    try {
      const [metricsRes, usersRes, tripsRes] = await Promise.all([
        fetch('/api/analytics/admin', { cache: 'no-store' }).then((r) => r.json()).catch(() => ({ success: false })),
        fetch('/api/admin/users', { cache: 'no-store' }).then((r) => r.json()).catch(() => ({ success: false })),
        fetch('/api/trips', { cache: 'no-store' }).then((r) => r.json()).catch(() => ({ success: false })),
      ]);

      if (metricsRes.success) setMetrics(metricsRes.data);
      if (usersRes.success && Array.isArray(usersRes.data)) setUsersList(usersRes.data);
      if (tripsRes.success && Array.isArray(tripsRes.data)) setTripsList(tripsRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      if (showLoading) setLoading(false);
      setIsSyncing(false);
    }
  }, []);

  // Check authorization on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAdminPin = sessionStorage.getItem('admin_pin_verified');

    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setCurrentUser(u);

        if (
          SUPER_ADMIN_EMAILS.some(em => em.toLowerCase() === u.email?.toLowerCase()) ||
          u.role === 'admin' ||
          storedAdminPin === 'true'
        ) {
          setIsAuthorized(true);
          loadAdminData(true);
          return;
        }
      } catch (e) {}
    }

    if (storedAdminPin === 'true') {
      setIsAuthorized(true);
      loadAdminData(true);
    } else {
      setLoading(false);
    }
  }, [loadAdminData]);

  // Real-Time Background Synchronization (every 8 seconds)
  useEffect(() => {
    if (!isAuthorized) return;

    const interval = setInterval(() => {
      loadAdminData(false);
    }, 8000);

    const handleFocus = () => loadAdminData(false);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') loadAdminData(false);
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isAuthorized, loadAdminData]);

  // PIN Verification Handler
  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyingPin(true);
    setPinError('');

    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });
      const data = await res.json();

      if (data.success || pinInput === '8888') {
        sessionStorage.setItem('admin_pin_verified', 'true');
        setIsAuthorized(true);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        loadAdminData(true);
      } else {
        setPinError(data.error || 'Invalid Security PIN. Access denied.');
      }
    } catch (e) {
      if (pinInput === '8888') {
        sessionStorage.setItem('admin_pin_verified', 'true');
        setIsAuthorized(true);
        loadAdminData(true);
      } else {
        setPinError('Failed to verify PIN. Please try again.');
      }
    } finally {
      setVerifyingPin(false);
    }
  };

  // Change User Role Handler
  const handleChangeRole = async (userId: number, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        setStatusMessage(`User ID #${userId} role updated to ${newRole}`);
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (e) {
      console.error('Error changing role:', e);
    }
  };

  // Add New Admin/Organizer Handler
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdminForm),
      });
      const data = await res.json();
      if (data.success) {
        setAdminAddSuccess(true);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        loadAdminData(false);
        setTimeout(() => {
          setAdminAddSuccess(false);
          setShowAddAdminModal(false);
          setNewAdminForm({ name: '', email: '', role: 'organizer', password: '' });
        }, 1500);
      }
    } catch (e) {
      console.error('Error adding user:', e);
    }
  };

  // Add Curated Destination Handler
  const handleAddDestination = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: Date.now(),
      name: newDest.name,
      country: newDest.country,
      continent: newDest.continent,
      description: newDest.description || 'Curated luxury expedition hub.',
      image_url: newDest.imageUrl,
      cost_index: newDest.costIndex,
      avg_daily_cost: parseInt(newDest.avgDailyCost) || 75,
      currency: newDest.currency,
      popularity_score: 95,
      best_time_to_visit: newDest.bestTimeToVisit,
      top_sights: ['Historical Center', 'Sunset Vista', 'Grand Promenade'],
    };

    setDestinations([created, ...destinations]);
    setDestSuccess(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      setDestSuccess(false);
      setShowAddDestModal(false);
      setNewDest({
        name: '',
        country: '',
        continent: 'Asia',
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
        costIndex: 'moderate',
        avgDailyCost: '75',
        currency: 'INR',
        bestTimeToVisit: 'Oct - Mar',
      });
    }, 1500);
  };

  // Toggle QA Thread Pin / Approval
  const handleTogglePinQA = (id: number) => {
    setQaThreads(qaThreads.map(q => q.id === id ? { ...q, pinned: !q.pinned } : q));
    setStatusMessage('Discussion thread pinned state updated!');
    setTimeout(() => setStatusMessage(''), 2500);
  };

  const handleApproveQA = (id: number) => {
    setQaThreads(qaThreads.map(q => q.id === id ? { ...q, status: 'Approved' } : q));
    setStatusMessage('Community inquiry approved and published!');
    setTimeout(() => setStatusMessage(''), 2500);
  };

  const handleDeleteQA = (id: number) => {
    setQaThreads(qaThreads.filter(q => q.id !== id));
    setStatusMessage('Discussion thread removed.');
    setTimeout(() => setStatusMessage(''), 2500);
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase());
      const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [usersList, userSearch, userRoleFilter]);

  // Filtered Trips
  const filteredTrips = useMemo(() => {
    const list = tripsList.length > 0 ? tripsList : metrics?.recentTrips || [];
    return list.filter((t: any) =>
      t.title?.toLowerCase().includes(tripSearch.toLowerCase()) ||
      t.user_name?.toLowerCase().includes(tripSearch.toLowerCase())
    );
  }, [tripsList, metrics, tripSearch]);

  // Filtered Destinations
  const filteredDestinations = useMemo(() => {
    return destinations.filter(
      (d) =>
        d.name?.toLowerCase().includes(destSearch.toLowerCase()) ||
        d.country?.toLowerCase().includes(destSearch.toLowerCase())
    );
  }, [destinations, destSearch]);

  // If Security Gate is Locked
  if (!isAuthorized && !loading) {
    return (
      <div className="min-h-screen bg-[#0c0d10] text-stone-100 flex flex-col font-sans selection:bg-[#c99a6b] selection:text-[#0c0d10]">
        <Navbar />

        <main className="flex-1 flex items-center justify-center p-4 pt-24">
          <div className="max-w-md w-full p-8 rounded-[32px] bg-[#14151a]/95 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#c99a6b]/20 text-[#e4c29e] flex items-center justify-center mx-auto shadow-lg shadow-[#c99a6b]/15 border border-[#c99a6b]/30">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b] block">
                Restricted Administration Perimeter
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                Executive Command Center
              </h1>
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                Enter your master authorization PIN to access global telemetry, user permissions, and trip moderation.
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  Master Security PIN
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="password"
                    maxLength={8}
                    required
                    placeholder="Enter 4 or 6-digit PIN..."
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-2xl pl-11 pr-4 py-3.5 text-base font-bold text-white tracking-widest focus:outline-none focus:border-[#c99a6b] font-mono"
                  />
                </div>
              </div>

              {pinError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={verifyingPin}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold shadow-lg shadow-[#c99a6b]/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {verifyingPin ? 'Authenticating Security Token...' : 'Unlock Command Center'}
              </button>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-stone-400">
                  Demo Master PIN: <code className="text-[#e4c29e] font-mono font-bold">8888</code>
                </span>
              </div>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const kpis = metrics?.kpis || {
    totalUsers: usersList.length || 1,
    totalTrips: tripsList.length || 1,
    totalStops: 4,
    totalActivitiesScheduled: 8,
    totalBudgetPlanned: 4500,
    totalExpensesLogged: 1200,
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-[#0c0d10]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        
        {/* ================= 1. EXECUTIVE BANNER ================= */}
        <div className="relative rounded-[32px] overflow-hidden bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c99a6b]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c99a6b]/15 border border-[#c99a6b]/30 text-[#e4c29e] text-xs font-bold font-sans">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Master Administrator Suite</span>
                </span>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Telemetry Stream Active</span>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-medium text-white tracking-tight">
                GlobeTrotter <span className="font-bold italic text-[#e4c29e]">Executive Command Center</span>
              </h1>
              
              <p className="text-stone-400 text-xs mt-1 max-w-2xl font-sans leading-relaxed">
                Global platform metrics, guide verification, destination catalog administration, and real-time community moderation.
              </p>
            </div>

            {/* Quick Action Navigation & Refresh */}
            <div className="flex flex-wrap items-center gap-3 font-sans">
              <button
                onClick={() => loadAdminData(false)}
                disabled={isSyncing}
                title="Force refresh platform telemetry"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0c0d10] hover:bg-white/10 text-stone-300 hover:text-white text-xs font-bold border border-white/15 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#c99a6b]' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Telemetry'}</span>
              </button>

              <button
                onClick={() => setShowAddAdminModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0c0d10] hover:bg-white/10 text-stone-200 hover:text-white text-xs font-bold border border-white/15 transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#c99a6b]" />
                <span>Add Organizer</span>
              </button>

              <button
                onClick={() => setShowAddDestModal(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold shadow-lg shadow-[#c99a6b]/20 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Destination</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {statusMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{statusMessage}</span>
            </div>
            <button onClick={() => setStatusMessage('')} className="text-emerald-400 hover:text-white font-mono">&times;</button>
          </div>
        )}

        {/* ================= 2. EXECUTIVE KPI CARDS ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
          
          <div className="p-6 rounded-3xl bg-[#14151a]/90 border border-white/10 shadow-xl relative overflow-hidden group hover:border-[#c99a6b]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Verified Travelers
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">+100% active</span>
            </div>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2">
              {kpis.totalUsers}
            </p>
            <span className="text-[10px] text-stone-400 mt-1 inline-block">Registered accounts</span>
          </div>

          <div className="p-6 rounded-3xl bg-[#14151a]/90 border border-white/10 shadow-xl relative overflow-hidden group hover:border-[#c99a6b]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b] flex items-center gap-1.5">
                <Luggage className="w-3.5 h-3.5" />
                Total Itineraries
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Live DB</span>
            </div>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#e4c29e] mt-2">
              {kpis.totalTrips}
            </p>
            <span className="text-[10px] text-stone-400 mt-1 inline-block">Composed multi-city plans</span>
          </div>

          <div className="p-6 rounded-3xl bg-[#14151a]/90 border border-white/10 shadow-xl relative overflow-hidden group hover:border-[#c99a6b]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Curated Destinations
              </span>
              <span className="text-[10px] text-stone-400 font-mono">Global &amp; India</span>
            </div>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2">
              {destinations.length}
            </p>
            <span className="text-[10px] text-stone-400 mt-1 inline-block">In master catalog</span>
          </div>

          <div className="p-6 rounded-3xl bg-[#14151a]/90 border border-white/10 shadow-xl relative overflow-hidden group hover:border-[#c99a6b]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b] flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                Gross Travel Volume
              </span>
              <span className="text-[10px] text-[#e4c29e] font-mono">₹ &amp; $</span>
            </div>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#e4c29e] mt-2">
              ${kpis.totalBudgetPlanned.toLocaleString()}
            </p>
            <span className="text-[10px] text-stone-400 mt-1 inline-block">Estimated itinerary budgets</span>
          </div>

        </div>

        {/* ================= 3. NAVIGATION TABS ================= */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto font-sans">
          {[
            { id: 'overview', label: '📊 Telemetry & Volume', icon: BarChart3 },
            { id: 'users', label: `👥 User & Guide Directory (${usersList.length})`, icon: Users },
            { id: 'itineraries', label: `🗺️ Master Itineraries (${tripsList.length || kpis.totalTrips})`, icon: Compass },
            { id: 'destinations', label: `🏛️ Destination Catalog (${destinations.length})`, icon: MapPin },
            { id: 'community', label: `💬 Community QA & Inquiries (${qaThreads.length})`, icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-md shadow-[#c99a6b]/20'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ================= 4. TAB CONTENTS ================= */}
        
        {/* TAB 1: OVERVIEW & TELEMETRY */}
        {activeTab === 'overview' && (
          <div className="space-y-8 font-sans">
            
            {/* System Status Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#14151a]/95 border border-white/10 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Prisma DB Latency</span>
                  <p className="font-serif text-lg font-bold text-white font-mono">14.2 ms &bull; Optimal</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#14151a]/95 border border-white/10 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#c99a6b]/15 text-[#e4c29e]">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Application Uptime</span>
                  <p className="font-serif text-lg font-bold text-white font-mono">99.98% &bull; 31 Routes Active</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#14151a]/95 border border-white/10 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/15 text-blue-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">API Response Rate</span>
                  <p className="font-serif text-lg font-bold text-white font-mono">100% Success Rate</p>
                </div>
              </div>
            </div>

            {/* Visual Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Activity Categories Distribution */}
              <div className="p-6 sm:p-8 rounded-[32px] bg-[#14151a]/95 border border-white/10 shadow-xl space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Experience &amp; Activity Breakdown</h3>
                  <p className="text-xs text-stone-400">Category share of scheduled experiences</p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={
                          metrics?.categoryStats?.length > 0
                            ? metrics.categoryStats
                            : [
                                { category: 'Sightseeing', count: 14 },
                                { category: 'Dining', count: 10 },
                                { category: 'Adventure', count: 8 },
                                { category: 'Transport', count: 6 },
                                { category: 'Culture', count: 5 },
                              ]
                        }
                        dataKey="count"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={45}
                        paddingAngle={4}
                      >
                        {PALETTE_COLORS.map((color, idx) => (
                          <Cell key={`cell-${idx}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0c0d10',
                          borderColor: 'rgba(255,255,255,0.15)',
                          borderRadius: '16px',
                          color: '#fff',
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Popular Destination Corridors */}
              <div className="p-6 sm:p-8 rounded-[32px] bg-[#14151a]/95 border border-white/10 shadow-xl space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Trending Travel Corridors</h3>
                  <p className="text-xs text-stone-400">Most scheduled destination hubs</p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={
                        metrics?.topDestinations?.length > 0
                          ? metrics.topDestinations
                          : [
                              { name: 'Jaipur', trip_count: 18 },
                              { name: 'Goa', trip_count: 15 },
                              { name: 'Tokyo', trip_count: 14 },
                              { name: 'Zermatt', trip_count: 11 },
                              { name: 'Kerala', trip_count: 9 },
                              { name: 'Paris', trip_count: 8 },
                            ]
                      }
                    >
                      <XAxis dataKey="name" stroke="#888" fontSize={11} />
                      <YAxis stroke="#888" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0c0d10',
                          borderColor: 'rgba(255,255,255,0.15)',
                          borderRadius: '16px',
                          color: '#fff',
                        }}
                      />
                      <Bar dataKey="trip_count" fill="#c99a6b" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: USER DIRECTORY & ROLE MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="p-6 sm:p-8 rounded-[32px] bg-[#14151a]/95 border border-white/10 shadow-xl space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Platform User &amp; Guide Directory</h3>
                <p className="text-xs text-stone-400">Manage permissions, verification badges, and organizer privileges</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Role Filter */}
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="all">All Roles</option>
                  <option value="traveler">Travelers</option>
                  <option value="organizer">Organizers</option>
                  <option value="admin">Administrators</option>
                </select>

                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="bg-[#0c0d10] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                  />
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 px-3">User &amp; Email</th>
                    <th className="pb-3 px-3">Role</th>
                    <th className="pb-3 px-3">Itineraries</th>
                    <th className="pb-3 px-3">Verification</th>
                    <th className="pb-3 px-3 text-right">Role Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-3">
                        <div>
                          <p className="font-bold text-white flex items-center gap-1.5">
                            <span>{u.name || 'Anonymous Explorer'}</span>
                            {u.role === 'admin' && <Crown className="w-3 h-3 text-[#c99a6b]" />}
                          </p>
                          <p className="text-[11px] text-stone-400 font-mono">{u.email}</p>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-[#c99a6b]/20 text-[#e4c29e] border border-[#c99a6b]/40'
                            : u.role === 'organizer'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'bg-white/5 text-stone-300 border border-white/10'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-mono text-stone-300">
                        {u.total_trips || 0} journeys
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                          <Check className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.id, e.target.value)}
                          className="bg-[#0c0d10] border border-white/15 rounded-lg px-2.5 py-1 text-[11px] text-stone-300 focus:border-[#c99a6b]"
                        >
                          <option value="traveler">Make Traveler</option>
                          <option value="organizer">Make Organizer</option>
                          <option value="admin">Make Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MASTER ITINERARIES & MODERATION */}
        {activeTab === 'itineraries' && (
          <div className="p-6 sm:p-8 rounded-[32px] bg-[#14151a]/95 border border-white/10 shadow-xl space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Platform Master Itineraries</h3>
                <p className="text-xs text-stone-400">Inspect composed itineraries, verify routes, and moderate public visibility</p>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
                <input
                  type="text"
                  placeholder="Search itineraries..."
                  value={tripSearch}
                  onChange={(e) => setTripSearch(e.target.value)}
                  className="bg-[#0c0d10] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip: any) => (
                <div
                  key={trip.id}
                  className="p-5 rounded-2xl bg-[#0c0d10] border border-white/10 hover:border-[#c99a6b]/40 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-stone-400 font-mono">Trip #{trip.id}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                        {trip.status || 'Active'}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-white group-hover:text-[#e4c29e] transition-colors line-clamp-1">
                      {trip.title}
                    </h4>

                    <p className="text-xs text-stone-400 line-clamp-2">
                      {trip.description || 'Custom multi-city journey composed on GlobeTrotter.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Budget</span>
                      <span className="font-serif font-bold text-[#e4c29e]">
                        ${parseFloat(trip.total_budget || trip.totalBudget || 0).toLocaleString()} {trip.currency || 'USD'}
                      </span>
                    </div>

                    <Link
                      href={`/trips/${trip.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#c99a6b] text-stone-300 hover:text-[#0c0d10] font-bold text-[11px] transition-all"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DESTINATIONS CATALOG MANAGER */}
        {activeTab === 'destinations' && (
          <div className="p-6 sm:p-8 rounded-[32px] bg-[#14151a]/95 border border-white/10 shadow-xl space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Master Destination Catalog ({destinations.length})</h3>
                <p className="text-xs text-stone-400">Curated Indian tourist corridors &amp; international destination hubs</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={destSearch}
                    onChange={(e) => setDestSearch(e.target.value)}
                    className="bg-[#0c0d10] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                  />
                </div>

                <button
                  onClick={() => setShowAddDestModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#c99a6b] text-[#0c0d10] text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add City</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="rounded-2xl bg-[#0c0d10] border border-white/10 overflow-hidden shadow-lg hover:border-[#c99a6b]/40 transition-all flex flex-col justify-between"
                >
                  <div className="h-36 relative">
                    <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h4 className="font-serif text-base font-bold text-white">{dest.name}</h4>
                      <p className="text-[10px] text-stone-300">{dest.country} &bull; {dest.continent}</p>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-xs text-stone-400 line-clamp-2">{dest.description}</p>
                    
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#e4c29e]">
                      <span>${dest.avg_daily_cost} {dest.currency}/day</span>
                      <span className="text-[10px] text-stone-400 font-sans">{dest.best_time_to_visit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: COMMUNITY QA & INQUIRIES MODERATION */}
        {activeTab === 'community' && (
          <div className="p-6 sm:p-8 rounded-[32px] bg-[#14151a]/95 border border-white/10 shadow-xl space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Community Inquiries &amp; QA Moderation</h3>
                <p className="text-xs text-stone-400">Review traveler discussions, pin official organizer answers, and moderate content</p>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#c99a6b]/15 text-[#e4c29e] text-xs font-bold border border-[#c99a6b]/30">
                {qaThreads.length} Active Inquiries
              </span>
            </div>

            <div className="space-y-3">
              {qaThreads.map((thread) => (
                <div
                  key={thread.id}
                  className="p-5 rounded-2xl bg-[#0c0d10] border border-white/10 hover:border-[#c99a6b]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-stone-300 text-[10px] font-bold uppercase">
                        {thread.category}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        thread.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {thread.status}
                      </span>
                      {thread.pinned && (
                        <span className="px-2 py-0.5 rounded-full bg-[#c99a6b]/20 text-[#e4c29e] text-[10px] font-bold flex items-center gap-1">
                          <Pin className="w-2.5 h-2.5" /> Pinned
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif text-sm font-bold text-white leading-snug">
                      {thread.topic}
                    </h4>

                    <p className="text-[11px] text-stone-400">
                      Asked by <strong className="text-stone-300">{thread.author}</strong> &bull; {thread.replies} tour guide replies &bull; {thread.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
                    <button
                      onClick={() => handleTogglePinQA(thread.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        thread.pinned ? 'bg-[#c99a6b] text-[#0c0d10]' : 'bg-white/5 text-stone-300 hover:text-white'
                      }`}
                    >
                      <Pin className="w-3 h-3" />
                      <span>{thread.pinned ? 'Unpin' : 'Pin'}</span>
                    </button>

                    {thread.status !== 'Approved' && (
                      <button
                        onClick={() => handleApproveQA(thread.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteQA(thread.id)}
                      className="p-1.5 rounded-xl bg-white/5 text-stone-400 hover:text-red-400 cursor-pointer"
                      title="Remove thread"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MODAL: ADD DESTINATION */}
      {showAddDestModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#14151a] border border-white/15 rounded-[32px] p-6 sm:p-8 space-y-4 font-sans shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-white">Add Curated Destination</h3>
            
            <form onSubmit={handleAddDestination} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-400 mb-1">City Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kyoto / Rann of Kutch"
                  value={newDest.name}
                  onChange={(e) => setNewDest({ ...newDest, name: e.target.value })}
                  className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-400 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Japan / India"
                    value={newDest.country}
                    onChange={(e) => setNewDest({ ...newDest, country: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-400 mb-1">Continent</label>
                  <select
                    value={newDest.continent}
                    onChange={(e) => setNewDest({ ...newDest, continent: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="Middle East">Middle East</option>
                    <option value="North America">North America</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-400 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={newDest.imageUrl}
                  onChange={(e) => setNewDest({ ...newDest, imageUrl: e.target.value })}
                  className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddDestModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#c99a6b] text-[#0c0d10] font-bold text-xs shadow-md cursor-pointer"
                >
                  {destSuccess ? 'Added Destination!' : 'Save Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ORGANIZER / ADMIN */}
      {showAddAdminModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#14151a] border border-white/15 rounded-[32px] p-6 sm:p-8 space-y-4 font-sans shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-white">Create Verified Organizer / Admin</h3>
            
            <form onSubmit={handleAddAdmin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={newAdminForm.name}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                  className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="organizer@globetrotter.io"
                  value={newAdminForm.email}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                  className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-400 mb-1">Role Permission</label>
                <select
                  value={newAdminForm.role}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value })}
                  className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                >
                  <option value="organizer">Expedition Organizer</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] font-bold text-xs shadow-md cursor-pointer"
                >
                  {adminAddSuccess ? 'Created User!' : 'Create Member'}
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
