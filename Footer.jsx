import React from 'react';
import { Compass, ShieldCheck } from 'lucide-react';

export default function Footer({ onOpenAIChat }) {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        
        <div className="footer-top">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <div className="footer-icon">
                <Compass size={20} />
              </div>
              <span className="footer-title">Travelflow</span>
            </div>
            <p className="footer-tagline">
              Bespoke, budget-aware itinerary intelligence for curious minds and mindful explorers.
            </p>
          </div>

          <div className="footer-links-col">
            <h5 className="footer-col-head">EXPLORE & PLAN</h5>
            <ul className="footer-links">
              <li><a href="#planner">Trip Discovery</a></li>
              <li><a href="#budget-overview">Budget Tier Engine</a></li>
              <li><a href="#itinerary">Hour-by-Hour Schedules</a></li>
              <li><a href="#transits">Train & Flight Comparisons</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h5 className="footer-col-head">PARTNER PLATFORMS</h5>
            <ul className="footer-links">
              <li><a href="https://www.irctc.co.in" target="_blank" rel="noreferrer">IRCTC Rail Official</a></li>
              <li><a href="https://www.makemytrip.com" target="_blank" rel="noreferrer">MakeMyTrip Flights & Stays</a></li>
              <li><a href="https://www.booking.com" target="_blank" rel="noreferrer">Booking.com Boutique Hotels</a></li>
              <li><a href="https://www.goindigo.in" target="_blank" rel="noreferrer">IndiGo Air</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h5 className="footer-col-head">AI CO-PLANNER 3.0</h5>
            <p className="footer-concierge-desc">
              Collaborate directly with our AI Trip Co-Planner for instant custom schedules, budget allocation, and live recommendations.
            </p>
            <button type="button" className="footer-wa-link" onClick={onOpenAIChat}>
              Launch AI Co-Planner ➔
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="disclaimer-text">
            <ShieldCheck size={14} className="disclaimer-icon" />
            <span>
              <strong>Platform Notice:</strong> Travelflow is an itinerary planning intelligence application and does not collect payment or issue actual transportation tickets directly. All booking links redirect to authorized external platforms with pre-configured trip parameters with zero middleman fees.
            </span>
          </div>
          
          <div className="copyright-row">
            <span>© 2026 Travelflow Inc. Crafted for bespoke journeys.</span>
          </div>
        </div>

      </div>

      <style>{`
        .site-footer {
          background: #143831;
          color: #d1deda;
          padding: 70px 0 36px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 40px;
          margin-bottom: 50px;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .footer-icon {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-sm);
          background: #c5a059;
          color: #ffffff;
          display: grid;
          place-items: center;
        }

        .footer-title {
          font-family: var(--font-serif);
          font-size: 1.45rem;
          color: #ffffff;
          font-weight: 700;
        }

        .footer-tagline {
          font-size: 0.88rem;
          line-height: 1.6;
          color: #a8bfb9;
          max-width: 320px;
        }

        .footer-col-head {
          font-family: var(--font-sans);
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #c5a059;
          margin-bottom: 16px;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-links a {
          font-size: 0.85rem;
          color: #c4d4d0;
          transition: color var(--transition-fast);
        }

        .footer-links a:hover {
          color: #ffffff;
        }

        .footer-concierge-desc {
          font-size: 0.84rem;
          line-height: 1.55;
          color: #a8bfb9;
          margin-bottom: 12px;
        }

        .footer-wa-link {
          color: #25d366;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0;
        }

        .footer-wa-link:hover {
          text-decoration: underline;
        }

        .footer-bottom {
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .disclaimer-text {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.76rem;
          line-height: 1.55;
          color: #8fa39e;
        }

        .disclaimer-icon {
          color: #c5a059;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .copyright-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.76rem;
          color: #7a8e89;
        }

        @media (max-width: 900px) {
          .footer-top {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 600px) {
          .footer-top {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }
      `}</style>
    </footer>
  );
}
