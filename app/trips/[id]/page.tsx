'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GoogleCalendarTimeline from '@/components/GoogleCalendarTimeline';
import { COUNTRY_CORRIDORS, getCountryCorridorKey } from '@/lib/travel-corridors';
import { ALL_CURATED_DESTINATIONS } from '@/lib/destinations-data';
import confetti from 'canvas-confetti';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import {
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  ArrowRight,
  Clock,
  Share2,
  Trash2,
  AlertTriangle,
  Sparkles,
  Check,
  Receipt,
  Layers,
  CalendarDays,
  PieChart as PieIcon,
  Eye,
  Search,
  Zap,
  Tag,
  CheckCircle2,
  Train,
  Lock,
  Globe2,
  Compass,
  Hotel,
  Utensils
} from 'lucide-react';

const CATEGORY_COLORS: { [key: string]: string } = {
  stay: '#c99a6b', // Gold
  transport: '#e4c29e', // Light Gold
  activities: '#10B981', // Emerald
  meals: '#F59E0B', // Amber
  misc: '#8B5CF6', // Purple
};

// Rich Pre-Engineered Curated Authentic Experiences Catalog
const AUTHENTIC_CITY_EXPERIENCES: Record<string, any[]> = {
  // ================= INDIA DESTINATIONS =================
  jaipur: [
    { name: 'Amber Fort Elephant Ridge Ascent & Sheesh Mahal', category: 'culture', cost: 15, startTime: '08:30', endTime: '12:00', notes: 'Hilltop 16th-century Rajput palace with mirrored chambers' },
    { name: 'Hawa Mahal Palace of Winds & City Palace Museum', category: 'sightseeing', cost: 12, startTime: '13:00', endTime: '15:30', notes: '953 pink sandstone jharokha windows & royal armory' },
    { name: 'Johari Bazaar Gemstones & Rawat Pyaaz Kachori Crawl', category: 'food_tour', cost: 18, startTime: '16:00', endTime: '18:30', notes: 'Artisan jewelry, bandhani textiles, and famous spicy onion kachoris' },
    { name: 'Chokhi Dhani Rajasthani Village & Dal Baati Feast', category: 'food_tour', cost: 25, startTime: '19:30', endTime: '22:30', notes: 'Folk dancers, puppet shows, and traditional Rajasthani royal dining' },
  ],
  udaipur: [
    { name: 'Lake Pichola Sunset Luxury Boat Cruise & Jag Mandir', category: 'sightseeing', cost: 20, startTime: '16:30', endTime: '18:30', notes: 'Golden hour cruise past floating island marble palaces' },
    { name: 'City Palace Museum Grand Courtyards & Crystal Gallery', category: 'culture', cost: 15, startTime: '09:30', endTime: '12:30', notes: 'Largest palace complex in Rajasthan overlooking the lake' },
    { name: 'Ambrai Lakeside Fine Dining under Illuminated Palace', category: 'food_tour', cost: 35, startTime: '19:30', endTime: '22:00', notes: 'Gatte ki sabzi & Lal Maas with panoramic views of City Palace' },
    { name: 'Bagore Ki Haveli Rajasthani Folk Dance & Puppet Show', category: 'culture', cost: 10, startTime: '19:00', endTime: '20:30', notes: '18th-century haveli waterfront cultural performance' },
  ],
  agra: [
    { name: 'Taj Mahal Golden Sunrise Guided Photography Tour', category: 'sightseeing', cost: 25, startTime: '05:45', endTime: '09:00', notes: 'Sublime white marble wonder in the tranquil morning light' },
    { name: 'Agra Fort Red Sandstone Mughal Citadel Walk', category: 'culture', cost: 12, startTime: '10:30', endTime: '13:00', notes: 'UNESCO heritage royal residence of Akbar and Shah Jahan' },
    { name: 'Mehtab Bagh Moonlight Taj View & Panchhi Petha Tasting', category: 'sightseeing', cost: 10, startTime: '16:30', endTime: '19:00', notes: 'Scenic riverside gardens and famous Agra sweet delicacy' },
    { name: 'Authentic Mughlai Biryani & Tandoori Feast', category: 'food_tour', cost: 20, startTime: '19:30', endTime: '21:30', notes: 'Royal Mughlai recipes perfected over 4 centuries' },
  ],
  delhi: [
    { name: 'Old Delhi Chandni Chowk Rickshaw & Karim\'s Kebab Safari', category: 'food_tour', cost: 25, startTime: '17:30', endTime: '20:30', notes: 'Lantern-lit spice markets, Paranthe Wali Gali, and Mughlai kebabs' },
    { name: 'Qutub Minar 12th-Century Tower & Mehrauli Park Walk', category: 'culture', cost: 10, startTime: '09:30', endTime: '12:00', notes: 'UNESCO tallest brick minaret in the world and 4th-century iron pillar' },
    { name: 'Humayun\'s Tomb Mughal Water Gardens & Sunder Nursery', category: 'nature', cost: 10, startTime: '14:00', endTime: '16:30', notes: 'Precursor architectural masterpiece to the Taj Mahal' },
    { name: 'India Gate Promenade & National War Memorial Stroll', category: 'sightseeing', cost: 0, startTime: '17:00', endTime: '18:30', notes: 'Grand ceremonial boulevard in New Delhi' },
  ],
  goa: [
    { name: 'Dudhsagar 4-Tier Glacial Waterfalls Superjeep Safari', category: 'adventure', cost: 35, startTime: '08:00', endTime: '14:00', notes: 'Epic jungle drive and swimming in freshwater plunge pool' },
    { name: 'Sunset Catamaran Yacht Cruise with Dolphin Safari', category: 'sightseeing', cost: 40, startTime: '16:30', endTime: '19:00', notes: 'Arabian Sea sailing with chilled drinks and dolphin watching' },
    { name: 'Basilica of Bom Jesus & Old Goa Portuguese Heritage', category: 'culture', cost: 10, startTime: '10:00', endTime: '12:30', notes: '16th-century UNESCO baroque architecture and relics of St. Francis' },
    { name: 'Martin\'s Corner Goan Prawn Balchão Seafood Dinner', category: 'food_tour', cost: 30, startTime: '20:00', endTime: '22:30', notes: 'Legendary coastal dining with fresh crab, kingfish, and bebinca' },
  ],
  kerala: [
    { name: 'Alleppey Private Luxury Houseboat Backwaters Cruise', category: 'nature', cost: 65, startTime: '11:30', endTime: '17:30', notes: 'Palm-fringed canals, village lagoons, and fresh Karimeen fish curry' },
    { name: 'Munnar Kolukkumalai Sunrise Tea Garden Jeep Safari', category: 'nature', cost: 30, startTime: '05:30', endTime: '09:30', notes: 'World highest organic tea estate overlooking sea of clouds' },
    { name: 'Fort Kochi Chinese Fishing Nets & Kathakali Dance Drama', category: 'culture', cost: 15, startTime: '17:00', endTime: '19:30', notes: 'Historic coastal trade hub and traditional masked theatrical arts' },
  ],
  varanasi: [
    { name: 'Dashashwamedh Ghat Evening Ganga Maha Aarti Boat Tour', category: 'culture', cost: 15, startTime: '17:30', endTime: '20:00', notes: 'Mesmerizing synchronized brass lamp rituals and floating diyas' },
    { name: 'Sunrise River Ganga Wooden Boat Meditation', category: 'culture', cost: 10, startTime: '05:30', endTime: '08:00', notes: 'Peaceful dawn view of Manikarnika and ancient riverside ghats' },
    { name: 'Kashi Vishwanath Corridor & Golden Temple Darshan', category: 'culture', cost: 0, startTime: '09:30', endTime: '12:00', notes: 'Sacred spiritual corridor on the holy banks of the Ganges' },
    { name: 'Deena Chat Bhandar Tamatar Chaat & Banarasi Paan Safari', category: 'food_tour', cost: 10, startTime: '13:00', endTime: '15:00', notes: 'Famous winter Malaiyyo, spicy tomato chaat, and kachori jalebi' },
  ],
  kashmir: [
    { name: 'Dal Lake Sunrise Shikara Ride & Floating Flower Market', category: 'nature', cost: 18, startTime: '06:00', endTime: '08:30', notes: 'Gliding through tranquil water lilies and floating wooden bazaars' },
    { name: 'Gulmarg Gondola World 2nd Highest Cable Car Ascent', category: 'adventure', cost: 45, startTime: '09:30', endTime: '14:30', notes: 'Reaching 3,950m Kongdoori and Apharwat alpine snow summits' },
    { name: 'Traditional 7-Course Kashmiri Wazwan Feast & Kahwa', category: 'food_tour', cost: 30, startTime: '19:30', endTime: '22:00', notes: 'Rogan Josh, Gushtaba, Tabak Maaz paired with pure saffron kahwa' },
  ],
  manali: [
    { name: 'Rohtang Pass Glacial Snow & High-Altitude Viewpoint', category: 'adventure', cost: 35, startTime: '07:30', endTime: '13:30', notes: 'Spectacular 3,978m mountain pass connecting Kullu and Lahaul' },
    { name: 'Solang Valley Tandem Paragliding Safari', category: 'adventure', cost: 40, startTime: '14:00', endTime: '16:30', notes: 'Soaring above pine forests and snow-capped Himalayan peaks' },
    { name: 'Old Manali Bohemian Cafes & Siddu Ghee Tasting', category: 'food_tour', cost: 15, startTime: '18:00', endTime: '20:30', notes: 'Himachali stuffed steamed buns, river trout, and live acoustic music' },
  ],
  rishikesh: [
    { name: 'White Water Rafting on Holy Ganga (16km Shivpuri Run)', category: 'adventure', cost: 25, startTime: '09:00', endTime: '13:00', notes: 'Thrilling Class III/IV rapids: Roller Coaster and Golf Course' },
    { name: 'Beatles Ashram (Chaurasi Kutia) Meditation Sanctuary', category: 'culture', cost: 12, startTime: '14:30', endTime: '17:00', notes: 'Historic 1968 retreat where the White Album was composed' },
    { name: 'Triveni Ghat Evening Maha Aarti & Chotiwala Thali', category: 'culture', cost: 15, startTime: '18:00', endTime: '20:30', notes: 'Sacred river chants and authentic Ayurvedic satvik dinner' },
  ],
  mumbai: [
    { name: 'Gateway of India & Elephanta Island Caves Ferry', category: 'culture', cost: 15, startTime: '09:30', endTime: '13:30', notes: 'UNESCO 6th-century rock-cut Shiva sculptures in Mumbai harbor' },
    { name: 'Marine Drive Queen\'s Necklace Golden Hour Sunset', category: 'sightseeing', cost: 0, startTime: '17:30', endTime: '19:30', notes: 'Iconic curved Art Deco seafront promenade' },
    { name: 'Colaba Street Food & Sardar Pav Bhaji Tasting Safari', category: 'food_tour', cost: 20, startTime: '20:00', endTime: '22:30', notes: 'Sizzling butter pav bhaji, bun maska chai, and kebabs' },
  ],
  jodhpur: [
    { name: 'Mehrangarh Fort Ramparts & Flying Fox Zipline', category: 'adventure', cost: 30, startTime: '09:00', endTime: '12:30', notes: 'Ziplining over blue city walls and battlements' },
    { name: 'Jaswant Thada Royal White Marble Cenotaphs', category: 'culture', cost: 8, startTime: '14:00', endTime: '16:00', notes: 'Intricate lakeside marble monument known as the Taj of Marwar' },
    { name: 'Jodhpuri Shahi Mirchi Vada & Mawa Kachori Crawl', category: 'food_tour', cost: 10, startTime: '17:00', endTime: '19:00', notes: 'Iconic spicy pepper fritters and sweet cardamom pastries' },
  ],

  // ================= GLOBAL CITIES =================
  tokyo: [
    { name: 'Shibuya Sky 360° Observatory & Harajuku Walk', category: 'sightseeing', cost: 28, startTime: '10:00', endTime: '12:30', notes: 'Panoramic rooftop view of Shibuya Crossing and Mt. Fuji' },
    { name: 'Tsukiji Outer Fish Market Gourmet Breakfast Safari', category: 'food_tour', cost: 45, startTime: '08:30', endTime: '11:00', notes: 'Fresh otoro sashimi, tamagoyaki, and matcha tasting' },
    { name: 'TeamLab Planets Digital Art Immersion', category: 'culture', cost: 36, startTime: '14:00', endTime: '16:30', notes: 'Multi-sensory digital crystal universe installation' },
    { name: 'Shinjuku Omoide Yokocho & Golden Gai Izakaya Tour', category: 'nightlife', cost: 65, startTime: '18:30', endTime: '21:30', notes: 'Hidden lantern-lit alleys with yakitori and craft sake' },
  ],
  kyoto: [
    { name: 'Fushimi Inari 10,000 Torii Gates Sunrise Trek', category: 'nature', cost: 0, startTime: '07:30', endTime: '10:30', notes: 'Sacred mountain trail through vibrant vermillion gates' },
    { name: 'Arashiyama Bamboo Grove & Tenryu-ji Zen Temple', category: 'nature', cost: 20, startTime: '11:30', endTime: '14:30', notes: 'Towering bamboo forest and UNESCO heritage dry landscape gardens' },
    { name: 'Traditional Matcha Ceremony with Geisha in Gion', category: 'culture', cost: 55, startTime: '16:00', endTime: '18:00', notes: 'Historic teahouse masterclass in historic wooden district' },
    { name: 'Pontocho Alley Riverside Kaiseki Feast', category: 'food_tour', cost: 85, startTime: '19:00', endTime: '21:30', notes: 'Multi-course seasonal Kyoto heritage gastronomy' },
  ],
  paris: [
    { name: 'Louvre Museum Masterpieces Guided Art Odyssey', category: 'culture', cost: 42, startTime: '09:30', endTime: '12:30', notes: 'Mona Lisa, Winged Victory, and French Royal Crown Jewels' },
    { name: 'Eiffel Tower Summit & Trocadéro Golden Hour', category: 'sightseeing', cost: 38, startTime: '16:30', endTime: '19:00', notes: 'Top-tier glass elevators to highest observation platform in Paris' },
    { name: 'Seine River Glass-Canopy Dinner & Wine Cruise', category: 'food_tour', cost: 95, startTime: '20:00', endTime: '22:30', notes: 'Illuminated monuments view with 3-course French gastronomy' },
  ],
  zermatt: [
    { name: 'Gornergrat Scenic Cogwheel Train to Matterhorn View', category: 'adventure', cost: 95, startTime: '09:30', endTime: '13:00', notes: 'Panoramic alpine ascent overlooking 29 four-thousand-meter peaks' },
    { name: 'Matterhorn Glacier Paradise Ice Palace & Cableway', category: 'adventure', cost: 80, startTime: '14:00', endTime: '17:00', notes: 'Highest mountain station in Europe with walk-through glacier caves' },
    { name: 'Traditional Valais Fondue & Raclette Masterclass', category: 'food_tour', cost: 65, startTime: '18:30', endTime: '21:00', notes: 'Local alpine cheeses paired with Swiss Fendant white wine' },
  ]
};

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const tripId = parseInt(id);

  const [trip, setTrip] = useState<any>(null);
  const [financials, setFinancials] = useState<any>(null);
  const [availableDestinations, setAvailableDestinations] = useState<any[]>(ALL_CURATED_DESTINATIONS);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'builder' | 'timeline' | 'analytics' | 'expenses'>('builder');

  // Modals state
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [selectedStopForActivity, setSelectedStopForActivity] = useState<any>(null);
  const [cityActivitiesCatalog, setCityActivitiesCatalog] = useState<any[]>([]);

  // City Picker Search & Country Corridor Filter inside Add Stop Modal
  const [stopCitySearch, setStopCitySearch] = useState('');
  const [selectedDestinationCard, setSelectedDestinationCard] = useState<any>(null);
  const [corridorFilterMode, setCorridorFilterMode] = useState<'corridor' | 'global'>('corridor');

  // Add Stop Form State
  const [newStopData, setNewStopData] = useState({
    cityId: '',
    arrivalDate: '',
    departureDate: '',
    stayCostEstimated: '150',
    transportCostEstimated: '80',
    notes: '',
  });

  // Add Activity Form State
  const [newActivityData, setNewActivityData] = useState({
    activityId: '',
    customTitle: '',
    category: 'sightseeing',
    activityDate: '',
    startTime: '10:00',
    endTime: '12:30',
    cost: '30',
    notes: '',
  });

  // Add Expense Form State
  const [newExpenseData, setNewExpenseData] = useState({
    tripStopId: '',
    category: 'meals',
    title: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Card',
  });

  const [shareCopied, setShareCopied] = useState(false);
  const [autoPopulating, setAutoPopulating] = useState<number | null>(null);

  useEffect(() => {
    loadTripData();
    loadDestinations();
  }, [tripId]);

  async function loadTripData() {
    try {
      const [tripRes, finRes] = await Promise.all([
        fetch(`/api/trips/${tripId}`).then((r) => r.json()),
        fetch(`/api/trips/${tripId}/expenses`).then((r) => r.json()),
      ]);

      if (tripRes.success) setTrip(tripRes.data);
      if (finRes.success) setFinancials(finRes.data);
    } catch (err) {
      console.error('Error loading trip details:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadDestinations() {
    try {
      const res = await fetch('/api/destinations');
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setAvailableDestinations(data.data);
      }
    } catch (e) {}
  }

  // Determine Active Country Corridor of the trip
  const activeCountryKey = (() => {
    if (!trip?.stops || trip.stops.length === 0) return null;
    const lastStop = trip.stops[trip.stops.length - 1];
    return getCountryCorridorKey(lastStop.country || lastStop.city_name);
  })();

  const activeCountryCorridor = activeCountryKey ? COUNTRY_CORRIDORS[activeCountryKey] : null;

  // Pre-fill smart stop defaults when clicking a destination card or corridor city
  const handleSelectDestinationCard = (dest: any, corridorCity?: any) => {
    setSelectedDestinationCard({ ...dest, ...corridorCity });
    
    // Calculate smart dates based on existing stops or trip start date
    let arrDate = trip?.start_date ? trip.start_date.split('T')[0] : new Date().toISOString().split('T')[0];
    if (trip?.stops && trip.stops.length > 0) {
      const lastStop = trip.stops[trip.stops.length - 1];
      if (lastStop.departure_date) {
        arrDate = lastStop.departure_date.split('T')[0];
      }
    }

    const durationDays = corridorCity?.recommendedDays || 3;
    const arrObj = new Date(arrDate);
    const depObj = new Date(arrObj.getTime() + durationDays * 86400000);
    const depDate = depObj.toISOString().split('T')[0];

    const estDaily = dest.avg_daily_cost || corridorCity?.avgDailyCost || 65;
    const stayEst = Math.round(estDaily * durationDays * 0.6); // 60% lodging allocation
    const transEst = corridorCity?.transitCost !== undefined ? corridorCity.transitCost : 30;

    const hotelSuggestion = corridorCity?.hotelSuggestion || dest.best_hotel || `Boutique Hotel in central ${dest.name}`;

    setNewStopData({
      cityId: dest.id ? dest.id.toString() : '1',
      arrivalDate: arrDate,
      departureDate: depDate,
      stayCostEstimated: stayEst.toString(),
      transportCostEstimated: transEst.toString(),
      notes: hotelSuggestion,
    });
  };

  // Add Stop Handler
  const handleAddStopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStopData.cityId) return;

    try {
      const res = await fetch(`/api/trips/${tripId}/stops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStopData),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddStopModal(false);
        setSelectedDestinationCard(null);
        setNewStopData({
          cityId: '',
          arrivalDate: '',
          departureDate: '',
          stayCostEstimated: '150',
          transportCostEstimated: '80',
          notes: '',
        });
        loadTripData();
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      }
    } catch (err) {
      console.error('Error adding stop:', err);
    }
  };

  // 1-Click Auto-Populate Curated City Experiences
  const handleAutoPopulateExperiences = async (stop: any) => {
    setAutoPopulating(stop.id);
    const cityNameKey = stop.city_name.toLowerCase().replace(/[^a-z]/g, '');
    
    let acts = AUTHENTIC_CITY_EXPERIENCES[cityNameKey];
    if (!acts) {
      const key = Object.keys(AUTHENTIC_CITY_EXPERIENCES).find(k => cityNameKey.includes(k) || k.includes(cityNameKey));
      acts = key ? AUTHENTIC_CITY_EXPERIENCES[key] : [
        { name: `${stop.city_name} Heritage Walking & Sights Tour`, category: 'culture', cost: 15, startTime: '10:00', endTime: '12:30' },
        { name: `${stop.city_name} Authentic Local Street Food Crawl`, category: 'food_tour', cost: 20, startTime: '13:30', endTime: '16:00' },
        { name: `${stop.city_name} Sunset Panoramic Observation & Dinner`, category: 'sightseeing', cost: 25, startTime: '18:30', endTime: '21:00' },
      ];
    }

    try {
      const arrDate = stop.arrival_date ? stop.arrival_date.split('T')[0] : new Date().toISOString().split('T')[0];
      for (const act of acts.slice(0, 3)) {
        await fetch(`/api/trips/${tripId}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tripStopId: stop.id,
            customTitle: act.name,
            category: act.category,
            activityDate: arrDate,
            startTime: act.startTime,
            endTime: act.endTime,
            cost: act.cost.toString(),
            notes: act.notes || '',
          }),
        });
      }

      await loadTripData();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      console.error('Error auto populating:', e);
    } finally {
      setAutoPopulating(null);
    }
  };

  // Delete Stop Handler
  const handleDeleteStop = async (stopId: number) => {
    if (!confirm('Are you sure you want to remove this destination stop?')) return;
    try {
      const res = await fetch(`/api/trips/${tripId}/stops/${stopId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) loadTripData();
    } catch (err) {
      console.error('Error deleting stop:', err);
    }
  };

  // Open Add Activity Modal for a Stop
  const openActivityModalForStop = async (stop: any) => {
    setSelectedStopForActivity(stop);
    setNewActivityData({
      activityId: '',
      customTitle: '',
      category: 'sightseeing',
      activityDate: stop.arrival_date ? stop.arrival_date.split('T')[0] : '',
      startTime: '10:00',
      endTime: '12:30',
      cost: '20',
      notes: '',
    });

    const cityNameKey = stop.city_name.toLowerCase().replace(/[^a-z]/g, '');
    let matched = AUTHENTIC_CITY_EXPERIENCES[cityNameKey];
    if (!matched) {
      const key = Object.keys(AUTHENTIC_CITY_EXPERIENCES).find(k => cityNameKey.includes(k) || k.includes(cityNameKey));
      matched = key ? AUTHENTIC_CITY_EXPERIENCES[key] : [];
    }

    try {
      const res = await fetch(`/api/activities?city_id=${stop.city_id}`);
      const data = await res.json();
      const apiActs = data.success ? (data.data || []) : [];
      setCityActivitiesCatalog([...matched, ...apiActs]);
    } catch (e) {
      setCityActivitiesCatalog(matched || []);
    }

    setShowAddActivityModal(true);
  };

  // Add Activity Handler
  const handleAddActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStopForActivity) return;

    try {
      const res = await fetch(`/api/trips/${tripId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripStopId: selectedStopForActivity.id,
          ...newActivityData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddActivityModal(false);
        loadTripData();
      }
    } catch (err) {
      console.error('Error adding activity:', err);
    }
  };

  // Delete Activity Handler
  const handleDeleteActivity = async (activityId: number) => {
    try {
      const res = await fetch(`/api/trips/${tripId}/activities/${activityId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) loadTripData();
    } catch (err) {
      console.error('Error removing activity:', err);
    }
  };

  // Add Expense Handler
  const handleAddExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpenseData),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddExpenseModal(false);
        setNewExpenseData({
          tripStopId: '',
          category: 'meals',
          title: '',
          amount: '',
          expenseDate: new Date().toISOString().split('T')[0],
          paymentMethod: 'Card',
        });
        loadTripData();
      }
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}/trips/share/${trip.share_code}`;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  const filteredDestinationCards = availableDestinations.filter(d => 
    d.name.toLowerCase().includes(stopCitySearch.toLowerCase()) ||
    d.country.toLowerCase().includes(stopCitySearch.toLowerCase()) ||
    d.continent?.toLowerCase().includes(stopCitySearch.toLowerCase())
  );

  // Existing city names in trip stops for badge detection
  const existingCityNames = (trip?.stops || []).map((s: any) => s.city_name.toLowerCase());

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0d10] text-stone-100 flex items-center justify-center font-sans">
        <div className="w-10 h-10 rounded-full border-2 border-[#c99a6b] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#0c0d10] text-stone-100 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-400 mb-4" />
          <h2 className="font-serif text-2xl font-bold text-white">Itinerary Not Found</h2>
          <p className="text-stone-400 text-xs mt-1 mb-6">The requested journey does not exist or has been removed.</p>
          <Link href="/trips" className="px-6 py-2.5 rounded-full bg-[#c99a6b] text-[#0c0d10] text-xs font-bold uppercase">
            Return to Portfolios
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f4f2ee] flex flex-col font-sans selection:bg-[#c99a6b] selection:text-[#0c0d10]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        
        {/* Top Hero Banner */}
        <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl mb-8">
          <div className="h-64 sm:h-80 relative">
            <img
              src={trip.cover_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
              alt={trip.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-[#0c0d10]/60 to-transparent" />
            
            {/* Status & Share Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between font-sans">
              <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#e4c29e] text-[10px] font-bold uppercase tracking-widest border border-white/20">
                {trip.status}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href={`/trips/share/${trip.share_code}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-white/10 text-stone-200 text-xs font-semibold backdrop-blur-md border border-white/20 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Public Atelier</span>
                </Link>
                <button
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md shadow-[#c99a6b]/20 transition-all cursor-pointer"
                >
                  {shareCopied ? <Check className="w-3.5 h-3.5 font-bold" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{shareCopied ? 'Link Copied!' : 'Share Itinerary'}</span>
                </button>
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
                  Composed Expedition
                </span>
                <h1 className="font-serif text-2xl sm:text-4xl font-medium text-white tracking-tight leading-tight mt-0.5">
                  {trip.title}
                </h1>
                <p className="font-serif text-stone-300 text-xs sm:text-sm max-w-2xl mt-1 line-clamp-2">
                  {trip.description}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-[#14151a]/90 p-3.5 rounded-2xl border border-white/10 backdrop-blur-md font-sans">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Total Budget</span>
                  <p className="font-serif text-base font-bold text-emerald-400">
                    ${parseFloat(trip.total_budget || 0).toLocaleString()} {trip.currency}
                  </p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Duration</span>
                  <p className="font-serif text-base font-bold text-[#e4c29e]">
                    {financials?.durationDays || 7} Days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Interactive Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-8 overflow-x-auto font-sans">
          {[
            { id: 'builder', label: 'Itinerary Builder', icon: Layers, count: trip.stops?.length },
            { id: 'timeline', label: 'Google Calendar & Flow', icon: CalendarDays },
            { id: 'analytics', label: 'Budget Analytics', icon: PieIcon },
            { id: 'expenses', label: 'Expense Ledger', icon: Receipt, count: trip.expenses?.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] shadow-lg shadow-[#c99a6b]/20'
                    : 'bg-[#14151a] text-stone-400 border border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-stone-400'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ITINERARY BUILDER */}
        {activeTab === 'builder' && (
          <div className="space-y-8 font-sans">
            
            {/* Active Corridor Suggestion Banner */}
            {activeCountryCorridor && (
              <div className="p-4 sm:p-5 rounded-[28px] bg-gradient-to-r from-[#14151a] via-[#1a1c24] to-[#14151a] border border-[#c99a6b]/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#c99a6b]/15 text-[#e4c29e] flex items-center justify-center text-xl flex-shrink-0">
                    {activeCountryCorridor.flag}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-serif">{activeCountryCorridor.country} Connected Corridor Active</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-bold text-[#e4c29e]">{activeCountryCorridor.transitNetwork}</span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Cities in this itinerary are linked by continuous high-speed transit. Add reachable stops below with authentic lodging and food suggestions.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCorridorFilterMode('corridor');
                    setShowAddStopModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#c99a6b] hover:bg-[#dfb182] text-[#0c0d10] text-xs font-bold shadow-md cursor-pointer self-start sm:self-auto whitespace-nowrap"
                >
                  <Train className="w-3.5 h-3.5" />
                  <span>+ Add Next Connected Stop</span>
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c99a6b]">
                  Route Architecture
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight">
                  Destination Stops &amp; Daily Schedule
                </h2>
                <p className="text-stone-400 text-xs mt-0.5">Organize connected city stops, auto-curate authentic experiences, and balance daily budgets</p>
              </div>

              <button
                onClick={() => setShowAddStopModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#c99a6b]/20 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Destination Stop</span>
              </button>
            </div>

            {/* Stops Accordion List */}
            {trip.stops?.length === 0 ? (
              <div className="text-center py-16 bg-[#14151a]/60 border border-white/10 rounded-[32px] p-6 space-y-3">
                <MapPin className="w-12 h-12 text-[#c99a6b] mx-auto mb-1" />
                <h3 className="font-serif text-2xl font-bold text-white">No destination stops added yet</h3>
                <p className="text-stone-400 text-xs max-w-sm mx-auto">
                  Add world or Indian destinations (e.g. Jaipur, Udaipur, Tokyo, Zermatt) to schedule day-by-day sightseeing and culinary adventures.
                </p>
                <button
                  onClick={() => setShowAddStopModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#c99a6b]/20 cursor-pointer"
                >
                  + Add First Stop
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {trip.stops?.map((stop: any, index: number) => (
                  <div
                    key={stop.id}
                    className="bg-[#14151a]/95 backdrop-blur-2xl border border-white/10 hover:border-white/20 rounded-[32px] overflow-hidden shadow-2xl transition-all"
                  >
                    {/* Stop Header */}
                    <div className="p-6 bg-[#14151a] border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] flex items-center justify-center font-serif font-bold text-sm flex-shrink-0 shadow-md">
                          {index + 1}
                        </div>
                        <img
                          src={stop.city_image_url || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80'}
                          alt={stop.city_name}
                          className="w-16 h-16 rounded-2xl object-cover border border-white/10 flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif text-2xl font-bold text-white">{stop.city_name}</h3>
                            <span className="text-xs text-[#e4c29e] font-sans font-medium">({stop.country})</span>
                          </div>
                          <p className="text-xs text-stone-400 mt-1 flex items-center gap-2 font-sans">
                            <Calendar className="w-3.5 h-3.5 text-[#c99a6b]" />
                            <span>
                              {new Date(stop.arrival_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} &rarr;{' '}
                              {new Date(stop.departure_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            {stop.notes && <span className="text-stone-500 hidden sm:inline">&bull; 🏨 {stop.notes}</span>}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 font-sans">
                        <button
                          onClick={() => handleAutoPopulateExperiences(stop)}
                          disabled={autoPopulating === stop.id}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/5 hover:bg-[#c99a6b] hover:text-[#0c0d10] text-[#e4c29e] border border-white/15 text-xs font-bold transition-all cursor-pointer"
                          title="Auto-schedule authentic morning, afternoon, and evening sights for this city"
                        >
                          <Zap className={`w-3.5 h-3.5 ${autoPopulating === stop.id ? 'animate-bounce' : ''}`} />
                          <span>{autoPopulating === stop.id ? 'Curating...' : 'Auto-Curate Day Plan'}</span>
                        </button>

                        <button
                          onClick={() => openActivityModalForStop(stop)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#c99a6b]" />
                          <span>Schedule Activity</span>
                        </button>

                        <button
                          onClick={() => handleDeleteStop(stop.id)}
                          title="Delete Stop"
                          className="p-2 rounded-2xl bg-[#0c0d10] hover:bg-red-500/20 text-stone-400 hover:text-red-400 transition-colors cursor-pointer border border-white/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Scheduled Activities for this Stop */}
                    <div className="p-6 bg-[#0c0d10]/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#c99a6b]" />
                          Scheduled Experiences ({stop.activities?.length || 0})
                        </h4>
                        
                        {stop.activities?.length > 0 && (
                          <span className="text-xs text-stone-400">
                            Stop Total: <strong className="text-emerald-400 font-bold">${stop.activities.reduce((acc: number, a: any) => acc + parseFloat(a.cost || 0), 0)}</strong>
                          </span>
                        )}
                      </div>

                      {stop.activities?.length === 0 ? (
                        <div className="p-5 rounded-2xl bg-[#14151a]/50 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <p className="text-xs text-stone-400">
                            No activities scheduled for {stop.city_name} yet. Click <strong className="text-[#e4c29e]">&ldquo;Auto-Curate Day Plan&rdquo;</strong> to generate authentic experiences or add custom ones.
                          </p>
                          <button
                            onClick={() => handleAutoPopulateExperiences(stop)}
                            className="text-xs font-bold text-[#e4c29e] hover:underline cursor-pointer flex-shrink-0"
                          >
                            + Populate Top Sights Now
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {stop.activities?.map((act: any) => (
                            <div
                              key={act.id}
                              className="bg-[#14151a] border border-white/10 hover:border-[#c99a6b]/40 rounded-2xl p-4 flex items-center justify-between gap-3 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-[#c99a6b]/15 text-[#e4c29e]">
                                  <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-white font-serif">
                                    {act.custom_title || act.original_activity_name || 'Activity'}
                                  </p>
                                  <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                                    <span className="capitalize text-[#e4c29e] font-semibold">{act.category}</span>
                                    <span>&bull;</span>
                                    <span>{act.start_time} - {act.end_time}</span>
                                    <span>&bull;</span>
                                    <span className="text-emerald-400 font-bold">${parseFloat(act.cost).toFixed(0)}</span>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => handleDeleteActivity(act.id)}
                                className="p-1.5 text-stone-500 hover:text-red-400 transition-colors cursor-pointer"
                                title="Delete Activity"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GOOGLE-STYLE CALENDAR & TIMELINE */}
        {activeTab === 'timeline' && (
          <GoogleCalendarTimeline
            trip={trip}
            onAddActivity={(stopId, dateStr) => {
              const stop = trip.stops?.find((s: any) => s.id === stopId) || trip.stops[0];
              setSelectedStopForActivity(stop);
              setNewActivityData((prev) => ({ ...prev, activityDate: dateStr }));
              setShowAddActivityModal(true);
            }}
            onDeleteActivity={(actId) => handleDeleteActivity(actId)}
          />
        )}

        {/* TAB 3: SMART BUDGET ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 font-sans">
            {financials?.isOverBudget && (
              <div className="p-5 rounded-[24px] bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-4 shadow-xl">
                <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold">Trip Budget Overrun Alert!</h4>
                  <p className="text-xs text-amber-200/80 mt-1">
                    Your total expenses (${financials?.totalSpent}) exceed your target budget of ${financials?.totalBudget}.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Target Budget</span>
                <div className="font-serif text-2xl font-bold text-white mt-1">${financials?.totalBudget || trip.total_budget}</div>
                <div className="text-[11px] text-stone-400 mt-1">Planned allocation</div>
              </div>

              <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total Spent</span>
                <div className="font-serif text-2xl font-bold text-emerald-400 mt-1">${financials?.totalSpent || 0}</div>
                <div className="text-[11px] text-stone-400 mt-1">{financials?.budgetUsagePercent || 0}% used</div>
              </div>

              <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Remaining Funds</span>
                <div className="font-serif text-2xl font-bold text-[#e4c29e] mt-1">${financials?.remainingBudget || 0}</div>
                <div className="text-[11px] text-stone-400 mt-1">Available buffer</div>
              </div>

              <div className="bg-[#14151a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Daily Allowance</span>
                <div className="font-serif text-2xl font-bold text-amber-400 mt-1">${financials?.dailyBudgetAllowance || 0} / day</div>
                <div className="text-[11px] text-stone-400 mt-1">Avg spent: ${financials?.avgDailySpent || 0}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EXPENSE LEDGER */}
        {activeTab === 'expenses' && (
          <div className="space-y-6 font-sans">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Expense Ledger &amp; Receipts</h3>
                <p className="text-xs text-stone-400 mt-0.5">Track actual outlays against your planned allowance</p>
              </div>

              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#c99a6b] to-[#e4c29e] text-[#0c0d10] text-xs font-bold uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" />
                <span>Log Expense</span>
              </button>
            </div>

            <div className="bg-[#14151a]/90 border border-white/10 rounded-[32px] overflow-hidden p-6">
              {trip.expenses?.length === 0 ? (
                <p className="text-center py-10 text-xs text-stone-500">No expenses logged yet. Click Log Expense above to start tracking.</p>
              ) : (
                <div className="space-y-2">
                  {trip.expenses?.map((exp: any) => (
                    <div key={exp.id} className="p-3.5 rounded-2xl bg-[#0c0d10] border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">{exp.title}</p>
                        <p className="text-[10px] text-stone-400 capitalize">{exp.category} &bull; {exp.payment_method}</p>
                      </div>
                      <span className="font-serif text-base font-bold text-[#e4c29e]">${parseFloat(exp.amount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= SMART COUNTRY CORRIDOR & MULTI-CITY ADD STOP MODAL ================= */}
        {showAddStopModal && (
          <div className="fixed inset-0 z-50 bg-[#0c0d10]/90 backdrop-blur-2xl flex items-center justify-center p-4">
            <div className="bg-[#14151a] border border-white/15 rounded-[32px] p-6 sm:p-8 max-w-2xl w-full shadow-2xl font-sans max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in">
              
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c99a6b]">
                    {activeCountryCorridor ? `Step: Add ${activeCountryCorridor.country} Rail / Transit Stop` : 'Step: Select Primary Destination'}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                    {activeCountryCorridor ? `Connected Cities in ${activeCountryCorridor.country}` : 'Add Destination Stop'}
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {activeCountryCorridor 
                      ? `Select reachable cities linked by high-speed rail with recommended heritage hotels & local cuisine`
                      : 'Choose your entry destination to automatically unlock logical connected transit routes'}
                  </p>
                </div>

                <button
                  onClick={() => setShowAddStopModal(false)}
                  className="p-2 rounded-xl bg-white/5 text-stone-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Connected Corridor / Global Mode Switcher */}
              <div className="flex items-center gap-2 bg-[#0c0d10] p-1.5 rounded-2xl border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setCorridorFilterMode('corridor')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    corridorFilterMode === 'corridor'
                      ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Train className="w-3.5 h-3.5" />
                  <span>
                    {activeCountryCorridor ? `${activeCountryCorridor.flag} ${activeCountryCorridor.country} Connected Corridor` : 'Suggested Country Corridors'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setCorridorFilterMode('global')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    corridorFilterMode === 'global'
                      ? 'bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>All Global &amp; Indian Destinations</span>
                </button>
              </div>

              {/* CORRIDOR VIEW: Connected Cities in the same country */}
              {corridorFilterMode === 'corridor' && activeCountryCorridor && (
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-[#0c0d10] border border-[#c99a6b]/20 flex items-center justify-between text-xs text-stone-300">
                    <span className="flex items-center gap-2">
                      <Train className="w-4 h-4 text-[#c99a6b]" />
                      <span>{activeCountryCorridor.transitNetwork}</span>
                    </span>
                    <span className="text-[#e4c29e] font-semibold text-[11px]">Direct Transit</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
                    {activeCountryCorridor.cities.map((city, idx) => {
                      const isAlreadyAdded = existingCityNames.includes(city.name.toLowerCase());
                      const isSelected = selectedDestinationCard?.name?.toLowerCase() === city.name.toLowerCase();

                      const dbDest = availableDestinations.find(d => d.name.toLowerCase().includes(city.name.toLowerCase()) || city.name.toLowerCase().includes(d.name.toLowerCase())) || {
                        id: idx + 100,
                        name: city.name,
                        country: city.country,
                        avg_daily_cost: city.avgDailyCost
                      };

                      return (
                        <div
                          key={city.name}
                          onClick={() => {
                            if (!isAlreadyAdded) handleSelectDestinationCard(dbDest, city);
                          }}
                          className={`rounded-2xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between relative group ${
                            isSelected
                              ? 'bg-[#c99a6b]/20 border-[#c99a6b] ring-2 ring-[#c99a6b]/50 shadow-md'
                              : isAlreadyAdded
                              ? 'bg-[#0c0d10]/40 border-white/5 opacity-60 cursor-not-allowed'
                              : 'bg-[#0c0d10] border-white/10 hover:border-[#c99a6b]/40'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={city.imageUrl}
                              alt={city.name}
                              className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-serif text-sm font-bold text-white truncate">{city.name}</h4>
                                {isAlreadyAdded ? (
                                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">✓ Added</span>
                                ) : (
                                  <span className="px-1.5 py-0.2 rounded bg-white/10 text-[#e4c29e] text-[9px] font-mono font-bold">${city.avgDailyCost}/d</span>
                                )}
                              </div>
                              <p className="text-[10px] text-[#e4c29e] mt-0.5 truncate">{city.transitMode}</p>
                              <p className="text-[10px] text-stone-400 mt-0.5">{city.transitDuration} &bull; Est. ${city.transitCost}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* GLOBAL VIEW / Search */}
              {(corridorFilterMode === 'global' || !activeCountryCorridor) && (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Indian & World destinations (e.g. Jaipur, Udaipur, Goa, Agra, Delhi, Tokyo, Paris, Zermatt)..."
                      value={stopCitySearch}
                      onChange={(e) => setStopCitySearch(e.target.value)}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c99a6b]"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-56 overflow-y-auto p-1">
                    {filteredDestinationCards.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => handleSelectDestinationCard(d)}
                        className={`rounded-2xl p-3 border transition-all cursor-pointer flex flex-col justify-between ${
                          selectedDestinationCard?.id === d.id
                            ? 'bg-[#c99a6b]/20 border-[#c99a6b] ring-2 ring-[#c99a6b]/50 shadow-md'
                            : 'bg-[#0c0d10] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="h-16 rounded-xl overflow-hidden mb-2 relative">
                          <img
                            src={d.image_url || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=300&q=80'}
                            alt={d.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-[#e4c29e] font-bold">
                            ${d.avg_daily_cost}/d
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white truncate font-serif">{d.name}</p>
                          <p className="text-[10px] text-stone-400 truncate">{d.country}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Destination Highlights & Hotel / Food Recommendations Card */}
              {selectedDestinationCard && (
                <div className="p-4 rounded-2xl bg-[#0c0d10] border border-[#c99a6b]/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-serif font-bold text-white text-sm">{selectedDestinationCard.name}</span>
                    <span className="text-[#e4c29e] font-mono font-bold">${selectedDestinationCard.avg_daily_cost}/day</span>
                  </div>

                  {(selectedDestinationCard.hotelSuggestion || selectedDestinationCard.best_hotel) && (
                    <div className="flex items-start gap-2 text-stone-300 text-[11px]">
                      <Hotel className="w-3.5 h-3.5 text-[#c99a6b] flex-shrink-0 mt-0.5" />
                      <span><strong>Best Hotel:</strong> {selectedDestinationCard.hotelSuggestion || selectedDestinationCard.best_hotel}</span>
                    </div>
                  )}

                  {(selectedDestinationCard.foodSuggestion || selectedDestinationCard.best_food) && (
                    <div className="flex items-start gap-2 text-stone-300 text-[11px]">
                      <Utensils className="w-3.5 h-3.5 text-[#e4c29e] flex-shrink-0 mt-0.5" />
                      <span><strong>Must-Try Food:</strong> {selectedDestinationCard.foodSuggestion || selectedDestinationCard.best_food}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Form Details */}
              <form onSubmit={handleAddStopSubmit} className="space-y-4 pt-3 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Arrival Date *</label>
                    <input
                      type="date"
                      required
                      value={newStopData.arrivalDate}
                      onChange={(e) => setNewStopData({ ...newStopData, arrivalDate: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Departure Date *</label>
                    <input
                      type="date"
                      required
                      value={newStopData.departureDate}
                      onChange={(e) => setNewStopData({ ...newStopData, departureDate: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Est. Lodging / Stay ($)</label>
                    <input
                      type="number"
                      value={newStopData.stayCostEstimated}
                      onChange={(e) => setNewStopData({ ...newStopData, stayCostEstimated: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Est. Transit / High-Speed Rail ($)</label>
                    <input
                      type="number"
                      value={newStopData.transportCostEstimated}
                      onChange={(e) => setNewStopData({ ...newStopData, transportCostEstimated: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Recommended Lodging &amp; Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. The Raj Palace Heritage Haveli or Taj Lake Palace"
                    value={newStopData.notes}
                    onChange={(e) => setNewStopData({ ...newStopData, notes: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowAddStopModal(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-stone-400 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!newStopData.cityId}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] hover:from-[#dfb182] hover:to-[#e4c29e] text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#c99a6b]/20 disabled:opacity-50"
                  >
                    Add Stop to Route
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ================= RICH ACTIVITY SCHEDULER MODAL ================= */}
        {showAddActivityModal && (
          <div className="fixed inset-0 z-50 bg-[#0c0d10]/90 backdrop-blur-2xl flex items-center justify-center p-4">
            <div className="bg-[#14151a] border border-white/15 rounded-[32px] p-6 sm:p-8 max-w-xl w-full shadow-2xl font-sans max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in">
              
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c99a6b]">Curated Experiences</span>
                  <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                    Schedule Sights in {selectedStopForActivity?.city_name}
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">Pick from authentic curated landmarks or customize your own activity</p>
                </div>

                <button
                  onClick={() => setShowAddActivityModal(false)}
                  className="p-2 rounded-xl bg-white/5 text-stone-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* City Curated Quick-Picks */}
              {cityActivitiesCatalog.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Top Recommended Experiences for {selectedStopForActivity?.city_name}:
                  </span>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                    {cityActivitiesCatalog.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setNewActivityData({
                            ...newActivityData,
                            customTitle: item.name || item.custom_title,
                            category: item.category || 'sightseeing',
                            cost: (item.cost || 20).toString(),
                            startTime: item.startTime || '10:00',
                            endTime: item.endTime || '12:30',
                            notes: item.notes || '',
                          });
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          newActivityData.customTitle === (item.name || item.custom_title)
                            ? 'bg-[#c99a6b]/20 border-[#c99a6b]'
                            : 'bg-[#0c0d10] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-white font-serif">{item.name || item.custom_title}</p>
                          <span className="text-[10px] text-[#e4c29e] capitalize">{item.category || 'Sightseeing'} &bull; {item.startTime || '10:00'} - {item.endTime || '12:30'}</span>
                        </div>
                        <span className="font-serif text-sm font-bold text-emerald-400">${item.cost || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Input */}
              <form onSubmit={handleAddActivitySubmit} className="space-y-4 pt-2 border-t border-white/10">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Activity Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amber Fort Elephant Trek or Sunset Cruise"
                    value={newActivityData.customTitle}
                    onChange={(e) => setNewActivityData({ ...newActivityData, customTitle: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Category</label>
                    <select
                      value={newActivityData.category}
                      onChange={(e) => setNewActivityData({ ...newActivityData, category: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                    >
                      <option value="sightseeing">Sightseeing</option>
                      <option value="food_tour">Food &amp; Dining</option>
                      <option value="culture">Culture &amp; History</option>
                      <option value="adventure">Adventure &amp; Nature</option>
                      <option value="nightlife">Nightlife</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Est. Cost ($)</label>
                    <input
                      type="number"
                      value={newActivityData.cost}
                      onChange={(e) => setNewActivityData({ ...newActivityData, cost: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={newActivityData.activityDate}
                      onChange={(e) => setNewActivityData({ ...newActivityData, activityDate: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={newActivityData.startTime}
                      onChange={(e) => setNewActivityData({ ...newActivityData, startTime: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">End Time</label>
                    <input
                      type="time"
                      value={newActivityData.endTime}
                      onChange={(e) => setNewActivityData({ ...newActivityData, endTime: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowAddActivityModal(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-stone-400 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#c99a6b]/20"
                  >
                    Save Activity
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ================= LOG EXPENSE MODAL ================= */}
        {showAddExpenseModal && (
          <div className="fixed inset-0 z-50 bg-[#0c0d10]/90 backdrop-blur-2xl flex items-center justify-center p-4">
            <div className="bg-[#14151a] border border-white/15 rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl font-sans space-y-4 animate-in fade-in">
              <h3 className="font-serif text-2xl font-bold text-white">Log Actual Expense</h3>
              <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Expense Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vande Bharat Express Ticket"
                    value={newExpenseData.title}
                    onChange={(e) => setNewExpenseData({ ...newExpenseData, title: e.target.value })}
                    className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Category</label>
                    <select
                      value={newExpenseData.category}
                      onChange={(e) => setNewExpenseData({ ...newExpenseData, category: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                    >
                      <option value="stay">Lodging</option>
                      <option value="transport">Transit</option>
                      <option value="activities">Experiences</option>
                      <option value="meals">Meals</option>
                      <option value="misc">Miscellaneous</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">Amount ($)</label>
                    <input
                      type="number"
                      required
                      value={newExpenseData.amount}
                      onChange={(e) => setNewExpenseData({ ...newExpenseData, amount: e.target.value })}
                      className="w-full bg-[#0c0d10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddExpenseModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c99a6b] to-[#d4a373] text-[#0c0d10] text-xs font-bold"
                  >
                    Save Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
