'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import confetti from 'canvas-confetti';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Copy,
  Clock,
  Check,
  Sparkles,
  Globe2,
  Download
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
      <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex items-center justify-center font-sans">
        <div className="w-12 h-12 rounded-full border-2 border-[#c99a6b] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col items-center justify-center p-6 text-center font-sans">
        <MapPin className="w-12 h-12 text-stone-600 mb-4" />
        <h2 className="font-serif text-2xl font-bold text-white mb-2">Itinerary Not Found</h2>
        <p className="text-stone-400 text-xs max-w-md mb-6">
          This shared expedition might be private or the link code has expired.
        </p>
        <Link
          href="/dashboard"
          className="px-6 py-2.5 bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] rounded-full text-xs font-bold uppercase tracking-wider"
        >
          Return to Atelier
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-white">
      {/* Top Sharable Header */}
      <header className="border-b border-white/10 bg-[#0c0d10]/80 backdrop-blur-xl py-4 px-6 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] flex items-center justify-center text-[#0c0d10] font-serif font-bold text-xs shadow-md">
              GT
            </div>
            <span className="font-serif font-medium text-base text-white tracking-tight">the <span className="font-bold italic">GLOBETROTTER</span></span>
          </Link>

          <div className="flex items-center gap-3 font-sans">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#14151a] hover:bg-white/10 text-stone-300 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
              title="Download Itinerary PDF"
            >
              <Download className="w-3.5 h-3.5 text-[#c99a6b]" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#14151a] hover:bg-white/10 text-stone-300 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 font-bold" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleCloneTrip}
              disabled={cloning}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#c99a6b]/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{clonedSuccess ? 'Trip Cloned!' : cloning ? 'Copying...' : 'Clone This Journey →'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-12 space-y-10">
        
        {/* Cover Hero Banner */}
        <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
          <div className="h-72 sm:h-96 relative">
            <img
              src={trip.cover_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
              alt={trip.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-[#0c0d10]/60 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="px-3.5 py-1 rounded-full bg-black/60 text-[#e4c29e] text-[10px] font-sans font-bold uppercase tracking-widest mb-2 inline-block border border-white/20">
                  Shared Public Route
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl font-medium text-white tracking-tight">
                  {trip.title}
                </h1>
                <p className="font-serif text-stone-300 text-xs sm:text-sm max-w-2xl mt-1.5 line-clamp-2">
                  {trip.description}
                </p>
              </div>

              <div className="bg-[#14151a]/90 border border-white/10 p-4 rounded-2xl backdrop-blur-md self-start sm:self-auto font-sans">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Estimated Budget</span>
                <p className="font-serif text-xl font-bold text-emerald-400">
                  ${parseFloat(trip.total_budget || 0).toLocaleString()} {trip.currency}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-sans">
          <div className="bg-[#14151a]/90 border border-white/10 p-4 rounded-2xl">
            <span className="text-[10px] text-stone-400 uppercase font-semibold">Departure</span>
            <p className="text-xs font-bold text-white mt-1">{new Date(trip.start_date).toLocaleDateString()}</p>
          </div>

          <div className="bg-[#14151a]/90 border border-white/10 p-4 rounded-2xl">
            <span className="text-[10px] text-stone-400 uppercase font-semibold">Return</span>
            <p className="text-xs font-bold text-white mt-1">{new Date(trip.end_date).toLocaleDateString()}</p>
          </div>

          <div className="bg-[#14151a]/90 border border-white/10 p-4 rounded-2xl">
            <span className="text-[10px] text-stone-400 uppercase font-semibold">Stops</span>
            <p className="text-xs font-bold text-[#e4c29e] mt-1">{trip.stops?.length || 0} Cities</p>
          </div>

          <div className="bg-[#14151a]/90 border border-white/10 p-4 rounded-2xl">
            <span className="text-[10px] text-stone-400 uppercase font-semibold">Experiences</span>
            <p className="text-xs font-bold text-amber-400 mt-1">
              {trip.stops?.reduce((acc: number, s: any) => acc + (s.activities?.length || 0), 0)} Sights
            </p>
          </div>
        </div>

        {/* Multi-City Journey Itinerary */}
        <div className="space-y-6 font-sans">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
              Timeline Overview
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight mt-1 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-[#c99a6b]" />
              Complete Day-by-Day Journey Schedule
            </h2>
          </div>

          <div className="space-y-6">
            {trip.stops?.map((stop: any, index: number) => (
              <div
                key={stop.id}
                className="bg-[#14151a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
              >
                <div className="p-6 bg-[#14151a] flex items-center gap-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] font-serif font-bold text-sm flex items-center justify-center">
                    {index + 1}
                  </div>
                  <img src={stop.city_image_url} alt={stop.city_name} className="w-14 h-14 rounded-2xl object-cover" />
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">{stop.city_name}, {stop.country}</h3>
                    <p className="text-xs text-stone-400 mt-0.5 font-sans">
                      {new Date(stop.arrival_date).toLocaleDateString()} - {new Date(stop.departure_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-[#0c0d10]/50 space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Scheduled Sights &amp; Activities</h4>
                  {stop.activities?.length === 0 ? (
                    <p className="text-xs text-stone-500 italic">Self-guided exploration</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {stop.activities?.map((act: any) => (
                        <div key={act.id} className="bg-[#14151a] border border-white/10 p-3.5 rounded-2xl flex items-center justify-between text-xs">
                          <div>
                            <p className="font-serif font-bold text-white">{act.custom_title || act.original_activity_name}</p>
                            <p className="text-[11px] text-stone-400 mt-0.5 capitalize">{act.category} &bull; {act.start_time} - {act.end_time}</p>
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

        {/* Clone CTA Banner */}
        <div className="p-10 rounded-[32px] bg-[#14151a]/95 border border-white/15 text-center shadow-2xl flex flex-col items-center font-sans">
          <Sparkles className="w-8 h-8 text-[#c99a6b] mb-3" />
          <h3 className="font-serif text-3xl font-medium text-white mb-2">Inspired by this journey?</h3>
          <p className="font-serif text-xs sm:text-sm text-stone-300 max-w-md mb-6 leading-relaxed">
            Click below to instantly copy all destination stops, schedules, and activities into your personal GlobeTrotter atelier!
          </p>
          <button
            onClick={handleCloneTrip}
            disabled={cloning}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] hover:brightness-110 text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-xl shadow-[#c99a6b]/30 transition-all cursor-pointer active:scale-95"
          >
            {clonedSuccess ? 'Trip Cloned!' : cloning ? 'Cloning Itinerary...' : 'Clone This Journey to My Account →'}
          </button>
        </div>

      </main>

      <Footer />
    </div>
  );
}
