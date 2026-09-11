import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  Sun, 
  ArrowRight, 
  Search, 
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

export default function DestinationsExplorerView({ 
  destinations = [], 
  onSelectDestination,
  onViewDestinationDetails 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('all'); // 'all', 'budget', 'moderate', 'luxury'

  const filtered = destinations.filter(d => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (d.name || '').toLowerCase().includes(q);
      const matchState = (d.state || '').toLowerCase().includes(q);
      const matchTagline = (d.tagline || '').toLowerCase().includes(q);
      if (!matchName && !matchState && !matchTagline) return false;
    }

    if (budgetFilter === 'budget' && (d.recommendedBudget || 25000) > 24000) return false;
    if (budgetFilter === 'moderate' && ((d.recommendedBudget || 25000) < 24000 || (d.recommendedBudget || 25000) > 35000)) return false;
    if (budgetFilter === 'luxury' && (d.recommendedBudget || 25000) < 35000) return false;

    return true;
  });

  return (
    <div className="destinations-catalog-page py-10">
      <div className="container">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf3e5] border border-[#c4963d]/30 text-[#0b221d] text-xs font-bold mb-3">
            <Compass size={14} className="text-[#c4963d]" />
            <span>CURATED DESTINATIONS DIRECTORY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b221d] tracking-tight">
            Explore Incredible India with Travel AI
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Every destination is pre-loaded with verified multi-portal pricing, authentic local stays, and hour-by-hour realistic itineraries.
          </p>

          {/* Search & Filter Bar */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-center">
            <div className="relative w-full sm:w-96">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Search by destination name, state, or vibe..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e0e7e4] bg-white text-xs text-gray-900 outline-none shadow-sm focus:border-[#0b221d]"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-white border border-[#e0e7e4] rounded-xl shadow-sm text-xs">
              <span className="px-2.5 text-gray-500 font-bold text-[11px]">Budget:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'budget', label: '< ₹24k' },
                { id: 'moderate', label: '₹24k–₹35k' },
                { id: 'luxury', label: '₹35k+' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setBudgetFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    budgetFilter === f.id 
                      ? 'bg-[#0b221d] text-white shadow-xs' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(dest => (
            <article 
              key={dest.id} 
              className="bg-white rounded-2xl overflow-hidden border border-[#e0e7e4] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={dest.heroImage || dest.image} 
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b221d]/85 via-black/20 to-transparent" />
                
                {/* State Tag */}
                <span className="absolute top-3 left-3 bg-[#0b221d]/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1">
                  <MapPin size={11} className="text-[#c4963d]" />
                  {dest.state}
                </span>

                {/* Bottom title in image */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-white text-xl font-bold tracking-tight drop-shadow-md">
                    {dest.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-gray-600 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {dest.tagline || 'Explore handcrafted homestays, scenic trails, and cultural experiences.'}
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#eaf0ee] text-[11px] mb-4">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Best Season</span>
                      <span className="font-semibold text-gray-800 flex items-center gap-1 mt-0.5">
                        <Calendar size={11} className="text-[#c4963d]" />
                        {dest.bestSeason || 'Oct – Mar'}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Avg Temp</span>
                      <span className="font-semibold text-gray-800 flex items-center gap-1 mt-0.5">
                        <Sun size={11} className="text-amber-500" />
                        {dest.avgTemp || '25°C'}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Ideal Budget</span>
                      <span className="font-bold text-[#0b221d] flex items-center gap-0.5 mt-0.5">
                        ₹{(dest.recommendedBudget || 26000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onViewDestinationDetails && onViewDestinationDetails(dest.id)}
                    className="flex-1 py-2 px-3 text-xs font-bold rounded-xl border border-[#0b221d] text-[#0b221d] hover:bg-[#0b221d] hover:text-white transition-all text-center"
                  >
                    View Destination
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectDestination && onSelectDestination(dest.id)}
                    className="flex-1 py-2 px-3 text-xs font-bold rounded-xl btn-gold text-center flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span>Plan Trip</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#e0e7e4] mt-6">
            <Compass size={36} className="mx-auto text-gray-400 mb-2" />
            <h3 className="text-base font-bold text-gray-700">No destinations match your search</h3>
            <p className="text-xs text-gray-500 mt-1">Try relaxing your search terms or budget filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setBudgetFilter('all'); }}
              className="mt-3 text-xs font-bold text-[#c4963d] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
