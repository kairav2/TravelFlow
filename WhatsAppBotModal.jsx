import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles, 
  CheckCheck, 
  Plus, 
  ExternalLink, 
  ShieldCheck, 
  Compass,
  Zap,
  RotateCcw,
  Share2,
  Key,
  Calendar,
  IndianRupee,
  MapPin,
  Clock
} from 'lucide-react';
import { askTravelFlowAI, getActiveAiProvider, getActiveModelName } from '../services/aiService';

// WhatsApp-style and Markdown text formatting parser
function FormattedMessageText({ text }) {
  if (!text) return null;

  // Split lines
  const lines = text.split('\n');

  const parseInline = (str) => {
    // Regex for bold **text** or *text* and italic _text_
    const parts = [];
    // Match **bold** or *bold* or _italic_
    const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g;
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index));
      }
      const raw = match[0];
      if (raw.startsWith('**') && raw.endsWith('**')) {
        parts.push(<strong key={match.index} className="font-bold text-gray-900">{raw.slice(2, -2)}</strong>);
      } else if (raw.startsWith('*') && raw.endsWith('*')) {
        parts.push(<strong key={match.index} className="font-bold text-gray-900">{raw.slice(1, -1)}</strong>);
      } else if (raw.startsWith('_') && raw.endsWith('_')) {
        parts.push(<em key={match.index} className="italic text-gray-800">{raw.slice(1, -1)}</em>);
      }
      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }

    return parts.length > 0 ? parts : str;
  };

  return (
    <div className="wa-bubble-text space-y-1.5 text-[13px] leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Section header like ### Title or **Title:**
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-extrabold text-[13.5px] text-[#075E54] pt-1 pb-0.5">
              {parseInline(trimmed.replace(/^###\s+/, ''))}
            </h4>
          );
        }

        // Bullet point
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.replace(/^([•\-\*]\s+)/, '');
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1.5 py-0.5">
              <span className="text-[#075E54] font-bold mt-0.5 shrink-0">•</span>
              <span className="flex-1">{parseInline(bulletText)}</span>
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1.5 py-0.5">
              <span className="text-[#075E54] font-bold text-xs shrink-0 mt-0.5">{numMatch[1]}.</span>
              <span className="flex-1">{parseInline(numMatch[2])}</span>
            </div>
          );
        }

        return <p key={idx} className="m-0">{parseInline(line)}</p>;
      })}
    </div>
  );
}

