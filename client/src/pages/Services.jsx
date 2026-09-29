import React, { useState } from 'react';
import { Award, ShieldCheck, Wrench, Paintbrush, Compass, Sparkles, Disc, Truck, MapPin, Home, Fuel } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Services() {
  const [wrapType, setWrapType] = useState('matte');
  const [wrapColor, setWrapColor] = useState('#1F2937'); // Graphite
  const [customPrice, setCustomPrice] = useState(4500);

  const wraps = [
    { id: 'matte', label: 'Matte Finish', price: 4500, desc: 'Ultra-low gloss, stealth-like matte wrap.' },
    { id: 'satin', label: 'Satin Metallic', price: 5200, desc: 'Semi-gloss silky reflection wrap.' },
    { id: 'chrome', label: 'Mirror Chrome', price: 8500, desc: 'Ultra-reflective specular high-gloss wrap.' },
    { id: 'carbon', label: 'Carbon Fiber Structured', price: 6800, desc: 'Realistic carbon weaves structure wrap.' }
  ];

  const colors = [
    { hex: '#111827', name: 'Stealth Black' },
    { hex: '#D4AF37', name: 'Gold Dust' },
    { hex: '#7F1D1D', name: 'Rosso Corsa' },
    { hex: '#1E3A8A', name: 'Hyper Blue' },
    { hex: '#065F46', name: 'British Racing Green' }
  ];

  const handleWrapSelect = (w) => {
    setWrapType(w.id);
    setCustomPrice(w.price);
  };

  const getVisualEffectClass = () => {
    switch (wrapType) {
      case 'satin':
        return 'shadow-[inset_0_0_20px_rgba(255,255,255,0.4)] brightness-110';
      case 'chrome':
        return 'shadow-[inset_0_0_40px_rgba(255,255,255,0.8)] border border-white/30 brightness-125';
      case 'carbon':
        return 'bg-gradient-to-tr from-black via-zinc-805 to-black';
      default: // matte
        return 'brightness-90 opacity-95';
    }
  };

  const services = [
    { title: 'Paint Protection Film (PPF)', price: '$5,500', icon: ShieldCheck, desc: 'Self-healing urethane clear film protecting original paint from road debris.' },
    { title: '9H Multi-Layer Ceramic Coating', price: '$1,800', icon: Sparkles, desc: 'Ultra-hydrophobic ceramic glass coating offering unmatched surface gloss.' },
    { title: 'Carbon Fiber Aerodynamics Kit', price: 'Bespoke Quote', icon: Compass, desc: 'Custom wind-tunnel tested spoilers, splitters, and diffusers installation.' },
    { title: 'Carbon & Ceramic Brake Upgrades', price: '$8,500', icon: Wrench, desc: 'Bespoke high-performance braking units offering zero thermal fade.' },
    { title: 'Forged Rims & Performance Tires', price: '$12,000', icon: Disc, desc: 'Custom lightweight forged alloy wheels wrapped in ultra-high performance track-ready tires.' }
  ];

  const logistics = [
    { title: 'White-Glove Home Delivery', price: 'Included', icon: Home, desc: 'Secure, enclosed transport of your newly purchased vehicle directly to your residence.' },
    { title: 'Home-to-Showroom Service Pickup', price: '$250 Base', icon: MapPin, desc: 'We collect your vehicle from your home for garage maintenance and return it fully detailed.' },
    { title: 'Enclosed Global Transport', price: 'Bespoke Quote', icon: Truck, desc: 'Fully insured, climate-controlled shipping to any global destination or private garage.' }
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
            <span className="text-luxury-gold text-xs tracking-[0.35em] font-semibold uppercase block mb-2">Customization Studio</span>
            <h1 className="text-white text-4xl md:text-5xl font-serif tracking-wide leading-tight">Premium Care & Services</h1>
            <p className="text-zinc-550 text-[11px] mt-2 flex items-center gap-2 uppercase tracking-widest font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
              Tailored aesthetics & engineering care
            </p>
          </div>
          <p className="text-[11px] text-zinc-500 max-w-sm font-bold uppercase tracking-wider leading-relaxed">
            Personalize your vehicle in our bespoke wrapping studio or choose from our ceramic and maintenance packages.
          </p>
        </div>

        {/* 1. Custom Vehicle Wrap Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16 items-stretch">
          
          {/* Wrap controls */}
          <div className="lg:col-span-2 bg-[#0a0a0a] rounded-[2rem] p-6 md:p-8 border border-zinc-900/80 space-y-6 flex flex-col justify-between group hover:border-luxury-gold/15 transition-colors duration-500">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Paintbrush className="w-5 h-5 text-luxury-gold" />
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300">Bespoke Wrap Studio</h3>
              </div>

              {/* Wrap type */}
              <div className="space-y-3">
                <h4 className="text-[9px] tracking-widest uppercase text-zinc-550 font-bold ml-1">Finish Selection</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[9px] font-black uppercase tracking-wider">
                  {wraps.map(w => (
                    <button
                      key={w.id}
                      onClick={() => handleWrapSelect(w)}
                      className={`px-5 py-3.5 border rounded-xl transition-all duration-300 flex flex-row items-center justify-between shadow-sm ${
                        wrapType === w.id ? 'bg-luxury-gold text-black border-luxury-gold shadow-md shadow-luxury-gold/5' : 'border-zinc-900 bg-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-white'
                      }`}
                    >
                      <span>{w.label}</span>
                      <span className="text-[8px] opacity-75 font-mono">${w.price.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color selection */}
              <div className="space-y-3">
                <h4 className="text-[9px] tracking-widest uppercase text-zinc-550 font-bold ml-1">Color Coating</h4>
                <div className="flex gap-3">
                  {colors.map(col => (
                    <button
                      key={col.hex}
                      onClick={() => setWrapColor(col.hex)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        wrapColor === col.hex ? 'border-luxury-gold scale-110 shadow-[0_0_10px_rgba(212,175,55,0.4)]' : 'border-transparent hover:scale-105 shadow-inner'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    />
                  ))}
                </div>
              </div>
            </div>

             {/* Price Quote */}
             <div className="border-t border-zinc-900 pt-6 text-center bg-zinc-950/20 p-5 rounded-2xl border border-zinc-900 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/20 to-transparent"></div>
               <span className="text-[8px] text-zinc-550 block font-black uppercase tracking-widest mb-0.5">Estimated Wrap Quote</span>
               <span className="text-luxury-gold text-2xl font-serif font-black tracking-wide">${customPrice.toLocaleString()}</span>
               <p className="text-[9px] text-zinc-650 mt-1.5 font-bold uppercase tracking-wider">Includes high-end surface preparation & installation detailing.</p>
             </div>

          </div>

          {/* Wrap visualizer */}
          <div className="lg:col-span-3 bg-zinc-950/40 border border-zinc-900/80 rounded-[2rem] p-8 flex flex-col justify-between items-center relative overflow-hidden min-h-[350px] group hover:border-luxury-gold/15 transition-colors duration-500">
            
            {/* Visualizer backdrop glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-luxury-gold/5 rounded-full blur-[80px]" />
            <div className="absolute inset-0 transition-all duration-700 opacity-5 pointer-events-none group-hover:opacity-10" style={{ backgroundColor: wrapColor }} />
            
            <div className="text-center w-full z-10">
              <span className="text-[8px] text-zinc-550 font-bold tracking-widest uppercase block mb-1">Coating visualizer</span>
              <h4 className="text-xs text-white font-bold uppercase tracking-widest">
                {wrapType.toUpperCase()} &bull; {colors.find(c => c.hex === wrapColor)?.name.toUpperCase()}
              </h4>
            </div>

            {/* Center Vehicle Mockup silhouette using stylized CSS */}
            <div className="w-full max-w-sm h-36 flex items-center justify-center relative my-6 z-10">
              {/* Stylized sports car vector silhouette that gets filled by the wrapColor */}
              <div 
                className={`w-72 h-16 rounded-full transition-all duration-500 ${getVisualEffectClass()}`}
                style={{ backgroundColor: wrapColor }}
              >
                {/* Wheels and windshield mock */}
                <div className="absolute top-1.5 left-16 right-16 h-8 bg-black/80 rounded-t-full opacity-90 border-t border-white/10" />
                <div className="absolute -bottom-2 left-8 w-12 h-12 rounded-full bg-zinc-900 border-4 border-black shadow-lg" />
                <div className="absolute -bottom-2 right-8 w-12 h-12 rounded-full bg-zinc-900 border-4 border-black shadow-lg" />
                {/* Spoiler */}
                <div className="absolute -top-3 right-4 w-12 h-4 bg-zinc-900 rounded-t-xl rotate-6" />
              </div>
            </div>

            <p className="text-[9px] text-zinc-650 z-10 uppercase tracking-widest font-black">Pre-rendered customization model wrapper</p>

          </div>

        </div>

        {/* 2. Services Grid */}
        <div className="space-y-8">
          <div className="flex items-center gap-2 border-b border-zinc-900/60 pb-4">
            <Wrench className="w-5 h-5 text-luxury-gold" />
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300">Premium Care Offerings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((serv, idx) => {
              const IconComp = serv.icon;
              return (
                <div key={idx} className="bg-[#0a0a0a] rounded-[2rem] p-6 border border-zinc-900/80 flex gap-5 items-start transition-all duration-300 hover:border-luxury-gold/20 hover:bg-zinc-900/40 hover:shadow-[0_12px_40px_rgba(212,175,55,0.04)]">
                  <div className="p-3 bg-luxury-gold/5 border border-luxury-gold/15 rounded-full text-luxury-gold shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="space-y-2 w-full">
                    <div className="flex justify-between items-baseline gap-4">
                      <h4 className="text-xs text-white font-bold uppercase tracking-wider">{serv.title}</h4>
                      <span className="text-[10px] text-luxury-gold font-mono font-bold shrink-0">{serv.price}</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-light">{serv.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Logistics Grid */}
        <div className="space-y-8 mt-16">
          <div className="flex items-center gap-2 border-b border-zinc-900/60 pb-4">
            <Truck className="w-5 h-5 text-luxury-gold" />
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300">Concierge & Logistics</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {logistics.map((log, idx) => {
              const IconComp = log.icon;
              return (
                <div key={idx} className="bg-[#0a0a0a] rounded-[2rem] p-6 border border-zinc-900/80 flex gap-5 items-start hover:border-luxury-gold/20 hover:bg-zinc-900/40 hover:shadow-[0_12px_40px_rgba(212,175,55,0.04)] transition-all duration-300">
                  <div className="p-3 bg-luxury-gold/5 border border-luxury-gold/15 rounded-full text-luxury-gold shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="space-y-2 w-full">
                    <div className="flex justify-between items-start gap-4 mb-2 flex-col xl:flex-row xl:items-baseline">
                      <h4 className="text-xs text-white font-bold uppercase tracking-wider">{log.title}</h4>
                      <span className="text-[9px] text-luxury-gold border border-zinc-900 bg-zinc-950 px-2.5 py-0.5 rounded-md font-mono font-bold shrink-0">{log.price}</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-light">{log.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
