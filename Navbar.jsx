import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  LogIn, 
  LayoutDashboard, 
  LogOut, 
  MessageSquare, 
  Map, 
  Menu, 
  X, 
  Sliders, 
  Key,
  CalendarDays
} from 'lucide-react';
import { isAiConfigured, isGeminiConfigured } from '../services/aiService';

export default function Navbar({ 
  currentView = 'landing',
  onNavigate, 
  userRole, 
  onLogout,
  onOpenAIChat,
  onOpenApiSettings,
  onScrollToSection,
  activeSection = 'landing',
  hasActiveTrip = false
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDashboard = currentView === 'dashboard';
  const hasAi = isAiConfigured();

  const handleMobileNav = (viewOrAction) => {
    setIsMobileMenuOpen(false);
    if (typeof viewOrAction === 'string') {
      if (currentView === 'landing' && (viewOrAction === 'landing' || viewOrAction === 'planner')) {
        onScrollToSection?.(viewOrAction);
      } else {
        onNavigate?.(viewOrAction);
      }
    } else if (typeof viewOrAction === 'function') {
      viewOrAction();
    }
  };

  return (
    <header className={`site-header ${isDashboard ? 'header-dark' : ''}`}>
      <div className="container header-container">
        
        {/* Brand Logo */}
        <div 
          className="brand-logo cursor-pointer" 
          onClick={() => onNavigate ? onNavigate('landing') : onScrollToSection('landing')}
        >
          <div className={`brand-icon ${isDashboard ? 'bg-[#c4963d] text-[#071310]' : ''}`}>
            <Compass size={20} strokeWidth={2.2} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Travelflow</span>
            <span className="brand-subtitle">
              {isDashboard ? 'Operator Studio' : 'AI Travel Intelligence'}
            </span>
          </div>
        </div>

        {/* Desktop Public Navigation */}
        {!isDashboard && (
          <nav className="header-nav hidden md:flex">
            <button 
              className={`nav-link ${currentView === 'landing' && activeSection === 'landing' ? 'active' : ''}`}
              onClick={() => {
                if (currentView !== 'landing') onNavigate('landing');
                else onScrollToSection('landing');
              }}
            >
              Get Started
            </button>
            <button 
              className={`nav-link ${currentView === 'planner' || activeSection === 'planner' ? 'active' : ''}`}
              onClick={() => {
                if (currentView !== 'planner' && currentView !== 'landing') onNavigate('planner');
                else onScrollToSection('planner');
              }}
            >
              AI Planner 3.0
            </button>
            <button 
              className={`nav-link ${currentView === 'destinations' ? 'active' : ''}`}
              onClick={() => onNavigate('destinations')}
            >
              Destinations
            </button>
            {hasActiveTrip && (
              <button 
                className={`nav-link ${currentView === 'trip' ? 'active' : ''} text-[#c4963d] flex items-center gap-1 font-bold`}
                onClick={() => onNavigate('trip')}
              >
                <CalendarDays size={13} />
                <span>Active Trip</span>
              </button>
            )}
            <button 
              className={`nav-link ${currentView === 'onboarding' ? 'active' : ''}`}
              onClick={() => onNavigate('onboarding')}
            >
              <span className="flex items-center gap-1.5">
                <MessageSquare size={13} className="text-[#25D366]" />
                WhatsApp Host Demo
              </span>
            </button>
          </nav>
        )}

        {/* Action Buttons */}
        <div className="header-actions flex items-center gap-2">
          
          {/* API Settings Button */}
          {onOpenApiSettings && (
            <button
              type="button"
              onClick={onOpenApiSettings}
              className="p-2 rounded-lg border border-[#e0e7e4] hover:bg-[#faf3e5] text-gray-700 hover:text-[#0b221d] transition-colors relative"
              title="Configure Gemini API Key & Supabase"
            >
              <Key size={15} />
              <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${hasAi ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
            </button>
          )}

          {/* If on Operator Dashboard */}
          {isDashboard ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onNavigate('landing')}
                className="text-xs font-bold text-[#8EA8A1] hover:text-white px-3 py-1.5 rounded-lg border border-[#15342C] transition-colors"
              >
                Public Site
              </button>
              <button 
                onClick={onLogout}
                className="bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          ) : (
            /* Public Actions */
            <div className="flex items-center gap-2">
              
              {userRole === 'operator' ? (
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="hidden sm:inline-flex items-center gap-1.5 bg-[#0E241E] text-[#25D366] text-xs font-bold px-3.5 py-2 rounded-lg border border-[#1B4337] hover:bg-[#15342C]"
                >
                  <LayoutDashboard size={14} />
                  <span>Operator Studio</span>
                </button>
              ) : (
                <button 
                  onClick={() => onNavigate('login')}
                  className="hidden sm:inline-flex items-center gap-1.5 text-[#142421] text-xs font-bold px-3 py-2 rounded-lg border border-[#D5DDD8] hover:bg-[#FAF0E6] transition-colors"
                >
                  <LogIn size={13} />
                  <span>Host Login</span>
                </button>
              )}

              {/* AI Concierge Trigger */}
              <button 
                type="button"
                className="ai-planner-nav-btn"
                onClick={onOpenAIChat}
                title="Launch TravelFlow AI Concierge"
              >
                <Sparkles size={14} className="sparkle-gold" />
                <span className="hidden sm:inline">AI Concierge</span>
                <span className="sm:hidden">AI</span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                className="md:hidden p-2 rounded-lg border border-[#e0e7e4] text-gray-700"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

            </div>
          )}

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e0e7e4] px-4 py-4 shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-2">
            <button 
              className="text-left px-3 py-2 text-xs font-bold text-gray-800 hover:bg-gray-50 rounded-lg"
              onClick={() => handleMobileNav('landing')}
            >
              Get Started
            </button>
            <button 
              className="text-left px-3 py-2 text-xs font-bold text-gray-800 hover:bg-gray-50 rounded-lg"
              onClick={() => handleMobileNav('planner')}
            >
              AI Planner 3.0
            </button>
            <button 
              className="text-left px-3 py-2 text-xs font-bold text-gray-800 hover:bg-gray-50 rounded-lg"
              onClick={() => handleMobileNav('destinations')}
            >
              Curated Destinations
            </button>
            {hasActiveTrip && (
              <button 
                className="text-left px-3 py-2 text-xs font-bold text-[#c4963d] hover:bg-[#faf3e5] rounded-lg flex items-center gap-1.5"
                onClick={() => handleMobileNav('trip')}
              >
                <CalendarDays size={14} />
                <span>View Generated Trip</span>
              </button>
            )}
            <button 
              className="text-left px-3 py-2 text-xs font-bold text-[#25D366] hover:bg-emerald-50 rounded-lg flex items-center gap-1.5"
              onClick={() => handleMobileNav('onboarding')}
            >
              <MessageSquare size={14} />
              <span>WhatsApp Host Onboarding Demo</span>
            </button>
            <div className="border-t border-gray-200 my-1 pt-2 flex items-center justify-between">
              <button 
                className="text-xs font-bold text-gray-700 flex items-center gap-1"
                onClick={() => handleMobileNav('login')}
              >
                <LogIn size={13} />
                <span>Host Login</span>
              </button>
              {onOpenApiSettings && (
                <button
                  className="text-xs font-bold text-[#c4963d] flex items-center gap-1"
                  onClick={() => { setIsMobileMenuOpen(false); onOpenApiSettings(); }}
                >
                  <Key size={13} />
                  <span>API Settings</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
