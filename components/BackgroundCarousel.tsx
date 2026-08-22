'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  MapPin, 
  Mountain, 
  Sparkles, 
  Compass,
  Building2,
  Palmtree,
  Zap,
  Tag,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

export interface ScenicSlide {
  id: string;
  title: string;
  location: string;
  country: string;
  category: 'Hills & Mountains' | 'Iconic City' | 'Coastal & Cliffs' | 'Heritage & Nature';
  tag: string;
  promoBadge: string;
  badgeColor: string;
  description: string;
  imageUrl: string;
  accentColor: string;
  exploreQuery: string;
  rating: string;
  pricePerDay: number;
}

export const SCENIC_SLIDES: ScenicSlide[] = [
  {
    id: 'swiss-alps',
    title: 'Swiss Alps & Matterhorn Peaks',
    location: 'Zermatt & Valais Valley',
    country: 'Switzerland',
    category: 'Hills & Mountains',
    tag: 'Alpine Peaks & Panoramic Glaciers',
    promoBadge: '🔥 Top Scenic Hill Trek 2026',
    badgeColor: 'bg-red-500/80 text-white',
    description: 'Iconic snow-draped alpine summits, crystal-clear glacial lakes, and panoramic scenic railways.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85',
    accentColor: 'from-blue-600 to-cyan-400',
    exploreQuery: 'Switzerland',
    rating: '4.98',
    pricePerDay: 180
  },
  {
    id: 'banff-rockies',
    title: 'Banff Rockies & Moraine Lake',
    location: 'Alberta Rockies',
    country: 'Canada',
    category: 'Hills & Mountains',
    tag: 'Turquoise Lakes & Pine Valleys',
    promoBadge: '🏔️ Best Wilderness Hills',
    badgeColor: 'bg-emerald-500/80 text-white',
    description: 'Electrifying turquoise waters surrounded by soaring Canadian Rocky peaks and evergreen forests.',
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=2000&q=85',
    accentColor: 'from-cyan-400 to-blue-500',
    exploreQuery: 'Canada',
    rating: '4.95',
    pricePerDay: 165
  },
  {
    id: 'kyoto-hills',
    title: 'Kyoto Pagodas & Bamboo Hills',
    location: 'Arashiyama Hills',
    country: 'Japan',
    category: 'Heritage & Nature',
    tag: 'Ancient Temples & Misty Hills',
    promoBadge: '🌸 Autumn Foliage Route',
    badgeColor: 'bg-pink-500/80 text-white',
    description: 'Historic wooden shrines nestled among vibrant hillside forests and tranquil zen rock gardens.',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2000&q=85',
    accentColor: 'from-amber-500 to-rose-400',
    exploreQuery: 'Kyoto',
    rating: '4.97',
    pricePerDay: 140
  },
  {
    id: 'positano-amalfi',
    title: 'Amalfi Coast & Positano Cliffs',
    location: 'Amalfi Coastline',
    country: 'Italy',
    category: 'Coastal & Cliffs',
    tag: 'Cliffside Pastel Hill Villages',
    promoBadge: '☀️ Mediterranean Dream',
    badgeColor: 'bg-amber-500/80 text-white',
    description: 'Colorful pastel houses cascading down steep Mediterranean sea cliffs into azure waters.',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2000&q=85',
    accentColor: 'from-emerald-400 to-teal-300',
    exploreQuery: 'Italy',
    rating: '4.92',
    pricePerDay: 210
  },
  {
    id: 'tokyo-skyline',
    title: 'Tokyo Metropolis & Neon Towers',
    location: 'Shinjuku & Shibuya',
    country: 'Japan',
    category: 'Iconic City',
    tag: 'Futuristic Skyline & Cyber Nightlife',
    promoBadge: '⚡ #1 City Adventure',
    badgeColor: 'bg-indigo-500/80 text-white',
    description: 'Dazzling neon avenues, futuristic bullet trains, and world-renowned culinary hotspots.',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2000&q=85',
    accentColor: 'from-pink-500 to-indigo-500',
    exploreQuery: 'Tokyo',
    rating: '4.96',
    pricePerDay: 175
  },
  {
    id: 'santorini-caldera',
    title: 'Santorini Caldera & White Villas',
    location: 'Oia & Aegean Hills',
    country: 'Greece',
    category: 'Coastal & Cliffs',
    tag: 'Volcanic Hills & Sunset Views',
    promoBadge: '🌅 Iconic Golden Sunset',
    badgeColor: 'bg-sky-500/80 text-white',
    description: 'World-famous whitewashed cliff villas perched over the deep blue caldera of the Aegean.',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2000&q=85',
    accentColor: 'from-sky-400 to-indigo-400',
    exploreQuery: 'Greece',
    rating: '4.94',
    pricePerDay: 195
  },
  {
    id: 'machu-picchu',
    title: 'Machu Picchu Andean Citadel',
    location: 'Cusco Highlands',
    country: 'Peru',
    category: 'Hills & Mountains',
    tag: 'Ancient Inca Mountain Sanctuary',
    promoBadge: '🏛️ World Wonder Peak',
    badgeColor: 'bg-amber-600/80 text-white',
    description: 'Ancient stone city towering high above cloud forest valleys and green Andean ridge peaks.',
    imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=2000&q=85',
    accentColor: 'from-emerald-500 to-amber-400',
    exploreQuery: 'Peru',
    rating: '4.99',
    pricePerDay: 130
  },
  {
    id: 'bali-terraces',
    title: 'Bali Tegallalang Rice Hills',
    location: 'Ubud Highlands',
    country: 'Indonesia',
    category: 'Heritage & Nature',
    tag: 'Tropical Emerald Terraces',
    promoBadge: '🌴 Tropical Hill Retreat',
    badgeColor: 'bg-teal-500/80 text-white',
    description: 'Lush green terraced hillsides, tropical palm groves, waterfalls, and peaceful spiritual retreats.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=85',
    accentColor: 'from-teal-400 to-emerald-500',
    exploreQuery: 'Bali',
    rating: '4.91',
    pricePerDay: 85
  }
];

