export interface GeneratedActivity {
  title: string;
  category: 'sightseeing' | 'adventure' | 'food_tour' | 'culture' | 'nature' | 'nightlife';
  startTime: string;
  endTime: string;
  cost: number;
  description: string;
  locationName?: string;
}

export interface GeneratedDay {
  dayNumber: number;
  dateOffset: number;
  dayTitle: string;
  theme: string;
  activities: GeneratedActivity[];
  dayEstimatedCost: number;
  insiderTip: string;
}

export interface GeneratedStop {
  cityName: string;
  country: string;
  continent: string;
  imageUrl: string;
  stayCostEstimated: number;
  transportCostEstimated: number;
  recommendedHotel: string;
  daysCount: number;
  days: GeneratedDay[];
}

export interface GeneratedItinerary {
  id: string;
  title: string;
  tagline: string;
  overview: string;
  theme: string;
  durationDays: number;
  budget: {
    total: number;
    currency: string;
    formatted: string;
    stays: number;
    transport: number;
    food: number;
    activities: number;
    buffer: number;
  };
  isWithinBudget: boolean;
  coverImageUrl: string;
  stops: GeneratedStop[];
  packingChecklist: string[];
  proTips: string[];
  suggestedPace: 'Relaxed & Scenic' | 'Moderate Exploration' | 'High Energy & Adventure';
}

export class AIGeneratorService {
  /**
   * Parse natural language user prompt to extract intent, budget, currency, duration, and themes
   */
  static parsePrompt(prompt: string): {
    budget: number;
    currency: string;
    days: number;
    theme: 'mountains' | 'beaches' | 'culture' | 'cities' | 'romance' | 'adventure' | 'general';
    preferredRegion?: string;
  } {
    const text = prompt.toLowerCase();

    // 1. Extract Currency
    let currency = 'USD';
    if (text.includes('₹') || text.includes('inr') || text.includes('rs') || text.includes('rupees')) {
      currency = 'INR';
    } else if (text.includes('€') || text.includes('eur') || text.includes('euro')) {
      currency = 'EUR';
    } else if (text.includes('£') || text.includes('gbp') || text.includes('pound')) {
      currency = 'GBP';
    } else if (text.includes('¥') || text.includes('jpy') || text.includes('yen')) {
      currency = 'JPY';
    } else if (text.includes('$') || text.includes('usd') || text.includes('dollar')) {
      currency = 'USD';
    }

    // 2. Extract Budget Amount
    let budget = currency === 'INR' ? 30000 : 2000;
    // Matches patterns like "30,000", "30000", "30k", "2.5k", "$2500", "₹30,000"
    const budgetMatch = text.match(/(?:[₹$€£¥]|rs\.?|inr|usd|eur)?\s*([0-9]+(?:,[0-9]{3})*(?:\.[0-9]+)?|\d+k|\d+\.\d+k)/i);
    if (budgetMatch) {
      let rawVal = budgetMatch[1].replace(/,/g, '');
      if (rawVal.toLowerCase().endsWith('k')) {
        budget = parseFloat(rawVal.slice(0, -1)) * 1000;
      } else {
        const parsed = parseFloat(rawVal);
        if (!isNaN(parsed) && parsed > 50) {
          budget = parsed;
        }
      }
    }

    // 3. Extract Days / Duration
    let days = 5;
    const daysMatch = text.match(/([0-9]+)\s*(?:days?|nights?|d\b)/i);
    const weeksMatch = text.match(/([0-9]+)\s*(?:weeks?|wk)/i);
    if (daysMatch) {
      days = Math.min(30, Math.max(1, parseInt(daysMatch[1])));
    } else if (weeksMatch) {
      days = Math.min(30, Math.max(1, parseInt(weeksMatch[1]) * 7));
    }

    // 4. Extract Theme
    let theme: 'mountains' | 'beaches' | 'culture' | 'cities' | 'romance' | 'adventure' | 'general' = 'general';
    if (text.includes('mountain') || text.includes('hill') || text.includes('alps') || text.includes('himalaya') || text.includes('trek') || text.includes('snow') || text.includes('pass')) {
      theme = 'mountains';
    } else if (text.includes('beach') || text.includes('island') || text.includes('coast') || text.includes('ocean') || text.includes('tropical') || text.includes('sea')) {
      theme = 'beaches';
    } else if (text.includes('temple') || text.includes('culture') || text.includes('heritage') || text.includes('history') || text.includes('ancient') || text.includes('zen')) {
      theme = 'culture';
    } else if (text.includes('city') || text.includes('nightlife') || text.includes('metropolis') || text.includes('skyline') || text.includes('shopping')) {
      theme = 'cities';
    } else if (text.includes('romance') || text.includes('honeymoon') || text.includes('couple')) {
      theme = 'romance';
    } else if (text.includes('adventure') || text.includes('wild') || text.includes('safari') || text.includes('rafting') || text.includes('paragliding')) {
      theme = 'adventure';
    }

    return { budget, currency, days, theme };
  }

