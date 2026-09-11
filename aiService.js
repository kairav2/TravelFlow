import { GoogleGenAI } from '@google/genai';
import { DESTINATIONS } from '../data/destinations.js';

// ============================================================================
// CONFIGURATION & CREDENTIAL MANAGEMENT
// ============================================================================

// Helper to get active Gemini API Key
export function getGeminiKey() {
  let envKey = '';
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
      envKey = import.meta.env.VITE_GEMINI_API_KEY;
    }
  } catch {}
  try {
    if (!envKey && typeof process !== 'undefined' && process.env && process.env.VITE_GEMINI_API_KEY) {
      envKey = process.env.VITE_GEMINI_API_KEY;
    }
  } catch {}

  let localKey = '';
  if (typeof localStorage !== 'undefined') {
    try {
      localKey = localStorage.getItem('travelflow_gemini_api_key') || '';
    } catch {}
  }

  return envKey || localKey || '';
}

export function setCustomGeminiKey(key) {
  if (typeof localStorage === 'undefined') return;
  try {
    if (key) {
      localStorage.setItem('travelflow_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('travelflow_gemini_api_key');
    }
  } catch {}
}

export function isGeminiConfigured() {
  const key = getGeminiKey();
  return Boolean(key && key.length > 10);
}

// Helper to get active Groq API Key & Model
export function getGroqKey() {
  let envKey = '';
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GROQ_API_KEY) {
      envKey = import.meta.env.VITE_GROQ_API_KEY;
    }
  } catch {}
  try {
    if (!envKey && typeof process !== 'undefined' && process.env && process.env.VITE_GROQ_API_KEY) {
      envKey = process.env.VITE_GROQ_API_KEY;
    }
  } catch {}

  let localKey = '';
  if (typeof localStorage !== 'undefined') {
    try {
      localKey = localStorage.getItem('travelflow_groq_api_key') || '';
    } catch {}
  }

  return envKey || localKey || '';
}

export function getGroqModel() {
  let envModel = '';
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GROQ_MODEL) {
      envModel = import.meta.env.VITE_GROQ_MODEL;
    }
  } catch {}
  try {
    if (!envModel && typeof process !== 'undefined' && process.env && process.env.VITE_GROQ_MODEL) {
      envModel = process.env.VITE_GROQ_MODEL;
    }
  } catch {}

  let localModel = '';
  if (typeof localStorage !== 'undefined') {
    try {
      localModel = localStorage.getItem('travelflow_groq_model') || '';
    } catch {}
  }

  return envModel || localModel || 'openai/gpt-oss-120b';
}

export function setCustomGroqKey(key, model) {
  if (typeof localStorage === 'undefined') return;
  try {
    if (key) {
      localStorage.setItem('travelflow_groq_api_key', key.trim());
    } else {
      localStorage.removeItem('travelflow_groq_api_key');
    }
    if (model) {
      localStorage.setItem('travelflow_groq_model', model.trim());
    }
  } catch {}
}

export function isGroqConfigured() {
  const key = getGroqKey();
  return Boolean(key && key.length > 10);
}

export function isAiConfigured() {
  return isGroqConfigured() || isGeminiConfigured();
}

export function getActiveAiProvider() {
  if (isGroqConfigured()) return 'groq';
  if (isGeminiConfigured()) return 'gemini';
  return 'smart-local';
}

export function getActiveModelName() {
  if (isGroqConfigured()) return `Groq (${getGroqModel()})`;
  if (isGeminiConfigured()) return 'Google Gemini 2.5 Flash';
  return 'Smart Offline Travel Engine';
}

// Get initialized GoogleGenAI instance or null
function getGeminiClient() {
  const key = getGeminiKey();
  if (!key) return null;
  try {
    return new GoogleGenAI({ apiKey: key });
  } catch (err) {
    console.warn('GoogleGenAI initialization error:', err);
    return null;
  }
}

const GEMINI_MODEL = 'gemini-2.5-flash';

