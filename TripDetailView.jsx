import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  IndianRupee, 
  Users, 
  Clock, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Circle, 
  Printer, 
  Share2, 
  ArrowLeft,
  ExternalLink,
  Bot,
  Plane,
  Train,
  Building2,
  Utensils,
  Lightbulb,
  ShieldCheck,
  Check
} from 'lucide-react';
import { PartnerLogo } from './PartnerLogos';

export default function TripDetailView({ 
  trip, 
  onBack, 
  onOpenAIChat, 
  onOpenRedirectModal,
  onAddActivity,
  onDeleteActivity,
  onOpenEditActivity 
}) {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [completedMap, setCompletedMap] = useState({});
  const [copiedLink, setCopiedLink] = useState(false);

  if (!trip) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-xl font-bold text-[#0b221d]">Trip not found</h2>
        <p className="text-xs text-gray-500 mt-2">The requested itinerary could not be loaded.</p>
        <button onClick={onBack} className="btn-gold mt-4 px-4 py-2 text-xs font-bold rounded-lg">
          ← Return to Planner
        </button>
      </div>
    );
  }

  const days = trip.itineraryDays || [];
  const currentDay = days[activeDayIdx] || days[0] || { day: 1, activities: [] };
  const activities = currentDay.activities || [];

  const toggleCompleted = (actId) => {
    setCompletedMap(prev => ({ ...prev, [actId]: !prev[actId] }));
  };

  const handleShareTrip = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // Calculate day and total costs
  const dayCost = activities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
  const totalItineraryCost = days.reduce(
    (sum, d) => sum + (d.activities || []).reduce((s, a) => s + (Number(a.cost) || 0), 0), 
    0
  );

  const breakdown = trip.budgetBreakdown || {
    stays: Math.round(trip.budget * 0.38),
    transit: Math.round(trip.budget * 0.26),
    food: Math.round(trip.budget * 0.22),
    activities: Math.round(trip.budget * 0.14),
    feasibilityStatus: 'Well Aligned'
  };

  return (
    <div className="trip-detail-page py-8">
      <div className="container">
        
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between mb-6">
          <button 
            type="button" 
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-gray-900 bg-white px-3 py-1.5 rounded-lg border border-[#e0e7e4] shadow-xs"
          >
            <ArrowLeft size={14} />
            <span>Back to Planner</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareTrip}
              className="inline-flex items-center gap-1 text-xs font-bold bg-white text-gray-700 px-3 py-1.5 rounded-lg border border-[#e0e7e4] hover:bg-gray-50 shadow-xs"
            >
              {copiedLink ? <Check size={13} className="text-emerald-600" /> : <Share2 size={13} />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Itinerary'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1 text-xs font-bold bg-white text-gray-700 px-3 py-1.5 rounded-lg border border-[#e0e7e4] hover:bg-gray-50 shadow-xs"
            >
              <Printer size={13} />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={onOpenAIChat}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#075E54] text-white px-3.5 py-1.5 rounded-lg shadow-sm hover:bg-[#064941]"
            >
              <Bot size={14} />
              <span>Modify with AI</span>
            </button>
          </div>
        </div>

        {/* Hero Header Banner */}
        <div className="bg-[#0b221d] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-white/10 mb-8">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#c4963d]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#c4963d] text-[11px] font-bold mb-3 border border-white/15">
              <Sparkles size={13} />
              <span>AI-ENGINEERED BESPOKE ITINERARY</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {trip.destinationName || 'Trip'} Journey Plan
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-300">
              <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                <MapPin size={13} className="text-[#c4963d]" />
                From {trip.sourceCity}
              </span>

              <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                <Calendar size={13} className="text-[#c4963d]" />
                {trip.startDate} to {trip.endDate} ({days.length} Days)
              </span>

              <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                <Users size={13} className="text-[#c4963d]" />
                {trip.travelers} {trip.travelers > 1 ? 'Travelers' : 'Traveler'}
              </span>

              <span className="flex items-center gap-1 bg-[#c4963d] text-[#0b221d] font-bold px-3 py-1 rounded-lg">
                <IndianRupee size={13} />
                Total Budget: ₹{Number(trip.budget || 28000).toLocaleString()}
              </span>
            </div>

            {trip.summary && (
              <p className="mt-4 text-gray-300 text-xs sm:text-sm leading-relaxed max-w-4xl border-t border-white/10 pt-4">
                {trip.summary}
              </p>
            )}
          </div>
        </div>

        {/* Budget Allocation Breakdown Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[#0b221d] uppercase tracking-wider text-xs">
              Budget Feasibility & Allocation Breakdown
            </h2>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {breakdown.feasibilityStatus || 'Ideal Fit'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-[#e0e7e4] shadow-xs">
              <span className="text-[11px] text-gray-500 font-bold uppercase block">Stays & Haveli (38%)</span>
              <span className="text-base font-extrabold text-[#0b221d] block mt-0.5">
                ₹{(breakdown.stays || 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400">Boutique rooms & homestays</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#e0e7e4] shadow-xs">
              <span className="text-[11px] text-gray-500 font-bold uppercase block">Transit & Cabs (26%)</span>
              <span className="text-base font-extrabold text-[#0b221d] block mt-0.5">
                ₹{(breakdown.transit || 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400">Vande Bharat / flights / rental</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#e0e7e4] shadow-xs">
              <span className="text-[11px] text-gray-500 font-bold uppercase block">Dining & Cafes (22%)</span>
              <span className="text-base font-extrabold text-[#0b221d] block mt-0.5">
                ₹{(breakdown.food || 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400">Local thalis & sunset bistros</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#e0e7e4] shadow-xs">
              <span className="text-[11px] text-gray-500 font-bold uppercase block">Activities & Buffer (14%)</span>
              <span className="text-base font-extrabold text-[#0b221d] block mt-0.5">
                ₹{(breakdown.activities || 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400">Entry passes, guides & margin</span>
            </div>
          </div>
        </div>

        {/* Main Itinerary Section */}
        <div className="bg-white rounded-2xl border border-[#e0e7e4] shadow-md p-6 mb-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e0e7e4]">
            <div>
              <h2 className="text-lg font-bold text-[#0b221d]">Hour-by-Hour Interactive Itinerary</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Day {currentDay.day} activities total: <strong className="text-[#0b221d]">₹{dayCost.toLocaleString()}</strong> • Entire Trip Activities: <strong className="text-[#0b221d]">₹{totalItineraryCost.toLocaleString()}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => onAddActivity && onAddActivity(currentDay.day)}
              className="btn-gold text-xs font-bold px-3.5 py-2 rounded-lg inline-flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
            >
              <Plus size={14} />
              <span>Add Activity to Day {currentDay.day}</span>
            </button>
          </div>

          {/* Day Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-[#e0e7e4]">
            {days.map((d, idx) => (
              <button
                key={d.day}
                type="button"
                onClick={() => setActiveDayIdx(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeDayIdx === idx 
                    ? 'bg-[#0b221d] text-white shadow-xs' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Day {d.day}: {d.title || `Day ${d.day}`}
              </button>
            ))}
          </div>

          {/* Day Summary Card */}
          {currentDay.summary && (
            <div className="my-4 p-3 bg-[#faf3e5] rounded-xl border border-[#c4963d]/30 text-xs text-[#523d14] font-medium flex items-center gap-2">
              <span className="font-bold text-[#c4963d]">DAY {currentDay.day} FOCUS:</span>
              <span>{currentDay.summary}</span>
            </div>
          )}

          {/* Activities Timeline */}
          <div className="mt-6 space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-xs">
                No activities scheduled for this day yet. Click "+ Add Activity" above to create one!
              </div>
            ) : (
              activities.map((act) => {
                const isCompleted = completedMap[act.id];

                return (
                  <div 
                    key={act.id} 
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCompleted 
                        ? 'bg-gray-50 border-gray-200 opacity-60' 
                        : 'bg-white border-[#e0e7e4] hover:border-[#c4963d]/50 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button 
                        type="button" 
                        onClick={() => toggleCompleted(act.id)}
                        className="mt-0.5 text-gray-400 hover:text-emerald-600 transition-colors"
                        title={isCompleted ? 'Mark uncompleted' : 'Mark completed'}
                      >
                        {isCompleted ? <CheckCircle2 size={18} className="text-emerald-600" /> : <Circle size={18} />}
                      </button>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <Clock size={11} /> {act.time}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            act.category === 'food' ? 'bg-amber-100 text-amber-800' :
                            act.category === 'transit' ? 'bg-blue-100 text-blue-800' :
                            act.category === 'buffer' ? 'bg-purple-100 text-purple-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {act.category}
                          </span>
                        </div>

                        <h4 className={`text-sm font-bold text-gray-900 mt-1.5 ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                          {act.title}
                        </h4>

                        {act.notes && (
                          <p className="text-xs text-gray-600 mt-1">{act.notes}</p>
                        )}

                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-500">
                          {act.location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={11} className="text-gray-400" /> {act.location}
                            </span>
                          )}
                          {act.buffer && (
                            <span className="text-gray-400 italic">({act.buffer})</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Cost & Delete Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      <span className="text-sm font-extrabold text-[#0b221d]">
                        ₹{(Number(act.cost) || 0).toLocaleString()}
                      </span>

                      <div className="flex items-center gap-1">
                        {onOpenEditActivity && (
                          <button
                            type="button"
                            onClick={() => onOpenEditActivity(currentDay.day, act)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md transition-colors"
                            title="Edit activity"
                          >
                            <Edit3 size={14} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onDeleteActivity && onDeleteActivity(currentDay.day, act.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-md transition-colors"
                          title="Delete activity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Recommended Transits & Stays Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Transits */}
          <div className="bg-white rounded-2xl border border-[#e0e7e4] p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#0b221d] flex items-center gap-2 mb-3">
              <Plane size={15} className="text-[#c4963d]" /> Recommended Transit Routes
            </h3>

            <div className="space-y-2.5">
              {(trip.recommendedTransits || []).map((t, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-gray-200 flex items-center justify-between hover:border-[#c4963d]/50 transition-all">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-xs text-gray-900">{t.provider || t.airline || 'Carrier'}</strong>
                      <span className="text-[10.5px] text-gray-500 font-mono">({t.flightOrTrainNumber || t.flightNumber || 'Direct'})</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {t.departureTime || 'Morning'} ➔ {t.arrivalTime || 'Afternoon'} ({t.duration || 'Fastest'})
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-[#0b221d] block">₹{(t.price || 3500).toLocaleString()}</span>
                    <button
                      type="button"
                      onClick={() => onOpenRedirectModal && onOpenRedirectModal({
                        title: `${trip.sourceCity} to ${trip.destinationName} (${t.provider || 'Transit'})`,
                        type: 'Transit',
                        platform: 'MakeMyTrip',
                        price: t.price || 3500,
                        source: trip.sourceCity,
                        destination: trip.destinationName
                      })}
                      className="text-[10.5px] font-bold text-[#c4963d] hover:underline flex items-center gap-0.5 justify-end mt-0.5"
                    >
                      Compare <ExternalLink size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stays */}
          <div className="bg-white rounded-2xl border border-[#e0e7e4] p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#0b221d] flex items-center gap-2 mb-3">
              <Building2 size={15} className="text-[#c4963d]" /> Recommended Stays
            </h3>

            <div className="space-y-2.5">
              {(trip.recommendedStays || []).map((s, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-gray-200 flex items-center justify-between hover:border-[#c4963d]/50 transition-all">
                  <div>
                    <strong className="text-xs text-gray-900 block">{s.name || 'Boutique Stay'}</strong>
                    <span className="text-[11px] text-gray-500 mt-0.5 block">{s.type || 'Homestay'} • {s.location || trip.destinationName}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-[#0b221d] block">₹{(s.pricePerNight || 3200).toLocaleString()}/night</span>
                    <button
                      type="button"
                      onClick={() => onOpenRedirectModal && onOpenRedirectModal({
                        title: s.name || `${trip.destinationName} Stay`,
                        type: 'Stay',
                        platform: 'Booking.com',
                        price: s.pricePerNight || 3200,
                        destination: trip.destinationName
                      })}
                      className="text-[10.5px] font-bold text-[#c4963d] hover:underline flex items-center gap-0.5 justify-end mt-0.5"
                    >
                      Compare <ExternalLink size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Local Dining & Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trip.diningRecommendations && trip.diningRecommendations.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#e0e7e4] p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#0b221d] flex items-center gap-2 mb-3">
                <Utensils size={15} className="text-[#c4963d]" /> Curated Culinary Picks
              </h3>
              <ul className="space-y-2 text-xs">
                {trip.diningRecommendations.map((d, idx) => (
                  <li key={idx} className="p-2.5 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div>
                      <strong className="text-gray-900 block">{d.name}</strong>
                      <span className="text-[11px] text-gray-500">{d.cuisine} • Must try: {d.mustTry}</span>
                    </div>
                    {d.priceForTwo && (
                      <span className="text-xs font-bold text-gray-700">₹{d.priceForTwo} for 2</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {trip.traveltips || (trip.travelTips && trip.travelTips.length > 0) && (
            <div className="bg-white rounded-2xl border border-[#e0e7e4] p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#0b221d] flex items-center gap-2 mb-3">
                <Lightbulb size={15} className="text-[#c4963d]" /> Travel Advisory & Insider Tips
              </h3>
              <ul className="space-y-2 text-xs text-gray-600">
                {(trip.travelTips || trip.traveltips || []).map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 bg-amber-50/50 rounded-lg border border-amber-100">
                    <span className="text-[#c4963d] font-bold mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
