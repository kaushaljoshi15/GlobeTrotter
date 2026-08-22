'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Share2,
  Copy,
  Clock,
  Check,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Globe2,
  ArrowRight
} from 'lucide-react';

export default function PublicTripSharePage({ params }: { params: Promise<{ shareCode: string }> }) {
  const { shareCode } = use(params);
  const router = useRouter();

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState(false);
  const [clonedSuccess, setClonedSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPublicTrip() {
      try {
        const res = await fetch(`/api/trips/share/${shareCode}`);
        const data = await res.json();
        if (data.success) {
          setTrip(data.data);
        }
      } catch (err) {
        console.error('Error loading public trip:', err);
      } finally {
        setLoading(false);
      }
    }

    if (shareCode) loadPublicTrip();
  }, [shareCode]);

  const handleCloneTrip = async () => {
    setCloning(true);
    try {
      const res = await fetch(`/api/trips/share/${shareCode}/clone`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        // Trigger Confetti!
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });

        setClonedSuccess(true);
        setTimeout(() => {
          router.push(`/trips/${data.data.id}`);
        }, 1500);
      }
    } catch (e) {
      console.error('Error cloning trip:', e);
      setCloning(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans">
        <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
        <MapPin className="w-12 h-12 text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Itinerary Not Found</h2>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          This shared trip might be private or the link code has expired.
        </p>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Sharable Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-xl py-4 px-6 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              GT
            </div>
            <span className="font-extrabold text-base text-white tracking-tight">GlobeTrotter</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleCloneTrip}
              disabled={cloning}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{clonedSuccess ? 'Trip Cloned!' : cloning ? 'Copying...' : 'Clone This Trip 🚀'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-12 space-y-10">
        
        {/* Cover Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <div className="h-72 sm:h-96 relative">
            <img
              src={trip.cover_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
              alt={trip.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-600/90 text-white text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                  Shared Public Itinerary
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  {trip.title}
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mt-1.5 line-clamp-2">
                  {trip.description}
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl backdrop-blur-md self-start sm:self-auto">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Estimated Budget</span>
                <p className="text-xl font-black text-emerald-400">
                  ${parseFloat(trip.total_budget || 0).toLocaleString()} {trip.currency}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Departure</span>
            <p className="text-xs font-bold text-white mt-1">{new Date(trip.start_date).toLocaleDateString()}</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Return</span>
            <p className="text-xs font-bold text-white mt-1">{new Date(trip.end_date).toLocaleDateString()}</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Stops</span>
            <p className="text-xs font-bold text-blue-400 mt-1">{trip.stops?.length || 0} Cities</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Experiences</span>
            <p className="text-xs font-bold text-amber-400 mt-1">
              {trip.stops?.reduce((acc: number, s: any) => acc + (s.activities?.length || 0), 0)} Activities
            </p>
          </div>
        </div>

        {/* Multi-City Journey Itinerary */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-blue-500" />
            Complete Day-by-Day Journey Itinerary
          </h2>

          <div className="space-y-6">
            {trip.stops?.map((stop: any, index: number) => (
              <div
                key={stop.id}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl"
              >
                <div className="p-6 bg-slate-900 flex items-center gap-4 border-b border-slate-800">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 font-black text-sm flex items-center justify-center border border-blue-500/30">
                    {index + 1}
                  </div>
                  <img src={stop.city_image_url} alt={stop.city_name} className="w-14 h-14 rounded-2xl object-cover" />
                  <div>
                    <h3 className="text-lg font-bold text-white">{stop.city_name}, {stop.country}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(stop.arrival_date).toLocaleDateString()} - {new Date(stop.departure_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-slate-950/40 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Scheduled Sights & Activities</h4>
                  {stop.activities?.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">Self-guided exploration</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {stop.activities?.map((act: any) => (
                        <div key={act.id} className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-white">{act.custom_title || act.original_activity_name}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5 capitalize">{act.category} &bull; {act.start_time} - {act.end_time}</p>
                          </div>
                          <span className="font-bold text-emerald-400">${parseFloat(act.cost).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Clone CTA Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-slate-900 border border-blue-500/30 text-center shadow-2xl flex flex-col items-center">
          <Sparkles className="w-10 h-10 text-amber-400 mb-3" />
          <h3 className="text-2xl font-black text-white mb-2">Inspired by this journey?</h3>
          <p className="text-xs text-slate-300 max-w-md mb-6">
            Click below to instantly copy all destination stops, schedules, and activities into your personal GlobeTrotter account!
          </p>
          <button
            onClick={handleCloneTrip}
            disabled={cloning}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold shadow-xl shadow-emerald-500/30 transition-all active:scale-95"
          >
            {clonedSuccess ? 'Trip Cloned!' : cloning ? 'Cloning Itinerary...' : 'Clone This Trip to My Account 🚀'}
          </button>
        </div>

      </main>

      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
        GlobeTrotter &bull; Built for the Odoo Hackathon &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
