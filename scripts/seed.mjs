import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:odoo@159@localhost:5432/globetrotter_db',
});

const destinations = [
  {
    name: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    description: 'A dazzling ultra-modern metropolis blending neon-lit skyscrapers with historic Shinto shrines and world-class culinary innovation.',
    image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    cost_index: 'moderate',
    avg_daily_cost: 140.00,
    currency: 'JPY',
    latitude: 35.6762,
    longitude: 139.6503,
    popularity_score: 98,
    best_time_to_visit: 'March - May, September - November',
    activities: [
      { name: 'Shibuya Crossing & Sky Observatory Tour', category: 'sightseeing', description: 'Experience the world’s busiest pedestrian intersection from 230m above the city skyline.', cost: 25.00, duration_hours: 2.0, rating: 4.9, location_name: 'Shibuya Sky' },
      { name: 'Tsukiji Outer Market Culinary Safari', category: 'food_tour', description: 'Sample fresh sashimi, wagyu skewers, tamagoyaki, and matcha delicacies guided by local foodies.', cost: 65.00, duration_hours: 3.0, rating: 4.8, location_name: 'Tsukiji Market' },
      { name: 'Senso-ji Temple & Asakusa Rickshaw Ride', category: 'culture', description: 'Step back in time at Tokyo’s oldest Buddhist temple followed by a scenic traditional rickshaw ride.', cost: 45.00, duration_hours: 2.5, rating: 4.7, location_name: 'Asakusa' },
      { name: 'Shinjuku Neon Nightlife & Izakaya Crawl', category: 'nightlife', description: 'Navigate Golden Gai and Omoide Yokocho for yakitori, craft sake, and vibrant local tavern culture.', cost: 55.00, duration_hours: 3.5, rating: 4.9, location_name: 'Golden Gai' },
    ]
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    continent: 'Asia',
    description: 'The cultural soul of Japan, renowned for thousands of classical Buddhist temples, gardens, imperial palaces, and traditional wooden geisha districts.',
    image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    cost_index: 'moderate',
    avg_daily_cost: 125.00,
    currency: 'JPY',
    latitude: 35.0116,
    longitude: 135.7681,
    popularity_score: 94,
    best_time_to_visit: 'April - May, October - November',
    activities: [
      { name: 'Fushimi Inari 10,000 Torii Gates Hike', category: 'adventure', description: 'Hike through mystical mountain paths lined with vibrant vermilion Torii gates with scenic Kyoto views.', cost: 0.00, duration_hours: 3.0, rating: 4.9, location_name: 'Fushimi Inari' },
      { name: 'Arashiyama Bamboo Forest & Monkey Park', category: 'nature', description: 'Wander towering emerald bamboo stalks and meet wild Japanese macaques on Mount Iwatayama.', cost: 15.00, duration_hours: 2.5, rating: 4.8, location_name: 'Arashiyama' },
      { name: 'Traditional Uji Matcha Tea Ceremony', category: 'culture', description: 'Master authentic chado etiquette in a historic centuries-old teahouse in Gion.', cost: 40.00, duration_hours: 1.5, rating: 4.9, location_name: 'Gion District' },
    ]
  },
  {
    name: 'Paris',
    country: 'France',
    continent: 'Europe',
    description: 'The City of Light captivates with timeless Haussmannian boulevards, iconic monuments, world-defining art museums, and bohemian sidewalk bistros.',
    image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    cost_index: 'luxury',
    avg_daily_cost: 185.00,
    currency: 'EUR',
    latitude: 48.8566,
    longitude: 2.3522,
    popularity_score: 99,
    best_time_to_visit: 'June - August, September - October',
    activities: [
      { name: 'Louvre Museum Masterpieces with Art Historian', category: 'culture', description: 'Skip the line to discover the Mona Lisa, Venus de Milo, and French Renaissance treasures.', cost: 70.00, duration_hours: 3.0, rating: 4.9, location_name: 'Musée du Louvre' },
      { name: 'Sunset Seine River Cruise with Champagne', category: 'sightseeing', description: 'Glide past Notre-Dame, the illuminated Eiffel Tower, and historic bridges under twilight.', cost: 50.00, duration_hours: 1.5, rating: 4.8, location_name: 'Pont Neuf' },
      { name: 'Montmartre Secret Bakery & Pastry Walk', category: 'food_tour', description: 'Taste warm artisanal croissants, delicate macarons, cheese pairings, and Parisian baguettes.', cost: 60.00, duration_hours: 2.5, rating: 4.9, location_name: 'Montmartre' },
      { name: 'Eiffel Tower Summit Twilight Access', category: 'sightseeing', description: 'Elevate to the 276-meter summit for panoramic sunset vistas across the Paris skyline.', cost: 42.00, duration_hours: 2.0, rating: 4.7, location_name: 'Champ de Mars' },
    ]
  },
  {
    name: 'Rome',
    country: 'Italy',
    continent: 'Europe',
    description: 'An open-air living museum where 3,000 years of globally influential art, Roman imperial architecture, and vibrant piazza life coexist.',
    image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    cost_index: 'moderate',
    avg_daily_cost: 135.00,
    currency: 'EUR',
    latitude: 41.9028,
    longitude: 12.4964,
    popularity_score: 97,
    best_time_to_visit: 'April - June, September - October',
    activities: [
      { name: 'Colosseum Underground & Roman Forum VIP', category: 'culture', description: 'Walk where gladiators prepared and explore the civic epicenter of Ancient Rome.', cost: 65.00, duration_hours: 3.5, rating: 4.9, location_name: 'Piazza del Colosseo' },
      { name: 'Trastevere Sunset Food & Wine Journey', category: 'food_tour', description: 'Savor handmade cacio e pepe, supplì, Roman street pizza, and fine Chianti wines.', cost: 75.00, duration_hours: 3.0, rating: 4.9, location_name: 'Trastevere' },
      { name: 'Vatican Museums & Sistine Chapel Early Entry', category: 'sightseeing', description: 'Marvel at Michelangelo’s ceiling frescoes before public crowds enter.', cost: 80.00, duration_hours: 3.0, rating: 4.8, location_name: 'Vatican City' },
    ]
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    continent: 'Asia',
    description: 'An enchanting tropical paradise of terraced emerald rice paddies, spiritual volcanic temples, world-class surf breaks, and restorative wellness retreats.',
    image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    cost_index: 'budget',
    avg_daily_cost: 65.00,
    currency: 'IDR',
    latitude: -8.4095,
    longitude: 115.1889,
    popularity_score: 96,
    best_time_to_visit: 'May - September',
    activities: [
      { name: 'Mount Batur Sunrise Volcanic Trek', category: 'adventure', description: 'Ascend an active volcano in pre-dawn darkness for breathtaking crater sunrise views.', cost: 45.00, duration_hours: 5.0, rating: 4.8, location_name: 'Kintamani' },
      { name: 'Ubud Rice Terraces & Jungle Swing', category: 'nature', description: 'Swing high above cascading Tegallalang rice paddies and explore organic coffee plantations.', cost: 30.00, duration_hours: 3.0, rating: 4.7, location_name: 'Tegallalang' },
      { name: 'Uluwatu Cliffside Temple & Kecak Fire Dance', category: 'culture', description: 'Witness traditional Balinese chanting and dancing against dramatic Indian Ocean cliff sunsets.', cost: 25.00, duration_hours: 2.5, rating: 4.9, location_name: 'Uluwatu' },
    ]
  },
  {
    name: 'New York City',
    country: 'United States',
    continent: 'North America',
    description: 'The city that never sleeps, powered by legendary Broadway theatre, towering architectural marvels, dynamic neighborhoods, and unmatched energy.',
    image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    cost_index: 'luxury',
    avg_daily_cost: 230.00,
    currency: 'USD',
    latitude: 40.7128,
    longitude: -74.0060,
    popularity_score: 98,
    best_time_to_visit: 'April - June, September - November',
    activities: [
      { name: 'High Line & Chelsea Market Architectural Walk', category: 'sightseeing', description: 'Stroll an elevated rail-park above Manhattan streets followed by gourmet artisan tastings.', cost: 35.00, duration_hours: 2.5, rating: 4.8, location_name: 'Chelsea' },
      { name: 'Summit One Vanderbilt Immersive Skydeck', category: 'sightseeing', description: 'Multi-sensory mirror art installations overlooking the Chrysler and Empire State Buildings.', cost: 46.00, duration_hours: 2.0, rating: 4.9, location_name: 'Midtown East' },
      { name: 'Greenwich Village Historic Speakeasy Crawl', category: 'nightlife', description: 'Discover hidden 1920s Prohibition-era cocktail lounges and live jazz basements.', cost: 70.00, duration_hours: 3.0, rating: 4.9, location_name: 'Greenwich Village' },
    ]
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    continent: 'Europe',
    description: 'A vibrant Mediterranean cosmopolitan hub renowned for Antoni Gaudí’s surreal modernist architecture, sun-kissed beaches, and lively tapas culture.',
    image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    cost_index: 'moderate',
    avg_daily_cost: 130.00,
    currency: 'EUR',
    latitude: 41.3879,
    longitude: 2.1699,
    popularity_score: 95,
    best_time_to_visit: 'May - June, September - October',
    activities: [
      { name: 'Sagrada Família Fast-Track Tower Access', category: 'culture', description: 'Marvel at Gaudí’s masterpiece basilica interior bathed in kaleidoscopic stained glass reflections.', cost: 45.00, duration_hours: 2.0, rating: 4.9, location_name: 'Eixample' },
      { name: 'El Born Tapas, Jamón & Sangria Workshop', category: 'food_tour', description: 'Taste Iberian ham, patatas bravas, Catalan cheeses, and craft your own authentic sangria.', cost: 55.00, duration_hours: 3.0, rating: 4.8, location_name: 'El Born' },
      { name: 'Park Güell Panoramic Garden Tour', category: 'sightseeing', description: 'Wander whimsical mosaic terraces overlooking the Mediterranean Sea and skyline.', cost: 20.00, duration_hours: 2.0, rating: 4.7, location_name: 'Gràcia' },
    ]
  },
  {
    name: 'London',
    country: 'United Kingdom',
    continent: 'Europe',
    description: 'A timeless global metropolis where 2,000 years of royal heritage meets avant-garde arts, sprawling Royal Parks, and Michelin-starred dining.',
    image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    cost_index: 'luxury',
    avg_daily_cost: 200.00,
    currency: 'GBP',
    latitude: 51.5074,
    longitude: -0.1278,
    popularity_score: 97,
    best_time_to_visit: 'May - September',
    activities: [
      { name: 'Tower of London & Crown Jewels Tour', category: 'culture', description: 'Uncover gruesome medieval history guided by Yeoman Warders and see royal ceremonial crowns.', cost: 40.00, duration_hours: 2.5, rating: 4.8, location_name: 'Tower Hill' },
      { name: 'Borough Market Artisanal Street Food Trail', category: 'food_tour', description: 'Feast on Scotch eggs, truffle pasta, artisan cheeses, and freshly baked pastries.', cost: 50.00, duration_hours: 2.0, rating: 4.9, location_name: 'Southwark' },
      { name: 'London Eye Twilight Champagne Pod', category: 'sightseeing', description: '360-degree panoramic glass capsule views of Big Ben, Parliament, and St. Paul’s Cathedral.', cost: 48.00, duration_hours: 1.0, rating: 4.7, location_name: 'South Bank' },
    ]
  },
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    continent: 'Middle East',
    description: 'A futuristic desert wonder of record-breaking skyscrapers, opulent luxury resorts, man-made island archipelagos, and ancient golden souks.',
    image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    cost_index: 'luxury',
    avg_daily_cost: 220.00,
    currency: 'AED',
    latitude: 25.2048,
    longitude: 55.2708,
    popularity_score: 93,
    best_time_to_visit: 'November - March',
    activities: [
      { name: 'Desert Safari Dune Bashing & Bedouin Camp', category: 'adventure', description: 'Thrilling 4x4 dune rides, sandboarding, camel rides, and BBQ dinner under starry desert skies.', cost: 75.00, duration_hours: 6.0, rating: 4.9, location_name: 'Lahbab Dunes' },
      { name: 'Burj Khalifa 148th Floor Sky Lounge Access', category: 'sightseeing', description: 'Stand at the peak of human engineering with privileged panoramic views across the Arabian Gulf.', cost: 120.00, duration_hours: 2.0, rating: 4.8, location_name: 'Downtown Dubai' },
      { name: 'Dubai Marina Luxury Yacht Cruise', category: 'sightseeing', description: 'Cruise past Bluewaters Island and Ain Dubai with live BBQ and refreshing mocktails.', cost: 85.00, duration_hours: 3.0, rating: 4.7, location_name: 'Dubai Marina' },
    ]
  },
  {
    name: 'Reykjavik',
    country: 'Iceland',
    continent: 'Europe',
    description: 'The world’s northernmost capital, gateway to dramatic cascading waterfalls, geothermal mineral lagoons, glaciers, and ethereal Northern Lights.',
    image_url: 'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=1200&q=80',
    cost_index: 'luxury',
    avg_daily_cost: 210.00,
    currency: 'ISK',
    latitude: 64.1466,
    longitude: -21.9426,
    popularity_score: 91,
    best_time_to_visit: 'September - March (Aurora), June - August (Midnight Sun)',
    activities: [
      { name: 'Golden Circle & Geysir Geothermal Expedition', category: 'nature', description: 'Witness erupting geysers, the mighty Gullfoss waterfall, and tectonic rift at Thingvellir.', cost: 95.00, duration_hours: 7.5, rating: 4.9, location_name: 'Golden Circle' },
      { name: 'Blue Lagoon Geothermal Spa & Silica Mask', category: 'adventure', description: 'Unwind in soothing 38°C mineral-rich azure waters surrounded by volcanic black lava fields.', cost: 85.00, duration_hours: 3.5, rating: 4.8, location_name: 'Grindavík' },
      { name: 'Northern Lights Wilderness Chase', category: 'nature', description: 'Track magical dancing green Aurora Borealis ribbons away from city light pollution.', cost: 75.00, duration_hours: 4.0, rating: 4.7, location_name: 'Thingvellir' },
    ]
  },
  {
    name: 'Cape Town',
    country: 'South Africa',
    continent: 'Africa',
    description: 'A scenic coastal jewel framed by iconic Table Mountain, dramatic Atlantic coastlines, vibrant Cape Malay culture, and nearby historic vineyards.',
    image_url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80',
    cost_index: 'budget',
    avg_daily_cost: 75.00,
    currency: 'ZAR',
    latitude: -33.9249,
    longitude: 18.4241,
    popularity_score: 92,
    best_time_to_visit: 'November - March',
    activities: [
      { name: 'Table Mountain Cable Car & Peak Hike', category: 'adventure', description: 'Ascend in a rotating cable car to the flat-topped summit for breathtaking 360-degree ocean views.', cost: 30.00, duration_hours: 3.0, rating: 4.9, location_name: 'Table Mountain National Park' },
      { name: 'Cape Peninsula & Boulders Beach Penguins', category: 'nature', description: 'Visit the Cape of Good Hope and swim alongside endangered African penguin colonies.', cost: 65.00, duration_hours: 6.0, rating: 4.9, location_name: 'Simon’s Town' },
      { name: 'Stellenbosch Wine Tasting & Cellar Tour', category: 'food_tour', description: 'Sample world-class Pinotage and Chenin Blanc wines paired with gourmet artisan cheeses.', cost: 60.00, duration_hours: 5.0, rating: 4.8, location_name: 'Stellenbosch' },
    ]
  },
  {
    name: 'Bangkok',
    country: 'Thailand',
    continent: 'Asia',
    description: 'A sensory explosion of ornate golden royal temples, bustling canal networks, legendary street food alleys, and rooftop cocktail lounges.',
    image_url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
    cost_index: 'budget',
    avg_daily_cost: 55.00,
    currency: 'THB',
    latitude: 13.7563,
    longitude: 100.5018,
    popularity_score: 96,
    best_time_to_visit: 'November - February',
    activities: [
      { name: 'Grand Palace & Wat Pho Reclining Buddha', category: 'culture', description: 'Marvel at Thai royal heritage and the colossal 46-meter gold-leaf reclining Buddha statue.', cost: 35.00, duration_hours: 3.0, rating: 4.8, location_name: 'Rattanakosin' },
      { name: 'Midnight Tuk-Tuk Street Food Adventure', category: 'food_tour', description: 'Zip through alleys for Michelin-guide Pad Thai, roasted duck noodles, and mango sticky rice.', cost: 45.00, duration_hours: 3.5, rating: 4.9, location_name: 'Chinatown' },
      { name: 'Damnoen Saduak Floating Market Longtail Boat', category: 'sightseeing', description: 'Paddle through colorful canals brimming with boats selling fresh fruits and noodles.', cost: 40.00, duration_hours: 4.5, rating: 4.7, location_name: 'Ratchaburi' },
    ]
  }
];

