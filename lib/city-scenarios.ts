export interface ScenarioSlide {
  id: string;
  url: string;
  location: string;
  city: string;
  country: string;
  caption: string;
}

// Curated 4K Panoramic Landscape & Cityscape Scenarios for World Destinations
export const WORLD_DESTINATION_SCENARIOS: { [key: string]: ScenarioSlide[] } = {
  // --- ASIA & HIMALAYAS ---
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
  manali: [
    {
      id: 'manali-1',
      url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=2000&q=90',
      location: 'Solang Valley Alpine Ridge',
      city: 'Manali',
      country: 'India',
      caption: 'Panoramic snow summits and pine-covered Himalayan slopes',
    },
    {
      id: 'manali-2',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=90',
      location: 'Old Manali Apple Orchards',
      city: 'Manali',
      country: 'India',
      caption: 'Rustic wooden chalets and peaceful mountain riverside paths',
    },
  ],
  ladakh: [
    {
      id: 'ladakh-1',
      url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=2000&q=90',
      location: 'Pangong Tso Crystal Lake',
      city: 'Leh Ladakh',
      country: 'India',
      caption: 'Deep azure high-altitude lake framed by rugged barren mountain peaks',
    },
    {
      id: 'ladakh-2',
      url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2000&q=90',
      location: 'Nubra Valley & Khardung La',
      city: 'Ladakh',
      country: 'India',
      caption: 'World’s highest motorable pass and rolling mountain sand dunes',
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
    {
      id: 'tokyo-3',
      url: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=2000&q=90',
      location: 'Asakusa Senso-ji & Mt. Fuji Horizon',
      city: 'Tokyo',
      country: 'Japan',
      caption: 'Traditional pagoda lanterns with snow-capped Fuji silhouette in distance',
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
    {
      id: 'bali-3',
      url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=2000&q=90',
      location: 'Nusa Penida Kelingking Cove',
      city: 'Bali',
      country: 'Indonesia',
      caption: 'Iconic dinosaur-head limestone cliff towering over white sand waters',
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
      location: 'Chapora Cliff & Red Rock Coast',
      city: 'Goa',
      country: 'India',
      caption: 'Scenic ocean vistas and vintage Portuguese coastal architecture',
    },
  ],
  bangkok: [
    {
      id: 'bangkok-1',
      url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=2000&q=90',
      location: 'Wat Arun Temple of Dawn',
      city: 'Bangkok',
      country: 'Thailand',
      caption: 'Intricate porcelain spire reflecting in Chao Phraya River at dusk',
    },
    {
      id: 'bangkok-2',
      url: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=2000&q=90',
      location: 'Grand Palace & Golden Stupas',
      city: 'Bangkok',
      country: 'Thailand',
      caption: 'Opulent Siamese architecture and glittering golden spires',
    },
  ],
  singapore: [
    {
      id: 'singapore-1',
      url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=2000&q=90',
      location: 'Marina Bay Sands & Supertree Grove',
      city: 'Singapore',
      country: 'Singapore',
      caption: 'Futuristic vertical gardens illuminated against tropical night skies',
    },
    {
      id: 'singapore-2',
      url: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=2000&q=90',
      location: 'Jewel Changi Rain Vortex',
      city: 'Singapore',
      country: 'Singapore',
      caption: 'World’s tallest indoor waterfall surrounded by lush tiered terraced forest',
    },
  ],
  seoul: [
    {
      id: 'seoul-1',
      url: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=2000&q=90',
      location: 'Gyeongbokgung Palace & Bukhansan',
      city: 'Seoul',
      country: 'South Korea',
      caption: 'Joseon dynasty pavilion against rugged granite mountain background',
    },
    {
      id: 'seoul-2',
      url: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=2000&q=90',
      location: 'N Seoul Tower & Gangnam Skyline',
      city: 'Seoul',
      country: 'South Korea',
      caption: 'Glittering nocturnal metropolis stretching into distant mountain horizons',
    },
  ],
  dubai: [
    {
      id: 'dubai-1',
      url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=90',
      location: 'Burj Khalifa & Downtown Fountains',
      city: 'Dubai',
      country: 'United Arab Emirates',
      caption: 'World’s tallest architectural marvel glittering above desert horizons',
    },
    {
      id: 'dubai-2',
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=90',
      location: 'Arabian Dunes & Palm Jumeirah',
      city: 'Dubai',
      country: 'United Arab Emirates',
      caption: 'Rolling desert sunset dunes meeting ultra-modern coastal luxury',
    },
  ],

  // --- AMERICAS ---
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
  sanfrancisco: [
    {
      id: 'sf-1',
      url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=2000&q=90',
      location: 'Golden Gate Bridge & Pacific Fog',
      city: 'San Francisco',
      country: 'United States',
      caption: 'International orange towers rising majestically above rolling marine fog',
    },
    {
      id: 'sf-2',
      url: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=2000&q=90',
      location: 'Painted Ladies & Alamo Square Skyline',
      city: 'San Francisco',
      country: 'United States',
      caption: 'Victorian pastel architecture overlooking modern downtown towers',
    },
  ],
  losangeles: [
    {
      id: 'la-1',
      url: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=2000&q=90',
      location: 'Santa Monica Pier & Pacific Sunset',
      city: 'Los Angeles',
      country: 'United States',
      caption: 'Ferris wheel silhouette and palm tree reflections over golden waves',
    },
    {
      id: 'la-2',
      url: 'https://images.unsplash.com/photo-1518887572111-e6e739943486?auto=format&fit=crop&w=2000&q=90',
      location: 'Griffith Observatory & LA Basin Skyline',
      city: 'Los Angeles',
      country: 'United States',
      caption: 'Sprawling night lights reaching from Hollywood Hills to downtown',
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
  riodejaneiro: [
    {
      id: 'rio-1',
      url: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=2000&q=90',
      location: 'Christ the Redeemer & Sugarloaf Mountain',
      city: 'Rio de Janeiro',
      country: 'Brazil',
      caption: 'Panoramic ocean bays and monolithic granite peaks emerging from clouds',
    },
    {
      id: 'rio-2',
      url: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=2000&q=90',
      location: 'Copacabana & Ipanema Beach Sunset',
      city: 'Rio de Janeiro',
      country: 'Brazil',
      caption: 'Golden Atlantic waves meeting iconic coastal promenade mosaics',
    },
  ],
  cusco: [
    {
      id: 'cusco-1',
      url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=2000&q=90',
      location: 'Machu Picchu Sacred Incan Citadel',
      city: 'Cusco',
      country: 'Peru',
      caption: 'Ancient stone terraces nestled high amidst Andean cloud forests',
    },
    {
      id: 'cusco-2',
      url: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=2000&q=90',
      location: 'Plaza de Armas & Andean Alleys',
      city: 'Cusco',
      country: 'Peru',
      caption: 'Spanish colonial cathedrals built upon monolithic Incan stone foundations',
    },
  ],

  // --- EUROPE ---
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
    {
      id: 'paris-3',
      url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=2000&q=90',
      location: 'Pont Alexandre III & Montmartre',
      city: 'Paris',
      country: 'France',
      caption: 'Gilded Beaux-Arts statues overlooking classic Parisian boulevard bridges',
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
  venice: [
    {
      id: 'venice-1',
      url: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=2000&q=90',
      location: 'Grand Canal & Rialto Bridge',
      city: 'Venice',
      country: 'Italy',
      caption: 'Gondolas gliding along historic Venetian palaces during sunset golden hour',
    },
    {
      id: 'venice-2',
      url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=2000&q=90',
      location: 'Piazza San Marco & Doge’s Palace',
      city: 'Venice',
      country: 'Italy',
      caption: 'Gothic waterfront arches illuminated by historic ornate streetlamps',
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
  barcelona: [
    {
      id: 'barcelona-1',
      url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=2000&q=90',
      location: 'Sagrada Familia & Park Güell',
      city: 'Barcelona',
      country: 'Spain',
      caption: 'Gaudi’s organic stone spires reaching into Mediterranean azure skies',
    },
    {
      id: 'barcelona-2',
      url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=2000&q=90',
      location: 'Barceloneta Beach & Gothic Quarter',
      city: 'Barcelona',
      country: 'Spain',
      caption: 'Vibrant Mediterranean coastline meeting medieval stone passageways',
    },
  ],
  amsterdam: [
    {
      id: 'amsterdam-1',
      url: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=2000&q=90',
      location: 'Prinsengracht Canal & Gabled Mansions',
      city: 'Amsterdam',
      country: 'Netherlands',
      caption: 'Bicycles parked along 17th-century canal bridges at golden hour',
    },
    {
      id: 'amsterdam-2',
      url: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=2000&q=90',
      location: 'Keukenhof Tulip Fields & Windmills',
      city: 'Amsterdam',
      country: 'Netherlands',
      caption: 'Endless stripes of vibrant blooms under sweeping Dutch sky horizons',
    },
  ],
  prague: [
    {
      id: 'prague-1',
      url: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=2000&q=90',
      location: 'Charles Bridge & Prague Castle',
      city: 'Prague',
      country: 'Czech Republic',
      caption: 'Gothic stone towers and baroque statues rising over Vltava river mist',
    },
    {
      id: 'prague-2',
      url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=2000&q=90',
      location: 'Old Town Square & Astronomical Clock',
      city: 'Prague',
      country: 'Czech Republic',
      caption: 'Fairy-tale spires illuminated against dramatic deep cobalt skies',
    },
  ],
  iceland: [
    {
      id: 'iceland-1',
      url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=2000&q=90',
      location: 'Kirkjufell Mountain & Aurora Borealis',
      city: 'Reykjavik',
      country: 'Iceland',
      caption: 'Vibrant green northern lights dancing above conical volcanic peaks',
    },
    {
      id: 'iceland-2',
      url: 'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=2000&q=90',
      location: 'Skogafoss Waterfall & Black Sand Beach',
      city: 'South Iceland',
      country: 'Iceland',
      caption: 'Glacial torrent plunging into black basalt volcanic amphitheaters',
    },
  ],

  // --- AFRICA & OCEANIA ---
  cairo: [
    {
      id: 'cairo-1',
      url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=2000&q=90',
      location: 'Great Pyramids of Giza & Sphinx',
      city: 'Cairo',
      country: 'Egypt',
      caption: 'Timeless limestone monuments standing proud over golden desert sands',
    },
    {
      id: 'cairo-2',
      url: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=2000&q=90',
      location: 'Nile River Felucca Sunset',
      city: 'Cairo',
      country: 'Egypt',
      caption: 'Traditional white sails drifting across golden amber river reflections',
    },
  ],
  capetown: [
    {
      id: 'capetown-1',
      url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=2000&q=90',
      location: 'Table Mountain & Camps Bay Coast',
      city: 'Cape Town',
      country: 'South Africa',
      caption: 'Flat-topped sandstone summit overlooking turquoise Atlantic surf',
    },
    {
      id: 'capetown-2',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=90',
      location: 'Cape of Good Hope & Boulders Beach',
      city: 'Cape Town',
      country: 'South Africa',
      caption: 'Dramatic coastal promontories where two mighty oceans converge',
    },
  ],
  sydney: [
    {
      id: 'sydney-1',
      url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=2000&q=90',
      location: 'Sydney Opera House & Harbour Bridge',
      city: 'Sydney',
      country: 'Australia',
      caption: 'Iconic sail architecture glowing under warm southern twilight skies',
    },
    {
      id: 'sydney-2',
      url: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=2000&q=90',
      location: 'Bondi to Bronte Coastal Cliffs',
      city: 'Sydney',
      country: 'Australia',
      caption: 'Crashing Pacific swells along golden sandstone headlands and ocean pools',
    },
  ],
};

/**
 * Universal Dynamic Scenario Matcher:
 * Supports ANY place in the entire world! If a custom city is passed,
 * it dynamically synthesizes high-definition panoramic scenario sets for that exact place!
 */
export function detectCityScenario(rawText: string): { key: string; cityName: string; slides: ScenarioSlide[] } {
  if (!rawText || !rawText.trim()) {
    return { key: 'himalayas', cityName: 'Himalayas', slides: WORLD_DESTINATION_SCENARIOS.himalayas };
  }

  const query = rawText.toLowerCase().trim();

  // 1. Check known world destination scenarios
  for (const [key, slides] of Object.entries(WORLD_DESTINATION_SCENARIOS)) {
    if (
      query.includes(key) ||
      slides.some((s) => query.includes(s.city.toLowerCase()) || query.includes(s.location.toLowerCase()))
    ) {
      return { key, cityName: slides[0].city, slides };
    }
  }

  // Multi-alias checking
  if (query.includes('himalaya') || query.includes('shimla') || query.includes('spiti') || query.includes('dharamshala') || query.includes('mountain') || query.includes('hill')) {
    return { key: 'himalayas', cityName: 'Himalayas', slides: WORLD_DESTINATION_SCENARIOS.himalayas };
  }
  if (query.includes('new york') || query.includes('newyork') || query.includes('nyc') || query.includes('manhattan') || query.includes('brooklyn')) {
    return { key: 'newyork', cityName: 'New York', slides: WORLD_DESTINATION_SCENARIOS.newyork };
  }
  if (query.includes('japan') || query.includes('zen') || query.includes('temple')) {
    return { key: 'kyoto', cityName: 'Kyoto', slides: WORLD_DESTINATION_SCENARIOS.kyoto };
  }
  if (query.includes('swiss') || query.includes('alps') || query.includes('zermatt') || query.includes('matterhorn')) {
    return { key: 'switzerland', cityName: 'Switzerland', slides: WORLD_DESTINATION_SCENARIOS.switzerland };
  }
  if (query.includes('greece') || query.includes('oia') || query.includes('aegean') || query.includes('cyclades')) {
    return { key: 'santorini', cityName: 'Santorini', slides: WORLD_DESTINATION_SCENARIOS.santorini };
  }
  if (query.includes('italy') || query.includes('colosseum') || query.includes('amalfi') || query.includes('positano')) {
    return { key: 'rome', cityName: 'Rome', slides: WORLD_DESTINATION_SCENARIOS.rome };
  }
  if (query.includes('spain') || query.includes('sagrada')) {
    return { key: 'barcelona', cityName: 'Barcelona', slides: WORLD_DESTINATION_SCENARIOS.barcelona };
  }
  if (query.includes('holland') || query.includes('netherlands')) {
    return { key: 'amsterdam', cityName: 'Amsterdam', slides: WORLD_DESTINATION_SCENARIOS.amsterdam };
  }
  if (query.includes('egypt') || query.includes('pyramid') || query.includes('nile')) {
    return { key: 'cairo', cityName: 'Cairo', slides: WORLD_DESTINATION_SCENARIOS.cairo };
  }
  if (query.includes('australia') || query.includes('opera house')) {
    return { key: 'sydney', cityName: 'Sydney', slides: WORLD_DESTINATION_SCENARIOS.sydney };
  }

  // 2. Extract City Name from natural language prompt if query contains multiple words
  let extractedCity = rawText.trim();
  const cleanTokens = extractedCity
    .replace(/(i want to travel|i have|suggest|plan a trip to|explore|visit|days in|under|\$|₹|€|£|[0-9]+k?)/gi, '')
    .trim();
  if (cleanTokens.length > 2) {
    extractedCity = cleanTokens.split(/[,&.]/)[0].trim();
  }

  // Capitalize properly
  const formattedCity = extractedCity
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  // 3. For ANY other place in the world: Generate dynamic 3-photo rotating scenario set!
  const dynamicSlides: ScenarioSlide[] = [
    {
      id: `dynamic-${formattedCity.toLowerCase()}-1`,
      url: `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=90`,
      location: `${formattedCity} Panoramic View`,
      city: formattedCity,
      country: 'Global Travel Destination',
      caption: `Scenic landscape and architectural landmark views of ${formattedCity}`,
    },
    {
      id: `dynamic-${formattedCity.toLowerCase()}-2`,
      url: `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=90`,
      location: `${formattedCity} Historic Center & Coast`,
      city: formattedCity,
      country: 'Global Travel Destination',
      caption: `Golden hour sunset illuminating the evocative vistas of ${formattedCity}`,
    },
    {
      id: `dynamic-${formattedCity.toLowerCase()}-3`,
      url: `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=90`,
      location: `${formattedCity} Highlands & Horizon`,
      city: formattedCity,
      country: 'Global Travel Destination',
      caption: `Stunning topography and vibrant natural surroundings in ${formattedCity}`,
    },
  ];

  return { key: formattedCity.toLowerCase(), cityName: formattedCity, slides: dynamicSlides };
}
