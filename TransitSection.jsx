import React, { useState } from 'react';
import { 
  Train, 
  Plane, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  Zap,
  Tag,
  Award,
  Layers,
  CheckCircle2,
  Search
} from 'lucide-react';
import { PartnerLogo } from './PartnerLogos';

export default function TransitSection({ destination, tripParams, onOpenRedirectModal }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'flights', 'trains'
  const [preferenceFilter, setPreferenceFilter] = useState('all'); // 'all', 'cheapest', 'fastest', 'comfort'
  const [searchQuery, setSearchQuery] = useState('');

  const { flights = [], trains = [] } = destination.transits || {};

  const allItems = [
    ...flights.map(f => ({ ...f, transitType: 'flight' })),
    ...trains.map(t => ({ ...t, transitType: 'train' }))
  ];

  const filteredItems = allItems.filter(item => {
    if (activeTab === 'flights' && item.transitType !== 'flight') return false;
    if (activeTab === 'trains' && item.transitType !== 'train') return false;
    if (preferenceFilter !== 'all' && item.badgeType !== preferenceFilter) return false;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (item.airline || item.name || '').toLowerCase().includes(q);
      const matchFrom = (item.from || '').toLowerCase().includes(q);
      const matchTo = (item.to || '').toLowerCase().includes(q);
      const matchNum = (item.flightNumber || item.trainNumber || '').toString().toLowerCase().includes(q);
      if (!matchName && !matchFrom && !matchTo && !matchNum) return false;
    }

    return true;
  });

  const getBadgeIcon = (type) => {
    switch (type) {
      case 'cheapest': return <Tag size={13} />;
      case 'fastest': return <Zap size={13} />;
      case 'comfort': return <Award size={13} />;
      default: return <Sparkles size={13} />;
    }
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case 'cheapest': return 'tag-cheapest';
      case 'fastest': return 'tag-fastest';
      case 'comfort': return 'tag-comfort';
      default: return 'tag-general';
    }
  };

  return (
    <section className="section-spacing transit-section" id="transits">
      <div className="container">
        
        <div className="transit-header">
          <div>
            <span className="eyebrow">
              <Train size={14} /> MULTI-PLATFORM BOOKING COMPARISON ENGINE
            </span>
            <h2 className="section-title">Compare Prices Across All Booking Portals</h2>
            <p className="section-desc">
              Check live fares for <strong>{tripParams.sourceCity} ➔ {destination.name}</strong> across 
              MakeMyTrip, EaseMyTrip, IRCTC, Yatra, ixigo & Official Airlines. Book directly on your preferred site.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="transit-mode-switcher">
            <button
              type="button"
              className={`mode-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Transit ({allItems.length})
            </button>
            <button
              type="button"
              className={`mode-btn ${activeTab === 'flights' ? 'active' : ''}`}
              onClick={() => setActiveTab('flights')}
            >
              <Plane size={15} /> Flights ({flights.length})
            </button>
            <button
              type="button"
              className={`mode-btn ${activeTab === 'trains' ? 'active' : ''}`}
              onClick={() => setActiveTab('trains')}
            >
              <Train size={15} /> Trains ({trains.length})
            </button>
          </div>
        </div>

        {/* Search Bar & Preference quick filters */}
        <div className="transit-controls-bar">
          <div className="transit-search-input-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="transit-search-input"
              placeholder="Search flights, trains, station codes or operators (e.g. Vande Bharat, IndiGo, BOM)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          <div className="pref-filter-row">
            <span className="pref-label">FILTER:</span>
            {[
              { key: 'all', label: 'All Routes' },
              { key: 'cheapest', label: 'Cheapest Option', icon: <Tag size={13} /> },
              { key: 'fastest', label: 'Fastest Transit', icon: <Zap size={13} /> },
              { key: 'comfort', label: 'Most Comfortable', icon: <Award size={13} /> }
            ].map(pref => (
              <button
                key={pref.key}
                type="button"
                className={`pref-chip ${preferenceFilter === pref.key ? 'active' : ''}`}
                onClick={() => setPreferenceFilter(pref.key)}
              >
                {pref.icon}
                <span>{pref.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Transit Cards Grid */}
        <div className="transit-cards-grid card-3d-wrapper">
          {filteredItems.map(item => {
            const isFlight = item.transitType === 'flight';
            const options = item.platformOptions || [
              { platform: isFlight ? 'MakeMyTrip' : 'IRCTC Official', price: 3200, isLowest: true, badge: 'Best Fare', url: 'https://www.makemytrip.com' }
            ];
            const lowestPrice = Math.min(...options.map(o => o.price));

            return (
              <div key={item.id} className="transit-card card-luxury card-3d-tilt tech-border-glow">
                
                {/* Header with Type & Badging */}
                <div className="transit-card-top">
                  <div className="operator-block">
                    <div className="operator-icon-badge">
                      {isFlight ? <Plane size={18} /> : <Train size={18} />}
                    </div>
                    <div>
                      <h3 className="operator-name">
                        {isFlight ? item.airline : item.name}
                      </h3>
                      <span className="operator-num">
                        {isFlight ? item.flightNumber : `#${item.trainNumber}`} • {isFlight ? item.type : 'Superfast Express'}
                      </span>
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`recommendation-tag ${getBadgeClass(item.badgeType)}`}>
                      {getBadgeIcon(item.badgeType)}
                      <span>{item.badge}</span>
                    </span>
                  )}
                </div>

                {/* Schedule Box */}
                <div className="schedule-box">
                  <div className="station-point">
                    <span className="time-text">{item.deptTime}</span>
                    <span className="station-text">{item.from}</span>
                  </div>

                  <div className="duration-divider">
                    <span className="duration-label">
                      <Clock size={12} /> {item.duration}
                    </span>
                    <div className="duration-line">
                      <span className="line-dot start"></span>
                      <span className="line-bar"></span>
                      <span className="line-dot end"></span>
                    </div>
                    <span className="transit-tag-mini">{isFlight ? 'Non-stop Flight' : 'Reserved Berth'}</span>
                  </div>

                  <div className="station-point align-right">
                    <span className="time-text">{item.arrTime}</span>
                    <span className="station-text">{item.to}</span>
                  </div>
                </div>

                {/* Why this is recommended */}
                <div className="reason-bubble">
                  <span className="reason-label">ROUTE INTELLIGENCE:</span>
                  <p className="reason-text">{item.reason}</p>
                </div>

                {/* Multi-Platform Price Comparison Table */}
                <div className="platforms-comparison-box">
                  <div className="platforms-box-header">
                    <Layers size={13} />
                    <span>Compare Booking Sites ({options.length} Options)</span>
                  </div>

                  <div className="platforms-list">
                    {options.map((opt, idx) => (
                      <div key={idx} className={`platform-row ${opt.isLowest ? 'lowest-row' : ''}`}>
                        <div className="platform-info">
                          <PartnerLogo platform={opt.platform} size={20} />
                          <span className="platform-name-text" title={opt.platform}>{opt.platform}</span>
                          {opt.badge && (
                            <span className={`platform-chip-badge ${opt.isLowest ? 'chip-lowest' : ''}`}>
                              {opt.badge}
                            </span>
                          )}
                        </div>

                        <div className="platform-price-action">
                          <strong className="platform-fare-val">₹{opt.price.toLocaleString()}</strong>
                          <button
                            type="button"
                            className={`platform-book-btn ${opt.isLowest ? 'btn-lowest' : ''}`}
                            onClick={() => onOpenRedirectModal({
                              type: isFlight ? 'Flight' : 'Train',
                              title: isFlight ? `${item.airline} ${item.flightNumber}` : `${item.name} (#${item.trainNumber})`,
                              platform: opt.platform,
                              url: opt.url,
                              price: opt.price,
                              source: item.from,
                              destination: item.to,
                              details: item.reason,
                              allPlatforms: options
                            })}
                          >
                            <span>Book</span>
                            <ExternalLink size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom */}
                <div className="transit-card-footer">
                  <div>
                    <span className="price-label">LOWEST AVAILABLE FARE</span>
                    <div className="price-val-row">
                      <strong className="price-num">₹{lowestPrice.toLocaleString()}</strong>
                      <span className="price-sub">/ traveler</span>
                    </div>
                  </div>
                  <span className="compare-tag-note">
                    <CheckCircle2 size={13} className="check-icon" /> Select preferred portal above
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="redirect-note-box">
          <ShieldCheck size={18} className="shield-icon" />
          <span>
            <strong>Zero Markup Guarantee:</strong> Travelflow compares prices across MakeMyTrip, EaseMyTrip, IRCTC, ixigo & Yatra. Choose your preferred website to complete the booking with zero middleman fees.
          </span>
        </div>

      </div>

      <style>{`
        .transit-section {
          background: transparent;
        }

        .transit-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .transit-mode-switcher {
          display: flex;
          background: #ffffff;
          padding: 4px;
          border-radius: var(--radius-full);
          border: 1.5px solid var(--color-border);
        }

        .mode-btn {
          padding: 8px 18px;
          border-radius: var(--radius-full);
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
        }

        .mode-btn.active {
          background: var(--color-primary);
          color: #ffffff;
        }

        .transit-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 26px;
          flex-wrap: wrap;
        }

        .transit-search-input-box {
          flex: 1;
          min-width: 280px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .transit-search-input-box .search-icon {
          position: absolute;
          left: 14px;
          color: var(--color-accent);
        }

        .transit-search-input {
          padding-left: 40px;
          padding-right: 36px;
          background: #ffffff;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md, 4px);
          font-size: 0.88rem;
        }

        .clear-search-btn {
          position: absolute;
          right: 12px;
          font-size: 0.8rem;
          color: var(--color-text-muted);
          background: none;
          border: none;
          cursor: pointer;
        }

        /* Preference filters */
        .pref-filter-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pref-label {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--color-text-muted);
        }

        .pref-chip {
          padding: 5px 12px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 700;
          background: #ffffff;
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
        }

        .pref-chip.active {
          background: var(--color-accent-light);
          color: #8a671b;
          border-color: var(--color-accent);
        }

        /* Grid */
        .transit-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
          align-items: stretch;
        }

        .transit-card {
          padding: 22px;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          height: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }

        .transit-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 16px;
          min-height: 44px;
        }

        .operator-block {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .operator-icon-badge {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--color-primary-soft);
          color: var(--color-primary);
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .operator-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-primary-dark);
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .operator-num {
          font-size: 0.76rem;
          color: var(--color-text-muted);
          white-space: nowrap;
        }

        .recommendation-tag {
          font-size: 0.70rem;
          font-weight: 800;
          padding: 4px 9px;
          border-radius: var(--radius-full);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .tag-cheapest { background: #edfcf2; color: #15803d; border: 1px solid #bbf7d0; }
        .tag-fastest { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
        .tag-comfort { background: var(--color-accent-light); color: #8a671b; border: 1px solid rgba(196, 150, 61, 0.4); }

        /* Schedule Box */
        .schedule-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          background: #f7faf9;
          border-radius: var(--radius-md);
          margin-bottom: 16px;
          box-sizing: border-box;
          width: 100%;
        }

        .station-point {
          display: flex;
          flex-direction: column;
          min-width: 80px;
        }

        .station-point.align-right {
          text-align: right;
        }

        .time-text {
          font-size: 1.18rem;
          font-weight: 800;
          color: var(--color-primary-dark);
        }

        .station-text {
          font-size: 0.76rem;
          color: var(--color-text-muted);
          margin-top: 2px;
          white-space: nowrap;
        }

        .duration-divider {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          flex: 1;
          padding: 0 12px;
        }

        .duration-label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-text-secondary);
        }

        .duration-line {
          width: 100%;
          display: flex;
          align-items: center;
        }

        .line-bar {
          height: 2px;
          background: var(--color-border);
          flex-grow: 1;
        }

        .line-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-primary);
        }

        .transit-tag-mini {
          font-size: 0.66rem;
          color: var(--color-text-muted);
        }

        .reason-bubble {
          background: #ffffff;
          border: 1px solid var(--color-border-light);
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.80rem;
          margin-bottom: 16px;
          min-height: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .reason-label {
          font-size: 0.66rem;
          font-weight: 800;
          color: var(--color-accent);
          display: block;
          margin-bottom: 2px;
        }

        .reason-text {
          color: var(--color-text-secondary);
          line-height: 1.35;
        }

        /* Platforms Comparison Box */
        .platforms-comparison-box {
          background: #f8faf9;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 12px;
          margin-bottom: 18px;
          flex: 1;
          box-sizing: border-box;
          width: 100%;
          overflow: hidden;
        }

        .platforms-box-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.73rem;
          font-weight: 800;
          color: var(--color-primary-dark);
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .platforms-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .platform-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          background: #ffffff;
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border-light);
          transition: border-color var(--transition-fast);
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }

        .platform-row.lowest-row {
          border-color: #bbf7d0;
          background: #f6fcf8;
        }

        .platform-info {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
          flex: 1 1 auto;
          overflow: hidden;
        }

        .platform-name-text {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex-shrink: 1;
        }

        .platform-chip-badge {
          font-size: 0.63rem;
          font-weight: 800;
          background: var(--color-surface-muted);
          color: var(--color-text-secondary);
          padding: 2px 5px;
          border-radius: 4px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .platform-chip-badge.chip-lowest {
          background: var(--color-success-bg);
          color: var(--color-success);
        }

        .platform-price-action {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          margin-left: auto;
        }

        .platform-fare-val {
          font-size: 0.90rem;
          font-weight: 800;
          color: var(--color-primary-dark);
          white-space: nowrap;
        }

        .platform-book-btn {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 5px 10px;
          border-radius: var(--radius-sm);
          background: var(--color-primary-soft);
          color: var(--color-primary);
          border: 1px solid rgba(11, 34, 29, 0.15);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          flex-shrink: 0;
          cursor: pointer;
        }

        .platform-book-btn.btn-lowest {
          background: var(--color-primary);
          color: #ffffff;
          border-color: var(--color-primary);
        }

        .platform-book-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(11, 34, 29, 0.15);
        }

        /* Footer */
        .transit-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid var(--color-border-light);
        }

        .price-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--color-text-muted);
        }

        .price-num {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--color-primary-dark);
        }

        .price-sub {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-left: 4px;
        }

        .compare-tag-note {
          font-size: 0.74rem;
          color: var(--color-success);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .redirect-note-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ffffff;
          border: 1px solid var(--color-border);
          padding: 16px 20px;
          border-radius: var(--radius-md);
          font-size: 0.86rem;
          color: var(--color-text-secondary);
        }

        .shield-icon {
          color: var(--color-primary);
          flex-shrink: 0;
        }

        @media (max-width: 600px) {
          .transit-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

