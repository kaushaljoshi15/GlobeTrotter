'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardIndexRouter() {
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        if (u.role === 'admin') {
          router.replace('/admin');
          return;
        }
        if (u.role === 'organizer') {
          router.replace('/dashboard/organizer');
          return;
        }
      } catch (e) {}
    }
    // Default route for travelers
    router.replace('/dashboard/traveler');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <p className="text-xs text-slate-400 font-semibold">Routing to your personalized dashboard...</p>
      </div>
    </div>
  );
}
