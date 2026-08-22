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
      <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex items-center justify-center font-sans">
        <div className="w-12 h-12 rounded-full border-2 border-[#c99a6b] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        
        {/* Header Banner */}
        <div className="bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 mb-10 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] flex items-center justify-center text-3xl font-serif font-bold text-[#0c0d10] shadow-xl shadow-[#c99a6b]/20 flex-shrink-0">
            {profile?.name ? profile.name[0].toUpperCase() : 'G'}
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#e4c29e] text-[10px] font-sans font-bold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Verified Traveler Atelier</span>
            </div>
            <h1 className="font-serif text-3xl font-medium text-white">{profile?.name}</h1>
            <p className="font-sans text-stone-400 text-xs mt-0.5">{profile?.email} &bull; Member since {new Date(profile?.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Travel Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 font-sans">
          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Total Itineraries</span>
            <p className="font-serif text-3xl font-bold text-white mt-1">{profile?.stats?.total_trips || 0}</p>
          </div>

          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Cities Explored</span>
            <p className="font-serif text-3xl font-bold text-[#e4c29e] mt-1">{profile?.stats?.total_cities_visited || 0}</p>
          </div>

          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Countries Visited</span>
            <p className="font-serif text-3xl font-bold text-stone-200 mt-1">{profile?.stats?.total_countries_visited || 0}</p>
          </div>

          <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Planned Budget</span>
            <p className="font-serif text-3xl font-bold text-emerald-400 mt-1">
              ${parseFloat(profile?.stats?.total_budget_planned || 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
          
          {/* Settings Form */}
          <div className="lg:col-span-7 bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl">
            <h2 className="font-serif text-2xl font-medium text-white mb-1">Account &amp; Preferences</h2>
            <p className="text-xs text-stone-400 mb-6 font-sans">Manage personal atelier details and preferred currency</p>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-5 py-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={profile?.email}
                  className="w-full bg-[#0c0d10]/50 border border-white/10 rounded-full px-5 py-3 text-xs text-stone-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1.5">Preferred Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-[#0c0d10] border border-white/15 rounded-full px-5 py-3 text-xs text-white"
                >
                  <option value="USD">USD ($ - United States Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                  <option value="JPY">JPY (¥ - Japanese Yen)</option>
                  <option value="INR">INR (₹ - Indian Rupee)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                {savedSuccess ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Preferences saved!
                  </span>
                ) : <div />}

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-md shadow-[#c99a6b]/20 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Wishlist / Saved Destinations */}
          <div className="lg:col-span-5 bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#c99a6b]" />
              Saved Destination Wishlist ({savedDestinations.length})
            </h3>
            <p className="text-xs text-stone-400 mb-4 font-sans">Cities you're dreaming of exploring next</p>

            {savedDestinations.length === 0 ? (
              <p className="text-xs text-stone-500 py-6 text-center font-sans">
                No saved destinations yet. Explore our catalog and save your dream stops!
              </p>
            ) : (
              <div className="space-y-3 font-sans">
                {savedDestinations.map((dest) => (
                  <div
                    key={dest.id}
                    className="bg-[#0c0d10] border border-white/10 p-3 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img src={dest.image_url} alt={dest.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="font-serif text-xs font-bold text-white">{dest.name}</p>
                        <p className="text-[10px] text-stone-400">{dest.country} &bull; ${dest.avg_daily_cost}/day</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveSaved(dest.id)}
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

      </main>

      <Footer />
    </div>
  );
}
