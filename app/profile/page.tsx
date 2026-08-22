'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  Trash2
} from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [savedDestinations, setSavedDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    async function loadProfile() {
      try {
        const [profRes, savedRes] = await Promise.all([
          fetch('/api/user/profile').then((r) => r.json()),
          fetch('/api/user/saved-destinations').then((r) => r.json()),
        ]);

        if (profRes.success) {
          setProfile(profRes.data);
          setName(profRes.data.name || '');
          setCurrency(profRes.data.preferred_currency || 'USD');
        }
        if (savedRes.success) {
          setSavedDestinations(savedRes.data || []);
        }
      } catch (e) {
        console.error('Error loading profile:', e);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, preferred_currency: currency }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);

        // Update local session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const u = JSON.parse(storedUser);
          u.name = name;
          localStorage.setItem('user', JSON.stringify(u));
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
      const res = await fetch(`/api/user/saved-destinations?destinationId=${destId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setSavedDestinations(savedDestinations.filter((d) => d.id !== destId));
      }
    } catch (e) {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans">
        <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/60 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-blue-500/20 flex-shrink-0">
            {profile?.name ? profile.name[0].toUpperCase() : 'G'}
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Verified Traveler Account</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{profile?.name}</h1>
            <p className="text-slate-400 text-xs mt-0.5">{profile?.email} &bull; Member since {new Date(profile?.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Travel Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Total Itineraries</span>
            <p className="text-2xl font-extrabold text-white mt-1">{profile?.stats?.total_trips || 0}</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Cities Explored</span>
            <p className="text-2xl font-extrabold text-blue-400 mt-1">{profile?.stats?.total_cities_visited || 0}</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Countries Visited</span>
            <p className="text-2xl font-extrabold text-indigo-400 mt-1">{profile?.stats?.total_countries_visited || 0}</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Total Planned Budget</span>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">
              ${parseFloat(profile?.stats?.total_budget_planned || 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Settings Form (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-1">Account & Preferences</h2>
            <p className="text-xs text-slate-400 mb-6">Manage personal profile details and display currency</p>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={profile?.email}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Preferred Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                >
                  <option value="USD">USD ($ - United States Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                  <option value="JPY">JPY (¥ - Japanese Yen)</option>
                  <option value="INR">INR (₹ - Indian Rupee)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                {savedSuccess ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Preferences saved!
                  </span>
                ) : <div />}

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Wishlist / Saved Destinations (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-400" />
              Saved Destination Wishlist ({savedDestinations.length})
            </h3>
            <p className="text-xs text-slate-400 mb-4">Cities you're dreaming of visiting next</p>

            {savedDestinations.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No saved destinations yet. Explore our catalog and save your dream stops!
              </p>
            ) : (
              <div className="space-y-3">
                {savedDestinations.map((dest) => (
                  <div
                    key={dest.id}
                    className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img src={dest.image_url} alt={dest.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-xs font-bold text-white">{dest.name}</p>
                        <p className="text-[10px] text-slate-400">{dest.country} &bull; ${dest.avg_daily_cost}/day</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveSaved(dest.id)}
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

      </main>

      <Footer />
    </div>
  );
}