async function seed() {
  console.log('🚀 Starting GlobeTrotter Database Seeding...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Insert Destinations & Activities
    console.log('🌍 Seeding Destinations & Curated Activities...');
    for (const dest of destinations) {
      const destRes = await client.query(
        `INSERT INTO destinations 
          (name, country, continent, description, image_url, cost_index, avg_daily_cost, currency, latitude, longitude, popularity_score, best_time_to_visit)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT DO NOTHING
         RETURNING id`,
        [dest.name, dest.country, dest.continent, dest.description, dest.image_url, dest.cost_index, dest.avg_daily_cost, dest.currency, dest.latitude, dest.longitude, dest.popularity_score, dest.best_time_to_visit]
      );

      let cityId = destRes.rows[0]?.id;
      if (!cityId) {
        const existing = await client.query('SELECT id FROM destinations WHERE name = $1', [dest.name]);
        cityId = existing.rows[0]?.id;
      }

      if (cityId && dest.activities) {
        for (const act of dest.activities) {
          await client.query(
            `INSERT INTO activities 
              (city_id, name, category, description, cost, duration_hours, rating, location_name)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT DO NOTHING`,
            [cityId, act.name, act.category, act.description, act.cost, act.duration_hours, act.rating, act.location_name]
          );
        }
      }
    }

    // 2. Ensure a default demo traveler exists
    console.log('👤 Checking demo user...');
    let userRes = await client.query('SELECT id FROM users WHERE email = $1', ['traveler@globetrotter.io']);
    let userId;
    if (userRes.rows.length === 0) {
      const newUser = await client.query(
        `INSERT INTO users (name, email, role, is_verified, preferred_currency) 
         VALUES ('Alex Rivera', 'traveler@globetrotter.io', 'traveler', TRUE, 'USD') 
         RETURNING id`
      );
      userId = newUser.rows[0].id;
    } else {
      userId = userRes.rows[0].id;
    }

    // 3. Create Sample Demo Multi-City Trip if not exists
    console.log('✈️ Checking demo multi-city trip...');
    const tripCheck = await client.query('SELECT id FROM trips WHERE share_code = $1', ['japan-autumn-escape-2026']);
    if (tripCheck.rows.length === 0) {
      const tripRes = await client.query(
        `INSERT INTO trips 
          (user_id, title, description, cover_image_url, start_date, end_date, total_budget, currency, is_public, share_code, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id`,
        [
          userId,
          'Japan Autumn Odyssey: Tokyo to Kyoto',
          'A two-week curated journey across Japan exploring futuristic neon cityscapes, ancient temples, tea ceremonies, and mountain hikes.',
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
          '2026-10-10',
          '2026-10-24',
          3500.00,
          'USD',
          true,
          'japan-autumn-escape-2026',
          'planning'
        ]
      );
      const tripId = tripRes.rows[0].id;

      // Get Tokyo and Kyoto city IDs
      const tokyo = await client.query("SELECT id FROM destinations WHERE name = 'Tokyo'");
      const kyoto = await client.query("SELECT id FROM destinations WHERE name = 'Kyoto'");

      if (tokyo.rows[0] && kyoto.rows[0]) {
        // Stop 1: Tokyo
        const stop1 = await client.query(
          `INSERT INTO trip_stops (trip_id, city_id, stop_order, arrival_date, departure_date, stay_cost_estimated, transport_cost_estimated, notes)
           VALUES ($1, $2, 1, '2026-10-10', '2026-10-17', 980.00, 150.00, 'Stay in Shinjuku near JR Yamanote Line')
           RETURNING id`,
          [tripId, tokyo.rows[0].id]
        );

        // Stop 2: Kyoto
        const stop2 = await client.query(
          `INSERT INTO trip_stops (trip_id, city_id, stop_order, arrival_date, departure_date, stay_cost_estimated, transport_cost_estimated, notes)
           VALUES ($1, $2, 2, '2026-10-17', '2026-10-24', 850.00, 260.00, 'Bullet Train (Shinkansen) from Tokyo. Stay in traditional Machiya in Gion.')
           RETURNING id`,
          [tripId, kyoto.rows[0].id]
        );

        // Add activities for Stop 1
        const tokyoActivities = await client.query('SELECT id, name, cost FROM activities WHERE city_id = $1 LIMIT 2', [tokyo.rows[0].id]);
        if (tokyoActivities.rows.length > 0) {
          await client.query(
            `INSERT INTO trip_activities (trip_stop_id, activity_id, custom_title, category, activity_date, start_time, end_time, cost, notes)
             VALUES ($1, $2, $3, 'sightseeing', '2026-10-11', '10:00', '12:30', $4, 'Pre-booked observatory tickets')`,
            [stop1.rows[0].id, tokyoActivities.rows[0].id, tokyoActivities.rows[0].name, tokyoActivities.rows[0].cost]
          );
        }

        // Add expenses
        await client.query(
          `INSERT INTO trip_expenses (trip_id, trip_stop_id, category, title, amount, expense_date, payment_method)
           VALUES 
            ($1, $2, 'stay', 'Shinjuku Hotel 7 Nights', 980.00, '2026-10-10', 'Card'),
            ($1, $2, 'transport', 'Suica Card Deposit & Top-Up', 50.00, '2026-10-10', 'Cash'),
            ($1, $3, 'transport', 'Tokyo-Kyoto Shinkansen Nozomi', 260.00, '2026-10-17', 'Card'),
            ($1, $3, 'stay', 'Gion Traditional Ryokan 7 Nights', 850.00, '2026-10-17', 'Card')`,
          [tripId, stop1.rows[0].id, stop2.rows[0].id]
        );
      }
    }

    await client.query('COMMIT');
    console.log('✅ Seeding completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
