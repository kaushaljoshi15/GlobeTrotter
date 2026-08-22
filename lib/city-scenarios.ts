export interface ScenarioSlide {
  id: string;
  url: string;
  location: string;
  city: string;
  country: string;
  caption: string;
}

export const CITY_SCENARIOS: { [key: string]: ScenarioSlide[] } = {
  himalayas: [
    {
      id: 'himalaya-1',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=90',
      location: 'Rohtang Pass & Solang Ridge',
      city: 'Himalayas',
      country: 'India',
      caption: 'Snow-capped Himalayan peaks and alpine deodar pine valleys',
    },
    {
      id: 'himalaya-2',
      url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=2000&q=90',
      location: 'Beas River Pine Canopy',
      city: 'Manali',
      country: 'India',
      caption: 'Crisp morning mist over rushing glacial mountain streams',
    },
    {
      id: 'himalaya-3',
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=90',
      location: 'Parvati Valley & Spiti Highlands',
      city: 'Kasol & Spiti',
      country: 'India',
      caption: 'Serene mountain villages, high-altitude passes and starlit ridges',
    },
  ],
  newyork: [
    {
      id: 'ny-1',
      url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=2000&q=90',
      location: 'Manhattan Skyline & Midtown Lights',
      city: 'New York',
      country: 'United States',
      caption: 'Iconic golden sunset illuminating the Empire State and Midtown towers',
    },
    {
      id: 'ny-2',
      url: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=2000&q=90',
      location: 'Brooklyn Bridge & Manhattan Skyline Twilight',
      city: 'New York',
      country: 'United States',
      caption: 'Suspension bridge cables framing the illuminated Financial District',
    },
    {
      id: 'ny-3',
      url: 'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?auto=format&fit=crop&w=2000&q=90',
      location: 'Central Park Bow Bridge & Autumn Trees',
      city: 'New York',
      country: 'United States',
      caption: 'Reflections of stone arches amidst golden autumn foliage',
    },
  ],
  kyoto: [
    {
      id: 'kyoto-1',
      url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2000&q=90',
      location: 'Arashiyama Bamboo Sanctuary',
      city: 'Kyoto',
      country: 'Japan',
      caption: 'Emerald bamboo stalks swaying in the quiet morning mountain air',
    },
    {
      id: 'kyoto-2',
      url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2000&q=90',
      location: 'Gion Historic Pagoda Alleys',
      city: 'Kyoto',
      country: 'Japan',
      caption: 'Warm lantern glow along preserved cobblestone machiya lanes',
    },
    {
      id: 'kyoto-3',
      url: 'https://images.unsplash.com/photo-1478436127897-769e00d0c71e?auto=format&fit=crop&w=2000&q=90',
      location: 'Fushimi Inari Vermillion Torii Gates',
      city: 'Kyoto',
      country: 'Japan',
      caption: 'Sacred hillside shrine tunnel glowing under dappled forest sunlight',
    },
  ],
  tokyo: [
    {
      id: 'tokyo-1',
      url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2000&q=90',
      location: 'Shinjuku Neon Alleyways & Skyline',
      city: 'Tokyo',
      country: 'Japan',
      caption: 'Vibrant neon streetscapes, izakaya lanterns & futuristic metropolis',
    },
    {
      id: 'tokyo-2',
      url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2000&q=90',
      location: 'Shibuya Crossing & Tokyo Tower Dusk',
      city: 'Tokyo',
      country: 'Japan',
      caption: 'Electric pulse of the world’s most dynamic urban intersection',
    },
  ],
  paris: [
    {
      id: 'paris-1',
      url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=90',
      location: 'Eiffel Tower & Seine River Twilight',
      city: 'Paris',
      country: 'France',
      caption: 'Golden hour silhouette of the Eiffel Tower over Parisian limestone facades',
    },
    {
      id: 'paris-2',
      url: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=2000&q=90',
      location: 'Louvre Courtyard & Glass Pyramid',
      city: 'Paris',
      country: 'France',
      caption: 'Warm courtyard illumination reflecting on historical royal architecture',
    },
  ],
  switzerland: [
    {
      id: 'swiss-1',
      url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=2000&q=90',
      location: 'Matterhorn & Zermatt Alpine Ridge',
      city: 'Zermatt',
      country: 'Switzerland',
      caption: 'Iconic pyramid peak mirrored in tranquil high-altitude alpine lakes',
    },
    {
      id: 'swiss-2',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=90',
      location: 'Glacier Express & Bernese Oberland',
      city: 'Interlaken',
      country: 'Switzerland',
      caption: 'Panoramic rail journeys winding through emerald mountain meadows',
    },
  ],
  santorini: [
    {
      id: 'santorini-1',
      url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2000&q=90',
      location: 'Oia Blue Dome & Caldera Sunset',
      city: 'Santorini',
      country: 'Greece',
      caption: 'Whitewashed cliffside villas cascading toward the sapphire Aegean Sea',
    },
    {
      id: 'santorini-2',
      url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2000&q=90',
      location: 'Amoudi Bay & Cycladic Coves',
      city: 'Santorini',
      country: 'Greece',
      caption: 'Pastel sunsets illuminating volcanic rock cliffs and azure waters',
    },
  ],
  bali: [
    {
      id: 'bali-1',
      url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=90',
      location: 'Ubud Emerald Rice Terraces',
      city: 'Bali',
      country: 'Indonesia',
      caption: 'Cascading jungle hillsides shrouded in early morning tropical mist',
    },
    {
      id: 'bali-2',
      url: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=2000&q=90',
      location: 'Uluwatu Ocean Cliff Temple',
      city: 'Bali',
      country: 'Indonesia',
      caption: 'Sacred stone temples overlooking dramatic crashing ocean waves',
    },
  ],
  goa: [
    {
      id: 'goa-1',
      url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2000&q=90',
      location: 'Palolem Palm Cove & Arabian Sea',
      city: 'Goa',
      country: 'India',
      caption: 'Golden sunset reflections on coconut palm-fringed coastlines',
    },
    {
      id: 'goa-2',
      url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2000&q=90',
      location: 'Chapora Cliff & Red Rock Beaches',
      city: 'Goa',
      country: 'India',
      caption: 'Scenic ocean vistas and vintage Portuguese coastal architecture',
    },
  ],
  rome: [
    {
      id: 'rome-1',
      url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=2000&q=90',
      location: 'Colosseum & Roman Forum Twilight',
      city: 'Rome',
      country: 'Italy',
      caption: 'Ancient arches illuminated against deep sapphire evening skies',
    },
    {
      id: 'rome-2',
      url: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=2000&q=90',
      location: 'Trevi Fountain & Cobblestone Piazzas',
      city: 'Rome',
      country: 'Italy',
      caption: 'Baroque travertine sculptures and illuminated azure fountain waters',
    },
  ],
  dubai: [
    {
      id: 'dubai-1',
      url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=90',
      location: 'Burj Khalifa & Downtown Skyline',
      city: 'Dubai',
      country: 'United Arab Emirates',
      caption: 'World’s tallest architectural marvel glittering above desert horizons',
    },
    {
      id: 'dubai-2',
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=90',
      location: 'Arabian Dunes & Marina Coast',
      city: 'Dubai',
      country: 'United Arab Emirates',
      caption: 'Rolling desert sunset dunes meeting ultra-modern coastal luxury',
    },
  ],
  london: [
    {
      id: 'london-1',
      url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2000&q=90',
      location: 'Big Ben & Westminster Palace',
      city: 'London',
      country: 'United Kingdom',
      caption: 'Gothic clocktower reflections dancing over the tranquil River Thames',
    },
    {
      id: 'london-2',
      url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=2000&q=90',
      location: 'Tower Bridge & London Skyline',
      city: 'London',
      country: 'United Kingdom',
      caption: 'Victorian suspension bridge illuminated against twilight skies',
    },
  ],
  banff: [
    {
      id: 'banff-1',
      url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=2000&q=90',
      location: 'Moraine Lake & Valley of Ten Peaks',
      city: 'Banff',
      country: 'Canada',
      caption: 'Vivid turquoise glacial waters flanked by soaring granite peaks',
    },
    {
      id: 'banff-2',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=90',
      location: 'Lake Louise & Canadian Rockies Ridge',
      city: 'Banff',
      country: 'Canada',
      caption: 'Pine-covered mountain slopes and pristine emerald alpine reflections',
    },
  ],
  agra: [
    {
      id: 'agra-1',
      url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2000&q=90',
      location: 'Taj Mahal & Yamuna River Sunrise',
      city: 'Agra',
      country: 'India',
      caption: 'White marble dome glowing under golden sunrise mist and garden reflections',
    },
    {
      id: 'agra-2',
      url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2000&q=90',
      location: 'Amber Fort & Hawa Mahal Palace',
      city: 'Jaipur & Agra',
      country: 'India',
      caption: 'Centuries of royal Rajputana stone architecture and ornate sandstone balconies',
    },
  ],
};