export default function WhatsAppBotModal({ 
  isOpen, 
  onClose, 
  destination, 
  tripParams, 
  currentTrip,
  onApplyActivity,
  onOpenRedirectModal,
  onOpenApiSettings
}) {
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [appliedActivities, setAppliedActivities] = useState({});
  const [activeProvider, setActiveProvider] = useState(getActiveAiProvider());
  const [activeModel, setActiveModel] = useState(getActiveModelName());

  const chatEndRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const prevDestIdRef = useRef(null);

  const destName = destination?.name || currentTrip?.destinationName || 'Goa';
  const budget = tripParams?.budget || currentTrip?.budget || 28000;
  const dates = tripParams?.startDate && tripParams?.endDate 
    ? `${tripParams.startDate} to ${tripParams.endDate}` 
    : 'Upcoming trip';

  // Update provider on open
  useEffect(() => {
    if (isOpen) {
      setActiveProvider(getActiveAiProvider());
      setActiveModel(getActiveModelName());
    }
  }, [isOpen]);

  // Initialize proactive welcome message
  useEffect(() => {
    if (isOpen) {
      const destId = destination?.id || currentTrip?.destinationId || 'default';
      if (prevDestIdRef.current !== destId || messages.length === 0) {
        prevDestIdRef.current = destId;
        const welcome = {
          id: `wa-welcome-${Date.now()}`,
          sender: 'ai',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Namaste! 🙏 I'm your **TravelFlow AI Concierge** for *${destName}*.\n\nI have loaded your live trip context:\n• Travel Dates: *${dates}*\n• Target Budget: *₹${budget.toLocaleString()}*\n• Travelers: *${tripParams?.travelers || 2}*\n\nAsk me anything: customize activities, find hidden gems, optimize transit, or negotiate hotel deals!`,
          quickActions: [
            `🏖️ Budget stays in ${destName} under ₹3,000`,
            `🌅 Add golden hour sunset cruise`,
            `🚆 Compare fastest trains & flights`,
            `☕ Secret local cafes & culinary trails`
          ],
          action: null
        };
        setMessages([welcome]);
      }
    }
  }, [isOpen, destination, tripParams, currentTrip]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Clean up speech on close
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  if (!isOpen) return null;

  const speakReply = (text) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*_#•]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      speechRecognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInputMsg(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleResetChat = () => {
    const destId = destination?.id || currentTrip?.destinationId || 'default';
    prevDestIdRef.current = destId;
    const freshWelcome = {
      id: `wa-welcome-${Date.now()}`,
      sender: 'ai',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Chat restarted! 🔄 How can I help you customize your *${destName}* journey?`,
      quickActions: [
        `🏖️ Suggest cheaper stays under my budget`,
        `🌅 Add sunset viewpoint or cruise`,
        `🚆 Check fastest Vande Bharat trains`
      ],
      action: null
    };
    setMessages([freshWelcome]);
  };

  const handleShareOnWhatsApp = () => {
    const tripSummary = `*TravelFlow Itinerary Summary for ${destName}*\n` +
      `🗓️ Dates: ${dates}\n` +
      `💰 Budget: ₹${budget.toLocaleString()}\n` +
      `👥 Travelers: ${tripParams?.travelers || 2}\n\n` +
      `Plan generated with TravelFlow AI Concierge.\nCheck out: ${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(tripSummary)}`;
    window.open(url, '_blank');
  };

  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const userMsg = {
      id: `wa-user-${Date.now()}`,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMsg('');
    setIsTyping(true);

    try {
      const tripContext = {
        destination: destination || { name: destName },
        destinationName: destName,
        budget: budget,
        startDate: tripParams?.startDate,
        endDate: tripParams?.endDate,
        travelers: tripParams?.travelers || 2,
        itineraryDays: currentTrip?.itineraryDays || destination?.itineraryDays || []
      };

      const aiResponse = await askTravelFlowAI(text, tripContext, messages);

      // Refresh provider badges if changed
      if (aiResponse.provider) setActiveProvider(aiResponse.provider);
      if (aiResponse.model) setActiveModel(aiResponse.model);

      const aiMsg = {
        id: `wa-ai-${Date.now()}`,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: aiResponse.text,
        action: aiResponse.action,
        provider: aiResponse.provider,
        quickActions: [
          '✨ Add another scenic experience',
          '🏨 Compare hotel deals on Booking.com',
          '🚆 Check Vande Bharat timings'
        ]
      };

      setMessages(prev => [...prev, aiMsg]);
      speakReply(aiResponse.text);
    } catch (err) {
      console.error('AI chat error:', err);
      setMessages(prev => [...prev, {
        id: `wa-err-${Date.now()}`,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `⚠️ *Temporary connection hiccup:*\n\n${err.message || 'Could not connect to AI services.'}\n\nYou can tap the 🔑 Settings icon at the top to review your Groq or Gemini API credentials.`,
        action: null,
        quickActions: ['Retry last question', 'Suggest cheaper stays', 'Compare trains & flights']
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleApplyActionActivity = (act, msgId) => {
    if (onApplyActivity && act) {
      onApplyActivity(act);
      setAppliedActivities(prev => ({ ...prev, [msgId]: true }));
    }
  };

  return (
    <div className="overlay animate-fade-in" onClick={onClose} style={{ zIndex: 1200 }}>
      <div className="wa-modal-shell" onClick={e => e.stopPropagation()}>
        
        {/* Top Header — WhatsApp Brand Bar */}
        <div className="wa-header">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#128C7E] flex items-center justify-center text-white font-bold border-2 border-white/30 shadow-md">
                <Compass size={22} className="animate-spin-slow" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#075E54]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-white text-sm font-bold tracking-tight">TravelFlow Concierge</h3>
                
                {/* Active AI Provider Badge */}
                {activeProvider === 'groq' ? (
                  <span className="bg-amber-400/25 text-amber-200 text-[9.5px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-1 border border-amber-300/40">
                    <Zap size={10} className="text-amber-400 fill-amber-400" /> GROQ AI
                  </span>
                ) : activeProvider === 'gemini' ? (
                  <span className="bg-[#25D366]/20 text-[#25D366] text-[9.5px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-1 border border-[#25D366]/40">
                    <Sparkles size={9} /> GEMINI AI
                  </span>
                ) : (
                  <span className="bg-white/20 text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    LOCAL SYNTHESIS
                  </span>
                )}
              </div>
              
              <p className="text-emerald-100/80 text-[11px] flex items-center gap-1 mt-0.5">
                {isTyping ? (
                  <span className="text-white font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-ping" />
                    typing...
                  </span>
                ) : (
                  <span>online • {destName} trip</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-white">
            {/* Direct API Settings Shortcut */}
            {onOpenApiSettings && (
              <button
                type="button"
                onClick={onOpenApiSettings}
                className="p-1.5 rounded-full hover:bg-white/10 text-emerald-100 hover:text-white transition-colors"
                title="Configure Groq, Gemini & Supabase Keys"
              >
                <Key size={16} />
              </button>
            )}

            {/* Voice Audio Toggle */}
            <button 
              type="button" 
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-1.5 rounded-full transition-colors ${audioEnabled ? 'bg-[#25D366] text-white' : 'hover:bg-white/10 text-white/80'}`}
              title={audioEnabled ? 'Mute voice responses' : 'Enable spoken voice responses'}
            >
              {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Close Button */}
            <button 
              type="button" 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Trip Context & Action Bar */}
        <div className="wa-context-bar">
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap py-0.5 pr-2">
              <span className="px-2 py-0.5 rounded-md bg-white font-bold text-[#075E54] shadow-xs border border-[#cfe2db] flex items-center gap-1">
                <MapPin size={11} className="text-[#25D366]" /> {destName}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white text-gray-700 shadow-xs border border-[#cfe2db] flex items-center gap-1">
                <Calendar size={11} className="text-[#075E54]" /> {dates}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white text-gray-700 shadow-xs border border-[#cfe2db] flex items-center gap-1">
                <IndianRupee size={11} className="text-[#c4963d]" /> ₹{budget.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleShareOnWhatsApp}
                className="p-1 rounded bg-white hover:bg-emerald-50 text-[#075E54] border border-[#cfe2db] transition-colors"
                title="Share this trip on real WhatsApp"
              >
                <Share2 size={13} />
              </button>
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1 rounded bg-white hover:bg-emerald-50 text-gray-600 hover:text-gray-900 border border-[#cfe2db] transition-colors"
                title="Restart conversation"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Thread */}
        <div className="wa-body">
          
          {/* Active Model Security Assurance Banner */}
          <div className="flex justify-center my-1.5">
            <div className="bg-[#fff9db] text-[#856404] text-[10.5px] px-3 py-1 rounded-lg shadow-xs border border-[#ffeeba] flex items-center gap-1.5 text-center max-w-[92%] leading-normal">
              <ShieldCheck size={13} className="shrink-0 text-[#25D366]" />
              <span>
                {activeProvider === 'groq' 
                  ? '⚡ Powered by Groq Ultra-Fast AI (openai/gpt-oss-120b) • Instant Live Concierge'
                  : activeProvider === 'gemini'
                  ? '✨ Powered by Google Gemini 2.5 Flash • Context-Aware Live Co-Planner'
                  : '🧭 Running on TravelFlow Local Expert Engine'}
              </span>
            </div>
          </div>

          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const hasAction = msg.action && msg.action.type === 'ADD_ACTIVITY' && msg.action.activity;
            const isAlreadyApplied = appliedActivities[msg.id];

            return (
              <div key={msg.id} className={`wa-bubble-row ${isUser ? 'wa-row-user' : 'wa-row-ai'}`}>
                <div className={`wa-bubble ${isUser ? 'wa-bubble-user' : 'wa-bubble-ai'}`}>
                  
                  {/* Clean Formatted Message Text */}
                  <FormattedMessageText text={msg.text} />

                  {/* Action Card: Add Recommended Activity */}
                  {hasAction && (
                    <div className="mt-2.5 p-3 rounded-xl bg-[#f0f8f5] border border-[#25D366]/40 shadow-xs">
                      <div className="flex items-center justify-between text-xs font-bold text-[#075E54]">
                        <span className="flex items-center gap-1">
                          <Sparkles size={12} className="text-[#25D366]" /> Recommended Experience
                        </span>
                        <span className="text-gray-900 font-extrabold text-sm">
                          ₹{msg.action.activity.cost || 850}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-gray-900 mt-1">
                        {msg.action.activity.title}
                      </div>

                      <div className="text-[11px] text-gray-600 mt-1 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-gray-500" /> {msg.action.activity.time || '04:30 PM – 06:30 PM'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={11} className="text-gray-500" /> {msg.action.activity.location || destName}
                        </span>
                      </div>

                      {msg.action.activity.notes && (
                        <p className="text-[11px] text-gray-600 italic mt-1 bg-white/60 p-1.5 rounded-md">
                          "{msg.action.activity.notes}"
                        </p>
                      )}

                      <button
                        type="button"
                        disabled={isAlreadyApplied}
                        onClick={() => handleApplyActionActivity(msg.action.activity, msg.id)}
                        className={`mt-2.5 w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                          isAlreadyApplied 
                            ? 'bg-[#25D366] text-white' 
                            : 'bg-[#075E54] hover:bg-[#064941] text-white cursor-pointer active:scale-98'
                        }`}
                      >
                        <Plus size={14} />
                        <span>{isAlreadyApplied ? '✓ Added to Active Itinerary' : 'Apply to Active Itinerary'}</span>
                      </button>
                    </div>
                  )}

                  {/* Suggest Stay Action */}
                  {msg.action && msg.action.type === 'SUGGEST_STAY' && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-[#faf3e5] border border-[#c4963d]/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#7a5814]">Compare Live Partner Rates</span>
                        <span className="text-[10px] text-gray-600">Zero booking fee</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {['Booking.com', 'Agoda', 'MakeMyTrip'].map(plat => (
                          <button
                            key={plat}
                            type="button"
                            onClick={() => onOpenRedirectModal && onOpenRedirectModal({
                              title: `${destName} Boutique Stays`,
                              type: 'Stay',
                              platform: plat,
                              price: Math.round(budget * 0.38 / 3),
                              destination: destName
                            })}
                            className="py-1 px-1.5 bg-white hover:bg-[#faf3e5] border border-[#c4963d]/30 rounded text-[10.5px] font-bold text-[#0b221d] flex items-center justify-center gap-0.5"
                          >
                            <span>{plat.split('.')[0]}</span>
                            <ExternalLink size={9} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamp & Status Meta */}
                  <div className="wa-bubble-meta">
                    <span className="wa-time">{msg.time}</span>
                    {isUser && <CheckCheck size={14} className="text-[#34B7F1]" />}
                  </div>

                </div>

                {/* Contextual Suggestion Chips */}
                {!isUser && msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="wa-suggestions-bar">
                    {msg.quickActions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        className="wa-sug-chip"
                        onClick={() => handleSendMessage(sug)}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="wa-bubble-row wa-row-ai">
              <div className="wa-bubble wa-bubble-ai wa-typing-bubble">
                <div className="wa-typing-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Bottom Input Console */}
        <div className="wa-input-console">
          <button 
            type="button" 
            className="wa-tool-btn text-gray-500 hover:text-gray-700"
            onClick={() => setInputMsg(prev => prev + ' 🌴')}
            title="Add tropical emoji"
          >
            <Smile size={19} />
          </button>

          <button 
            type="button" 
            className="wa-tool-btn text-gray-500 hover:text-gray-700"
            title="Quick analyze budget"
            onClick={() => handleSendMessage(`Analyze budget feasibility for ${destName}`)}
          >
            <Paperclip size={18} />
          </button>

          <input 
            type="text"
            className="wa-input-field"
            placeholder={isListening ? '🎙️ Listening to your voice query...' : 'Type travel question or request (e.g. Add sunset cruise)...'}
            value={inputMsg}
            onChange={e => setInputMsg(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />

          {/* Voice Microphone Query */}
          <button 
            type="button" 
            onClick={toggleSpeechRecognition}
            className={`wa-tool-btn ${isListening ? 'text-red-500 animate-pulse bg-red-50' : 'text-gray-500 hover:text-gray-700'}`}
            title={isListening ? 'Stop recording voice' : 'Speak your question'}
          >
            {isListening ? <MicOff size={19} /> : <Mic size={19} />}
          </button>

          {/* Send Button */}
          <button 
            type="button" 
            onClick={() => handleSendMessage()}
            className="wa-send-btn shadow-md active:scale-95"
            title="Send Message"
          >
            <Send size={16} />
          </button>
        </div>

      </div>

      <style>{`
        .wa-modal-shell {
          width: min(540px, 95vw);
          height: min(740px, 92vh);
          background: #efeae2;
          background-image: radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px);
          background-size: 16px 16px;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.45);
          position: relative;
        }

        .wa-header {
          background: #075E54;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .wa-context-bar {
          background: #e1ebe7;
          border-bottom: 1px solid #d1ded9;
          padding: 6px 14px;
        }

        .wa-body {
          flex: 1;
          overflow-y: auto;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .wa-bubble-row {
          display: flex;
          flex-direction: column;
          max-width: 88%;
        }

        .wa-row-user {
          align-self: flex-end;
          align-items: flex-end;
        }

        .wa-row-ai {
          align-self: flex-start;
          align-items: flex-start;
        }

        .wa-bubble {
          padding: 10px 14px 7px;
          border-radius: 12px;
          position: relative;
          font-size: 13px;
          line-height: 1.55;
          box-shadow: 0 1.5px 3px rgba(0,0,0,0.1);
        }

        .wa-bubble-ai {
          background: #ffffff;
          color: #111b21;
          border-top-left-radius: 3px;
        }

        .wa-bubble-user {
          background: #d9fdd3;
          color: #111b21;
          border-top-right-radius: 3px;
        }

        .wa-bubble-meta {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
          margin-top: 4px;
        }

        .wa-time {
          font-size: 10px;
          color: #667781;
        }

        .wa-suggestions-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 6px;
        }

        .wa-sug-chip {
          background: #ffffff;
          border: 1px solid #25D366;
          color: #075E54;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.06);
        }

        .wa-sug-chip:hover {
          background: #25D366;
          color: #ffffff;
        }

        .wa-typing-bubble {
          padding: 10px 14px;
        }

        .wa-typing-dots {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .wa-typing-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #8696a0;
          animation: waBounce 1.4s infinite ease-in-out both;
        }

        .wa-typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .wa-typing-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes waBounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        .wa-input-console {
          background: #f0f2f5;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-top: 1px solid #e2e8f0;
        }

        .wa-tool-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          border-radius: 50%;
          transition: background 0.15s;
        }

        .wa-input-field {
          flex: 1;
          background: #ffffff;
          border: 1px solid #d1d7db;
          border-radius: 20px;
          padding: 8.5px 16px;
          font-size: 13.5px;
          outline: none;
          color: #111b21;
        }

        .wa-input-field:focus {
          border-color: #25D366;
        }

        .wa-send-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #00a884;
          color: #ffffff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }

        .wa-send-btn:hover {
          background: #075E54;
          transform: scale(1.04);
        }
      `}</style>
    </div>
  );
}
