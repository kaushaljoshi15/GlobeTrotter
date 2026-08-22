'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Compass, Shield, Users, Sparkles, Check, ArrowRight, KeyRound } from 'lucide-react';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'traveler', // 'traveler', 'organizer', 'admin'
    adminPasscode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: 'traveler',
      title: 'Solo & Family Traveler',
      desc: 'Plan personal multi-city trips, discover hidden gems, track daily expenses',
      icon: Compass,
      badgeColor: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
    },
    {
      id: 'organizer',
      title: 'Trip Organizer & Guide',
      desc: 'Create group expeditions, publish sharable itineraries, coordinate activities',
      icon: Users,
      badgeColor: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400',
    },
    {
      id: 'admin',
      title: 'Platform Administrator',
      desc: 'Manage global destination catalog, monitor platform analytics & user access',
      icon: Shield,
      badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google login failed');

      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.role === 'admin') router.push('/admin');
        else if (data.user.role === 'organizer') router.push('/dashboard/organizer');
        else router.push('/dashboard/traveler');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character.');
      return;
    }

    if (formData.role === 'admin' && !formData.adminPasscode) {
      setError('Admin Master Passcode is required to register as an Administrator.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      if (data.requiresVerification) {
        router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
      } else {
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="flex min-h-screen w-full bg-slate-950 font-sans text-slate-100 selection:bg-blue-600 selection:text-white">
        
        {/* Left Branding Showcase Panel */}
        <div className="hidden lg:flex w-1/2 flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-12 relative overflow-hidden border-r border-slate-800/80">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Logo */}
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center font-black text-white text-base shadow-lg shadow-blue-500/20">
                GT
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">GlobeTrotter</span>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Multi-City Travel OS</p>
              </div>
            </Link>
          </div>

          {/* Hero Pitch */}
          <div className="relative z-10 max-w-lg space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dedicated Role Security</span>
            </div>

            <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
              Create your account with role-specific privileges.
            </h1>

            <p className="text-slate-400 text-sm leading-relaxed">
              Travelers receive automated budgets and checklists. Organizers manage participant rosters. Administrators unlock system-wide destination &amp; user management.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <span className="text-xl font-black text-white">12+</span>
                <p className="text-xs text-slate-400 mt-0.5">Global Destinations</p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <span className="text-xl font-black text-emerald-400">100%</span>
                <p className="text-xs text-slate-400 mt-0.5">Automated Budgets</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-slate-500">
            &copy; {new Date().getFullYear()} GlobeTrotter &bull; Built for the Odoo Hackathon
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex w-full lg:w-1/2 flex-col justify-center items-center p-6 sm:p-10 md:p-12 overflow-y-auto">
          <div className="w-full max-w-md space-y-6">
            
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Create your account</h2>
              <p className="text-slate-400 text-xs mt-1">Select your account role and enter your details to start</p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Google OAuth Button */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google sign-in failed')}
                theme="filled_black"
                shape="pill"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                <span className="bg-slate-950 px-3 text-slate-500 font-bold">Or register with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Role Selector Cards */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select Your Account Role
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const isSelected = formData.role === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setFormData({ ...formData, role: r.id })}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600/10 border-blue-500 ring-2 ring-blue-500/20'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl border ${r.badgeColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white flex items-center gap-1.5">
                              {r.title}
                              {isSelected && <span className="text-[10px] text-blue-400 font-bold">✓ Selected</span>}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{r.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Master Admin Passcode Field (Strict & Confidential) */}
              {formData.role === 'admin' && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Master Admin Security Passcode *</span>
                  </label>
                  <input
                    type="password"
                    name="adminPasscode"
                    required
                    placeholder="Enter confidential administrator passcode"
                    value={formData.adminPasscode}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors tracking-widest"
                  />
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Restricted access. Authorized administrator key required to create an Admin account.
                  </p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Min 8 chars with Aa, 123, &amp; @#$"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 active:scale-98"
              >
                {loading ? 'Creating Account...' : 'Create Account & Start Planning 🚀'}
              </button>
            </form>

            <p className="text-center text-xs text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                Sign In
              </Link>
            </p>

          </div>
        </div>

      </div>
    </GoogleOAuthProvider>
  );
}