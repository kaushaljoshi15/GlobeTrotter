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
  Flame,
  Train,
  CheckCircle2,
  Hotel,
  Utensils,
  Camera
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
    departureDates: ['Oct 12, 2026', 'Nov 05, 2026', 'Dec 01, 2026'],
    inclusions: [
      'First-Class Swiss Travel Pass (All trains, boats & 50% mountain cableways)',
      '9 Nights in boutique 4-star & 5-star Swiss alpine chalets & lakeside hotels',
      'Daily artisan breakfast buffets and 4 curated multi-course dinners',
      'Certified English-speaking Alpine Expedition Master & luggage transfers',
      'All scenic rail reservations: Glacier Express, Gornergrat & Pilatus Cogwheel'
    ],
    dailyPlan: [
      {
        day: 1,
        title: 'Arrival in Zurich & Medieval Altstadt Stroll',
        city: 'Zurich',
        lodging: 'Storchen Zurich 5-Star Riverside Hotel',
        activities: [
          { time: '10:00', title: 'SBB Airport Meet & First-Class Rail Pass Activation', cost: 0, category: 'Transit' },
          { time: '14:00', title: 'Altstadt Medieval Guild Quarter & Grossmünster Walk', cost: 25, category: 'Culture' },
          { time: '19:30', title: 'Lake Zurich Welcome Dinner at Historic Zunfthaus', cost: 75, category: 'Dining' }
        ]
      },
      {
        day: 2,
        title: 'Scenic Rail to Lucerne & Paddle Steamer Cruise',
        city: 'Lucerne',
        lodging: 'Hotel Schweizerhof Lucerne',
        activities: [
          { time: '09:30', title: 'SBB InterCity Rail Hop to Lucerne (45m)', cost: 25, category: 'Transit' },
          { time: '11:30', title: 'Historic 14th-Century Covered Chapel Bridge & Lion Monument', cost: 0, category: 'Sightseeing' },
          { time: '15:00', title: 'Lake Lucerne Historic Paddle Steamer Cruise with Alpine Backdrop', cost: 35, category: 'Sightseeing' }
        ]
      },
      {
        day: 3,
        title: 'Mount Pilatus Dragon Ride & World Steepest Cogwheel',
        city: 'Lucerne',
        lodging: 'Hotel Schweizerhof Lucerne',
        activities: [
          { time: '09:00', title: 'Aerial Dragon Ride Cableway Ascent to Pilatus Kulm 2,132m', cost: 78, category: 'Adventure' },
          { time: '13:00', title: 'World Steepest Cogwheel Railway Descent (48% Gradient)', cost: 0, category: 'Adventure' },
          { time: '17:00', title: 'Swiss Alpine Chocolate Tasting Masterclass', cost: 40, category: 'Culture' }
        ]
      },
      {
        day: 4,
        title: 'Luzern-Interlaken Scenic Express & 72 Waterfalls Valley',
        city: 'Interlaken',
        lodging: 'Victoria-Jungfrau Grand Hotel & Spa',
        activities: [
          { time: '10:00', title: 'Panoramic Brünig Pass Train to Interlaken', cost: 35, category: 'Transit' },
          { time: '14:00', title: 'Lauterbrunnen Valley 72 Waterfalls & Staubbach Chutes Walk', cost: 30, category: 'Nature' },
          { time: '18:30', title: 'Harder Kulm Funicular Sunset Observation Dinner', cost: 65, category: 'Dining' }
        ]
      },
      {
        day: 5,
        title: 'Jungfraujoch Top of Europe High-Alpine Ascent',
        city: 'Interlaken',
        lodging: 'Victoria-Jungfrau Grand Hotel & Spa',
        activities: [
          { time: '08:30', title: 'Eiger Express Tri-Cable Gondola & Alpine Train to 3,454m', cost: 145, category: 'Adventure' },
          { time: '11:00', title: 'Aletsch Glacier Ice Palace Walk & Sphinx Observation Deck', cost: 0, category: 'Sightseeing' },
          { time: '19:00', title: 'Traditional Valais Raclette & Fondue Feast', cost: 55, category: 'Dining' }
        ]
      },
      {
        day: 6,
        title: 'First-Class Glacier Express Rail to Zermatt',
        city: 'Zermatt',
        lodging: 'Mont Cervin Palace Zermatt',
        activities: [
          { time: '09:30', title: 'Panoramic Glass-Roof Glacier Express First-Class Journey', cost: 95, category: 'Transit' },
          { time: '14:30', title: 'Arrival in Car-Free Zermatt Village at Foot of Matterhorn', cost: 0, category: 'Sightseeing' },
          { time: '17:00', title: 'Historic Mountaineers Quarter & Old Timber Chalets', cost: 0, category: 'Culture' }
        ]
      },
      {
        day: 7,
        title: 'Gornergrat Cogwheel Train & Matterhorn Reflection',
        city: 'Zermatt',
        lodging: 'Mont Cervin Palace Zermatt',
        activities: [
          { time: '09:00', title: 'Gornergrat Cogwheel Railway to 3,089m Peak View', cost: 95, category: 'Adventure' },
          { time: '12:00', title: 'Riffelsee Alpine Lake Matterhorn Mirror Photography Trek', cost: 0, category: 'Nature' },
          { time: '18:30', title: 'Valais Artisan Wine & Dry-Aged Beef Dinner', cost: 80, category: 'Dining' }
        ]
      },
      {
        day: 8,
        title: 'Matterhorn Glacier Paradise & Ice Caves',
        city: 'Zermatt',
        lodging: 'Mont Cervin Palace Zermatt',
        activities: [
          { time: '09:30', title: '3S Cableway Ascent to Europe Highest Mountain Station 3,883m', cost: 80, category: 'Adventure' },
          { time: '14:00', title: 'Walk-Through Glacier Ice Cave Sanctuary', cost: 0, category: 'Sightseeing' },
          { time: '19:00', title: 'Alpine Craft Brewery Tasting Experience', cost: 45, category: 'Nightlife' }
        ]
      },
      {
        day: 9,
        title: 'Scenic Lake Geneva Rail Hop & Chillon Castle',
        city: 'Geneva',
        lodging: 'Hotel d\'Angleterre Geneva',
        activities: [
          { time: '10:00', title: 'SBB InterRegio Train past Vineyards to Lake Geneva', cost: 70, category: 'Transit' },
          { time: '14:00', title: 'Medieval Chateau de Chillon Castle Tour in Montreux', cost: 25, category: 'Culture' },
          { time: '20:00', title: 'Michelin-Starred Farewell Gala Dinner on Lake Geneva', cost: 110, category: 'Dining' }
        ]
      },
      {
        day: 10,
        title: 'Geneva Jet d\'Eau & Farewell Switzerland',
        city: 'Geneva',
        lodging: 'Departure',
        activities: [
          { time: '10:00', title: 'Lake Geneva Jet d\'Eau & Old Town Saint-Pierre Promenade', cost: 0, category: 'Sightseeing' },
          { time: '13:30', title: 'Private First-Class Transfer to Geneva Airport', cost: 0, category: 'Transit' }
        ]
      }
    ]
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
    departureDates: ['Oct 20, 2026', 'Nov 14, 2026', 'Dec 08, 2026'],
    inclusions: [
      '7-Day JR Whole Japan Rail Pass (Green Car First-Class Shinkansen)',
      '11 Nights luxury accommodations (Boutique Shinjuku Tower & Onsen Ryokans)',
      'Private tea masterclass in 400-year-old Kyoto Daitoku-ji temple',
      'Daily Japanese gourmet breakfasts and 5 multi-course Kaiseki dinners',
      'Full luggage courier forwarding between Tokyo and Kyoto hotels'
    ],
    dailyPlan: [
      {
        day: 1,
        title: 'Arrival in Tokyo Metropolis & Lantern-Lit Izakayas',
        city: 'Tokyo',
        lodging: 'Cerulean Tower Tokyu Hotel',
        activities: [
          { time: '14:00', title: 'Narita Express VIP Transfer & Check-In', cost: 0, category: 'Transit' },
          { time: '18:30', title: 'Shinjuku Omoide Yokocho & Golden Gai Izakaya Food Crawl', cost: 65, category: 'Food & Dining' }
        ]
      },
      {
        day: 2,
        title: 'Shibuya 360° Sky Observatory & Digital Crystal Universe',
        city: 'Tokyo',
        lodging: 'Cerulean Tower Tokyu Hotel',
        activities: [
          { time: '10:00', title: 'Shibuya Sky Rooftop Glass Observation & Scramble Crossing', cost: 28, category: 'Sightseeing' },
          { time: '14:00', title: 'TeamLab Planets Multi-Sensory Digital Art Immersion', cost: 36, category: 'Culture' },
          { time: '19:00', title: 'Ginza A5 Wagyu Sukiyaki Masterclass Dinner', cost: 95, category: 'Food & Dining' }
        ]
      },
      {
        day: 3,
        title: 'Tsukiji Fish Market Safari & Asakusa Senso-ji Temple',
        city: 'Tokyo',
        lodging: 'Cerulean Tower Tokyu Hotel',
        activities: [
          { time: '08:30', title: 'Tsukiji Outer Market Otoro Tuna & Tamago Tasting Safari', cost: 45, category: 'Food & Dining' },
          { time: '11:30', title: 'Historic 7th-Century Senso-ji Temple Incense Ritual', cost: 15, category: 'Culture' },
          { time: '15:00', title: 'Futuristic Himiko Water Bus Cruise to Odaiba', cost: 22, category: 'Sightseeing' }
        ]
      },
      {
        day: 4,
        title: 'Romancecar Train to Hakone & Mt. Fuji Onsen Ryokan',
        city: 'Hakone',
        lodging: 'Hakone Gora Byakudan Luxury Ryokan',
        activities: [
          { time: '09:30', title: 'Odakyu Romancecar Scenic Express to Hakone', cost: 28, category: 'Transit' },
          { time: '13:00', title: 'Lake Ashi Pirate Ship Cruise with Floating Torii Gate View', cost: 24, category: 'Sightseeing' },
          { time: '18:00', title: '9-Course Seasonal Kaiseki Banquet & Forest Thermal Onsen', cost: 0, category: 'Food & Dining' }
        ]
      },
      {
        day: 5,
        title: 'Owakudani Volcanic Valley & Open-Air Sculpture Park',
        city: 'Hakone',
        lodging: 'Hakone Gora Byakudan Luxury Ryokan',
        activities: [
          { time: '09:30', title: 'Hakone Ropeway Cable Car over Steaming Volcanic Vents', cost: 15, category: 'Adventure' },
          { time: '13:00', title: 'Hakone Open-Air Museum & Picasso Exhibition Pavilion', cost: 35, category: 'Culture' }
        ]
      },
      {
        day: 6,
        title: 'Shinkansen Bullet Train to Kyoto & Gion Lanterns',
        city: 'Kyoto',
        lodging: 'Kyoto Gion Machiya Heritage Suites',
        activities: [
          { time: '10:00', title: 'Tokaido Shinkansen Bullet Train at 300 km/h to Kyoto', cost: 95, category: 'Transit' },
          { time: '14:30', title: 'Check-in at Historic Wooden Machiya in Gion District', cost: 0, category: 'Lodging' },
          { time: '17:30', title: 'Twilight Stroll Through Hanamikoji Geisha Quarter', cost: 0, category: 'Culture' }
        ]
      },
      {
        day: 7,
        title: 'Fushimi Inari 10,000 Torii Gates & Private Zen Tea Ceremony',
        city: 'Kyoto',
        lodging: 'Kyoto Gion Machiya Heritage Suites',
        activities: [
          { time: '07:00', title: 'Fushimi Inari 10,000 Vermillion Torii Gates Sunrise Trek', cost: 0, category: 'Nature' },
          { time: '14:00', title: 'Private Matcha Tea Ceremony with Geiko in 400-Year Temple', cost: 55, category: 'Culture' },
          { time: '19:00', title: 'Pontocho Alley Riverside Kamo Terrace Feast', cost: 85, category: 'Food & Dining' }
        ]
      },
      {
        day: 8,
        title: 'Arashiyama Bamboo Grove & Kinkaku-ji Golden Pavilion',
        city: 'Kyoto',
        lodging: 'Kyoto Gion Machiya Heritage Suites',
        activities: [
          { time: '08:30', title: 'Arashiyama Soaring Bamboo Forest & Tenryu-ji Zen Gardens', cost: 20, category: 'Nature' },
          { time: '13:30', title: 'Kinkaku-ji Golden Pavilion Mirrored on Mirror Lake', cost: 15, category: 'Culture' },
          { time: '16:30', title: 'Traditional Silk Kimono Weaving Workshop in Nishijin', cost: 40, category: 'Culture' }
        ]
      },
      {
        day: 9,
        title: 'Ancient Imperial Nara & Sacred Deer Sanctuary',
        city: 'Nara',
        lodging: 'Kyoto Gion Machiya Heritage Suites',
        activities: [
          { time: '09:00', title: 'Kintetsu Limited Express Train to Ancient Nara', cost: 15, category: 'Transit' },
          { time: '10:30', title: 'Todai-ji Temple Great Bronze Buddha (World Largest Wooden Hall)', cost: 12, category: 'Culture' },
          { time: '14:00', title: 'Nara Park Sacred Sika Deer Feeding & Kasuga Taisha Lanterns', cost: 5, category: 'Nature' }
        ]
      },
      {
        day: 10,
        title: 'Osaka Castle & Dotonbori Neon Street Food',
        city: 'Osaka',
        lodging: 'W Osaka Design Hotel',
        activities: [
          { time: '10:00', title: 'JR Rapid Hop to Osaka Culinary Capital', cost: 12, category: 'Transit' },
          { time: '13:00', title: 'Osaka Castle 16th-Century Fortress & Moats Tour', cost: 18, category: 'Culture' },
          { time: '18:00', title: 'Dotonbori Neon Canal Takoyaki & Kushikatsu Tasting Crawl', cost: 45, category: 'Food & Dining' }
        ]
      },
      {
        day: 11,
        title: 'Nishiki Market Safari & 3-Star Michelin Farewell Gala',
        city: 'Kyoto',
        lodging: 'W Osaka Design Hotel',
        activities: [
          { time: '10:30', title: 'Kyoto Nishiki Kitchen Market 5-Course Food Tasting', cost: 35, category: 'Food & Dining' },
          { time: '19:00', title: 'Grand Michelin-Starred Kaiseki Farewell Banquet', cost: 120, category: 'Food & Dining' }
        ]
      },
      {
        day: 12,
        title: 'Kansai Departure & Sayonara Japan',
        city: 'Osaka',
        lodging: 'Departure',
        activities: [
          { time: '10:00', title: 'Haruka Express VIP Direct Train to Kansai International Airport', cost: 0, category: 'Transit' }
        ]
      }
    ]
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
    departureDates: ['Sep 28, 2026', 'Oct 18, 2026', 'Nov 02, 2026'],
    inclusions: [
      'First-Class Trenitalia Frecciarossa high-speed rail passes',
      '8 Nights in luxury boutique villas & cliffside Amalfi suites',
      'Private sunset yacht charter around Capri island & Faraglioni rocks',
      'Private Chianti Classico wine estate tastings with master sommelier',
      'Skip-the-line VIP access to Vatican, Colosseum, and Uffizi Gallery'
    ],
    dailyPlan: [
      {
        day: 1,
        title: 'Arrival in the Eternal City & Trastevere Wine Stroll',
        city: 'Rome',
        lodging: 'Palazzo Navona Hotel Rome',
        activities: [
          { time: '14:00', title: 'Private Leonardo Express Transfer & Check-In', cost: 0, category: 'Transit' },
          { time: '18:30', title: 'Trastevere Sunset Food & Natural Wine Walking Safari', cost: 65, category: 'Food & Dining' }
        ]
      },
      {
        day: 2,
        title: 'Colosseum Gladiator Underground & Roman Forum',
        city: 'Rome',
        lodging: 'Palazzo Navona Hotel Rome',
        activities: [
          { time: '09:00', title: 'VIP Gladiator Arena Floor & Underground Dungeon Access', cost: 55, category: 'Culture' },
          { time: '15:00', title: 'Trevi Fountain, Pantheon & Piazza Navona Gelato Walk', cost: 18, category: 'Sightseeing' },
          { time: '19:30', title: 'Classic Roman Cacio e Pepe & Carbonara Tasting Dinner', cost: 60, category: 'Food & Dining' }
        ]
      },
      {
        day: 3,
        title: 'Vatican Museums, Sistine Chapel & Frecciarossa to Florence',
        city: 'Florence',
        lodging: 'Hotel Brunelleschi Florence',
        activities: [
          { time: '09:00', title: 'Skip-the-Line Vatican Papal Galleries & Sistine Chapel', cost: 48, category: 'Culture' },
          { time: '14:30', title: 'Frecciarossa 1000 High-Speed Train to Florence (1h 30m)', cost: 45, category: 'Transit' },
          { time: '18:00', title: 'Ponte Vecchio Sunset Stroll & Florentine Steak Feast', cost: 75, category: 'Food & Dining' }
        ]
      },
      {
        day: 4,
        title: 'Uffizi Renaissance Masterpieces & Duomo Rooftop Climb',
        city: 'Florence',
        lodging: 'Hotel Brunelleschi Florence',
        activities: [
          { time: '09:30', title: 'Uffizi Gallery Renaissance Tour (Da Vinci & Botticelli)', cost: 45, category: 'Culture' },
          { time: '14:00', title: 'Duomo Brunelleschi Dome Climb & Secret Terraces', cost: 32, category: 'Sightseeing' }
        ]
      },
      {
        day: 5,
        title: 'Chianti Vineyard Estate Safari & Medieval Siena',
        city: 'Siena',
        lodging: 'Grand Hotel Continental Siena',
        activities: [
          { time: '09:30', title: 'Private Chianti Classico Wine Estate Tour & Truffle Pairing', cost: 85, category: 'Food & Dining' },
          { time: '15:00', title: 'Siena Piazza del Campo & Marble Cathedral Floor Tour', cost: 20, category: 'Culture' }
        ]
      },
      {
        day: 6,
        title: 'High-Speed Rail to Naples & Amalfi Coast Panoramic Drive',
        city: 'Positano',
        lodging: 'Le Sirenuse / Villa Franca Positano',
        activities: [
          { time: '09:30', title: 'Frecciarossa Train to Naples & Private Mercedes Coastal Drive', cost: 75, category: 'Transit' },
          { time: '15:00', title: 'Check-in at Cliffside Whitewashed Terrace Suites in Positano', cost: 0, category: 'Lodging' },
          { time: '19:30', title: 'Cliffside Seafood Pasta & Limoncello Tasting Dinner', cost: 80, category: 'Food & Dining' }
        ]
      },
      {
        day: 7,
        title: 'Private Sunset Yacht Charter to Capri & Faraglioni',
        city: 'Positano',
        lodging: 'Le Sirenuse Positano',
        activities: [
          { time: '10:00', title: 'Private Riva Yacht Cruise to Capri Blue Grotto & Caves', cost: 110, category: 'Coastal Luxury' },
          { time: '17:30', title: 'Sunset Prosecco Toast Passing Faraglioni Sea Stacks', cost: 0, category: 'Sightseeing' }
        ]
      },
      {
        day: 8,
        title: 'Path of the Gods Cliff Walk & Ravello Gardens',
        city: 'Positano',
        lodging: 'Le Sirenuse Positano',
        activities: [
          { time: '09:00', title: 'Path of the Gods (Sentiero degli Dei) Panoramic Cliff Hike', cost: 35, category: 'Nature' },
          { time: '14:30', title: 'Ravello Villa Rufolo Infinity Terrace Gardens', cost: 20, category: 'Sightseeing' },
          { time: '20:00', title: 'Grand Amalfi Coastline Farewell Gala Banquet', cost: 95, category: 'Food & Dining' }
        ]
      },
      {
        day: 9,
        title: 'Naples / Rome Departure & Arrivederci Italia',
        city: 'Rome',
        lodging: 'Departure',
        activities: [
          { time: '09:30', title: 'Private First-Class Transfer to Naples / Rome Fiumicino Airport', cost: 0, category: 'Transit' }
        ]
      }
    ]
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
    departureDates: ['Nov 10, 2026', 'Dec 05, 2026', 'Jan 15, 2027'],
    inclusions: [
      'Luxury Arctic Superjeep 4x4 expedition transport throughout',
      '7 Nights in Nordic glass-roof aurora lodges & geothermal boutique hotels',
      'Professional Arctic Expedition Lead & professional aurora photography guidance',
      'All glacier cave gear, crampons, thermal suits, and Blue Lagoon Retreat passes',
      'Daily Icelandic farmhouse breakfasts and fresh Arctic seafood dinners'
    ],
    dailyPlan: [
      {
        day: 1,
        title: 'Arrival in Reykjavik & Geothermal Blue Lagoon Retreat',
        city: 'Reykjavik',
        lodging: 'The Retreat at Blue Lagoon',
        activities: [
          { time: '13:00', title: 'Keflavik Airport VIP Superjeep Pickup', cost: 0, category: 'Transit' },
          { time: '15:00', title: 'Blue Lagoon Silica & Mineral Geothermal Soak with Mud Mask', cost: 85, category: 'Wellness' },
          { time: '19:30', title: 'Lava Restaurant Nordic Tasting Dinner', cost: 75, category: 'Food & Dining' }
        ]
      },
      {
        day: 2,
        title: 'Golden Circle, Geysir & Gullfoss Roaring Falls',
        city: 'Reykjavik',
        lodging: 'ION Adventure Hotel (Glass Aurora Roof)',
        activities: [
          { time: '09:00', title: 'Thingvellir National Park Tectonic Rift Valley Walk', cost: 20, category: 'Nature' },
          { time: '12:30', title: 'Strokkur Erupting Geyser & Gullfoss Two-Tier Waterfall', cost: 45, category: 'Adventure' },
          { time: '21:30', title: 'Nightly Guided Aurora Borealis Celestial Light Chase', cost: 75, category: 'Nature' }
        ]
      },
      {
        day: 3,
        title: 'South Coast Waterfalls & Vik Black Sand Beaches',
        city: 'Vik',
        lodging: 'Hotel Kria Vik',
        activities: [
          { time: '09:00', title: 'Seljalandsfoss Walk-Behind Waterfall & Skogafoss Chute', cost: 25, category: 'Nature' },
          { time: '14:30', title: 'Reynisfjara Black Sand Beach & Basalt Sea Columns', cost: 0, category: 'Sightseeing' },
          { time: '21:00', title: 'Coastal Aurora Tracking over Reynisdrangar Sea Stacks', cost: 0, category: 'Nature' }
        ]
      },
      {
        day: 4,
        title: 'Jokulsarlon Glacier Lagoon & Crystal Ice Caves',
        city: 'Jokulsarlon',
        lodging: 'Fosshotel Glacier Lagoon',
        activities: [
          { time: '09:30', title: 'Superjeep Glacier Expedition to Vatnajokull Natural Ice Cave', cost: 110, category: 'Adventure' },
          { time: '14:00', title: 'Diamond Beach Floating Iceberg Photography Walk', cost: 0, category: 'Nature' }
        ]
      },
      {
        day: 5,
        title: 'East Fjords Scenic Coastal Passes to North Iceland',
        city: 'Akureyri',
        lodging: 'Hotel Kea Akureyri',
        activities: [
          { time: '09:00', title: 'Scenic Mountain Superjeep Passage through Dramatic Fjords', cost: 0, category: 'Transit' },
          { time: '15:00', title: 'Lake Myvatn Volcanic Craters & Dimmuborgir Lava Formations', cost: 35, category: 'Adventure' }
        ]
      },
      {
        day: 6,
        title: 'Godafoss Waterfall of the Gods & Geothermal Forest Lagoon',
        city: 'Akureyri',
        lodging: 'Hotel Kea Akureyri',
        activities: [
          { time: '10:00', title: 'Godafoss Roaring Horseshoe Glacial Waterfall', cost: 0, category: 'Nature' },
          { time: '15:00', title: 'Forest Lagoon Geothermal Infinity Pools with Fjord Panorama', cost: 50, category: 'Wellness' }
        ]
      },
      {
        day: 7,
        title: 'Reykjavik Capital Culture & Grand Farewell Arctic Feast',
        city: 'Reykjavik',
        lodging: 'Canopy by Hilton Reykjavik City Centre',
        activities: [
          { time: '10:00', title: 'Superjeep Return to Reykjavik via Hvalfjordur Tunnel', cost: 0, category: 'Transit' },
          { time: '14:00', title: 'Hallgrimskirkja Tower 360° City View & Rainbow Street Stroll', cost: 15, category: 'Culture' },
          { time: '19:30', title: 'Grand Arctic Tasting Gala with Smoked Salmon & Reindeer Carpaccio', cost: 95, category: 'Food & Dining' }
        ]
      },
      {
        day: 8,
        title: 'Keflavik Departure & Farewell Iceland',
        city: 'Reykjavik',
        lodging: 'Departure',
        activities: [
          { time: '10:00', title: 'VIP Direct Transfer to Keflavik International Airport', cost: 0, category: 'Transit' }
        ]
      }
    ]
  }
];