const FAST_SLIDE_DURATION = 3200; // Fast rotation (3.2 seconds)

interface BackgroundCarouselProps {
  currentIndex?: number;
  onSlideChange?: (index: number) => void;
}

export default function BackgroundCarousel({ 
  currentIndex: externalIndex, 
  onSlideChange 
}: BackgroundCarouselProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const currentIndex = externalIndex !== undefined ? externalIndex : internalIndex;

  // Preload all high-res photos
  useEffect(() => {
    SCENIC_SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.imageUrl;
    });
  }, []);

  const handleIndexChange = useCallback((newIdx: number) => {
    setProgress(0);
    if (onSlideChange) {
      onSlideChange(newIdx);
    } else {
      setInternalIndex(newIdx);
    }
  }, [onSlideChange]);

  const nextSlide = useCallback(() => {
    const nextIdx = (currentIndex + 1) % SCENIC_SLIDES.length;
    handleIndexChange(nextIdx);
  }, [currentIndex, handleIndexChange]);

  const prevSlide = useCallback(() => {
    const prevIdx = (currentIndex - 1 + SCENIC_SLIDES.length) % SCENIC_SLIDES.length;
    handleIndexChange(prevIdx);
  }, [currentIndex, handleIndexChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Fast auto-rotation & progress bar ticker
  useEffect(() => {
    if (!isPlaying) return;

    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsed / FAST_SLIDE_DURATION) * 100);
      setProgress(currentProgress);
    }, 30);

    const slideTimer = setTimeout(() => {
      nextSlide();
    }, FAST_SLIDE_DURATION);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(slideTimer);
    };
  }, [isPlaying, currentIndex, nextSlide]);

  const currentSlide = SCENIC_SLIDES[currentIndex];

  return (
    <div className="absolute top-0 left-0 right-0 w-full h-[120vh] min-h-[920px] overflow-hidden z-0 pointer-events-none select-none">
      
      {/* High-Resolution Photo Carousel Layers */}
      {SCENIC_SLIDES.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Vivid Background Image with Subtle Ken Burns Zoom */}
            <div
              className={`w-full h-full bg-cover bg-center transition-transform duration-[4000ms] ease-out ${
                isActive ? 'scale-105 filter saturate-[1.3] brightness-[0.85]' : 'scale-100'
              }`}
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
              }}
            />
          </div>
        );
      })}

      {/* Balanced Multi-Stage Contrast Overlay so Photos Pop while Text Stays 100% Crisp */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/45 to-slate-950 z-10" />
      <div className="absolute inset-0 bg-radial-[ellipse_at_top,_var(--tw-gradient-stops)] from-transparent via-slate-950/40 to-slate-950 z-10" />
      
      {/* Subtle Glowing Accent light based on the active scenic destination */}
      <div 
        className={`absolute top-[-5%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr ${currentSlide.accentColor} opacity-30 rounded-full blur-[120px] z-10 transition-all duration-700`}
      />

      {/* Floating Bottom Scenic Spotlight & Carousel Controls (Interactive) */}
      <div className="absolute bottom-10 left-0 right-0 z-30 max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto">
        
        {/* Active Scene Billboard / Ad Card */}
        <div className="flex items-center gap-3 bg-slate-950/85 backdrop-blur-2xl border border-slate-700/80 px-4 py-3 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.7)] text-left max-w-lg w-full sm:w-auto hover:border-blue-500/50 transition-all">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-700 relative shadow-md">
            <img 
              src={currentSlide.imageUrl} 
              alt={currentSlide.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-600/10" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${currentSlide.badgeColor}`}>
                {currentSlide.promoBadge}
              </span>
              <span className="text-[11px] text-slate-300 font-bold truncate">
                📍 {currentSlide.country}
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-white truncate mt-0.5">
              {currentSlide.title}
            </h4>
            <p className="text-[11px] text-slate-300 truncate">
              {currentSlide.tag} &bull; <span className="text-emerald-400 font-bold">${currentSlide.pricePerDay}/day</span>
            </p>
          </div>

          <Link
            href={`/explore`}
            className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl transition-all flex items-center gap-1 shadow-md shadow-blue-600/30 shrink-0"
            title="Explore in catalog"
          >
            <span>Explore</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Carousel Fast Thumbnail Switchers & Controls */}
        <div className="flex items-center gap-2.5 bg-slate-950/90 backdrop-blur-2xl border border-slate-700/90 p-2 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.7)]">
          
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all active:scale-90 cursor-pointer"
            aria-label="Previous scene"
            title="Previous scene"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Miniature Photo Thumbnails with live Progress Bar */}
          <div className="flex items-center gap-1.5 px-1">
            {SCENIC_SLIDES.map((slide, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => handleIndexChange(idx)}
                  className={`group relative transition-all duration-200 rounded-lg overflow-hidden cursor-pointer border ${
                    isSelected 
                      ? 'w-14 h-7 border-blue-400 ring-2 ring-blue-500 shadow-lg shadow-blue-500/40 scale-105' 
                      : 'w-7 h-7 border-slate-700 opacity-60 hover:opacity-100 hover:w-10'
                  }`}
                  title={`${slide.title} (${slide.country})`}
                >
                  <img 
                    src={slide.imageUrl} 
                    alt={slide.title} 
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900/90">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 transition-all duration-75" 
                        style={{ width: `${progress}%` }} 
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Play/Pause Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all active:scale-90 cursor-pointer"
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            title={isPlaying ? 'Pause auto-rotation' : 'Resume auto-rotation'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 text-blue-400" />
            )}
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all active:scale-90 cursor-pointer"
            aria-label="Next scene"
            title="Next scene"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
}
