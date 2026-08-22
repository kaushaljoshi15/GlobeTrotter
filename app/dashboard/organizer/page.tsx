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
  ChevronRight, 
  Megaphone, 
  Copy, 
  Check 
} from 'lucide-react';

export default function OrganizerDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Group Expedition Participant Data
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

  const copyShareCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleUpdateBroadcast = () => {
    if (newBroadcastInput.trim()) {
      setBroadcastMsg(newBroadcastInput.trim());
      setShowBroadcastModal(false);
      setNewBroadcastInput('');
    }
  };

  const totalExpeditions = trips.length;
  const activeExpedition = trips.find((t) => t.is_public || t.status === 'active') || trips[0];
  const totalGroupBudget = trips.reduce((acc, t) => acc + parseFloat(t.total_budget || 0), 0);

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        
        {/* Organizer Hero Banner */}
        <div className="relative rounded-[32px] overflow-hidden bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#c99a6b]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#e4c29e] text-[11px] font-sans font-medium mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
                <span>Expedition Organizer Hub &bull; Group Atelier</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium text-white tracking-tight mb-2">
                Organizer Atelier &bull; <span className="font-bold italic text-[#e4c29e]">{user?.name || 'Guide'}</span>
              </h1>
              <p className="font-serif text-stone-300 text-sm max-w-xl">
                Managing <span className="text-[#e4c29e] font-semibold">{totalExpeditions} group expeditions</span> with public share codes and live participant registries.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/trips/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#c99a6b]/30 hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Launch New Expedition</span>
              </Link>
              <button
                onClick={() => {
                  setNewBroadcastInput(broadcastMsg);
                  setShowBroadcastModal(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0c0d10] hover:bg-white/10 border border-white/15 text-stone-200 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Megaphone className="w-4 h-4 text-[#e4c29e]" />
                <span>Publish Advisory</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Organizer KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Total Expeditions</span>
            <p className="font-serif text-3xl font-bold text-white mt-1">{totalExpeditions}</p>
            <span className="text-[11px] text-[#e4c29e] font-medium">Under management</span>
          </div>

          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Enrolled Travelers</span>
            <p className="font-serif text-3xl font-bold text-stone-200 mt-1">24 Active</p>
            <span className="text-[11px] text-stone-400">Across 3 departures</span>
          </div>

          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Combined Budget</span>
            <p className="font-serif text-3xl font-bold text-emerald-400 mt-1">
              ${totalGroupBudget.toLocaleString()}
            </p>
            <span className="text-[11px] text-emerald-400/80">Tracked expenditure</span>
          </div>

          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Share Code Clones</span>
            <p className="font-serif text-3xl font-bold text-[#e4c29e] mt-1">18 Clones</p>
            <span className="text-[11px] text-stone-400">Public itinerary reach</span>
          </div>
        </div>

        {/* Live Broadcast Notice Card */}
        {broadcastMsg && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#14151a] to-[#14151a] border border-amber-500/30 flex items-start justify-between gap-4 font-sans">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#e4c29e] shrink-0 mt-0.5">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#e4c29e]">Live Expedition Advisory</span>
                <p className="text-xs text-stone-200 mt-0.5 leading-relaxed">{broadcastMsg}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setNewBroadcastInput(broadcastMsg);
                setShowBroadcastModal(true);
              }}
              className="text-xs font-bold text-[#e4c29e] hover:underline shrink-0"
            >
              Edit
            </button>
          </div>
        )}

        {/* Featured Group Expedition */}
        {activeExpedition ? (
          <div>
            <div className="flex items-center justify-between mb-4 font-sans">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
                  Flagship Tour
                </span>
                <h2 className="font-serif text-2xl font-medium text-white tracking-tight flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#c99a6b]" />
                  Active Expedition Management
                </h2>
              </div>
              <Link href={`/trips/${activeExpedition.id}`} className="text-xs font-bold uppercase tracking-wider text-[#e4c29e] hover:underline flex items-center gap-1">
                Open Full Atelier <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="px-3.5 py-1 rounded-full bg-white/10 text-[#e4c29e] text-[10px] font-sans font-bold uppercase tracking-widest border border-white/15">
                    {activeExpedition.is_public ? 'Public Sharable Route' : 'Private Group Route'}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2">{activeExpedition.title}</h3>
                  <p className="text-stone-300 text-xs mt-1 font-sans">{activeExpedition.description}</p>
                </div>

                <div className="flex items-center gap-3 font-sans">
                  <button
                    onClick={() => copyShareCode(activeExpedition.share_code || '')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0c0d10] hover:bg-white/10 border border-white/15 text-xs text-stone-200 transition-all font-mono"
                  >
                    {copiedCode === activeExpedition.share_code ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-stone-400" />
                    )}
                    <span>{activeExpedition.share_code}</span>
                  </button>
                  <Link
                    href={`/trips/${activeExpedition.id}`}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] text-xs font-bold uppercase tracking-wider"
                  >
                    Edit Route &rarr;
                  </Link>
                </div>
              </div>

              {/* Enrolled Participant Roster */}
              <div className="font-sans">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
                    Participant Enrollment Roster ({participants.length})
                  </h4>
                  <span className="text-[11px] text-[#e4c29e] font-semibold">4 / 12 Seats Filled</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {participants.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-[#0c0d10] border border-white/10 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-white">{p.name}</p>
                        <p className="text-[11px] text-stone-400">{p.email} &bull; {p.date}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

      </main>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-[#0c0d10]/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#14151a] border border-white/15 rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl font-sans">
            <h3 className="font-serif text-xl font-bold text-white mb-1">Update Expedition Advisory</h3>
            <p className="text-xs text-stone-400 mb-4">Broadcast important updates to all registered tour travelers</p>

            <textarea
              rows={4}
              value={newBroadcastInput}
              onChange={(e) => setNewBroadcastInput(e.target.value)}
              className="w-full bg-[#0c0d10] border border-white/15 rounded-2xl p-4 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#c99a6b]"
              placeholder="Enter advisory text for group travelers..."
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-4">
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBroadcast}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold shadow-md shadow-[#c99a6b]/30"
              >
                Save &amp; Broadcast
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
