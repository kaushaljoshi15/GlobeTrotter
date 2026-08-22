'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import confetti from 'canvas-confetti';
import { 
  Users, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Megaphone, 
  Copy, 
  Check,
  Shield,
  Trash2,
  Phone,
  Mail,
  UserPlus,
  RefreshCw,
  Search,
  Filter,
  Layers,
  Utensils,
  Hotel,
  Bus,
  FileSpreadsheet,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  Luggage,
  Compass
} from 'lucide-react';

export default function OrganizerDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Group Expedition Participant Data with Persistence
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Elena Rostova', email: 'elena@travel.org', phone: '+91 98234 56789', status: 'Confirmed', paid: true, diet: 'Vegetarian', date: '2 days ago' },
    { id: 2, name: 'Marcus Chen', email: 'marcus.c@domain.com', phone: '+1 (555) 345-6789', status: 'Confirmed', paid: true, diet: 'Gluten-Free', date: '3 days ago' },
    { id: 3, name: 'Sophia Miller', email: 'sophia.m@globetrotter.io', phone: '+44 7700 900077', status: 'Waitlist', paid: false, diet: 'None', date: '5 days ago' },
    { id: 4, name: 'David Kumar', email: 'david.k@adventures.net', phone: '+91 99887 76655', status: 'Confirmed', paid: true, diet: 'Vegan', date: '1 week ago' },
    { id: 5, name: 'Aarav Patel', email: 'aarav.p@mumbai.in', phone: '+91 91234 56780', status: 'Deposit Paid', paid: true, diet: 'Jain Meal', date: 'Just now' },
  ]);

  // Participant Filter & Search
  const [participantFilter, setParticipantFilter] = useState('all');
  const [participantSearch, setParticipantSearch] = useState('');

  // Add Participant Modal State
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Confirmed',
    diet: 'None'
  });

  // Broadcast Advisory Notice
  const [broadcastMsg, setBroadcastMsg] = useState('Important Expedition Notice: Please ensure all group members have submitted their valid passport scans and dietary preferences prior to departure date.');
  const [broadcastCategory, setBroadcastCategory] = useState<'Advisory' | 'Weather' | 'Transit' | 'Lodging'>('Advisory');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [newBroadcastInput, setNewBroadcastInput] = useState('');
  const [newBroadcastCat, setNewBroadcastCat] = useState<'Advisory' | 'Weather' | 'Transit' | 'Lodging'>('Advisory');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [statusNotification, setStatusNotification] = useState('');

  // Active Selected Tab in Dashboard
  const [activeTab, setActiveTab] = useState<'roster' | 'runsheet' | 'finances'>('roster');

  // Daily Run-sheet Milestones
  const [runsheet, setRunsheet] = useState([
    { id: 1, day: 'Day 1', time: '09:00 AM', title: 'Group Arrival & VIP Chauffeur Transfer', location: 'Jaipur International Airport (JAI)', status: 'Confirmed', contact: 'Driver Ramesh (+91 98111 22334)' },
    { id: 2, day: 'Day 1', time: '02:00 PM', title: 'Royal Heritage Haveli Check-In & Welcome Tea', location: 'The Raj Palace Heritage Suites', status: 'Confirmed', contact: 'Concierge desk voucher #GT-982' },
    { id: 3, day: 'Day 2', time: '08:30 AM', title: 'Private Amber Fort Ramparts & Elephant Reserve Tour', location: 'Amber Fort Historic Gate', status: 'In Progress', contact: 'Master Historian Vikram (+91 98222 33445)' },
    { id: 4, day: 'Day 3', time: '04:00 PM', title: 'Desert Sunset Camel Safari & Folk Dance Dinner', location: 'Sam Sand Dunes Oasis', status: 'Scheduled', contact: 'Oasis Camp Coordinator (+91 98333 44556)' },
  ]);

  // Load Organizer Data
  const loadOrganizerData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setIsSyncing(true);

    let currentUserId = 1;
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setUser(u);
        if (u.id) currentUserId = u.id;
      } catch (e) {}
    }

    try {
      const token = localStorage.getItem('token');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const [tripsRes, destsRes] = await Promise.all([
        fetch(`/api/trips?userId=${currentUserId}`, { headers, cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/destinations?limit=8', { cache: 'no-store' }).then((r) => r.json()),
      ]);

      if (tripsRes.success) setTrips(tripsRes.data || []);
      if (destsRes.success) setDestinations(destsRes.data || []);
    } catch (err) {
      console.error('Error loading organizer data:', err);
    } finally {
      if (showLoading) setLoading(false);
      setIsSyncing(false);
    }
  }, []);

  // Mount + Background live polling
  useEffect(() => {
    loadOrganizerData(true);

    const interval = setInterval(() => {
      loadOrganizerData(false);
    }, 8000);

    const handleFocus = () => loadOrganizerData(false);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') loadOrganizerData(false);
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [loadOrganizerData]);

  const copyShareCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setStatusNotification(`Share code "${code}" copied to clipboard!`);
    setTimeout(() => {
      setCopiedCode(null);
      setStatusNotification('');
    }, 2500);
  };

  const handleUpdateBroadcast = () => {
    if (newBroadcastInput.trim()) {
      setBroadcastMsg(newBroadcastInput.trim());
      setBroadcastCategory(newBroadcastCat);
      setShowBroadcastModal(false);
      setNewBroadcastInput('');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setStatusNotification('Live expedition advisory broadcasted to all enrolled travelers!');
      setTimeout(() => setStatusNotification(''), 3000);
    }
  };

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipant.name.trim()) return;

    const created = {
      id: Date.now(),
      name: newParticipant.name.trim(),
      email: newParticipant.email.trim() || 'traveler@globetrotter.io',
      phone: newParticipant.phone.trim() || '+91 90000 00000',
      status: newParticipant.status,
      paid: newParticipant.status === 'Confirmed',
      diet: newParticipant.diet,
      date: 'Just now'
    };

    setParticipants([created, ...participants]);
    setShowAddParticipantModal(false);
    setNewParticipant({ name: '', email: '', phone: '', status: 'Confirmed', diet: 'None' });
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    setStatusNotification(`Added ${created.name} to participant roster!`);
    setTimeout(() => setStatusNotification(''), 3000);
  };

  const handleDeleteParticipant = (id: number) => {
    setParticipants(participants.filter(p => p.id !== id));
    setStatusNotification('Participant removed from roster.');
    setTimeout(() => setStatusNotification(''), 2500);
  };

  const handleToggleRunsheetStatus = (id: number) => {
    setRunsheet(runsheet.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Confirmed' ? 'Completed' : item.status === 'Completed' ? 'In Progress' : 'Confirmed';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  // Filtered Participants
  const filteredParticipants = useMemo(() => {
    return participants.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(participantSearch.toLowerCase()) || p.email.toLowerCase().includes(participantSearch.toLowerCase());
      const matchesFilter = participantFilter === 'all' || p.status.toLowerCase() === participantFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [participants, participantSearch, participantFilter]);

  const totalExpeditions = trips.length || 3;
  const activeExpedition = trips.find((t) => t.is_public || t.status === 'active') || trips[0];
  const totalGroupBudget = trips.reduce((acc, t) => acc + parseFloat(t.total_budget || 0), 0) || 18500;
  const grossRevenueINR = totalGroupBudget * 83.45;
  const confirmedCount = participants.filter(p => p.status === 'Confirmed').length;

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-[#0c0d10]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        
        {/* ================= 1. ORGANIZER COMMAND HERO BANNER ================= */}
        <div className="relative rounded-[32px] overflow-hidden bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 p-6 sm:p-10 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#c99a6b]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c99a6b]/15 border border-[#c99a6b]/30 text-[#e4c29e] text-xs font-bold font-sans">
                  <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
                  <span>Master Expedition Organizer &bull; Group Atelier OS</span>
                </span>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Operations Stream</span>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-medium text-white tracking-tight">
                Expedition Operations Command &bull; <span className="font-bold italic text-[#e4c29e]">{user?.name || 'Chief Organizer'}</span>
              </h1>
              
              <p className="text-stone-400 text-xs mt-1 max-w-2xl font-sans leading-relaxed">
                Oversee group traveler rosters, run-sheet logistical milestones, ticket revenue distributions, and instant emergency broadcasts.
              </p>
            </div>

            {/* Quick Action Navigation */}
            <div className="flex flex-wrap items-center gap-3 font-sans">
              <button
                onClick={() => loadOrganizerData(false)}
                disabled={isSyncing}
                title="Force refresh expedition operations"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0c0d10] hover:bg-white/10 text-stone-300 hover:text-white text-xs font-bold border border-white/15 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#c99a6b]' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Operations'}</span>
              </button>

              <button
                onClick={() => {
                  setNewBroadcastInput(broadcastMsg);
                  setShowBroadcastModal(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c0d10] hover:bg-white/10 border border-white/15 text-stone-200 text-xs font-bold transition-all cursor-pointer"
              >
                <Megaphone className="w-4 h-4 text-[#e4c29e]" />
                <span>Publish Advisory</span>
              </button>

              <Link
                href="/trips/new"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold shadow-lg shadow-[#c99a6b]/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Launch New Expedition</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {statusNotification && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{statusNotification}</span>
            </div>
            <button onClick={() => setStatusNotification('')} className="text-emerald-400 hover:text-white font-mono">&times;</button>
          </div>
        )}

        {/* ================= 2. ORGANIZER 4-METRICS TILES ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
          
          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-[#c99a6b]/40 transition-all">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Total Expeditions
            </span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2">{totalExpeditions}</p>
            <span className="text-[10px] text-[#e4c29e] mt-1 inline-block">Active tour itineraries</span>
          </div>

          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-[#c99a6b]/40 transition-all">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Enrolled Travelers
            </span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-stone-200 mt-2">
              {participants.length} Travelers
            </p>
            <span className="text-[10px] text-emerald-400 mt-1 inline-block">{confirmedCount} fully confirmed</span>
          </div>

          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-[#c99a6b]/40 transition-all">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              Tracked Revenue Volume
            </span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#e4c29e] mt-2">
              ${totalGroupBudget.toLocaleString()}
            </p>
            <span className="text-[10px] text-stone-400 mt-1 inline-block">≈ ₹{(grossRevenueINR / 100000).toFixed(1)} Lakh INR</span>
          </div>

          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-[#c99a6b]/40 transition-all">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c99a6b] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Public Clones
            </span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2">24 Clones</p>
            <span className="text-[10px] text-stone-400 mt-1 inline-block">Community reach index</span>
          </div>

        </div>

        {/* ================= 3. LIVE EXPEDITION ADVISORY BANNER ================= */}
        {broadcastMsg && (
          <div className="p-5 rounded-[24px] bg-gradient-to-r from-amber-950/40 via-[#14151a] to-[#14151a] border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans shadow-xl">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[#e4c29e] shrink-0 mt-0.5">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#e4c29e]">
                    Live Broadcast Advisory
                  </span>
                  <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold uppercase">
                    {broadcastCategory}
                  </span>
                </div>
                <p className="text-xs text-stone-200 mt-0.5 leading-relaxed">{broadcastMsg}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setNewBroadcastInput(broadcastMsg);
                setNewBroadcastCat(broadcastCategory);
                setShowBroadcastModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-[#e4c29e] shrink-0 transition-all cursor-pointer"
            >
              Edit Advisory &rarr;
            </button>
          </div>
        )}

        {/* ================= 4. FLAGSHIP EXPEDITION QUICK INSPECTION CARD ================= */}
        {activeExpedition && (
          <div className="bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-[#e4c29e] text-[10px] font-bold uppercase tracking-widest border border-white/15">
                    {activeExpedition.is_public ? 'Public Sharable Group Route' : 'Private Expedition'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                    ● Enrolling Active
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2">{activeExpedition.title}</h3>
                <p className="text-stone-300 text-xs mt-1 max-w-xl">
                  {activeExpedition.description || 'Verified luxury group corridor crafted with boutique accommodations and expert local guides.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => copyShareCode(activeExpedition.share_code || 'GT-EXP-902')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0c0d10] hover:bg-white/10 border border-white/15 text-xs text-stone-200 transition-all font-mono cursor-pointer"
                >
                  {copiedCode === (activeExpedition.share_code || 'GT-EXP-902') ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-stone-400" />
                  )}
                  <span>Share: {activeExpedition.share_code || 'GT-EXP-902'}</span>
                </button>
                
                <Link
                  href={`/trips/${activeExpedition.id}`}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold transition-all shadow-md shadow-[#c99a6b]/20"
                >
                  Open Itinerary Atelier &rarr;
                </Link>
              </div>
            </div>

            {/* Navigation Tabs for Flagship Expedition */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-sans">
              <button
                onClick={() => setActiveTab('roster')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'roster'
                    ? 'bg-[#c99a6b] text-[#0c0d10] shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Enrolled Travelers ({participants.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('runsheet')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'runsheet'
                    ? 'bg-[#c99a6b] text-[#0c0d10] shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Daily Run-Sheet ({runsheet.length} Stops)</span>
              </button>

              <button
                onClick={() => setActiveTab('finances')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'finances'
                    ? 'bg-[#c99a6b] text-[#0c0d10] shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Financial Ledger &amp; Payouts</span>
              </button>
            </div>

            {/* ================= TAB 1: PARTICIPANT ROSTER ================= */}
            {activeTab === 'roster' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {['all', 'confirmed', 'deposit paid', 'waitlist'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setParticipantFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-all cursor-pointer ${
                          participantFilter === f
                            ? 'bg-[#c99a6b]/20 text-[#e4c29e] border border-[#c99a6b]/40'
                            : 'bg-[#0c0d10] text-stone-400 border border-white/10 hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
                      <input
                        type="text"
                        placeholder="Search traveler..."
                        value={participantSearch}
                        onChange={(e) => setParticipantSearch(e.target.value)}
                        className="bg-[#0c0d10] border border-white/15 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                      />
                    </div>

                    <button
                      onClick={() => setShowAddParticipantModal(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Add Traveler</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredParticipants.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-[#0c0d10] border border-white/10 hover:border-[#c99a6b]/40 transition-all flex flex-col justify-between space-y-3 group"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-sm font-bold text-white group-hover:text-[#e4c29e] transition-colors">{p.name}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            p.status === 'Confirmed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : p.status === 'Deposit Paid'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          }`}>
                            {p.status}
                          </span>
                        </div>

                        <div className="space-y-1 mt-2 text-[11px] text-stone-400">
                          <p className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-stone-500" />
                            <span>{p.email}</span>
                          </p>
                          <p className="flex items-center gap-1.5 font-mono">
                            <Phone className="w-3 h-3 text-stone-500" />
                            <span>{p.phone}</span>
                          </p>
                          <p className="flex items-center gap-1.5 text-stone-300">
                            <Utensils className="w-3 h-3 text-[#c99a6b]" />
                            <span>Diet: {p.diet}</span>
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-stone-500">
                        <span>Enrolled: {p.date}</span>
                        <button
                          onClick={() => handleDeleteParticipant(p.id)}
                          className="text-stone-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                          title="Remove from roster"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 2: DAILY RUN-SHEET ================= */}
            {activeTab === 'runsheet' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-lg font-bold text-white">Daily Itinerary Milestones &amp; Logistics</h4>
                  <span className="text-xs text-stone-400">Tap status to cycle milestone state</span>
                </div>

                <div className="space-y-3">
                  {runsheet.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#0c0d10] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-[#c99a6b]/20 text-[#e4c29e] text-xs font-mono font-bold">
                          {item.day} &bull; {item.time}
                        </span>
                        <div>
                          <h5 className="font-bold text-white text-xs">{item.title}</h5>
                          <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#c99a6b]" />
                            <span>{item.location}</span>
                          </p>
                          <p className="text-[10px] text-stone-500 mt-0.5">Contact: {item.contact}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleRunsheetStatus(item.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          item.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : item.status === 'In Progress'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}
                      >
                        {item.status}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 3: FINANCIAL LEDGER ================= */}
            {activeTab === 'finances' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-[#0c0d10] border border-white/10 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400">Gross Ticket Sales</span>
                    <p className="font-serif text-2xl font-bold text-white font-mono">$14,250 USD</p>
                    <p className="text-[10px] text-emerald-400">5 confirmed seats</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0c0d10] border border-white/10 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400">Vendor Commitments</span>
                    <p className="font-serif text-2xl font-bold text-stone-300 font-mono">$9,400 USD</p>
                    <p className="text-[10px] text-stone-500">Hotels &amp; private rail coach</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0c0d10] border border-[#c99a6b]/30 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#c99a6b]">Net Projected Margin</span>
                    <p className="font-serif text-2xl font-bold text-[#e4c29e] font-mono">$4,850 USD</p>
                    <p className="text-[10px] text-[#e4c29e]">34% Net Operational Margin</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0c0d10] border border-white/10 text-xs text-stone-400 space-y-2">
                  <span className="font-bold text-white block">Vendor Disbursement Schedule:</span>
                  <p>&bull; <strong>Accommodation:</strong> $5,200 due 14 days prior to departure (50% advanced paid).</p>
                  <p>&bull; <strong>Rail Corridors &amp; Chauffeur:</strong> $2,800 due on Day 1 meet-and-greet.</p>
                  <p>&bull; <strong>Expedition Master &amp; Guides:</strong> $1,400 final milestone payout.</p>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* ================= MODAL: ADD PARTICIPANT ================= */}
      {showAddParticipantModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#14151a] border border-white/15 rounded-[32px] p-6 sm:p-8 space-y-4 font-sans shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-white">Enroll New Traveler</h3>
            
            <form onSubmit={handleAddParticipant} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-400 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Varma"
                  value={newParticipant.name}
                  onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                  className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="rohan@example.com"
                    value={newParticipant.email}
                    onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={newParticipant.phone}
                    onChange={(e) => setNewParticipant({ ...newParticipant, phone: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-400 mb-1">Booking Status</label>
                  <select
                    value={newParticipant.status}
                    onChange={(e) => setNewParticipant({ ...newParticipant, status: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    <option value="Confirmed">Confirmed (Paid)</option>
                    <option value="Deposit Paid">Deposit Paid</option>
                    <option value="Waitlist">Waitlist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-400 mb-1">Dietary Notes</label>
                  <select
                    value={newParticipant.diet}
                    onChange={(e) => setNewParticipant({ ...newParticipant, diet: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    <option value="None">Standard / None</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Jain Meal">Jain Meal</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddParticipantModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] font-bold text-xs shadow-md cursor-pointer"
                >
                  Enroll Traveler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: BROADCAST ADVISORY ================= */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-[#0c0d10]/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#14151a] border border-white/15 rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl font-sans space-y-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-white mb-1">Publish Expedition Advisory</h3>
              <p className="text-xs text-stone-400">Broadcast important updates to all enrolled tour travelers</p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-400 mb-1">Advisory Category</label>
              <select
                value={newBroadcastCat}
                onChange={(e) => setNewBroadcastCat(e.target.value as any)}
                className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2 text-xs text-white mb-3"
              >
                <option value="Advisory">🚨 Urgent Advisory</option>
                <option value="Weather">⛅ Climate &amp; Weather</option>
                <option value="Transit">🚌 Flight &amp; Rail Transit</option>
                <option value="Lodging">🏨 Hotel Check-In Info</option>
              </select>

              <label className="block text-[11px] font-bold text-stone-400 mb-1">Advisory Message</label>
              <textarea
                rows={4}
                value={newBroadcastInput}
                onChange={(e) => setNewBroadcastInput(e.target.value)}
                className="w-full bg-[#0c0d10] border border-white/15 rounded-2xl p-4 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#c99a6b]"
                placeholder="Enter advisory text for group travelers..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBroadcast}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold shadow-md shadow-[#c99a6b]/30 cursor-pointer"
              >
                Broadcast Now
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
