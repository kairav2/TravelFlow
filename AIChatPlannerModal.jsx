import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Sparkles, Plus, ExternalLink, Check, Zap, Compass } from 'lucide-react';
import { askTravelFlowAI } from '../services/aiService';
import { PartnerLogo } from './PartnerLogos';

export default function AIChatPlannerModal({ isOpen, onClose, destination, tripParams, onApplyItemToItinerary }) {
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [appliedItems, setAppliedItems] = useState([]);
  const chatEndRef = useRef(null);
  const prevDestIdRef = useRef(null);
  const msgCounterRef = useRef(1);

  // Initialize proactive AI greeting on open or destination change
  useEffect(() => {
    if (isOpen) {
      const destId = destination?.id || 'default';
      if (prevDestIdRef.current !== destId || messages.length === 0) {
        prevDestIdRef.current = destId;
        const destName = destination?.name || 'your destination';
        const initialGreeting = {
          id: `welcome-${destId}-${msgCounterRef.current++}`,
          sender: 'ai',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Hey! I'm your AI Trip Co-Planner for **${destName}**. I've analyzed your dates (${tripParams.startDate} to ${tripParams.endDate}) and budget (₹${tripParams.budget.toLocaleString()}).\n\nHow should we co-plan your itinerary today? Here are some top suggestions:`,
          suggestions: [
            `✨ Add Sunset Cruise at Mandovi River (₹800)`,
            `🏖️ Find Top Budget Stay under ₹2,500/night`,
            `🚆 Compare Fast Trains from ${tripParams.sourceCity}`,
            `📸 Suggest 3 Hidden Scenic Spots`
          ],
          bookingChips: destination?.platformOptions ? destination.platformOptions.slice(0, 3) : []
        };

        setMessages([initialGreeting]);
      }
    }
  }, [isOpen, destination, tripParams, messages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const userMessage = {
      id: `user-msg-${msgCounterRef.current++}`,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputMsg('');
    setIsTyping(true);

    try {
      const aiReplyText = await askTravelFlowAI(text, destination);

      // Check if reply contains a recommendable activity to add to itinerary
      let suggestedActivity = null;
      if (text.toLowerCase().includes('sunset') || text.toLowerCase().includes('add') || text.toLowerCase().includes('spot') || text.toLowerCase().includes('cruise')) {
        suggestedActivity = {
          id: `ai-act-${msgCounterRef.current++}`,
          title: text.replace(/✨|🏖️|🚆|📸|Add|Find/g, '').trim() || `Bespoke Experience in ${destination.name}`,
          category: 'attraction',
          cost: 1200,
          time: '04:30 PM - 06:30 PM',
          desc: 'AI Suggested co-planned activity customized for your schedule.'
        };
      }

      const aiMessage = {
        id: `ai-msg-${msgCounterRef.current++}`,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: aiReplyText,
        suggestedActivity: suggestedActivity,
        bookingChips: destination?.platformOptions ? destination.platformOptions.slice(0, 2) : []
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error("AI Chat error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleApplyToItinerary = (activity) => {
    if (onApplyItemToItinerary) {
      onApplyItemToItinerary(activity);
      setAppliedItems(prev => [...prev, activity.id]);
    }
  };

  return (
    <div className="ai-chat-backdrop">
      <div className="ai-chat-window">
        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-brand">
            <div className="ai-avatar-box">
              <Bot size={22} />
              <div className="pulse-dot"></div>
            </div>
            <div>
              <div className="ai-chat-title">AI Co-Planner 3.0</div>
              <div className="ai-chat-subtitle">Co-planning for {destination?.name || 'Destination'} • Live LLM Connected</div>
            </div>
          </div>

          <button className="ai-close-btn" onClick={onClose} aria-label="Close Chat">
            <X size={18} />
          </button>
        </div>

        {/* Message Thread */}
        <div className="ai-chat-body">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-row ${msg.sender === 'user' ? 'user-row' : 'ai-row'}`}>
              {msg.sender === 'ai' && (
                <div className="ai-mini-icon">
                  <Sparkles size={14} />
                </div>
              )}

              <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                <div className="msg-text">{msg.text}</div>

                {/* Suggestions List */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="suggestion-chips-grid">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        className="suggestion-chip-btn"
                        onClick={() => handleSendMessage(sug)}
                      >
                        <Zap size={13} />
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Direct "Apply to Itinerary" Co-Planning Action */}
                {msg.suggestedActivity && (
                  <div className="ai-co-plan-card">
                    <div className="co-plan-info">
                      <Compass size={16} />
                      <div>
                        <strong>{msg.suggestedActivity.title}</strong>
                        <span>{msg.suggestedActivity.time} • Est. ₹{msg.suggestedActivity.cost}</span>
                      </div>
                    </div>
                    <button
                      className={`apply-act-btn ${appliedItems.includes(msg.suggestedActivity.id) ? 'applied' : ''}`}
                      onClick={() => handleApplyToItinerary(msg.suggestedActivity)}
                      disabled={appliedItems.includes(msg.suggestedActivity.id)}
                    >
                      {appliedItems.includes(msg.suggestedActivity.id) ? (
                        <>
                          <Check size={14} />
                          <span>Added to Plan</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} />
                          <span>Apply to Itinerary</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Booking Suggestion Chips with Logos */}
                {msg.bookingChips && msg.bookingChips.length > 0 && (
                  <div className="ai-booking-chips-container">
                    <div className="chips-label">Direct Booking Recommendations:</div>
                    <div className="chips-flex">
                      {msg.bookingChips.map((opt, i) => (
                        <a
                          key={i}
                          href={opt.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ai-booking-chip"
                        >
                          <PartnerLogo platform={opt.platform} size={20} />
                          <div className="chip-details">
                            <span className="chip-platform">{opt.platform}</span>
                            <span className="chip-price">{opt.price}</span>
                          </div>
                          <ExternalLink size={12} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="msg-time">{msg.time}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-row ai-row">
              <div className="ai-mini-icon">
                <Sparkles size={14} />
              </div>
              <div className="chat-bubble ai-bubble typing-bubble">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="typing-label">AI is generating itinerary options...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form 
          className="ai-chat-input-form" 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            type="text"
            className="ai-chat-input"
            placeholder={`Ask AI to add activities, swap hotels, or refine budget...`}
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
          />
          <button type="submit" className="ai-send-btn" disabled={!inputMsg.trim() || isTyping}>
            <Send size={16} />
          </button>
        </form>
      </div>

      <style>{`
        .ai-chat-backdrop {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(5, 20, 17, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .ai-chat-window {
          width: 100%;
          max-width: 680px;
          height: 640px;
          max-height: 90vh;
          background: #0b221d;
          border: 1px solid rgba(196, 150, 61, 0.4);
          border-radius: var(--radius-lg, 6px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(196, 150, 61, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .ai-chat-header {
          padding: 16px 20px;
          background: rgba(5, 20, 17, 0.9);
          border-bottom: 1px solid rgba(196, 150, 61, 0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ai-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ai-avatar-box {
          width: 42px;
          height: 42px;
          border-radius: 4px;
          background: linear-gradient(135deg, #c4963d 0%, #0b221d 100%);
          color: #faf3e5;
          display: grid;
          place-items: center;
          position: relative;
          border: 1px solid #c4963d;
        }

        .pulse-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          background: #22c55e;
          border-radius: 50%;
          border: 2px solid #0b221d;
        }

        .ai-chat-title {
          font-family: var(--font-sans);
          font-weight: 800;
          font-size: 1.05rem;
          color: #faf3e5;
          letter-spacing: -0.01em;
        }

        .ai-chat-subtitle {
          font-size: 0.76rem;
          color: rgba(250, 243, 229, 0.7);
        }

        .ai-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #faf3e5;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ai-close-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
          color: #ef4444;
        }

        .ai-chat-body {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: radial-gradient(rgba(196, 150, 61, 0.06) 1.2px, transparent 1.2px);
          background-size: 20px 20px;
        }

        .chat-row {
          display: flex;
          gap: 10px;
          max-width: 88%;
        }

        .user-row {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .ai-row {
          align-self: flex-start;
        }

        .ai-mini-icon {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          background: rgba(196, 150, 61, 0.2);
          border: 1px solid #c4963d;
          color: #c4963d;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .chat-bubble {
          padding: 14px 16px;
          border-radius: 6px;
          font-size: 0.9rem;
          line-height: 1.5;
          position: relative;
        }

        .ai-bubble {
          background: rgba(11, 34, 29, 0.95);
          border: 1px solid rgba(196, 150, 61, 0.3);
          color: #faf3e5;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .user-bubble {
          background: linear-gradient(135deg, #c4963d 0%, #a1782a 100%);
          color: #051411;
          font-weight: 600;
          border: 1px solid #c4963d;
        }

        .msg-text {
          white-space: pre-wrap;
        }

        .msg-time {
          font-size: 0.68rem;
          opacity: 0.6;
          margin-top: 6px;
          text-align: right;
        }

        .suggestion-chips-grid {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 12px;
        }

        .suggestion-chip-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(196, 150, 61, 0.1);
          border: 1px solid rgba(196, 150, 61, 0.3);
          border-radius: 4px;
          color: #faf3e5;
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .suggestion-chip-btn:hover {
          background: rgba(196, 150, 61, 0.25);
          border-color: #c4963d;
          transform: translateX(4px);
        }

        .ai-co-plan-card {
          margin-top: 12px;
          padding: 12px;
          background: rgba(5, 20, 17, 0.8);
          border: 1px solid #c4963d;
          border-left: 3px solid #c4963d;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .co-plan-info {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #faf3e5;
        }

        .co-plan-info strong {
          display: block;
          font-size: 0.85rem;
        }

        .co-plan-info span {
          font-size: 0.74rem;
          color: rgba(250, 243, 229, 0.7);
        }

        .apply-act-btn {
          padding: 6px 12px;
          border-radius: 4px;
          background: #c4963d;
          color: #051411;
          font-weight: 700;
          font-size: 0.78rem;
          display: flex;
          align-items: center;
          gap: 6px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .apply-act-btn:hover {
          background: #dbac4d;
        }

        .apply-act-btn.applied {
          background: #15803d;
          color: #ffffff;
        }

        .ai-booking-chips-container {
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px dashed rgba(196, 150, 61, 0.2);
        }

        .chips-label {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #c4963d;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .chips-flex {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .ai-booking-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          color: #faf3e5;
          text-decoration: none;
          transition: all 0.2s;
        }

        .ai-booking-chip:hover {
          border-color: #c4963d;
          background: rgba(196, 150, 61, 0.15);
        }

        .chip-details {
          display: flex;
          flex-direction: column;
        }

        .chip-platform {
          font-size: 0.75rem;
          font-weight: 700;
        }

        .chip-price {
          font-size: 0.68rem;
          color: #c4963d;
        }

        .typing-bubble {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
        }

        .typing-dots span {
          width: 6px;
          height: 6px;
          background: #c4963d;
          border-radius: 50%;
          animation: typingBlink 1.4s infinite both;
        }

        .typing-dots span:nth-child(2) { animation-delay: .2s; }
        .typing-dots span:nth-child(3) { animation-delay: .4s; }

        @keyframes typingBlink {
          0% { opacity: .2; }
          20% { opacity: 1; }
          100% { opacity: .2; }
        }

        .typing-label {
          font-size: 0.8rem;
          color: rgba(250, 243, 229, 0.7);
        }

        .ai-chat-input-form {
          padding: 14px 20px;
          background: rgba(5, 20, 17, 0.95);
          border-top: 1px solid rgba(196, 150, 61, 0.25);
          display: flex;
          gap: 10px;
        }

        .ai-chat-input {
          flex: 1;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(196, 150, 61, 0.3);
          border-radius: 4px;
          padding: 10px 14px;
          color: #faf3e5;
          font-size: 0.88rem;
          outline: none;
        }

        .ai-chat-input:focus {
          border-color: #c4963d;
          box-shadow: 0 0 10px rgba(196, 150, 61, 0.2);
        }

        .ai-send-btn {
          width: 42px;
          height: 42px;
          border-radius: 4px;
          background: #c4963d;
          color: #051411;
          border: none;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ai-send-btn:hover:not(:disabled) {
          background: #dbac4d;
          transform: scale(1.05);
        }

        .ai-send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
