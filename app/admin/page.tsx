'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  BarChart3,
  Users,
  MapPin,
  Globe2,
  TrendingUp,
  DollarSign,
  Layers,
  Sparkles,
  Calendar,
  Eye,
  Plus,
  Shield,
  Check,
  Compass,
  Lock,
  KeyRound,
  UserCheck,
  UserPlus,
  Trash2,
  Crown,
  AlertCircle
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

const SUPER_ADMIN_EMAIL = 'joshikaushald1596@gmail.com';
const COLORS = ['#3B82F6', '#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Security Gate State
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [verifyingPin, setVerifyingPin] = useState(false);

  // Modals
  const [showAddDestModal, setShowAddDestModal] = useState(false);
  const [destSuccess, setDestSuccess] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [adminAddSuccess, setAdminAddSuccess] = useState(false);

  // New Destination Form
  const [newDest, setNewDest] = useState({
    name: '',
    country: '',
    continent: 'Europe',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    costIndex: 'moderate',
    avgDailyCost: '140',
    currency: 'EUR',
    bestTimeToVisit: 'Spring / Autumn',
  });

  // New Admin Form
  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    email: '',
    role: 'admin',
    password: '',
  });

  useEffect(() => {
    // 1. Check local session
    const storedUser = localStorage.getItem('user');
    const storedAdminPin = sessionStorage.getItem('admin_pin_verified');

    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setCurrentUser(u);

        // Check if user is Super Admin or Admin
        if (
          u.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() ||
          u.role === 'admin' ||
          storedAdminPin === 'true'
        ) {
          setIsAuthorized(true);
          loadAdminData();
          return;
        }
      } catch (e) {}
    }

    if (storedAdminPin === 'true') {
      setIsAuthorized(true);
      loadAdminData();
    } else {
      setLoading(false);
    }
  }, []);

  async function loadAdminData() {
    setLoading(true);
    try {
      const [metricsRes, usersRes] = await Promise.all([
        fetch('/api/analytics/admin').then((r) => r.json()),
        fetch('/api/admin/users').then((r) => r.json()),
      ]);

      if (metricsRes.success) setMetrics(metricsRes.data);
      if (usersRes.success) setUsersList(usersRes.data || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    setVerifyingPin(true);

    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });

      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('admin_pin_verified', 'true');
        setIsAuthorized(true);
        loadAdminData();
      } else {
        setPinError('Invalid Admin Passcode. Access Denied.');
      }
    } catch (e) {
      setPinError('Verification failed. Try again.');
    } finally {
      setVerifyingPin(false);
    }
  };

  const handleCreateDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDest),
      });
      const data = await res.json();
      if (data.success) {
        setDestSuccess(true);
        setTimeout(() => {
          setDestSuccess(false);
          setShowAddDestModal(false);
          loadAdminData();
        }, 1500);
      }
    } catch (e) {
      console.error('Error creating destination:', e);
    }
  };

  const handleAddAdminUser = async (e: React.FormEvent) => {
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
        setTimeout(() => {
          setAdminAddSuccess(false);
          setShowAddAdminModal(false);
          setNewAdminForm({ name: '', email: '', role: 'admin', password: '' });
          loadAdminData();
        }, 1500);
      }
    } catch (e) {
      console.error('Error adding admin:', e);
    }
  };

  const handleUpdateUserRole = async (userId: number, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(usersList.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      }
    } catch (e) {}
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to remove this user?')) return;
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(usersList.filter((u) => u.id !== userId));
      }
    } catch (e) {}
  };

  // ================= 1. SECURITY GATE (LOCKED) =================
  if (!isAuthorized && !loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        <Navbar />

        <main className="flex-1 flex items-center justify-center p-4 pt-24 pb-16">
          <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
            
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                Restricted Admin Access
              </span>
              <h2 className="text-2xl font-black text-white mt-3">Admin Security Gate</h2>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                This dashboard is protected for Super Admin (<span className="text-amber-300 font-mono font-semibold">{SUPER_ADMIN_EMAIL}</span>) or authorized administrators with Master PIN.
              </p>
            </div>

            {pinError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                {pinError}
              </div>
            )}

            <form onSubmit={handleVerifyPin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Enter Master Admin PIN *</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••"
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-center tracking-widest"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={verifyingPin}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-98"
              >
                {verifyingPin ? 'Verifying PIN...' : 'Unlock Admin Dashboard 🔓'}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-400">
              <span>Are you {SUPER_ADMIN_EMAIL}?</span>
              <Link href="/login" className="text-amber-400 font-bold hover:underline">
                Sign In with Google
              </Link>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ================= 2. AUTHORIZED ADMIN VIEW =================
  const destinationBarData = metrics?.topDestinations?.map((d: any) => ({
    name: d.name,
    trips: d.trip_count,
  })) || [];

  const categoryPieData = metrics?.categoryStats?.map((c: any, i: number) => ({
    name: c.category.toUpperCase().replace('_', ' '),
    value: c.count,
    color: COLORS[i % COLORS.length],
  })) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-10">
        
        {/* Top Header Banner with Super Admin Badges */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Super Admin Authority &bull; {SUPER_ADMIN_EMAIL}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Platform Analytics &amp; User Control Hub
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Master administration portal for platform metrics, user access management, and global destination controls.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddAdminModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add / Promote Admin</span>
            </button>

            <button
              onClick={() => setShowAddDestModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add City to Catalog</span>
            </button>
          </div>
        </div>

        {/* 6 High-Level KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Users</span>
            <p className="text-2xl font-black text-white mt-1">{metrics?.kpis?.totalUsers || usersList.length || 0}</p>
            <span className="text-[10px] text-blue-400 font-semibold">Active accounts</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trips Created</span>
            <p className="text-2xl font-black text-white mt-1">{metrics?.kpis?.totalTrips || 0}</p>
            <span className="text-[10px] text-indigo-400 font-semibold">Multi-city plans</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Stops</span>
            <p className="text-2xl font-black text-blue-400 mt-1">{metrics?.kpis?.totalStops || 0}</p>
            <span className="text-[10px] text-slate-400 font-semibold">City destinations</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experiences</span>
            <p className="text-2xl font-black text-amber-400 mt-1">{metrics?.kpis?.totalActivitiesScheduled || 0}</p>
            <span className="text-[10px] text-slate-400 font-semibold">Scheduled items</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Budget Volume</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">
              ${(metrics?.kpis?.totalBudgetPlanned || 0).toLocaleString()}
            </p>
            <span className="text-[10px] text-emerald-400/80 font-semibold">Planned volume</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Receipt Total</span>
            <p className="text-2xl font-black text-cyan-400 mt-1">
              ${(metrics?.kpis?.totalExpensesLogged || 0).toLocaleString()}
            </p>
            <span className="text-[10px] text-cyan-400/80 font-semibold">Logged receipts</span>
          </div>
        </div>

        {/* ================= USER MANAGEMENT & ADMIN CONTROL PANEL ================= */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                User Accounts &amp; Role Management ({usersList.length})
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Super Admin can grant Admin / Organizer permissions or manage registered users
              </p>
            </div>

            <button
              onClick={() => setShowAddAdminModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold transition-all self-start sm:self-auto"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Promote / Add New Admin</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Active Role</th>
                  <th className="py-3 px-4">Trips Created</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Role Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {usersList.map((u) => {
                  const isSuper = u.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          {u.name ? u.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <span>{u.name}</span>
                          {isSuper && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-black uppercase">
                              Super Admin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <select
                          disabled={isSuper}
                          value={u.role}
                          onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                          className={`bg-slate-950 border rounded-lg px-2.5 py-1 text-xs font-bold capitalize transition-colors ${
                            u.role === 'admin'
                              ? 'border-amber-500/40 text-amber-400'
                              : u.role === 'organizer'
                              ? 'border-indigo-500/40 text-indigo-400'
                              : 'border-slate-700 text-slate-300'
                          }`}
                        >
                          <option value="traveler">Traveler</option>
                          <option value="organizer">Organizer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-semibold">{u.total_trips || 0} trips</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                          <Check className="w-3.5 h-3.5" /> Verified
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!isSuper && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Top Destinations Bar Chart */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                Most Popular Destinations Visited
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">Top cities by number of scheduled multi-day stops</p>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={destinationBarData}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="trips" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Categories Distribution */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Activity Category Preference Breakdown
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">Distribution of experiences scheduled across trips</p>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={4}
                  >
                    {categoryPieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </main>

      {/* ================= ADD / PROMOTE ADMIN MODAL ================= */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <Crown className="w-5 h-5 text-amber-400" />
              Add / Promote Admin User
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Enter user details to grant administrator permissions on GlobeTrotter
            </p>

            {adminAddSuccess ? (
              <div className="py-6 text-center text-emerald-400 font-bold text-sm flex flex-col items-center gap-2">
                <Check className="w-8 h-8 rounded-full bg-emerald-500/20 p-1.5" />
                <span>Admin permissions granted successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleAddAdminUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">User Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Connor"
                    value={newAdminForm.name}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">User Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="admin.user@example.com"
                    value={newAdminForm.email}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Assign Role</label>
                  <select
                    value={newAdminForm.role}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="admin">Platform Administrator (Full Access)</option>
                    <option value="organizer">Trip Organizer (Group Expeditions)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddAdminModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20"
                  >
                    Confirm &amp; Add Admin
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= ADD NEW DESTINATION MODAL ================= */}
      {showAddDestModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <Globe2 className="w-5 h-5 text-blue-400" />
              Add City to Catalog
            </h3>
            <p className="text-xs text-slate-400 mb-6">Expand GlobeTrotter's database of global travel destinations</p>

            {destSuccess ? (
              <div className="py-8 text-center text-emerald-400 font-bold text-sm flex flex-col items-center gap-2">
                <Check className="w-8 h-8 rounded-full bg-emerald-500/20 p-1.5" />
                <span>Destination successfully published to catalog!</span>
              </div>
            ) : (
              <form onSubmit={handleCreateDestination} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">City Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zurich"
                      value={newDest.name}
                      onChange={(e) => setNewDest({ ...newDest, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Country *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Switzerland"
                      value={newDest.country}
                      onChange={(e) => setNewDest({ ...newDest, country: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Continent</label>
                    <select
                      value={newDest.continent}
                      onChange={(e) => setNewDest({ ...newDest, continent: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="Europe">Europe</option>
                      <option value="Asia">Asia</option>
                      <option value="North America">North America</option>
                      <option value="Africa">Africa</option>
                      <option value="Middle East">Middle East</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Cost Index</label>
                    <select
                      value={newDest.costIndex}
                      onChange={(e) => setNewDest({ ...newDest, costIndex: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="budget">Budget ($)</option>
                      <option value="moderate">Moderate ($$)</option>
                      <option value="luxury">Luxury ($$$)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddDestModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                  >
                    Save &amp; Publish
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