/**
 * Detect the matching city key based on a text prompt
 */
export function detectCityScenario(text: string): { key: string; slides: ScenarioSlide[] } {
  const query = text.toLowerCase();

  if (
    query.includes('himalaya') ||
    query.includes('manali') ||
    query.includes('kasol') ||
    query.includes('shimla') ||
    query.includes('spiti') ||
    query.includes('dharamshala') ||
    query.includes('leh') ||
    query.includes('ladakh') ||
    query.includes('mountain') ||
    query.includes('hill')
  ) {
    return { key: 'himalayas', slides: CITY_SCENARIOS.himalayas };
  }

  if (
    query.includes('new york') ||
    query.includes('newyork') ||
    query.includes('nyc') ||
    query.includes('manhattan') ||
    query.includes('brooklyn') ||
    query.includes('central park')
  ) {
    return { key: 'newyork', slides: CITY_SCENARIOS.newyork };
  }

  if (
    query.includes('kyoto') ||
    query.includes('arashiyama') ||
    query.includes('gion') ||
    query.includes('fushimi') ||
    query.includes('temple') ||
    query.includes('zen')
  ) {
    return { key: 'kyoto', slides: CITY_SCENARIOS.kyoto };
  }

  if (
    query.includes('tokyo') ||
    query.includes('shibuya') ||
    query.includes('shinjuku') ||
    query.includes('japan')
  ) {
    return { key: 'tokyo', slides: CITY_SCENARIOS.tokyo };
  }

  if (
    query.includes('paris') ||
    query.includes('france') ||
    query.includes('eiffel') ||
    query.includes('louvre')
  ) {
    return { key: 'paris', slides: CITY_SCENARIOS.paris };
  }

  if (
    query.includes('swiss') ||
    query.includes('switzerland') ||
    query.includes('zermatt') ||
    query.includes('matterhorn') ||
    query.includes('alps') ||
    query.includes('interlaken')
  ) {
    return { key: 'switzerland', slides: CITY_SCENARIOS.switzerland };
  }

  if (
    query.includes('santorini') ||
    query.includes('greece') ||
    query.includes('oia') ||
    query.includes('mykonos') ||
    query.includes('aegean')
  ) {
    return { key: 'santorini', slides: CITY_SCENARIOS.santorini };
  }

  if (
    query.includes('bali') ||
    query.includes('ubud') ||
    query.includes('indonesia') ||
    query.includes('uluwatu') ||
    query.includes('nusa penida')
  ) {
    return { key: 'bali', slides: CITY_SCENARIOS.bali };
  }

  if (
    query.includes('goa') ||
    query.includes('beach') ||
    query.includes('coast') ||
    query.includes('island') ||
    query.includes('ocean')
  ) {
    return { key: 'goa', slides: CITY_SCENARIOS.goa };
  }

  if (
    query.includes('rome') ||
    query.includes('italy') ||
    query.includes('colosseum') ||
    query.includes('amalfi') ||
    query.includes('positano') ||
    query.includes('venice')
  ) {
    return { key: 'rome', slides: CITY_SCENARIOS.rome };
  }

  if (
    query.includes('dubai') ||
    query.includes('uae') ||
    query.includes('burj') ||
    query.includes('desert')
  ) {
    return { key: 'dubai', slides: CITY_SCENARIOS.dubai };
  }

  if (
    query.includes('london') ||
    query.includes('uk') ||
    query.includes('england') ||
    query.includes('big ben')
  ) {
    return { key: 'london', slides: CITY_SCENARIOS.london };
  }

  if (
    query.includes('banff') ||
    query.includes('canada') ||
    query.includes('rockies') ||
    query.includes('moraine')
  ) {
    return { key: 'banff', slides: CITY_SCENARIOS.banff };
  }

  if (
    query.includes('taj mahal') ||
    query.includes('agra') ||
    query.includes('jaipur') ||
    query.includes('india')
  ) {
    return { key: 'agra', slides: CITY_SCENARIOS.agra };
  }

  // Default to Himalayas
  return { key: 'himalayas', slides: CITY_SCENARIOS.himalayas };
}
