import React, { useState, useEffect, useRef, useContext } from 'react';
import { MessageSquare, X, Send, Trash2, CheckSquare, RotateCcw, AlertTriangle, Bot, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';

// ── Local fallback NLP (used if Gemini server is offline) ────────────────────
function localFallback(input, cars) {
  const lower = input.toLowerCase();
  const words = lower.replace(/[^\w\s]/gi, '').split(/\s+/);
  if (/^(hi|hello|hey|greetings)\b/.test(lower)) return `Hello! 👋 Welcome to **Aetherion Motors**. I'm your AI Concierge. Ask me about cars, brands, store, features, account, or showroom locations!`;
  if (/thank|bye|goodbye/.test(lower)) return `Thank you! It was a pleasure assisting you at Aetherion Motors. Feel free to return anytime! 🏎️`;
  if (/supercar|hypercar|bugatti|lamborghini|ferrari|mclaren|pagani|koenigsegg/.test(lower)) return `🏎️ We carry world-class supercars: Bugatti Chiron, Lamborghini Aventador, Ferrari SF90, McLaren Speedtail, Pagani Huayra, Koenigsegg Jesko. Browse at **/collections**.`;
  if (/electric|ev|tesla|rimac|taycan/.test(lower)) return `⚡ Our EV collection includes Tesla Model S Plaid, Rimac Nevera, Porsche Taycan, BMW iX, Audi e-tron GT, NIO ET9. Try the **EV Hub** at /ev-hub.`;
  if (/wheel|rim|tire|store|shop/.test(lower)) return `🔧 Our Store (/store) has 100+ wheels from BBS, HRE, Vossen, Enkei, Rotiform and more. Prices: $250–$14,200.`;
  if (/brand|manufacturer/.test(lower)) return `We carry **65+ brands** from Germany (BMW, Porsche), Japan (Toyota, Lexus), UK (Rolls-Royce, Bentley), Italy (Ferrari, Lamborghini), USA (Tesla, Ford) and more. See all at **/brands**.`;
  if (/locat|showroom|address|where/.test(lower)) return `🌍 Flagship showrooms: Beverly Hills (CA), Munich (Germany), Tokyo (Japan), London (UK). Book via **/meeting**.`;
  if (/login|sign in|account|register/.test(lower)) return `🔐 Login or register at **/login** using email+password or Google One-Click. Gives access to wishlist, bookings, and more.`;
  if (/password|forgot|reset|otp/.test(lower)) return `🔑 Click "Forgot password?" on /login → enter your email → receive a 6-digit OTP in your Gmail → enter code → reset password.`;
  if (/3d|configurator|view|rotate/.test(lower)) return `🎨 The **3D Configurator** (/configurator) lets you rotate any car 360°, open doors, and change paint colors. No login needed!`;
  if (/ev hub|charging|battery range/.test(lower)) return `⚡ **EV Hub** (/ev-hub): Input your electricity rate + daily km to calculate real charging costs and battery range for any EV.`;
  if (/compar/.test(lower)) return `📊 **Compare Tool** (/compare): Select up to 4 vehicles and compare HP, speed, 0-60, and price side by side.`;
  if (/wishlist|heart|save car|favourite/.test(lower)) return `❤️ Click the heart icon on any car to save it to your wishlist (login required). Access via the heart in the navbar.`;
  if (/test drive|meeting|book|schedule|appointment/.test(lower)) return `📅 Book a VIP test drive or consultation at **/meeting**. We have showrooms in Beverly Hills, Munich, Tokyo, and London.`;
  if (/contact|email|reach/.test(lower)) return `📬 Contact: **vmohammedhashim@gmail.com** or use this live chat. Book at **/meeting** for a formal consultation.`;
  if (/trade|sell|buy|valuation/.test(lower)) return `💼 **Trade Center** (/trade): Get an AI-powered valuation for your vehicle, sell, trade-in, or initiate acquisition of any car in our vault.`;
  if (/admin|dashboard/.test(lower)) return `🔒 Admin panel at **/admin** — restricted to admin credentials. Manages inventory, users, orders, brands, and store.`;
  if (cars && cars.length > 0) {
    let best = null, top = 0;
    cars.forEach(c => {
      let s = 0;
      if (lower.includes(c.brand.toLowerCase())) s += 2;
      c.name.toLowerCase().split(' ').forEach(w => { if (w.length > 1 && words.includes(w)) s += 3; });
      if (lower.includes(c.name.toLowerCase())) s += 5;
      if (s > top && s >= 2) { top = s; best = c; }
    });
    if (best) {
      if (/price|cost|how much/.test(lower)) return `The **${best.brand} ${best.name}** is listed at **$${best.price?.toLocaleString()}**. Want to view it in 3D or schedule a test drive?`;
      if (/speed|mph|fast/.test(lower)) return `The **${best.brand} ${best.name}** hits **${best.specs?.topSpeed} MPH** and goes 0-60 in **${best.specs?.zeroToSixty}s**. 🏎️`;
      if (/hp|horsepower|power|engine/.test(lower)) return `The **${best.brand} ${best.name}** delivers **${best.specs?.horsepower} HP**. An engineering masterpiece.`;
      return `We have the **${best.brand} ${best.name}**! 🔑\n• **Price:** $${best.price?.toLocaleString()}\n• **HP:** ${best.specs?.horsepower}\n• **Top Speed:** ${best.specs?.topSpeed} MPH\n• **0-60:** ${best.specs?.zeroToSixty}s\n\nWant to view it in 3D or schedule a VIP test drive?`;
    }
  }
  return `I'm your Aetherion AI Concierge. Ask me about:\n• 🚗 Cars & brands\n• 🏪 Store & wheels\n• 🎨 3D Configurator\n• ⚡ EV Hub\n• 📅 Test drives & meetings\n• 🔐 Account & login\n• 📍 Showroom locations`;
}

function renderText(text) {
  return text.split('\n').map((line, i) => {
    const html = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <div key={i} className={line.trim() === '' ? 'h-1.5' : 'leading-relaxed'} dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }} />;
  });
}

