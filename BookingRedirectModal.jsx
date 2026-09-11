import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Copy, 
  Check, 
  Layers 
} from 'lucide-react';
import { PartnerLogo } from './PartnerLogos';
import { generatePortalDeepLink } from '../services/bookingService';

export default function BookingRedirectModal({ redirectData, onClose }) {
  const [copied, setCopied] = useState(false);
  const [overrideSelection, setOverrideSelection] = useState(null);

  if (!redirectData) return null;

  const selectedPlatform = overrideSelection?.platform || redirectData.platform || 'MakeMyTrip';
  const selectedPrice = overrideSelection?.price || redirectData.price || 4500;
  
  // Compute best available deep link with search context
  const getDestinationUrl = () => {
    if (overrideSelection?.url && overrideSelection.url.length > 28) {
      return overrideSelection.url;
    }
    if (redirectData.url && redirectData.url.length > 28) {
      return redirectData.url;
    }
    return generatePortalDeepLink(
      {
        name: redirectData.title,
        destination: redirectData.destination,
        source: redirectData.source,
        transitType: redirectData.type === 'Transit' || redirectData.type === 'Flight' || redirectData.type === 'Train' ? 'transit' : 'stay',
        type: redirectData.type
      },
      selectedPlatform,
      {
        destination: redirectData.destination,
        sourceCity: redirectData.source
      }
    );
  };

  const selectedUrl = getDestinationUrl();

  const platforms = redirectData.allPlatforms || [
    { platform: selectedPlatform, price: selectedPrice, isLowest: true, badge: 'Standard Fare', url: selectedUrl }
  ];

  const handleSelectPlatform = (opt) => {
    setOverrideSelection({
      platform: opt.platform,
      price: opt.price || (opt.pricePerNight ? opt.pricePerNight * 3 : selectedPrice),
      url: opt.url
    });
  };

  const handleCopyParams = () => {
    const text = `Travelflow Booking Details:\nItem: ${redirectData.title}\nCategory: ${redirectData.type}\nSelected Portal: ${selectedPlatform}\nPrice: ₹${selectedPrice.toLocaleString()}\nRoute/Loc: ${redirectData.source || ''} → ${redirectData.destination || ''}\nURL: ${selectedUrl}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenLink = () => {
    if (selectedUrl) {
      window.open(selectedUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="overlay animate-fade-in" onClick={onClose}>
      <div className="redirect-modal card-luxury" onClick={e => e.stopPropagation()}>
        
        {/* Close button */}
        <button type="button" className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Top Header */}
        <div className="modal-header">
          <div className="redirect-icon-wrap">
            <PartnerLogo platform={selectedPlatform} size={32} />
          </div>
          <div>
            <span className="eyebrow eyebrow-dark">
              <ShieldCheck size={14} /> MULTI-WEBSITE REDIRECT ENGINE
            </span>
            <h3 className="modal-title">Book {redirectData.title}</h3>
            <p className="modal-subtitle">
              Choose your favorite booking portal below to proceed directly with your pre-filled travel search parameters.
            </p>
          </div>
        </div>

        {/* Multi-Website Selection Options */}
        <div className="platform-selection-container">
          <label className="platform-select-label">
            <Layers size={13} /> SELECT BOOKING WEBSITE ({platforms.length} OPTIONS):
          </label>
          
          <div className="modal-platforms-grid">
            {platforms.map((opt, idx) => {
              const optPrice = opt.price || (opt.pricePerNight ? opt.pricePerNight * 3 : selectedPrice);
              const isSelected = selectedPlatform === opt.platform;

              return (
                <div 
                  key={idx}
                  className={`modal-platform-card ${isSelected ? 'selected-card' : ''}`}
                  onClick={() => handleSelectPlatform(opt)}
                >
                  <div className="card-radio-row">
                    <input 
                      type="radio" 
                      name="booking_platform"
                      checked={isSelected}
                      onChange={() => handleSelectPlatform(opt)}
                    />
                    <PartnerLogo platform={opt.platform} size={22} />
                    <strong className="modal-plat-name">{opt.platform}</strong>
                    {opt.badge && (
                      <span className={`modal-badge ${opt.isLowest ? 'badge-lowest-price' : ''}`}>
                        {opt.badge}
                      </span>
                    )}
                  </div>

                  <div className="card-fare">
                    <strong>₹{optPrice.toLocaleString()}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Item Summary Box */}
        <div className="booking-summary-box">
          <div className="summary-row">
            <span className="summary-label">RESERVATION ITEM</span>
            <span className="summary-value item-highlight">{redirectData.title}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">SELECTED PORTAL</span>
            <span className="summary-value">{selectedPlatform}</span>
          </div>

          {redirectData.source && (
            <div className="summary-row">
              <span className="summary-label">ROUTE / DESTINATION</span>
              <span className="summary-value">{redirectData.source} ➔ {redirectData.destination}</span>
            </div>
          )}

          <div className="summary-row total-row">
            <span className="summary-label">TOTAL PORTAL FARE</span>
            <span className="summary-value price-tag">₹{selectedPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Transparency Notice */}
        <div className="transparency-notice">
          <ShieldCheck size={18} className="notice-icon" />
          <p>
            <strong>Zero Surcharge Guarantee:</strong> Travelflow forwards your search route directly to <strong>{selectedPlatform}</strong>. You complete payment securely on their official portal without middleman fees.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions-row">
          <button 
            type="button" 
            className="btn-outline copy-btn"
            onClick={handleCopyParams}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied' : 'Copy Route'}</span>
          </button>

          <button 
            type="button" 
            className="btn-gold direct-proceed-btn"
            onClick={handleOpenLink}
          >
            <span>Proceed on {selectedPlatform}</span>
            <ExternalLink size={16} />
          </button>
        </div>

        {/* Return link */}
        <div className="modal-footer-back">
          <button type="button" className="btn-ghost return-btn" onClick={onClose}>
            ← Return to Travelflow Itinerary
          </button>
        </div>

      </div>

      <style>{`
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(8, 26, 21, 0.76);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: grid;
          place-items: center;
          padding: 20px;
        }

        .redirect-modal {
          width: min(600px, 100%);
          background: #ffffff;
          border-radius: var(--radius-xl);
          padding: 32px 32px 24px;
          position: relative;
          box-shadow: var(--shadow-xl);
        }

        .close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--color-surface-muted);
          color: var(--color-text-secondary);
          display: grid;
          place-items: center;
        }

        .close-btn:hover {
          background: #e2ddd0;
          color: var(--color-primary-dark);
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 20px;
        }

        .redirect-icon-wrap {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          background: var(--color-primary);
          color: #ffffff;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .modal-title {
          font-size: 1.4rem;
          color: var(--color-primary-dark);
          margin: 2px 0 4px;
        }

        .modal-subtitle {
          font-size: 0.86rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        /* Platform Selection Box */
        .platform-selection-container {
          margin-bottom: 18px;
        }

        .platform-select-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--color-primary-dark);
          margin-bottom: 10px;
          letter-spacing: 0.04em;
        }

        .modal-platforms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 10px;
        }

        .modal-platform-card {
          background: #faf7f2;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .modal-platform-card:hover {
          border-color: var(--color-primary);
        }

        .modal-platform-card.selected-card {
          background: #f4fbf7;
          border-color: var(--color-primary);
          box-shadow: 0 4px 12px rgba(11, 34, 29, 0.1);
        }

        .card-radio-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .modal-plat-name {
          font-size: 0.88rem;
          color: var(--color-text);
        }

        .modal-badge {
          font-size: 0.65rem;
          font-weight: 800;
          background: var(--color-surface-muted);
          color: var(--color-text-secondary);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .badge-lowest-price {
          background: var(--color-success-bg);
          color: var(--color-success);
        }

        .card-fare strong {
          font-size: 0.96rem;
          font-weight: 800;
          color: var(--color-primary-dark);
        }

        /* Summary Box */
        .booking-summary-box {
          background: #f8faf9;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
        }

        .summary-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--color-text-muted);
          letter-spacing: 0.06em;
        }

        .summary-value {
          font-weight: 600;
          color: var(--color-text);
        }

        .item-highlight {
          font-weight: 700;
          color: var(--color-primary-dark);
        }

        .total-row {
          border-top: 1px solid var(--color-border-light);
          padding-top: 8px;
          margin-top: 4px;
        }

        .price-tag {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--color-primary);
        }

        .transparency-notice {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #f7faf9;
          border: 1px solid #bbf7d0;
          padding: 12px 14px;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          color: var(--color-primary-dark);
          line-height: 1.45;
          margin-bottom: 20px;
        }

        .notice-icon {
          color: var(--color-primary);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .modal-actions-row {
          display: flex;
          gap: 10px;
          margin-bottom: 12px;
        }

        .copy-btn {
          font-size: 0.86rem;
          padding: 11px 16px;
        }

        .direct-proceed-btn {
          flex: 1;
          font-size: 0.94rem;
          padding: 11px 20px;
          display: flex;
          justify-content: center;
        }

        .modal-footer-back {
          text-align: center;
        }

        .return-btn {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-text-secondary);
        }

        @media (max-width: 600px) {
          .redirect-modal {
            padding: 24px 18px 18px;
          }
          .modal-actions-row {
            flex-direction: column-reverse;
          }
        }
      `}</style>
    </div>
  );
}
