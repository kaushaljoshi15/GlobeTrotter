export interface ConnectedCity {
  id?: number;
  name: string;
  country: string;
  continent: string;
  transitMode: string; // e.g. 'Vande Bharat Express', 'Shinkansen Bullet Train', 'SBB Panoramic Rail'
  transitDuration: string; // e.g. '1h 40m', '2h 15m'
  transitCost: number; // e.g. 25
  avgDailyCost: number;
  recommendedDays: number;
  hotelSuggestion: string;
  foodSuggestion?: string;
  imageUrl: string;
  popularSights: string[];
}

export interface CountryCorridor {
  country: string;
  flag: string;
  transitNetwork: string;
  primaryCurrencies: string;
  cities: ConnectedCity[];
}

export const COUNTRY_CORRIDORS: Record<string, CountryCorridor> = {
  india: {
    country: 'India',
    flag: '🇮🇳',
    transitNetwork: 'Indian Railways Vande Bharat & Heritage Luxury Rail',
    primaryCurrencies: 'INR / USD',
    cities: [
      {
        name: 'Delhi',
        country: 'India',
        continent: 'Asia',
        transitMode: 'Origin Hub / IGI Airport Express',
        transitDuration: 'Starting Point',
        transitCost: 0,
        avgDailyCost: 65,
        recommendedDays: 3,
        hotelSuggestion: 'The Imperial New Delhi / The Leela Palace Chanakyapuri',
        foodSuggestion: 'Old Delhi Karim\'s Kebabs, Chandni Chowk Paranthas & Butter Chicken',
        imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Qutub Minar & Iron Pillar', 'Humayun\'s Tomb Gardens', 'Red Fort & Chandni Chowk', 'India Gate Promenade'],
      },
      {
        name: 'Agra',
        country: 'India',
        continent: 'Asia',
        transitMode: 'Vande Bharat Semi-High Speed Express',
        transitDuration: '1h 40m from Delhi',
        transitCost: 20,
        avgDailyCost: 55,
        recommendedDays: 2,
        hotelSuggestion: 'The Oberoi Amarvilas (Direct Taj Mahal Views) / ITC Mughal',
        foodSuggestion: 'Authentic Mughlai Biryani, Bedmi Puri & Agra Panchhi Petha',
        imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Taj Mahal Golden Sunrise Tour', 'Agra Fort Red Sandstone Citadel', 'Mehtab Bagh Moonlight Garden Sunset'],
      },
      {
        name: 'Jaipur (Pink City)',
        country: 'India',
        continent: 'Asia',
        transitMode: 'Vande Bharat / Shatabdi Express',
        transitDuration: '3h 30m from Delhi / Agra',
        transitCost: 25,
        avgDailyCost: 60,
        recommendedDays: 3,
        hotelSuggestion: 'The Raj Palace Heritage Grand Haveli / Rambagh Palace',
        foodSuggestion: 'Dal Baati Churma at Chokhi Dhani, Rawat Pyaaz Kachori & Ghewar',
        imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Amber Fort Elephant Hilltop Ascent', 'Hawa Mahal Palace of Winds', 'City Palace & Jantar Mantar Observatory'],
      },
      {
        name: 'Udaipur (City of Lakes)',
        country: 'India',
        continent: 'Asia',
        transitMode: 'Vande Bharat / Royal Rajasthan Rail',
        transitDuration: '4h 30m from Jaipur',
        transitCost: 30,
        avgDailyCost: 75,
        recommendedDays: 3,
        hotelSuggestion: 'Taj Lake Palace on Lake Pichola / The Oberoi Udaivilas',
        foodSuggestion: 'Lakeside Rajasthani Thali at Ambrai & Gatte Ki Sabzi',
        imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Lake Pichola Sunset Luxury Boat Cruise', 'City Palace Museum & Courtyards', 'Bagore Ki Haveli Rajasthani Folk Dance'],
      },
      {
        name: 'Jodhpur (Blue City)',
        country: 'India',
        continent: 'Asia',
        transitMode: 'Vande Bharat / InterCity Superfast',
        transitDuration: '4h 00m from Jaipur',
        transitCost: 22,
        avgDailyCost: 50,
        recommendedDays: 2,
        hotelSuggestion: 'Umaid Bhawan Palace / RAAS Jodhpur Luxury Heritage',
        foodSuggestion: 'Jodhpuri Shahi Mirchi Vada, Mawa Kachori & Ker Sangri',
        imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Mehrangarh Fort Cliffside Ramparts', 'Jaswant Thada Royal Cenotaphs', 'Blue City Walking Tour & Stepwells'],
      },
      {
        name: 'Varanasi (Kashi Spiritual Hub)',
        country: 'India',
        continent: 'Asia',
        transitMode: 'Vande Bharat High-Speed Express',
        transitDuration: '6h 30m from Delhi / Agra',
        transitCost: 35,
        avgDailyCost: 45,
        recommendedDays: 3,
        hotelSuggestion: 'BrijRama Palace on Darbhanga Ghat / Taj Ganges',
        foodSuggestion: 'Banarasi Tamatar Chaat, Deena Kachori Jalebi, Malaiyyo & Kashi Paan',
        imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Dashashwamedh Ghat Evening Maha Aarti Boat Tour', 'Sunrise River Ganga Boat Meditation', 'Kashi Vishwanath Corridor', 'Sarnath Buddhist Deer Park'],
      },
      {
        name: 'Goa (Tropical Coast)',
        country: 'India',
        continent: 'Asia',
        transitMode: 'Vande Bharat / Konkan Scenic Coastal Express',
        transitDuration: 'Connecting Hub',
        transitCost: 40,
        avgDailyCost: 80,
        recommendedDays: 4,
        hotelSuggestion: 'Taj Exotica Resort & Spa Benaulim / W Goa Beachside Vagator',
        foodSuggestion: 'Goan Prawn Balchão, Fish Recheado at Martin\'s Corner & Bebinca',
        imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Dudhsagar 4-Tier Glacial Waterfalls Safari', 'Basilica of Bom Jesus Old Goa', 'Sunset Catamaran Yacht Cruise', 'Palolem & Anjuna Beaches'],
      },
      {
        name: 'Kerala (Munnar & Alleppey)',
        country: 'India',
        continent: 'Asia',
        transitMode: 'Vande Bharat / Scenic Western Ghats Express',
        transitDuration: 'Connecting Hub',
        transitCost: 35,
        avgDailyCost: 70,
        recommendedDays: 4,
        hotelSuggestion: 'Kumarakom Lake Resort / Luxury Private Backwater Houseboat',
        foodSuggestion: 'Karimeen Pollichathu, Kerala Banana Leaf Sadya & Appam with Stew',
        imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Alleppey Palm-Fringed Backwaters Private Houseboat Cruise', 'Munnar Tea Plantation Mist Trek', 'Fort Kochi Chinese Fishing Nets & Kathakali'],
      },
      {
        name: 'Rishikesh (Himalayan Yoga Sanctuary)',
        country: 'India',
        continent: 'Asia',
        transitMode: 'Vande Bharat Express to Dehradun/Haridwar',
        transitDuration: '4h 15m from Delhi',
        transitCost: 22,
        avgDailyCost: 50,
        recommendedDays: 3,
        hotelSuggestion: 'Ananda in the Himalayas / Aloha On The Ganges',
        foodSuggestion: 'Chotiwala Authentic Satvik Thali & Beatles Cafe Organic Smoothies',
        imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
        popularSights: ['White Water River Rafting on Holy Ganga', 'Beatles Ashram Meditation Sanctuary', 'Triveni Ghat Evening Maha Aarti', 'Shivpuri Cliff Jumping'],
      },
      {
        name: 'Kashmir (Srinagar & Gulmarg)',
        country: 'India',
        continent: 'Asia',
        transitMode: 'Vande Bharat to Katra / Direct Srinagar Air Link',
        transitDuration: 'Connecting Hub',
        transitCost: 55,
        avgDailyCost: 75,
        recommendedDays: 4,
        hotelSuggestion: 'The Khyber Himalayan Resort & Spa Gulmarg / Luxury Dal Lake Shikara Houseboat',
        foodSuggestion: 'Traditional Kashmiri Wazwan (Rogan Josh, Gushtaba) & Saffron Kahwa',
        imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Dal Lake Floating Flower Market & Shikara Ride', 'Gulmarg Gondola World 2nd Highest Cable Car', 'Pahalgam Betaab Valley Alpine Pine Meadows'],
      },
      {
        name: 'Manali & Himachal Peaks',
        country: 'India',
        continent: 'Asia',
        transitMode: 'Vande Bharat to Chandigarh + Mountain Expressway',
        transitDuration: 'Connecting Hub',
        transitCost: 30,
        avgDailyCost: 60,
        recommendedDays: 3,
        hotelSuggestion: 'The Himalayan Luxury Resort & Spa / Span Resort & Spa',
        foodSuggestion: 'Himachali Siddu with Pure Ghee, Trout Fish & Old Manali Momos',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Rohtang Pass Glacial Snow View', 'Solang Valley Paragliding Safari', 'Hidimba Devi 16th-Century Wooden Temple'],
      },
      {
        name: 'Mumbai (Maximum City)',
        country: 'India',
        continent: 'Asia',
        transitMode: 'Vande Bharat Express / Western Rail Superfast',
        transitDuration: 'Origin Hub',
        transitCost: 0,
        avgDailyCost: 95,
        recommendedDays: 3,
        hotelSuggestion: 'The Taj Mahal Palace Mumbai (Historic Heritage Wing) overlooking Gateway',
        foodSuggestion: 'Mumbai Vada Pav, Pav Bhaji at Sardar, Britannia & Co. Berry Pulao, Irani Chai',
        imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Gateway of India & Elephanta Island Caves Ferry', 'Marine Drive Queen\'s Necklace Golden Hour Sunset', 'Bandra Street Art & Bandstand Seaface'],
      },
    ],
  },
  japan: {
    country: 'Japan',
    flag: '🇯🇵',
    transitNetwork: 'JR Shinkansen & Kintetsu High-Speed Rail',
    primaryCurrencies: 'JPY / USD',
    cities: [
      {
        name: 'Tokyo',
        country: 'Japan',
        continent: 'Asia',
        transitMode: 'Origin Hub / Narita Express',
        transitDuration: 'Starting Point',
        transitCost: 0,
        avgDailyCost: 140,
        recommendedDays: 4,
        hotelSuggestion: 'Modern High-Rise in Shinjuku or Shibuya',
        foodSuggestion: 'Tsukiji Fresh Otoro Sashimi, Sukiyabashi Jiro Sushi & Wagyu Sukiyaki',
        imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Shibuya Sky 360°', 'Tsukiji Outer Market', 'TeamLab Planets', 'Senso-ji Temple'],
      },
      {
        name: 'Hakone',
        country: 'Japan',
        continent: 'Asia',
        transitMode: 'Odakyu Romancecar Express',
        transitDuration: '1h 15m from Tokyo',
        transitCost: 28,
        avgDailyCost: 160,
        recommendedDays: 2,
        hotelSuggestion: 'Traditional Onsen Ryokan with Mt. Fuji Views',
        foodSuggestion: 'Owakudani Black Mineral Onsen Eggs & Multi-Course Kaiseki',
        imageUrl: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Lake Ashi Pirate Cruise', 'Hakone Open-Air Museum', 'Owakudani Volcanic Valley'],
      },
      {
        name: 'Kyoto',
        country: 'Japan',
        continent: 'Asia',
        transitMode: 'Tokaido Shinkansen (Nozomi)',
        transitDuration: '2h 15m from Tokyo / Hakone',
        transitCost: 95,
        avgDailyCost: 125,
        recommendedDays: 4,
        hotelSuggestion: 'Historic Wooden Machiya or Gion Ryokan',
        foodSuggestion: 'Gion Ceremonial Matcha & Pontocho Alley Riverside Kaiseki Feast',
        imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Fushimi Inari Torii Gates', 'Arashiyama Bamboo Forest', 'Gion Tea Ceremony', 'Kinkaku-ji'],
      },
      {
        name: 'Nara',
        country: 'Japan',
        continent: 'Asia',
        transitMode: 'JR Miyakoji Rapid / Kintetsu Express',
        transitDuration: '45m from Kyoto',
        transitCost: 15,
        avgDailyCost: 90,
        recommendedDays: 1,
        hotelSuggestion: 'Boutique Garden Hotel near Nara Park',
        foodSuggestion: 'Nakatanidou Fresh Pounded Yomogi Mochi',
        imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Todai-ji Great Bronze Buddha', 'Nara Deer Sanctuary', 'Kasuga Taisha Lanterns'],
      },
      {
        name: 'Osaka',
        country: 'Japan',
        continent: 'Asia',
        transitMode: 'JR Special Rapid Service',
        transitDuration: '30m from Kyoto',
        transitCost: 12,
        avgDailyCost: 110,
        recommendedDays: 3,
        hotelSuggestion: 'Urban Design Hotel in Dotonbori / Namba',
        foodSuggestion: 'Dotonbori Takoyaki, Okonomiyaki & Shinsekai Kushikatsu',
        imageUrl: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Dotonbori Neon Food Street', 'Osaka Castle Gardens', 'Shinsekai Kushikatsu'],
      },
    ],
  },
  switzerland: {
    country: 'Switzerland',
    flag: '🇨🇭',
    transitNetwork: 'SBB & Glacier Express Scenic Rail',
    primaryCurrencies: 'CHF / EUR',
    cities: [
      {
        name: 'Zurich',
        country: 'Switzerland',
        continent: 'Europe',
        transitMode: 'Origin Hub / SBB Airport Link',
        transitDuration: 'Starting Point',
        transitCost: 0,
        avgDailyCost: 210,
        recommendedDays: 2,
        hotelSuggestion: 'Historic Old Town Hotel along Limmat River',
        foodSuggestion: 'Zürcher Geschnetzeltes with Rösti & Swiss Chocolate Sprüngli',
        imageUrl: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Lake Zurich Promenade', 'Altstadt Historic Quarter', 'Bahnhofstrasse'],
      },
      {
        name: 'Lucerne',
        country: 'Switzerland',
        continent: 'Europe',
        transitMode: 'SBB InterCity Direct',
        transitDuration: '45m from Zurich',
        transitCost: 25,
        avgDailyCost: 190,
        recommendedDays: 2,
        hotelSuggestion: 'Lakeside Chalet with Mount Pilatus Views',
        foodSuggestion: 'Lozärner Chügelipastete & Swiss Alpine Cheeses',
        imageUrl: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Chapel Bridge & Water Tower', 'Mount Pilatus Cogwheel Railway', 'Lake Lucerne Steamboat'],
      },
      {
        name: 'Interlaken',
        country: 'Switzerland',
        continent: 'Europe',
        transitMode: 'Luzern-Interlaken Scenic Express',
        transitDuration: '1h 50m from Lucerne',
        transitCost: 35,
        avgDailyCost: 195,
        recommendedDays: 3,
        hotelSuggestion: 'Alpine Mountain Lodge in Lauterbrunnen Valley',
        foodSuggestion: 'Traditional Swiss Cheese Fondue & Raclette',
        imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Jungfraujoch Top of Europe', 'Lauterbrunnen 72 Waterfalls', 'Harder Kulm Panorama'],
      },
      {
        name: 'Zermatt',
        country: 'Switzerland',
        continent: 'Europe',
        transitMode: 'Matterhorn Gotthard Bahn / Glacier Express',
        transitDuration: '2h 10m from Interlaken',
        transitCost: 65,
        avgDailyCost: 220,
        recommendedDays: 3,
        hotelSuggestion: 'Car-free Alpine Ski Chalet with Matterhorn Balcony',
        foodSuggestion: 'Valais Fondue & Fendant Alpine White Wine',
        imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Gornergrat Panoramic Rail', 'Matterhorn Glacier Paradise', 'Valais Cheese Fondue'],
      },
      {
        name: 'Geneva',
        country: 'Switzerland',
        continent: 'Europe',
        transitMode: 'SBB InterRegio along Lake Geneva',
        transitDuration: '3h 30m from Zermatt',
        transitCost: 70,
        avgDailyCost: 230,
        recommendedDays: 2,
        hotelSuggestion: 'Luxury Waterfront Suites overlooking Jet d\'Eau',
        foodSuggestion: 'Perch Fillets from Lake Geneva & Gruyère Gourmet Tasting',
        imageUrl: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Jet d\'Eau Water Fountain', 'Palais des Nations', 'Old Town Saint-Pierre'],
      },
    ],
  },
  italy: {
    country: 'Italy',
    flag: '🇮🇹',
    transitNetwork: 'Trenitalia Frecciarossa High-Speed Rail',
    primaryCurrencies: 'EUR / USD',
    cities: [
      {
        name: 'Rome',
        country: 'Italy',
        continent: 'Europe',
        transitMode: 'Origin Hub / Leonardo Express',
        transitDuration: 'Starting Point',
        transitCost: 0,
        avgDailyCost: 135,
        recommendedDays: 4,
        hotelSuggestion: 'Historic Palazzo near Pantheon & Piazza Navona',
        foodSuggestion: 'Classic Roman Cacio e Pepe, Carbonara & Artisan Pistacchio Gelato',
        imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Colosseum & Roman Forum', 'Vatican & Sistine Chapel', 'Trevi Fountain & Trastevere'],
      },
      {
        name: 'Florence',
        country: 'Italy',
        continent: 'Europe',
        transitMode: 'Frecciarossa 1000 High-Speed',
        transitDuration: '1h 30m from Rome',
        transitCost: 45,
        avgDailyCost: 140,
        recommendedDays: 3,
        hotelSuggestion: 'Renaissance Villa near Santa Maria del Fiore',
        foodSuggestion: 'Bistecca alla Fiorentina & Chianti Classico Wine',
        imageUrl: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Uffizi Gallery Masterpieces', 'Duomo Brunelleschi Dome', 'Ponte Vecchio Sunset'],
      },
      {
        name: 'Siena',
        country: 'Italy',
        continent: 'Europe',
        transitMode: 'Tuscan Regional Scenic Express',
        transitDuration: '1h 15m from Florence',
        transitCost: 18,
        avgDailyCost: 120,
        recommendedDays: 2,
        hotelSuggestion: 'Medieval Stone Guesthouse overlooking Piazza del Campo',
        foodSuggestion: 'Handmade Pici Pasta with Wild Boar Ragù & Panforte',
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Piazza del Campo', 'Siena Cathedral Marble Mosaics', 'Chianti Wine Country Safari'],
      },
      {
        name: 'Venice',
        country: 'Italy',
        continent: 'Europe',
        transitMode: 'Frecciarossa Direct to St. Lucia',
        transitDuration: '2h 05m from Florence',
        transitCost: 55,
        avgDailyCost: 180,
        recommendedDays: 3,
        hotelSuggestion: 'Grand Canal Palace with Private Gondola Dock',
        foodSuggestion: 'Venetian Cicchetti Tapas & Spritz at Cantina Do Mori',
        imageUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=600&q=80',
        popularSights: ['St. Mark\'s Basilica & Doge\'s Palace', 'Grand Canal Gondola Serenade', 'Rialto Bridge'],
      },
      {
        name: 'Positano (Amalfi)',
        country: 'Italy',
        continent: 'Europe',
        transitMode: 'High-Speed Rail to Salerno + Coastal Ferry',
        transitDuration: '3h from Rome / Florence',
        transitCost: 75,
        avgDailyCost: 220,
        recommendedDays: 3,
        hotelSuggestion: 'Cliffside Whitewashed Villa with Mediterranean Terrace',
        foodSuggestion: 'Fresh Scialatielli Seafood Pasta & Frozen Limoncello',
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Capri Island Boat Safari', 'Path of the Gods Cliff Trek', 'Ravello Villa Rufolo'],
      },
    ],
  },
  france: {
    country: 'France',
    flag: '🇫🇷',
    transitNetwork: 'SNCF TGV INOUI High-Speed Network',
    primaryCurrencies: 'EUR / USD',
    cities: [
      {
        name: 'Paris',
        country: 'France',
        continent: 'Europe',
        transitMode: 'Origin Hub / RER B Express',
        transitDuration: 'Starting Point',
        transitCost: 0,
        avgDailyCost: 185,
        recommendedDays: 4,
        hotelSuggestion: 'Boutique Designer Loft in Le Marais',
        foodSuggestion: 'Warm Croissants, Duck Confit in Saint-Germain & French Wine Tasting',
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Louvre Museum', 'Eiffel Tower Summit', 'Seine River Dinner Cruise', 'Montmartre'],
      },
      {
        name: 'Lyon',
        country: 'France',
        continent: 'Europe',
        transitMode: 'TGV INOUI High-Speed',
        transitDuration: '1h 55m from Paris',
        transitCost: 50,
        avgDailyCost: 130,
        recommendedDays: 2,
        hotelSuggestion: 'Historic Old Lyon (Vieux Lyon) Renaissance Guesthouse',
        foodSuggestion: 'Michelin Bouchon Lyonnais Quenelle & Saint-Marcellin Cheese',
        imageUrl: 'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Traboules Secret Passages', 'Basilique Notre Dame de Fourvière', 'Michelin Bouchon Dining'],
      },
      {
        name: 'Nice (French Riviera)',
        country: 'France',
        continent: 'Europe',
        transitMode: 'TGV Coastal Express',
        transitDuration: '4h 20m from Lyon / Paris',
        transitCost: 75,
        avgDailyCost: 175,
        recommendedDays: 3,
        hotelSuggestion: 'Belle Époque Hotel on Promenade des Anglais',
        foodSuggestion: 'Socca Chickpea Crêpes, Salade Niçoise & Côte de Provence Rosé',
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
        popularSights: ['Promenade des Anglais', 'Castle Hill Panoramic View', 'Monaco & Eze Day Trip'],
      },
    ],
  },
};

