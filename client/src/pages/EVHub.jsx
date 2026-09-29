import React, { useState } from 'react';
import { Battery, Zap, DollarSign, Leaf, Sparkles, Navigation, ChevronRight, Fuel, Thermometer, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EVHub() {
  // Calculator States
  const [batteryCap, setBatteryCap] = useState(100); // kWh
  const [elecRate, setElecRate] = useState(0.16); // $/kWh
  const [dailyMiles, setDailyMiles] = useState(40); // miles
  const [gasPrice, setGasPrice] = useState(4.2); // $/gal
  const [gasMpg, setGasMpg] = useState(20); // MPG

  // Range Simulator States
  const [speed, setSpeed] = useState(65); // MPH
  const [temp, setTemp] = useState(72); // Fahrenheit
  const [climateOn, setClimateOn] = useState(true);
  const [baseRange, setBaseRange] = useState(320); // base range in miles

  // Calculations
  const evMilesPerKwh = 3.2; // average premium EV efficiency
  const evDailyCost = (dailyMiles / evMilesPerKwh) * elecRate;
  const gasDailyCost = (dailyMiles / gasMpg) * gasPrice;
  const annualSavings = (gasDailyCost - evDailyCost) * 365;
  const annualCo2Offset = dailyMiles * 365 * 0.411; // lbs of CO2 (average 411g/mi offset)

  // Dynamic range calculation based on physics simulation
  const calculateSimulatedRange = () => {
    let multiplier = 1.0;
    
    // Speed impact (efficiency peaks at ~45mph, drops at high speed due to air resistance)
    if (speed > 55) {
      multiplier -= (speed - 55) * 0.007; // high speed drag
    } else if (speed < 40) {
      multiplier -= (40 - speed) * 0.0035; // urban idle
    }

    // Temperature impact (battery efficiency peaks around 70F, drops in cold/hot)
    if (temp < 50) {
      multiplier -= (50 - temp) * 0.006; // cold battery loss
    } else if (temp > 85) {
      multiplier -= (temp - 85) * 0.003; // hot battery loss
    }

    // Climate control impact
    if (climateOn) {
      multiplier -= 0.08; // AC/heater consumption
    }

    return Math.round(baseRange * Math.max(multiplier, 0.45));
  };

  const simulatedRange = calculateSimulatedRange();
  const batteryPct = Math.round((simulatedRange / baseRange) * 100);

  const stations = [
    { name: 'Aetherion Beverly Hills Charging Lounge', address: '710 N Beverly Dr, Beverly Hills', connectors: '12 x 350kW DC Fast', status: 'Available', color: 'emerald' },
    { name: 'Miami Supercar Paddock', address: '123 Ocean Drive, Miami Beach', connectors: '8 x 350kW DC Fast', status: 'In Use (Wait: 15m)', color: 'amber' },
    { name: 'Munich Platinum Charging Station', address: 'Maximilianstraße 12, Munich', connectors: '6 x 350kW DC Fast', status: 'Available', color: 'emerald' }
  ];

  const news = [
    { title: 'Porsche Expands Ultra-Fast 400kW Charger Network Across Europe', date: 'June 02, 2026', source: 'Autosport International' },
    { title: 'Solid-State Batteries: The Next Frontier in Luxury EV Autonomy', date: 'May 28, 2026', source: 'Future Engineering Review' },
    { title: 'Rolls-Royce Spectre Receives Top Safety Honors in Global Tests', date: 'May 15, 2026', source: 'Luxury Drivetrain Journal' }
  ];

  return (
    <div className="bg-luxury-black text-luxury-silver min-h-screen pt-32 pb-20 font-sans selection:bg-luxury-gold selection:text-black relative">
      {/* Ambient background glows */}
      <div className="absolute top-24 left-1/4 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-zinc-900/60 pb-8">
          <div>
            <span className="text-luxury-gold text-xs tracking-[0.35em] font-semibold uppercase block mb-2">Futuristic Drivetrains</span>
            <h1 className="text-white text-4xl md:text-5xl font-serif tracking-wide leading-tight">EV Hub</h1>
            <p className="text-zinc-550 text-[11px] mt-2 flex items-center gap-2 uppercase tracking-widest font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
              Navigate the transition to electric excellence
            </p>
          </div>
          <p className="text-[11px] text-zinc-500 max-w-sm font-bold uppercase tracking-wider leading-relaxed">
            Simulate driving dynamics, calculate carbon offsets, and find premium charging salons.
          </p>
        </div>

        {/* Top Calculators Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* 1. Charging Cost Calculator */}
          <div className="bg-[#0a0a0a] rounded-[2rem] p-6 md:p-8 border border-zinc-900/80 flex flex-col justify-between group hover:border-luxury-gold/20 hover:shadow-[0_12px_40px_rgba(212,175,55,0.04)] transition-all duration-500">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-luxury-gold" />
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300">Charging Cost Calculator</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-xs font-semibold text-zinc-400">
                <div className="space-y-2">
                  <label className="block text-[9px] tracking-wider uppercase text-zinc-550 font-bold">Battery Capacity (kWh)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={batteryCap}
                      onChange={e => setBatteryCap(Number(e.target.value))}
                      className="w-full bg-zinc-900/20 border border-zinc-900 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-luxury-gold/30 transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[9px] tracking-wider uppercase text-zinc-550 font-bold">Electricity Rate ($/kWh)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={elecRate}
                      onChange={e => setElecRate(Number(e.target.value))}
                      className="w-full bg-zinc-900/20 border border-zinc-900 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-luxury-gold/30 transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[9px] tracking-wider uppercase text-zinc-550 font-bold">Daily Mileage (miles)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={dailyMiles}
                      onChange={e => setDailyMiles(Number(e.target.value))}
                      className="w-full bg-zinc-900/20 border border-zinc-900 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-luxury-gold/30 transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[9px] tracking-wider uppercase text-zinc-550 font-bold">Gasoline Price ($/gallon)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={gasPrice}
                      onChange={e => setGasPrice(Number(e.target.value))}
                      className="w-full bg-zinc-900/20 border border-zinc-900 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-luxury-gold/30 transition-all font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-3 gap-4 border-t border-zinc-900/80 pt-6 text-center text-xs font-sans relative z-10">
              <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-900">
                <span className="block text-zinc-500 text-[8px] uppercase tracking-wider font-bold mb-1">EV Daily Cost</span>
                <span className="text-white font-black text-sm">${evDailyCost.toFixed(2)}</span>
              </div>
              <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-900">
                <span className="block text-zinc-500 text-[8px] uppercase tracking-wider font-bold mb-1">Gas Daily Cost</span>
                <span className="text-white font-black text-sm">${gasDailyCost.toFixed(2)}</span>
              </div>
              <div className="bg-luxury-gold/5 p-4 rounded-2xl border border-luxury-gold/20 shadow-inner">
                <span className="block text-luxury-gold text-[8px] uppercase tracking-wider font-black mb-1">Annual Savings</span>
                <span className="text-luxury-gold font-black text-sm">${Math.round(annualSavings).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 2. Range Simulator */}
          <div className="bg-[#0a0a0a] rounded-[2rem] p-6 md:p-8 border border-zinc-900/80 flex flex-col justify-between group hover:border-luxury-gold/20 hover:shadow-[0_12px_40px_rgba(212,175,55,0.04)] transition-all duration-500">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Battery className="w-5 h-5 text-luxury-gold" />
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300">Autonomy Range Simulator</h3>
              </div>

              <div className="space-y-6 mb-8 text-xs font-semibold text-zinc-400">
                {/* Speed Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[9px] uppercase tracking-wider font-bold">
                    <span className="text-zinc-550 flex items-center gap-1"><Fuel className="w-3 h-3 text-luxury-gold" /> Cruising Speed</span>
                    <span className="text-white font-mono text-[11px]">{speed} MPH</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="90"
                    value={speed}
                    onChange={e => setSpeed(Number(e.target.value))}
                    className="w-full accent-luxury-gold bg-zinc-900/80 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Temperature Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[9px] uppercase tracking-wider font-bold">
                    <span className="text-zinc-550 flex items-center gap-1"><Thermometer className="w-3 h-3 text-luxury-gold" /> Outdoor Temp</span>
                    <span className="text-white font-mono text-[11px]">{temp}°F</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="110"
                    value={temp}
                    onChange={e => setTemp(Number(e.target.value))}
                    className="w-full accent-luxury-gold bg-zinc-900/80 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Climate Toggle */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="block text-[9px] tracking-wider uppercase text-zinc-500 font-bold">Cabin Climate Systems</span>
                    <span className="text-[9px] text-zinc-650 font-bold uppercase">Active heating / cooling</span>
                  </div>
                  <button
                    onClick={() => setClimateOn(!climateOn)}
                    className={`text-[9px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all duration-300 ${
                      climateOn 
                        ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/5' 
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                    }`}
                  >
                    {climateOn ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Range Display */}
            <div className="border-t border-zinc-900/80 pt-6 flex justify-between items-center bg-zinc-950/40 p-5 rounded-2xl border border-zinc-900 relative z-10">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-luxury-gold animate-pulse" />
                <div>
                  <span className="text-[9px] text-zinc-500 block font-bold uppercase tracking-widest">PREDICTED AUTONOMY</span>
                  <span className="text-white text-xl font-serif font-black tracking-wide">{simulatedRange} <span className="text-[10px] font-sans text-zinc-400 uppercase font-black tracking-widest ml-1">miles</span></span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-zinc-550 block font-bold uppercase">Base Range</span>
                <span className="text-xs text-zinc-300 font-bold font-mono">{baseRange} mi</span>
              </div>
            </div>
          </div>

        </div>

        {/* News & Charging Lounges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Charger directory */}
          <div className="bg-[#0a0a0a] rounded-[2rem] p-6 md:p-8 border border-zinc-900/80 space-y-6 group hover:border-luxury-gold/20 hover:shadow-[0_12px_40px_rgba(212,175,55,0.04)] transition-all duration-500">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-luxury-gold" />
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300">Showroom Charging Lounges</h3>
            </div>
            
            <div className="space-y-4">
              {stations.map(station => (
                <div key={station.name} className="p-5 border border-zinc-900/60 bg-zinc-950/30 rounded-2xl flex justify-between items-start gap-4 hover:border-luxury-gold/15 transition-colors duration-300">
                  <div className="space-y-1">
                    <h4 className="text-xs text-white font-bold">{station.name}</h4>
                    <p className="text-[10px] text-zinc-500">{station.address}</p>
                    <p className="text-[9px] text-luxury-gold font-mono font-bold mt-1 uppercase tracking-wider">{station.connectors}</p>
                  </div>
                  <span className={`text-[8px] border px-3 py-1 rounded-full font-black uppercase shrink-0 ${
                    station.color === 'emerald' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-450 border-amber-500/20'
                  }`}>
                    {station.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* EV News */}
          <div className="bg-[#0a0a0a] rounded-[2rem] p-6 md:p-8 border border-zinc-900/80 space-y-6 group hover:border-luxury-gold/20 hover:shadow-[0_12px_40px_rgba(212,175,55,0.04)] transition-all duration-500">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-luxury-gold" />
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300">Carbon & EV Intelligence</h3>
            </div>

            <div className="space-y-4">
              {news.map(n => (
                <div key={n.title} className="p-5 border border-zinc-900/60 bg-zinc-950/30 rounded-2xl space-y-2 hover:border-luxury-gold/15 transition-colors duration-300">
                  <p className="text-[9px] text-zinc-500 flex justify-between uppercase font-bold tracking-wider">
                    <span>{n.source}</span>
                    <span>{n.date}</span>
                  </p>
                  <h4 className="text-xs text-white font-bold leading-relaxed">{n.title}</h4>
                </div>
              ))}
              
              {/* Carbon Offset Stats */}
              <div className="bg-[#0c0c0c] border border-zinc-900 p-5 rounded-2xl text-center space-y-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
                <div className="flex items-center justify-center gap-1.5 text-emerald-400">
                  <Leaf className="w-3.5 h-3.5" />
                  <span className="text-[8px] font-black uppercase tracking-widest block">Estimated Environmental Impact</span>
                </div>
                <p className="text-[10px] text-zinc-450 leading-relaxed">
                  Driving <span className="font-bold text-white">{dailyMiles} miles</span> daily offsets approximately <span className="font-black text-emerald-450">{Math.round(annualCo2Offset).toLocaleString()} lbs</span> of CO2 annually compared to an equivalent gasoline vehicle.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
