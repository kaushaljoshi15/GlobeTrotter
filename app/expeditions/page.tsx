'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  ArrowRight,
  Sparkles,
  Shield,
  Star,
  Check,
  Search,
  Filter,
  Users,
  Clock,
  Layers,
  ChevronRight,
  Flame
} from 'lucide-react';

const CURATED_EXPEDITIONS = [
  {
    id: 'exp-1',
    title: 'Alpine Glacier Express & Grand Swiss Peaks',
    subtitle: 'Zurich &bull; Lucerne &bull; Interlaken &bull; Zermatt',
    duration: '10 Days / 9 Nights',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    organizer: {
      name: 'Marcus Vance',
      avatar: 'M',
      badge: 'Certified Alpine Master',
      rating: 4.9,
      tripsLed: 42
    },
    capacity: '9 / 12 Booked',
    price: 2850,
    currency: 'USD',
    region: 'Europe',
    category: 'Alpine Adventure',
    stops: ['Zurich', 'Lucerne', 'Interlaken', 'Zermatt (Matterhorn)'],
    highlights: ['First-class Glacier Express scenic train', 'Jungfraujoch Top of Europe ascent', 'Zermatt Fondue masterclass'],
    departureDates: ['Oct 12, 2026', 'Nov 05, 2026', 'Dec 01, 2026']
  },
  {
    id: 'exp-2',
    title: 'Kyoto Tea Sanctuary & Tokyo Neon Odyssey',
    subtitle: 'Tokyo &bull; Hakone &bull; Kyoto &bull; Nara',
    duration: '12 Days / 11 Nights',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    organizer: {
      name: 'Kenjiro Sato',
      avatar: 'K',
      badge: 'Historic Kyoto Curator',
      rating: 5.0,
      tripsLed: 58
    },
    capacity: '10 / 14 Booked',
    price: 3400,
    currency: 'USD',
    region: 'Asia',
    category: 'Culture & Gastronomy',
    stops: ['Tokyo (Shinjuku)', 'Hakone (Mt Fuji View)', 'Kyoto (Gion)', 'Nara Deer Park'],
    highlights: ['Private tea ceremony in 400-year-old temple', 'Shinkansen bullet train speed pass', 'Michelin-starred Kaiseki dining'],
    departureDates: ['Oct 20, 2026', 'Nov 14, 2026', 'Dec 08, 2026']
  },
  {
    id: 'exp-3',
    title: 'Amalfi Cliffside & Tuscan Vineyard Safari',
    subtitle: 'Rome &bull; Florence &bull; Siena &bull; Positano',
    duration: '9 Days / 8 Nights',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    organizer: {
      name: 'Sofia Rossi',
      avatar: 'S',
      badge: 'Italian Heritage Specialist',
      rating: 4.95,
      tripsLed: 37
    },
    capacity: '7 / 10 Booked',
    price: 2600,
    currency: 'USD',
    region: 'Europe',
    category: 'Coastal Luxury',
    stops: ['Rome', 'Florence', 'Siena', 'Positano (Amalfi)'],
    highlights: ['Chianti private estate wine tasting', 'Sunset yacht cruise past Capri Faraglioni', 'Skip-the-line Uffizi Gallery tour'],
    departureDates: ['Sep 28, 2026', 'Oct 18, 2026', 'Nov 02, 2026']
  },
  {
    id: 'exp-4',
    title: 'Icelandic Ring Road & Aurora Borealis Hunt',
    subtitle: 'Reykjavik &bull; Vik &bull; Akureyri &bull; Blue Lagoon',
    duration: '8 Days / 7 Nights',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
    organizer: {
      name: 'Astrid Lind',
      avatar: 'A',
      badge: 'Arctic Expedition Lead',
      rating: 4.88,
      tripsLed: 29
    },
    capacity: '11 / 12 Booked',
    price: 3150,
    currency: 'USD',
    region: 'Europe',
    category: 'Arctic & Aurora',
    stops: ['Reykjavik', 'Vik Black Sand Beach', 'Jokulsarlon Glacier', 'Akureyri'],
    highlights: ['Superjeep glacier ice cave exploration', 'Nightly Northern Lights tracking', 'Geo-thermal mineral soak at Blue Lagoon'],
    departureDates: ['Nov 10, 2026', 'Dec 05, 2026', 'Jan 15, 2027']
  }
];