/**
 * Returns the matching country corridor key for a destination name or country
 */
export function getCountryCorridorKey(countryOrCity: string): string | null {
  const norm = countryOrCity.toLowerCase();
  if (
    norm.includes('india') ||
    norm.includes('delhi') ||
    norm.includes('agra') ||
    norm.includes('jaipur') ||
    norm.includes('udaipur') ||
    norm.includes('jodhpur') ||
    norm.includes('varanasi') ||
    norm.includes('goa') ||
    norm.includes('kerala') ||
    norm.includes('munnar') ||
    norm.includes('alleppey') ||
    norm.includes('rishikesh') ||
    norm.includes('manali') ||
    norm.includes('kashmir') ||
    norm.includes('srinagar') ||
    norm.includes('mumbai')
  ) {
    return 'india';
  }
  if (norm.includes('japan') || norm.includes('tokyo') || norm.includes('kyoto') || norm.includes('osaka') || norm.includes('nara') || norm.includes('hakone')) {
    return 'japan';
  }
  if (norm.includes('switzerland') || norm.includes('swiss') || norm.includes('zurich') || norm.includes('zermatt') || norm.includes('lucerne') || norm.includes('interlaken') || norm.includes('geneva')) {
    return 'switzerland';
  }
  if (norm.includes('italy') || norm.includes('rome') || norm.includes('florence') || norm.includes('venice') || norm.includes('positano') || norm.includes('amalfi') || norm.includes('siena')) {
    return 'italy';
  }
  if (norm.includes('france') || norm.includes('paris') || norm.includes('lyon') || norm.includes('nice') || norm.includes('marseille')) {
    return 'france';
  }
  return null;
}
