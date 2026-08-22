'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import confetti from 'canvas-confetti';
import {
  User,
  Mail,
  DollarSign,
  Globe2,
  MapPin,
  Calendar,
  Save,
  Check,
  Sparkles,
  Shield,
  Trash2,
  Compass,
  Award,
  Luggage,
  TrendingUp,
  Receipt,
  Plus,
  ArrowRight,
  Plane,
  Heart,
  Settings,
  Crown,
  RefreshCw,
  ExternalLink,
  Star
} from 'lucide-react';

const AVATAR_GRADIENTS = [
  'from-[#c99a6b] via-[#dfb182] to-[#e4c29e]',
  'from-amber-600 via-orange-600 to-amber-700',
  'from-stone-600 via-stone-700 to-stone-800',
  'from-rose-700 via-amber-700 to-stone-800',
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [savedDestinations, setSavedDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'wishlist' | 'badges'>('profile');

  // Form State
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [travelStyle, setTravelStyle] = useState('Boutique Explorer');
  const [travelMotto, setTravelMotto] = useState('To travel is to compose life anew.');
  const [selectedGradient, setSelectedGradient] = useState(AVATAR_GRADIENTS[0]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const loadProfileData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setIsSyncing(true);

    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    let userId: number = 1;

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
        if (parsed.id) userId = parsed.id;
      } catch (e) {}
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const [profRes, savedRes, tripsRes] = await Promise.all([
        fetch(`/api/user/profile?userId=${userId}`, { headers, cache: 'no-store' }).then((r) => r.json()),
        fetch(`/api/user/saved-destinations?userId=${userId}`, { headers, cache: 'no-store' }).then((r) => r.json()),
        fetch(`/api/trips?userId=${userId}`, { headers, cache: 'no-store' }).then((r) => r.json()),
      ]);

      if (profRes.success && profRes.data) {
        setProfile(profRes.data);
        setName(profRes.data.name || '');
        setCurrency(profRes.data.preferred_currency || 'INR');
      } else if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setProfile(parsed);
        setName(parsed.name || '');
        setCurrency(parsed.preferred_currency || 'INR');
      }

      if (savedRes.success) {
        setSavedDestinations(savedRes.data || []);
      }

      // Populate trips list
      if (tripsRes.success && Array.isArray(tripsRes.data) && tripsRes.data.length > 0) {
        setTrips(tripsRes.data);
      } else if (profRes.data?.recentTrips?.length > 0) {
        setTrips(profRes.data.recentTrips);
      }
    } catch (e) {
      console.error('Error loading profile data:', e);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setProfile(parsed);
        setName(parsed.name || '');
      }
    } finally {
      if (showLoading) setLoading(false);
      setIsSyncing(false);
    }
  }, []);

  // Initial fetch + Background Live Sync + Window Focus listener
  useEffect(() => {
    loadProfileData(true);

    const interval = setInterval(() => {
      loadProfileData(false);
    }, 10000);

    const handleFocus = () => loadProfileData(false);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') loadProfileData(false);
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [loadProfileData]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const userId = currentUser?.id || profile?.id || 1;

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ userId, name, preferred_currency: currency }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        setTimeout(() => setSavedSuccess(false), 2500);

        setProfile((prev: any) => ({ ...prev, name, preferred_currency: currency }));

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const u = JSON.parse(storedUser);
          u.name = name;
          u.preferred_currency = currency;
          localStorage.setItem('user', JSON.stringify(u));
          window.dispatchEvent(new Event('storage'));
        }
      }
    } catch (e) {
      console.error('Error updating profile:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSaved = async (destId: number) => {
    try {
      const token = localStorage.getItem('token');
      const userId = currentUser?.id || profile?.id || 1;

      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const url = `/api/user/saved-destinations?destinationId=${destId}&userId=${userId}`;
      const res = await fetch(url, { method: 'DELETE', headers });
      const data = await res.json();
      if (data.success) {
        setSavedDestinations(savedDestinations.filter((d) => d.id !== destId));
      }
    } catch (e) {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0d10] text-stone-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#c99a6b] border-t-transparent animate-spin" />
          <p className="text-[11px] text-stone-400 font-bold uppercase tracking-[0.2em] font-sans">Loading Traveler Passport...</p>
        </div>
      </div>
    );
  }

  const roleTitle = profile?.role === 'admin' ? 'Super Administrator' : profile?.role === 'organizer' ? 'Expedition Organizer' : 'Verified Traveler';
  const initialLetter = (name || profile?.name || currentUser?.name || 'K')[0].toUpperCase();

  // Calculate live statistics
  const totalTripsCount = trips.length || profile?.stats?.total_trips || 0;
  const totalBudgetPlanned = trips.reduce((acc, t) => acc + parseFloat(t.total_budget || t.totalBudget || 0), 0) || profile?.stats?.total_budget_planned || 0;
  const totalStopsCount = trips.reduce((acc, t) => acc + (t.stops?.length || t.total_stops || t.stopsCount || 0), 0) || totalTripsCount * 2;

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-[#0c0d10]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        
        {/* ================= 1. TRAVELER PASSPORT HERO BANNER ================= */}
        <div className="relative overflow-hidden rounded-[32px] bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c99a6b]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* User Identity Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr ${selectedGradient} flex items-center justify-center text-3xl sm:text-4xl font-serif font-bold text-[#0c0d10] shadow-2xl shadow-[#c99a6b]/20 border-2 border-white/20 flex-shrink-0`}>
                {initialLetter}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#c99a6b]/15 border border-[#c99a6b]/30 text-[#e4c29e] text-xs font-sans font-bold">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{roleTitle}</span>
                  </span>
                  
                  <span className="text-[10px] text-stone-400 font-sans font-semibold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                    Passport #{profile?.id || currentUser?.id || '001'}
                  </span>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Sync</span>
                  </div>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-medium text-white tracking-tight flex items-center gap-2">
                  {name || profile?.name || currentUser?.name || 'Explorer'}
                </h1>
                
                <p className="text-stone-400 text-xs mt-1 font-sans flex items-center gap-2">
                  <span>{profile?.email || currentUser?.email || 'traveler@globetrotter.io'}</span>
                  <span>&bull;</span>
                  <span>Member since {new Date(profile?.created_at || currentUser?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </p>

                <p className="font-serif text-sm text-[#e4c29e] italic mt-2">
                  &ldquo;{travelMotto}&rdquo;
                </p>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-3 font-sans">
              <button
                onClick={() => loadProfileData(false)}
                disabled={isSyncing}
                title="Force refresh profile & itineraries"
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-[#0c0d10] hover:bg-white/10 text-stone-300 hover:text-white text-xs font-bold border border-white/15 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#c99a6b]' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
              </button>

              <Link
                href="/trips/new"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold shadow-lg shadow-[#c99a6b]/20 hover:shadow-[#c99a6b]/35 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Plan New Journey</span>
              </Link>

              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0c0d10] hover:bg-[#1a1b22] text-stone-200 hover:text-white text-xs font-bold border border-white/15 transition-all"
              >
                <Compass className="w-3.5 h-3.5 text-[#c99a6b]" />
                <span>Explore Catalog</span>
              </Link>
            </div>

          </div>
        </div>

        {/* ================= 2. REAL-TIME TRAVEL STATS KPI TILES ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-[#14151a]/90 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-[#c99a6b]/40 transition-all">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b] flex items-center gap-1.5">
              <Luggage className="w-3.5 h-3.5 text-[#c99a6b]" />
              Total Itineraries
            </span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2">{totalTripsCount}</p>
            <span className="text-[10px] text-stone-400 font-sans mt-1 inline-block">Composed journey plans</span>
          </div>

          <div className="bg-[#14151a]/90 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-[#c99a6b]/40 transition-all">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#c99a6b]" />
              Stops &amp; Cities
            </span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#e4c29e] mt-2">{totalStopsCount}</p>
            <span className="text-[10px] text-stone-400 font-sans mt-1 inline-block">Across destinations</span>
          </div>

          <div className="bg-[#14151a]/90 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-[#c99a6b]/40 transition-all">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b] flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#c99a6b]" />
              Saved Wishlist
            </span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2">{savedDestinations.length}</p>
            <span className="text-[10px] text-stone-400 font-sans mt-1 inline-block">Curated dream cities</span>
          </div>

          <div className="bg-[#14151a]/90 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-[#c99a6b]/40 transition-all">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#c99a6b]" />
              Planned Budget
            </span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#e4c29e] mt-2">
              ${totalBudgetPlanned.toLocaleString()}
            </p>
            <span className="text-[10px] text-stone-400 font-sans mt-1 inline-block">Estimated volume</span>
          </div>

        </div>

        {/* ================= 3. NAVIGATION TABS ================= */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-sans">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-md shadow-[#c99a6b]/20'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Profile &amp; Itineraries</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'wishlist'
                ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-md shadow-[#c99a6b]/20'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Saved Wishlist ({savedDestinations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-md shadow-[#c99a6b]/20'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Traveler Badges &amp; Milestones</span>
          </button>
        </div>

        {/* ================= 4. TAB CONTENTS ================= */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Settings (7 Cols) */}
            <div className="lg:col-span-7 bg-[#14151a]/95 border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-xl">
              <h2 className="font-serif text-xl font-bold text-white mb-1 flex items-center gap-2">
                <User className="w-4 h-4 text-[#c99a6b]" />
                Personal Information &amp; Preferences
              </h2>
              <p className="text-xs font-sans text-stone-400 mb-6">Update your display name, currency conversion base, and traveler persona</p>

              <form onSubmit={handleUpdateProfile} className="space-y-4 font-sans">
                
                {/* Avatar Theme Color */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">Avatar Theme</label>
                  <div className="flex items-center gap-3">
                    {AVATAR_GRADIENTS.map((grad, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedGradient(grad)}
                        className={`w-9 h-9 rounded-2xl bg-gradient-to-tr ${grad} transition-all cursor-pointer ${
                          selectedGradient === grad ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b]"
                  />
                </div>

                {/* Email (Disabled) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={profile?.email || currentUser?.email || 'kaushaldj1515@gmail.com'}
                    className="w-full bg-[#0c0d10]/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-stone-400 cursor-not-allowed font-mono"
                  />
                </div>

                {/* Travel Motto */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Traveler Bio / Motto</label>
                  <input
                    type="text"
                    value={travelMotto}
                    onChange={(e) => setTravelMotto(e.target.value)}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Preferred Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                    >
                      <option value="INR">INR (₹ - Indian Rupee)</option>
                      <option value="USD">USD ($ - United States Dollar)</option>
                      <option value="EUR">EUR (€ - Euro)</option>
                      <option value="GBP">GBP (£ - British Pound)</option>
                      <option value="JPY">JPY (¥ - Japanese Yen)</option>
                      <option value="AED">AED (د.إ - UAE Dirham)</option>
                      <option value="CAD">CAD ($ - Canadian Dollar)</option>
                      <option value="AUD">AUD ($ - Australian Dollar)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Travel Style</label>
                    <select
                      value={travelStyle}
                      onChange={(e) => setTravelStyle(e.target.value)}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                    >
                      <option value="Boutique Explorer">💎 Boutique &amp; Luxury Explorer</option>
                      <option value="Solo Backpacker">🎒 Solo Backpacker</option>
                      <option value="Family Planner">👨‍👩‍👧‍👦 Family &amp; Group</option>
                      <option value="Adventure Hiker">🏔️ Adventure &amp; Alpine</option>
                      <option value="Culinary Explorer">🍜 Culinary &amp; Culture</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/10">
                  {savedSuccess ? (
                    <span className="text-xs font-bold text-[#e4c29e] flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Preferences saved successfully!
                    </span>
                  ) : <div />}

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold shadow-md shadow-[#c99a6b]/20 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
                  </button>
                </div>

              </form>
            </div>

            {/* Recent Trips Quick Access (5 Cols) */}
            <div className="lg:col-span-5 bg-[#14151a]/95 border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-xl space-y-4 font-sans">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Luggage className="w-4 h-4 text-[#c99a6b]" />
                  Active Itineraries ({trips.length})
                </span>
                <Link href="/trips" className="text-xs text-[#e4c29e] hover:underline font-semibold">
                  View All &rarr;
                </Link>
              </h3>

              {trips.length > 0 ? (
                <div className="space-y-3">
                  {trips.slice(0, 4).map((t: any) => (
                    <Link
                      key={t.id}
                      href={`/trips/${t.id}`}
                      className="p-4 rounded-2xl bg-[#0c0d10] border border-white/10 hover:border-[#c99a6b]/50 transition-all flex items-center justify-between group block"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {t.cover_image_url || t.coverImageUrl ? (
                            <img src={t.cover_image_url || t.coverImageUrl} alt={t.title} className="w-full h-full object-cover" />
                          ) : (
                            <Compass className="w-5 h-5 text-[#c99a6b]" />
                          )}
                        </div>
                        <div>
                          <p className="font-serif text-sm font-bold text-white group-hover:text-[#e4c29e] transition-colors line-clamp-1">{t.title}</p>
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            {t.total_stops || t.stops?.length || t.stopsCount || 0} stops &bull; ${parseFloat(t.total_budget || t.totalBudget || 0).toLocaleString()} {t.currency || 'USD'}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-[#e4c29e] group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-[#0c0d10] rounded-2xl border border-white/5 p-6 space-y-3">
                  <Compass className="w-8 h-8 text-[#c99a6b] mx-auto opacity-70" />
                  <p className="text-xs text-stone-400">No journeys in portfolio yet.</p>
                  <Link
                    href="/trips/new"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c99a6b] text-[#0c0d10] text-xs font-bold shadow-md shadow-[#c99a6b]/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Plan First Journey</span>
                  </Link>
                </div>
              )}
            </div>

          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="bg-[#14151a]/95 border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Curated Travel Wishlist</h3>
                <p className="text-xs text-stone-400 mt-0.5">Destinations and experiences you have saved for upcoming journeys</p>
              </div>

              <Link
                href="/explore"
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-bold border border-white/10"
              >
                + Explore More Cities
              </Link>
            </div>

            {savedDestinations.length === 0 ? (
              <div className="text-center py-16 bg-[#0c0d10] rounded-[28px] border border-white/5 p-8 space-y-3 font-sans">
                <Heart className="w-10 h-10 text-[#c99a6b] mx-auto opacity-60" />
                <h4 className="font-serif text-xl font-bold text-white">Your wishlist is currently empty</h4>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  Browse the global destination catalog and tap the heart icon on cities you wish to explore.
                </p>
                <div className="pt-2">
                  <Link
                    href="/explore"
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] text-xs font-bold shadow-md inline-block"
                  >
                    Browse Destinations
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                {savedDestinations.map((dest) => (
                  <div
                    key={dest.id}
                    className="group bg-[#0c0d10] border border-white/10 hover:border-[#c99a6b]/50 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div className="h-40 relative">
                      <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <h4 className="font-serif text-lg font-bold text-white">{dest.name}</h4>
                        <p className="text-[10px] text-stone-300">{dest.country} &bull; {dest.continent}</p>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <p className="text-xs text-stone-400 line-clamp-2">{dest.description}</p>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-[#e4c29e] font-bold">${dest.avg_daily_cost} USD/day</span>
                        
                        <div className="flex items-center gap-2">
                          <Link
                            href="/trips/new"
                            className="px-3 py-1 rounded-lg bg-[#c99a6b] text-[#0c0d10] text-[11px] font-bold"
                          >
                            Plan Trip
                          </Link>
                          
                          <button
                            onClick={() => handleRemoveSaved(dest.id)}
                            className="p-1.5 rounded-lg bg-white/5 text-stone-500 hover:text-red-400"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="bg-[#14151a]/95 border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-xl font-sans space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">Traveler Milestones &amp; Badges</h3>
              <p className="text-xs text-stone-400 mt-0.5">Achievements unlocked as you plan, explore, and participate in expeditions</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#0c0d10] border border-[#c99a6b]/30 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#c99a6b]/20 text-[#e4c29e] flex items-center justify-center text-xl">
                  🧭
                </div>
                <h4 className="font-serif text-base font-bold text-white">Pioneer Explorer</h4>
                <p className="text-xs text-stone-400">Created your first verified multi-city journey on GlobeTrotter.</p>
                <span className="inline-block text-[10px] text-emerald-400 font-bold uppercase">Unlocked</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0c0d10] border border-[#c99a6b]/30 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#c99a6b]/20 text-[#e4c29e] flex items-center justify-center text-xl">
                  🚅
                </div>
                <h4 className="font-serif text-base font-bold text-white">High-Speed Rail Rover</h4>
                <p className="text-xs text-stone-400">Composed routes featuring Vande Bharat / Shinkansen bullet train corridors.</p>
                <span className="inline-block text-[10px] text-emerald-400 font-bold uppercase">Unlocked</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0c0d10] border border-white/10 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white/5 text-stone-400 flex items-center justify-center text-xl">
                  🏔️
                </div>
                <h4 className="font-serif text-base font-bold text-white">Alpine Conqueror</h4>
                <p className="text-xs text-stone-400">Plan 3+ mountain stops across Himalayas or Swiss Alps.</p>
                <span className="inline-block text-[10px] text-stone-500 font-bold uppercase">In Progress (1/3)</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0c0d10] border border-white/10 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white/5 text-stone-400 flex items-center justify-center text-xl">
                  👑
                </div>
                <h4 className="font-serif text-base font-bold text-white">Grand Globetrotter</h4>
                <p className="text-xs text-stone-400">Visited 10+ distinct world countries and collected passport stamps.</p>
                <span className="inline-block text-[10px] text-stone-500 font-bold uppercase">In Progress (3/10)</span>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