export default function ExpeditionsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExpedition, setSelectedExpedition] = useState<any>(null);
  const [clonedSuccess, setClonedSuccess] = useState(false);

  const filteredExpeditions = CURATED_EXPEDITIONS.filter((exp) => {
    const matchesSearch = exp.title.toLowerCase().includes(search.toLowerCase()) || 
                          exp.stops.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || exp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCloneExpedition = async (exp: any) => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      let userId = 1;
      if (storedUser) {
        try { userId = JSON.parse(storedUser).id || 1; } catch (e) {}
      }

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/trips', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userId,
          title: `${exp.title} (Curated Tour)`,
          description: `Group tour led by ${exp.organizer.name}. Includes ${exp.stops.join(' -> ')}.`,
          startDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          endDate: new Date(Date.now() + 24 * 86400000).toISOString().split('T')[0],
          totalBudget: exp.price,
          currency: exp.currency,
          visibility: 'private',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setClonedSuccess(true);
        setTimeout(() => {
          setClonedSuccess(false);
          setSelectedExpedition(null);
        }, 2000);
      }
    } catch (e) {
      console.error('Error cloning trip:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-[#0c0d10]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
        
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#e4c29e] text-[11px] font-sans font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
            <span>Curated Group Expeditions &bull; Edition 2026</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-white tracking-tight mb-3">
            Curated Multi-City <span className="font-bold italic text-[#e4c29e]">Group Tours.</span>
          </h1>

          <p className="font-serif text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
            Experience hand-crafted multi-destination journeys led by verified tour organizers. Small group capacities, luxury lodging, and authentic local access.
          </p>
        </div>

        {/* Search & Filter Strip */}
        <div className="bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 p-5 sm:p-6 rounded-[32px] shadow-2xl space-y-4 font-sans">
          
          <div className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expeditions by tour title or destination stops (e.g. Switzerland, Tokyo, Amalfi, Zermatt)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0c0d10] border border-white/15 rounded-full pl-12 pr-6 py-3.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b] transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-2">Category:</span>
            {['all', 'Alpine Adventure', 'Culture & Gastronomy', 'Coastal Luxury', 'Arctic & Aurora'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] font-bold shadow-md shadow-[#c99a6b]/20'
                    : 'bg-[#0c0d10] text-stone-300 border border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat === 'all' ? 'All Expeditions' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Expeditions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredExpeditions.map((exp) => (
            <div
              key={exp.id}
              className="bg-[#14151a]/95 border border-white/10 hover:border-[#c99a6b]/50 rounded-[32px] overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Cover Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14151a] via-[#14151a]/40 to-transparent" />

                <div className="absolute top-4 left-4 flex items-center gap-2 font-sans">
                  <span className="px-3.5 py-1 rounded-full bg-[#0c0d10]/90 backdrop-blur-md border border-white/15 text-[#e4c29e] text-[10px] font-bold uppercase tracking-wider">
                    {exp.category}
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-[#0c0d10]/90 backdrop-blur-md border border-white/15 text-stone-300 text-[10px] font-medium">
                    {exp.duration}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[10px] font-sans font-bold">
                    ● {exp.capacity}
                  </span>
                </div>

                <div className="absolute bottom-4 left-6 right-6">
                  <h3 className="font-serif text-2xl font-bold text-white leading-snug drop-shadow-md">
                    {exp.title}
                  </h3>
                  <p className="text-xs font-sans text-stone-300 mt-0.5">{exp.subtitle}</p>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Lead Organizer Profile */}
                <div className="p-4 rounded-2xl bg-[#0c0d10] border border-white/10 flex items-center justify-between font-sans">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] font-serif font-bold flex items-center justify-center text-sm shadow-md">
                      {exp.organizer.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{exp.organizer.name}</p>
                      <p className="text-[11px] text-[#e4c29e]">{exp.organizer.badge}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-amber-300 font-bold flex items-center gap-1 justify-end">
                      ★ {exp.organizer.rating}
                    </span>
                    <span className="text-[10px] text-stone-400">{exp.organizer.tripsLed} Tours Led</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-2 font-sans">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 block mb-1">
                    What&apos;s Included &amp; Key Highlights:
                  </span>
                  {exp.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-stone-300">
                      <Check className="w-3.5 h-3.5 text-[#c99a6b] flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Scheduled Stops Pills */}
                <div className="space-y-2 font-sans">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 block">
                    Expedition Route:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {exp.stops.map((stop, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] text-stone-200">
                        {stop}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Bar */}
              <div className="px-6 sm:px-8 py-5 border-t border-white/10 bg-[#0c0d10]/70 flex items-center justify-between font-sans">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">All-Inclusive</span>
                  <p className="font-serif text-2xl font-bold text-[#e4c29e]">
                    ${exp.price.toLocaleString()} <span className="font-sans text-xs font-normal text-stone-400">/ person</span>
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setSelectedExpedition(exp)}
                    className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-stone-200 hover:text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleCloneExpedition(exp)}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold shadow-lg shadow-[#c99a6b]/20 transition-all cursor-pointer"
                  >
                    Clone Itinerary
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Detailed Modal */}
        {selectedExpedition && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#14151a] border border-white/15 rounded-[32px] max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#c99a6b]">{selectedExpedition.category}</span>
                  <h3 className="font-serif text-2xl font-bold text-white mt-0.5">{selectedExpedition.title}</h3>
                  <p className="text-xs text-stone-400 font-sans mt-0.5">{selectedExpedition.duration} &bull; Led by {selectedExpedition.organizer.name}</p>
                </div>

                <button
                  onClick={() => setSelectedExpedition(null)}
                  className="p-2 rounded-xl bg-white/5 text-stone-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 font-sans">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-300">Scheduled Multi-City Route:</span>
                <div className="space-y-2">
                  {selectedExpedition.stops.map((stop: string, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-[#0c0d10] border border-white/10 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#c99a6b]/20 text-[#e4c29e] font-serif font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <span className="text-xs font-bold text-white">{stop}</span>
                    </div>
                  ))}
                </div>
              </div>

              {clonedSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Expedition cloned into your private itineraries portfolio!</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3 font-sans">
                <button
                  onClick={() => setSelectedExpedition(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-bold"
                >
                  Close
                </button>

                <button
                  onClick={() => handleCloneExpedition(selectedExpedition)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold shadow-lg shadow-[#c99a6b]/20"
                >
                  Clone into My Itineraries
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
