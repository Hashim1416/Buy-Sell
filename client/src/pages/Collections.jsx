import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Heart, BarChart3, Search, MapPin, Sparkles, ChevronRight, HelpCircle, Eye, Info, Car, X, ChevronDown, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { carBrands } from '../data/brandsData';

export default function Collections() {
  const { cars, toggleWishlist, toggleCompare, compareBasket } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();

  // View Mode: 'Vehicles' | 'Brands'
  const [viewMode, setViewMode] = useState('Vehicles'); 

  // Search & Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Brands specific
  const [brandSearch, setBrandSearch] = useState('');

  useEffect(() => {
    const searchVal = searchParams.get('search');
    const categoryVal = searchParams.get('category');
    const filterVal = searchParams.get('filter');

    setSearch(searchVal || '');
    
    if (filterVal === 'wishlist') {
      setCategory('Wishlist');
      setViewMode('Vehicles');
    } else if (categoryVal) {
      setCategory(categoryVal);
      setViewMode('Vehicles');
    } else {
      setCategory('All');
    }
  }, [searchParams]);

  const categories = [
    'All', 'Luxury Cars', 'Supercars', 'Sports Cars', 'EV Cars', 
    'Off-Road Cars', 'New and Futures Cars', 'Old Cars', 'Vintage Cars', 'Wishlist'
  ];

  const filteredCars = cars
    .filter(car => {
      const matchesSearch = car.name.toLowerCase().includes(search.toLowerCase()) ||
                            car.brand.toLowerCase().includes(search.toLowerCase());

      if (category === 'All') return matchesSearch;
      if (category === 'Wishlist') {
        return user?.wishlist?.includes(car.name) && matchesSearch;
      }
      return car.category.toLowerCase() === category.toLowerCase() && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'power-desc') return (b.specs.horsepower || 0) - (a.specs.horsepower || 0);
      if (sortBy === 'year-desc') return b.year - a.year;
      return 0;
    });

  const filteredBrands = carBrands.filter(b => 
    b.name.toLowerCase().includes(brandSearch.toLowerCase()) || 
    b.country.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const getBrandCarCount = (brandName) => {
    return cars.filter(car => car.brand.toLowerCase() === brandName.toLowerCase()).length;
  };

  const handleBrandClick = (brandName) => {
    setSearch(brandName);
    setCategory('All');
    setViewMode('Vehicles');
  };

  return (
    <div className="bg-luxury-black text-luxury-silver min-h-screen pt-32 pb-20 font-sans selection:bg-luxury-gold selection:text-black relative">
      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-zinc-900/60 pb-8">
          <div>
            <span className="text-luxury-gold text-xs tracking-[0.35em] font-semibold uppercase block mb-2">Aetherion Catalog</span>
            <h1 className="text-white text-4xl md:text-5xl font-serif tracking-wide leading-tight">Vehicle Collections</h1>
            <p className="text-zinc-550 text-[11px] mt-2 flex items-center gap-2 uppercase tracking-widest font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
              Discover standard-setting automotive engineering
            </p>
          </div>
          
          {/* Main View Mode Selector */}
          <div className="flex gap-1.5 bg-zinc-950/80 p-1 border border-zinc-900 rounded-2xl">
            <button 
              onClick={() => setViewMode('Vehicles')}
              className={`px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[9px] transition-all duration-300 ${
                viewMode === 'Vehicles' 
                  ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/10' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Vehicles
            </button>
            <button 
              onClick={() => setViewMode('Brands')}
              className={`px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[9px] transition-all duration-300 ${
                viewMode === 'Brands' 
                  ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/10' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Brands
            </button>
          </div>
        </div>

        {/* VEHICLES VIEW */}
        {viewMode === 'Vehicles' ? (
          <>
            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row justify-between gap-6 mb-10 items-center bg-[#070707] p-5 rounded-3xl border border-zinc-900/80 shadow-2xl">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                {categories.map(cat => {
                  const isActive = category === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap ${
                        isActive
                          ? 'bg-luxury-gold text-black shadow-md shadow-luxury-gold/5'
                          : 'bg-zinc-900/30 text-zinc-450 hover:text-zinc-200 border border-transparent'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Search & Sorting */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
                {/* Search */}
                <div className="relative w-full sm:w-60 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-650 group-focus-within:text-luxury-gold transition-colors" />
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-zinc-900/20 border border-zinc-900 rounded-full pl-11 pr-8 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold/30 placeholder-zinc-600 focus:bg-zinc-900/40 transition-all"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                
                {/* Sort */}
                <div className="relative w-full sm:w-auto min-w-[170px]">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="w-full bg-zinc-900/20 border border-zinc-900 rounded-full pl-4 pr-8 py-2.5 text-[10px] font-black text-zinc-400 focus:outline-none focus:border-luxury-gold/30 cursor-pointer uppercase tracking-widest transition-all appearance-none"
                  >
                    <option value="default" className="bg-[#0C0C0C]">Featured</option>
                    <option value="price-desc" className="bg-[#0C0C0C]">Price: High to Low</option>
                    <option value="price-asc" className="bg-[#0C0C0C]">Price: Low to High</option>
                    <option value="power-desc" className="bg-[#0C0C0C]">Performance: HP</option>
                    <option value="year-desc" className="bg-[#0C0C0C]">Release Year</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-550 mb-8 px-2">
              <p className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-luxury-gold" />
                Showing {filteredCars.length} luxury vehicle{filteredCars.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Dynamic Showroom Grid grouped by Category */}
            {filteredCars.length > 0 ? (
              <div className="space-y-20">
                {['Luxury Cars', 'Supercars', 'Sports Cars', 'EV Cars', 'Off-Road Cars', 'New and Futures Cars', 'Old Cars', 'Vintage Cars', 'Other'].map(catGroup => {
                  const catCars = catGroup === 'Other' 
                    ? filteredCars.filter(car => !['Luxury Cars', 'Supercars', 'Sports Cars', 'EV Cars', 'Off-Road Cars', 'New and Futures Cars', 'Old Cars', 'Vintage Cars'].includes(car.category))
                    : filteredCars.filter(car => car.category === catGroup);
                  
                  if (catCars.length === 0) return null;

                  return (
                    <div key={catGroup} className="space-y-8">
                      <div className="flex items-center gap-4">
                        <h2 className="text-sm md:text-base font-black uppercase tracking-[0.3em] text-white">
                          {catGroup}
                        </h2>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-zinc-800/80 to-transparent"></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {catCars.map(car => {
                          const isWishlisted = user?.wishlist?.includes(car.name);
                          const inCompare = compareBasket.some(c => c.name === car.name);
                          const hpPercent = Math.min((car.specs.horsepower / 1100) * 100, 100);
                          const speedPercent = Math.min((car.specs.topSpeed / 300) * 100, 100);

                          let subText = "The Definitive Grand Tourer";
                          if (car.brand === 'Ferrari') subText = "Active Hybrid Synergy Masterpiece";
                          if (car.brand === 'Mercedes-Benz') subText = "The Ultimate Chauffeur Experience";
                          if (car.brand === 'Cadillac') subText = "Track Tuned High-Performance Sedan";
                          if (car.brand === 'Rolls-Royce') subText = "Silent Electric Masterpiece Car";
                          if (car.brand === 'Porsche') subText = "Motorsport Engineering Road Car";

                          return (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              key={car.id || car.name}
                              className={`bg-[#0a0a0a] rounded-[2rem] p-5 border border-zinc-900/80 shadow-xl hover:shadow-[0_12px_40px_rgba(212,175,55,0.04)] transition-all duration-500 flex flex-col justify-between group relative hover:-translate-y-2 ${
                                isWishlisted ? 'border-red-500/10' : inCompare ? 'border-luxury-gold/15' : 'hover:border-luxury-gold/25'
                              }`}
                            >
                              {/* Top Image box */}
                              <div className="h-[210px] rounded-2xl overflow-hidden relative bg-[#020202] mb-5 border border-zinc-900 group-hover:border-luxury-gold/20 transition-colors duration-500">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none" />
                                
                                <img
                                  src={car.image}
                                  alt={car.name}
                                  loading="lazy"
                                  className="w-full h-full object-cover transform scale-[1.01] group-hover:scale-105 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-105"
                                />
                                <div className="absolute top-4 right-4 flex gap-2 z-20">
                                  <button
                                    onClick={() => toggleWishlist(car.name)}
                                    className={`w-9 h-9 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all ${
                                      isWishlisted 
                                        ? 'bg-red-500/90 border-red-500/25 text-white shadow-md' 
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

                              {/* Bottom Row */}
                              <div className="flex justify-between items-end border-t border-zinc-900 pt-4 mt-2">
                                <div>
                                  <span className="text-[8px] text-zinc-550 block font-black uppercase tracking-widest mb-0.5">STARTING AT</span>
                                  <span className="text-luxury-gold text-base font-black font-mono">${car.price.toLocaleString()}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="border border-zinc-900 bg-zinc-950/60 rounded-lg px-2.5 py-1.5 text-[8px] text-zinc-400 uppercase tracking-wider font-black">
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
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-24 border border-dashed border-zinc-900 rounded-3xl bg-zinc-950/20">
                <h3 className="text-white text-base font-bold mb-2">No Matching Vehicles</h3>
                <p className="text-zinc-500 text-xs mb-6">Try searching for something else or clearing filters.</p>
                <button
                  onClick={() => { setSearch(''); setCategory('All'); }}
                  className="text-xs text-luxury-gold hover:text-black transition-all font-bold uppercase tracking-wider border border-zinc-800 hover:bg-luxury-gold hover:border-luxury-gold px-6 py-3 rounded-xl"
                >
                  Reset Catalog
                </button>
              </div>
            )}
          </>
        ) : (
          /* BRANDS NETWORK VIEW */
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-[#070707] border border-zinc-900/80 rounded-2xl p-4">
              <div>
                <p className="text-xs text-white font-bold uppercase tracking-widest">Global Network</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{filteredBrands.length} partner brands active in database</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-550" />
                <input
                  type="text"
                  placeholder="Search brand or origin..."
                  value={brandSearch}
                  onChange={e => setBrandSearch(e.target.value)}
                  className="w-full bg-zinc-900/20 border border-zinc-900 rounded-full pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold/30 placeholder-zinc-600 transition-all focus:bg-zinc-900/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredBrands.map((brand, idx) => {
                const count = getBrandCarCount(brand.name);
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.02, 0.2) }}
                    key={idx}
                    onClick={() => count > 0 && handleBrandClick(brand.name)}
                    className={`group relative bg-[#0a0a0a] border border-zinc-900/80 rounded-2xl p-5 flex flex-col items-center justify-between text-center min-h-[190px] transition-all duration-300 ${
                      count > 0 
                        ? 'cursor-pointer hover:border-luxury-gold/30 hover:shadow-[0_8px_32px_rgba(212,175,55,0.05)] hover:-translate-y-2' 
                        : 'opacity-65'
                    }`}
                  >
                    {/* Ambient light ring on hover */}
                    {count > 0 && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-luxury-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none rounded-2xl" />
                    )}

                    {/* Logo container */}
                    <div className="w-16 h-16 rounded-2xl bg-zinc-950 flex items-center justify-center p-2.5 border border-zinc-900/80 group-hover:border-zinc-800 transition-colors mb-3">
                      {brand.logo ? (
                        <img 
                          src={brand.logo} 
                          alt={brand.name} 
                          className="w-full h-full object-contain filter brightness-90 group-hover:brightness-110 group-hover:scale-105 transition-all duration-500"
                          onError={(e) => { e.target.style.display = 'none'; }} 
                        />
                      ) : (
                        <Car className="w-6 h-6 text-zinc-700" />
                      )}
                    </div>

                    {/* Name + Country info */}
                    <div className="space-y-0.5">
                      <h3 className="text-white text-xs font-bold uppercase tracking-widest group-hover:text-luxury-gold transition-colors">
                        {brand.name}
                      </h3>
                      <p className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider flex items-center gap-1 justify-center">
                        <MapPin className="w-2.5 h-2.5 text-luxury-gold" /> {brand.country}
                      </p>
                    </div>

                    {/* Footer count indicator */}
                    <div className="mt-4 pt-3.5 border-t border-zinc-900 w-full flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest">
                      {count > 0 ? (
                        <>
                          <span className="text-luxury-gold font-mono">{count}</span> 
                          <span className="text-zinc-500">Models</span>
                          <ChevronRight className="w-3 h-3 text-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                        </>
                      ) : (
                        <span className="text-zinc-650 font-bold">Coming Soon</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {filteredBrands.length === 0 && (
              <div className="text-center py-24 border border-dashed border-zinc-900 rounded-3xl bg-zinc-950/20">
                <h3 className="text-white text-base font-bold mb-2">No Matching Brands Found</h3>
                <p className="text-zinc-500 text-xs mb-6">Verify spelling or search for another region.</p>
                <button
                  onClick={() => setBrandSearch('')}
                  className="text-xs text-luxury-gold hover:text-black transition-all font-bold uppercase tracking-wider border border-zinc-800 hover:bg-luxury-gold hover:border-luxury-gold px-6 py-3 rounded-xl shadow-inner"
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
