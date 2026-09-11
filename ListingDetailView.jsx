import React, { useState } from 'react';
import { 
  MapPin, 
  Star, 
  ShieldCheck, 
  Check, 
  ArrowLeft, 
  MessageSquare, 
  Heart, 
  Share2, 
  CheckCircle2, 
  Award
} from 'lucide-react';

export default function ListingDetailView({ 
  stay, 
  onBack, 
  onRequestBooking, 
  onOpenMessageHost, 
  isFavorite, 
  onToggleFavorite 
}) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('2026-10-15');
  const [checkOut, setCheckOut] = useState('2026-10-18');
  const [guestCount, setGuestCount] = useState(2);
  const [nights] = useState(3);

  // Fallback if no stay provided
  const currentStay = stay || {
    id: 'kutch-hearth',
    name: 'Kutch Desert Hearth Homestay',
    location: 'Hodka Village, Near White Rann, Gujarat',
    price: 2400,
    rating: 4.9,
    reviewsCount: 48,
    type: 'Eco Homestay',
    trustBadge: 'Verified Partner',
    hostName: 'Ramesh Bhai',
    hostJoined: 'Member since 2024 • Onboarded via WhatsApp',
    description: 'Experience authentic Kutchi hospitality in traditional handcrafted Bhunga mud cottages. Enjoy homemade organic Kathiyawadi meals prepared on chulha, evening folk music around the hearth, and guided desert sunset safaris led by village elders.',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: [
      'Authentic Gujarati Thali Included',
      'Private Handcrafted Bhunga Cottage',
      'Desert Safari Arrangement',
      'Free Parking',
      'Cultural Evening Bonfire',
      'Luggage Assistance'
    ],
    accessibility: {
      stepFree: true,
      bathroomAccess: true,
      groundFloor: true,
      details: 'All guest cottages have wide zero-threshold doors and paved ramp access from the vehicle drop-off area.'
    }
  };

  const images = currentStay.images || [
    currentStay.image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
  ];

  const pricePerNight = currentStay.price || currentStay.pricePerNight || 2400;
  const subtotal = pricePerNight * nights;
  const platformFee = 150;
  const totalAmount = subtotal + platformFee;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    onRequestBooking({
      stay: currentStay,
      checkIn,
      checkOut,
      guests: guestCount,
      nights,
      totalAmount
    });
  };

  return (
    <div className="listing-detail-page bg-[#FAF8F5] min-h-screen py-8 text-[#142421]">
      <div className="container max-w-6xl mx-auto px-4">
        
        {/* Back navigation & Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#142421] hover:text-[#C85A32] transition-colors bg-white px-4 py-2 rounded-lg border border-[#E5DED2] shadow-sm"
          >
            <ArrowLeft size={16} />
            <span>Back to Experiences</span>
          </button>

          <div className="flex items-center gap-3">
            <button 
              onClick={onToggleFavorite}
              className={`p-2.5 rounded-lg border border-[#E5DED2] bg-white transition-all ${
                isFavorite ? 'text-red-500 border-red-200 shadow-sm' : 'text-[#627772] hover:text-[#142421]'
              }`}
              title="Save to Favorites"
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={() => alert('Listing link copied to clipboard!')}
              className="p-2.5 rounded-lg border border-[#E5DED2] bg-white text-[#627772] hover:text-[#142421]"
              title="Share Listing"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Title & Location Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0E1F1B] font-display">
              {currentStay.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 bg-[#2D5A43] text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm">
              <ShieldCheck size={14} /> {currentStay.trustBadge || 'Verified Partner'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[#556B66]">
            <span className="flex items-center gap-1">
              <MapPin size={15} className="text-[#C85A32]" />
              {currentStay.location || currentStay.address}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-bold text-[#142421]">
              <Star size={15} fill="#C4963D" color="#C4963D" />
              {currentStay.rating || 4.9} ({currentStay.reviewsCount || 48} reviews)
            </span>
            <span>•</span>
            <span className="bg-[#FAF0E6] text-[#C85A32] font-semibold px-2.5 py-0.5 rounded text-xs">
              {currentStay.type || 'Authentic Local Stay'}
            </span>
          </div>
        </div>

        {/* Photography Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
          <div className="md:col-span-2 h-[340px] sm:h-[420px] rounded-xl overflow-hidden shadow-md">
            <img 
              src={images[activeImgIndex]} 
              alt={currentStay.name} 
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-1 gap-3 h-auto md:h-[420px]">
            {images.slice(0, 3).map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveImgIndex(idx)}
                className={`h-24 md:h-[132px] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                  activeImgIndex === idx ? 'border-[#C85A32] ring-2 ring-[#C85A32]/30 scale-[1.02]' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Content & Booking Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left 2 Columns: Description & Features */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Host Verification Banner */}
            <div className="bg-[#EBF5EE] border border-[#BCE3C8] rounded-xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#2D5A43] text-white flex items-center justify-center font-bold text-lg">
                  {currentStay.hostName ? currentStay.hostName[0] : 'H'}
                </div>
                <div>
                  <h4 className="font-bold text-[#0E1F1B] text-base">
                    Hosted by {currentStay.hostName || 'Local Host'}
                  </h4>
                  <p className="text-xs text-[#4A5D59]">
                    {currentStay.hostJoined || 'Verified grassroots host via Travelflow WhatsApp AI'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onOpenMessageHost}
                className="inline-flex items-center gap-2 bg-[#25D366] text-[#0E1F1B] text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm hover:bg-[#1EBE5D] transition-colors"
              >
                <MessageSquare size={14} />
                <span>Message Host</span>
              </button>
            </div>

            {/* Why This Listing is Verified: 5-Layer Trust Certificate */}
            <div className="bg-white rounded-xl p-6 border-2 border-[#BCE3C8] shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 text-[#2D5A43] font-bold text-sm">
                  <ShieldCheck size={20} className="text-[#25D366]" />
                  <span>5-Layer Grassroots Authentication Certificate</span>
                </div>
                <span className="bg-[#EBF5EE] text-[#2D5A43] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#BCE3C8]">
                  Verified Authenticity 100%
                </span>
              </div>
              
              <p className="text-xs text-[#556B66] leading-relaxed mb-4">
                To protect tourists and empower genuine rural entrepreneurs, this informal property was audited through Travelflow's multi-tier physical proof system:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#E5DED2] flex items-start gap-2">
                  <span className="text-[#2D5A43] font-bold">📍 1. WhatsApp Live GPS:</span>
                  <span className="text-[#4A5D59]">Ground pin matches Hodka Village (23.5182° N)</span>
                </div>
                <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#E5DED2] flex items-start gap-2">
                  <span className="text-[#2D5A43] font-bold">💳 2. UPI Bank Match:</span>
                  <span className="text-[#4A5D59]">NPCI Reverse penny-drop matched to Ramesh Patel</span>
                </div>
                <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#E5DED2] flex items-start gap-2">
                  <span className="text-[#2D5A43] font-bold">📸 3. Live Camera EXIF:</span>
                  <span className="text-[#4A5D59]">Authentic on-site room photos (zero stock images)</span>
                </div>
                <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#E5DED2] flex items-start gap-2">
                  <span className="text-[#2D5A43] font-bold">🤝 4. Peer Guide Vouched:</span>
                  <span className="text-[#4A5D59]">Vouched by 2 certified Kutch local safari guides</span>
                </div>
              </div>

              <div className="mt-3.5 pt-3 border-t border-[#E5DED2] flex items-center justify-between text-[11px] text-[#2D5A43] font-semibold">
                <span>🛡️ Escrow Protected: Host paid only after you arrive & share Check-in OTP</span>
                <span className="text-[#C85A32]">100% Money-Back Guarantee</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 border border-[#E5DED2] shadow-sm">
              <h3 className="text-lg font-bold text-[#0E1F1B] mb-3">About this experience</h3>
              <p className="text-[#4A5D59] text-sm leading-relaxed whitespace-pre-line">
                {currentStay.description}
              </p>
            </div>

            {/* Amenities & Highlights */}
            <div className="bg-white rounded-xl p-6 border border-[#E5DED2] shadow-sm">
              <h3 className="text-lg font-bold text-[#0E1F1B] mb-4">Included Amenities & Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(currentStay.amenities || []).map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-[#2B3D39]">
                    <span className="w-5 h-5 rounded-full bg-[#FAF0E6] text-[#C85A32] flex items-center justify-center flex-shrink-0">
                      <Check size={12} />
                    </span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Accessibility Section */}
            <div className="bg-white rounded-xl p-6 border border-[#E5DED2] shadow-sm">
              <div className="flex items-center gap-2 text-[#C85A32] font-bold text-sm mb-2">
                <Award size={18} />
                <span>Accessibility & Step-Free Details</span>
              </div>
              <p className="text-xs text-[#556B66] mb-4">
                {currentStay.accessibility?.details || 'Ground floor rooms with step-free entry and wide doorways.'}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 bg-[#F4F8F6] text-[#2D5A43] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#D5E6DC]">
                  <CheckCircle2 size={14} /> Step-free access from entrance
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#F4F8F6] text-[#2D5A43] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#D5E6DC]">
                  <CheckCircle2 size={14} /> Ground floor cottages
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Booking Request Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl border-2 border-[#E5DED2] p-6 shadow-xl">
              
              <div className="flex justify-between items-baseline mb-5 pb-4 border-b border-[#E5DED2]">
                <div>
                  <span className="text-2xl font-black text-[#0E1F1B]">₹{pricePerNight.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-[#627772]"> / night</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#142421]">
                  <Star size={13} fill="#C4963D" color="#C4963D" />
                  <span>{currentStay.rating || 4.9}</span>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                
                {/* Dates */}
                <div className="grid grid-cols-2 gap-2 p-2 bg-[#FAF8F5] rounded-lg border border-[#E5DED2]">
                  <div>
                    <label className="block text-[10px] font-bold text-[#627772] uppercase tracking-wider mb-1">
                      Check-In
                    </label>
                    <input 
                      type="date" 
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-[#0E1F1B] focus:outline-none"
                    />
                  </div>
                  <div className="border-l border-[#E5DED2] pl-2">
                    <label className="block text-[10px] font-bold text-[#627772] uppercase tracking-wider mb-1">
                      Check-Out
                    </label>
                    <input 
                      type="date" 
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-[#0E1F1B] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#E5DED2]">
                  <label className="block text-[10px] font-bold text-[#627772] uppercase tracking-wider mb-1">
                    Guests
                  </label>
                  <select 
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full bg-transparent text-xs font-semibold text-[#0E1F1B] focus:outline-none"
                  >
                    <option value={1}>1 Guest (Solo traveler)</option>
                    <option value={2}>2 Guests (Couple / Friends)</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests (Family room)</option>
                  </select>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-3 border-t border-[#E5DED2] text-xs text-[#556B66]">
                  <div className="flex justify-between">
                    <span>₹{pricePerNight} × {nights} nights</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Travelflow Platform & Support</span>
                    <span>₹{platformFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#0E1F1B] pt-2 border-t border-dashed border-[#E5DED2]">
                    <span>Total Amount</span>
                    <span className="text-[#C85A32]">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Booking CTA */}
                <button 
                  type="submit"
                  className="w-full bg-[#C85A32] text-white py-3 rounded-lg font-bold text-sm shadow-md hover:bg-[#B34B25] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Request Booking
                </button>

                <p className="text-[11px] text-center text-[#7A8E89]">
                  No upfront charge. Host will confirm within 2 hours on WhatsApp.
                </p>

              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
