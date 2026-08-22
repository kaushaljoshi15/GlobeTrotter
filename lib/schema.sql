-- =========================================================
-- GLOBETROTTER - RELATIONAL DATABASE SCHEMA (PostgreSQL)
-- =========================================================

-- 1. USERS & AUTHENTICATION TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT,
    avatar_url TEXT,
    google_id VARCHAR(255),
    role VARCHAR(50) DEFAULT 'traveler',
    preferred_currency VARCHAR(10) DEFAULT 'USD',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. VERIFICATION CODES TABLE (OTP)
CREATE TABLE IF NOT EXISTS verification_codes (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. DESTINATIONS / CITIES CATALOG
CREATE TABLE IF NOT EXISTS destinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    continent VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    cost_index VARCHAR(50) DEFAULT 'moderate', -- 'budget', 'moderate', 'luxury'
    avg_daily_cost NUMERIC(10, 2) DEFAULT 120.00,
    currency VARCHAR(10) DEFAULT 'USD',
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    popularity_score INT DEFAULT 85,
    best_time_to_visit VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. CURATED CITY ACTIVITIES CATALOG
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    city_id INT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'sightseeing', 'food_tour', 'adventure', 'culture', 'nightlife', 'nature'
    description TEXT,
    image_url TEXT,
    cost NUMERIC(10, 2) DEFAULT 0.00,
    duration_hours NUMERIC(4, 1) DEFAULT 2.0,
    rating NUMERIC(3, 2) DEFAULT 4.8,
    location_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TRIPS TABLE
CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_budget NUMERIC(12, 2) DEFAULT 2000.00,
    currency VARCHAR(10) DEFAULT 'USD',
    is_public BOOLEAN DEFAULT TRUE,
    share_code VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'active', 'completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. TRIP STOPS (Multi-City Itinerary Destinations)
CREATE TABLE IF NOT EXISTS trip_stops (
    id SERIAL PRIMARY KEY,
    trip_id INT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    city_id INT NOT NULL REFERENCES destinations(id) ON DELETE RESTRICT,
    stop_order INT NOT NULL DEFAULT 1,
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    stay_cost_estimated NUMERIC(10, 2) DEFAULT 0.00,
    transport_cost_estimated NUMERIC(10, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. TRIP ACTIVITIES (Scheduled Activities in a Stop)
CREATE TABLE IF NOT EXISTS trip_activities (
    id SERIAL PRIMARY KEY,
    trip_stop_id INT NOT NULL REFERENCES trip_stops(id) ON DELETE CASCADE,
    activity_id INT REFERENCES activities(id) ON DELETE SET NULL,
    custom_title VARCHAR(255),
    category VARCHAR(100) DEFAULT 'sightseeing',
    activity_date DATE NOT NULL,
    start_time VARCHAR(20) DEFAULT '09:00',
    end_time VARCHAR(20) DEFAULT '11:00',
    cost NUMERIC(10, 2) DEFAULT 0.00,
    notes TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. TRIP EXPENSES (Itemized Expense Ledger for Budget Tracking)
CREATE TABLE IF NOT EXISTS trip_expenses (
    id SERIAL PRIMARY KEY,
    trip_id INT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    trip_stop_id INT REFERENCES trip_stops(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL, -- 'transport', 'stay', 'activities', 'meals', 'misc'
    title VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    expense_date DATE NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Card',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. USER SAVED DESTINATIONS (Wishlist)
CREATE TABLE IF NOT EXISTS user_saved_destinations (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destination_id INT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, destination_id)
);

-- =========================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_share_code ON trips(share_code);
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_city_id ON trip_stops(city_id);
CREATE INDEX IF NOT EXISTS idx_trip_activities_stop_id ON trip_activities(trip_stop_id);
CREATE INDEX IF NOT EXISTS idx_trip_expenses_trip_id ON trip_expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_city_id ON activities(city_id);
CREATE INDEX IF NOT EXISTS idx_destinations_continent ON destinations(continent);
CREATE INDEX IF NOT EXISTS idx_destinations_cost_index ON destinations(cost_index);