const INITIAL_MSG = {
  id: 1,
  text: `👋 Welcome to **Aetherion Motors Sovereign Luxury**!\n\nI'm your Gemini-powered AI Concierge — I know everything about this website. Ask me anything:\n\n• 🚗 Cars, brands & specs\n• 🏪 Store products & wheels\n• 🎨 3D Configurator & EV Hub\n• 🔐 Login, account & wishlist\n• 📅 Booking test drives\n• 📍 Showroom locations\n\nHow can I assist you today?`,
  sender: 'agent'
};

const SUGGESTIONS = [
  'What supercars do you have?',
  'Tell me about the EV collection',
  'How to reset my password?',
  'Where are your showrooms?',
  'What wheels do you sell?',
  'How does the 3D Configurator work?',
  'Book a test drive',
  'What brands do you carry?',
];

export default function LiveChat() {
  const { cars } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MSG]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [usingGemini, setUsingGemini] = useState(true);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Delete/select state
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isOpen, isTyping]);
  useEffect(() => {
    if (!isOpen) { setSelectMode(false); setSelectedIds(new Set()); setShowClearConfirm(false); }
    else setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const handleClearAll = () => { setMessages([INITIAL_MSG]); setSelectedIds(new Set()); setSelectMode(false); setShowClearConfirm(false); };
  const handleDeleteOne = (id) => setMessages(prev => prev.filter(m => m.id !== id));
  const toggleSelectMode = () => { setSelectMode(p => !p); setSelectedIds(new Set()); };
  const toggleSelect = (id) => setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const deleteSelected = () => { setMessages(prev => prev.filter(m => !selectedIds.has(m.id))); setSelectedIds(new Set()); setSelectMode(false); };

  const handleSend = async (text) => {
    const msgText = (text || input).trim();
    if (!msgText) return;

    const userMsg = { id: Date.now(), text: msgText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Fire-and-forget Gmail notification
    try {
      fetch('http://localhost:5000/api/messages/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user?.name || 'Anonymous Guest', email: user?.email || 'no-reply@aetherionmotors.com', subject: `💬 AI Chat: ${user?.name || 'Guest'}`, message: msgText })
      });
    } catch (_) {}

    // Build history (last 8 msgs, exclude initial greeting for brevity)
    const history = messages.slice(1).map(m => ({ sender: m.sender, text: m.text }));

    try {
      // ── Call Gemini via backend ────────────────────────────────────────
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msgText, history })
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.reply || "I'm sorry, I couldn't get a response. Please try again.";
        setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, sender: 'agent' }]);
        setUsingGemini(true);
      } else {
        throw new Error('Gemini unavailable');
      }
    } catch (_) {
      // ── Fallback to local NLP if server/Gemini is down ─────────────
      setUsingGemini(false);
      const localReply = localFallback(msgText, cars);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: localReply, sender: 'agent' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* ── Floating Chat Bubble ───────────────────────────────────────── */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-8 right-8 z-40 p-4 rounded-full bg-gradient-to-br from-[#D4AF37] via-yellow-400 to-yellow-300 text-black shadow-[0_0_28px_rgba(212,175,55,0.55)] hover:shadow-[0_0_40px_rgba(212,175,55,0.75)] transition-shadow duration-300"
      >
        <Bot className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#050505] animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 60 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-28 right-8 w-[400px] h-[600px] z-50 rounded-[2rem] bg-[#050505]/98 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.95)] border border-white/8 flex flex-col overflow-hidden"
          >
            {/* ── Header ──────────────────────────────────────────────── */}
            <div className="px-5 py-3.5 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#D4AF37]/5 to-transparent flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#D4AF37]" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-[#050505]" />
                </div>
                <div>
                  <h3 className="text-[11px] font-black text-[#D4AF37] tracking-widest uppercase flex items-center gap-1.5">
                    Aetherion AI
                    {usingGemini
                      ? <span className="flex items-center gap-0.5 text-[8px] text-purple-400 font-bold normal-case tracking-normal"><Sparkles className="w-2.5 h-2.5" /> Gemini</span>
                      : <span className="flex items-center gap-0.5 text-[8px] text-yellow-400 font-bold normal-case tracking-normal"><Zap className="w-2.5 h-2.5" /> Local</span>
                    }
                  </h3>
                  <p className="text-[9px] text-green-400 font-bold uppercase tracking-widest">● Online — Full Knowledge</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={toggleSelectMode} title="Select Messages" className={`p-2 rounded-full transition-all duration-200 ${selectMode ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10'}`}>
                  <CheckSquare className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setShowClearConfirm(true)} title="Clear Chat" className="p-2 rounded-full bg-white/5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all duration-200">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── Select Mode Banner ───────────────────────────────────── */}
            <AnimatePresence>
              {selectMode && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden flex-shrink-0">
                  <div className="flex items-center justify-between px-5 py-2.5 bg-[#D4AF37]/5 border-b border-[#D4AF37]/10">
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">{selectedIds.size === 0 ? 'Tap messages to select' : `${selectedIds.size} selected`}</span>
                    {selectedIds.size > 0 && (
                      <button onClick={deleteSelected} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 rounded-lg text-red-400 text-[10px] font-bold uppercase tracking-wider transition-all">
                        <Trash2 className="w-3 h-3" /> Delete {selectedIds.size}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Messages Area ────────────────────────────────────────── */}
            <div className="flex-1 px-4 py-4 overflow-y-auto space-y-4 min-h-0">
              {messages.map(m => (
                <motion.div
                  layout key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className={`flex items-end gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  onMouseEnter={() => !selectMode && setHoveredId(m.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => selectMode && toggleSelect(m.id)}
                >
                  {/* Select checkbox — agent side */}
                  {selectMode && m.sender === 'agent' && (
                    <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      onClick={e => { e.stopPropagation(); toggleSelect(m.id); }}
                      className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedIds.has(m.id) ? 'bg-red-500 border-red-500' : 'border-white/20 hover:border-red-400/60'}`}
                    >{selectedIds.has(m.id) && <X className="w-2.5 h-2.5 text-white" />}</motion.button>
                  )}

                  {/* Bubble */}
                  <div className="relative max-w-[87%]">
                    <div className={`rounded-[1.2rem] px-4 py-3 text-[12px] font-sans leading-relaxed shadow-lg transition-all ${
                      m.sender === 'user'
                        ? `bg-gradient-to-br from-[#D4AF37] to-yellow-500 text-black rounded-br-sm font-medium ${selectMode && selectedIds.has(m.id) ? 'ring-2 ring-red-400 opacity-70' : ''}`
                        : `bg-[#111]/90 border border-white/6 text-zinc-200 rounded-bl-sm ${selectMode && selectedIds.has(m.id) ? 'ring-2 ring-red-400 opacity-70' : ''}`
                    }`}>
                      {renderText(m.text)}
                    </div>
                    {/* Hover delete */}
                    {!selectMode && hoveredId === m.id && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.12 }}
                        onClick={() => handleDeleteOne(m.id)}
                        className={`absolute -top-2 ${m.sender === 'user' ? '-left-2' : '-right-2'} w-5 h-5 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center shadow-lg z-10`}
                      >
                        <X className="w-2.5 h-2.5 text-white" />
                      </motion.button>
                    )}
                  </div>

                  {/* Select checkbox — user side */}
                  {selectMode && m.sender === 'user' && (
                    <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      onClick={e => { e.stopPropagation(); toggleSelect(m.id); }}
                      className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedIds.has(m.id) ? 'bg-red-500 border-red-500' : 'border-white/20 hover:border-red-400/60'}`}
                    >{selectedIds.has(m.id) && <X className="w-2.5 h-2.5 text-white" />}</motion.button>
                  )}
                </motion.div>
              ))}

              {/* Typing animation */}
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <div className="bg-[#111]/90 border border-white/6 rounded-[1.2rem] rounded-bl-sm px-5 py-4 flex gap-1.5 items-center shadow-md">
                    {[0, 0.18, 0.36].map((d, i) => (
                      <motion.div key={i} className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: d }} />
                    ))}
                    <span className="text-[10px] text-zinc-600 ml-1.5 font-medium">Gemini thinking…</span>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* ── Quick Suggestion Pills ───────────────────────────────── */}
            {messages.length <= 2 && !selectMode && (
              <div className="px-4 pb-2 flex-shrink-0">
                <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold mb-2">Quick Questions</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.slice(0, 4).map((s, i) => (
                    <button key={i} onClick={() => handleSend(s)}
                      className="px-3 py-1.5 bg-[#D4AF37]/8 hover:bg-[#D4AF37]/18 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 rounded-full text-[10px] text-[#D4AF37] font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Input Bar ───────────────────────────────────────────── */}
            <div className="px-4 py-3 border-t border-white/5 flex gap-2 bg-black/50 backdrop-blur-md flex-shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={selectMode ? 'Exit selection to type…' : 'Ask anything about Aetherion…'}
                disabled={selectMode || isTyping}
                className="flex-1 bg-white/5 border border-white/8 rounded-full px-5 py-2.5 text-[12px] text-white focus:outline-none focus:border-[#D4AF37]/40 placeholder-zinc-600 font-sans transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <button
                onClick={() => handleSend()}
                disabled={isTyping || !input.trim() || selectMode}
                className={`p-3 rounded-full transition-all duration-300 flex-shrink-0 ${isTyping || !input.trim() || selectMode ? 'bg-white/5 text-zinc-600' : 'bg-[#D4AF37] text-black hover:bg-white hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] active:scale-95'}`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Gemini badge */}
            <div className="pb-2.5 text-center">
              <span className="text-[9px] text-zinc-700 font-medium">
                {usingGemini ? '✦ Powered by Google Gemini AI' : '⚡ Running on local knowledge base'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Clear Confirm Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center px-6" onClick={() => setShowClearConfirm(false)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.85, y: 20 }} transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
              className="relative z-10 w-full max-w-[300px] bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-500/10 border border-red-500/20 mx-auto mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-white font-bold text-sm text-center mb-1">Clear Chat History</h3>
              <p className="text-zinc-500 text-[11px] text-center mb-5 leading-relaxed">All messages will be permanently removed and the AI will restart fresh.</p>
              <div className="flex gap-2">
                <button onClick={() => setShowClearConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-zinc-400 text-[11px] font-bold uppercase tracking-wider hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={handleClearAll} className="flex-1 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5">
                  <Trash2 className="w-3 h-3" /> Clear All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
