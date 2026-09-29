import React from 'react';
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our private catalog updates.');
  };

  return (
    <footer className="bg-[#050505] text-zinc-450 border-t border-zinc-900 transition-colors duration-300 font-sans relative overflow-hidden">
      
      {/* Visual top border glow */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-luxury-gold/50 to-transparent" />

      {/* SECTION 1: Grand Brand Header & Flagship Offices */}
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeInUp}
        className="max-w-7xl mx-auto px-6 pt-24 pb-12 border-b border-zinc-900 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
      >
        
        {/* Brand statement */}
        <div className="lg:col-span-6 space-y-6">
          <Link to="/" className="flex flex-col items-start gap-1 group">
            <span className="text-2xl md:text-3xl font-bold tracking-[0.2em] text-white font-serif transition-colors group-hover:text-luxury-gold">
              AETHERION MOTORS
            </span>
            <span className="font-sans text-[9px] tracking-[0.4em] uppercase text-zinc-500 font-bold group-hover:text-white transition-colors">
              AUTOMOTIVE LUXURY GROUP
            </span>
          </Link>
          <p className="text-xs text-zinc-400 max-w-xl leading-relaxed font-light">
            Serving as the primary international catalog broker for rare hypercars, classic collector assets, and high-performance electric vehicles. We coordinate enclosed secure delivery, tax-structured corporate acquisition plans, and absolute private showroom consultations.
          </p>
        </div>

        {/* Global Flags List */}
        <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-[9px] uppercase font-black tracking-widest text-zinc-550">
          <div className="space-y-1.5 hover:text-luxury-gold transition-colors duration-300">
            <span className="text-white block font-serif text-[11px] tracking-wider normal-case drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Beverly Hills Flagship</span>
            <p className="text-[9px] font-sans font-light normal-case text-zinc-400">710 N Beverly Dr, CA 90210</p>
          </div>
          <div className="space-y-1.5 hover:text-luxury-gold transition-colors duration-300">
            <span className="text-white block font-serif text-[11px] tracking-wider normal-case drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Munich Flagship</span>
            <p className="text-[9px] font-sans font-light normal-case text-zinc-400">Maximilianstraße 12, 80539</p>
          </div>
          <div className="space-y-1.5 hover:text-luxury-gold transition-colors duration-300">
            <span className="text-white block font-serif text-[11px] tracking-wider normal-case drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Tokyo Flagship</span>
            <p className="text-[9px] font-sans font-light normal-case text-zinc-400">2-chōme Ginza, 104-0061</p>
          </div>
          <div className="space-y-1.5 hover:text-luxury-gold transition-colors duration-300">
            <span className="text-white block font-serif text-[11px] tracking-wider normal-case drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">London Flagship</span>
            <p className="text-[9px] font-sans font-light normal-case text-zinc-400">15 Berkeley Sq, W1J 6EG</p>
          </div>
        </div>

      </motion.div>

      {/* SECTION 2: Comprehensive Directory Columns */}
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeInUp}
        className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-2 md:grid-cols-4 gap-12 border-b border-zinc-900"
      >
        
        {/* Col 1: Vault Catalog */}
        <div className="space-y-4">
          <h4 className="font-sans text-white tracking-[0.2em] text-[10px] font-black uppercase">Showroom Vault</h4>
          <ul className="space-y-2 text-xs font-semibold text-zinc-450">
            <li><Link to="/collections?category=Supercars" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">Supercars Collection</Link></li>
            <li><Link to="/collections?category=Sports Cars" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">Sports Cars Collection</Link></li>
            <li><Link to="/collections?category=EV Cars" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">EV Autonomy Collection</Link></li>
            <li><Link to="/collections?category=Off-Road Cars" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">All-Terrain Collection</Link></li>
            <li><Link to="/compare" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">Comparative Evaluation Matrix</Link></li>
            <li><Link to="/viewer3d" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">3D Configurator Studio</Link></li>
          </ul>
        </div>

        {/* Col 2: Customization & Care */}
        <div className="space-y-4">
          <h4 className="font-sans text-white tracking-[0.2em] text-[10px] font-black uppercase">Bespoke Services</h4>
          <ul className="space-y-2 text-xs font-semibold text-zinc-450">
            <li><Link to="/services" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">Paint Protection Film (PPF)</Link></li>
            <li><Link to="/services" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">Ceramic Glass Coating</Link></li>
            <li><Link to="/services" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">Bespoke Wrap Studio</Link></li>
            <li><Link to="/services" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">Carbon Aerodynamics Kits</Link></li>
            <li><Link to="/trade" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">Trade Valuation Engine</Link></li>
            <li><Link to="/scheduler?type=VIP Meeting" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">VIP Consultation Scheduler</Link></li>
          </ul>
        </div>

        {/* Col 3: Historic Brands */}
        <div className="space-y-4">
          <h4 className="font-sans text-white tracking-[0.2em] text-[10px] font-black uppercase">Manufacturers</h4>
          <ul className="space-y-2 text-xs font-semibold text-zinc-450">
            <li><Link to="/brands?brand=Ferrari" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">Ferrari Heritage</Link></li>
            <li><Link to="/brands?brand=Lamborghini" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">Lamborghini Automobili</Link></li>
            <li><Link to="/brands?brand=Porsche" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">Porsche engineering</Link></li>
            <li><Link to="/brands?brand=Rolls-Royce" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">Rolls-Royce Motor Cars</Link></li>
            <li><Link to="/brands?brand=Bentley" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">Bentley Motors</Link></li>
            <li><Link to="/brands?brand=Koenigsegg" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">Koenigsegg Automotive</Link></li>
          </ul>
        </div>

        {/* Col 4: Corporate Concierge */}
        <div className="space-y-4">
          <h4 className="font-sans text-white tracking-[0.2em] text-[10px] font-black uppercase">Concierge Info</h4>
          <ul className="space-y-2 text-xs font-semibold text-zinc-450">
            <li><Link to="/login" className="hover:text-luxury-gold transition-all duration-300 text-luxury-gold block">Showcase Portal</Link></li>
            <li><a href="#" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">Corporate Governance</a></li>
            <li><a href="#" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">Tax Optimization advisory</a></li>
            <li><a href="#" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">Press & Media Assets</a></li>
            <li><a href="#" className="hover:text-luxury-gold hover:translate-x-1 transition-all duration-300 block">Private Careers Portal</a></li>
          </ul>
        </div>

      </motion.div>

      {/* SECTION 3: Operating Hours, Support Contacts & Google Maps embed */}
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeInUp}
        className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
      >
        
        {/* Support & Contacts Info */}
        <div className="lg:col-span-5 space-y-6">
          <h4 className="font-sans text-white tracking-[0.2em] text-[10px] font-black uppercase">Showroom Operations</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs font-sans">
            <div className="space-y-3 font-semibold">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-luxury-gold drop-shadow-[0_0_5px_rgba(212,175,55,0.4)]" />
                <span className="font-black text-zinc-200 uppercase tracking-widest text-[9px]">Operating Hours</span>
              </div>
              <div className="text-zinc-500 space-y-0.5 text-[11px]">
                <p>Mon – Fri: 09:00 AM – 08:00 PM</p>
                <p>Saturday: 10:00 AM – 10:00 PM</p>
                <p className="text-red-500/80 font-bold uppercase tracking-wider text-[9px] pt-1">Sunday: Closed for showings</p>
              </div>
            </div>
            
            <div className="space-y-3 font-semibold">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-luxury-gold drop-shadow-[0_0_5px_rgba(212,175,55,0.4)]" />
                <span className="font-black text-zinc-200 uppercase tracking-widest text-[9px]">Private Assistance</span>
              </div>
              <div className="flex flex-col gap-1 text-[11px] uppercase tracking-widest text-zinc-450">
                <p className="text-luxury-gold font-bold transition-all hover:text-white cursor-pointer">concierge@aetherionmotors.com</p>
                <p className="text-zinc-500">+1 (800) LUX-AUTO</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full max-w-sm group">
              <input
                type="email"
                required
                placeholder="Secure Newsletter Signup"
                className="flex-1 bg-zinc-900/20 border border-zinc-905 focus:border-luxury-gold/30 rounded-full px-5 py-2.5 text-xs text-white focus:outline-none placeholder-zinc-600 transition-all focus:bg-zinc-900/30"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-luxury-gold hover:bg-white text-black rounded-full transition-all duration-300 flex items-center justify-center shrink-0 shadow-md shadow-luxury-gold/5"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Map Viewport Area */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="font-sans text-white tracking-[0.2em] text-[10px] font-black uppercase mb-4">Showroom Location Map</h4>
          <div className="rounded-2xl border border-zinc-900 p-1 bg-zinc-950/40">
            <div className="w-full h-56 rounded-xl overflow-hidden shadow-2xl relative bg-zinc-950">
              <iframe 
                title="Showroom Location Large Extended"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3304.5982855146036!2d-118.404289824282!3d34.07977467314545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04b68ddfb9%3A0x892a0df8d4ef43d3!2sBeverly%20Hills%20Showroom!5e0!3m2!1sen!2sus!4v1717436021234!5m2!1sen!2sus"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                className="filter opacity-70 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
              ></iframe>
            </div>
          </div>
        </div>

      </motion.div>

      {/* SECTION 4: Bottom Legal Information */}
      <div className="bg-[#020202] py-8 border-t border-zinc-900 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-zinc-600 tracking-widest font-bold">
          <div className="flex gap-6">
            <a href="#" className="text-zinc-600 hover:text-luxury-gold transition-all"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="text-zinc-600 hover:text-luxury-gold transition-all"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="text-zinc-600 hover:text-luxury-gold transition-all"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-zinc-600 hover:text-luxury-gold transition-all"><Linkedin className="w-5 h-5" /></a>
          </div>
          <p className="opacity-60">&copy; {new Date().getFullYear()} AETHERION MOTORS LUXURY GROUP. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4 text-[9px] font-black uppercase">
            <a href="#" className="text-zinc-550 hover:text-white transition">PRIVACY POLICY</a>
            <span className="text-zinc-800">|</span>
            <a href="#" className="text-zinc-550 hover:text-white transition">TERMS OF SERVICE</a>
            <span className="text-zinc-800">|</span>
            <a href="#" className="text-zinc-550 hover:text-white transition">LEGAL COMPLIANCE</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
