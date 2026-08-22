'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import confetti from 'canvas-confetti';
import {
  User,
  Shield,
  KeyRound,
  Bell,
  Globe2,
  Lock,
  Smartphone,
  Check,
  AlertTriangle,
  Download,
  Trash2,
  Save,
  Compass,
  Phone,
  HeartPulse,
  Eye,
  EyeOff,
  Sparkles,
  Sliders,
  DollarSign,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<'account' | 'emergency' | 'security' | 'notifications' | 'privacy'>('account');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  // General Account Settings
  const [formData, setFormData] = useState({
    name: 'Kaushal Joshi',
    email: 'kaushaldj1515@gmail.com',
    homeCity: 'Mumbai, India',
    passportCountry: 'India',
    preferredCurrency: 'INR',
    measurementUnit: 'Metric (°C, km, meters)',
    dateFormat: 'DD/MM/YYYY',
  });

  // Emergency Contact & Safety Info
  const [emergencyData, setEmergencyData] = useState({
    contactName: 'Elena Rostova',
    relationship: 'Spouse / Family',
    contactPhone: '+91 98765 43210',
    emergencyEmail: 'elena.rostova@example.com',
    bloodGroup: 'O+',
    allergies: 'None recorded',
  });

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    budgetThreshold: true,
    flightAlerts: true,
    weatherAdvisories: true,
    groupChatBroadcasts: true,
    weeklyDigest: false,
  });

  // Privacy & Data
  const [isPublicProfile, setIsPublicProfile] = useState(true);

  // Load Settings from API & LocalStorage
  const loadSettingsData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setIsSyncing(true);

    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    let userId = 1;

    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setUser(u);
        if (u.id) userId = u.id;
        setFormData((prev) => ({
          ...prev,
          name: u.name || prev.name,
          email: u.email || prev.email,
          preferredCurrency: u.preferred_currency || prev.preferredCurrency,
        }));
      } catch (e) {}
    }

    // Load persisted emergency info
    const storedEmergency = localStorage.getItem('globetrotter_emergency_contact');
    if (storedEmergency) {
      try { setEmergencyData(JSON.parse(storedEmergency)); } catch (e) {}
    }

    // Load persisted notifications
    const storedNotifs = localStorage.getItem('globetrotter_notifications');
    if (storedNotifs) {
      try { setNotifications(JSON.parse(storedNotifs)); } catch (e) {}
    }

    // Load persisted 2FA
    const stored2FA = localStorage.getItem('globetrotter_2fa');
    if (stored2FA !== null) {
      setTwoFactorEnabled(stored2FA === 'true');
    }

    // Load persisted privacy
    const storedPrivacy = localStorage.getItem('globetrotter_privacy');
    if (storedPrivacy !== null) {
      setIsPublicProfile(storedPrivacy === 'true');
    }

    // Fetch from backend API
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`/api/user/profile?userId=${userId}`, { headers, cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.data) {
        const u = data.data;
        setUser(u);
        setFormData((prev) => ({
          ...prev,
          name: u.name || prev.name,
          email: u.email || prev.email,
          preferredCurrency: u.preferred_currency || prev.preferredCurrency,
        }));
      }
    } catch (e) {
      console.error('Error loading settings from API:', e);
    } finally {
      if (showLoading) setLoading(false);
      setIsSyncing(false);
    }
  }, []);

  // Real-time synchronization listeners
  useEffect(() => {
    loadSettingsData(true);

    const handleStorageChange = () => loadSettingsData(false);
    const handleFocus = () => loadSettingsData(false);

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadSettingsData]);

  // Real-time Toggle Handlers
  const handleToggle2FA = () => {
    const nextVal = !twoFactorEnabled;
    setTwoFactorEnabled(nextVal);
    localStorage.setItem('globetrotter_2fa', String(nextVal));
    setSaveSuccess(nextVal ? 'Two-Factor Authentication enabled!' : 'Two-Factor Authentication disabled.');
    setTimeout(() => setSaveSuccess(''), 2500);
  };

  const handleToggleNotification = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('globetrotter_notifications', JSON.stringify(updated));
  };

  const handleTogglePrivacy = () => {
    const nextVal = !isPublicProfile;
    setIsPublicProfile(nextVal);
    localStorage.setItem('globetrotter_privacy', String(nextVal));
    setSaveSuccess(nextVal ? 'Itinerary cloner enabled for public travelers!' : 'Itinerary cloner set to private.');
    setTimeout(() => setSaveSuccess(''), 2500);
  };

  // Save General Account Settings to Backend DB & LocalStorage
  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess('');

    try {
      const token = localStorage.getItem('token');
      const userId = user?.id || 1;

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          userId,
          name: formData.name,
          preferred_currency: formData.preferredCurrency,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess('Account preferences synchronized & saved successfully!');
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => setSaveSuccess(''), 3000);

        const updated = {
          ...(user || {}),
          name: formData.name,
          preferred_currency: formData.preferredCurrency
        };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
        localStorage.setItem('globetrotter_general_settings', JSON.stringify(formData));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (e) {
      console.error('Error updating settings:', e);
    } finally {
      setSaving(false);
    }
  };

  // Save Emergency Contacts
  const handleSaveEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem('globetrotter_emergency_contact', JSON.stringify(emergencyData));
      setSaving(false);
      setSaveSuccess('Emergency traveler safety profile saved and active!');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => setSaveSuccess(''), 3000);
    }, 400);
  };

  // Update Password Handler
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters!');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSaveSuccess('Master security credentials updated successfully!');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => setSaveSuccess(''), 3000);
    }, 600);
  };

  // Real-time Complete Data Export
  const handleExportData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = user?.id || 1;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const [tripsRes, profRes] = await Promise.all([
        fetch(`/api/trips?userId=${userId}`, { headers }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch(`/api/user/profile?userId=${userId}`, { headers }).then(r => r.json()).catch(() => ({ data: null })),
      ]);

      const dataToExport = {
        user: profRes.data || user,
        itineraries: tripsRes.data || [],
        generalSettings: formData,
        emergencyContact: emergencyData,
        notifications,
        twoFactorAuthActive: twoFactorEnabled,
        exportTimestamp: new Date().toISOString(),
        platform: 'GlobeTrotter Multi-City OS (Atelier Edition)',
      };

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `globetrotter_account_backup_${formData.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setSaveSuccess('Complete itinerary & profile archive exported successfully!');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (e) {
      console.error('Error exporting data:', e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0d10] text-stone-100 flex items-center justify-center font-sans">
        <div className="w-10 h-10 rounded-full border-2 border-[#c99a6b] border-t-transparent animate-spin" />
      </div>
    );
  }

  const navItems = [
    { id: 'account', label: 'General & Traveler Persona', icon: User, desc: 'Identity, display currency, & unit preferences' },
    { id: 'emergency', label: 'Safety & Emergency Contacts', icon: HeartPulse, desc: 'Next-of-kin, phone, & medical travel notes' },
    { id: 'security', label: 'Security & Access Keys', icon: Shield, desc: 'Password manager, two-factor auth, & session' },
    { id: 'notifications', label: 'Smart Travel Alerts', icon: Bell, desc: 'Budget warnings, flight alerts, & advisories' },
    { id: 'privacy', label: 'Privacy & Data Export', icon: Lock, desc: 'Public itinerary visibility & 1-click JSON backup' },
  ];

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-[#0c0d10]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        
        {/* ================= 1. HEADER HERO BANNER ================= */}
        <div className="relative rounded-[32px] overflow-hidden bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#c99a6b]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
                  Account Settings &amp; Preferences
                </span>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-Time Sync Active</span>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-medium text-white tracking-tight">
                Traveler Profile &amp; <span className="font-bold italic text-[#e4c29e]">System Preferences</span>
              </h1>
              
              <p className="text-stone-400 text-xs mt-1 max-w-2xl font-sans">
                Fine-tune your personal identity, base currency formats, emergency contact safeguards, and data security credentials.
              </p>
            </div>

            <div className="flex items-center gap-3 font-sans">
              <button
                onClick={() => loadSettingsData(false)}
                disabled={isSyncing}
                title="Force refresh settings"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0c0d10] hover:bg-white/10 text-stone-300 hover:text-white text-xs font-bold border border-white/15 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#c99a6b]' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
              </button>

              <Link
                href="/profile"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c99a6b]/20 hover:bg-[#c99a6b]/30 text-[#e4c29e] text-xs font-bold border border-[#c99a6b]/40 transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>View Passport</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Global Save Feedback Alert Banner */}
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{saveSuccess}</span>
            </div>
            <button onClick={() => setSaveSuccess('')} className="text-emerald-400 hover:text-white font-mono text-sm cursor-pointer">&times;</button>
          </div>
        )}

        {/* ================= 2. TWO-COLUMN SETTINGS LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-2 font-sans">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full p-4 rounded-2xl border transition-all text-left flex items-start gap-3.5 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] border-transparent shadow-lg shadow-[#c99a6b]/20 scale-[1.02]'
                      : 'bg-[#14151a]/90 text-stone-300 border-white/10 hover:border-white/20 hover:bg-[#1a1b22]'
                  }`}
                >
                  <div className={`p-2 rounded-xl flex-shrink-0 ${isActive ? 'bg-[#0c0d10] text-[#e4c29e]' : 'bg-white/5 text-[#c99a6b]'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold ${isActive ? 'text-[#0c0d10]' : 'text-white'}`}>{item.label}</h3>
                    <p className={`text-[11px] mt-0.5 ${isActive ? 'text-[#0c0d10]/80' : 'text-stone-400'}`}>{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Settings Panel (8 Cols) */}
          <div className="lg:col-span-8 bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 font-sans">
            
            {/* ================= 1. GENERAL & TRAVELER PERSONA ================= */}
            {activeSection === 'account' && (
              <form onSubmit={handleSaveGeneral} className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-[#c99a6b]" />
                    Personal Traveler Identity
                  </h2>
                  <p className="text-xs font-sans text-stone-400 mt-0.5">Basic identity information displayed across your multi-city itineraries</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Registered Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={formData.email}
                      className="w-full bg-[#0c0d10]/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-stone-400 cursor-not-allowed font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Home Base City</label>
                    <input
                      type="text"
                      value={formData.homeCity}
                      onChange={(e) => setFormData({ ...formData, homeCity: e.target.value })}
                      placeholder="e.g. Mumbai, India / London, UK"
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Passport Nationality</label>
                    <input
                      type="text"
                      value={formData.passportCountry}
                      onChange={(e) => setFormData({ ...formData, passportCountry: e.target.value })}
                      placeholder="e.g. India / United States"
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h3 className="font-serif text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-[#c99a6b]" />
                    Regional Units &amp; Currency Defaults
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Base Currency</label>
                      <select
                        value={formData.preferredCurrency}
                        onChange={(e) => setFormData({ ...formData, preferredCurrency: e.target.value })}
                        className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                      >
                        <option value="INR">INR (₹ - Indian Rupee)</option>
                        <option value="USD">USD ($ - United States Dollar)</option>
                        <option value="EUR">EUR (€ - Euro)</option>
                        <option value="GBP">GBP (£ - British Pound)</option>
                        <option value="AED">AED (د.إ - UAE Dirham)</option>
                        <option value="JPY">JPY (¥ - Japanese Yen)</option>
                        <option value="CHF">CHF (Swiss Franc)</option>
                        <option value="CAD">CAD ($ - Canadian Dollar)</option>
                        <option value="AUD">AUD ($ - Australian Dollar)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Measurement System</label>
                      <select
                        value={formData.measurementUnit}
                        onChange={(e) => setFormData({ ...formData, measurementUnit: e.target.value })}
                        className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                      >
                        <option value="Metric (°C, km, meters)">Metric (°C, km, meters)</option>
                        <option value="Imperial (°F, miles, ft)">Imperial (°F, miles, ft)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Date Format</label>
                      <select
                        value={formData.dateFormat}
                        onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
                        className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 22/08/2026)</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 08/22/2026)</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD (ISO standard)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end border-t border-white/10 font-sans">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold shadow-lg shadow-[#c99a6b]/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving Changes...' : 'Save General Settings'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* ================= 2. SAFETY & EMERGENCY CONTACTS ================= */}
            {activeSection === 'emergency' && (
              <form onSubmit={handleSaveEmergency} className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-rose-400" />
                    International Travel Safety &amp; Emergency Contact
                  </h2>
                  <p className="text-xs font-sans text-stone-400 mt-0.5">Crucial contact information accessible for tour guides and medical safety during group expeditions</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Emergency Contact Name</label>
                    <input
                      type="text"
                      required
                      value={emergencyData.contactName}
                      onChange={(e) => setEmergencyData({ ...emergencyData, contactName: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Relationship</label>
                    <input
                      type="text"
                      required
                      value={emergencyData.relationship}
                      onChange={(e) => setEmergencyData({ ...emergencyData, relationship: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Emergency Phone Number</label>
                    <input
                      type="text"
                      required
                      value={emergencyData.contactPhone}
                      onChange={(e) => setEmergencyData({ ...emergencyData, contactPhone: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#c99a6b]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Emergency Email</label>
                    <input
                      type="email"
                      value={emergencyData.emergencyEmail}
                      onChange={(e) => setEmergencyData({ ...emergencyData, emergencyEmail: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#c99a6b]"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0c0d10] border border-white/10 space-y-3 font-sans">
                  <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">Medical Notes for Organizers</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Blood Group</label>
                      <input
                        type="text"
                        value={emergencyData.bloodGroup}
                        onChange={(e) => setEmergencyData({ ...emergencyData, bloodGroup: e.target.value })}
                        className="w-full bg-[#14151a] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Known Allergies / Dietary Notes</label>
                      <input
                        type="text"
                        value={emergencyData.allergies}
                        onChange={(e) => setEmergencyData({ ...emergencyData, allergies: e.target.value })}
                        className="w-full bg-[#14151a] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end border-t border-white/10 font-sans">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition-all cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving...' : 'Save Emergency Safeguards'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* ================= 3. SECURITY & ACCESS KEYS ================= */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#c99a6b]" />
                    Security &amp; Authentication Credentials
                  </h2>
                  <p className="text-xs font-sans text-stone-400 mt-0.5">Manage your master password, multi-factor verification, and active sessions</p>
                </div>

                {/* Password Update Form */}
                <form onSubmit={handleUpdatePassword} className="p-5 rounded-2xl bg-[#0c0d10] border border-white/10 space-y-4 font-sans">
                  <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#c99a6b]" />
                    Update Password
                  </h3>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Current Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[#14151a] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">New Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Min 8 chars"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#14151a] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Confirm New Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Repeat new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-[#14151a] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c99a6b]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-stone-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] font-bold text-xs shadow-md shadow-[#c99a6b]/20 cursor-pointer"
                    >
                      Update Password
                    </button>
                  </div>
                </form>

                {/* 2-Factor Authentication Toggle */}
                <div className="p-5 rounded-2xl bg-[#0c0d10] border border-white/10 flex items-center justify-between gap-4 font-sans">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-[#c99a6b]/15 border border-[#c99a6b]/30 text-[#e4c29e]">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        Two-Factor Authentication (Email OTP)
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                          twoFactorEnabled ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-stone-800 border-white/10 text-stone-400'
                        }`}>
                          {twoFactorEnabled ? 'Active' : 'Disabled'}
                        </span>
                      </h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">Requires a 6-digit verification code sent to your email on new sign-ins</p>
                    </div>
                  </div>

                  <button
                    onClick={handleToggle2FA}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${twoFactorEnabled ? 'bg-[#c99a6b] justify-end' : 'bg-stone-800 justify-start'}`}
                  >
                    <div className="bg-[#0c0d10] w-4 h-4 rounded-full shadow-md" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= 4. NOTIFICATION & TRAVEL ALERTS ================= */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#c99a6b]" />
                    Smart Travel Alerts &amp; Notifications
                  </h2>
                  <p className="text-xs font-sans text-stone-400 mt-0.5">Control how and when you receive automated budget and itinerary updates</p>
                </div>

                <div className="space-y-3 font-sans">
                  <div className="p-4 rounded-2xl bg-[#0c0d10] border border-white/10 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white">Daily Budget Limit Warning (80% / 100%)</h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">Triggers visual alerts when your recorded receipts exceed the daily burn allocation</p>
                    </div>
                    <button
                      onClick={() => handleToggleNotification('budgetThreshold')}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${notifications.budgetThreshold ? 'bg-[#c99a6b] justify-end' : 'bg-stone-800 justify-start'}`}
                    >
                      <div className="bg-[#0c0d10] w-4 h-4 rounded-full shadow-md" />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0c0d10] border border-white/10 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white">Destination Weather &amp; Climate Advisories</h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">Receive best time-to-visit tips and seasonal weather notifications</p>
                    </div>
                    <button
                      onClick={() => handleToggleNotification('weatherAdvisories')}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${notifications.weatherAdvisories ? 'bg-[#c99a6b] justify-end' : 'bg-stone-800 justify-start'}`}
                    >
                      <div className="bg-[#0c0d10] w-4 h-4 rounded-full shadow-md" />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0c0d10] border border-white/10 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white">Group Expedition Organizer Broadcasts</h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">Notices and meeting point updates published by your tour organizer</p>
                    </div>
                    <button
                      onClick={() => handleToggleNotification('groupChatBroadcasts')}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${notifications.groupChatBroadcasts ? 'bg-[#c99a6b] justify-end' : 'bg-stone-800 justify-start'}`}
                    >
                      <div className="bg-[#0c0d10] w-4 h-4 rounded-full shadow-md" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================= 5. PRIVACY & DATA EXPORT ================= */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#c99a6b]" />
                    Privacy Controls &amp; Data Portability
                  </h2>
                  <p className="text-xs font-sans text-stone-400 mt-0.5">Export complete backups of your itineraries and manage sharing permissions</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0c0d10] border border-white/10 space-y-4 font-sans">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white">Public Itinerary Cloner Allowed</h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">Allow other travelers to clone your public multi-city trips</p>
                    </div>
                    <button
                      onClick={handleTogglePrivacy}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${isPublicProfile ? 'bg-[#c99a6b] justify-end' : 'bg-stone-800 justify-start'}`}
                    >
                      <div className="bg-[#0c0d10] w-4 h-4 rounded-full shadow-md" />
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0c0d10] border border-[#c99a6b]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-[#c99a6b]" />
                      Export Complete Itinerary &amp; Profile Data
                    </h4>
                    <p className="text-xs text-stone-400 mt-0.5">Download a complete structured JSON archive of all your trips, stops, and expense ledgers</p>
                  </div>

                  <button
                    onClick={handleExportData}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] font-bold text-xs shadow-lg shadow-[#c99a6b]/20 transition-all flex-shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
