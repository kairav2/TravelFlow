import { createClient } from '@supabase/supabase-js';
import { DESTINATIONS } from '../data/destinations.js';

const getEnv = (key) => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch {}
  try {
    if (!envKey && typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch {}
  return '';
};

const getLocalItem = (key) => {
  if (typeof localStorage !== 'undefined') {
    try {
      return localStorage.getItem(key) || '';
    } catch {}
  }
  return '';
};

export function getSupabaseUrl() {
  return getEnv('VITE_SUPABASE_URL') || getLocalItem('travelflow_supabase_url') || '';
}

export function getSupabaseAnonKey() {
  return getEnv('VITE_SUPABASE_ANON_KEY') || getLocalItem('travelflow_supabase_anon_key') || '';
}

export function setCustomSupabaseCredentials(url, key) {
  if (typeof localStorage === 'undefined') return;
  try {
    if (url) {
      localStorage.setItem('travelflow_supabase_url', url.trim());
    } else {
      localStorage.removeItem('travelflow_supabase_url');
    }
    if (key) {
      localStorage.setItem('travelflow_supabase_anon_key', key.trim());
    } else {
      localStorage.removeItem('travelflow_supabase_anon_key');
    }
    // Invalidate cached client instance
    supabaseInstance = null;
  } catch {}
}

let supabaseInstance = null;
let lastUsedUrl = null;

export function isSupabaseConfigured() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return Boolean(
    url && 
    key && 
    url.startsWith('https://') &&
    url.includes('.supabase.co')
  );
}

export function getSupabase() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseInstance || lastUsedUrl !== url) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      lastUsedUrl = url;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      supabaseInstance = null;
    }
  }
  return supabaseInstance;
}

/**
 * Live test of Supabase connection and table readiness
 */
export async function testSupabaseConnection(urlInput = null, keyInput = null) {
  const url = (urlInput || getSupabaseUrl()).trim();
  const key = (keyInput || getSupabaseAnonKey()).trim();

  if (!url || !key) {
    return {
      ok: false,
      message: 'Please provide both Supabase Project URL and Anon Public Key.'
    };
  }

  if (!url.startsWith('https://') || !url.includes('.supabase.co')) {
    return {
      ok: false,
      message: 'URL must follow the format: https://<project-ref>.supabase.co'
    };
  }

  try {
    const client = createClient(url, key);
    // Check if destinations table is accessible
    const { data, error } = await client.from('destinations').select('id').limit(1);

    if (error) {
      // Postgres error 42P01 is undefined_table
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return {
          ok: true,
          needsSchema: true,
          message: '✓ Connected to Supabase! (Tables not found yet — please run supabase_schema.sql in the SQL Editor).'
        };
      }
      return {
        ok: false,
        message: `Supabase returned error: ${error.message} (${error.code || 'Unauthorized'})`
      };
    }

    return {
      ok: true,
      needsSchema: false,
      message: `✓ Connected to Supabase! Live database verified (${data ? data.length : 0} rows found).`
    };
  } catch (err) {
    return {
      ok: false,
      message: `Connection failed: ${err.message}`
    };
  }
}

// ============================================================================
// Local Storage Fallback Data Store (Mirrors Supabase Tables with Persistence)
// ============================================================================
const STORAGE_KEYS = {
  DESTINATIONS: 'travelflow_db_destinations',
  TRIPS: 'travelflow_db_trips',
  STAYS: 'travelflow_db_stays',
  TRANSITS: 'travelflow_db_transits',
  BOOKINGS: 'travelflow_db_bookings',
  INQUIRIES: 'travelflow_db_inquiries'
};

const memoryStore = {};

function getLocalData(key, defaultVal = []) {
  if (typeof localStorage === 'undefined') {
    return memoryStore[key] || defaultVal;
  }
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocalData(key, data) {
  if (typeof localStorage === 'undefined') {
    memoryStore[key] = data;
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }
}

// Initialize seed data if not present
export function initLocalDatabase() {
  const existingDest = getLocalData(STORAGE_KEYS.DESTINATIONS, null);
  if (!existingDest || existingDest.length === 0) {
    setLocalData(STORAGE_KEYS.DESTINATIONS, DESTINATIONS);
  }

  const existingBookings = getLocalData(STORAGE_KEYS.BOOKINGS, null);
  if (!existingBookings) {
    setLocalData(STORAGE_KEYS.BOOKINGS, [
      {
        id: 'b-101',
        guestName: 'Aarav Sharma',
        guestPhone: '+91 98201 44521',
        stayName: 'Kutch Desert Hearth Homestay',
        checkIn: '2026-10-24',
        checkOut: '2026-10-27',
        nights: 3,
        totalAmount: 7350,
        status: 'Pending',
        dateRequested: '15 mins ago'
      },
      {
        id: 'b-102',
        guestName: 'Priya Iyer',
        guestPhone: '+91 98450 11234',
        stayName: 'Kutch Desert Hearth Homestay',
        checkIn: '2026-11-02',
        checkOut: '2026-11-05',
        nights: 3,
        totalAmount: 7350,
        status: 'Confirmed',
        dateRequested: 'Yesterday'
      }
    ]);
  }

  const existingInquiries = getLocalData(STORAGE_KEYS.INQUIRIES, null);
  if (!existingInquiries) {
    setLocalData(STORAGE_KEYS.INQUIRIES, [
      {
        id: 'inq-1',
        guestName: 'Pooja Dave',
        location: 'Ahmedabad',
        text: 'Namaste Ramesh Bhai, kya 25 Oct ko 2 bhunga available hain? Hum 4 log hain.',
        time: '1 hour ago'
      }
    ]);
  }
}

// Universal Local Storage CRUD helpers
export const localStore = {
  get: getLocalData,
  set: setLocalData,
  keys: STORAGE_KEYS
};
