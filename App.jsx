import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingHero from './components/LandingHero';
import HeroSearch from './components/HeroSearch';
import Background3D from './components/Background3D';
import BudgetTierOverview from './components/BudgetTierOverview';
import ItineraryView from './components/ItineraryView';
import TransitSection from './components/TransitSection';
import StaysSection from './components/StaysSection';
import Footer from './components/Footer';
import ListingDetailView from './components/ListingDetailView';
import WhatsAppOnboardingView from './components/WhatsAppOnboardingView';
import OperatorDashboardView from './components/OperatorDashboardView';
import TripDetailView from './components/TripDetailView';
import DestinationsExplorerView from './components/DestinationsExplorerView';
import { LoginPage, SignupPage } from './components/AuthModalOrView';
import { BookingConfirmationModal, HostMessageModal } from './components/BookingConfirmationModal';
import BookingRedirectModal from './components/BookingRedirectModal';
import WhatsAppBotModal from './components/WhatsAppBotModal';
import ApiSettingsModal from './components/ApiSettingsModal';
import AddActivityModal from './components/AddActivityModal';
import FloatingAIChatTrigger from './components/FloatingAIChatTrigger';
import { DESTINATIONS } from './data/destinations';
import { 
  getDestinations, 
  getTripById, 
  addActivityToTrip, 
  deleteActivityFromTrip 
} from './services/travelService';
import { createBookingRequest, createInquiry, getBookings, getInquiries } from './services/bookingService';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'planner', 'destinations', 'trip', 'listing', 'onboarding', 'dashboard', 'login', 'signup'
  const [activeSection, setActiveSection] = useState('landing');
  const [userRole, setUserRole] = useState(null); // 'operator', 'tourist', null
  const [allDestinations, setAllDestinations] = useState(DESTINATIONS);
  const [selectedDestId, setSelectedDestId] = useState('goa');
  const [selectedStay, setSelectedStay] = useState(null);
  const [favorites, setFavorites] = useState(['kutch-hearth', 'jibhi-orchard']);
  const [toastMessage, setToastMessage] = useState(null);

  // Dynamic Active Trip State
  const [activeTrip, setActiveTrip] = useState(null);

  // Trip Search Parameters
  const [tripParams, setTripParams] = useState({
    sourceCity: 'Mumbai (BOM)',
    destinationId: 'goa',
    startDate: '2026-10-12',
    endDate: '2026-10-16',
    travelers: 2,
    budget: 28000
  });

  const [activeTier, setActiveTier] = useState('comfort');
  const [customActivities, setCustomActivities] = useState([]);

  // Modals
  const [redirectModalData, setRedirectModalData] = useState(null);
  const [bookingConfirmationData, setBookingConfirmationData] = useState(null);
  const [isHostMessageOpen, setIsHostMessageOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [addActivityDayNum, setAddActivityDayNum] = useState(1);

  // Bookings & Inquiries for Operator Dashboard
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  // Initialize data on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const dests = await getDestinations();
        if (dests && dests.length > 0) setAllDestinations(dests);
        
        const bks = await getBookings();
        setBookings(bks);
        
        const inqs = await getInquiries();
        setInquiries(inqs);
      } catch (err) {
        console.warn('Initial data load warning:', err);
      }
    }
    loadInitialData();
  }, []);

  // Browser URL Synchronization (Support direct routes /plan, /destinations, /destination/:id, /trip/:id)
  useEffect(() => {
    const handleRouteFromUrl = async () => {
      const path = window.location.pathname.toLowerCase();
      
      if (path === '/plan' || path === '/planner') {
        setCurrentView('planner');
      } else if (path === '/destinations') {
        setCurrentView('destinations');
      } else if (path.startsWith('/destination/')) {
        const destId = path.replace('/destination/', '').trim();
        if (destId) {
          setSelectedDestId(destId);
          setCurrentView('planner');
        }
      } else if (path.startsWith('/trip/')) {
        const tripId = path.replace('/trip/', '').trim();
        if (tripId) {
          const loadedTrip = await getTripById(tripId);
          if (loadedTrip) {
            setActiveTrip(loadedTrip);
            setSelectedDestId(loadedTrip.destinationId || 'goa');
            setCurrentView('trip');
          }
        }
      } else if (path === '/onboarding') {
        setCurrentView('onboarding');
      } else if (path === '/dashboard') {
        setCurrentView('dashboard');
      } else if (path === '/login') {
        setCurrentView('login');
      } else if (path === '/signup') {
        setCurrentView('signup');
      }
    };

    handleRouteFromUrl();
    window.addEventListener('popstate', handleRouteFromUrl);
    return () => window.removeEventListener('popstate', handleRouteFromUrl);
  }, []);

  const destination = allDestinations.find(d => d.id === selectedDestId) || allDestinations[0] || DESTINATIONS[0];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleNavigate = (view, targetPath = null) => {
    setCurrentView(view);
    const path = targetPath || (
      view === 'landing' ? '/' :
      view === 'planner' ? '/plan' :
      view === 'destinations' ? '/destinations' :
      view === 'trip' && activeTrip ? `/trip/${activeTrip.id}` :
      `/${view}`
    );
    try {
      window.history.pushState(null, '', path);
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    if (currentView !== 'landing' && currentView !== 'planner') {
      setCurrentView('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectStay = (stay) => {
    setSelectedStay(stay);
    setCurrentView('listing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectKutchStay = () => {
    setSelectedStay({
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
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
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
    });
    setCurrentView('listing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = (stayId) => {
    setFavorites(prev => 
      prev.includes(stayId) ? prev.filter(id => id !== stayId) : [...prev, stayId]
    );
    showToast('Saved to your favorites list.');
  };

  const handleRequestBooking = async (bookingData) => {
    const saved = await createBookingRequest(bookingData);
    setBookings(prev => [saved, ...prev]);
    setBookingConfirmationData(bookingData);
    showToast('Booking request sent directly to host via WhatsApp!');
  };

  const handleSendInquiry = async (text) => {
    const saved = await createInquiry({ text, stayId: selectedStay?.id, guestName: 'You (Tourist)' });
    setInquiries(prev => [saved, ...prev]);
    showToast('Inquiry delivered to host on WhatsApp!');
  };

  const handleAcceptBooking = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Confirmed' } : b));
    showToast('Booking accepted! Confirmation WhatsApp sent to tourist.');
  };

  const handleDeclineBooking = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Declined' } : b));
    showToast('Booking declined.');
  };

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setCurrentView('dashboard');
    showToast('Welcome back, Ramesh Bhai! Logged in to Operator Studio.');
  };

  const handleSignupComplete = (type) => {
    if (type === 'operator') {
      setUserRole('operator');
      setCurrentView('onboarding');
      showToast('Account created! Let\'s set up your listing via WhatsApp.');
    } else {
      setUserRole('tourist');
      setCurrentView('planner');
      showToast('Account created! Welcome to Travelflow.');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentView('landing');
    showToast('Logged out successfully.');
  };

  // Callback when Gemini AI generates a new trip
  const handleGeneratedTrip = (savedTrip) => {
    if (savedTrip) {
      setActiveTrip(savedTrip);
      setSelectedDestId(savedTrip.destinationId || 'goa');
      handleNavigate('trip', `/trip/${savedTrip.id}`);
      showToast(`Trip to ${savedTrip.destinationName} generated & saved!`);
    } else {
      const el = document.getElementById('budget-overview');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Itinerary activity mutation handlers
  const handleAddActivity = (dayNum = 1) => {
    setAddActivityDayNum(dayNum);
    setIsAddActivityOpen(true);
  };

  const handleSaveNewActivity = async (newAct) => {
    if (activeTrip && activeTrip.id) {
      const updated = await addActivityToTrip(activeTrip.id, addActivityDayNum, newAct);
      if (updated) {
        setActiveTrip(updated);
        showToast(`Added "${newAct.title}" to Day ${addActivityDayNum}!`);
      }
    } else {
      setCustomActivities(prev => [...prev, { ...newAct, day: addActivityDayNum }]);
      showToast(`Added "${newAct.title}" to your active itinerary!`);
    }
  };

  const handleDeleteActivity = async (dayNum, actId) => {
    if (activeTrip && activeTrip.id) {
      const updated = await deleteActivityFromTrip(activeTrip.id, dayNum, actId);
      if (updated) {
        setActiveTrip(updated);
        showToast('Activity removed from schedule.');
      }
    } else {
      setCustomActivities(prev => prev.filter(a => a.id !== actId));
      showToast('Activity removed.');
    }
  };

  // Apply activity from WhatsApp AI Concierge
  const handleApplyCoPlanActivity = async (newActivity) => {
    if (activeTrip && activeTrip.id) {
      const updated = await addActivityToTrip(activeTrip.id, 1, newActivity);
      if (updated) setActiveTrip(updated);
    } else {
      setCustomActivities(prev => [...prev, newActivity]);
    }
    showToast(`✓ Applied "${newActivity.title}" to your active itinerary!`);
  };

  return (
    <div className="travelflow-root-app min-h-screen flex flex-col font-sans">
      
      {/* Universal Dynamic Navbar */}
      <Navbar 
        currentView={currentView}
        onNavigate={handleNavigate}
        userRole={userRole}
        onLogout={handleLogout}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        onOpenApiSettings={() => setIsApiSettingsOpen(true)}
        onScrollToSection={handleScrollToSection}
        activeSection={activeSection}
        hasActiveTrip={Boolean(activeTrip)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0E1F1B] text-[#FAF6F0] px-4 py-3 rounded-xl shadow-2xl border border-[#c4963d]/40 flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* View Router */}
      <div className="flex-1">
        
        {/* VIEW 1: LANDING PAGE */}
        {currentView === 'landing' && (
          <div>
            <div id="landing">
              <LandingHero 
                onExplore={() => handleNavigate('planner')}
                onListBusiness={() => handleNavigate('onboarding')}
                onSelectListing={handleSelectKutchStay}
              />
            </div>

            {/* Trip Planner & Discovery Experience Section */}
            <div id="planner" style={{ position: 'relative', overflow: 'hidden' }}>
              <Background3D />
              <HeroSearch 
                tripParams={tripParams}
                setTripParams={setTripParams}
                selectedDest={destination}
                setSelectedDestId={setSelectedDestId}
                onGeneratePlan={handleGeneratedTrip}
              />
            </div>

            {/* Budget Feasibility */}
            <BudgetTierOverview 
              destination={destination}
              tripParams={tripParams}
              activeTier={activeTier}
              setActiveTier={setActiveTier}
            />

            {/* Itinerary */}
            <ItineraryView 
              destination={destination}
              tripParams={tripParams}
              customActivities={customActivities}
              onAddCustomActivity={(act) => setCustomActivities(prev => [...prev, act])}
              onDeleteCustomActivity={(actId) => setCustomActivities(prev => prev.filter(a => a.id !== actId))}
              onOpenAIChat={() => setIsAIChatOpen(true)}
            />

            {/* Transit comparison */}
            <TransitSection 
              destination={destination}
              tripParams={tripParams}
              onOpenRedirectModal={data => setRedirectModalData(data)}
            />

            {/* Curated Stays with clickable cards */}
            <StaysSection 
              destination={destination}
              tripParams={tripParams}
              onOpenRedirectModal={data => setRedirectModalData(data)}
              onSelectStay={handleSelectStay}
            />

            <Footer onOpenAIChat={() => setIsAIChatOpen(true)} />
          </div>
        )}

        {/* VIEW 2: DEDICATED PLANNER / CONSOLE */}
        {currentView === 'planner' && (
          <div>
            <div id="planner" style={{ position: 'relative', overflow: 'hidden' }}>
              <Background3D />
              <HeroSearch 
                tripParams={tripParams}
                setTripParams={setTripParams}
                selectedDest={destination}
                setSelectedDestId={setSelectedDestId}
                onGeneratePlan={handleGeneratedTrip}
              />
            </div>

            <BudgetTierOverview 
              destination={destination}
              tripParams={tripParams}
              activeTier={activeTier}
              setActiveTier={setActiveTier}
            />

            <ItineraryView 
              destination={destination}
              tripParams={tripParams}
              customActivities={customActivities}
              onAddCustomActivity={(act) => setCustomActivities(prev => [...prev, act])}
              onDeleteCustomActivity={(actId) => setCustomActivities(prev => prev.filter(a => a.id !== actId))}
              onOpenAIChat={() => setIsAIChatOpen(true)}
            />

            <TransitSection 
              destination={destination}
              tripParams={tripParams}
              onOpenRedirectModal={data => setRedirectModalData(data)}
            />

            <StaysSection 
              destination={destination}
              tripParams={tripParams}
              onOpenRedirectModal={data => setRedirectModalData(data)}
              onSelectStay={handleSelectStay}
            />

            <Footer onOpenAIChat={() => setIsAIChatOpen(true)} />
          </div>
        )}

        {/* VIEW 3: DEDICATED GENERATED TRIP DETAIL VIEW (/trip/:id) */}
        {currentView === 'trip' && (
          <TripDetailView 
            trip={activeTrip || {
              id: 'demo-trip',
              destinationName: destination.name,
              sourceCity: tripParams.sourceCity,
              startDate: tripParams.startDate,
              endDate: tripParams.endDate,
              travelers: tripParams.travelers,
              budget: tripParams.budget,
              summary: `Personalized ${destination.defaultDays || 4}-day journey to ${destination.name}.`,
              itineraryDays: destination.itineraryDays || [],
              budgetBreakdown: {
                stays: Math.round(tripParams.budget * 0.38),
                transit: Math.round(tripParams.budget * 0.26),
                food: Math.round(tripParams.budget * 0.22),
                activities: Math.round(tripParams.budget * 0.14),
                feasibilityStatus: 'Well Aligned'
              }
            }}
            onBack={() => handleNavigate('planner')}
            onOpenAIChat={() => setIsAIChatOpen(true)}
            onOpenRedirectModal={data => setRedirectModalData(data)}
            onAddActivity={handleAddActivity}
            onDeleteActivity={handleDeleteActivity}
          />
        )}

        {/* VIEW 4: CURATED DESTINATIONS DIRECTORY (/destinations) */}
        {currentView === 'destinations' && (
          <DestinationsExplorerView 
            destinations={allDestinations}
            onSelectDestination={(destId) => {
              setSelectedDestId(destId);
              setTripParams(prev => ({ ...prev, destinationId: destId }));
              handleNavigate('planner');
            }}
            onViewDestinationDetails={(destId) => {
              setSelectedDestId(destId);
              handleNavigate('planner');
            }}
          />
        )}

        {/* VIEW 5: DETAILED LISTING VIEW */}
        {currentView === 'listing' && (
          <ListingDetailView 
            stay={selectedStay}
            onBack={() => handleNavigate('landing')}
            onRequestBooking={handleRequestBooking}
            onOpenMessageHost={() => setIsHostMessageOpen(true)}
            isFavorite={selectedStay ? favorites.includes(selectedStay.id) : false}
            onToggleFavorite={() => selectedStay && handleToggleFavorite(selectedStay.id)}
          />
        )}

        {/* VIEW 6: WHATSAPP AI ONBOARDING DEMO */}
        {currentView === 'onboarding' && (
          <WhatsAppOnboardingView 
            onNavigate={handleNavigate}
            onPreviewListing={handleSelectKutchStay}
          />
        )}

        {/* VIEW 7: OPERATOR STUDIO DASHBOARD */}
        {currentView === 'dashboard' && (
          <OperatorDashboardView 
            bookings={bookings}
            inquiries={inquiries}
            onAcceptBooking={handleAcceptBooking}
            onDeclineBooking={handleDeclineBooking}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        )}

        {/* VIEW 8: LOGIN */}
        {currentView === 'login' && (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess}
            onSwitchToSignup={() => handleNavigate('signup')}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW 9: SIGNUP */}
        {currentView === 'signup' && (
          <SignupPage 
            onSignupComplete={handleSignupComplete}
            onSwitchToLogin={() => handleNavigate('login')}
          />
        )}

      </div>

      {/* Booking Confirmation Modal */}
      {bookingConfirmationData && (
        <BookingConfirmationModal 
          bookingData={bookingConfirmationData}
          onClose={() => setBookingConfirmationData(null)}
          onNavigateToDashboard={() => {
            setBookingConfirmationData(null);
            setUserRole('operator');
            setCurrentView('dashboard');
          }}
        />
      )}

      {/* Host Message Inquiry Modal */}
      <HostMessageModal 
        isOpen={isHostMessageOpen}
        onClose={() => setIsHostMessageOpen(false)}
        hostName={selectedStay?.hostName || 'Ramesh Bhai'}
        stayName={selectedStay?.name || 'Kutch Desert Hearth Homestay'}
        onSendInquiry={handleSendInquiry}
      />

      {/* Partner Redirect Modal */}
      {redirectModalData && (
        <BookingRedirectModal 
          redirectData={redirectModalData}
          onClose={() => setRedirectModalData(null)}
        />
      )}

      {/* WhatsApp AI Travel Concierge Modal (Context-Aware Gemini 2.5 Flash) */}
      <WhatsAppBotModal 
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        destination={destination}
        tripParams={tripParams}
        currentTrip={activeTrip}
        onApplyActivity={handleApplyCoPlanActivity}
        onOpenRedirectModal={data => setRedirectModalData(data)}
        onOpenApiSettings={() => setIsApiSettingsOpen(true)}
      />

      {/* API & Cloud Settings Modal */}
      <ApiSettingsModal 
        isOpen={isApiSettingsOpen}
        onClose={() => setIsApiSettingsOpen(false)}
      />

      {/* Add Activity Modal */}
      <AddActivityModal 
        isOpen={isAddActivityOpen}
        onClose={() => setIsAddActivityOpen(false)}
        dayNumber={addActivityDayNum}
        onSave={handleSaveNewActivity}
      />

      {/* Floating AI Co-Planner Trigger */}
      {currentView !== 'onboarding' && currentView !== 'dashboard' && (
        <FloatingAIChatTrigger onClick={() => setIsAIChatOpen(true)} />
      )}

    </div>
  );
}
