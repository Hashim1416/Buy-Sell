import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, ChevronRight, Heart, BarChart3, Shield, Cpu, Zap, Star, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';

function TiltCard({ children, className }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ transform: "translateZ(30px)", display: "flex", flexDirection: "column", height: "100%" }}>
        {children}
      </div>
    </motion.div>
  );
}

function MagneticButton({ children, className, onClick, type = "button" }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPos = (mouseX / width - 0.5) * 15;
    const yPos = (mouseY / height - 0.5) * 15;
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseXSpring, y: mouseYSpring }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

export default function Home() {
  const { cars, toggleWishlist, toggleCompare, compareBasket } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // AI Profiler States
  const [aiStep, setAiStep] = useState(0); 
  const [aiAnswers, setAiAnswers] = useState({ env: '', priority: '', fuel: '' });
  const [aiResults, setAiResults] = useState([]);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categoriesList = ['All', 'Luxury Cars', 'Supercars', 'Sports Cars', 'EV Cars', 'Off-Road Cars', 'New and Futures Cars', 'Old Cars', 'Vintage Cars', 'Wishlist'];
  
  const filteredHomeCars = cars.filter(car => {
    const isFeaturedBase = ['Continental GT', 'Maybach S 680', 'CT5-V Blackwing', 'Revuelto', 'SF90 Stradale', 'Spectre'].includes(car.name);
    
    if (activeCategory === 'All') {
      return isFeaturedBase;
    }

    if (activeCategory === 'Wishlist') {
      return user?.wishlist?.includes(car.name);
    }

    return car.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const handleAiQuestion = (key, value, nextStep) => {
    const updatedAnswers = { ...aiAnswers, [key]: value };
    setAiAnswers(updatedAnswers);
    setAiStep(nextStep);

    if (nextStep === 4) {
      calculateAiRecommendations(updatedAnswers);
    }
  };

  const calculateAiRecommendations = (answers) => {
    const scored = cars.map(car => {
      let score = 50;
      let reasons = [];

      if (answers.env === 'track' && ['Supercars', 'Sports Cars'].includes(car.category)) {
        score += 20;
        reasons.push("Track-tuned active aerodynamics & downforce");
      }
      if (answers.env === 'city' && car.category === 'EV Cars') {
        score += 20;
        reasons.push("Regenerative urban range optimization");
      }
      if (answers.env === 'offroad' && car.category === 'Off-Road Cars') {
        score += 30;
        reasons.push("Adaptive height control & all-terrain drivetrain");
      }

      if (answers.priority === 'speed' && car.specs.horsepower > 800) {
        score += 20;
        reasons.push("Extreme powertrain capacity (>800 HP)");
      }
      if (answers.priority === 'range' && car.specs.batteryRange > 250) {
        score += 20;
        reasons.push("Extended high-density electric range");
      }
      if (answers.priority === 'comfort' && ['Rolls-Royce', 'Bentley', 'Maybach'].includes(car.brand)) {
        score += 30;
        reasons.push("Hand-crafted cabin acoustics & acoustic glass");
      }

      if (answers.fuel === 'electric' && car.specs.fuelType === 'Electric') {
        score += 25;
        reasons.push("Dual-motor zero-emission architecture");
      }
      if (answers.fuel === 'hybrid' && car.specs.fuelType === 'Hybrid') {
        score += 25;
        reasons.push("F1-derived performance hybrid system");
      }
      if (answers.fuel === 'gasoline' && car.specs.fuelType === 'Gasoline') {
        score += 25;
        reasons.push("Naturally aspirated combustion soundstage");
      }

      return { 
        ...car, 
        matchPercentage: Math.min(score, 100),
        reason: reasons[0] || "Perfect alignment with luxury criteria"
      };
    });

    scored.sort((a, b) => b.matchPercentage - a.matchPercentage);
    setAiResults(scored.slice(0, 3));
  };

  const resetAiEngine = () => {
    setAiAnswers({ env: '', priority: '', fuel: '' });
    setAiStep(0);
    setAiResults([]);
  };

  return (
    <div className="bg-luxury-black text-luxury-silver min-h-screen font-sans overflow-x-hidden selection:bg-luxury-gold selection:text-black">
      
      {/* 1. Cinematic Split Hero Section */}
      <div className="relative h-[calc(100vh-100px)] flex items-center bg-black overflow-hidden perspective-[2000px]">
        {/* Parallax Background */}
        <motion.div 
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.35 }}
          transition={{ duration: 2.2, ease: 'easeOut' }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent z-1" />
        
        {/* Decorative subtle ambient lights */}
        <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Side Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-luxury-gold/30 bg-luxury-gold/5 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
              <span className="text-luxury-gold tracking-[0.3em] text-[9px] font-black uppercase">Established MXXVI • Private Showroom</span>
            </div>

            <h1 className="text-white leading-[1.1] tracking-tight text-4xl md:text-5xl lg:text-6xl font-serif">
              The Sovereign <br />
              <span className="text-gold-gradient drop-shadow-[0_0_30px_rgba(212,175,55,0.25)]">Luxury Standard</span>
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 max-w-lg leading-relaxed font-light">
              Acquire certified hypercars, hand-crafted grand tourers, and silent electric models from our exclusive international network.
            </p>

            {/* Premium Search input */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md bg-zinc-950/60 backdrop-blur-xl p-2 rounded-full border border-white/5 shadow-2xl hover:border-luxury-gold/30 transition-all duration-500 group">
              <div className="relative flex-grow">
                <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-650 group-focus-within:text-luxury-gold transition-colors" />
                <input
                  type="text"
                  placeholder="Search manufacturer or model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 focus:ring-0 pl-11 pr-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none rounded-full"
                />
              </div>
              <MagneticButton
                type="submit"
                className="bg-luxury-gold hover:bg-white text-black px-7 py-3 rounded-full transition-all duration-300 text-[10px] font-black uppercase tracking-widest shadow-md shadow-luxury-gold/10 hover:shadow-white/10"
              >
                Search
              </MagneticButton>
            </form>
          </motion.div>

          {/* Right Side Video Showcase */}
          <motion.div
            initial={{ opacity: 0, rotateY: 15, z: -100 }}
            animate={{ opacity: 1, rotateY: 0, z: 0 }}
            transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 h-[280px] lg:h-[420px] w-full rounded-[2.5rem] overflow-hidden border border-white/5 relative shadow-[0_24px_80px_rgba(0,0,0,0.65)] bg-black group transform-gpu"
          >
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover opacity-75 group-hover:opacity-95 transition-opacity duration-700 filter saturate-[1.05] contrast-105"
            >
              <source src="/videos/web_site_vid.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 border border-luxury-gold/15 rounded-[2.5rem] pointer-events-none mix-blend-overlay" />
            <div className="absolute bottom-5 left-6 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-[9px] text-zinc-350 tracking-widest font-black uppercase bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                EXHIBIT PROJECTION
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. Sticky Featured Selector Bar */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="sticky top-20 z-30 bg-black/95 backdrop-blur-xl border-y border-zinc-900 shadow-xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5 items-center justify-center md:justify-start overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest mr-3 hidden lg:inline">CURATED VAULT:</span>
            {categoriesList.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[9px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-luxury-gold text-black shadow-md shadow-luxury-gold/5'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-3 text-[9px] font-black uppercase tracking-widest shrink-0">
            <Link
              to="/viewer3d"
              className="px-6 py-3 border border-luxury-gold/30 hover:border-luxury-gold text-luxury-gold hover:text-white rounded-xl transition-all duration-300 bg-luxury-gold/5 hover:bg-luxury-gold/10 font-bold"
            >
              3D Studio
            </Link>
            <Link
              to="/scheduler"
              className="px-6 py-3 bg-white text-black hover:bg-luxury-gold hover:text-black rounded-xl transition-all duration-300 font-bold"
            >
              Consultation
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 3. Curated Exhibition Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 border-b border-zinc-900 pb-8"
        >
          <div>
            <span className="text-luxury-gold text-xs tracking-[0.35em] font-semibold uppercase block mb-1">CURATED EXHIBITION</span>
            <h2 className="text-white typography-section-title font-serif tracking-wide">
              {activeCategory === 'All' ? 'Featured Showroom' : `${activeCategory} Collection`}
            </h2>
          </div>
          <Link
            to="/collections"
            className="text-[10px] font-black uppercase tracking-widest text-zinc-405 hover:text-luxury-gold transition flex items-center gap-1.5"
          >
            <span>View Full Showroom</span>
            <ChevronRight className="w-3.5 h-3.5 text-luxury-gold" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {filteredHomeCars.map((car) => {
              const isWishlisted = user?.wishlist?.includes(car.name);
              const inCompare = compareBasket.some(c => c.name === car.name);

              // Percentage gauges
              const hpPercent = Math.min((car.specs.horsepower / 1100) * 100, 100);
              const speedPercent = Math.min((car.specs.topSpeed / 300) * 100, 100);

              let subText = "The Definitive Grand Tourer";
              if (car.brand === 'Ferrari') subText = "Active Hybrid Synergy Masterpiece";
              if (car.brand === 'Mercedes-Benz') subText = "The Ultimate Chauffeur Experience";
              if (car.brand === 'Cadillac') subText = "Track Tuned High-Performance Sedan";
              if (car.brand === 'Rolls-Royce') subText = "Silent Electric Masterpiece Car";
              if (car.brand === 'Porsche') subText = "Motorsport Engineering Road Concept";

              return (
                <TiltCard
                  key={car.id || car.name}
                  className="bg-[#0a0a0a] rounded-[2rem] p-5 border border-zinc-900 shadow-xl hover:border-luxury-gold/30 hover:shadow-[0_12px_40px_rgba(212,175,55,0.04)] transition-all duration-500 flex flex-col justify-between group relative"
                >
                  {/* Top Image box */}
                  <div className="h-52 rounded-2xl overflow-hidden relative bg-[#020202] mb-5 border border-zinc-900/60 group-hover:border-luxury-gold/20 transition-colors duration-500">
                    <img
                      src={car.image}
                      alt={car.name}
                      loading="lazy"
                      className="w-full h-full object-cover filter brightness-[0.88] group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <button
                        onClick={() => toggleWishlist(car.name)}
                        className={`w-9 h-9 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all ${
                          isWishlisted 
                            ? 'bg-red-500/90 border-red-500/20 text-white shadow-md' 
                            : 'bg-black/60 border-white/10 text-zinc-400 hover:text-white hover:bg-black/80'
                        }`}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                      <button
                        onClick={() => toggleCompare(car)}
                        className={`w-9 h-9 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all ${
                          inCompare 
                            ? 'bg-luxury-gold border-luxury-gold/20 text-black shadow-md shadow-luxury-gold/10' 
                            : 'bg-black/60 border-white/10 text-zinc-400 hover:text-white hover:bg-black/80'
                        }`}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Brand badge overlay */}
                    <div className="absolute bottom-3 right-3 text-[9px] tracking-[0.25em] text-zinc-450 uppercase font-black bg-black/60 px-2.5 py-1 rounded-sm border border-white/5 backdrop-blur-md">
                      {car.brand}
                    </div>
                  </div>

                  {/* Title and Descriptions */}
                  <div className="space-y-1 mb-5">
                    <h3 className="text-white text-base font-bold tracking-wide uppercase group-hover:text-luxury-gold transition-colors duration-300">
                      {car.brand} {car.name}
                    </h3>
                    <p className="text-[10px] text-zinc-550 font-semibold uppercase tracking-widest leading-relaxed">
                      {subText}
                    </p>
                  </div>

                  {/* Specs gauges */}
                  <div className="space-y-3 mb-5 text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span>HORSEPOWER</span>
                        <span className="text-white font-mono">{car.specs.horsepower} HP</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-luxury-gold transition-all duration-500" style={{ width: `${hpPercent}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span>TOP SPEED</span>
                        <span className="text-white font-mono">{car.specs.topSpeed} MPH</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-luxury-gold transition-all duration-500" style={{ width: `${speedPercent}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Line */}
                  <div className="flex justify-between items-end border-t border-zinc-900 pt-4 mt-2">
                    <div>
                      <span className="text-[8px] text-zinc-500 block font-bold uppercase tracking-widest mb-0.5">STARTING AT</span>
                      <span className="text-white text-base font-bold">${car.price.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="border border-zinc-800 bg-zinc-900/30 rounded-lg px-2.5 py-1.5 text-[8px] text-zinc-400 uppercase tracking-wider font-bold">
                        {car.specs.fuelType}
                      </span>
                      <Link
                        to={`/viewer3d?car=${encodeURIComponent(car.name)}`}
                        className="bg-luxury-gold hover:bg-white text-black text-[9px] font-black tracking-widest uppercase px-4 py-2 rounded-xl transition-all duration-300 shadow-md shadow-luxury-gold/5"
                      >
                        3D View
                      </Link>
                    </div>
                  </div>

                </TiltCard>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* 4. AI Recommendation Concierge */}
      <section className="py-24 bg-gradient-to-b from-black/40 to-zinc-950/20 border-y border-zinc-900/40 relative">
        {/* Glow behind section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-luxury-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex p-3 bg-luxury-gold/5 rounded-2xl border border-luxury-gold/10 mb-4 animate-pulse">
              <Sparkles className="w-5 h-5 text-luxury-gold" />
            </div>
            <h2 className="text-white typography-section-title font-serif tracking-wide">AI Recommendation Concierge</h2>
            <p className="text-[11px] text-zinc-500 max-w-md mx-auto mt-2.5 leading-relaxed">Let our neural recommendation engine match you with the ideal luxury vehicle based on performance credentials.</p>
          </div>

          <div className="bg-[#0a0a0a] rounded-3xl border border-zinc-900 p-8 shadow-2xl relative overflow-hidden">
            {/* Step Progress indicator */}
            {aiStep > 0 && aiStep < 4 && (
              <div className="mb-8">
                <div className="flex justify-between text-[9px] font-bold text-zinc-550 uppercase tracking-widest mb-2">
                  <span>Profiling Assessment</span>
                  <span>Step {aiStep} of 3</span>
                </div>
                <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-luxury-gold transition-all duration-300" style={{ width: `${(aiStep / 3) * 100}%` }} />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {aiStep === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center py-6 space-y-6"
                >
                  <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed font-light">
                    Start the private profiling assessment. Our matching algorithm computes drivetrain metrics, chassis preferences, and cabin luxury parameters.
                  </p>
                  <button
                    onClick={() => setAiStep(1)}
                    className="bg-luxury-gold hover:bg-yellow-400 text-black font-black text-[10px] uppercase tracking-widest px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-luxury-gold/5"
                  >
                    Initiate Profile Assessment
                  </button>
                </motion.div>
              )}

              {aiStep === 1 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6 text-center"
                >
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">1. Select your primary operational territory</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { val: 'city', label: 'Urban Boulevard', desc: 'Sleek metropolitan drives' },
                      { val: 'track', label: 'Apex Circuit', desc: 'Racetrack performance boundaries' },
                      { val: 'offroad', label: 'All-Terrain Wilderness', desc: 'Desert dunes and alpine passes' }
                    ].map(e => (
                      <button
                        key={e.val}
                        onClick={() => handleAiQuestion('env', e.val, 2)}
                        className="p-5 border border-zinc-900 hover:border-luxury-gold/30 bg-black/40 rounded-2xl transition-all duration-300 text-center hover:scale-[1.02] flex flex-col items-center justify-center gap-1.5"
                      >
                        <span className="block font-bold text-xs text-white uppercase tracking-wider">{e.label}</span>
                        <span className="text-[9px] text-zinc-555 font-bold uppercase tracking-wide">{e.desc}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {aiStep === 2 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6 text-center"
                >
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">2. Define your primary engineering priority</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { val: 'speed', label: 'Raw Acceleration', desc: 'Max horsepower & immediate torque' },
                      { val: 'range', label: 'Drivetrain Endurance', desc: 'Extended ranges and battery longevity' },
                      { val: 'comfort', label: 'Cabin Serenity', desc: 'Bespoke hand-crafted cabin comfort' }
                    ].map(p => (
                      <button
                        key={p.val}
                        onClick={() => handleAiQuestion('priority', p.val, 3)}
                        className="p-5 border border-zinc-900 hover:border-luxury-gold/30 bg-black/40 rounded-2xl transition-all duration-300 text-center hover:scale-[1.02] flex flex-col items-center justify-center gap-1.5"
                      >
                        <span className="block font-bold text-xs text-white uppercase tracking-wider">{p.label}</span>
                        <span className="text-[9px] text-zinc-555 font-bold uppercase tracking-wide">{p.desc}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {aiStep === 3 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6 text-center"
                >
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">3. Select preferred engine engineering</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { val: 'gasoline', label: 'Combustion Excellence', desc: 'V8/V12 naturally aspirated notes' },
                      { val: 'hybrid', label: 'Hybrid Synergy', desc: 'Combined electric & combustion output' },
                      { val: 'electric', label: 'Pure Electric', desc: 'Zero emissions, instant torque delivery' }
                    ].map(f => (
                      <button
                        key={f.val}
                        onClick={() => handleAiQuestion('fuel', f.val, 4)}
                        className="p-5 border border-zinc-900 hover:border-luxury-gold/30 bg-black/40 rounded-2xl transition-all duration-300 text-center hover:scale-[1.02] flex flex-col items-center justify-center gap-1.5"
                      >
                        <span className="block font-bold text-xs text-white uppercase tracking-wider">{f.label}</span>
                        <span className="text-[9px] text-zinc-555 font-bold uppercase tracking-wide">{f.desc}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {aiStep === 4 && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center pb-2 border-b border-zinc-900">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-luxury-gold">Matching Matrix Complete</h3>
                    <p className="text-[9px] text-zinc-550 mt-1 uppercase font-bold">Neural match output for your profile</p>
                  </div>

                  <div className="space-y-4">
                    {aiResults.map(car => (
                      <div key={car.id || car.name} className="flex flex-col sm:flex-row justify-between items-center p-4 border border-zinc-900 bg-zinc-950/40 rounded-2xl gap-4 hover:border-zinc-800 transition-colors">
                        <div className="flex items-center gap-5 w-full sm:w-auto">
                          <img src={car.image} alt={car.name} className="w-20 h-14 rounded-xl object-cover border border-zinc-900 shrink-0" />
                          <div>
                            <p className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest">{car.brand}</p>
                            <h4 className="text-xs text-white font-bold tracking-wide">{car.name}</h4>
                            <p className="text-[9px] text-zinc-500 font-medium italic mt-0.5">{car.reason}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
                          <div className="text-right">
                            <span className="text-[8px] text-zinc-500 block font-bold uppercase tracking-wider">MATCH ACCURACY</span>
                            <span className="text-xs font-black text-luxury-gold tracking-wider">{car.matchPercentage}% MATCH</span>
                          </div>
                          <Link
                            to={`/viewer3d?car=${encodeURIComponent(car.name)}`}
                            className="bg-zinc-900 hover:bg-luxury-gold text-zinc-405 hover:text-black px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-inner"
                          >
                            Configure
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center pt-4">
                    <button
                      onClick={resetAiEngine}
                      className="text-[9px] text-zinc-500 hover:text-white transition-colors uppercase font-black tracking-widest border border-zinc-900 px-5 py-2.5 rounded-xl flex items-center gap-1.5 mx-auto hover:bg-zinc-900/50"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset Profiler
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 5. Luxury Membership Banner */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="relative rounded-[2.5rem] overflow-hidden py-20 px-12 border border-luxury-gold/30 shadow-[0_0_60px_rgba(212,175,55,0.06)] bg-zinc-950">
          {/* Subtle gold animated particle layer */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.03),transparent_40%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.03),transparent_40%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-luxury-gold tracking-[0.4em] text-xs font-bold uppercase block">EXCLUSIVE OPPORTUNITY</span>
            <h2 className="text-3xl md:text-4xl font-serif text-white tracking-wide">
              Aetherion Elite <br />
              <span className="text-luxury-gold font-sans font-bold">Membership Program</span>
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-light">
              Acquire access to bespoke private allocations, zero-commission vehicle trade-ins, VIP events at Monaco, Munich, and Pebble Beach, and 24/7 dedicated personal relationship management.
            </p>
            <div className="pt-4">
              <Link
                to="/scheduler?type=VIP"
                className="bg-luxury-gold hover:bg-white text-black font-black text-[10px] uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all inline-block shadow-lg shadow-luxury-gold/5"
              >
                Schedule Private Viewing
              </Link>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
