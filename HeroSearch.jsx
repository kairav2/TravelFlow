import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Compass,
  Sliders,
  Check,
  Wand2,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DESTINATIONS, SOURCE_CITIES } from '../data/destinations';
import { generateAiTripPlan } from '../services/aiService';
import { createTrip } from '../services/travelService';

const TRIP_PACES = [
  { id: 'balanced', label: 'Balanced', desc: 'Mix of sights & chill buffers', icon: '⚖️' },
  { id: 'relaxed', label: 'Relaxed', desc: 'Late starts & leisurely meals', icon: '☕' },
  { id: 'packed', label: 'High Energy', desc: 'Max monuments & activities', icon: '⚡' }
];

const TRIP_STYLES = [
  { id: 'culture', label: 'Culture & Heritage' },
  { id: 'foodie', label: 'Culinary & Cafes' },
  { id: 'nature', label: 'Scenic Nature' },
  { id: 'adventure', label: 'Adventure & Trails' }
];

export default function HeroSearch({ 
  tripParams, 
  setTripParams, 
  selectedDest, 
  setSelectedDestId, 
  onGeneratePlan 
}) {
  const [activeTab, setActiveTab] = useState('smart-ai'); // 'smart-ai' or 'prompt'
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedStyles, setSelectedStyles] = useState(['culture', 'foodie']);
  const [tripPace, setTripPace] = useState('balanced');
  const [isAiOptimizing, setIsAiOptimizing] = useState(false);
  const [aiStatusMsg, setAiStatusMsg] = useState('Synthesizing Plan...');

  const currentDest = DESTINATIONS.find(d => d.id === selectedDest.id) || DESTINATIONS[0];

  const handlePresetClick = (destId, budget) => {
    setSelectedDestId(destId);
    setTripParams(prev => ({
      ...prev,
      destinationId: destId,
      budget: budget
    }));
  };

  const toggleStyle = (id) => {
    setSelectedStyles(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAiQuickPrompt = (promptText, destId, budget) => {
    setAiPrompt(promptText);
    setSelectedDestId(destId);
    setTripParams(prev => ({
      ...prev,
      destinationId: destId,
      budget: budget
    }));
    triggerAiOptimization({ customPrompt: promptText, targetDestId: destId, targetBudget: budget });
  };

  const triggerAiOptimization = async (override = {}) => {
    setIsAiOptimizing(true);
    setAiStatusMsg('Consulting Gemini 2.5 Flash Travel Intelligence...');

    const destToUse = override.targetDestId 
      ? (DESTINATIONS.find(d => d.id === override.targetDestId) || currentDest)
      : currentDest;

    const budgetToUse = override.targetBudget || tripParams.budget;
    const promptToUse = override.customPrompt !== undefined ? override.customPrompt : aiPrompt;

    try {
      setTimeout(() => {
        setAiStatusMsg('Calculating transit buffers & multi-portal hotel rates...');
      }, 400);

      const generatedTrip = await generateAiTripPlan({
        sourceCity: tripParams.sourceCity,
        destinationId: destToUse.id,
        destinationName: destToUse.name,
        startDate: tripParams.startDate,
        endDate: tripParams.endDate,
        travelers: tripParams.travelers,
        budget: budgetToUse,
        pace: tripPace,
        styles: selectedStyles,
        aiPrompt: promptToUse
      });

      // Save to Supabase and local store
      const savedTrip = await createTrip(generatedTrip);

      // Celebratory Confetti Trigger
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#c4963d', '#0b221d', '#ffffff', '#25d366']
      });

      setIsAiOptimizing(false);
      if (onGeneratePlan) {
        onGeneratePlan(savedTrip);
      }
    } catch (err) {
      console.error('Trip generation error:', err);
      setIsAiOptimizing(false);
      if (onGeneratePlan) onGeneratePlan();
    }
  };

  return (
    <section className="hero-section" style={{
      backgroundImage: `linear-gradient(180deg, rgba(8, 26, 21, 0.82) 0%, rgba(5, 20, 16, 0.94) 100%), url(${currentDest.heroImage})`
    }}>
      <div className="container hero-container">
        
        {/* Top Badges */}
        <div className="hero-eyebrows-wrap">
          <div className="hero-badge">
            <Sparkles size={14} className="sparkle-glow" />
            <span>AI TRIP PLANNER 3.0 • CENTRAL ONBOARDING CONSOLE</span>
          </div>

          <div className="preset-chips">
            {DESTINATIONS.map(d => (
              <button
                key={d.id}
                type="button"
                className={`preset-chip ${d.id === selectedDest.id ? 'active' : ''}`}
                onClick={() => handlePresetClick(d.id, d.recommendedBudget)}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Title */}
        <div className="hero-text-block">
          <h1 className="hero-title">
            Bespoke Itineraries. <br />
            <span className="hero-title-highlight">Engineered by Travel AI.</span>
          </h1>
          <p className="hero-lead">
            Input your travel dates and budget to generate an hour-by-hour schedule with realistic transit buffers 
            and multi-website booking price comparisons across MakeMyTrip, Agoda, Booking.com, and IRCTC.
          </p>
        </div>

        {/* Glassmorphic Central Card with Glowing Edges */}
        <div className="glass-planner-card animate-fade-in">
          <div className="glowing-border-beam"></div>

          {/* Planner Mode Switcher */}
          <div className="planner-tab-bar">
            <button
              type="button"
              className={`planner-tab ${activeTab === 'smart-ai' ? 'active' : ''}`}
              onClick={() => setActiveTab('smart-ai')}
            >
              <Wand2 size={16} />
              <span>Smart AI Configurator</span>
            </button>
            <button
              type="button"
              className={`planner-tab ${activeTab === 'prompt' ? 'active' : ''}`}
              onClick={() => setActiveTab('prompt')}
            >
              <Sparkles size={16} />
              <span>Natural Language AI Prompt</span>
            </button>
          </div>

          {activeTab === 'smart-ai' ? (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                triggerAiOptimization();
              }}
              className="planner-form"
            >
              {/* Primary 4-Field Grid */}
              <div className="planner-grid-4">
                
                {/* 1. Source */}
                <div className="form-field">
                  <label className="field-label">
                    <Compass size={14} /> DEPARTURE CITY
                  </label>
                  <select
                    value={tripParams.sourceCity}
                    onChange={e => setTripParams({ ...tripParams, sourceCity: e.target.value })}
                    className="field-input select-styled"
                  >
                    {SOURCE_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Destination */}
                <div className="form-field">
                  <label className="field-label">
                    <MapPin size={14} /> DESTINATION
                  </label>
                  <select
                    value={tripParams.destinationId}
                    onChange={e => {
                      const newId = e.target.value;
                      setSelectedDestId(newId);
                      const matched = DESTINATIONS.find(d => d.id === newId);
                      if (matched) {
                        setTripParams({
                          ...tripParams,
                          destinationId: newId,
                          budget: matched.recommendedBudget
                        });
                      }
                    }}
                    className="field-input select-styled"
                  >
                    {DESTINATIONS.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.state})</option>
                    ))}
                  </select>
                </div>

                {/* 3. Dates */}
                <div className="form-field">
                  <label className="field-label">
                    <Calendar size={14} /> DATES
                  </label>
                  <div className="date-inputs-row">
                    <input
                      type="date"
                      value={tripParams.startDate}
                      onChange={e => setTripParams({ ...tripParams, startDate: e.target.value })}
                      className="field-input date-input"
                    />
                    <span className="date-sep">to</span>
                    <input
                      type="date"
                      value={tripParams.endDate}
                      onChange={e => setTripParams({ ...tripParams, endDate: e.target.value })}
                      className="field-input date-input"
                    />
                  </div>
                </div>

                {/* 4. Travelers */}
                <div className="form-field">
                  <label className="field-label">
                    <Users size={14} /> TRAVELERS
                  </label>
                  <select
                    value={tripParams.travelers}
                    onChange={e => setTripParams({ ...tripParams, travelers: Number(e.target.value) })}
                    className="field-input select-styled"
                  >
                    <option value={1}>1 Solo Nomad</option>
                    <option value={2}>2 Adults (Couple / Duo)</option>
                    <option value={3}>3 Friends Group</option>
                    <option value={4}>4 Family / Friends</option>
                    <option value={6}>6+ Group Expedition</option>
                  </select>
                </div>

              </div>

              {/* Advanced AI Preferences Row */}
              <div className="advanced-ai-row">
                
                {/* Budget Slider & Quick Caps */}
                <div className="advanced-col-budget">
                  <div className="budget-head">
                    <label className="field-label">
                      <IndianRupee size={14} /> TOTAL TRIP BUDGET
                    </label>
                    <span className="budget-highlight">₹{tripParams.budget.toLocaleString()}</span>
                  </div>
                  
                  <div className="budget-slider-wrapper">
                    <input 
                      type="range"
                      min="10000"
                      max="150000"
                      step="2000"
                      value={tripParams.budget}
                      onChange={e => setTripParams({ ...tripParams, budget: Number(e.target.value) })}
                      className="budget-range-slider"
                    />
                  </div>

                  <div className="quick-budget-pills">
                    {[18000, 28000, 50000, 90000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        className={`quick-pill ${tripParams.budget === amt ? 'active' : ''}`}
                        onClick={() => setTripParams({ ...tripParams, budget: amt })}
                      >
                        ₹{(amt / 1000)}k
                      </button>
                    ))}
                  </div>
                </div>

                {/* Travel Pace Preference */}
                <div className="advanced-col-pace">
                  <label className="field-label">
                    <Activity size={14} /> ITINERARY PACE
                  </label>
                  <div className="pace-options">
                    {TRIP_PACES.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        className={`pace-btn ${tripPace === p.id ? 'active' : ''}`}
                        onClick={() => setTripPace(p.id)}
                      >
                        <span className="pace-icon">{p.icon}</span>
                        <span className="pace-name">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Tags */}
                <div className="advanced-col-styles">
                  <label className="field-label">
                    <Sliders size={14} /> TRIP FOCUS & VIBE
                  </label>
                  <div className="style-chips-wrap">
                    {TRIP_STYLES.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        className={`style-chip ${selectedStyles.includes(s.id) ? 'selected' : ''}`}
                        onClick={() => toggleStyle(s.id)}
                      >
                        {selectedStyles.includes(s.id) && <Check size={12} />}
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Bar */}
              <div className="planner-submit-bar">
                <div className="planner-guarantee">
                  <ShieldCheck size={16} className="shield-icon" />
                  <span>Calculates transit buffer time & multi-portal booking prices</span>
                </div>

                <button 
                  type="submit" 
                  className="btn-gold planner-generate-btn"
                  disabled={isAiOptimizing}
                >
                  {isAiOptimizing ? (
                    <>
                      <div className="spinner-mini"></div>
                      <span>{aiStatusMsg}</span>
                    </>
                  ) : (
                    <>
                      <Wand2 size={18} />
                      <span>Generate AI Itinerary</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (
            /* Natural Language AI Prompt Interface */
            <div className="prompt-mode-wrap">
              <div className="prompt-input-box">
                <textarea
                  className="prompt-textarea"
                  rows={3}
                  placeholder="E.g., 'Plan a 4-day relaxing getaway to Goa for 2 adults under ₹30,000 with sea view dinners, beach shacks, and minimal travel stress...'"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                />
                <div className="prompt-actions-row">
                  <div className="prompt-hints">
                    <span>💡 Tip: Mention budget, duration, or favorite activities.</span>
                  </div>
                  <button
                    type="button"
                    className="btn-gold"
                    onClick={() => triggerAiOptimization()}
                    disabled={isAiOptimizing}
                  >
                    {isAiOptimizing ? aiStatusMsg : 'Build from Prompt ➔'}
                  </button>
                </div>
              </div>

              {/* Suggested Quick Prompts */}
              <div className="quick-prompts-row">
                <span className="prompts-label">POPULAR PROMPTS:</span>
                <button
                  type="button"
                  className="quick-prompt-btn"
                  onClick={() => handleAiQuickPrompt(
                    'Budget-conscious mountain getaway in Manali with pine forest treks & cafe hopping',
                    'manali',
                    24000
                  )}
                >
                  🏔️ Manali 5D Backpacking (₹24k)
                </button>
                <button
                  type="button"
                  className="quick-prompt-btn"
                  onClick={() => handleAiQuickPrompt(
                    'Romantic Portuguese heritage & sunset cruise in North & South Goa',
                    'goa',
                    34000
                  )}
                >
                  🌴 Romantic Goa Villas (₹34k)
                </button>
                <button
                  type="button"
                  className="quick-prompt-btn"
                  onClick={() => handleAiQuickPrompt(
                    'Royal palaces, mirror stepwell, and Rajasthani thalis in Jaipur',
                    'jaipur',
                    28000
                  )}
                >
                  👑 Royal Jaipur Weekend (₹28k)
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      <style>{`
        .hero-section {
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          padding: 64px 0 88px;
          color: #ffffff;
          position: relative;
          z-index: 2;
        }

        .hero-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 3;
        }

        .hero-eyebrows-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(11, 34, 29, 0.75);
          border: 1px solid rgba(196, 150, 61, 0.6);
          color: #fcebc7;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 6px 16px;
          border-radius: var(--radius-full);
          backdrop-filter: blur(8px);
        }

        .sparkle-glow {
          color: #c4963d;
        }

        .preset-chips {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
        }

        .preset-chip {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: #f1f4f3;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          backdrop-filter: blur(8px);
          transition: all var(--transition-fast);
        }

        .preset-chip:hover {
          background: rgba(255, 255, 255, 0.22);
          border-color: #ffffff;
        }

        .preset-chip.active {
          background: #c4963d;
          border-color: #c4963d;
          color: #051411;
          font-weight: 800;
          box-shadow: 0 4px 14px rgba(196, 150, 61, 0.45);
        }

        .hero-text-block {
          max-width: 860px;
          margin-bottom: 32px;
        }

        .hero-title {
          font-size: clamp(2.3rem, 4.5vw, 3.6rem);
          font-weight: 800;
          line-height: 1.15;
          color: #ffffff;
          margin-bottom: 14px;
        }

        .hero-title-highlight {
          color: #f5e4bf;
        }

        .hero-lead {
          font-size: 1.05rem;
          line-height: 1.6;
          color: #d8e5e1;
          max-width: 720px;
          margin: 0 auto;
        }

        /* Glassmorphic Central Card with Glowing Edges */
        .glass-planner-card {
          width: 100%;
          max-width: 1140px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: var(--radius-xl);
          padding: 26px 30px;
          box-shadow: 0 24px 60px rgba(5, 20, 16, 0.45), 0 0 35px rgba(196, 150, 61, 0.25);
          border: 1px solid rgba(196, 150, 61, 0.45);
          color: var(--color-text);
          text-align: left;
          position: relative;
          overflow: hidden;
        }

        .glowing-border-beam {
          position: absolute;
          inset: 0;
          border-radius: var(--radius-xl);
          padding: 2px;
          background: linear-gradient(135deg, rgba(196, 150, 61, 0.6), rgba(11, 34, 29, 0.2), rgba(196, 150, 61, 0.6));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .planner-tab-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          border-bottom: 1.5px solid var(--color-border-light);
          padding-bottom: 12px;
        }

        .planner-tab {
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text-secondary);
          background: #faf3e5;
          transition: all var(--transition-fast);
        }

        .planner-tab.active {
          background: var(--color-primary);
          color: #ffffff;
        }

        .planner-grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--color-primary-dark);
        }

        .field-input {
          background: #ffffff;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 0.92rem;
          padding: 10px 12px;
          font-weight: 600;
          color: var(--color-text);
        }

        .field-input:focus {
          border-color: var(--color-primary);
        }

        .select-styled {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230b221d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 14px;
          padding-right: 32px;
          cursor: pointer;
        }

        .date-inputs-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .date-input {
          padding: 8px 6px;
          font-size: 0.82rem;
        }

        .date-sep {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          font-weight: 600;
        }

        .advanced-ai-row {
          background: #fbf9f4;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 18px 20px;
          display: grid;
          grid-template-columns: 1.4fr 1fr 1.3fr;
          gap: 24px;
          margin-bottom: 22px;
        }

        .budget-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .budget-highlight {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--color-primary-dark);
        }

        .budget-slider-wrapper {
          margin-bottom: 8px;
        }

        .budget-range-slider {
          width: 100%;
          accent-color: var(--color-primary);
          cursor: pointer;
        }

        .quick-budget-pills {
          display: flex;
          gap: 6px;
        }

        .quick-pill {
          background: #ffffff;
          border: 1px solid var(--color-border);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: var(--radius-sm);
          color: var(--color-text-secondary);
        }

        .quick-pill.active {
          background: var(--color-primary-soft);
          color: var(--color-primary);
          border-color: var(--color-primary);
        }

        .pace-options {
          display: flex;
          gap: 6px;
        }

        .pace-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 8px 6px;
          background: #ffffff;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--color-text-secondary);
        }

        .pace-btn.active {
          background: var(--color-primary);
          color: #ffffff;
          border-color: var(--color-primary);
        }

        .style-chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .style-chip {
          background: #ffffff;
          border: 1px solid var(--color-border);
          padding: 5px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-text-secondary);
        }

        .style-chip.selected {
          background: #e8f2ef;
          color: var(--color-primary);
          border-color: var(--color-primary);
          font-weight: 700;
        }

        .planner-submit-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding-top: 10px;
          flex-wrap: wrap;
        }

        .planner-guarantee {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--color-text-secondary);
        }

        .shield-icon {
          color: var(--color-success);
        }

        .planner-generate-btn {
          padding: 13px 28px;
          font-size: 0.98rem;
          font-weight: 700;
          border-radius: var(--radius-md);
          min-width: 220px;
        }

        .spinner-mini {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .prompt-mode-wrap {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .prompt-textarea {
          width: 100%;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          font-size: 0.95rem;
          font-family: inherit;
          resize: none;
          outline: none;
          background: #ffffff;
        }

        .prompt-textarea:focus {
          border-color: var(--color-primary);
        }

        .prompt-actions-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
        }

        .prompt-hints {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        .quick-prompts-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 10px;
          border-top: 1px solid var(--color-border-light);
        }

        .prompts-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--color-text-muted);
        }

        .quick-prompt-btn {
          background: #faf3e5;
          border: 1px solid var(--color-border);
          padding: 5px 12px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-text-secondary);
        }

        .quick-prompt-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        @media (max-width: 990px) {
          .planner-grid-4 {
            grid-template-columns: 1fr 1fr;
          }
          .advanced-ai-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .glass-planner-card {
            padding: 18px 16px;
          }
          .planner-grid-4 {
            grid-template-columns: 1fr;
          }
          .planner-submit-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .planner-generate-btn {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
