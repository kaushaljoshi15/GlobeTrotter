'use client';

import { useState, useEffect } from 'react';
import { detectCityScenario, ScenarioSlide } from '@/lib/city-scenarios';

interface CityAdaptiveBackgroundProps {
  query?: string;
  onPlaceDetected?: (place: { city: string; country: string; location: string }) => void;
  showLiveTag?: boolean;
}

export default function CityAdaptiveBackground({
  query = 'himalayas',
  onPlaceDetected,
  showLiveTag = false,
}: CityAdaptiveBackgroundProps) {
  const [currentSlides, setCurrentSlides] = useState<ScenarioSlide[]>(() => {
    return detectCityScenario(query).slides;
  });
  const [slideIndex, setSlideIndex] = useState(0);

  // When query changes (as user types or selects a city), dynamically update the city's scenario photos
  useEffect(() => {
    const { slides } = detectCityScenario(query || 'himalayas');
    setCurrentSlides(slides);
    setSlideIndex(0);

    if (slides.length > 0 && onPlaceDetected) {
      onPlaceDetected({
        city: slides[0].city,
        country: slides[0].country,
        location: slides[0].location,
      });
    }
  }, [query]);

  // Auto-rotate the city's scenario photos every 3.5 seconds
  useEffect(() => {
    if (!currentSlides || currentSlides.length <= 1) return;

    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % currentSlides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [currentSlides]);

  const activeSlide = currentSlides[slideIndex] || currentSlides[0];

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#0c0d10]">
      {/* City Scenario Slides with Crossfade Animation */}
      {currentSlides.map((slide, idx) => {
        const isActive = idx === slideIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
              isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={slide.url}
              alt={slide.location}
              className="w-full h-full object-cover transform duration-10000 ease-linear scale-105"
            />
          </div>
        );
      })}

      {/* Atmospheric Cinema Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-[#0c0d10]/65 to-[#0c0d10]/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d10]/80 via-transparent to-[#0c0d10]/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#0c0d10_80%)]" />

      {/* Subtle Live Dynamic City Scenario HUD Badge */}
      {showLiveTag && activeSlide && (
        <div className="fixed bottom-6 right-6 z-30 pointer-events-auto hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-[#14151a]/90 backdrop-blur-2xl border border-white/15 shadow-2xl animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#e4c29e] animate-pulse" />
          <div className="text-left font-sans">
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
              Scenic Scenario &bull; {activeSlide.city}, {activeSlide.country}
            </p>
            <p className="text-xs font-serif font-bold text-white leading-tight">
              {activeSlide.location}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