export default function ExpeditionsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExpedition, setSelectedExpedition] = useState<any>(null);
  const [modalTab, setModalTab] = useState<'itinerary' | 'inclusions' | 'stops'>('itinerary');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
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
                    onClick={() => {
                      setSelectedExpedition(exp);
                      setModalTab('itinerary');
                      setSelectedDayIndex(0);
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-stone-200 hover:text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
                  >
                    View Day-by-Day
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

        {/* ================= COMPREHENSIVE DAY-BY-DAY ITINERARY MODAL ================= */}
        {selectedExpedition && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4">
            <div className="bg-[#14151a] border border-white/15 rounded-[32px] max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in max-h-[90vh] overflow-y-auto font-sans">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#c99a6b]">{selectedExpedition.category}</span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-0.5">{selectedExpedition.title}</h3>
                  <p className="text-xs text-stone-400 font-sans mt-0.5">
                    {selectedExpedition.duration} &bull; Led by {selectedExpedition.organizer.name} ({selectedExpedition.organizer.badge})
                  </p>
                </div>

                <button
                  onClick={() => setSelectedExpedition(null)}
                  className="p-2 rounded-xl bg-white/5 text-stone-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* 3 Modal Tabs */}
              <div className="flex items-center gap-2 bg-[#0c0d10] p-1.5 rounded-2xl border border-white/10 text-xs">
                <button
                  onClick={() => setModalTab('itinerary')}
                  className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    modalTab === 'itinerary'
                      ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Day-by-Day Full Itinerary ({selectedExpedition.dailyPlan?.length || 0} Days)</span>
                </button>

                <button
                  onClick={() => setModalTab('inclusions')}
                  className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    modalTab === 'inclusions'
                      ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Inclusions &amp; Lodging</span>
                </button>

                <button
                  onClick={() => setModalTab('stops')}
                  className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    modalTab === 'stops'
                      ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Route Map</span>
                </button>
              </div>

              {/* TAB 1: DAY-BY-DAY EXPANDABLE ITINERARY */}
              {modalTab === 'itinerary' && selectedExpedition.dailyPlan && (
                <div className="space-y-4">
                  {/* Day Pills Bar */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5">
                    {selectedExpedition.dailyPlan.map((plan: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedDayIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          selectedDayIndex === idx
                            ? 'bg-[#c99a6b] text-[#0c0d10] shadow-sm'
                            : 'bg-[#0c0d10] text-stone-400 hover:text-white border border-white/5'
                        }`}
                      >
                        Day {plan.day} ({plan.city})
                      </button>
                    ))}
                  </div>

                  {/* Selected Day View Card */}
                  {(() => {
                    const currentPlan = selectedExpedition.dailyPlan[selectedDayIndex] || selectedExpedition.dailyPlan[0];
                    return (
                      <div className="p-5 rounded-2xl bg-[#0c0d10] border border-[#c99a6b]/30 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#c99a6b]">Day {currentPlan.day} &bull; {currentPlan.city}</span>
                            <h4 className="font-serif text-xl font-bold text-white mt-0.5">{currentPlan.title}</h4>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-stone-300">
                            <Hotel className="w-4 h-4 text-[#c99a6b]" />
                            <span className="truncate max-w-[200px]">{currentPlan.lodging}</span>
                          </div>
                        </div>

                        {/* Activities List */}
                        <div className="space-y-2.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Scheduled Experiences:</span>
                          {currentPlan.activities?.map((act: any, i: number) => (
                            <div key={i} className="p-3.5 rounded-xl bg-[#14151a] border border-white/10 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-[#c99a6b]/15 text-[#e4c29e] text-xs font-bold font-mono">
                                  {act.time}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-white font-serif">{act.title}</p>
                                  <span className="text-[10px] text-[#e4c29e]">{act.category}</span>
                                </div>
                              </div>

                              <span className="font-serif text-xs font-bold text-emerald-400">
                                {act.cost === 0 ? 'Included' : `$${act.cost}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 2: INCLUSIONS & LODGING */}
              {modalTab === 'inclusions' && selectedExpedition.inclusions && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-300">Everything Included in this Expedition:</span>
                  <div className="space-y-2">
                    {selectedExpedition.inclusions.map((item: string, i: number) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-[#0c0d10] border border-white/10 flex items-center gap-3 text-xs text-stone-200">
                        <Check className="w-4 h-4 text-[#c99a6b] flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ROUTE MAP */}
              {modalTab === 'stops' && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-300">Scheduled Multi-City Sequence:</span>
                  {selectedExpedition.stops.map((stop: string, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-[#0c0d10] border border-white/10 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#c99a6b]/20 text-[#e4c29e] font-serif font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <span className="text-xs font-bold text-white">{stop}</span>
                    </div>
                  ))}
                </div>
              )}

              {clonedSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Expedition cloned into your private itineraries portfolio!</span>
                </div>
              )}

              {/* Action Bar */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-stone-400 font-semibold block">All-Inclusive Price</span>
                  <span className="font-serif text-2xl font-bold text-[#e4c29e]">
                    ${selectedExpedition.price.toLocaleString()} <span className="font-sans text-xs text-stone-400">/ person</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedExpedition(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-bold cursor-pointer"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => handleCloneExpedition(selectedExpedition)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold shadow-lg shadow-[#c99a6b]/20 cursor-pointer"
                  >
                    Clone into My Itineraries
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
