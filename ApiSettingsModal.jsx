import React, { useState } from 'react';
import { X, Sparkles, Database, Check, Key, ExternalLink, Zap, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { 
  getGeminiKey, 
  setCustomGeminiKey, 
  isGeminiConfigured,
  getGroqKey,
  getGroqModel,
  setCustomGroqKey,
  isGroqConfigured
} from '../services/aiService';
import { 
  isSupabaseConfigured, 
  getSupabaseUrl, 
  getSupabaseAnonKey, 
  setCustomSupabaseCredentials,
  testSupabaseConnection 
} from '../services/supabaseClient';

export default function ApiSettingsModal({ isOpen, onClose }) {
  const [groqKey, setGroqKey] = useState(getGroqKey());
  const [groqModel, setGroqModel] = useState(getGroqModel());
  const [geminiKey, setGeminiKey] = useState(getGeminiKey());
  const [supabaseUrl, setSupabaseUrl] = useState(getSupabaseUrl());
  const [supabaseKey, setSupabaseKey] = useState(getSupabaseAnonKey());
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // { type: 'groq'|'supabase', ok: boolean, message: string, needsSchema?: boolean }
  const [testingGroq, setTestingGroq] = useState(false);
  const [testingSupabase, setTestingSupabase] = useState(false);

  if (!isOpen) return null;

  const handleTestGroq = async () => {
    if (!groqKey) {
      setTestStatus({ type: 'groq', ok: false, message: 'Please enter a Groq API key first.' });
      return;
    }
    setTestingGroq(true);
    setTestStatus(null);
    try {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${groqKey.trim()}` }
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setTestStatus({ 
          type: 'groq', 
          ok: true, 
          message: `✓ Groq Connected! Verified with model: ${groqModel}` 
        });
      } else {
        setTestStatus({ 
          type: 'groq', 
          ok: false, 
          message: `Groq error: ${data.error?.message || 'Invalid API key'}` 
        });
      }
    } catch (err) {
      setTestStatus({ type: 'groq', ok: false, message: `Connection failed: ${err.message}` });
    } finally {
      setTestingGroq(false);
    }
  };

  const handleTestSupabase = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setTestStatus({ 
        type: 'supabase', 
        ok: false, 
        message: 'Please enter both Supabase URL and Anon Key first.' 
      });
      return;
    }
    setTestingSupabase(true);
    setTestStatus(null);
    try {
      const result = await testSupabaseConnection(supabaseUrl, supabaseKey);
      setTestStatus({
        type: 'supabase',
        ok: result.ok,
        needsSchema: result.needsSchema,
        message: result.message
      });
    } catch (err) {
      setTestStatus({
        type: 'supabase',
        ok: false,
        message: `Supabase test error: ${err.message}`
      });
    } finally {
      setTestingSupabase(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setCustomGroqKey(groqKey, groqModel);
    setCustomGeminiKey(geminiKey);
    setCustomSupabaseCredentials(supabaseUrl, supabaseKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const hasGroq = isGroqConfigured();
  const hasGemini = isGeminiConfigured();
  const hasSupabase = isSupabaseConfigured();

  return (
    <div className="overlay animate-fade-in" onClick={onClose} style={{ zIndex: 1300 }}>
      <div 
        className="api-settings-modal card-luxury max-w-xl w-full max-h-[90vh] flex flex-col p-6 overflow-hidden shadow-2xl rounded-2xl bg-white" 
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#e0e7e4]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0b221d] text-[#c4963d] flex items-center justify-center font-bold shadow-sm">
              <Key size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0b221d]">API & Cloud Service Integrations</h3>
              <p className="text-xs text-[#6f807c]">Configure Groq, Google Gemini, and Supabase Database</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Status Badges */}
        <div className="grid grid-cols-3 gap-2.5 mt-4">
          <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${hasGroq ? 'bg-amber-50/80 border-amber-200 text-amber-900' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold flex items-center gap-1">
                <Zap size={13} className={hasGroq ? 'text-amber-600' : 'text-gray-400'} /> Groq AI
              </span>
              <span className={`w-2 h-2 rounded-full ${hasGroq ? 'bg-emerald-500' : 'bg-gray-300'}`} />
            </div>
            <div className="text-[10px] font-medium leading-tight">
              {hasGroq ? '⚡ Ultra-Fast Active' : 'Not configured'}
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${hasGemini ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold flex items-center gap-1">
                <Sparkles size={13} className={hasGemini ? 'text-emerald-600' : 'text-gray-400'} /> Gemini AI
              </span>
              <span className={`w-2 h-2 rounded-full ${hasGemini ? 'bg-emerald-500' : 'bg-gray-300'}`} />
            </div>
            <div className="text-[10px] font-medium leading-tight">
              {hasGemini ? '✨ 2.5 Flash Active' : 'Not configured'}
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${hasSupabase ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-blue-50/80 border-blue-200 text-blue-900'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold flex items-center gap-1">
                <Database size={13} className={hasSupabase ? 'text-emerald-600' : 'text-blue-600'} /> Supabase
              </span>
              <span className={`w-2 h-2 rounded-full ${hasSupabase ? 'bg-emerald-500' : 'bg-blue-400'}`} />
            </div>
            <div className="text-[10px] font-medium leading-tight">
              {hasSupabase ? 'Cloud Postgres' : 'In-Browser Store'}
            </div>
          </div>
        </div>

        {/* Test Status Banner */}
        {testStatus && (
          <div className={`mt-3 p-3 rounded-xl text-xs flex flex-col gap-1.5 border ${testStatus.ok ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
            <div className="flex items-center gap-2">
              {testStatus.ok ? <Check size={14} className="shrink-0 text-emerald-600" /> : <AlertCircle size={14} className="shrink-0 text-red-600" />}
              <span className="font-semibold">{testStatus.message}</span>
            </div>
            {testStatus.needsSchema && (
              <div className="text-[11px] text-emerald-700 bg-white/70 p-2 rounded-lg mt-1 border border-emerald-300 flex items-center justify-between">
                <span>SQL Schema file is ready in your project root: <strong>supabase_schema.sql</strong></span>
                <span className="text-[10.5px] font-bold bg-emerald-100 px-2 py-0.5 rounded">Ready</span>
              </div>
            )}
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="mt-4 overflow-y-auto pr-1 space-y-4 flex-1">
          
          {/* SECTION 1: GROQ CONFIGURATION */}
          <div className="p-3.5 rounded-xl border border-amber-200/80 bg-[#fffdfa]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold text-[#0b221d] flex items-center gap-1.5 uppercase tracking-wide">
                <Zap size={14} className="text-amber-500 fill-amber-500" /> Groq API (Ultra-Fast Concierge)
              </label>
              <a 
                href="https://console.groq.com/keys" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold hover:underline flex items-center gap-0.5"
              >
                Get Free Groq Key <ExternalLink size={10} />
              </a>
            </div>

            <div className="space-y-2.5">
              <div>
                <input 
                  type="password"
                  placeholder="gsk_..."
                  value={groqKey}
                  onChange={e => setGroqKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#e0e7e4] focus:border-amber-500 outline-none font-mono bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 items-center">
                <div className="col-span-2">
                  <label className="text-[10.5px] font-bold text-gray-600 block mb-0.5">Model ID</label>
                  <input 
                    type="text"
                    placeholder="openai/gpt-oss-120b"
                    value={groqModel}
                    onChange={e => setGroqModel(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#e0e7e4] font-mono bg-white"
                  />
                </div>
                <div className="col-span-1 pt-3">
                  <button
                    type="button"
                    onClick={handleTestGroq}
                    disabled={testingGroq}
                    className="w-full py-1.5 px-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    {testingGroq ? <RefreshCw size={12} className="animate-spin" /> : <Zap size={12} />}
                    <span>Test Groq</span>
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[10.5px] text-gray-500 mt-2">
              Groq delivers near-instantaneous live chat responses and structured travel action blocks with zero latency.
            </p>
          </div>

          {/* SECTION 2: SUPABASE CONFIGURATION */}
          <div className="p-3.5 rounded-xl border border-blue-200/80 bg-[#fafdff]">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-extrabold text-[#0b221d] uppercase flex items-center gap-1.5 tracking-wide">
                <Database size={14} className="text-blue-600" /> Supabase Cloud Database (PostgreSQL)
              </label>
              <a 
                href="https://supabase.com/dashboard" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] text-blue-700 hover:underline flex items-center gap-0.5"
              >
                Supabase Dashboard <ExternalLink size={10} />
              </a>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[10.5px] font-bold text-gray-600 block mb-0.5">Project URL</label>
                <input 
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={e => setSupabaseUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#e0e7e4] outline-none font-mono bg-white"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-gray-600 block mb-0.5">Anon Public Key</label>
                <input 
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={supabaseKey}
                  onChange={e => setSupabaseKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#e0e7e4] outline-none font-mono bg-white"
                />
              </div>

              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestSupabase}
                  disabled={testingSupabase}
                  className="py-1.5 px-3 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  {testingSupabase ? <RefreshCw size={12} className="animate-spin" /> : <Database size={12} />}
                  <span>Test Supabase Connection</span>
                </button>
              </div>
            </div>

            <p className="text-[10.5px] text-gray-500 mt-2">
              Syncs generated trips, guest bookings, and host inquiries into PostgreSQL cloud tables. If left blank, local in-browser persistence is automatically used.
            </p>
          </div>

          {/* SECTION 3: GEMINI KEY */}
          <div className="p-3.5 rounded-xl border border-emerald-200/80 bg-[#fbfdfc]">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-extrabold text-[#0b221d] flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles size={14} className="text-emerald-600" /> Google Gemini API (Fallback / Secondary)
              </label>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-0.5"
              >
                Get Free Gemini Key <ExternalLink size={10} />
              </a>
            </div>
            <input 
              type="password"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={e => setGeminiKey(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#e0e7e4] focus:border-emerald-600 outline-none font-mono bg-white"
            />
            <p className="text-[10.5px] text-gray-500 mt-1.5">
              Optional fallback for multi-day schedule synthesis.
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e0e7e4]">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn-gold px-5 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md"
            >
              {saved ? (
                <>
                  <Check size={14} />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Credentials</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