  /**
   * Synthesize a bespoke high-fidelity multi-city itinerary
   */
  static generateItinerary(prompt: string): GeneratedItinerary {
    const parsed = this.parsePrompt(prompt);
    const { budget, currency, days, theme } = parsed;

    const sym = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'JPY' ? '¥' : '$';

    // Budget Bucket Proportions
    const staysBudget = Math.round(budget * 0.35);
    const transportBudget = Math.round(budget * 0.22);
    const foodBudget = Math.round(budget * 0.23);
    const activitiesBudget = Math.round(budget * 0.15);
    const bufferBudget = Math.round(budget * 0.05);

    // 1. MOUNTAIN THEME
    if (theme === 'mountains' || prompt.toLowerCase().includes('mountain') || prompt.toLowerCase().includes('hill')) {
      if (currency === 'INR' || budget < 60000 && currency === 'INR') {
        return {
          id: `ai-itinerary-${Date.now()}`,
          title: `${days}-Day Himalayan Alpine & Valley Odyssey`,
          tagline: `Pine forests, snow-clad mountain passes, riverside cafes & serenity under ${sym}${budget.toLocaleString()}`,
          overview: `A bespoke ${days}-day mountain expedition through the breathtaking valleys of Himachal Pradesh (Manali, Solang Valley & Kasol/Parvati Valley). Balanced precisely for a total budget of ${sym}${budget.toLocaleString()} with authentic stays, scenic high passes, cafe trails, and mountain serenity.`,
          theme: 'Mountain Hills & High Passes',
          durationDays: days,
          budget: {
            total: budget,
            currency,
            formatted: `${sym}${budget.toLocaleString()}`,
            stays: staysBudget,
            transport: transportBudget,
            food: foodBudget,
            activities: activitiesBudget,
            buffer: bufferBudget,
          },
          isWithinBudget: true,
          coverImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
          suggestedPace: 'Moderate Exploration',
          proTips: [
            'Book the Atal Tunnel morning transit permit early for crisp glacier views without tourist queues.',
            'Visit the Old Manali pinewood forest trail around 4:30 PM for golden sunset mountain vistas.',
            'Carry cash/UPI as high-altitude cafes in Parvati Valley occasionally experience intermittent network connectivity.',
            'Dress in three-layer thermal clothing for sudden high-altitude ridge weather changes.'
          ],
          packingChecklist: [
            'Windproof & Thermal Fleece Jacket',
            'Waterproof High-Traction Hiking Shoes',
            'UV-Protection Polarized Sunglasses',
            'Portable 20,000mAh Power Bank',
            'Personal First-Aid & Altitude Care kit',
            'Reusable Insulated Thermal Flask'
          ],
          stops: [
            {
              cityName: 'Manali & Solang Valley',
              country: 'India',
              continent: 'Asia',
              imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
              stayCostEstimated: Math.round(staysBudget * 0.6),
              transportCostEstimated: Math.round(transportBudget * 0.55),
              recommendedHotel: 'Apple Orchards Boutique Riverside Chalet',
              daysCount: Math.max(2, Math.ceil(days * 0.6)),
              days: Array.from({ length: Math.max(2, Math.ceil(days * 0.6)) }, (_, i) => ({
                dayNumber: i + 1,
                dateOffset: i,
                dayTitle: i === 0 ? 'Arrival, Beas Riverwalk & Old Manali Cafes' : i === 1 ? 'Solang Valley Alpine Pass & Mountain Vista Trek' : 'Jogini Waterfalls & Vashisht Hot Springs Trail',
                theme: i === 0 ? 'Valley Acclimatization' : i === 1 ? 'Alpine Adventure' : 'Nature & Culture',
                dayEstimatedCost: Math.round(budget / days),
                insiderTip: 'Order fresh river trout and spiced mountain chai at the Old Manali river bridges.',
                activities: [
                  {
                    title: i === 0 ? 'Scenic Beas Riverbank Stroll & Pine Canopy Walk' : i === 1 ? 'Solang Valley High Ridge Ropeway & Paragliding' : 'Hike to Jogini Waterfall & Pine Forests',
                    category: 'nature',
                    startTime: '09:30',
                    endTime: '12:30',
                    cost: i === 1 ? Math.round(activitiesBudget * 0.3) : 0,
                    description: 'Panoramic views of snow-clad Pir Panjal peaks and fresh glacial air.',
                  },
                  {
                    title: 'Himalayan Organic Cafe Lunch & Artisan Bakery',
                    category: 'food_tour',
                    startTime: '13:00',
                    endTime: '14:30',
                    cost: Math.round(foodBudget / (days * 2)),
                    description: 'Handcrafted wood-fired sourdough pizzas, fresh apple cider & local trout.',
                  },
                  {
                    title: i === 0 ? 'Hidimba Devi Ancient Cedar Temple Exploration' : i === 1 ? 'Atal Tunnel Transit to Sissu Glacial Waterfall' : 'Vashisht Natural Sulphur Springs & Sunset Overlook',
                    category: 'culture',
                    startTime: '15:30',
                    endTime: '18:00',
                    cost: i === 1 ? Math.round(transportBudget * 0.2) : 0,
                    description: 'Centuries-old pagoda architecture nestled within towering deodar forests.',
                  },
                  {
                    title: 'Acoustic Music & Bonfire Dinner at Old Manali',
                    category: 'nightlife',
                    startTime: '19:30',
                    endTime: '21:30',
                    cost: Math.round(foodBudget / (days * 2)),
                    description: 'Cozy wooden lodge ambiance with spiced chai, live acoustic melodies & mountain views.',
                  }
                ]
              }))
            },
            {
              cityName: 'Kasol & Parvati Valley',
              country: 'India',
              continent: 'Asia',
              imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
              stayCostEstimated: Math.round(staysBudget * 0.4),
              transportCostEstimated: Math.round(transportBudget * 0.45),
              recommendedHotel: 'Riverside Wood Cabin & Pine Glamp',
              daysCount: Math.max(1, Math.floor(days * 0.4)),
              days: Array.from({ length: Math.max(1, Math.floor(days * 0.4)) }, (_, i) => ({
                dayNumber: Math.max(2, Math.ceil(days * 0.6)) + i + 1,
                dateOffset: Math.max(2, Math.ceil(days * 0.6)) + i,
                dayTitle: i === 0 ? 'Scenic Parvati River Crossing & Chalal Trail' : 'Tosh Mountain Village Ridge Panorama',
                theme: 'Riverside Tranquility & Village Hikes',
                dayEstimatedCost: Math.round(budget / days),
                insiderTip: 'Cross the suspension bridge early morning to watch the sun illuminate the pine-covered peaks.',
                activities: [
                  {
                    title: 'Chalal Pine Forest Walk & Parvati River Trail',
                    category: 'nature',
                    startTime: '10:00',
                    endTime: '13:00',
                    cost: 0,
                    description: 'Quiet forested trail along the rushing turquoise glacial waters of Parvati River.',
                  },
                  {
                    title: 'Middle-Eastern & Mountain Fusion Feast in Kasol',
                    category: 'food_tour',
                    startTime: '13:30',
                    endTime: '15:00',
                    cost: Math.round(foodBudget / (days * 2)),
                    description: 'Famous shakshuka, fresh hummus platters, and hot mint lemon tea.',
                  },
                  {
                    title: 'Manikaran Hot Springs & Gurudwara Pilgrimage',
                    category: 'culture',
                    startTime: '16:00',
                    endTime: '18:30',
                    cost: Math.round(transportBudget * 0.15),
                    description: 'Geothermal natural hot spring baths and sacred mountain heritage.',
                  }
                ]
              }))
            }
          ]
        };
      } else {
        // International Alpine (Swiss Alps & Banff)
        return {
          id: `ai-itinerary-${Date.now()}`,
          title: `${days}-Day Swiss Alpine High Passes & Valleys`,
          tagline: `Granite summits, panoramic cogwheel railways & glacial lakes under ${sym}${budget.toLocaleString()}`,
          overview: `An alpine journey composed through Zermatt, Matterhorn Glacier Paradise and the Bernese Oberland. Engineered to maximize panoramic high-passes, glacier railways, and alpine hiking within your ${sym}${budget.toLocaleString()} target.`,
          theme: 'Alpine & High Mountain Passes',
          durationDays: days,
          budget: {
            total: budget,
            currency,
            formatted: `${sym}${budget.toLocaleString()}`,
            stays: staysBudget,
            transport: transportBudget,
            food: foodBudget,
            activities: activitiesBudget,
            buffer: bufferBudget,
          },
          isWithinBudget: true,
          coverImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
          suggestedPace: 'Relaxed & Scenic',
          proTips: [
            'Get the Swiss Half-Fare Card or Swiss Travel Pass for seamless 50% discounts on mountain cable cars.',
            'Visit the Riffelsee Lake reflection viewpoint at 08:30 AM before the wind disturbs the water surface.',
            'Pack fondue snacks from local village cheese dairies for mountaintop picnics.'
          ],
          packingChecklist: [
            'Waterproof Gore-Tex Shell Jacket',
            'Sturdy Mountain Trekking Boots',
            'UV Category 4 Sunglasses for Glacier Glare',
            'Universal Swiss Power Adapter (Type J/C)',
            'Compact Thermal Insulated Flask'
          ],
          stops: [
            {
              cityName: 'Zermatt & Matterhorn',
              country: 'Switzerland',
              continent: 'Europe',
              imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
              stayCostEstimated: staysBudget,
              transportCostEstimated: transportBudget,
              recommendedHotel: 'Alpine Chalet Boutique & Spa Zermatt',
              daysCount: days,
              days: Array.from({ length: days }, (_, i) => ({
                dayNumber: i + 1,
                dateOffset: i,
                dayTitle: i === 0 ? 'Arrival & Zermatt Car-Free Village Exploration' : i === 1 ? 'Gornergrat Cogwheel Railway & Matterhorn Reflection' : i === 2 ? 'Glacier Paradise High Summit & Ice Palace' : 'Five Lakes Trail Hike & Alpine Meadows',
                theme: 'Alpine Vistas & Mountain Rails',
                dayEstimatedCost: Math.round(budget / days),
                insiderTip: 'Sit on the right side of the Gornergrat train on the ascent for the most dramatic Matterhorn views.',
                activities: [
                  {
                    title: i === 0 ? 'Old Zermatt Village Heritage Walk & Wood Chalets' : 'Gornergrat Historic Cogwheel Railway Ascent',
                    category: 'sightseeing',
                    startTime: '09:00',
                    endTime: '12:00',
                    cost: i === 0 ? 0 : Math.round(activitiesBudget * 0.4),
                    description: 'Ascend to 3,089m with 360-degree views of 29 peaks exceeding 4,000 meters.',
                  },
                  {
                    title: 'Traditional Alpine Raclette & Rosti Lunch',
                    category: 'food_tour',
                    startTime: '12:30',
                    endTime: '14:00',
                    cost: Math.round(foodBudget / (days * 2)),
                    description: 'Melted Swiss mountain cheese with roasted potatoes and local Valais wine.',
                  },
                  {
                    title: 'Riffelsee Mirror Lake Hike & Mountain Trail',
                    category: 'nature',
                    startTime: '14:30',
                    endTime: '17:00',
                    cost: 0,
                    description: 'Capture the famous mirror reflection of the Matterhorn in the pristine alpine lake.',
                  }
                ]
              }))
            }
          ]
        };
      }
    }

    // 2. BEACHES & TROPICAL THEME
    if (theme === 'beaches' || prompt.toLowerCase().includes('beach') || prompt.toLowerCase().includes('island') || prompt.toLowerCase().includes('sea')) {
      return {
        id: `ai-itinerary-${Date.now()}`,
        title: `${days}-Day Tropical Archipelagos & Coastal Sunsets`,
        tagline: `Sapphire coves, pastel cliffside terraces & golden coastlines under ${sym}${budget.toLocaleString()}`,
        overview: `A sun-drenched ${days}-day coastal expedition designed for rejuvenation, crystal-clear water adventures, coastal culinary delicacies, and vibrant sunset vistas.`,
        theme: 'Coastal Archipelagos & Sapphire Waters',
        durationDays: days,
        budget: {
          total: budget,
          currency,
          formatted: `${sym}${budget.toLocaleString()}`,
          stays: staysBudget,
          transport: transportBudget,
          food: foodBudget,
          activities: activitiesBudget,
          buffer: bufferBudget,
        },
        isWithinBudget: true,
        coverImageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=85',
        suggestedPace: 'Relaxed & Scenic',
        proTips: [
          'Rent a light scooter or coastal ferry pass for flexible hopping between secluded bays.',
          'Schedule sunset catamaran cruises on day 2 for breathtaking golden hour coastal photography.',
          'Reef-safe biodegradable sunscreen is strongly recommended for marine sanctuary preservation.'
        ],
        packingChecklist: [
          'Reef-Safe Sunscreen SPF 50+',
          'Lightweight Linen Shirts & Beachwear',
          'Waterproof Phone Pouch for Snorkeling',
          'UV-Protected Sunglasses & Sun Hat',
          'Quick-Dry Microfiber Beach Towel'
        ],
        stops: [
          {
            cityName: currency === 'INR' ? 'Goa & Coastal Cliffs' : 'Amalfi Coast & Positano',
            country: currency === 'INR' ? 'India' : 'Italy',
            continent: currency === 'INR' ? 'Asia' : 'Europe',
            imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
            stayCostEstimated: staysBudget,
            transportCostEstimated: transportBudget,
            recommendedHotel: 'Cliffside Oceanview Boutique Terraces',
            daysCount: days,
            days: Array.from({ length: days }, (_, i) => ({
              dayNumber: i + 1,
              dateOffset: i,
              dayTitle: i === 0 ? 'Coastal Arrival & Sunset Bay Walk' : i === 1 ? 'Catamaran Island Cruise & Snorkeling' : 'Cliffside Villages & Seafood Tasting',
              theme: 'Coastal Solitude & Sapphire Waters',
              dayEstimatedCost: Math.round(budget / days),
              insiderTip: 'Visit the secluded cove beach before 10 AM for calm turquoise waters and total stillness.',
              activities: [
                {
                  title: 'Private Speedboat / Catamaran Coastal Cruise',
                  category: 'adventure',
                  startTime: '09:30',
                  endTime: '13:00',
                  cost: Math.round(activitiesBudget * 0.4),
                  description: 'Cruise past limestone cliffs and swim in secluded azure lagoons.',
                },
                {
                  title: 'Fresh Catch Seafood & Citrus Gastronomy',
                  category: 'food_tour',
                  startTime: '13:30',
                  endTime: '15:00',
                  cost: Math.round(foodBudget / (days * 2)),
                  description: 'Grilled sea bass, handmade linguine with clams, and fresh chilled lemonades.',
                },
                {
                  title: 'Golden Sunset Cliff Overlook & Evening Stroll',
                  category: 'nature',
                  startTime: '17:30',
                  endTime: '19:30',
                  cost: 0,
                  description: 'Watch the sun dip below the ocean horizon from panoramic cliffside viewpoints.',
                }
              ]
            }))
          }
        ]
      };
    }

    // 3. CULTURE / ZEN / CITIES THEME (Default Kyoto, Tokyo, Europe)
    return {
      id: `ai-itinerary-${Date.now()}`,
      title: `${days}-Day Cultural Capitals & Timeless Heritage Expedition`,
      tagline: `Zen gardens, ancient temples, culinary alleys & vibrant horizons under ${sym}${budget.toLocaleString()}`,
      overview: `A curated ${days}-day cultural itinerary blending timeless historic heritage, serene bamboo groves, vibrant culinary lanes, and architectural landmarks balanced within your ${sym}${budget.toLocaleString()} budget.`,
      theme: 'Cultural Capitals & Zen Heritage',
      durationDays: days,
      budget: {
        total: budget,
        currency,
        formatted: `${sym}${budget.toLocaleString()}`,
        stays: staysBudget,
        transport: transportBudget,
        food: foodBudget,
        activities: activitiesBudget,
        buffer: bufferBudget,
      },
      isWithinBudget: true,
      coverImageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85',
      suggestedPace: 'Moderate Exploration',
      proTips: [
        'Visit the Bamboo Grove at 07:00 AM before crowds arrive for magical lighting and bamboo whisper sounds.',
        'Purchase a contactless IC transit card for instant turnstile access on all subway and bus lines.',
        'Make reservations for authentic tea ceremonies at least 3 days in advance.'
      ],
      packingChecklist: [
        'Comfortable Walking Shoes for Stone Paths',
        'Universal International Power Adapter',
        'Lightweight Rain Umbrella',
        'Daypack for Sights & Water Flask',
        'Modest Attire for Temple Entrances'
      ],
      stops: [
        {
          cityName: 'Kyoto Heritage Hills',
          country: 'Japan',
          continent: 'Asia',
          imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
          stayCostEstimated: staysBudget,
          transportCostEstimated: transportBudget,
          recommendedHotel: 'Traditional Wooden Machiya Guest Atelier',
          daysCount: days,
          days: Array.from({ length: days }, (_, i) => ({
            dayNumber: i + 1,
            dateOffset: i,
            dayTitle: i === 0 ? 'Arashiyama Bamboo Sanctuary & River Walk' : i === 1 ? 'Fushimi Inari Torii Gates & Gion Tea Heritage' : 'Kinkaku-ji Golden Pavilion & Zen Rock Gardens',
            theme: 'Zen Temples & Historic Alleys',
            dayEstimatedCost: Math.round(budget / days),
            insiderTip: 'Wander the side alleys of Gion around dusk to admire traditional lanterns illuminating preserved wooden facades.',
            activities: [
              {
                title: 'Morning Sanctuary Walk in Arashiyama Bamboo Forest',
                category: 'nature',
                startTime: '08:30',
                endTime: '11:00',
                cost: 0,
                description: 'Towering green bamboo stalks swaying in the morning breeze along quiet stone paths.',
              },
              {
                title: 'Traditional Matcha Tea Ceremony & Kaiseki Lunch',
                category: 'food_tour',
                startTime: '12:00',
                endTime: '14:00',
                cost: Math.round(foodBudget / (days * 2)),
                description: 'Ceremonial matcha preparation with handcrafted seasonal wagashi sweets.',
              },
              {
                title: 'Historic Gion Geisha District & Yasaka Pagoda Sunset',
                category: 'culture',
                startTime: '16:00',
                endTime: '18:30',
                cost: 0,
                description: 'Iconic cobblestone preservation district with five-story wooden pagodas.',
              },
              {
                title: 'Lantern-Lit Dining in Pontocho Alley',
                category: 'food_tour',
                startTime: '19:30',
                endTime: '21:30',
                cost: Math.round(foodBudget / (days * 2)),
                description: 'Atmospheric narrow alley along Kamogawa river with yakitori, ramen, and artisan sake.',
              }
            ]
          }))
        }
      ]
    };
  }
}
