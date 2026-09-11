import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Home, 
  MessageSquare, 
  CalendarCheck, 
  TrendingUp, 
  ShieldCheck, 
  User, 
  LogOut, 
  Check, 
  X, 
  Sparkles, 
  Award,
  ChevronRight
} from 'lucide-react';

export default function OperatorDashboardView({ 
  activeTab = 'overview', 
  onSelectTab, 
  bookings = [], 
  inquiries = [], 
  onAcceptBooking, 
  onDeclineBooking, 
  onNavigate,
  onLogout 
}) {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [suggestedPriceApplied, setSuggestedPriceApplied] = useState(false);
  const [activePrice, setActivePrice] = useState(2400);

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    if (onSelectTab) onSelectTab(tabId);
  };

  const handleApplyPrice = () => {
    setActivePrice(2199);
    setSuggestedPriceApplied(true);
  };

  // Mock Bookings fallback
  const currentBookings = bookings.length > 0 ? bookings : [
    {
      id: 'b-101',
      guestName: 'Aarav Sharma',
      guestPhone: '+91 98201 44521',
      stayName: 'Kutch Desert Hearth Stay',
      checkIn: '2026-10-24',
      checkOut: '2026-10-27',
      nights: 3,
      totalAmount: 7350,
      status: 'Pending',
      dateRequested: '15 mins ago'
    },
    {
      id: 'b-102',
      guestName: 'Priya Iyer',
      guestPhone: '+91 98450 11234',
      stayName: 'Kutch Desert Hearth Stay',
      checkIn: '2026-11-02',
      checkOut: '2026-11-05',
      nights: 3,
      totalAmount: 7350,
      status: 'Confirmed',
      dateRequested: 'Yesterday'
    }
  ];

  return (
    <div className="operator-dashboard-root bg-[#071310] min-h-screen text-[#FAF6F0] flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0A1A16] border-r border-[#15342C] p-4 flex flex-col justify-between">
        <div>
          {/* Brand & Operator Profile */}
          <div className="flex items-center gap-3 p-3 mb-6 bg-[#0E241E] rounded-xl border border-[#1B4337]">
            <div className="w-10 h-10 rounded-full bg-[#C85A32] flex items-center justify-center font-bold text-white shadow-sm">
              RB
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Ramesh Bhai</h3>
              <p className="text-[11px] text-[#25D366] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>
                Kutch Partner Studio
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'listing', label: 'My Listing', icon: Home },
              { id: 'bookings', label: 'Bookings', icon: CalendarCheck, badge: currentBookings.filter(b => b.status === 'Pending').length },
              { id: 'inquiries', label: 'Inquiries', icon: MessageSquare, badge: '2' },
              { id: 'insights', label: 'Demand Insights', icon: TrendingUp },
              { id: 'verification', label: 'Verification (5/5)', icon: ShieldCheck },
              { id: 'profile', label: 'Profile', icon: User },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-[#2D5A43] text-white shadow-md' 
                      : 'text-[#8EA8A1] hover:bg-[#0E241E] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? 'text-[#c4963d]' : ''} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-[#C85A32] text-white text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-[#15342C] space-y-2">
          <button 
            onClick={() => onNavigate('landing')}
            className="w-full text-left text-xs font-semibold text-[#8EA8A1] hover:text-white flex items-center gap-2 px-3 py-2 rounded-md"
          >
            <ChevronRight size={14} /> Back to Public Site
          </button>
          <button 
            onClick={onLogout}
            className="w-full text-left text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-2 px-3 py-2 rounded-md"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#15342C]">
          <div>
            <span className="text-xs font-bold text-[#c4963d] uppercase tracking-wider">Operator Studio Dashboard</span>
            <h1 className="text-2xl font-black text-white">
              {currentTab === 'overview' && 'Welcome back, Ramesh Bhai 👋'}
              {currentTab === 'listing' && 'My Digital Listing'}
              {currentTab === 'bookings' && 'Booking Management'}
              {currentTab === 'inquiries' && 'Tourist WhatsApp Inquiries'}
              {currentTab === 'insights' && 'Seasonal Demand & Pricing Forecast'}
              {currentTab === 'verification' && 'Grassroots Verification Center'}
              {currentTab === 'profile' && 'Operator Profile & Banking'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-[#0E241E] border border-[#1B4337] text-xs font-bold px-3 py-1.5 rounded-lg text-[#25D366] flex items-center gap-1.5">
              <ShieldCheck size={15} /> Verified Local Partner
            </span>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Top 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Trust Score */}
              <div className="bg-[#0A1A16] border border-[#15342C] p-5 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#8EA8A1]">Trust Score</span>
                  <Award size={18} className="text-[#c4963d]" />
                </div>
                <div className="text-2xl font-black text-white mb-1">82 / 100</div>
                <p className="text-[11px] text-[#25D366]">Tier 1: Verified Partner</p>
              </div>

              {/* Monthly Inquiries */}
              <div className="bg-[#0A1A16] border border-[#15342C] p-5 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#8EA8A1]">WhatsApp Inquiries</span>
                  <MessageSquare size={18} className="text-[#25D366]" />
                </div>
                <div className="text-2xl font-black text-white mb-1">28 Tourists</div>
                <p className="text-[11px] text-[#8EA8A1]">+44% vs previous month</p>
              </div>

              {/* Active Listing Rate */}
              <div className="bg-[#0A1A16] border border-[#15342C] p-5 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#8EA8A1]">Active Nightly Rate</span>
                  <Sparkles size={18} className="text-[#C85A32]" />
                </div>
                <div className="text-2xl font-black text-[#c4963d] mb-1">₹{activePrice}</div>
                <p className="text-[11px] text-[#25D366]">4 Rooms Available</p>
              </div>

            </div>

            {/* Smart Price Suggestion & Diwali Surge Card */}
            <div className="bg-gradient-to-r from-[#122A23] to-[#0A1A16] border-2 border-[#c4963d]/50 p-6 rounded-xl shadow-lg">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#C85A32] text-white text-[10px] font-extrabold px-2 py-0.5 rounded">
                      DIWALI SURGE ALERT 🔥
                    </span>
                    <span className="text-xs font-bold text-[#c4963d]">+40% Search Interest</span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Smart Dynamic Pricing Suggestion: ₹2,199 / night
                  </h3>
                  <p className="text-xs text-[#8EA8A1] max-w-xl">
                    High demand detected for Kutch Rann Utsav week. Adjusting your rate to ₹2,199 boosts conversion by an estimated 28%.
                  </p>
                </div>

                <div>
                  {suggestedPriceApplied ? (
                    <span className="bg-[#25D366]/20 border border-[#25D366] text-[#25D366] text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5">
                      <Check size={14} /> ₹2,199 Applied
                    </span>
                  ) : (
                    <button 
                      onClick={handleApplyPrice}
                      className="bg-[#c4963d] hover:bg-[#b0822b] text-[#071310] text-xs font-black px-5 py-2.5 rounded-lg shadow-md transition-transform transform active:scale-95"
                    >
                      Apply Suggested Price
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-[#0A1A16] border border-[#15342C] rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-white">Recent Booking Requests</h3>
                <button onClick={() => handleTabClick('bookings')} className="text-xs font-bold text-[#c4963d] hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {currentBookings.map((b) => (
                  <div key={b.id} className="bg-[#0E241E] p-4 rounded-lg border border-[#1B4337] flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{b.guestName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          b.status === 'Confirmed' ? 'bg-[#2D5A43] text-white' : 'bg-[#FAF0E6] text-[#C85A32]'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#8EA8A1] mt-1">
                        {b.checkIn} to {b.checkOut} ({b.nights} nights) • ₹{b.totalAmount}
                      </p>
                    </div>

                    {b.status === 'Pending' ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onAcceptBooking && onAcceptBooking(b.id)}
                          className="bg-[#25D366] hover:bg-[#1EBE5D] text-[#071310] text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1"
                        >
                          <Check size={13} /> Accept
                        </button>
                        <button 
                          onClick={() => onDeclineBooking && onDeclineBooking(b.id)}
                          className="bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1"
                        >
                          <X size={13} /> Decline
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-[#25D366] font-semibold flex items-center gap-1">
                        <Check size={14} /> Confirmed on WhatsApp
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: My Listing */}
        {currentTab === 'listing' && (
          <div className="bg-[#0A1A16] border border-[#15342C] rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Kutch Desert Hearth Homestay</h3>
                <p className="text-xs text-[#8EA8A1]">Live on Travelflow Marketplace</p>
              </div>
              <button 
                onClick={() => onNavigate('listing')}
                className="bg-[#2D5A43] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#244936]"
              >
                Preview as Tourist ↗
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80" alt="Stay" className="rounded-lg h-40 w-full object-cover" />
              <img src="https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80" alt="Dining" className="rounded-lg h-40 w-full object-cover" />
              <img src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80" alt="Desert" className="rounded-lg h-40 w-full object-cover" />
            </div>

            <div className="space-y-3 text-xs text-[#8EA8A1]">
              <p><strong>Description:</strong> Authentic eco-stays in traditional handcrafted Bhungas with homemade Gujarati cuisine and guided sunset safaris.</p>
              <p><strong>Location:</strong> Hodka Village, Bhuj (Gujarat)</p>
              <p><strong>Capacity:</strong> 4 Traditional Bhunga Cottages (Step-Free Access)</p>
            </div>
          </div>
        )}

        {/* Tab 3: Bookings */}
        {currentTab === 'bookings' && (
          <div className="space-y-4">
            <div className="bg-[#0A1A16] border border-[#15342C] rounded-xl p-6">
              <h3 className="font-bold text-base text-white mb-4">All Customer Reservations</h3>
              <div className="space-y-3">
                {currentBookings.map((b) => (
                  <div key={b.id} className="bg-[#0E241E] p-4 rounded-lg border border-[#1B4337] flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{b.guestName}</span>
                        <span className="text-xs text-[#8EA8A1]">({b.guestPhone || '+91 98201 44521'})</span>
                      </div>
                      <p className="text-xs text-[#8EA8A1] mt-1">
                        {b.checkIn} to {b.checkOut} • ₹{b.totalAmount}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded ${
                        b.status === 'Confirmed' ? 'bg-[#2D5A43] text-white' : 'bg-[#FAF0E6] text-[#C85A32]'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Inquiries */}
        {currentTab === 'inquiries' && (
          <div className="bg-[#0A1A16] border border-[#15342C] rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-base text-white">Tourist WhatsApp Inquiries</h3>
            <div className="space-y-3">
              {(inquiries.length > 0 ? inquiries : [
                {
                  id: 'inq-1',
                  guestName: 'Pooja Dave',
                  location: 'Ahmedabad',
                  text: 'Namaste Ramesh Bhai, kya 25 Oct ko 2 bhunga available hain? Hum 4 log hain.',
                  time: '1 hour ago'
                },
                {
                  id: 'inq-2',
                  guestName: 'Rahul Verma',
                  location: 'Mumbai',
                  text: 'Do you arrange airport pickup from Bhuj airport?',
                  time: 'Yesterday'
                }
              ]).map((inq) => (
                <div key={inq.id} className="bg-[#0E241E] p-4 rounded-lg border border-[#1B4337]">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-xs text-white">{inq.guestName} {inq.location ? `(${inq.location})` : ''}</span>
                    <span className="text-[10px] text-[#8EA8A1]">{inq.time || 'Just now'}</span>
                  </div>
                  <p className="text-xs text-[#8EA8A1]">
                    “{inq.text}”
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Demand Insights */}
        {currentTab === 'insights' && (
          <div className="bg-[#0A1A16] border border-[#15342C] rounded-xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-1">Rann of Kutch Regional Demand Trends</h3>
              <p className="text-xs text-[#8EA8A1]">Aggregated search queries from Mumbai, Delhi, and Ahmedabad.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#0E241E] p-4 rounded-lg border border-[#1B4337]">
                <span className="text-xs font-bold text-[#c4963d] block mb-1">Peak Booking Window</span>
                <p className="text-sm font-bold text-white">November 10 – December 28</p>
                <p className="text-xs text-[#8EA8A1] mt-1">Full moon dates have 98% search surge.</p>
              </div>
              <div className="bg-[#0E241E] p-4 rounded-lg border border-[#1B4337]">
                <span className="text-xs font-bold text-[#25D366] block mb-1">Most Requested Amenity</span>
                <p className="text-sm font-bold text-white">Chulha Kathiyawadi Meals</p>
                <p className="text-xs text-[#8EA8A1] mt-1">Mentioned in 84% of traveler inquiries.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Verification */}
        {currentTab === 'verification' && (
          <div className="bg-[#0A1A16] border border-[#15342C] rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#2D5A43] flex items-center justify-center text-white font-bold">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Grassroots 5-Stage Verification</h3>
                <p className="text-xs text-[#25D366]">Status: Verified Partner (Level 1 Certified)</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { stage: '1. WhatsApp Voice Note Onboarding', status: 'Completed', detail: 'Audio description transcribed & parsed via multimodal AI.' },
                { stage: '2. Geolocation Pin Verification', status: 'Completed', detail: 'Coordinates verified at Hodka Village, Kutch.' },
                { stage: '3. Photo Authenticity Audit', status: 'Completed', detail: '3 real room and dining photos verified with metadata.' },
                { stage: '4. Step-Free Accessibility Check', status: 'Completed', detail: 'Confirmed ground-floor zero-stair entry.' },
                { stage: '5. Community Vouching', status: 'Completed', detail: 'Vouched by 3 verified local guides.' }
              ].map((s, idx) => (
                <div key={idx} className="bg-[#0E241E] p-3.5 rounded-lg border border-[#1B4337] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white">{s.stage}</h4>
                    <p className="text-[11px] text-[#8EA8A1]">{s.detail}</p>
                  </div>
                  <span className="bg-[#2D5A43] text-white text-[10px] font-bold px-2.5 py-1 rounded">
                    {s.status} ✓
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Profile */}
        {currentTab === 'profile' && (
          <div className="bg-[#0A1A16] border border-[#15342C] rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Operator Profile & Bank Details</h3>
            <div className="space-y-3 text-xs text-[#8EA8A1]">
              <div className="p-3 bg-[#0E241E] rounded-lg border border-[#1B4337]">
                <strong>Operator Name:</strong> Ramesh Bhai Patel
              </div>
              <div className="p-3 bg-[#0E241E] rounded-lg border border-[#1B4337]">
                <strong>WhatsApp Number:</strong> +91 98250 88912 (Verified)
              </div>
              <div className="p-3 bg-[#0E241E] rounded-lg border border-[#1B4337]">
                <strong>Payout UPI ID:</strong> ramesh.kutch@okhdfcbank (Active)
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
