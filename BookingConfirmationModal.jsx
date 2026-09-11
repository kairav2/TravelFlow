import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, X, MapPin } from 'lucide-react';

export function BookingConfirmationModal({ bookingData, onClose, onNavigateToDashboard }) {
  if (!bookingData) return null;

  const { stay, checkIn, checkOut, guests, nights, totalAmount } = bookingData;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden border border-[#E5DED2] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#EBF5EE] p-6 text-center border-b border-[#D5E6DC] relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-[#556B66] hover:text-[#0E1F1B] p-1"
          >
            <X size={18} />
          </button>
          
          <div className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <CheckCircle2 size={32} />
          </div>
          
          <h3 className="text-xl font-extrabold text-[#0E1F1B] font-display">
            Booking Request Sent! 🎉
          </h3>
          <p className="text-xs text-[#4A5D59] mt-1">
            Delivered directly to {stay.hostName || 'the host'} via WhatsApp
          </p>
        </div>

        {/* Details Body */}
        <div className="p-6 space-y-4 text-xs text-[#142421]">
          
          <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E5DED2] space-y-2">
            <div className="font-bold text-sm text-[#0E1F1B]">{stay.name}</div>
            <div className="flex items-center gap-1.5 text-[#556B66]">
              <MapPin size={12} className="text-[#C85A32]" />
              <span>{stay.location || 'Kutch, Gujarat'}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#E5DED2] text-[#4A5D59]">
              <span>Dates: {checkIn} to {checkOut} ({nights} nights)</span>
              <span>{guests} Guests</span>
            </div>
          </div>

          <div className="flex justify-between items-center bg-[#FAF0E6] p-3 rounded-lg text-[#C85A32] font-bold">
            <span>Total Estimated Amount</span>
            <span className="text-base">₹{totalAmount?.toLocaleString('en-IN')}</span>
          </div>

          <div className="space-y-2 pt-2 text-[#556B66] text-[11px] leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] mt-1.5 flex-shrink-0"></span>
              <span>Host will review and respond with WhatsApp payment UPI QR within 2 hours.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A43] mt-1.5 flex-shrink-0"></span>
              <span>Your booking is protected by Travelflow Grassroots Guarantee.</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={onNavigateToDashboard}
              className="w-full bg-[#0E1F1B] hover:bg-[#142421] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span>View in Operator Studio (Demo)</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={onClose}
              className="w-full bg-[#FAF8F5] hover:bg-[#EAE3D8] text-[#556B66] py-2.5 rounded-xl font-bold transition-all text-xs"
            >
              Back to Browsing
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export function HostMessageModal({ isOpen, onClose, hostName, stayName, onSendInquiry }) {
  const [message, setMessage] = useState('Namaste! I would like to check availability and know more about the home cooked meals.');

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    onSendInquiry(message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden border border-[#E5DED2]">
        <div className="bg-[#075E54] text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#128C7E] flex items-center justify-center font-bold text-xs">
              {hostName ? hostName[0] : 'H'}
            </div>
            <div>
              <h4 className="font-bold text-xs">Direct WhatsApp Inquiry</h4>
              <p className="text-[10px] text-[#A7D7C5]">Message {hostName || 'Host'} directly</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X size={16} /></button>
        </div>

        <form onSubmit={handleSend} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4A5D59] mb-1">Inquiry for {stayName}</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 bg-[#FAF8F5] border border-[#D5DDD8] rounded-xl text-xs focus:outline-none focus:border-[#075E54]"
              placeholder="Ask about check-in timing, food preferences, accessibility..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-[#071310] py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md"
          >
            <span>Send Message on WhatsApp</span>
            <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
