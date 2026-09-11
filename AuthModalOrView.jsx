import React, { useState } from 'react';
import { Compass, ArrowRight, UserCheck, Sparkles, Building, User } from 'lucide-react';

export function LoginPage({ onLoginSuccess, onSwitchToSignup }) {
  const [email, setEmail] = useState('ramesh.kutch@travelflow.in');
  const [password, setPassword] = useState('demo1234');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess('operator');
  };

  return (
    <div className="auth-page-bg min-h-screen bg-[#FAF8F5] py-12 flex items-center justify-center px-4 text-[#142421]">
      <div className="w-full max-w-md bg-white border border-[#E5DED2] rounded-2xl shadow-xl p-8">
        
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#142421] text-white mb-3 shadow-md">
            <Compass size={24} />
          </div>
          <h2 className="text-2xl font-black text-[#0E1F1B] font-display">Sign In to Travelflow</h2>
          <p className="text-xs text-[#627772] mt-1">Access your operator dashboard or tourist bookings</p>
        </div>

        {/* Demo Fast Login Banner */}
        <div className="bg-[#FAF0E6] border border-[#C85A32]/30 rounded-xl p-3.5 mb-6 text-xs text-[#142421]">
          <div className="flex items-center justify-between font-bold text-[#C85A32] mb-1">
            <span className="flex items-center gap-1.5"><Sparkles size={14} /> Quick Demo Access</span>
            <span className="bg-[#C85A32] text-white text-[10px] px-1.5 py-0.5 rounded">1-Click</span>
          </div>
          <p className="text-[11px] text-[#556B66] mb-2.5">
            Log in directly as <strong>Ramesh Bhai</strong> (Kutch Desert Hearth Homestay Operator) to test the dashboard.
          </p>
          <button
            type="button"
            onClick={() => onLoginSuccess('operator')}
            className="w-full bg-[#C85A32] hover:bg-[#B34B25] text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <UserCheck size={14} /> Try Operator Studio Demo Account
          </button>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4A5D59] mb-1">Email or Phone</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D5DDD8] rounded-lg text-xs font-semibold focus:outline-none focus:border-[#C85A32]"
              placeholder="e.g. 9825088912 or name@domain.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A5D59] mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D5DDD8] rounded-lg text-xs font-semibold focus:outline-none focus:border-[#C85A32]"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#142421] hover:bg-[#0E1F1B] text-white py-2.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E5DED2] text-center text-xs text-[#627772]">
          <span>Don't have an account? </span>
          <button onClick={onSwitchToSignup} className="font-bold text-[#C85A32] hover:underline">
            Create an Account
          </button>
        </div>

      </div>
    </div>
  );
}

export function SignupPage({ onSignupComplete, onSwitchToLogin }) {
  const [accountType, setAccountType] = useState('operator');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    onSignupComplete(accountType);
  };

  return (
    <div className="auth-page-bg min-h-screen bg-[#FAF8F5] py-12 flex items-center justify-center px-4 text-[#142421]">
      <div className="w-full max-w-md bg-white border border-[#E5DED2] rounded-2xl shadow-xl p-8">
        
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#142421] text-white mb-3 shadow-md">
            <Compass size={24} />
          </div>
          <h2 className="text-2xl font-black text-[#0E1F1B] font-display">Join Travelflow</h2>
          <p className="text-xs text-[#627772] mt-1">Get listed via WhatsApp or discover authentic travel</p>
        </div>

        {/* Account Type Selection */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            type="button"
            onClick={() => setAccountType('operator')}
            className={`p-3 rounded-xl border text-left transition-all ${
              accountType === 'operator' 
                ? 'border-[#2D5A43] bg-[#E8F5EE] shadow-sm' 
                : 'border-[#E5DED2] bg-[#FAF8F5] opacity-70'
            }`}
          >
            <Building size={18} className="text-[#2D5A43] mb-1.5" />
            <h4 className="font-bold text-xs text-[#0E1F1B]">Tourism Operator</h4>
            <p className="text-[10px] text-[#556B66]">List homestay/dhaba</p>
          </button>

          <button 
            type="button"
            onClick={() => setAccountType('tourist')}
            className={`p-3 rounded-xl border text-left transition-all ${
              accountType === 'tourist' 
                ? 'border-[#C85A32] bg-[#FAF0E6] shadow-sm' 
                : 'border-[#E5DED2] bg-[#FAF8F5] opacity-70'
            }`}
          >
            <User size={18} className="text-[#C85A32] mb-1.5" />
            <h4 className="font-bold text-xs text-[#0E1F1B]">Tourist</h4>
            <p className="text-[10px] text-[#556B66]">Explore & book stays</p>
          </button>
        </div>

        <form onSubmit={handleSignupSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4A5D59] mb-1">Full Name</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D5DDD8] rounded-lg text-xs font-semibold focus:outline-none focus:border-[#C85A32]"
              placeholder="e.g. Ramesh Bhai"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A5D59] mb-1">WhatsApp Phone Number</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D5DDD8] rounded-lg text-xs font-semibold focus:outline-none focus:border-[#C85A32]"
              placeholder="+91 98250 00000"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#C85A32] hover:bg-[#B34B25] text-white py-2.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{accountType === 'operator' ? 'Continue to WhatsApp Onboarding ↗' : 'Start Exploring'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E5DED2] text-center text-xs text-[#627772]">
          <span>Already have an account? </span>
          <button onClick={onSwitchToLogin} className="font-bold text-[#142421] hover:underline">
            Sign In
          </button>
        </div>

      </div>
    </div>
  );
}
