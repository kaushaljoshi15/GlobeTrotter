'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Sparkles, ArrowRight } from 'lucide-react';

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
      <div className="flex min-h-screen w-full bg-[#0c0d10] font-sans text-stone-100 selection:bg-[#c99a6b] selection:text-white">
        
        {/* Left Panel: Luxury Editorial Branding & Photography */}
        <div className="hidden lg:flex w-1/2 flex-col justify-between bg-[#111217] p-14 relative overflow-hidden border-r border-white/10">
          
          {/* Subtle Background Scene Photo with Luxury Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 filter saturate-125"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80)',
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

          {/* Hero Pitch in Playfair Display & Inter */}
          <div className="relative z-10 max-w-lg space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#e4c29e] text-xs font-sans font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Boutique Travel Architecture</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-medium text-white tracking-tight leading-tight">
              Sign in to your private <span className="font-bold italic text-[#e4c29e]">travel atelier.</span>
            </h1>

            <p className="font-serif text-base text-stone-300 leading-relaxed">
              Curate multi-city timelines, manage group expedition rosters, and balance daily budgets across breathtaking destinations.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2 text-center font-sans">
              <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 p-3 rounded-2xl">
                <span className="text-xs font-bold text-[#e4c29e] block">Traveler</span>
                <span className="text-[10px] text-stone-400">Personal Trips</span>
              </div>
              <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 p-3 rounded-2xl">
                <span className="text-xs font-bold text-stone-200 block">Organizer</span>
                <span className="text-[10px] text-stone-400">Expeditions</span>
              </div>
              <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 p-3 rounded-2xl">
                <span className="text-xs font-bold text-amber-400 block">Admin</span>
                <span className="text-[10px] text-stone-400">Hub Monitor</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-stone-500 font-sans">
            &copy; {new Date().getFullYear()} GlobeTrotter &bull; Luxury Travel Operating System
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="flex w-full lg:w-1/2 flex-col justify-center items-center p-6 sm:p-12 md:p-20 overflow-y-auto">
          <div className="w-full max-w-md space-y-6">
            
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
                Member Access
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-white tracking-tight mt-1">
                Welcome <span className="font-bold italic text-[#e4c29e]">back.</span>
              </h2>
              <p className="text-stone-400 text-xs font-sans mt-1">
                Sign in to access your curated itineraries and dashboards
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
                <span className="bg-[#0c0d10] px-3 text-stone-500 font-bold">Or with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
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

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#14151a] border border-white/15 rounded-full px-5 py-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#c99a6b] focus:ring-1 focus:ring-[#c99a6b] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#c99a6b]/30 transition-all disabled:opacity-50 active:scale-98 cursor-pointer"
              >
                {loading ? 'Entering Atelier...' : 'Sign In to Dashboard →'}
              </button>
            </form>

            <p className="text-center text-xs text-stone-400 font-sans">
              Don't have an account?{' '}
              <Link href="/register" className="font-bold text-[#e4c29e] hover:underline transition-colors">
                Create Account Free
              </Link>
            </p>

          </div>
        </div>

      </div>
    </GoogleOAuthProvider>
  );
}