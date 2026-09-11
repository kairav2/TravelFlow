-- ============================================================================
-- TravelFlow Supabase Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ============================================================================

-- 1. DESTINATIONS TABLE
CREATE TABLE IF NOT EXISTS public.destinations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT,
  tagline TEXT,
  description TEXT,
  hero_image TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  weather JSONB DEFAULT '{}'::jsonb,
  best_season TEXT,
  ideal_days INTEGER DEFAULT 4,
  itinerary_days JSONB DEFAULT '[]'::jsonb,
  stays JSONB DEFAULT '[]'::jsonb,
  transits JSONB DEFAULT '{}'::jsonb,
  dining JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TRIPS TABLE (Generated Itineraries)
CREATE TABLE IF NOT EXISTS public.trips (
  id TEXT PRIMARY KEY,
  destination_id TEXT REFERENCES public.destinations(id) ON DELETE SET NULL,
  destination_name TEXT,
  source_city TEXT,
  start_date TEXT,
  end_date TEXT,
  travelers INTEGER DEFAULT 2,
  budget NUMERIC,
  pace TEXT DEFAULT 'balanced',
  styles JSONB DEFAULT '[]'::jsonb,
  trip_summary TEXT,
  generated_itinerary JSONB DEFAULT '[]'::jsonb,
  budget_breakdown JSONB DEFAULT '{}'::jsonb,
  recommended_transits JSONB DEFAULT '[]'::jsonb,
  recommended_stays JSONB DEFAULT '[]'::jsonb,
  dining_recommendations JSONB DEFAULT '[]'::jsonb,
  travel_tips JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BOOKINGS TABLE (Operator Studio & Host Confirmations)
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  guest_name TEXT NOT NULL,
  guest_phone TEXT,
  stay_name TEXT NOT NULL,
  check_in TEXT,
  check_out TEXT,
  nights INTEGER DEFAULT 1,
  total_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Declined'
  date_requested TEXT DEFAULT 'Just now',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INQUIRIES TABLE (WhatsApp Concierge & Homestay Messages)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  guest_name TEXT NOT NULL,
  location TEXT,
  text TEXT NOT NULL,
  time TEXT DEFAULT 'Just now',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Allows public access for prototype testing with anon key
-- ============================================================================

ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read and write for the TravelFlow client
CREATE POLICY "Allow public read destinations" ON public.destinations FOR SELECT USING (true);
CREATE POLICY "Allow public write destinations" ON public.destinations FOR ALL USING (true);

CREATE POLICY "Allow public read trips" ON public.trips FOR SELECT USING (true);
CREATE POLICY "Allow public write trips" ON public.trips FOR ALL USING (true);

CREATE POLICY "Allow public read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow public write bookings" ON public.bookings FOR ALL USING (true);

CREATE POLICY "Allow public read inquiries" ON public.inquiries FOR SELECT USING (true);
CREATE POLICY "Allow public write inquiries" ON public.inquiries FOR ALL USING (true);

-- ============================================================================
-- SEED SAMPLE DESTINATIONS (Goa, Udaipur, Kutch, Jibhi)
-- ============================================================================

INSERT INTO public.destinations (id, name, state, tagline, description, hero_image, ideal_days)
VALUES 
  ('goa', 'Goa', 'Goa', 'Tropical coastline, Portuguese heritage & beach serenity', 'Sun-kissed Arabian Sea beaches, historic colonial forts, and tranquil backwaters.', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', 4),
  ('udaipur', 'Udaipur', 'Rajasthan', 'City of Lakes, royal palaces & romantic sunsets', 'Majestic Mewar architecture nestled around serene Lake Pichola.', 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80', 3),
  ('kutch', 'Rann of Kutch', 'Gujarat', 'Endless white salt desert, moonlit dunes & Kutchi artisans', 'Endless salt flats, world-renowned embroidery, and desert hearth homestays.', 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80', 3),
  ('jibhi', 'Jibhi Valley', 'Himachal Pradesh', 'Alpine pine forests, riverstone cottages & freshwater streams', 'Hidden Himalayan hamlet with gushing rivers and cedar trails.', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80', 4)
ON CONFLICT (id) DO NOTHING;
