import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  Building,
  Database, 
  Volume2, 
  Check, 
  Star, 
  TrendingUp, 
  Compass,
  Zap,
  Play
} from 'lucide-react';

export default function LandingHero({ onExplore, onListBusiness, onSelectListing }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [transformationStage, setTransformationStage] = useState(0); // 0: Raw, 1: Extracting, 2: Live Listing

  const handleMagicClick = () => {
    setTransformationStage(1);
    setTimeout(() => {
      setTransformationStage(2);
    }, 1200);
  };

  const handleResetMagic = () => {
    setTransformationStage(0);
  };

  return (
    <div className="landing-hero-container">
      {/* Dynamic Background Atmosphere */}
      <div className="landing-bg-decor">
        <div className="decor-circle decor-circle-1" />
        <div className="decor-circle decor-circle-2" />
        <div className="decor-grid-pattern" />
      </div>

      {/* Hero Section */}
      <section className="hero-getstarted-section">
        <div className="container">
          
          {/* Top Pill / Badge */}
          <div className="hero-top-badge">
            <span className="badge-pulse-dot" />
            <span className="badge-text">
              <Sparkles size={13} className="inline-icon" /> AI-Powered Bottom-Up Tourism Network
            </span>
            <span className="badge-tag">INDIA 🇮🇳</span>
          </div>

          {/* Main Hero Grid */}
          <div className="hero-content-grid">
            
            {/* Left: Product Story & Actions */}
            <div className="hero-text-column">
              <h1 className="hero-main-headline">
                <span className="quote-mark">“</span>
                Every homestay, guide, and roadside dhaba deserves a digital front door.
                <span className="quote-mark">”</span>
              </h1>
              
              <p className="hero-supporting-copy">
                Travelflow bridges India's formal tech divide by transforming messy WhatsApp voice notes and casual photos from local operators into structured, verified, and high-trust digital tourism listings.
              </p>

              {/* Primary, Secondary, and Additional CTAs */}
              <div className="hero-cta-group">
                <button 
                  className="btn-primary-explore"
                  onClick={onExplore}
                  id="cta-explore-experiences"
                >
                  <Compass size={18} />
                  <span>Explore Experiences</span>
                  <ArrowRight size={16} className="btn-arrow" />
                </button>

                <button 
                  className="btn-secondary-list"
                  onClick={onListBusiness}
                  id="cta-list-business"
                >
                  <MessageSquare size={17} className="text-emerald" />
                  <span>List Your Business</span>
                </button>
              </div>

              <div className="hero-tertiary-row">
                <a 
                  href="#how-travelflow-works" 
                  className="hero-how-link"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('how-travelflow-works')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Zap size={14} className="text-accent" />
                  <span>See How Travelflow Works</span>
                  <ArrowRight size={13} />
                </a>

                <div className="hero-stat-pill">
                  <ShieldCheck size={14} className="text-emerald" />
                  <span>100% Zero-Form AI Onboarding</span>
                </div>
              </div>
            </div>

            {/* Right: 3D Floating Tourism Objects & Visual Transformation */}
            <div className="hero-visual-column">
              <div className="floating-canvas-stage">
                
                {/* 3D Floating Card 1: Ramesh Bhai Kutch Stay */}
                <div 
                  className="floating-card float-card-primary cursor-pointer"
                  onClick={() => onSelectListing && onSelectListing()}
                  title="Click to view full verified listing"
                >
                  <div className="float-card-media">
                    <img 
                      src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80" 
                      alt="Kutch Homestay" 
                      className="float-card-img"
                    />
                    <span className="float-trust-badge">
                      <ShieldCheck size={12} /> Verified Partner
                    </span>
                  </div>
                  <div className="float-card-body">
                    <div className="float-card-header">
                      <h4 className="float-card-title hover:text-[#C85A32] transition-colors">Kutch Desert Hearth Homestay</h4>
                      <span className="float-rating"><Star size={12} fill="#c4963d" color="#c4963d" /> 4.9</span>
                    </div>
                    <p className="float-card-sub"><MapPin size={11} /> Hodka, Near Rann of Kutch</p>
                    <div className="float-card-tags">
                      <span className="micro-tag">Bhunga Cottages</span>
                      <span className="micro-tag">Gujarati Thali</span>
                      <span className="micro-tag-price">₹2,400/night</span>
                    </div>
                  </div>
                </div>

                {/* 3D Floating Card 2: WhatsApp Voice Audio Input Snippet */}
                <div className="floating-card float-card-voice">
                  <div className="voice-header-row">
                    <div className="wa-avatar-icon">R</div>
                    <div className="wa-voice-meta">
                      <span className="wa-sender-name">Ramesh Bhai (Kutch)</span>
                      <span className="wa-sender-status">Sent via WhatsApp • 0:38</span>
                    </div>
                  </div>
                  <div className="voice-player-bubble">
                    <button 
                      className="voice-play-toggle"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      title="Play simulated voice note"
                    >
                      {isPlayingAudio ? <Volume2 size={15} /> : <Play size={15} fill="currentColor" />}
                    </button>
                    <div className="voice-waveform-graphic">
                      <span className={`wave-bar ${isPlayingAudio ? 'anim-wave' : ''}`} style={{ height: '14px' }}></span>
                      <span className={`wave-bar ${isPlayingAudio ? 'anim-wave delay-1' : ''}`} style={{ height: '22px' }}></span>
                      <span className={`wave-bar ${isPlayingAudio ? 'anim-wave delay-2' : ''}`} style={{ height: '18px' }}></span>
                      <span className={`wave-bar ${isPlayingAudio ? 'anim-wave delay-3' : ''}`} style={{ height: '28px' }}></span>
                      <span className={`wave-bar ${isPlayingAudio ? 'anim-wave delay-1' : ''}`} style={{ height: '16px' }}></span>
                      <span className={`wave-bar ${isPlayingAudio ? 'anim-wave delay-2' : ''}`} style={{ height: '24px' }}></span>
                      <span className={`wave-bar ${isPlayingAudio ? 'anim-wave delay-3' : ''}`} style={{ height: '12px' }}></span>
                      <span className={`wave-bar ${isPlayingAudio ? 'anim-wave delay-1' : ''}`} style={{ height: '20px' }}></span>
                    </div>
                    <span className="voice-time">0:38</span>
                  </div>
                  <div className="voice-transcription-preview">
                    <em>“Namaste bhai, mera homestay Bhuj ke paas hai. Ghar ka khana aur desert sunset…”</em>
                  </div>
                </div>

                {/* 3D Floating Card 3: Live Booking Notification */}
                <div className="floating-card float-card-booking">
                  <div className="booking-alert-icon">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <span className="booking-alert-title">Instant Booking Request</span>
                    <span className="booking-alert-sub">2 Guests from Mumbai • Nov 14–17</span>
                  </div>
                  <span className="booking-alert-val">₹4,800</span>
                </div>

                {/* 3D Floating Map Pin Marker */}
                <div className="floating-map-pin">
                  <MapPin size={18} className="pin-icon" />
                  <div className="pin-pulse" />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Value Proposition Section (3 Cards) */}
      <section className="value-prop-section">
        <div className="container">
          
          <div className="section-title-wrap">
            <span className="eyebrow-accent">
              <Sparkles size={14} /> PURPOSE-BUILT FOR INCLUSIVE TOURISM
            </span>
            <h2 className="section-heading-large">
              Empowering India's Local Travel Economy
            </h2>
            <p className="section-subtext">
              Transforming fragmented informal stays and rural operators into verifiable, high-yield digital businesses.
            </p>
          </div>

          <div className="value-prop-grid">
            
            {/* Card 1: For Tourists */}
            <div className="value-prop-card">
              <div className="value-icon-box icon-tourists">
                <Compass size={24} />
              </div>
              <span className="value-audience-tag">For Tourists</span>
              <h3 className="value-card-title">Verified local experiences</h3>
              <p className="value-card-desc">
                Discover authentic stays, guides, food, and activities that are easier to trust, backed by bottom-up community verification and transparent local pricing.
              </p>
              <ul className="value-card-bullets">
                <li><Check size={14} className="bullet-check" /> Direct WhatsApp chat with local hosts</li>
                <li><Check size={14} className="bullet-check" /> Verified step-free accessibility details</li>
                <li><Check size={14} className="bullet-check" /> Transparent rates with zero surprise markup</li>
              </ul>
            </div>

            {/* Card 2: For Operators */}
            <div className="value-prop-card card-featured">
              <div className="featured-badge">ZERO TECH BARRIER</div>
              <div className="value-icon-box icon-operators">
                <Building size={24} />
              </div>
              <span className="value-audience-tag">For Operators</span>
              <h3 className="value-card-title">Get listed in 5 minutes via WhatsApp</h3>
              <p className="value-card-desc">
                No complicated forms, English requirements, or technical knowledge needed. Speak naturally in Hindi, Gujarati, or regional languages.
              </p>
              <ul className="value-card-bullets">
                <li><Check size={14} className="bullet-check" /> AI converts voice notes + photos automatically</li>
                <li><Check size={14} className="bullet-check" /> Real-time seasonal demand alerts (Diwali surge)</li>
                <li><Check size={14} className="bullet-check" /> Simple accept/decline booking interface</li>
              </ul>
            </div>

            {/* Card 3: For the Ecosystem */}
            <div className="value-prop-card">
              <div className="value-icon-box icon-ecosystem">
                <Database size={24} />
              </div>
              <span className="value-audience-tag">For the Ecosystem</span>
              <h3 className="value-card-title">India's first bottom-up tourism dataset</h3>
              <p className="value-card-desc">
                Turn fragmented local tourism activity into structured, useful data. Bringing unorganized roadside dhabas and remote homestays into national discovery networks.
              </p>
              <ul className="value-card-bullets">
                <li><Check size={14} className="bullet-check" /> Digital identity for micro-entrepreneurs</li>
                <li><Check size={14} className="bullet-check" /> Grassroots economic empowerment</li>
                <li><Check size={14} className="bullet-check" /> Preserving authentic indigenous hospitality</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 6. HOW TRAVELFLOW WORKS (4-Step Flow) */}
      <section className="how-it-works-section" id="how-travelflow-works">
        <div className="container">
          
          <div className="section-title-wrap">
            <span className="eyebrow-accent">
              <Zap size={14} /> SIMPLE 4-STEP ONBOARDING
            </span>
            <h2 className="section-heading-large">
              How Travelflow Turns Voice Notes into Verified Listings
            </h2>
            <p className="section-subtext">
              Bridging the digital divide with conversational AI that meets informal operators on WhatsApp.
            </p>
          </div>

          <div className="how-steps-grid">
            
            {/* Step 1 */}
            <div className="how-step-card">
              <div className="step-num-bubble">01</div>
              <div className="step-icon-circle">
                <Volume2 size={20} />
              </div>
              <h4 className="step-title">Send a WhatsApp Voice Note</h4>
              <p className="step-desc">
                The business owner simply describes their business naturally in their native language and sends a few photos of rooms or surroundings.
              </p>
            </div>

            {/* Step 2 */}
            <div className="how-step-card">
              <div className="step-num-bubble">02</div>
              <div className="step-icon-circle">
                <Sparkles size={20} />
              </div>
              <h4 className="step-title">AI Understands It</h4>
              <p className="step-desc">
                Travelflow's multimodal AI parses the audio, extracts location, room counts, amenities, regional cuisine, and local pricing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="how-step-card">
              <div className="step-num-bubble">03</div>
              <div className="step-icon-circle">
                <ShieldCheck size={20} />
              </div>
              <h4 className="step-title">Verify & Complete</h4>
              <p className="step-desc">
                The system asks only the 1–2 missing critical questions (like step-free wheelchair accessibility or guest capacity) in plain chat.
              </p>
            </div>

            {/* Step 4 */}
            <div className="how-step-card">
              <div className="step-num-bubble">04</div>
              <div className="step-icon-circle">
                <CheckCircle2 size={20} />
              </div>
              <h4 className="step-title">Go Live & Get Booked</h4>
              <p className="step-desc">
                A structured, high-trust tourism listing is automatically generated and published to Travelflow's discovery marketplace in minutes.
              </p>
            </div>

          </div>

          {/* 7. CORE WOW SECTION: Interactive Transformation Showcase */}
          <div className="wow-transformation-box">
            
            <div className="wow-header">
              <div>
                <span className="wow-tag">INTERACTIVE HACKATHON SHOWCASE</span>
                <h3 className="wow-title">Watch the Transformation: Voice Note ➔ Verified Listing</h3>
              </div>
              
              <div className="wow-controls">
                {transformationStage === 0 ? (
                  <button className="btn-magic-transform" onClick={handleMagicClick}>
                    <Sparkles size={16} />
                    <span>See the Magic ✨</span>
                  </button>
                ) : (
                  <button className="btn-magic-reset" onClick={handleResetMagic}>
                    <span>Replay Transformation ↺</span>
                  </button>
                )}
              </div>
            </div>

            <div className="wow-interactive-grid">
              
              {/* Left Column: Messy WhatsApp Message */}
              <div className="transform-col transform-col-left">
                <div className="col-header-bar wa-bg">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    <span>01. Unstructured WhatsApp Input</span>
                  </div>
                  <span className="status-live">Operator Audio</span>
                </div>
                
                <div className="col-body-content">
                  <div className="wa-message-bubble-sim">
                    <div className="sim-audio-row">
                      <button className="sim-audio-btn">
                        <Play size={13} fill="currentColor" />
                      </button>
                      <div className="sim-wave-bars">
                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                      </div>
                      <span className="sim-duration">0:38</span>
                    </div>
                    <p className="sim-transcript-text">
                      “Namaste bhai! Hamara homestay Bhuj ke paas Hodka gaon mein hai. 4 traditional bhunga rooms hain family ke liye, homemade Kathiyawadi khana aur desert safari bhi karate hain. Ground floor rooms hain…”
                    </p>
                  </div>

                  <div className="sim-photos-row">
                    <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=150&q=80" alt="Room" className="sim-photo" />
                    <img src="https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=150&q=80" alt="Dining" className="sim-photo" />
                    <img src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=150&q=80" alt="Desert" className="sim-photo" />
                  </div>
                </div>
              </div>

              {/* Middle Column: AI Extraction Chips */}
              <div className="transform-col transform-col-mid">
                <div className="col-header-bar ai-bg">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} />
                    <span>02. AI Multimodal Parser</span>
                  </div>
                  <span className="status-extracting">
                    {transformationStage === 0 ? 'Ready' : transformationStage === 1 ? 'Extracting…' : 'Extracted ✓'}
                  </span>
                </div>

                <div className="col-body-content">
                  <div className="extracted-chips-container">
                    <div className={`ai-extract-chip ${transformationStage >= 1 ? 'chip-visible' : 'chip-dim'}`}>
                      <Check size={14} className="chip-check" />
                      <div>
                        <strong>Business Name:</strong> Kutch Desert Hearth Stay
                      </div>
                    </div>
                    <div className={`ai-extract-chip ${transformationStage >= 1 ? 'chip-visible' : 'chip-dim'}`}>
                      <Check size={14} className="chip-check" />
                      <div>
                        <strong>Location:</strong> Hodka Village, Bhuj (Gujarat)
                      </div>
                    </div>
                    <div className={`ai-extract-chip ${transformationStage >= 1 ? 'chip-visible' : 'chip-dim'}`}>
                      <Check size={14} className="chip-check" />
                      <div>
                        <strong>Inventory:</strong> 4 Traditional Bhunga Cottages
                      </div>
                    </div>
                    <div className={`ai-extract-chip ${transformationStage >= 1 ? 'chip-visible' : 'chip-dim'}`}>
                      <Check size={14} className="chip-check" />
                      <div>
                        <strong>Dining:</strong> Kathiyawadi / Gujarati Thali
                      </div>
                    </div>
                    <div className={`ai-extract-chip ${transformationStage >= 1 ? 'chip-visible' : 'chip-dim'}`}>
                      <Check size={14} className="chip-check" />
                      <div>
                        <strong>Accessibility:</strong> Step-free Ground Floor Entry
                      </div>
                    </div>
                    <div className={`ai-extract-chip ${transformationStage >= 1 ? 'chip-visible' : 'chip-dim'}`}>
                      <Check size={14} className="chip-check" />
                      <div>
                        <strong>Estimated Price:</strong> ₹2,400 / night
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Verified Tourism Listing */}
              <div className="transform-col transform-col-right">
                <div className="col-header-bar live-bg">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} />
                    <span>03. Verified Digital Listing</span>
                  </div>
                  <span className="status-live-green">Published 🟢</span>
                </div>

                <div className="col-body-content">
                  <div className={`live-listing-preview-card ${transformationStage === 2 ? 'glow-active' : ''}`}>
                    <div className="live-card-hero-img">
                      <img 
                        src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80" 
                        alt="Listing Preview" 
                      />
                      <span className="live-badge-overlay">
                        <ShieldCheck size={12} /> Verified Partner
                      </span>
                    </div>

                    <div className="live-card-info">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="live-listing-name">Kutch Desert Hearth Homestay</h4>
                          <span className="live-listing-loc"><MapPin size={11} /> Hodka, Gujarat</span>
                        </div>
                        <span className="live-price-tag">₹2,400<small>/night</small></span>
                      </div>

                      <p className="live-listing-summary">
                        Authentic eco-stays in traditional handcrafted Bhungas with homemade Gujarati cuisine and guided sunset safaris.
                      </p>

                      <div className="live-amenity-pills">
                        <span>4 Rooms</span>
                        <span>Step-Free Access</span>
                        <span>Home Cooked</span>
                      </div>

                      <button className="btn-live-book-sim" onClick={onExplore}>
                        <span>Explore Listing Details</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
