import { getSupabase, isSupabaseConfigured, localStore, initLocalDatabase } from './supabaseClient.js';
import { DESTINATIONS } from '../data/destinations.js';

initLocalDatabase();

/**
 * Fetch all available destinations
 */
export async function getDestinations() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('destinations').select('*').order('name');
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase fetch destinations failed, falling back to local:', err);
    }
  }

  // Fallback to local persistent store / seed data
  const localDests = localStore.get(localStore.keys.DESTINATIONS, []);
  return localDests.length > 0 ? localDests : DESTINATIONS;
}

/**
 * Fetch single destination by ID
 */
export async function getDestinationById(id) {
  if (!id) return DESTINATIONS[0];
  const targetId = id.toLowerCase();

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', targetId)
        .single();
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase fetch destination failed, using local:', err);
    }
  }

  const all = await getDestinations();
  return all.find(d => d.id.toLowerCase() === targetId) || DESTINATIONS[0];
}

/**
 * Create and persist a new trip
 */
export async function createTrip(tripData) {
  const tripId = tripData.id || `trip-${Date.now()}`;
  const completeTrip = {
    ...tripData,
    id: tripId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('trips')
        .insert([
          {
            id: completeTrip.id,
            destination_id: completeTrip.destinationId || completeTrip.destination?.id,
            source_city: completeTrip.sourceCity,
            start_date: completeTrip.startDate,
            end_date: completeTrip.endDate,
            travelers: completeTrip.travelers,
            budget: completeTrip.budget,
            pace: completeTrip.pace,
            styles: completeTrip.styles,
            trip_summary: completeTrip.summary,
            generated_itinerary: completeTrip.itineraryDays,
            budget_breakdown: completeTrip.budgetBreakdown,
            created_at: completeTrip.createdAt
          }
        ])
        .select()
        .single();

      if (!error && data) {
        // Also cache locally for offline speed
        const localTrips = localStore.get(localStore.keys.TRIPS, []);
        localStore.set(localStore.keys.TRIPS, [completeTrip, ...localTrips]);
        return completeTrip;
      }
    } catch (err) {
      console.warn('Supabase save trip failed, saving locally:', err);
    }
  }

  // Save to local storage
  const localTrips = localStore.get(localStore.keys.TRIPS, []);
  const updatedTrips = [completeTrip, ...localTrips.filter(t => t.id !== tripId)];
  localStore.set(localStore.keys.TRIPS, updatedTrips);

  return completeTrip;
}

/**
 * Fetch a trip by ID
 */
export async function getTripById(id) {
  if (!id) return null;

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          destinationId: data.destination_id,
          sourceCity: data.source_city,
          startDate: data.start_date,
          endDate: data.end_date,
          travelers: data.travelers,
          budget: data.budget,
          pace: data.pace,
          styles: data.styles,
          summary: data.trip_summary,
          itineraryDays: data.generated_itinerary,
          budgetBreakdown: data.budget_breakdown,
          createdAt: data.created_at
        };
      }
    } catch (err) {
      console.warn('Supabase getTripById failed, checking local:', err);
    }
  }

  const localTrips = localStore.get(localStore.keys.TRIPS, []);
  return localTrips.find(t => t.id === id) || null;
}

/**
 * Fetch all saved trips
 */
export async function getAllTrips() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(d => ({
          id: d.id,
          destinationId: d.destination_id,
          sourceCity: d.source_city,
          startDate: d.start_date,
          endDate: d.end_date,
          travelers: d.travelers,
          budget: d.budget,
          pace: d.pace,
          styles: d.styles,
          summary: d.trip_summary,
          itineraryDays: d.generated_itinerary,
          budgetBreakdown: d.budget_breakdown,
          createdAt: d.created_at
        }));
      }
    } catch (err) {
      console.warn('Supabase getAllTrips failed, checking local:', err);
    }
  }

  return localStore.get(localStore.keys.TRIPS, []);
}

/**
 * Update an existing trip (e.g., when itinerary is modified)
 */
export async function updateTrip(tripId, updates) {
  if (!tripId) return null;

  const localTrips = localStore.get(localStore.keys.TRIPS, []);
  const tripIndex = localTrips.findIndex(t => t.id === tripId);
  let updatedTrip = null;

  if (tripIndex >= 0) {
    updatedTrip = {
      ...localTrips[tripIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    localTrips[tripIndex] = updatedTrip;
    localStore.set(localStore.keys.TRIPS, localTrips);
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase
        .from('trips')
        .update({
          ...(updates.itineraryDays && { generated_itinerary: updates.itineraryDays }),
          ...(updates.budget && { budget: updates.budget }),
          ...(updates.summary && { trip_summary: updates.summary }),
          ...(updates.budgetBreakdown && { budget_breakdown: updates.budgetBreakdown })
        })
        .eq('id', tripId);
    } catch (err) {
      console.warn('Supabase updateTrip failed:', err);
    }
  }

  return updatedTrip;
}

/**
 * Add an activity to a specific day of a trip
 */
export async function addActivityToTrip(tripId, dayNumber, activity) {
  const trip = await getTripById(tripId);
  if (!trip || !trip.itineraryDays) return null;

  const newActivity = {
    id: activity.id || `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    time: activity.time || '10:00 AM – 11:30 AM',
    title: activity.title || 'Curated Activity',
    category: activity.category || 'attraction',
    cost: Number(activity.cost) || 0,
    location: activity.location || 'Local Spot',
    notes: activity.notes || activity.desc || '',
    buffer: activity.buffer || '15 mins buffer'
  };

  const updatedDays = trip.itineraryDays.map(d => {
    if (d.day === dayNumber) {
      return {
        ...d,
        activities: [...(d.activities || []), newActivity]
      };
    }
    return d;
  });

  return updateTrip(tripId, { itineraryDays: updatedDays });
}

/**
 * Delete an activity from a trip
 */
export async function deleteActivityFromTrip(tripId, dayNumber, activityId) {
  const trip = await getTripById(tripId);
  if (!trip || !trip.itineraryDays) return null;

  const updatedDays = trip.itineraryDays.map(d => {
    if (d.day === dayNumber) {
      return {
        ...d,
        activities: (d.activities || []).filter(a => a.id !== activityId)
      };
    }
    return d;
  });

  return updateTrip(tripId, { itineraryDays: updatedDays });
}

/**
 * Update an existing activity in a trip
 */
export async function updateActivityInTrip(tripId, dayNumber, activityId, activityUpdates) {
  const trip = await getTripById(tripId);
  if (!trip || !trip.itineraryDays) return null;

  const updatedDays = trip.itineraryDays.map(d => {
    if (d.day === dayNumber) {
      return {
        ...d,
        activities: (d.activities || []).map(a => {
          if (a.id === activityId) {
            return { ...a, ...activityUpdates };
          }
          return a;
        })
      };
    }
    return d;
  });

  return updateTrip(tripId, { itineraryDays: updatedDays });
}
