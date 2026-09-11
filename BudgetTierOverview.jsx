import React from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Crown, 
  Backpack 
} from 'lucide-react';

export default function BudgetTierOverview({ 
  destination, 
  tripParams, 
  activeTier, 
  setActiveTier 
}) {
  const days = destination.defaultDays || 4;
  const travelers = tripParams.travelers || 1;
  const totalUserBudget = tripParams.budget || 30000;
  
  // Calculate daily budget per traveler based on user input
  const userDailyPerPerson = Math.round(totalUserBudget / (days * travelers));

  const tiers = destination.budgetTiers;

  // Budget allocations
  const breakdown = {
    stays: Math.round(totalUserBudget * 0.38),
    transit: Math.round(totalUserBudget * 0.26),
    food: Math.round(totalUserBudget * 0.22),
    activities: Math.round(totalUserBudget * 0.14)
  };

  const getTierStatus = (tierKey) => {
    const tierReq = tiers[tierKey].dailyPerPerson;
    if (userDailyPerPerson >= tierReq * 1.25) return { status: 'Surplus', color: 'var(--color-success)', text: 'High Comfort' };
    if (userDailyPerPerson >= tierReq * 0.85) return { status: 'Well Aligned', color: 'var(--color-primary)', text: 'Ideal Fit' };
    return { status: 'Stretch Needed', color: 'var(--color-warning)', text: 'Tighter Budget' };
  };

  return (
    <section className="section-spacing budget-section" id="budget-overview">
      <div className="container">
        
        <div className="section-header-row">
          <div>
            <span className="eyebrow">
              <TrendingUp size={15} /> BUDGET FEASIBILITY & TIER INTELLIGENCE
            </span>
            <h2 className="section-title">What your budget unlocks in {destination.name}</h2>
            <p className="section-desc">
              Your budget of <strong>₹{totalUserBudget.toLocaleString()}</strong> across {days} days ({travelers} {travelers > 1 ? 'travelers' : 'traveler'}) 
              equates to approx <strong>₹{userDailyPerPerson.toLocaleString()} / person / day</strong>.
            </p>
          </div>

          <div className="budget-meter-pill">
            <div className="meter-circle">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="meter-label">DAILY CAPACITY</div>
              <div className="meter-val">₹{userDailyPerPerson.toLocaleString()} / day</div>
            </div>
          </div>
        </div>

        {/* 3 Tier Cards Comparator */}
        <div className="tiers-grid">
          
          {/* 1. Backpacker Tier */}
          <div 
            className={`tier-card card-luxury ${activeTier === 'backpacker' ? 'active-tier' : ''}`}
            onClick={() => setActiveTier('backpacker')}
          >
            <div className="tier-head">
              <div className="tier-icon-wrap icon-backpacker">
                <Backpack size={20} />
              </div>
              <div>
                <span className="tier-subtitle">ESSENTIAL & AUTHENTIC</span>
                <h3 className="tier-title">{tiers.backpacker.label}</h3>
              </div>
            </div>

            <div className="tier-cost-badge">
              <strong>₹{tiers.backpacker.dailyPerPerson.toLocaleString()}</strong>
              <span>/ person / day</span>
            </div>

            <div className="tier-feasibility-pill" style={{ color: getTierStatus('backpacker').color }}>
              <span className="feasibility-dot" style={{ background: getTierStatus('backpacker').color }}></span>
              <span>{getTierStatus('backpacker').status} ({getTierStatus('backpacker').text})</span>
            </div>

            <p className="tier-intro">{tiers.backpacker.description}</p>

            <ul className="tier-specs-list">
              <li>
                <CheckCircle2 size={16} className="spec-check" />
                <span><strong>Stay:</strong> {tiers.backpacker.stayType}</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="spec-check" />
                <span><strong>Transit:</strong> {tiers.backpacker.transportType}</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="spec-check" />
                <span><strong>Dining:</strong> {tiers.backpacker.diningType}</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="spec-check" />
                <span><strong>Experiences:</strong> {tiers.backpacker.experiences}</span>
              </li>
            </ul>

            <button 
              type="button" 
              className={`tier-select-btn ${activeTier === 'backpacker' ? 'selected' : ''}`}
            >
              {activeTier === 'backpacker' ? 'Active Tier View' : 'Select Backpacker Tier'}
            </button>
          </div>

          {/* 2. Comfort Tier (Recommended) */}
          <div 
            className={`tier-card card-luxury popular-tier ${activeTier === 'comfort' ? 'active-tier' : ''}`}
            onClick={() => setActiveTier('comfort')}
          >
            <div className="tier-flag">RECOMMENDED VALUE</div>
            <div className="tier-head">
              <div className="tier-icon-wrap icon-comfort">
                <Zap size={20} />
              </div>
              <div>
                <span className="tier-subtitle">OPTIMAL BALANCE</span>
                <h3 className="tier-title">{tiers.comfort.label}</h3>
              </div>
            </div>

            <div className="tier-cost-badge">
              <strong>₹{tiers.comfort.dailyPerPerson.toLocaleString()}</strong>
              <span>/ person / day</span>
            </div>

            <div className="tier-feasibility-pill" style={{ color: getTierStatus('comfort').color }}>
              <span className="feasibility-dot" style={{ background: getTierStatus('comfort').color }}></span>
              <span>{getTierStatus('comfort').status} ({getTierStatus('comfort').text})</span>
            </div>

            <p className="tier-intro">{tiers.comfort.description}</p>

            <ul className="tier-specs-list">
              <li>
                <CheckCircle2 size={16} className="spec-check" />
                <span><strong>Stay:</strong> {tiers.comfort.stayType}</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="spec-check" />
                <span><strong>Transit:</strong> {tiers.comfort.transportType}</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="spec-check" />
                <span><strong>Dining:</strong> {tiers.comfort.diningType}</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="spec-check" />
                <span><strong>Experiences:</strong> {tiers.comfort.experiences}</span>
              </li>
            </ul>

            <button 
              type="button" 
              className={`tier-select-btn ${activeTier === 'comfort' ? 'selected' : ''}`}
            >
              {activeTier === 'comfort' ? 'Active Tier View' : 'Select Comfort Tier'}
            </button>
          </div>

          {/* 3. Luxury Tier */}
          <div 
            className={`tier-card card-luxury ${activeTier === 'luxury' ? 'active-tier' : ''}`}
            onClick={() => setActiveTier('luxury')}
          >
            <div className="tier-head">
              <div className="tier-icon-wrap icon-luxury">
                <Crown size={20} />
              </div>
              <div>
                <span className="tier-subtitle">BESPOKE INDULGENCE</span>
                <h3 className="tier-title">{tiers.luxury.label}</h3>
              </div>
            </div>

            <div className="tier-cost-badge">
              <strong>₹{tiers.luxury.dailyPerPerson.toLocaleString()}</strong>
              <span>/ person / day</span>
            </div>

            <div className="tier-feasibility-pill" style={{ color: getTierStatus('luxury').color }}>
              <span className="feasibility-dot" style={{ background: getTierStatus('luxury').color }}></span>
              <span>{getTierStatus('luxury').status} ({getTierStatus('luxury').text})</span>
            </div>

            <p className="tier-intro">{tiers.luxury.description}</p>

            <ul className="tier-specs-list">
              <li>
                <CheckCircle2 size={16} className="spec-check" />
                <span><strong>Stay:</strong> {tiers.luxury.stayType}</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="spec-check" />
                <span><strong>Transit:</strong> {tiers.luxury.transportType}</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="spec-check" />
                <span><strong>Dining:</strong> {tiers.luxury.diningType}</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="spec-check" />
                <span><strong>Experiences:</strong> {tiers.luxury.experiences}</span>
              </li>
            </ul>

            <button 
              type="button" 
              className={`tier-select-btn ${activeTier === 'luxury' ? 'selected' : ''}`}
            >
              {activeTier === 'luxury' ? 'Active Tier View' : 'Select Luxury Tier'}
            </button>
          </div>

        </div>

        {/* Smart Category Allocation Breakdown */}
        <div className="allocation-card card-luxury">
          <div className="allocation-header">
            <div>
              <h4 className="allocation-title">Recommended Budget Allocation ({destination.name})</h4>
              <p className="allocation-sub">Calculated for balanced comfort, zero stress transit, and dining flexibility.</p>
            </div>
            <div className="total-badge">
              Total ₹{totalUserBudget.toLocaleString()}
            </div>
          </div>

          {/* Progress Stack Bar */}
          <div className="progress-stack">
            <div className="bar-seg bar-stays" style={{ width: '38%' }} title="Stays & Hotels: 38%"></div>
            <div className="bar-seg bar-transit" style={{ width: '26%' }} title="Trains & Flights: 26%"></div>
            <div className="bar-seg bar-food" style={{ width: '22%' }} title="Dining & Cuisine: 22%"></div>
            <div className="bar-seg bar-activities" style={{ width: '14%' }} title="Activities & Sightseeing: 14%"></div>
          </div>

          {/* Legend Items */}
          <div className="allocation-legend-grid">
            <div className="legend-item">
              <span className="dot dot-stays"></span>
              <div>
                <div className="legend-label">Accommodations (38%)</div>
                <div className="legend-amount">₹{breakdown.stays.toLocaleString()}</div>
              </div>
            </div>

            <div className="legend-item">
              <span className="dot dot-transit"></span>
              <div>
                <div className="legend-label">Trains / Flights & Cabs (26%)</div>
                <div className="legend-amount">₹{breakdown.transit.toLocaleString()}</div>
              </div>
            </div>

            <div className="legend-item">
              <span className="dot dot-food"></span>
              <div>
                <div className="legend-label">Dining & Local Cafes (22%)</div>
                <div className="legend-amount">₹{breakdown.food.toLocaleString()}</div>
              </div>
            </div>

            <div className="legend-item">
              <span className="dot dot-activities"></span>
              <div>
                <div className="legend-label">Activities & Buffers (14%)</div>
                <div className="legend-amount">₹{breakdown.activities.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .budget-section {
          background: #faf7f2;
        }

        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }

        .section-title {
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          margin-bottom: 8px;
        }

        .section-desc {
          font-size: 1.05rem;
          color: var(--color-text-secondary);
          max-width: 680px;
        }

        .budget-meter-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ffffff;
          border: 1.5px solid var(--color-border);
          padding: 10px 18px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .meter-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--color-primary-soft);
          color: var(--color-primary);
          display: grid;
          place-items: center;
        }

        .meter-label {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--color-text-muted);
        }

        .meter-val {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-primary-dark);
        }

        /* Tiers Grid */
        .tiers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 40px;
        }

        .tier-card {
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          position: relative;
          cursor: pointer;
          background: #ffffff;
        }

        .tier-card.popular-tier {
          border-color: var(--color-accent);
          box-shadow: 0 10px 30px rgba(197, 160, 89, 0.18);
        }

        .tier-card.active-tier {
          border-color: var(--color-primary);
          box-shadow: 0 12px 34px rgba(20, 56, 49, 0.14);
          transform: translateY(-4px);
        }

        .tier-flag {
          position: absolute;
          top: -12px;
          right: 20px;
          background: var(--color-accent);
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          letter-spacing: 0.08em;
        }

        .tier-head {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }

        .tier-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          display: grid;
          place-items: center;
        }

        .icon-backpacker {
          background: #eef2f5;
          color: #2b6cb0;
        }

        .icon-comfort {
          background: var(--color-accent-light);
          color: #9a7322;
        }

        .icon-luxury {
          background: var(--color-primary-soft);
          color: var(--color-primary);
        }

        .tier-subtitle {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--color-text-muted);
          display: block;
        }

        .tier-title {
          font-size: 1.25rem;
          color: var(--color-primary-dark);
          margin-top: 2px;
        }

        .tier-cost-badge {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 14px;
        }

        .tier-cost-badge strong {
          font-size: 1.7rem;
          font-weight: 800;
          color: var(--color-primary);
        }

        .tier-cost-badge span {
          font-size: 0.82rem;
          color: var(--color-text-muted);
        }

        .tier-feasibility-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f7faf9;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 3px 8px;
          font-size: 0.72rem;
          font-weight: 800;
          margin-bottom: 12px;
          align-self: flex-start;
        }

        .feasibility-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .tier-intro {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          line-height: 1.55;
          margin-bottom: 20px;
          min-height: 42px;
        }

        .tier-specs-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
          flex-grow: 1;
        }

        .tier-specs-list li {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          font-size: 0.84rem;
          line-height: 1.45;
          color: var(--color-text);
        }

        .spec-check {
          color: var(--color-success);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .tier-select-btn {
          width: 100%;
          padding: 10px 16px;
          border-radius: var(--radius-md);
          font-size: 0.86rem;
          font-weight: 700;
          background: var(--color-surface-muted);
          color: var(--color-primary);
          border: 1px solid var(--color-border);
          transition: all var(--transition-fast);
        }

        .tier-select-btn.selected {
          background: var(--color-primary);
          color: #ffffff;
          border-color: var(--color-primary);
        }

        /* Allocation Card */
        .allocation-card {
          padding: 28px 32px;
          background: #ffffff;
        }

        .allocation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .allocation-title {
          font-size: 1.25rem;
          color: var(--color-primary-dark);
        }

        .allocation-sub {
          font-size: 0.86rem;
          color: var(--color-text-muted);
        }

        .total-badge {
          background: var(--color-accent-light);
          color: #8c671a;
          font-size: 0.9rem;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: var(--radius-full);
        }

        .progress-stack {
          height: 14px;
          border-radius: var(--radius-full);
          overflow: hidden;
          display: flex;
          margin-bottom: 22px;
          background: #f0ebe0;
        }

        .bar-seg {
          height: 100%;
          transition: width var(--transition-normal);
        }

        .bar-stays { background: #143831; }
        .bar-transit { background: #c5a059; }
        .bar-food { background: #2b6cb0; }
        .bar-activities { background: #48bb78; }

        .allocation-legend-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .legend-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-top: 4px;
          flex-shrink: 0;
        }

        .dot-stays { background: #143831; }
        .dot-transit { background: #c5a059; }
        .dot-food { background: #2b6cb0; }
        .dot-activities { background: #48bb78; }

        .legend-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-text-secondary);
        }

        .legend-amount {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--color-primary-dark);
          margin-top: 2px;
        }

        @media (max-width: 900px) {
          .tiers-grid {
            grid-template-columns: 1fr;
          }
          .allocation-legend-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </section>
  );
}
