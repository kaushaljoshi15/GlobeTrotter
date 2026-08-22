'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      // Store token and user
      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Redirect to dashboard
      router.push('/dashboard'); 
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-sm font-sans">
      <div className="mb-8 text-center">
        <h2 className="font-serif text-3xl font-medium text-white mb-2">Check your email</h2>
        <p className="text-stone-400 text-xs leading-relaxed">
          We sent a 6-digit verification code to <span className="font-semibold text-[#e4c29e]">{email}</span>.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-500/10 p-3.5 border border-red-500/30 text-red-400 text-xs font-medium text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="code" className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2 text-center">
            Verification Code
          </label>
          <input
            id="code"
            type="text"
            maxLength={6}
            required
            className="block w-full rounded-full border border-white/15 bg-[#0c0d10] px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] text-white focus:border-[#c99a6b] focus:outline-none transition-colors"
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
            value={code}
            placeholder="000000"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex justify-center items-center rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#0c0d10] shadow-lg shadow-[#c99a6b]/30 transition-all active:scale-98 cursor-pointer"
          >
            Verify &amp; Enter Atelier →
          </button>
        </div>
      </form>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#0c0d10] font-sans text-stone-100 items-center justify-center p-4 selection:bg-[#c99a6b] selection:text-white">
      <div className="w-full max-w-md bg-[#14151a]/95 backdrop-blur-2xl rounded-[32px] shadow-2xl p-8 sm:p-10 border border-white/10 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] flex items-center justify-center font-serif font-bold text-xs text-[#0c0d10] shadow-md">
            GT
          </div>
          <span className="font-serif text-xl text-white tracking-tight">the <span className="font-bold italic">GLOBETROTTER</span></span>
        </Link>
        <Suspense fallback={<div className="text-xs text-stone-400">Loading...</div>}>
          <VerifyOTPForm />
        </Suspense>
      </div>
    </div>
  );
}
