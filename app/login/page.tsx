'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Compass, Shield, Users, Sparkles, ArrowRight, Lock, Mail } from 'lucide-react';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const redirectByRole = (role?: string) => {
    if (role === 'admin') {
      router.push('/admin');
    } else if (role === 'organizer') {
      router.push('/dashboard/organizer');
    } else {
      router.push('/dashboard/traveler');
    }
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
        redirectByRole(data.user.role);
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
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data && data.requiresVerification) {
          router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
          return;
        }
        throw new Error(data?.error || 'Invalid email or password');
      }

      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        redirectByRole(data.user.role);
      } else {
        router.push('/dashboard');
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
        
        {/* Left Panel: Branding & Showcase */}
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
              <span>Dedicated Role-Based Access</span>
            </div>

            <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
              Sign in to your personalized travel control center.
            </h1>

            <p className="text-slate-400 text-sm leading-relaxed">
              Travelers access private itineraries and packing lists. Organizers manage expedition rosters. Administrators oversee global platform operations.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-4 text-center">
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
                <span className="text-xs font-bold text-blue-400 block">Traveler</span>
                <span className="text-[10px] text-slate-500">Personal Trips</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
                <span className="text-xs font-bold text-indigo-400 block">Organizer</span>
                <span className="text-[10px] text-slate-500">Group Expeditions</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
                <span className="text-xs font-bold text-amber-400 block">Admin</span>
                <span className="text-[10px] text-slate-500">System Hub</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-slate-500">
            &copy; {new Date().getFullYear()} GlobeTrotter &bull; Built for the Odoo Hackathon
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="flex w-full lg:w-1/2 flex-col justify-center items-center p-6 sm:p-12 md:p-20 overflow-y-auto">
          <div className="w-full max-w-md space-y-6">
            
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Welcome back</h2>
              <p className="text-slate-400 text-xs mt-1">Sign in to access your dedicated role dashboard</p>
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
                <span className="bg-slate-950 px-3 text-slate-500 font-bold">Or sign in with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 active:scale-98"
              >
                {loading ? 'Signing in...' : 'Sign In to Dashboard 🚀'}
              </button>
            </form>

            <p className="text-center text-xs text-slate-400">
              Don't have an account?{' '}
              <Link href="/register" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                Register Free
              </Link>
            </p>

          </div>
        </div>

      </div>
    </GoogleOAuthProvider>
  );
}