import { getSupabase, localStore } from './supabaseClient.js';

/**
 * Generate portal deep link with pre-filled query parameters
 */
export function generatePortalDeepLink(item, portal, searchContext = {}) {
  const destination = searchContext.destination || item.destination || 'Goa';
  const source = searchContext.sourceCity || item.source || 'Mumbai';
  const checkIn = searchContext.startDate || '2026-10-01';
  const checkOut = searchContext.endDate || '2026-10-05';
  const guests = searchContext.travelers || 2;

  const enc = encodeURIComponent;

  switch (portal?.toLowerCase()) {
    case 'booking.com':
    case 'booking':
      return `https://www.booking.com/searchresults.html?ss=${enc(item.name || destination)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${guests}&no_rooms=1`;

    case 'agoda':
      return `https://www.agoda.com/search?text=${enc(item.name || destination)}&checkIn=${checkIn}&checkOut=${checkOut}&rooms=1&adults=${guests}`;

    case 'makemytrip':
    case 'mmt':
      if (item.transitType === 'flight' || item.type === 'flight') {
        return `https://www.makemytrip.com/flight/search?itinerary=${enc(source)}-${enc(destination)}-${checkIn}&tripType=O&paxType=A-${guests}_C-0_I-0`;
      }
      return `https://www.makemytrip.com/hotels/hotel-listing/?city=${enc(destination)}&checkin=${checkIn}&checkout=${checkOut}&roomStayQualifier=${guests}e0e`;

    case 'easemytrip':
      return `https://www.easemytrip.com/hotels/${enc(destination)}-hotels/?cin=${checkIn}&cout=${checkOut}&Rooms=1&pax=${guests}`;

    case 'irctc':
    case 'irctc rail connect':
      return `https://www.irctc.co.in/nget/train-search`;

    case 'confirmtkt':
      return `https://www.confirmtkt.com/rbooking-d/?source=${enc(source)}&destination=${enc(destination)}&dateOfJourney=${checkIn}`;

    case 'ixigo':
      if (item.transitType === 'train') {
        return `https://www.ixigo.com/trains/${enc(source)}-to-${enc(destination)}-trains`;
      }
      return `https://www.ixigo.com/flights/${enc(source)}-to-${enc(destination)}-flights`;

    case 'yatra':
      return `https://www.yatra.com/hotels/hotels-in-${enc(destination.toLowerCase())}?checkInDate=${checkIn}&checkOutDate=${checkOut}&rooms=1&adults=${guests}`;

    default:
      return item.url || `https://www.google.com/travel/search?q=${enc(item.name || destination)}`;
  }
}

/**
 * Save new booking request
 */
export async function createBookingRequest(bookingData) {
  const newBooking = {
    id: `b-${Date.now()}`,
    guestName: bookingData.guestName || 'Guest Traveler',
    guestPhone: bookingData.guestPhone || '+91 98765 43210',
    stayName: bookingData.stay?.name || bookingData.stayName || 'Boutique Stay',
    checkIn: bookingData.checkIn || '2026-10-15',
    checkOut: bookingData.checkOut || '2026-10-18',
    nights: bookingData.nights || 3,
    totalAmount: bookingData.totalAmount || 7500,
    status: 'Pending',
    dateRequested: 'Just now',
    createdAt: new Date().toISOString()
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('bookings').insert([newBooking]);
    } catch (err) {
      console.warn('Supabase booking insert failed, saving locally:', err);
    }
  }

  const existing = localStore.get(localStore.keys.BOOKINGS, []);
  localStore.set(localStore.keys.BOOKINGS, [newBooking, ...existing]);

  return newBooking;
}

/**
 * Save new host inquiry
 */
export async function createInquiry(inquiryData) {
  const newInq = {
    id: `inq-${Date.now()}`,
    guestName: inquiryData.guestName || 'Guest Traveler',
    location: inquiryData.location || 'Direct Inquiry',
    text: inquiryData.text || '',
    time: 'Just now',
    createdAt: new Date().toISOString()
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('inquiries').insert([newInq]);
    } catch (err) {
      console.warn('Supabase inquiry insert failed, saving locally:', err);
    }
  }

  const existing = localStore.get(localStore.keys.INQUIRIES, []);
  localStore.set(localStore.keys.INQUIRIES, [newInq, ...existing]);

  return newInq;
}

/**
 * Get all bookings
 */
export async function getBookings() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase getBookings failed, checking local:', err);
    }
  }
  return localStore.get(localStore.keys.BOOKINGS, []);
}

/**
 * Get all inquiries
 */
export async function getInquiries() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase getInquiries failed, checking local:', err);
    }
  }
  return localStore.get(localStore.keys.INQUIRIES, []);
}
