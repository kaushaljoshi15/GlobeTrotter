'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Compass, Shield, Users, Sparkles, KeyRound } from 'lucide-react';

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
      desc: 'Plan bespoke multi-city journeys, discover curated sights, balance daily budgets',
      icon: Compass,
      badgeColor: 'border-[#c99a6b]/40 bg-[#c99a6b]/10 text-[#e4c29e]',
    },
    {
      id: 'organizer',
      title: 'Trip Organizer & Expedition Guide',
      desc: 'Create group expeditions, publish sharable public routes, coordinate companions',
      icon: Users,
      badgeColor: 'border-white/20 bg-white/10 text-stone-200',
    },
    {
      id: 'admin',
      title: 'Platform Administrator',
      desc: 'Manage global destination catalog, oversee analytics & security operations',
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
      <div className="flex min-h-screen w-full bg-[#0c0d10] font-sans text-stone-100 selection:bg-[#c99a6b] selection:text-white">
        
        {/* Left Branding Showcase Panel */}
        <div className="hidden lg:flex w-1/2 flex-col justify-between bg-[#111217] p-14 relative overflow-hidden border-r border-white/10">
          
          {/* Background Photo Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 filter saturate-125"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-[#0c0d10]/70 to-[#0c0d10]/80" />

          {/* Logo */}
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] flex items-center justify-center font-serif font-bold text-xs text-[#0c0d10] shadow-lg">
                GT
              </div>
              <div>
                <span className="font-serif text-xl tracking-tight text-white font-medium">the <span className="font-bold italic">GLOBETROTTER</span></span>
                <p className="text-[9px] text-[#c99a6b] font-sans font-bold uppercase tracking-[0.2em]">Atelier Edition</p>
              </div>
            </Link>
          </div>

          {/* Hero Pitch */}
          <div className="relative z-10 max-w-lg space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#e4c29e] text-xs font-sans font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Privileged Account Roles</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-medium text-white tracking-tight leading-tight">
              Begin your bespoke <span className="font-bold italic text-[#e4c29e]">travel dispatch.</span>
            </h1>

            <p className="font-serif text-base text-stone-300 leading-relaxed">
              Travelers enjoy automated daily budgets and packing checklists. Organizers manage participant rosters. Administrators curate global destination catalogs.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 font-sans">
              <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
                <span className="font-serif text-2xl font-bold text-white">12+</span>
                <p className="text-xs text-stone-400 mt-0.5">Curated Destinations</p>
              </div>
              <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
                <span className="font-serif text-2xl font-bold text-[#e4c29e]">100%</span>
                <p className="text-xs text-stone-400 mt-0.5">Automated Spend Balancing</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-stone-500 font-sans">
            &copy; {new Date().getFullYear()} GlobeTrotter &bull; Luxury Travel Operating System
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex w-full lg:w-1/2 flex-col justify-center items-center p-6 sm:p-10 md:p-12 overflow-y-auto">
          <div className="w-full max-w-md space-y-6">
            
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
                New Membership
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-white tracking-tight mt-1">
                Create your <span className="font-bold italic text-[#e4c29e]">account.</span>
              </h2>
              <p className="text-stone-400 text-xs font-sans mt-1">
                Select your account role and enter your details to start planning
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium font-sans">
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
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-sans">
                <span className="bg-[#0c0d10] px-3 text-stone-500 font-bold">Or register with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              
              {/* Role Selector Cards */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
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
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#14151a] border-[#c99a6b] ring-1 ring-[#c99a6b]/30 shadow-lg'
                            : 'bg-[#14151a]/50 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl border ${r.badgeColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white flex items-center gap-1.5 font-sans">
                              {r.title}
                              {isSelected && <span className="text-[10px] text-[#e4c29e] font-bold">✓ Active</span>}
                            </p>
                            <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">{r.desc}</p>
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
                    className="w-full bg-[#0c0d10] border border-amber-500/40 rounded-full px-4 py-2.5 text-xs text-white font-mono placeholder-stone-600 focus:outline-none focus:border-amber-400 transition-colors tracking-widest"
                  />
                  <p className="text-[10px] text-stone-400 leading-relaxed">
                    Restricted access. Authorized administrator key required to create an Admin account.
                  </p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#14151a] border border-white/15 rounded-full px-5 py-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#c99a6b] focus:ring-1 focus:ring-[#c99a6b] transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#14151a] border border-white/15 rounded-full px-5 py-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#c99a6b] focus:ring-1 focus:ring-[#c99a6b] transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Min 8 chars with Aa, 123, &amp; @#$"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#14151a] border border-white/15 rounded-full px-5 py-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#c99a6b] focus:ring-1 focus:ring-[#c99a6b] transition-all"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#c99a6b]/30 transition-all disabled:opacity-50 active:scale-98 cursor-pointer"
              >
                {loading ? 'Registering...' : 'Create Account & Start Planning →'}
              </button>
            </form>

            <p className="text-center text-xs text-stone-400 font-sans">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-[#e4c29e] hover:underline transition-colors">
                Sign In
              </Link>
            </p>

          </div>
        </div>

      </div>
    </GoogleOAuthProvider>
  );
}