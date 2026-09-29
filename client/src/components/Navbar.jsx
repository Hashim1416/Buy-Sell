import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, LogOut, Heart, BarChart3, ShoppingCart, User, ChevronDown, Calendar, ShieldCheck, HelpCircle, Compass, Menu, X, Home, LayoutGrid, ShoppingBag, GitCompareArrows, Zap, Tag, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme, compareBasket, cartCount } = useContext(AppContext);
  
  const [showServices, setShowServices] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home',       path: '/',            icon: Home },
    { name: 'Collection', path: '/collections',  icon: LayoutGrid },
    { name: 'Store',      path: '/store',        icon: ShoppingBag },
    { name: 'Compare',    path: '/compare',      icon: GitCompareArrows },
    { name: 'EV Hub',     path: '/evhub',        icon: Zap },
    { name: 'Brands',     path: '/brands',       icon: Tag },
  ];

  const serviceItems = [
    { name: 'Test Drive', path: '/scheduler?type=Test Drive', desc: 'Experience luxury on road', icon: <Compass className="w-4 h-4 text-luxury-gold" /> },
    { name: 'Service & Care', path: '/services', desc: 'Expert bespoke maintenance', icon: <ShieldCheck className="w-4 h-4 text-luxury-gold" /> },
    { name: 'Car Booking', path: '/scheduler?type=Vehicle Purchase Consultation', desc: 'Reserve custom builds', icon: <Calendar className="w-4 h-4 text-luxury-gold" /> },
    { name: 'VIP Meeting', path: '/scheduler?type=VIP Meeting', desc: 'One-on-one consultation', icon: <HelpCircle className="w-4 h-4 text-luxury-gold" /> }
  ];

  return (
    <motion.nav 
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#050505]/80 dark:bg-[#050505]/80 light:bg-white/80 backdrop-blur-xl border-b border-white/5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.3)]' 
          : 'bg-transparent border-transparent py-5'
      } px-6 md:px-12`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Branding */}
        <Link to="/" className="flex flex-col items-start gap-0.5 shrink-0 group">
          <span className="font-serif text-base md:text-lg font-extrabold tracking-[0.25em] text-white transition-all group-hover:text-luxury-gold">
            AETHERION <span className="text-luxury-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">MOTORS</span>
          </span>
          <span className="font-sans text-[7px] md:text-[8px] tracking-[0.4em] uppercase text-zinc-500 font-bold group-hover:text-white transition-all">
            AUTOMOTIVE <span className="text-luxury-gold">LUXURY</span>
          </span>
        </Link>

        {/* Central Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2 justify-center flex-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.name === 'Store' && location.pathname.startsWith('/store'));
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative group flex flex-col items-center gap-1 px-3 xl:px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#D4AF37]/8 border border-[#D4AF37]/20'
                    : 'border border-transparent hover:bg-white/4 hover:border-white/6'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors duration-200 ${
                  isActive ? 'text-[#D4AF37]' : 'text-zinc-500 group-hover:text-white'
                }`} />
                <span className={`text-[9px] uppercase tracking-widest font-black transition-colors duration-200 ${
                  isActive ? 'text-[#D4AF37]' : 'text-zinc-500 group-hover:text-white'
                }`}>
                  {link.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="absolute bottom-1 left-3 right-3 h-[2px] rounded-full bg-[#D4AF37]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* Services Megamenu Trigger */}
          <div 
            className="relative"
            onMouseEnter={() => setShowServices(true)}
            onMouseLeave={() => setShowServices(false)}
          >
            <button className={`group flex flex-col items-center gap-1 px-3 xl:px-4 py-2 rounded-xl border border-transparent hover:bg-white/4 hover:border-white/6 transition-all duration-200`}>
              <div className="flex items-center gap-1">
                <Layers className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors duration-200" />
                <ChevronDown className={`w-3 h-3 text-zinc-500 group-hover:text-white transition-all duration-200 ${showServices ? 'rotate-180' : ''}`} />
              </div>
              <span className="text-[9px] uppercase tracking-widest font-black text-zinc-500 group-hover:text-white transition-colors duration-200">Services</span>
            </button>

            <AnimatePresence>
              {showServices && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl bg-[#090909]/95 border border-zinc-900 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col gap-1.5"
                >
                  {serviceItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all group/item"
                    >
                      <span className="p-1.5 rounded-lg bg-zinc-950/80 border border-zinc-900 group-hover/item:border-luxury-gold/30 transition-colors">
                        {item.icon}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-white group-hover/item:text-luxury-gold transition-colors">{item.name}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Actions Block (Desktop) */}
        <div className="hidden lg:flex items-center gap-5 shrink-0">
          
          {/* Compare Capsule */}
          <Link 
            to="/compare" 
            className="relative p-2 text-zinc-450 hover:text-white transition-all hover:scale-105"
            title="Compare Vehicles"
          >
            <BarChart3 className="w-5 h-5" />
            {compareBasket?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-luxury-gold text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {compareBasket.length}
              </span>
            )}
          </Link>

          {/* Wishlist Capsule */}
          <Link 
            to="/collections?filter=wishlist" 
            className="relative p-2 text-zinc-450 hover:text-white transition-all hover:scale-105" 
            title="My Wishlist"
          >
            <Heart className="w-5 h-5" />
            {user?.wishlist?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {user.wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Icon Link (Live Cart Count) */}
          <Link 
            to="/store?cart=open" 
            className="relative p-2 text-zinc-450 hover:text-white transition-all hover:scale-105"
            title="Your Store Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-luxury-gold text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          <span className="h-4 w-[1px] bg-zinc-800" />

          {/* Admin link */}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 hover:text-white px-3.5 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition"
            >
              Admin
            </Link>
          )}


          {/* User Account / Login */}
          {user ? (
            <div 
              className="relative"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <button className="flex items-center gap-2 p-1 pl-2.5 pr-1 rounded-full bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all">
                <span className="text-[10px] font-bold text-zinc-300 max-w-[80px] truncate">{user.name || user.email}</span>
                <div className="w-6 h-6 rounded-full bg-luxury-gold text-black flex items-center justify-center text-[10px] font-black uppercase">
                  {user.name ? user.name[0] : 'U'}
                </div>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl bg-[#090909] border border-zinc-900 p-2 shadow-xl backdrop-blur-xl flex flex-col gap-1"
                  >

                    {user && user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full text-left text-xs text-luxury-gold hover:bg-luxury-gold/10 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 font-bold uppercase tracking-wider"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-xs text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 font-bold uppercase tracking-wider"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-[10px] uppercase tracking-widest font-black bg-white text-black px-5 py-2 rounded-full hover:bg-zinc-200 transition-colors shadow-md hover:shadow-white/5"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Action */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-405 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#090909]/98 border-t border-zinc-900 p-6 space-y-5 mt-4 text-left shadow-2xl overflow-hidden rounded-2xl"
          >
            <div className="grid grid-cols-3 gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.name === 'Store' && location.pathname.startsWith('/store'));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border font-bold transition-all ${
                      isActive
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]'
                        : 'bg-zinc-950/60 border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[9px] uppercase tracking-widest">{link.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="h-[1px] w-full bg-zinc-900" />

            {/* Services list */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 pl-2">Our Services</p>
              <div className="space-y-1">
                {serviceItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 text-xs text-zinc-400 hover:text-white transition py-2 pl-3 rounded-lg hover:bg-white/5"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="h-[1px] w-full bg-zinc-900" />

            {/* User credentials / Profile actions */}
            <div className="flex justify-between items-center text-xs">
              <Link to="/compare" onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-white flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-luxury-gold" /> Compare ({compareBasket.length})
              </Link>
              <Link to="/collections?filter=wishlist" onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-white flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-red-500" /> Wishlist ({user?.wishlist?.length || 0})
              </Link>
            </div>

            <div className="border-t border-zinc-900 pt-4 flex flex-col gap-3">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-luxury-gold text-black flex items-center justify-center text-[10px] font-black uppercase">
                        {user.name ? user.name[0] : 'U'}
                      </div>
                      <span className="text-xs font-bold text-zinc-300 max-w-[120px] truncate">{user.name || user.email}</span>
                    </div>
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="text-[11px] font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-2.5 rounded-xl border border-luxury-gold/30 bg-luxury-gold/5 text-luxury-gold text-xs font-black uppercase tracking-widest block transition-all"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest shadow-md"
                >
                  Login Terminal
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
