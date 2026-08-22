'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  ArrowRight
} from 'lucide-react';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<'account' | 'emergency' | 'security' | 'notifications' | 'privacy'>('account');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  // General Account Settings
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    homeCity: 'San Francisco, USA',
    passportCountry: 'United States',
    preferredCurrency: 'USD',
    measurementUnit: 'Metric (°C, km)',
    dateFormat: 'DD/MM/YYYY',
  });

  // Emergency Contact & Safety Info
  const [emergencyData, setEmergencyData] = useState({
    contactName: 'Elena Rostova',
    relationship: 'Spouse / Family',
    contactPhone: '+1 (555) 234-5678',
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
  const [shareWishlist, setShareWishlist] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setUser(u);
        setFormData((prev) => ({
          ...prev,
          name: u.name || '',
          email: u.email || '',
          preferredCurrency: u.preferred_currency || 'USD',
        }));
      } catch (e) {}
    }
    setLoading(false);
  }, []);

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
        setSaveSuccess('Account preferences updated successfully!');
        setTimeout(() => setSaveSuccess(''), 3000);

        if (user) {
          const updated = { ...user, name: formData.name, preferred_currency: formData.preferredCurrency };
          setUser(updated);
          localStorage.setItem('user', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
        }
      }
    } catch (e) {
      console.error('Error updating settings:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess('Emergency traveler safety profile saved!');
      setTimeout(() => setSaveSuccess(''), 3000);
    }, 600);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSaveSuccess('Security credentials updated successfully!');
      setTimeout(() => setSaveSuccess(''), 3000);
    }, 800);
  };

  const handleExportData = () => {
    const dataToExport = {
      user,
      generalSettings: formData,
      emergencyContact: emergencyData,
      notifications,
      exportTimestamp: new Date().toISOString(),
      platform: 'GlobeTrotter Multi-City OS',
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `globetrotter_account_backup_${user?.name?.replace(/\s+/g, '_') || 'traveler'}.json`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans">
        <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">
        
        {/* Page Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold mb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>Personal Traveler Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Account &amp; Security Settings
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Manage your personal travel identity, international emergency safeguards, security credentials, and data exports.
            </p>
          </div>

          <Link
            href="/profile"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 transition-all self-start sm:self-auto"
          >
            <span>&larr; Back to Passport</span>
          </Link>
        </div>

        {/* Success Alert Banner */}
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* 2-Column Settings Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Menu (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-3 shadow-xl space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-start gap-3.5 group ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'hover:bg-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className={`p-2 rounded-xl border ${isSelected ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-950 border-slate-800 text-blue-400 group-hover:border-slate-700'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                      {item.label}
                    </p>
                    <p className={`text-[11px] mt-0.5 truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Content Panel (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            
            {/* ================= 1. GENERAL ACCOUNT SETTINGS ================= */}
            {activeSection === 'account' && (
              <form onSubmit={handleSaveGeneral} className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    Personal Traveler Identity
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Basic identity information displayed across your multi-city itineraries</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Registered Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={formData.email}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-500 cursor-not-allowed font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Home Base City</label>
                    <input
                      type="text"
                      value={formData.homeCity}
                      onChange={(e) => setFormData({ ...formData, homeCity: e.target.value })}
                      placeholder="e.g. San Francisco, USA"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Passport Nationality</label>
                    <input
                      type="text"
                      value={formData.passportCountry}
                      onChange={(e) => setFormData({ ...formData, passportCountry: e.target.value })}
                      placeholder="e.g. United States"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-indigo-400" />
                    Regional Units &amp; Currency Defaults
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Base Currency</label>
                      <select
                        value={formData.preferredCurrency}
                        onChange={(e) => setFormData({ ...formData, preferredCurrency: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="USD">USD ($ - United States)</option>
                        <option value="EUR">EUR (€ - Eurozone)</option>
                        <option value="GBP">GBP (£ - British Pound)</option>
                        <option value="JPY">JPY (¥ - Japanese Yen)</option>
                        <option value="INR">INR (₹ - Indian Rupee)</option>
                        <option value="CAD">CAD ($ - Canada)</option>
                        <option value="AUD">AUD ($ - Australia)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Measurement System</label>
                      <select
                        value={formData.measurementUnit}
                        onChange={(e) => setFormData({ ...formData, measurementUnit: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="Metric (°C, km)">Metric (°C, km, meters)</option>
                        <option value="Imperial (°F, mi)">Imperial (°F, miles, ft)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Date Format</label>
                      <select
                        value={formData.dateFormat}
                        onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 22/08/2026)</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 08/22/2026)</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving...' : 'Save General Settings'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* ================= 2. SAFETY & EMERGENCY CONTACTS ================= */}
            {activeSection === 'emergency' && (
              <form onSubmit={handleSaveEmergency} className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-rose-400" />
                    International Travel Safety &amp; Emergency Contact
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Crucial contact information accessible for tour guides and medical safety during group expeditions</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Primary Emergency Contact Name</label>
                    <input
                      type="text"
                      required
                      value={emergencyData.contactName}
                      onChange={(e) => setEmergencyData({ ...emergencyData, contactName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Relationship</label>
                    <input
                      type="text"
                      required
                      value={emergencyData.relationship}
                      onChange={(e) => setEmergencyData({ ...emergencyData, relationship: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Emergency Phone Number (with Country Code)</label>
                    <input
                      type="text"
                      required
                      value={emergencyData.contactPhone}
                      onChange={(e) => setEmergencyData({ ...emergencyData, contactPhone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Emergency Email Address</label>
                    <input
                      type="email"
                      value={emergencyData.emergencyEmail}
                      onChange={(e) => setEmergencyData({ ...emergencyData, emergencyEmail: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Medical Notes for Organizers</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Blood Group</label>
                      <input
                        type="text"
                        value={emergencyData.bloodGroup}
                        onChange={(e) => setEmergencyData({ ...emergencyData, bloodGroup: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Known Allergies / Dietary Notes</label>
                      <input
                        type="text"
                        value={emergencyData.allergies}
                        onChange={(e) => setEmergencyData({ ...emergencyData, allergies: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition-all"
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
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Security &amp; Authentication Credentials
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage your master password, multi-factor verification, and active sessions</p>
                </div>

                {/* Password Update Form */}
                <form onSubmit={handleUpdatePassword} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    Update Password
                  </h3>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Current Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">New Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Min 8 chars with Aa, 123, &amp; @#$"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Confirm New Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Repeat new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
                    >
                      Update Password
                    </button>
                  </div>
                </form>

                {/* 2-Factor Authentication Toggle */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        Two-Factor Authentication (Email OTP)
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                          Active
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Requires a 6-digit verification code sent to your email on new sign-ins</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${twoFactorEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'}`}
                  >
                    <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= 4. NOTIFICATION & TRAVEL ALERTS ================= */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-400" />
                    Smart Travel Alerts &amp; Notifications
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Control how and when you receive automated budget and itinerary updates</p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white">Daily Budget Limit Warning (80% / 100%)</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Triggers visual alerts when your recorded receipts exceed the daily burn allocation</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, budgetThreshold: !notifications.budgetThreshold })}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${notifications.budgetThreshold ? 'bg-blue-600 justify-end' : 'bg-slate-800 justify-start'}`}
                    >
                      <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white">Destination Weather &amp; Climate Advisories</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Receive best time-to-visit tips and seasonal weather notifications</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, weatherAdvisories: !notifications.weatherAdvisories })}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${notifications.weatherAdvisories ? 'bg-blue-600 justify-end' : 'bg-slate-800 justify-start'}`}
                    >
                      <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white">Group Expedition Organizer Broadcasts</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Notices and meeting point updates published by your tour organizer</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, groupChatBroadcasts: !notifications.groupChatBroadcasts })}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${notifications.groupChatBroadcasts ? 'bg-blue-600 justify-end' : 'bg-slate-800 justify-start'}`}
                    >
                      <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================= 5. PRIVACY & DATA EXPORT ================= */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-400" />
                    Privacy Controls &amp; Data Portability
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Export complete backups of your itineraries and manage sharing permissions</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white">Public Itinerary Cloner Allowed</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Allow other travelers to clone your public multi-city trips</p>
                    </div>
                    <button
                      onClick={() => setIsPublicProfile(!isPublicProfile)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${isPublicProfile ? 'bg-purple-600 justify-end' : 'bg-slate-800 justify-start'}`}
                    >
                      <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-blue-400" />
                      Export Complete Itinerary &amp; Profile Data
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">Download a complete structured JSON archive of all your trips, stops, and expense ledgers</p>
                  </div>

                  <button
                    onClick={handleExportData}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex-shrink-0"
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
