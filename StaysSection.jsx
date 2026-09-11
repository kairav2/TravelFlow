import React, { useState } from 'react';
import { 
  Building2, 
  Star, 
  MapPin, 
  ExternalLink, 
  Check, 
  Layers,
  CheckCircle2,
  Search
} from 'lucide-react';
import { PartnerLogo } from './PartnerLogos';

export default function StaysSection({ destination, tripParams = {}, onOpenRedirectModal, onSelectStay }) {
  const [filterTier, setFilterTier] = useState('all');
  const [searchStayQuery, setSearchStayQuery] = useState('');
  const stays = destination.stays || [];

  const calculateNights = () => {
    if (tripParams?.startDate && tripParams?.endDate) {
      const s = new Date(tripParams.startDate);
      const e = new Date(tripParams.endDate);
      const diff = Math.round((e - s) / (1000 * 60 * 60 * 24));
      if (!isNaN(diff) && diff > 0) return diff;
    }
    return Math.max(1, (destination.defaultDays || 4) - 1);
  };
  const nights = calculateNights();

  const filteredStays = stays.filter(s => {
    if (filterTier !== 'all' && s.tier !== filterTier) return false;
    if (searchStayQuery.trim()) {
      const q = searchStayQuery.toLowerCase();
      const matchName = (s.name || '').toLowerCase().includes(q);
      const matchLoc = (s.location || '').toLowerCase().includes(q);
      const matchType = (s.type || '').toLowerCase().includes(q);
      const matchAm = (s.amenities || []).some(a => a.toLowerCase().includes(q));
      if (!matchName && !matchLoc && !matchType && !matchAm) return false;
    }
    return true;
  });

  return (
    <section className="section-spacing stays-section" id="stays">
      <div className="container">
        
        <div className="stays-header">
          <div>
            <span className="eyebrow">
              <Building2 size={14} /> MULTI-PORTAL HOTEL & HAVELI COMPARISON
            </span>
            <h2 className="section-title">Boutique Stays & Multi-Site Pricing</h2>
            <p className="section-desc">
              Compare nightly rates for <strong>{destination.name}</strong> across Booking.com, Agoda, MakeMyTrip, Goibibo & Hostelworld. Reserve on your preferred site.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="stays-controls-bar">
            <div className="stay-search-input-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="stay-search-input"
                placeholder="Search hotels, havelis, villas or amenities (e.g. Infinity Pool, Baga, Heritage)..."
                value={searchStayQuery}
                onChange={(e) => setSearchStayQuery(e.target.value)}
              />
              {searchStayQuery && (
                <button className="clear-search-btn" onClick={() => setSearchStayQuery('')}>✕</button>
              )}
            </div>

            <div className="stays-filter-pills">
              {['all', 'backpacker', 'comfort', 'luxury'].map(t => (
                <button
                  key={t}
                  type="button"
                  className={`filter-pill ${filterTier === t ? 'active' : ''}`}
                  onClick={() => setFilterTier(t)}
                >
                  {t === 'all' ? 'All Stays' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stays Grid */}
        <div className="stays-grid card-3d-wrapper">
          {filteredStays.map(stay => {
            const options = stay.platformOptions || [
              { platform: 'Booking.com', pricePerNight: stay.pricePerNight || 4500, isLowest: true, badge: 'Best Rate', url: 'https://www.booking.com' },
              { platform: 'MakeMyTrip', pricePerNight: (stay.pricePerNight || 4500) + 200, isLowest: false, badge: 'Verified', url: 'https://www.makemytrip.com' }
            ];

            const lowestRate = Math.min(...options.map(o => o.pricePerNight));

            return (
              <article key={stay.id} className="stay-card card-luxury card-3d-tilt tech-border-glow">
                
                {/* Photo Header */}
                <div 
                  className="stay-photo-wrap cursor-pointer"
                  onClick={() => onSelectStay && onSelectStay(stay)}
                  title="View detailed listing & verified amenities"
                >
                  <img 
                    src={stay.image} 
                    alt={stay.name}
                    className="stay-img" 
                    loading="lazy"
                  />
                  <div className="stay-badges-overlay">
                    <span className="stay-badge-pill">{stay.badge}</span>
                    <span className="stay-rating-pill">
                      <Star size={13} fill="#c4963d" stroke="#c4963d" />
                      <strong>{stay.rating}</strong>
                      <small>({stay.reviewsCount})</small>
                    </span>
                  </div>
                </div>

                {/* Details Body */}
                <div className="stay-body">
                  <div className="stay-type-row">
                    <span className="stay-type-text">{stay.type}</span>
                    <span className={`stay-tier-tag tier-${stay.tier}`}>{stay.tier.toUpperCase()}</span>
                  </div>

                  <h3 
                    className="stay-title cursor-pointer hover:text-[#C85A32] transition-colors"
                    onClick={() => onSelectStay && onSelectStay(stay)}
                  >
                    {stay.name}
                  </h3>

                  <div className="stay-location">
                    <MapPin size={14} />
                    <span>{stay.location}</span>
                  </div>

                  {/* Amenities */}
                  <div className="amenities-wrap">
                    {stay.amenities.map((am, i) => (
                      <span key={i} className="amenity-chip">
                        <Check size={12} className="am-check" />
                        <span>{am}</span>
                      </span>
                    ))}
                  </div>

                  {/* Multi-Platform Price Comparison */}
                  <div className="stay-platforms-box">
                    <div className="stay-box-title">
                      <Layers size={13} />
                      <span>Compare Rates ({options.length} Booking Portals)</span>
                    </div>

                    <div className="stay-platforms-list">
                      {options.map((opt, idx) => (
                        <div key={idx} className={`stay-platform-row ${opt.isLowest ? 'lowest-stay-row' : ''}`}>
                          <div className="stay-platform-left">
                            <PartnerLogo platform={opt.platform} size={20} />
                            <strong className="plat-name" title={opt.platform}>{opt.platform}</strong>
                            {opt.badge && (
                              <span className={`plat-chip ${opt.isLowest ? 'plat-lowest-chip' : ''}`}>
                                {opt.badge}
                              </span>
                            )}
                          </div>

                          <div className="stay-platform-right">
                            <div className="stay-rate-stack">
                              <span className="plat-rate">₹{opt.pricePerNight.toLocaleString()}</span>
                              <span className="plat-night-sub">/night</span>
                            </div>

                            <button
                              type="button"
                              className={`stay-book-site-btn ${opt.isLowest ? 'btn-lowest-site' : ''}`}
                              onClick={() => onOpenRedirectModal({
                                type: 'Hotel / Stay',
                                title: stay.name,
                                platform: opt.platform,
                                url: opt.url,
                                price: opt.pricePerNight * nights,
                                source: destination.name,
                                destination: stay.location,
                                details: `${nights} nights stay (${stay.type}) with instant confirmation.`,
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

                  {/* Pricing Footer */}
                  <div className="stay-footer">
                    <div>
                      <span className="price-label">BEST NIGHTLY RATE</span>
                      <div className="nightly-price-row">
                        <strong className="nightly-price">₹{lowestRate.toLocaleString()}</strong>
                        <span className="nightly-sub">/ night</span>
                      </div>
                      <span className="total-stay-sub">
                        ₹{(lowestRate * nights).toLocaleString()} total for {nights} nights
                      </span>
                    </div>

                    <span className="best-rate-note">
                      <CheckCircle2 size={14} className="check-icon" /> Guaranteed direct portal link
                    </span>
                  </div>

                </div>

              </article>
            );
          })}
        </div>

      </div>

      <style>{`
        .stays-section {
          background: transparent;
        }

        .stays-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 34px;
          flex-wrap: wrap;
        }

        .stays-controls-bar {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .stay-search-input-box {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 260px;
        }

        .stay-search-input-box .search-icon {
          position: absolute;
          left: 14px;
          color: var(--color-accent);
        }

        .stay-search-input {
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

        .stays-filter-pills {
          display: flex;
          gap: 6px;
          background: #ffffff;
          padding: 4px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
        }

        .filter-pill {
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-text-secondary);
        }

        .filter-pill.active {
          background: var(--color-primary);
          color: #ffffff;
        }

        .stays-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 24px;
          align-items: stretch;
        }

        .stay-card {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          overflow: hidden;
          height: 100%;
          box-sizing: border-box;
        }

        .stay-photo-wrap {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .stay-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }

        .stay-card:hover .stay-img {
          transform: scale(1.04);
        }

        .stay-badges-overlay {
          position: absolute;
          inset: 14px 14px auto 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stay-badge-pill {
          background: rgba(11, 34, 29, 0.88);
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          backdrop-filter: blur(6px);
        }

        .stay-rating-pill {
          background: rgba(255, 255, 255, 0.95);
          color: var(--color-primary-dark);
          font-size: 0.78rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 4px;
          backdrop-filter: blur(6px);
        }

        .stay-body {
          padding: 22px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .stay-type-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .stay-type-text {
          font-size: 0.74rem;
          font-weight: 800;
          color: var(--color-accent);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .stay-tier-tag {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .tier-luxury { background: #faf4e8; color: #8a671b; border: 1px solid #e8d09b; }
        .tier-comfort { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
        .tier-backpacker { background: #edfcf2; color: #15803d; border: 1px solid #bbf7d0; }

        .stay-title {
          font-size: 1.18rem;
          font-weight: 700;
          color: var(--color-primary-dark);
          margin-bottom: 6px;
          min-height: 44px;
          display: flex;
          align-items: center;
          line-height: 1.25;
        }

        .stay-location {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.82rem;
          color: var(--color-text-secondary);
          margin-bottom: 12px;
        }

        .amenities-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
          min-height: 48px;
          align-content: flex-start;
        }

        .amenity-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.73rem;
          background: #f4f7f6;
          color: var(--color-text-secondary);
          border: 1px solid var(--color-border-light);
          padding: 3px 8px;
          border-radius: 6px;
        }

        .am-check {
          color: var(--color-primary);
        }

        /* Stay Platforms Box */
        .stay-platforms-box {
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

        .stay-box-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.73rem;
          font-weight: 800;
          color: var(--color-primary-dark);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .stay-platforms-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }

        .stay-platform-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          padding: 7px 10px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border-light);
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }

        .stay-platform-row.lowest-stay-row {
          background: #f6fcf8;
          border-color: #bbf7d0;
        }

        .stay-platform-left {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
          flex: 1 1 auto;
          overflow: hidden;
        }

        .plat-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex-shrink: 1;
        }

        .plat-chip {
          font-size: 0.63rem;
          font-weight: 800;
          background: var(--color-surface-muted);
          color: var(--color-text-secondary);
          padding: 2px 5px;
          border-radius: 4px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .plat-chip.plat-lowest-chip {
          background: var(--color-success-bg);
          color: var(--color-success);
        }

        .stay-platform-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          margin-left: auto;
        }

        .stay-rate-stack {
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .plat-rate {
          font-size: 0.90rem;
          font-weight: 800;
          color: var(--color-primary-dark);
          white-space: nowrap;
        }

        .plat-night-sub {
          font-size: 0.66rem;
          color: var(--color-text-muted);
        }

        .stay-book-site-btn {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
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

        .stay-book-site-btn.btn-lowest-site {
          background: var(--color-primary);
          color: #ffffff;
          border-color: var(--color-primary);
        }

        /* Footer */
        .stay-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid var(--color-border-light);
        }

        .nightly-price-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .nightly-price {
          font-size: 1.30rem;
          font-weight: 800;
          color: var(--color-primary-dark);
        }

        .nightly-sub {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        .total-stay-sub {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          display: block;
        }

        .best-rate-note {
          font-size: 0.74rem;
          color: var(--color-success);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        @media (max-width: 600px) {
          .stays-grid {
            grid-template-columns: 1fr;
          }
          .stay-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </section>
  );
}

