'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ScenicSlide {
  id: string;
  title: string;
  location: string;
  country: string;
  region: string;
  category: 'Alpine & Hills' | 'Coastal & Cliffs' | 'Heritage & Temples' | 'Iconic Cities';
  tag: string;
  editorialQuote: string;
  imageUrl: string;
  accentColor: string;
  exploreQuery: string;
  rating: string;
  pricePerDay: number;
}

export const SCENIC_SLIDES: ScenicSlide[] = [
  {
    id: 'swiss-alps',
    title: 'Swiss Alpine High Passes',
    location: 'Zermatt & Matterhorn',
    country: 'Switzerland',
    region: 'Valais Alps',
    category: 'Alpine & Hills',
    tag: 'Panoramic Glaciers & Mountain Ridges',
    editorialQuote: 'Where towering granite summits meet quiet glacial valleys.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2200&q=85',
    accentColor: 'from-amber-600/30 to-blue-600/20',
    exploreQuery: 'Switzerland',
    rating: '4.98',
    pricePerDay: 195
  },
  {
    id: 'banff-rockies',
    title: 'Banff Rockies & Glacial Lakes',
    location: 'Moraine Lake & Rocky Valley',
    country: 'Canada',
    region: 'Alberta High Country',
    category: 'Alpine & Hills',
    tag: 'Turquoise Waters & Ancient Pines',
    editorialQuote: 'A wilderness composed with dramatic scale and pristine solitude.',
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=2200&q=85',
    accentColor: 'from-teal-600/30 to-emerald-600/20',
    exploreQuery: 'Canada',
    rating: '4.96',
    pricePerDay: 175
  },
  {
    id: 'kyoto-hills',
    title: 'Kyoto Mist & Hillside Temples',
    location: 'Arashiyama & Higashiyama',
    country: 'Japan',
    region: 'Kansai Forest Hills',
    category: 'Heritage & Temples',
    tag: 'Bamboo Groves & Zen Pavilions',
    editorialQuote: 'Millennia of quiet architectural harmony carved into forested ridges.',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2200&q=85',
    accentColor: 'from-rose-600/30 to-amber-600/20',
    exploreQuery: 'Kyoto',
    rating: '4.97',
    pricePerDay: 150
  },
  {
    id: 'positano-amalfi',
    title: 'Amalfi Coast & Cliffside Terraces',
    location: 'Positano & Ravello',
    country: 'Italy',
    region: 'Tyrrhenian Coast',
    category: 'Coastal & Cliffs',
    tag: 'Pastel Villas & Sapphire Waters',
    editorialQuote: 'Pastel settlements suspended between sky and sapphire sea.',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2200&q=85',
    accentColor: 'from-amber-500/30 to-emerald-500/20',
    exploreQuery: 'Italy',
    rating: '4.94',
    pricePerDay: 220
  },
  {
    id: 'santorini-caldera',
    title: 'Santorini Volcanic Caldera',
    location: 'Oia & Aegean Cliffs',
    country: 'Greece',
    region: 'Cyclades Archipelago',
    category: 'Coastal & Cliffs',
    tag: 'Whitewashed Architecture & Golden Sunsets',
    editorialQuote: 'Timeless Cycladic forms overlooking the deep Mediterranean horizon.',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2200&q=85',
    accentColor: 'from-sky-500/30 to-indigo-500/20',
    exploreQuery: 'Greece',
    rating: '4.95',
    pricePerDay: 210
  },
  {
    id: 'machu-picchu',
    title: 'Machu Picchu Andean Sanctuary',
    location: 'Cusco Cloud Forest',
    country: 'Peru',
    region: 'High Andes',
    category: 'Heritage & Temples',
    tag: 'Inca Architecture & Emerald Ridges',
    editorialQuote: 'Sacred stonework elevated above the shifting mist of the Andes.',
    imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=2200&q=85',
    accentColor: 'from-emerald-600/30 to-amber-600/20',
    exploreQuery: 'Peru',
    rating: '4.99',
    pricePerDay: 135
  },
  {
    id: 'tokyo-skyline',
    title: 'Tokyo Metropolis & Night Skyline',
    location: 'Shinjuku & Shibuya',
    country: 'Japan',
    region: 'Kanto Plain',
    category: 'Iconic Cities',
    tag: 'Futuristic Towers & Culinary Alleys',
    editorialQuote: 'A mesmerizing dance of neon, precision, and boundless urban vitality.',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2200&q=85',
    accentColor: 'from-indigo-600/30 to-purple-600/20',
    exploreQuery: 'Tokyo',
    rating: '4.96',
    pricePerDay: 180
  },
  {
    id: 'bali-terraces',
    title: 'Bali Tegallalang Rice Terraces',
    location: 'Ubud Highlands',
    country: 'Indonesia',
    region: 'Central Bali Hills',
    category: 'Alpine & Hills',
    tag: 'Tropical Terraces & Mist Highlands',
    editorialQuote: 'Emerald staircases descending through jungle canopies into stillness.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2200&q=85',
    accentColor: 'from-teal-600/30 to-lime-600/20',
    exploreQuery: 'Bali',
    rating: '4.92',
    pricePerDay: 95
  }
];

const SLIDE_DURATION = 4500; // 4.5 seconds

interface BackgroundCarouselProps {
  currentIndex?: number;
  onSlideChange?: (index: number) => void;
}

export default function BackgroundCarousel({ 
  currentIndex: externalIndex, 
  onSlideChange 
}: BackgroundCarouselProps) {
  const [internalIndex, setInternalIndex] = useState(0);

  const currentIndex = externalIndex !== undefined ? externalIndex : internalIndex;

  // Preload all high-res photography
  useEffect(() => {
    SCENIC_SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.imageUrl;
    });
  }, []);

  const handleIndexChange = useCallback((newIdx: number) => {
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

  // Auto-rotation timer
  useEffect(() => {
    const slideTimer = setTimeout(() => {
      nextSlide();
    }, SLIDE_DURATION);

    return () => {
      clearTimeout(slideTimer);
    };
  }, [currentIndex, nextSlide]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0 select-none pointer-events-none">
      
      {/* Full-Screen Ambient Scenic Photography Layers */}
      {SCENIC_SLIDES.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* High-Resolution Landscape with Ken Burns Motion */}
            <div
              className={`w-full h-full bg-cover bg-center transition-transform duration-[6500ms] ease-out ${
                isActive ? 'scale-105 filter saturate-[1.25] brightness-[0.88]' : 'scale-100'
              }`}
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
              }}
            />
          </div>
        );
      })}

      {/* Atmospheric Editorial Gradients & Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-[#0c0d10]/35 to-[#0c0d10]/65 z-10" />
      <div className="absolute inset-0 bg-radial-[ellipse_at_center,_var(--tw-gradient-stops)] from-transparent via-[#0c0d10]/25 to-[#0c0d10]/75 z-10" />

    </div>
  );
}