// Generic Groq API call helper
async function callGroqApi(messages, options = {}) {
  const key = getGroqKey();
  const model = getGroqModel();
  if (!key) throw new Error('Groq API Key is not configured.');

  const body = {
    model: model,
    messages: messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 1200
  };

  if (options.jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response received from Groq.');
  return content;
}

// ============================================================================
// AI SYSTEM 1: TRAVEL AI — Dynamic Structured Trip Planner
// ============================================================================

/**
 * Generate a complete, bespoke, structured trip plan using Groq, Gemini, or smart local fallback
 */
export async function generateAiTripPlan(params) {
  const {
    sourceCity = 'Mumbai',
    destinationId = 'goa',
    destinationName = 'Goa',
    startDate = '2026-10-01',
    endDate = '2026-10-05',
    travelers = 2,
    budget = 30000,
    pace = 'balanced',
    styles = ['culture', 'foodie'],
    aiPrompt = ''
  } = params;

  // Calculate duration in days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.max(2, Math.min(8, Math.round((end - start) / (1000 * 60 * 60 * 24)) || 4));

  const systemPrompt = `You are TravelFlow AI, an elite travel architect and feasibility engineer.
Generate a comprehensive, realistic, hour-by-hour travel plan in strict JSON format.

TRIP REQUIREMENTS:
- Source City: ${sourceCity}
- Destination: ${destinationName} (ID: ${destinationId})
- Dates: ${startDate} to ${endDate} (${diffDays} Days)
- Travelers: ${travelers}
- Total Budget: ₹${budget.toLocaleString()} INR
- Travel Pace: ${pace} (relaxed = leisurely stops, balanced = optimal sights & buffers, packed = high energy)
- Trip Focus / Styles: ${styles.join(', ')}
${aiPrompt ? `- Custom User Notes: "${aiPrompt}"` : ''}

CRITICAL RULES:
1. All prices must be realistic estimates in Indian Rupees (INR ₹).
2. Schedule activities with realistic transit buffers (e.g. 20-45 mins buffer between distant locations).
3. Ensure the daily pace matches '${pace}'.
4. Provide structured categories: "attraction", "food", "transit", "buffer".

Output must be ONLY valid JSON matching this exact structure:
{
  "summary": "A 2-paragraph inspiring narrative describing the vibe, scenic highlights, and pacing of this trip.",
  "budgetBreakdown": {
    "stays": 12000,
    "transit": 8000,
    "food": 6500,
    "activities": 3500,
    "feasibilityStatus": "Ideal Fit",
    "feasibilityAdvice": "Your budget allows comfortable boutique stays and private cab rentals with surplus for culinary exploration."
  },
  "recommendedTransits": [
    {
      "transitType": "flight",
      "provider": "IndiGo",
      "flightOrTrainNumber": "6E-512",
      "departureTime": "08:15 AM",
      "arrivalTime": "09:40 AM",
      "duration": "1h 25m",
      "price": 3800,
      "badge": "Fastest Route"
    },
    {
      "transitType": "train",
      "provider": "Vande Bharat Express",
      "flightOrTrainNumber": "22229",
      "departureTime": "05:25 AM",
      "arrivalTime": "01:10 PM",
      "duration": "7h 45m",
      "price": 1650,
      "badge": "Scenic & Comfortable"
    }
  ],
  "recommendedStays": [
    {
      "name": "Boutique Heritage Villa",
      "type": "Heritage Homestay",
      "tier": "comfort",
      "pricePerNight": 4200,
      "rating": 4.8,
      "location": "Central Hub",
      "description": "Charming wooden architecture with scenic balcony views."
    }
  ],
  "itineraryDays": [
    {
      "day": 1,
      "title": "Arrival & Sunset Welcome",
      "summary": "Check in, unwind, and watch the golden hour sunset.",
      "activities": [
        {
          "id": "act-d1-1",
          "time": "09:30 AM – 10:45 AM",
          "title": "Arrival & Scenic Transit to Stay",
          "category": "transit",
          "cost": 800,
          "location": "Airport / Railway Station",
          "notes": "Pre-booked AC cab passing lush greenery.",
          "buffer": "25 mins baggage buffer"
        }
      ]
    }
  ],
  "diningRecommendations": [
    {
      "name": "Iconic Local Cafe",
      "cuisine": "Authentic Regional",
      "priceForTwo": 900,
      "mustTry": "Signature regional specialty"
    }
  ],
  "travelTips": [
    "Carry light cotton clothing and comfortable walking sneakers.",
    "Pre-book monument fast-track passes online to skip queues."
  ]
}`;

  // 1. Try Groq (Ultra-Fast)
  if (isGroqConfigured()) {
    try {
      const groqReply = await callGroqApi([
        { role: 'system', content: 'You are TravelFlow AI. Output ONLY raw valid JSON.' },
        { role: 'user', content: systemPrompt }
      ], { jsonMode: true, temperature: 0.4, maxTokens: 2500 });

      const parsed = JSON.parse(groqReply);
      if (parsed && parsed.itineraryDays && parsed.itineraryDays.length > 0) {
        return formatGeneratedTrip(parsed, params, diffDays);
      }
    } catch (err) {
      console.warn('Groq trip generation failed, attempting fallback:', err);
    }
  }

  // 2. Try Gemini
  const geminiClient = getGeminiClient();
  if (geminiClient) {
    try {
      const response = await geminiClient.models.generateContent({
        model: GEMINI_MODEL,
        contents: systemPrompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4
        }
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        if (parsed && parsed.itineraryDays && parsed.itineraryDays.length > 0) {
          return formatGeneratedTrip(parsed, params, diffDays);
        }
      }
    } catch (err) {
      console.warn('Gemini Trip Generation error, falling back to smart local synthesis:', err);
    }
  }

  // 3. Fallback engine if keys not configured or error occurred
  return generateFallbackTripPlan(params, diffDays);
}

function formatGeneratedTrip(aiData, params, daysCount) {
  return {
    id: `trip-${Date.now()}`,
    destinationId: params.destinationId,
    destinationName: params.destinationName,
    sourceCity: params.sourceCity,
    startDate: params.startDate,
    endDate: params.endDate,
    travelers: params.travelers,
    budget: params.budget,
    pace: params.pace,
    styles: params.styles,
    summary: aiData.summary || `Personalized ${daysCount}-day itinerary for ${params.destinationName}.`,
    budgetBreakdown: aiData.budgetBreakdown || {
      stays: Math.round(params.budget * 0.38),
      transit: Math.round(params.budget * 0.26),
      food: Math.round(params.budget * 0.22),
      activities: Math.round(params.budget * 0.14),
      feasibilityStatus: 'Well Aligned',
      feasibilityAdvice: 'Your budget is well proportioned for this destination.'
    },
    itineraryDays: aiData.itineraryDays || [],
    recommendedTransits: aiData.recommendedTransits || [],
    recommendedStays: aiData.recommendedStays || [],
    diningRecommendations: aiData.diningRecommendations || [],
    travelTips: aiData.travelTips || []
  };
}

// Smart Local Fallback Trip Generator
function generateFallbackTripPlan(params, daysCount) {
  const baseDest = DESTINATIONS.find(d => d.id === params.destinationId) || DESTINATIONS[0];
  const userBudget = params.budget || 28000;
  const travelers = params.travelers || 2;
  const dailyPerPerson = Math.round(userBudget / (daysCount * travelers));

  let feasibilityStatus = 'Well Aligned';
  let feasibilityAdvice = 'Your budget provides a balanced experience with boutique stays and comfortable transport.';
  if (dailyPerPerson < 2500) {
    feasibilityStatus = 'Backpacker Feasible';
    feasibilityAdvice = 'Great for shared hostels, scooter rentals, local trains, and authentic street food.';
  } else if (dailyPerPerson > 7000) {
    feasibilityStatus = 'Surplus / Luxury';
    feasibilityAdvice = 'You have ample budget for premium 4/5-star oceanfront/palace suites, private chauffeur, and fine dining.';
  }

  const generatedDays = [];
  const baseDays = baseDest.itineraryDays || [];

  for (let i = 0; i < daysCount; i++) {
    const dayIndex = i % baseDays.length;
    const templateDay = baseDays[dayIndex] || baseDays[0];
    const dayNum = i + 1;

    generatedDays.push({
      day: dayNum,
      title: i >= baseDays.length ? `Day ${dayNum}: Hidden Trails & Local Cultural Exploration` : templateDay.title,
      summary: templateDay.summary,
      activities: (templateDay.activities || []).map((act, actIdx) => ({
        ...act,
        id: `act-d${dayNum}-${actIdx + 1}`,
        cost: Math.round(act.cost * (travelers > 1 ? 1.4 : 1))
      }))
    });
  }

  return {
    id: `trip-${Date.now()}`,
    destinationId: baseDest.id,
    destinationName: baseDest.name,
    sourceCity: params.sourceCity,
    startDate: params.startDate,
    endDate: params.endDate,
    travelers: travelers,
    budget: userBudget,
    pace: params.pace || 'balanced',
    styles: params.styles || ['culture', 'foodie'],
    summary: `Tailored ${daysCount}-day journey across ${baseDest.name} optimized for ${travelers} traveler${travelers > 1 ? 's' : ''} departing from ${params.sourceCity}. Engineered with realistic transit buffers, scenic viewpoints, and local authentic cafes.`,
    budgetBreakdown: {
      stays: Math.round(userBudget * 0.38),
      transit: Math.round(userBudget * 0.26),
      food: Math.round(userBudget * 0.22),
      activities: Math.round(userBudget * 0.14),
      feasibilityStatus: feasibilityStatus,
      feasibilityAdvice: feasibilityAdvice
    },
    itineraryDays: generatedDays,
    recommendedTransits: baseDest.transits?.flights?.slice(0, 2) || [],
    recommendedStays: baseDest.stays?.slice(0, 3) || [],
    diningRecommendations: [
      { name: 'Local Heritage Bistro', cuisine: 'Authentic Local', priceForTwo: 950, mustTry: 'Chef signature thali' },
      { name: 'Sunset Panoramic Cafe', cuisine: 'Cafe & Continental', priceForTwo: 750, mustTry: 'Artisan roast espresso & woodfire pizza' }
    ],
    travelTips: [
      `Ideal time to explore outdoor sights in ${baseDest.name} is between 08:00 AM – 11:30 AM before peak heat.`,
      `Always compare flights and Vande Bharat trains on our comparator table to save up to 25% on peak fares.`,
      `Keep at least 30 minutes of buffer between transit hubs and hotel check-in.`
    ]
  };
}

// ============================================================================
// AI SYSTEM 2: TRAVELFLOW AI CHAT / WHATSAPP CONCIERGE
// ============================================================================

const CONCIERGE_SYSTEM_PROMPT = `You are "TravelFlow AI Concierge", an elite, context-aware travel assistant inside the TravelFlow platform.
You behave like a luxury concierge on WhatsApp — fast, personable, crisp, and deeply helpful.

CAPABILITIES:
1. Provide actionable advice for the user's active trip and destination.
2. If the user asks to add an experience or activity (e.g., "Add sunset cruise", "Add cafe visit", "Add pottery workshop", "Schedule scuba diving"), you MUST include a structured JSON block at the very end of your reply:
\`\`\`action
{
  "type": "ADD_ACTIVITY",
  "activity": {
    "title": "Sunset Cruise on Mandovi River",
    "category": "attraction",
    "cost": 850,
    "time": "05:00 PM – 06:30 PM",
    "notes": "Scenic river catamaran with live Goan folk music."
  }
}
\`\`\`
3. If the user asks to remove an activity (e.g., "Remove museum from Day 1"), generate:
\`\`\`action
{
  "type": "REMOVE_ACTIVITY",
  "target": "museum"
}
\`\`\`
4. If the user asks for cheaper stays under their budget, highlight 2-3 specific options with realistic prices and booking advice across Booking.com, Agoda, and MakeMyTrip.
5. Keep conversational text to 2-3 short, crisp paragraphs or bullet points. Use clean WhatsApp formatting (*bold*, _italic_, bullet emojis). Do not use HTML tags.`;

/**
 * Ask the conversational TravelFlow Concierge
 */
export async function askTravelFlowAI(userMessage, context = {}, chatHistory = []) {
  const destName = context.destination?.name || context.destinationName || context.name || 'Goa';
  const budget = context.budget ? `₹${Number(context.budget).toLocaleString()}` : 'Flexible';
  const dates = context.startDate && context.endDate ? `${context.startDate} to ${context.endDate}` : 'Upcoming';
  const travelers = context.travelers || 2;

  const contextPrompt = `${CONCIERGE_SYSTEM_PROMPT}

CURRENT ACTIVE TRIP CONTEXT:
- Destination: ${destName}
- Travel Dates: ${dates}
- Travelers: ${travelers}
- Total Budget: ${budget}
- Current Active Day Count: ${context.itineraryDays?.length || 4} days`;

  // 1. Try Groq (Ultra-Fast)
  if (isGroqConfigured()) {
    try {
      const messages = [
        { role: 'system', content: contextPrompt }
      ];

      // Add recent context-window messages
      chatHistory.slice(-6).forEach(m => {
        messages.push({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        });
      });

      messages.push({ role: 'user', content: userMessage });

      const replyContent = await callGroqApi(messages, {
        temperature: 0.7,
        maxTokens: 1000
      });

      if (replyContent) {
        const parsed = parseConciergeReply(replyContent, destName, userMessage);
        return {
          ...parsed,
          provider: 'groq',
          model: getGroqModel()
        };
      }
    } catch (err) {
      console.warn('Groq Concierge chat error, attempting Gemini/fallback:', err);
    }
  }

  // 2. Try Gemini
  const geminiClient = getGeminiClient();
  if (geminiClient) {
    try {
      const geminiPrompt = `${contextPrompt}

RECENT CONVERSATION:
${chatHistory.slice(-4).map(m => `${m.sender === 'user' ? 'User' : 'Concierge'}: ${m.text}`).join('\n')}

User: ${userMessage}
Concierge:`;

      const response = await geminiClient.models.generateContent({
        model: GEMINI_MODEL,
        contents: geminiPrompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      });

      const replyText = response.text;
      if (replyText) {
        const parsed = parseConciergeReply(replyText, destName, userMessage);
        return {
          ...parsed,
          provider: 'gemini',
          model: GEMINI_MODEL
        };
      }
    } catch (err) {
      console.warn('Gemini chat error, fallback active:', err);
    }
  }

  // 3. Smart local conversational fallback
  const fallback = getSmartLocalChatReply(userMessage, context);
  return {
    ...fallback,
    provider: 'smart-local',
    model: 'Smart Engine'
  };
}

function parseConciergeReply(fullReply, destination, userMessage) {
  let replyText = fullReply;
  let action = null;

  // Extract ```action ... ``` or ```json ... ``` block if present
  const actionMatch = fullReply.match(/```(?:action|json)\s*([\s\S]*?)\s*```/);
  if (actionMatch && actionMatch[1]) {
    try {
      const candidate = JSON.parse(actionMatch[1]);
      if (candidate && (candidate.type || candidate.activity)) {
        action = candidate;
        replyText = fullReply.replace(/```(?:action|json)[\s\S]*?```/, '').trim();
      }
    } catch (err) {
      console.warn('Could not parse AI action JSON:', err);
    }
  }

  return {
    text: replyText,
    action: action,
    destination: destination
  };
}

function getSmartLocalChatReply(userMessage, context) {
  const q = userMessage.toLowerCase();
  const destName = context.destination?.name || context.destinationName || 'Goa';

  if (q.includes('hotel') || q.includes('stay') || q.includes('cheap') || q.includes('budget')) {
    return {
      text: `🏨 *Budget Stays & Boutique Haveli Options in ${destName}:*\n\n` +
        `Under your target budget, here are verified partner stays:\n` +
        `• *Social Heritage Hostel & Pods:* ₹850–₹1,400/night (Shared pool, high-speed WiFi, rooftop cafe).\n` +
        `• *Boutique Portuguese/Hill Villa:* ₹2,800–₹4,200/night (Private balcony, artisanal breakfast included).\n\n` +
        `💡 *Pro-Tip:* MakeMyTrip and Agoda currently show 0% cancellation fees if booked 48 hours prior. Would you like me to adjust your accommodation allocation?`,
      action: {
        type: 'SUGGEST_STAY',
        category: 'stay'
      }
    };
  }

  if (q.includes('add') || q.includes('sunset') || q.includes('cruise') || q.includes('cafe')) {
    const activityName = userMessage.replace(/add|please|to|my|itinerary|the/gi, '').trim() || `Scenic Sunset in ${destName}`;
    return {
      text: `✨ *Done! Added to your ${destName} itinerary:*\n\n` +
        `I have scheduled *"${activityName}"* into your afternoon golden hour with a 30-minute transit buffer.\n\n` +
        `Estimated cost: *₹850 / person* including local entry/pass. Tap the *Apply to Itinerary* button below to confirm!`,
      action: {
        type: 'ADD_ACTIVITY',
        activity: {
          id: `act-ai-${Date.now()}`,
          title: activityName.charAt(0).toUpperCase() + activityName.slice(1),
          category: q.includes('cafe') || q.includes('food') ? 'food' : 'attraction',
          cost: 850,
          time: '04:30 PM – 06:30 PM',
          location: `${destName} Central`,
          notes: 'Co-planned with TravelFlow AI Concierge.',
          buffer: '30 mins buffer'
        }
      }
    };
  }

  if (q.includes('remove') || q.includes('delete') || q.includes('cancel')) {
    return {
      text: `🗑️ *Itinerary Updated:*\n\n` +
        `I have marked the selected activity for removal from your schedule. Your day buffer has been extended by 45 minutes for relaxed leisure.`,
      action: {
        type: 'REMOVE_ACTIVITY',
        target: 'activity'
      }
    };
  }

  return {
    text: `✈️ *TravelFlow AI Concierge for ${destName}:*\n\n` +
      `I'm actively monitoring your trip details. I can help you:\n` +
      `1. *Add bespoke activities* (sunset cruises, food walks, hidden trails)\n` +
      `2. *Find cheaper stays* across Booking.com, Agoda, and MakeMyTrip\n` +
      `3. *Check fastest transit* (Vande Bharat Express & nonstop flights)\n\n` +
      `What would you like to tweak in your schedule?`,
    action: null
  };
}
