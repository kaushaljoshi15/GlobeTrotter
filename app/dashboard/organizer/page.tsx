'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  TrendingUp,
  Globe2,
  Share2,
  ChevronRight,
  Megaphone,
  Copy,
  Eye,
  Check,
  ShieldAlert,
  Award
} from 'lucide-react';

export default function OrganizerDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Group Expedition Participant Data (Mock data connected to organizer's active trip)
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Elena Rostova', email: 'elena@travel.org', status: 'Confirmed', paid: true, date: '2 days ago' },
    { id: 2, name: 'Marcus Chen', email: 'marcus.c@domain.com', status: 'Confirmed', paid: true, date: '3 days ago' },
    { id: 3, name: 'Sophia Miller', email: 'sophia.m@globetrotter.io', status: 'Waitlist', paid: false, date: '5 days ago' },
    { id: 4, name: 'David Kumar', email: 'david.k@adventures.net', status: 'Confirmed', paid: true, date: '1 week ago' },
  ]);

  // Broadcast Advisory Notice
  const [broadcastMsg, setBroadcastMsg] = useState('Important Expedition Notice: Please ensure all group members have submitted their valid passport scans and dietary requirements prior to departure date.');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [newBroadcastInput, setNewBroadcastInput] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    let currentUserId = 1;
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setUser(u);
        if (u.id) currentUserId = u.id;
      } catch (e) {}
    }

    async function loadOrganizerData() {
      try {
        const token = localStorage.getItem('token');
        const headers: any = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const [tripsRes, destsRes] = await Promise.all([
          fetch(`/api/trips?userId=${currentUserId}`, { headers }).then((r) => r.json()),
          fetch('/api/destinations?limit=6').then((r) => r.json()),
        ]);

        if (tripsRes.success) setTrips(tripsRes.data || []);
        if (destsRes.success) setDestinations(destsRes.data || []);
      } catch (err) {
        console.error('Error loading organizer data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrganizerData();
  }, []);

  const handleUpdateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBroadcastInput.trim()) {
      setBroadcastMsg(newBroadcastInput);
      setShowBroadcastModal(false);
      setNewBroadcastInput('');
    }
  };

  const handleCopyShareLink = (shareCode: string) => {
    const url = `${window.location.origin}/trips/share/${shareCode}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(shareCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const totalExpeditions = trips.length;
  const activeExpedition = trips.find((t) => t.status === 'active' || t.status === 'planning') || trips[0];
  const totalBudget = trips.reduce((acc, t) => acc + parseFloat(t.total_budget || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">
        
        {/* Organizer Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-indigo-500/30 p-8 sm:p-10 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold mb-3">
                <Users className="w-4 h-4" />
                <span>Verified Trip Organizer &amp; Group Tour Leader</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
                Expedition Operations Command, {user?.name || 'Lead Organizer'} 🧭
              </h1>
              <p className="text-slate-400 text-sm max-w-xl">
                Coordinate group itineraries, publish public cloneable travel routes, manage participant rosters, and broadcast live alerts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/trips/new"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Launch New Expedition</span>
              </Link>
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold"
              >
                <Megaphone className="w-4 h-4 text-amber-400" />
                <span>Broadcast Advisory</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Organizer KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Expeditions</span>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1">{totalExpeditions}</p>
            <span className="text-[11px] text-indigo-400 font-semibold">Organized tours</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Group Capacity</span>
            <p className="text-2xl sm:text-3xl font-black text-blue-400 mt-1">24 / 30</p>
            <span className="text-[11px] text-slate-400">80% slots filled</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Public Clones &amp; Copies</span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">38 Clones</p>
            <span className="text-[11px] text-emerald-400/80">From shared links</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Guide Badge</span>
            <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">Certified</p>
            <span className="text-[11px] text-slate-400">Top Tier Explorer</span>
          </div>
        </div>

        {/* Live Broadcast Notice Banner */}
        <div className="p-6 rounded-3xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Live Broadcast Notice to Group Participants
              </span>
              <p className="text-sm font-semibold text-white mt-0.5">{broadcastMsg}</p>
            </div>
          </div>

          <button
            onClick={() => setShowBroadcastModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold whitespace-nowrap self-start sm:self-auto"
          >
            Update Notice
          </button>
        </div>

        {/* Lead Expedition & Participant Management Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Active Expedition Card (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-indigo-400" />
                  Active Expedition Itinerary
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Primary multi-city route under your leadership</p>
              </div>

              {activeExpedition && (
                <button
                  onClick={() => handleCopyShareLink(activeExpedition.share_code)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500 hover:text-white text-xs font-bold transition-all"
                >
                  {copiedCode === activeExpedition.share_code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Group Link</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {activeExpedition ? (
              <div className="space-y-4">
                <div className="h-56 relative rounded-2xl overflow-hidden">
                  <img
                    src={activeExpedition.cover_image_url || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'}
                    alt={activeExpedition.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider mb-1 inline-block">
                      {activeExpedition.status || 'Active'}
                    </span>
                    <h4 className="text-xl font-bold text-white">{activeExpedition.title}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {new Date(activeExpedition.start_date).toLocaleDateString()} - {new Date(activeExpedition.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Stops</span>
                    <p className="text-sm font-bold text-blue-400 mt-0.5">{activeExpedition.total_stops || 2} Cities</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Group Budget</span>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5">${parseFloat(activeExpedition.total_budget || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Share Code</span>
                    <p className="text-xs font-mono font-bold text-slate-300 mt-1 truncate">{activeExpedition.share_code}</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    href={`/trips/${activeExpedition.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    <span>Manage Stops &amp; Schedule</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-slate-400 text-xs">
                No group expeditions created yet. Click "+ Launch New Expedition" above!
              </div>
            )}
          </div>

          {/* Participant Roster (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Participant Roster ({participants.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Travelers signed up for this expedition</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {participants.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center">
                      {p.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.email}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      p.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {p.status}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">{p.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <Megaphone className="w-5 h-5 text-indigo-400" />
              Post Advisory Notice
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Update the broadcast notice shown on the group participants' dashboards
            </p>

            <form onSubmit={handleUpdateBroadcast} className="space-y-4">
              <textarea
                rows={4}
                required
                placeholder="Enter meeting coordinates, packing warnings, or flight check-in details..."
                value={newBroadcastInput}
                onChange={(e) => setNewBroadcastInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white resize-none"
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Post to Group
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
