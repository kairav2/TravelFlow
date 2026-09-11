import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  Phone, 
  Video, 
  MoreVertical, 
  Play, 
  Pause, 
  CheckCheck, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft, 
  RotateCcw, 
  FastForward, 
  MapPin, 
  ArrowRight,
  CreditCard,
  Users,
  CheckCircle2,
  Lock,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Square,
  Sparkle,
  Radio,
  Clock,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WhatsAppOnboardingView({ onNavigate, onPreviewListing }) {
  const [stage, setStage] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(null); // 'bot' | 'user' | null
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecordingLive, setIsRecordingLive] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [activeSpeechLang, setActiveSpeechLang] = useState('hi-IN'); // 'hi-IN' | 'en-IN'
  const [isLiveCustomMode, setIsLiveCustomMode] = useState(false);
  
  // Custom business extracted from user's voice
  const [customBusiness, setCustomBusiness] = useState({
    name: 'Kutch Desert Hearth Homestay',
    location: 'Hodka, Near White Desert, Gujarat',
    coordinates: '23.5182° N, 69.5714° E',
    category: 'Homestay & Cultural Safari',
    price: 2400,
    rooms: '4 traditional bhunga cottages',
    food: 'Homemade Kathiyawadi Thali & Desert Sunset Safari',
    accessibility: 'Ground floor step-free access',
    upiVpa: 'ramesh.kutch@okhdfcbank',
    operatorName: 'Ramesh Bhai Patel',
    peerVouchers: ['Sanjay Bhai (Hodka Guide)', 'Prakash Ji (Desert Stay Owner)'],
    transcript: 'Namaste bhai! Hamara homestay Bhuj ke paas Hodka gaon mein hai. Hamare paas 4 traditional bhunga rooms hain family ke liye, homemade Kathiyawadi khana aur desert sunset safari bhi karate hain.'
  });

  const chatBottomRef = useRef(null);
  const recognitionRef = useRef(null);
  const recordingTimerRef = useRef(null);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [stage, isTyping, liveTranscript, isRecordingLive]);

  // Clean up timers & speech recognition on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { /* ignore */ }
      }
    };
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  // Web Speech API Voice synthesis helper
  const speakText = (text, audioKey, onEndCallback, lang = 'hi-IN') => {
    if (!('speechSynthesis' in window) || !audioEnabled) {
      setTimeout(() => onEndCallback && onEndCallback(), 3500);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(audioKey);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const matchVoice = voices.find(v => v.lang.includes(lang.slice(0, 2)) || v.lang.includes('IN'));
      if (matchVoice) utterance.voice = matchVoice;

      utterance.onend = () => {
        setIsPlayingAudio(null);
        if (onEndCallback) onEndCallback();
      };

      utterance.onerror = () => {
        setIsPlayingAudio(null);
        if (onEndCallback) onEndCallback();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPlayingAudio(null);
      setTimeout(() => onEndCallback && onEndCallback(), 3000);
    }
  };

  // Dynamic AI Parser to extract business information from user's spoken voice note
  const parseSpokenBusinessDetails = (rawText) => {
    const text = rawText.trim();
    if (!text) return customBusiness;

    const lower = text.toLowerCase();
    
    // Extract Location
    let loc = 'Local Tourism Zone, India';
    let coords = '28.6139° N, 77.2090° E';
    if (lower.includes('manali') || lower.includes('kullu') || lower.includes('himachal')) {
      loc = 'Old Manali, Himachal Pradesh';
      coords = '32.2432° N, 77.1892° E';
    } else if (lower.includes('kutch') || lower.includes('bhuj') || lower.includes('hodka') || lower.includes('gujarat')) {
      loc = 'Hodka Village, Near White Rann, Kutch, Gujarat';
      coords = '23.5182° N, 69.5714° E';
    } else if (lower.includes('rishikesh') || lower.includes('ganga') || lower.includes('uttarakhand')) {
      loc = 'Tapovan, Rishikesh, Uttarakhand';
      coords = '30.0869° N, 78.2676° E';
    } else if (lower.includes('jaipur') || lower.includes('rajasthan') || lower.includes('udaipur')) {
      loc = 'Amer Road Heritage Corridor, Jaipur, Rajasthan';
      coords = '26.9124° N, 75.7873° E';
    } else if (lower.includes('goa') || lower.includes('beach') || lower.includes('vagator')) {
      loc = 'Anjuna-Vagator Coast, North Goa';
      coords = '15.5840° N, 73.7440° E';
    } else if (lower.includes('varanasi') || lower.includes('kashi') || lower.includes('ghat')) {
      loc = 'Assi Ghat Lane, Varanasi, Uttar Pradesh';
      coords = '25.2820° N, 82.9980° E';
    } else if (lower.includes('coorg') || lower.includes('kerala') || lower.includes('munnar')) {
      loc = 'Munnar Tea Hills, Kerala';
      coords = '10.0889° N, 77.0595° E';
    }

    // Extract Business Name
    let name = 'Authentic Local Heritage Stay';
    if (lower.includes('dhaba') || lower.includes('hotel') || lower.includes('restaurant') || lower.includes('khana')) {
      name = 'Highway Desi Zaika Dhaba';
    } else if (lower.includes('guide') || lower.includes('trek') || lower.includes('tour') || lower.includes('safari')) {
      name = 'Himalayan Explorer & Eco Tours';
    } else if (lower.includes('homestay') || lower.includes('stay') || lower.includes('rooms') || lower.includes('cottage')) {
      name = loc.split(',')[0] + ' Heritage Retreat';
    } else if (text.length > 5) {
      // First 4 words capitalized
      const words = text.split(' ').slice(0, 4);
      name = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Experience';
    }

    // Extract Price
    let price = 2200;
    const priceMatch = text.match(/(\d{3,5})/);
    if (priceMatch && parseInt(priceMatch[1], 10) >= 400 && parseInt(priceMatch[1], 10) <= 25000) {
      price = parseInt(priceMatch[1], 10);
    } else if (lower.includes('dhaba') || lower.includes('guide')) {
      price = 850;
    }

    // Extract Rooms / Capacity
    let rooms = '3 comfortable guest rooms';
    const roomMatch = text.match(/(\d+)\s*(room|kamre|bhunga|cottage|bed)/i);
    if (roomMatch) {
      rooms = `${roomMatch[1]} traditional ${roomMatch[2]}s`;
    }

    // Extract Food / Specialties
    let food = 'Fresh farm-to-table regional thali & morning chai';
    if (lower.includes('safari') || lower.includes('desert')) {
      food = 'Sunset desert safari & Kathiyawadi cuisine';
    } else if (lower.includes('rafting') || lower.includes('river')) {
      food = 'Riverside campfire & local Himalayan organic food';
    } else if (lower.includes('dhaba')) {
      food = 'Pure Desi Ghee Tandoori Roti, Dal Makhani & Lassi';
    }

    const cleanOperator = 'Local Partner Host';
    const cleanUpi = 'partner.host@okhdfcbank';

    return {
      name,
      location: loc,
      coordinates: coords,
      category: lower.includes('dhaba') ? 'Roadside Culinary Dhaba' : lower.includes('guide') ? 'Verified Experiential Guide' : 'Authentic Grassroots Homestay',
      price,
      rooms,
      food,
      accessibility: 'Ground floor step-free access verified',
      upiVpa: cleanUpi,
      operatorName: cleanOperator,
      peerVouchers: ['Sanjay Bhai (Regional Tourism Guide)', 'Anita Devi (Local Community Host)'],
      transcript: text
    };
  };

  // Start Live Microphone Voice Recording
  const startLiveRecording = () => {
    window.speechSynthesis?.cancel();
    setIsPlayingAudio(null);
    setLiveTranscript('');
    setRecordingDuration(0);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please use Chrome/Edge or type/pick a sample!');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = activeSpeechLang;

      recognition.onstart = () => {
        setIsRecordingLive(true);
        recordingTimerRef.current = setInterval(() => {
          setRecordingDuration(prev => prev + 1);
        }, 1000);
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setLiveTranscript(currentTranscript);
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err);
      };

      recognition.onend = () => {
        setIsRecordingLive(false);
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setIsRecordingLive(false);
    }
  };

  // Stop Live Recording & Send to Bot
  const stopLiveRecordingAndSend = (overrideText = null) => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecordingLive(false);

    const textToProcess = overrideText || liveTranscript || 'Namaste! Hamara homestay Manali mein hai, 3 rooms hain aur homemade food milta hai ₹1800 mein.';
    
    const parsed = parseSpokenBusinessDetails(textToProcess);
    setCustomBusiness(parsed);
    setIsLiveCustomMode(true);

    // Execute full dynamic conversational onboarding flow with user's voice
    setStage(1); // User's voice note sent
    
    setTimeout(() => {
      setStage(2); // Live Photos
      setTimeout(() => {
        setStage(3); // Live GPS Location
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setStage(4); // UPI VPA Bank Match
            setTimeout(() => {
              setIsTyping(true);
              setTimeout(() => {
                setIsTyping(false);
                setStage(5); // Community Vouch
                setTimeout(() => {
                  setIsTyping(true);
                  setTimeout(() => {
                    setIsTyping(false);
                    setStage(6); // Q: Room Count & Accessibility
                    setTimeout(() => {
                      setStage(7); // A: Operator Reply
                      setTimeout(() => {
                        setIsTyping(true);
                        setTimeout(() => {
                          setIsTyping(false);
                          setStage(8); // Listing Generated with Verified Certificate!
                          triggerConfetti();
                        }, 1200);
                      }, 1000);
                    }, 1200);
                  }, 1200);
                }, 1200);
              }, 1200);
            }, 1200);
          }, 1200);
        }, 1200);
      }, 1000);
    }, 1200);
  };

  const handleStartDefaultDemo = () => {
    setIsLiveCustomMode(false);
    setCustomBusiness({
      name: 'Kutch Desert Hearth Homestay',
      location: 'Hodka, Near White Desert, Gujarat',
      coordinates: '23.5182° N, 69.5714° E',
      category: 'Homestay & Cultural Safari',
      price: 2400,
      rooms: '4 traditional bhunga cottages',
      food: 'Homemade Kathiyawadi Thali & Desert Sunset Safari',
      accessibility: 'Ground floor step-free access',
      upiVpa: 'ramesh.kutch@okhdfcbank',
      operatorName: 'Ramesh Bhai Patel',
      peerVouchers: ['Sanjay Bhai (Hodka Camel Safari Guide)', 'Prakash Ji (Desert Homestay Owner)'],
      transcript: 'Namaste bhai! Hamara homestay Bhuj ke paas Hodka gaon mein hai. Hamare paas chaar traditional bhunga rooms hain family ke liye, homemade Kathiyawadi khana aur desert sunset safari bhi karate hain.'
    });

    setStage(1);
    if (audioEnabled) {
      speakText(
        'Namaste bhai! Hamara homestay Bhuj ke paas Hodka gaon mein hai. Hamare paas chaar bhunga rooms hain aur ghar ka khana milta hai.',
        'user',
        () => setIsPlayingAudio(null),
        'hi-IN'
      );
    }

    setTimeout(() => {
      setStage(2);
      setTimeout(() => {
        setStage(3);
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setStage(4);
            setTimeout(() => {
              setIsTyping(true);
              setTimeout(() => {
                setIsTyping(false);
                setStage(5);
                setTimeout(() => {
                  setIsTyping(true);
                  setTimeout(() => {
                    setIsTyping(false);
                    setStage(6);
                    setTimeout(() => {
                      setStage(7);
                      setTimeout(() => {
                        setIsTyping(true);
                        setTimeout(() => {
                          setIsTyping(false);
                          setStage(8);
                          triggerConfetti();
                        }, 1200);
                      }, 1000);
                    }, 1200);
                  }, 1200);
                }, 1200);
              }, 1200);
            }, 1200);
          }, 1200);
        }, 1200);
      }, 1000);
    }, 1200);
  };

  const handleSkipToResult = () => {
    window.speechSynthesis?.cancel();
    setIsPlayingAudio(null);
    setIsTyping(false);
    setIsRecordingLive(false);
    setStage(8);
    triggerConfetti();
  };

  const handleReset = () => {
    window.speechSynthesis?.cancel();
    setIsPlayingAudio(null);
    setIsTyping(false);
    setIsRecordingLive(false);
    setLiveTranscript('');
    setStage(0);
  };

  return (
    <div className="onboarding-page-bg min-h-screen bg-[#ECE5DD] py-8 text-[#142421]">
      <div className="container max-w-4xl mx-auto px-4">
        
        {/* Navigation & Controls Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4 bg-white p-4 rounded-xl shadow-sm border border-[#D5DDD8]">
          <button 
            onClick={() => {
              window.speechSynthesis?.cancel();
              onNavigate('landing');
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#142421] hover:text-[#C85A32]"
          >
            <ArrowLeft size={16} />
            <span>Back to Travelflow</span>
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Audio Voice Toggle */}
            <button
              onClick={() => {
                const next = !audioEnabled;
                setAudioEnabled(next);
                if (!next) window.speechSynthesis?.cancel();
              }}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md border transition-all ${
                audioEnabled ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]' : 'bg-gray-100 text-gray-500 border-gray-300'
              }`}
              title="Toggle Audio Voice Narration"
            >
              {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span>{audioEnabled ? 'Audio Voice On' : 'Audio Muted'}</span>
            </button>

            {/* Language Selector for Live Speech */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-md border text-xs">
              <button
                onClick={() => setActiveSpeechLang('hi-IN')}
                className={`px-2 py-1 rounded font-bold transition-all ${
                  activeSpeechLang === 'hi-IN' ? 'bg-[#075E54] text-white shadow-xs' : 'text-gray-600'
                }`}
              >
                Hindi (हिन्दी)
              </button>
              <button
                onClick={() => setActiveSpeechLang('en-IN')}
                className={`px-2 py-1 rounded font-bold transition-all ${
                  activeSpeechLang === 'en-IN' ? 'bg-[#075E54] text-white shadow-xs' : 'text-gray-600'
                }`}
              >
                English (IND)
              </button>
            </div>

            {stage === 0 ? (
              <button 
                onClick={handleStartDefaultDemo}
                className="inline-flex items-center gap-1.5 bg-[#075E54] text-white text-xs font-bold px-3.5 py-1.5 rounded-md hover:bg-[#054c44] shadow-sm"
              >
                <Play size={13} fill="currentColor" /> Play Auto Demo
              </button>
            ) : (
              <button 
                onClick={handleReset}
                className="inline-flex items-center gap-1 bg-[#EAEAEA] text-[#142421] text-xs font-bold px-3 py-1.5 rounded-md hover:bg-[#D5DDD8]"
              >
                <RotateCcw size={13} /> Reset
              </button>
            )}
            
            <button 
              onClick={handleSkipToResult}
              className="inline-flex items-center gap-1 bg-[#FAF0E6] text-[#C85A32] border border-[#C85A32]/30 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-[#FBE4D2]"
            >
              <FastForward size={13} /> Skip to Result
            </button>
          </div>
        </div>

        {/* Live Mic Voice Interaction Callout Banner */}
        <div className="mb-6 bg-gradient-to-r from-[#075E54] via-[#128C7E] to-[#0A4B42] text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-[#25D366]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-inner flex-shrink-0 transition-all ${
              isRecordingLive ? 'bg-red-500 text-white animate-bounce ring-4 ring-red-400/50' : 'bg-[#25D366] text-[#075E54]'
            }`}>
              <Mic size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-extrabold text-sm sm:text-base text-[#FAF6F0]">
                  🎙️ Speak directly about your business into the AI Bot!
                </h4>
                <span className="bg-[#25D366] text-[#075E54] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Voice Input
                </span>
              </div>
              <p className="text-xs text-[#DCFCE7] mt-0.5 leading-relaxed">
                Tap <strong>"Record My Business Note"</strong> below or use the mic icon in WhatsApp to speak in Hindi/English. The Multimodal AI will extract your stay/dhaba details and generate your verified certificate live!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {!isRecordingLive ? (
              <button
                onClick={startLiveRecording}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-[#075E54] font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
              >
                <Mic size={16} />
                <span>Record My Voice Note</span>
              </button>
            ) : (
              <button
                onClick={() => stopLiveRecordingAndSend()}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all animate-pulse"
              >
                <Square size={14} fill="currentColor" />
                <span>Stop & Send Voice Note ({recordingDuration}s)</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Sample Voice Prompts (One-click presets if mic not available) */}
        <div className="mb-4 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-[#D5DDD8] text-xs flex flex-wrap items-center gap-2">
          <span className="font-bold text-[#075E54] flex items-center gap-1">
            <Sparkle size={13} className="text-[#C85A32]" /> Quick Voice Presets:
          </span>
          <button
            onClick={() => stopLiveRecordingAndSend("Namaste! Hamara Manali Old Town mein 3 rooms ka wooden homestay hai, ₹2200 per night, fresh pahadi rajma chawal aur river view ke sath.")}
            className="bg-[#FAF0E6] hover:bg-[#FBE4D2] text-[#C85A32] px-2.5 py-1 rounded-md font-semibold border border-[#C85A32]/20 transition-all text-[11px]"
          >
            🏔️ Manali Wooden Homestay (₹2,200)
          </button>
          <button
            onClick={() => stopLiveRecordingAndSend("Namaste! Hum Jaipur highway par desi ghee ka pure veg family dhaba chalate hain, 24 ghante khula rehta hai, Dal Baati Churma special.")}
            className="bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] px-2.5 py-1 rounded-md font-semibold border border-[#2E7D32]/20 transition-all text-[11px]"
          >
            🍛 Jaipur Highway Dhaba (₹850)
          </button>
          <button
            onClick={() => stopLiveRecordingAndSend("Hello! Main Rishikesh mein certified white water river rafting aur camp guide hoon, 8 saal ka experience hai, ₹1400 per person.")}
            className="bg-[#E1F5FE] hover:bg-[#B3E5FC] text-[#0277BD] px-2.5 py-1 rounded-md font-semibold border border-[#0277BD]/20 transition-all text-[11px]"
          >
            🛶 Rishikesh Rafting Guide (₹1,400)
          </button>
        </div>

        {/* WhatsApp Phone Mockup Container */}
        <div className="max-w-md mx-auto bg-[#efeae2] rounded-3xl shadow-2xl overflow-hidden border-8 border-[#1F2937]/30 flex flex-col h-[740px] relative">
          
          {/* WhatsApp Header */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#128C7E] flex items-center justify-center font-bold text-sm text-white shadow-inner">
                  TF
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-[#075E54]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm">Travelflow AI Assistant</span>
                  <ShieldCheck size={14} className="text-[#25D366]" />
                </div>
                <span className="text-[11px] text-[#A7D7C5]">
                  {isRecordingLive ? '🎙️ listening to your audio...' : isTyping ? 'typing...' : 'online • multimodal voice verification'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white/80">
              <Phone size={18} />
              <Video size={18} />
              <MoreVertical size={18} />
            </div>
          </div>

          {/* Live Recording Live Waveform Overlay when recording */}
          {isRecordingLive && (
            <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between shadow-lg z-20 animate-in slide-in-from-top duration-200">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-white animate-ping"></span>
                <span className="font-black text-xs uppercase tracking-wider">
                  Listening ({recordingDuration}s)...
                </span>
              </div>
              <p className="text-[11px] italic font-medium max-w-[200px] truncate text-red-100">
                {liveTranscript || 'Speak now: name, rooms, price, city...'}
              </p>
              <button
                onClick={() => stopLiveRecordingAndSend()}
                className="bg-white text-red-600 px-2.5 py-1 rounded text-[11px] font-black hover:bg-gray-100"
              >
                Done
              </button>
            </div>
          )}

          {/* WhatsApp Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[radial-gradient(#d1d7db_1px,transparent_1px)] [background-size:16px_16px]">
            
            {/* Timestamp */}
            <div className="text-center">
              <span className="bg-[#FFFFFF]/90 text-[#667781] text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-xs">
                TODAY • 10:42 AM
              </span>
            </div>

            {/* Initial Welcome AI message with Playable Audio Instruction */}
            <div className="flex justify-start">
              <div className="bg-white text-[#111B21] rounded-lg rounded-tl-none p-3 max-w-[88%] shadow-sm text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-[#075E54]">Travelflow Verification Bot</p>
                  <span className="bg-[#E8F5E9] text-[#2E7D32] text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                    Audio Guide
                  </span>
                </div>

                {/* Playable Voice Instruction Bubble */}
                <div className="bg-[#F0FDF4] border border-[#DCFCE7] p-2 rounded-lg flex items-center gap-2.5">
                  <button 
                    onClick={() => {
                      if (isPlayingAudio === 'bot') {
                        window.speechSynthesis?.cancel();
                        setIsPlayingAudio(null);
                      } else {
                        speakText(
                          'Namaste! Travelflow mein aapka swagat hai. Apna homestay ya dhaba list karne ke liye bas niche diye mic button se ek voice note bhej dijiye, jisme aapka naam, location aur rooms ki jankari ho.',
                          'bot',
                          () => setIsPlayingAudio(null),
                          'hi-IN'
                        );
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-[#075E54] text-white flex items-center justify-center flex-shrink-0 shadow-sm hover:bg-[#054C44] transition-transform active:scale-95"
                    title="Listen to Bot Voice Instructions"
                  >
                    {isPlayingAudio === 'bot' ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 h-4">
                      {[10, 16, 12, 20, 14, 18, 10, 15, 22, 12].map((h, i) => (
                        <span 
                          key={i} 
                          className={`w-1 bg-[#25D366] rounded-full ${isPlayingAudio === 'bot' ? 'animate-pulse' : ''}`}
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#2E7D32] font-semibold block mt-0.5">
                      {isPlayingAudio === 'bot' ? 'Playing Hindi Audio Instructions…' : 'Tap to hear Audio Instructions (0:12)'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#3B4A54] leading-relaxed">
                  Namaste! 🙏 Please send your <strong>Voice Note</strong> describing your business, <strong>2–3 Live Photos</strong>, and your <strong>WhatsApp Live Location Pin</strong>.
                </p>
                <span className="text-[9px] text-[#667781] float-right">10:42 AM</span>
              </div>
            </div>

            {/* Step 1: Voice note from Operator (Interactive Playable Audio) */}
            {stage >= 1 && (
              <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-[#D9FDD3] text-[#111B21] rounded-lg rounded-tr-none p-3 max-w-[90%] shadow-sm text-xs space-y-2">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        if (isPlayingAudio === 'user') {
                          window.speechSynthesis?.cancel();
                          setIsPlayingAudio(null);
                        } else {
                          speakText(
                            customBusiness.transcript,
                            'user',
                            () => setIsPlayingAudio(null),
                            activeSpeechLang
                          );
                        }
                      }}
                      className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 shadow-sm hover:bg-[#1EBE5D] transition-transform active:scale-95"
                      title="Play Your Spoken Voice Note"
                    >
                      {isPlayingAudio === 'user' ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 h-5">
                        {[12, 20, 16, 26, 14, 22, 10, 18, 24, 14, 19, 11].map((h, i) => (
                          <span 
                            key={i} 
                            className={`w-1 bg-[#54656F] rounded-full ${isPlayingAudio === 'user' ? 'animate-pulse' : ''}`}
                            style={{ height: `${h}px` }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-[10px] text-[#667781] mt-0.5 font-semibold">
                        <span>{isPlayingAudio === 'user' ? 'Playing Audio…' : '0:28'}</span>
                        <span className="text-[#075E54] font-bold">
                          {isLiveCustomMode ? '🎙️ Your Live Voice Note' : '🎙️ Hindi Voice Note'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Spoken Transcript Bubble */}
                  <div className="bg-black/5 p-2 rounded text-[10.5px] text-[#3B4A54] leading-relaxed">
                    <div className="font-bold text-[#075E54] text-[9.5px] mb-0.5 uppercase tracking-wide">
                      Transcribed Audio:
                    </div>
                    “{customBusiness.transcript}”
                  </div>
                  
                  <div className="flex justify-end items-center gap-1 text-[9px] text-[#667781]">
                    <span>10:43 AM</span>
                    <CheckCheck size={12} className="text-[#53BDEB]" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Photos from Operator */}
            {stage >= 2 && (
              <div className="flex justify-end animate-in fade-in duration-300">
                <div className="bg-[#D9FDD3] rounded-lg rounded-tr-none p-1.5 max-w-[88%] shadow-sm">
                  <div className="grid grid-cols-2 gap-1 mb-1">
                    <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=300&q=80" alt="Stay" className="rounded h-24 w-full object-cover" />
                    <img src="https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=300&q=80" alt="Food" className="rounded h-24 w-full object-cover" />
                  </div>
                  <div className="flex justify-end items-center gap-1 text-[9px] text-[#667781] px-1">
                    <span>10:43 AM</span>
                    <CheckCheck size={12} className="text-[#53BDEB]" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Layer 1 - Live Location Pin Drop */}
            {stage >= 3 && (
              <div className="flex justify-end animate-in fade-in duration-300">
                <div className="bg-[#D9FDD3] rounded-lg rounded-tr-none p-2.5 max-w-[88%] shadow-sm text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-[#075E54]">
                    <MapPin size={16} className="text-[#C85A32]" />
                    <span>📍 Shared Live Location (GPS Validated)</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-[#075E54]/20 text-[11px] space-y-0.5">
                    <div><strong>Coordinates:</strong> {customBusiness.coordinates}</div>
                    <div className="text-[#667781]">{customBusiness.location}</div>
                  </div>
                  <div className="flex justify-end items-center gap-1 text-[9px] text-[#667781]">
                    <span>10:43 AM</span>
                    <CheckCheck size={12} className="text-[#53BDEB]" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Layer 2 - UPI Bank Match */}
            {stage >= 4 && (
              <div className="flex justify-start animate-in zoom-in-95 duration-300">
                <div className="bg-white border-l-4 border-[#25D366] text-[#111B21] rounded-lg rounded-tl-none p-3 max-w-[92%] shadow-sm text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#075E54] font-bold text-[11px]">
                    <CreditCard size={14} className="text-[#25D366]" />
                    <span>Layer 2: UPI Financial Identity Match</span>
                  </div>
                  <div className="bg-[#EBF5EE] p-2 rounded text-[11px] space-y-0.5">
                    <div><strong>UPI VPA:</strong> {customBusiness.upiVpa}</div>
                    <div className="text-[#2D5A43] font-bold">✓ NPCI Verified: {customBusiness.operatorName}</div>
                  </div>
                  <span className="text-[9px] text-[#667781] float-right">10:44 AM</span>
                </div>
              </div>
            )}

            {/* Step 5: Layer 3 - Community Peer Vouching */}
            {stage >= 5 && (
              <div className="flex justify-start animate-in zoom-in-95 duration-300">
                <div className="bg-white border-l-4 border-[#C4963D] text-[#111B21] rounded-lg rounded-tl-none p-3 max-w-[92%] shadow-sm text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#C4963D] font-bold text-[11px]">
                    <Users size={14} />
                    <span>Layer 3: Community Peer Vouching</span>
                  </div>
                  <div className="bg-[#FAF2E3] p-2 rounded text-[11px] space-y-0.5 text-[#6B4F1D]">
                    {customBusiness.peerVouchers.map((voucher, idx) => (
                      <div key={idx}>✓ Vouched by <strong>{voucher}</strong></div>
                    ))}
                  </div>
                  <span className="text-[9px] text-[#667781] float-right">10:44 AM</span>
                </div>
              </div>
            )}

            {/* Step 6: Clarifying Q */}
            {stage >= 6 && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-white text-[#111B21] rounded-lg rounded-tl-none p-2.5 max-w-[88%] shadow-sm text-xs">
                  <p>How many total rooms do you have, and is there step-free access from entrance?</p>
                  <span className="text-[9px] text-[#667781] float-right">10:45 AM</span>
                </div>
              </div>
            )}

            {/* Step 7: Operator Reply */}
            {stage >= 7 && (
              <div className="flex justify-end animate-in fade-in duration-300">
                <div className="bg-[#D9FDD3] text-[#111B21] rounded-lg rounded-tr-none p-2.5 max-w-[88%] shadow-sm text-xs">
                  <p>{customBusiness.rooms}, sabhi ground floor par hain bina kisi seedhi ke.</p>
                  <div className="flex justify-end items-center gap-1 text-[9px] text-[#667781] mt-0.5">
                    <span>10:45 AM</span>
                    <CheckCheck size={12} className="text-[#53BDEB]" />
                  </div>
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg p-2.5 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#667781] rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#667781] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#667781] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            {/* Step 8: Listing Generated & 5-Point Certificate with Spoken Data */}
            {stage >= 8 && (
              <div className="space-y-3 animate-in zoom-in-95 duration-400">
                <div className="flex justify-start">
                  <div className="bg-[#E7FCE8] border border-[#25D366] text-[#075E54] rounded-lg p-3 max-w-[95%] shadow-md text-xs">
                    <p className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                      <Sparkles size={16} /> 5-Point Authentication Complete! 🎉
                    </p>
                    <p className="text-[11px] text-[#142421]">
                      Your listing has been extracted from your voice audio and verified across GPS Location, Bank Identity, Peer Vouching & Accessibility.
                    </p>
                  </div>
                </div>

                {/* Generated Listing Preview inside WhatsApp */}
                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-[#D5DDD8] max-w-[95%]">
                  <img 
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80" 
                    alt="Live Listing" 
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-xs text-[#0E1F1B] leading-tight">
                        {customBusiness.name}
                      </h4>
                      <span className="text-xs font-black text-[#C85A32] whitespace-nowrap ml-2">
                        ₹{customBusiness.price.toLocaleString('en-IN')}/nt
                      </span>
                    </div>
                    <p className="text-[10px] text-[#627772] flex items-center gap-1 mb-2">
                      <MapPin size={10} /> {customBusiness.location}
                    </p>

                    {/* Extracted Details Box */}
                    <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E5DED2] mb-3 space-y-1.5 text-[9.5px]">
                      <div className="flex items-center gap-1.5 text-[#2D5A43] font-bold">
                        <CheckCircle2 size={11} className="flex-shrink-0" /> 
                        <span>📍 GPS: {customBusiness.coordinates}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#2D5A43] font-bold">
                        <CheckCircle2 size={11} className="flex-shrink-0" /> 
                        <span>💳 Bank Match: {customBusiness.operatorName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#2D5A43] font-bold">
                        <CheckCircle2 size={11} className="flex-shrink-0" /> 
                        <span>🏠 Rooms: {customBusiness.rooms}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#2D5A43] font-bold">
                        <CheckCircle2 size={11} className="flex-shrink-0" /> 
                        <span>🍲 Cuisine: {customBusiness.food}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#2D5A43] font-bold">
                        <Lock size={11} className="flex-shrink-0" /> 
                        <span>🛡️ Escrow Payout Protection Active</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => onPreviewListing && onPreviewListing()}
                      className="w-full bg-[#075E54] hover:bg-[#054c44] text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
                    >
                      <span>Preview Live on Marketplace</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* WhatsApp Bottom Input Bar with Interactive Live Mic Button */}
          <div className="bg-[#F0F2F5] px-3 py-2.5 flex items-center gap-2 border-t border-[#D5DDD8] z-10">
            <button className="text-[#54656F] p-1.5 hover:text-[#111B21] transition-colors" title="Attach Document">
              <Paperclip size={18} />
            </button>
            
            <div className="flex-1 bg-white px-3 py-1.5 rounded-full text-xs text-[#8696A0] border border-[#E9EDEF] flex items-center justify-between">
              <span className="truncate">
                {isRecordingLive 
                  ? `Recording (${recordingDuration}s)... speak now`
                  : liveTranscript 
                  ? liveTranscript 
                  : 'Type or tap microphone to speak...'}
              </span>
              {isRecordingLive && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              )}
            </div>

            {/* Interactive Microphone Button */}
            {!isRecordingLive ? (
              <button 
                onClick={startLiveRecording}
                className="w-9 h-9 rounded-full bg-[#075E54] hover:bg-[#128C7E] text-white flex items-center justify-center shadow-md active:scale-90 transition-all"
                title="Tap to Speak Your Business Note"
              >
                <Mic size={16} />
              </button>
            ) : (
              <button 
                onClick={() => stopLiveRecordingAndSend()}
                className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md animate-pulse active:scale-90 transition-all"
                title="Stop Recording and Send"
              >
                <Send size={15} />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

