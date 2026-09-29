import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Trash2, FileDown, Plus, BarChart2, Search, X, Check, ArrowUpDown } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { jsPDF } from 'jspdf';
import { Link } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';

const EmptySlot = ({ cars, compareBasket, onAdd }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (carName) => {
    onAdd(carName);
    setIsOpen(false);
  };
  
  const availableCars = cars.filter(c => !compareBasket.some(cb => cb.name === c.name));
  
  const filteredCars = search.trim() === '' 
    ? availableCars 
    : availableCars.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.brand.toLowerCase().includes(search.toLowerCase())
      );

  return (
    <div className="border border-dashed border-zinc-800 hover:border-luxury-gold/30 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center h-full min-h-[460px] bg-zinc-950/20 transition-all duration-500 relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] pointer-events-none" />
      
      <div className="w-12 h-12 rounded-2xl bg-zinc-900/60 border border-zinc-850 flex items-center justify-center mb-4 group-hover:border-luxury-gold/20 transition-colors">
        <Plus className="w-5 h-5 text-zinc-500 group-hover:text-luxury-gold transition-colors" />
      </div>
      <span className="text-[10px] text-zinc-550 font-black uppercase tracking-widest block mb-5">Select Vehicle</span>
      
      {/* Dynamic search dropdown custom container */}
      <div className="relative w-full max-w-[220px] z-20">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-650" />
          <input 
            type="text" 
            placeholder="Search manufacturer..." 
            value={search}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
            className="w-full bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 rounded-full pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-luxury-gold/30 transition-all font-medium"
          />
          {isOpen && (
            <button 
              onClick={() => { setIsOpen(false); setSearch(''); }} 
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay blocker to close dropdown when clicking outside */}
              <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
              
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute left-0 right-0 mt-2 max-h-56 overflow-y-auto bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-2 shadow-2xl z-20 custom-scrollbar text-left"
              >
                {filteredCars.length > 0 ? (
                  filteredCars.map(c => (
                    <button
                      key={c.name}
                      onClick={() => handleSelect(c.name)}
                      className="w-full text-left px-3.5 py-2 hover:bg-white/5 rounded-xl text-xs text-zinc-300 hover:text-white transition-all flex items-center justify-between font-semibold"
                    >
                      <span className="truncate">{c.brand} {c.name}</span>
                      <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider shrink-0 ml-2">{c.specs.fuelType}</span>
                    </button>
                  ))
                ) : (
                  <div className="py-4 text-center text-[10px] text-zinc-600 uppercase tracking-wider font-bold">No results found</div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function Compare() {
  const { compareBasket, toggleCompare, cars, clearCompare, addNotification } = useContext(AppContext);

  const handleAddCar = (carName) => {
    if (!carName) return;
    const car = cars.find(c => c.name === carName);
    if (car) {
      toggleCompare(car);
    }
  };

  // Radar spec keys mapping
  const radarData = [
    { subject: 'Horsepower', fullMark: 1600 },
    { subject: 'Torque (lb-ft)', fullMark: 1200 },
    { subject: 'Top Speed (MPH)', fullMark: 280 },
    { subject: 'Battery Range (mi)', fullMark: 360 }
  ];

  const formattedRadarData = radarData.map(item => {
    const datObj = { subject: item.subject };
    compareBasket.forEach(car => {
      let val = 0;
      if (item.subject === 'Horsepower') val = car?.specs?.horsepower || 0;
      if (item.subject === 'Torque (lb-ft)') val = car?.specs?.torque || 0;
      if (item.subject === 'Top Speed (MPH)') val = car?.specs?.topSpeed || 0;
      if (item.subject === 'Battery Range (mi)') val = car?.specs?.batteryRange || 0;
      datObj[car.name] = val;
    });
    return datObj;
  });

  const calculateValueScore = (car) => {
    const hp = car?.specs?.horsepower || 0;
    const tq = car?.specs?.torque || 0;
    const spd = car?.specs?.topSpeed || 0;
    const price = Number(car.price) || 1;
    // Value score calculation
    const score = ((hp * 2) + tq + (spd * 5)) / (price / 1000);
    return score > 0 ? score.toFixed(1) : 'N/A';
  };

  const barData = compareBasket.map(car => ({
    name: car.name,
    Price: Number(car.price) || 0,
    ValueScore: parseFloat(calculateValueScore(car)) || 0
  }));

  const exportPDF = () => {
    if (compareBasket.length === 0) return;
    const doc = new jsPDF();
    
    // Theme details
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 210, 297, 'F');

    // Title
    doc.setTextColor(212, 175, 55); // gold
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('AETHERION MOTORS LUXURY', 20, 30);
    
    doc.setTextColor(229, 229, 229); // silver
    doc.setFontSize(10);
    doc.text('PRIVATE SPECIFICATION COMPARISON SHEET', 20, 38);
    doc.setDrawColor(212, 175, 55);
    doc.line(20, 42, 190, 42);

    let y = 60;
    compareBasket.forEach((car, idx) => {
      doc.setTextColor(212, 175, 55);
      doc.setFontSize(14);
      doc.text(`${idx + 1}. ${car.brand.toUpperCase()} ${car.name.toUpperCase()}`, 20, y);
      
      doc.setTextColor(180, 180, 180);
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      y += 8;
      doc.text(`Price: $${Number(car.price || 0).toLocaleString()}`, 25, y);
      doc.text(`Engine: ${car?.specs?.fuelType || 'N/A'}`, 110, y);
      y += 6;
      doc.text(`Horsepower: ${car?.specs?.horsepower || 0} HP`, 25, y);
      doc.text(`Torque: ${car?.specs?.torque || 0} lb-ft`, 110, y);
      y += 6;
      doc.text(`0-60 MPH: ${car?.specs?.acceleration || 'N/A'}`, 25, y);
      doc.text(`Top Speed: ${car?.specs?.topSpeed || 0} MPH`, 110, y);
      y += 6;
      if (car?.specs?.batteryRange > 0) {
        doc.text(`Battery Range: ${car?.specs?.batteryRange} miles`, 25, y);
        y += 6;
      }
      
      doc.setFont('Helvetica', 'italic');
      const features = car?.specs?.features || [];
      doc.text(`Bespoke Features: ${features.join(', ')}`, 25, y);
      y += 8;
      
      doc.setTextColor(212, 175, 55);
      doc.setFont('Helvetica', 'bold');
      doc.text(`PERFORMANCE VALUE INDEX: ${calculateValueScore(car)}`, 25, y);
      y += 12;
      
      doc.setDrawColor(44, 44, 44);
      doc.line(20, y - 4, 190, y - 4);
    });

    doc.save(`aetherion_motors_comparison.pdf`);
    addNotification('Bespoke comparison PDF downloaded successfully.', 'success');
  };

  const chartColors = ['#D4AF37', '#E5E5E5', '#3498DB', '#E74C3C'];

  return (
    <div className="bg-luxury-black text-luxury-silver min-h-screen pt-32 pb-20 font-sans selection:bg-luxury-gold selection:text-black relative">
      {/* Ambient background glows */}
      <div className="absolute top-24 left-1/4 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-zinc-900/60 pb-8">
          <div>
            <span className="text-luxury-gold text-xs tracking-[0.35em] font-semibold uppercase block mb-2">Matrix Evaluation</span>
            <h1 className="text-white text-4xl md:text-5xl font-serif tracking-wide leading-tight">Compare Showroom</h1>
            <p className="text-zinc-550 text-[11px] mt-2 flex items-center gap-2 uppercase tracking-widest font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
              Side-by-side performance benchmarking
            </p>
          </div>
          <div className="flex gap-2.5">
            {compareBasket.length > 0 && (
              <>
                <button
                  onClick={clearCompare}
                  className="px-5 py-3 border border-zinc-900 hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300"
                >
                  Clear All
                </button>
                <button
                  onClick={exportPDF}
                  className="px-5 py-3 bg-luxury-gold text-black rounded-xl hover:bg-white hover:text-black transition-all duration-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-luxury-gold/5"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Comparison Desk */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16 items-stretch">
          
          {/* Main comparison grid cards */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-stretch">
            <ErrorBoundary componentName="CarCards">
              {compareBasket.map((car) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={car.id || car.name}
                  className="bg-[#0a0a0a] rounded-[2rem] p-5 border border-zinc-900/80 flex flex-col justify-between relative group hover:border-luxury-gold/30 hover:shadow-[0_12px_40px_rgba(212,175,55,0.04)] hover:-translate-y-1.5 transition-all duration-500"
                >
                  <button
                    onClick={() => toggleCompare(car)}
                    className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-xl text-zinc-550 hover:text-red-400 hover:bg-red-500/10 transition-all z-10 border border-white/5"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="space-y-4">
                    <div className="h-44 rounded-2xl overflow-hidden bg-zinc-950/80 border border-zinc-900 group-hover:border-luxury-gold/15 transition-colors">
                      <img src={car.image} alt={car.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    </div>
                    <div className="px-1">
                      <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest block mb-0.5">{car.brand}</span>
                      <h3 className="text-white font-bold leading-tight group-hover:text-luxury-gold transition-colors">{car.name}</h3>
                    </div>

                    <ul className="text-[10px] space-y-3 text-zinc-400 border-t border-zinc-900/80 pt-4 px-1">
                      <li className="flex justify-between items-center pb-1.5 border-b border-zinc-900/40"><span className="text-zinc-650 font-bold">ACQUISITION</span><span className="text-luxury-gold font-bold">${Number(car.price || 0).toLocaleString()}</span></li>
                      <li className="flex justify-between items-center pb-1.5 border-b border-zinc-900/40"><span className="text-zinc-650 font-bold">POWER OUTPUT</span><span className="text-white font-semibold">{car?.specs?.horsepower || 0} HP</span></li>
                      <li className="flex justify-between items-center pb-1.5 border-b border-zinc-900/40"><span className="text-zinc-650 font-bold">TORQUE</span><span className="text-white font-semibold">{car?.specs?.torque || 0} LB-FT</span></li>
                      <li className="flex justify-between items-center pb-1.5 border-b border-zinc-900/40"><span className="text-zinc-650 font-bold">0-60 MPH</span><span className="text-white font-semibold">{car?.specs?.acceleration || 'N/A'}</span></li>
                      <li className="flex justify-between items-center pb-1.5 border-b border-zinc-900/40"><span className="text-zinc-650 font-bold">TOP SPEED</span><span className="text-white font-semibold">{car?.specs?.topSpeed || 0} MPH</span></li>
                      <li className="flex justify-between items-center pb-1.5 border-b border-zinc-900/40"><span className="text-zinc-650 font-bold">DRIVETRAIN</span><span className="text-white font-semibold">{car?.specs?.fuelType || 'N/A'}</span></li>
                      <li className="flex justify-between items-center pb-1.5 border-b border-zinc-900/40">
                        <span className="text-zinc-650 font-bold">EV RANGE</span>
                        <span className="text-white font-semibold">{(car?.specs?.batteryRange || 0) > 0 ? `${car?.specs?.batteryRange} MI` : 'N/A'}</span>
                      </li>
                      <li className="flex justify-between items-center pt-2 mt-2">
                        <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest">VALUE INDEX</span>
                        <span className="bg-luxury-gold text-black px-2.5 py-0.5 rounded-md font-black text-[9px] shadow-sm">{calculateValueScore(car)}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-5 border-t border-zinc-900 mt-5">
                    <Link
                      to={`/viewer3d?car=${encodeURIComponent(car.name)}`}
                      className="w-full text-center py-2.5 bg-zinc-905 hover:bg-luxury-gold text-zinc-400 hover:text-black border border-zinc-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:shadow-md hover:shadow-luxury-gold/5 transition-all duration-300 block"
                    >
                      3D Configurator
                    </Link>
                  </div>
                </motion.div>
              ))}
            </ErrorBoundary>

            {/* Empty Slots */}
            {Array.from({ length: 4 - compareBasket.length }).map((_, i) => (
              <EmptySlot key={i} cars={cars} compareBasket={compareBasket} onAdd={handleAddCar} />
            ))}
          </div>

          {/* Quick specs overview checklist */}
          <div className="lg:col-span-1 bg-[#0a0a0a] rounded-[2rem] p-6 border border-zinc-900/80 flex flex-col justify-center space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-luxury-gold/5 border border-luxury-gold/15 flex items-center justify-center shrink-0">
              <BarChart2 className="w-5 h-5 text-luxury-gold" />
            </div>
            <h3 className="text-white font-bold text-base tracking-wide">Specs Matrix</h3>
            <p className="text-[11px] text-zinc-550 leading-relaxed font-light">
              Evaluate performance metrics side-by-side. View custom radar graphs of engineering power, torque, top speed, and range output.
            </p>
          </div>
        </div>

        {/* Charts & Visualization Panel (Render only if items are compared) */}
        {compareBasket.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 1. Radar Chart Comparison */}
            <div className="bg-[#0a0a0a] rounded-[2.5rem] p-6 border border-zinc-900/80 relative overflow-hidden group hover:border-luxury-gold/20 transition-all duration-500">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 relative z-10">Performance Output Profile</h3>
              <div className="h-[380px] w-full relative z-10">
                <ErrorBoundary componentName="RadarChart">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedRadarData}>
                      <PolarGrid stroke="#2c2c2c" strokeOpacity={0.4} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#777', fontSize: 9, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#444', fontSize: 8 }} axisLine={false} />
                      
                      {compareBasket.map((car, idx) => (
                        <Radar
                          key={car.name}
                          name={car.name}
                          dataKey={car.name}
                          stroke={chartColors[idx % chartColors.length]}
                          strokeWidth={1.5}
                          fill={chartColors[idx % chartColors.length]}
                          fillOpacity={0.15}
                        />
                      ))}
                      <Legend wrapperStyle={{ fontSize: '9px', color: '#ccc', paddingTop: '20px' }} iconType="circle" />
                      <Tooltip contentStyle={{ backgroundColor: '#090909', border: '1px solid #1a1a1a', color: '#fff', fontSize: '10px', borderRadius: '12px', backdropFilter: 'blur(10px)' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </ErrorBoundary>
              </div>
            </div>

            {/* 2. Bar Chart pricing comparison */}
            <div className="bg-[#0a0a0a] rounded-[2.5rem] p-6 border border-zinc-900/80 relative overflow-hidden group hover:border-luxury-gold/20 transition-all duration-500">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 relative z-10">Acquisition Cost Comparison ($)</h3>
              <div className="h-[380px] w-full relative z-10">
                <ErrorBoundary componentName="BarChart">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" strokeOpacity={0.2} vertical={false} />
                      <XAxis dataKey="name" stroke="#444" tick={{ fill: '#777', fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis stroke="#444" tick={{ fill: '#777', fontSize: 9 }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        formatter={(value) => {
                          let numericVal = 0;
                          if (typeof value === 'number') numericVal = value;
                          else numericVal = Number(String(value).replace(/[^0-9.-]+/g,"")) || 0;
                          return [`$${numericVal.toLocaleString()}`, 'Price'];
                        }}
                        contentStyle={{ backgroundColor: '#090909', border: '1px solid #1a1a1a', color: '#fff', fontSize: '10px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                        cursor={{fill: 'rgba(255,255,255,0.015)'}}
                      />
                      <Bar dataKey="Price" fill="#D4AF37" radius={[6, 6, 0, 0]} barSize={35} />
                    </BarChart>
                  </ResponsiveContainer>
                </ErrorBoundary>
              </div>
            </div>

            {/* 3. Horizontal Bar Chart for Value Index */}
            <div className="bg-[#0a0a0a] rounded-[2.5rem] p-6 border border-zinc-900/80 lg:col-span-2 relative overflow-hidden group hover:border-luxury-gold/20 transition-all duration-500">
              <div className="flex justify-between items-end mb-6 relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Performance Value Index</h3>
                <span className="text-[9px] text-zinc-550 uppercase tracking-widest font-black">Higher = Better Value</span>
              </div>
              <div className="h-[280px] w-full relative z-10">
                <ErrorBoundary componentName="ValueChart">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" strokeOpacity={0.2} horizontal={false} />
                      <XAxis type="number" stroke="#444" tick={{ fill: '#777', fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#444" tick={{ fill: '#777', fontSize: 9 }} width={120} axisLine={false} tickLine={false} />
                      <Tooltip 
                        formatter={(value) => [value, 'Value Score']}
                        contentStyle={{ backgroundColor: '#090909', border: '1px solid #1a1a1a', color: '#fff', fontSize: '10px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                        cursor={{fill: 'rgba(255,255,255,0.015)'}}
                      />
                      <Bar dataKey="ValueScore" fill="#3498DB" radius={[0, 6, 6, 0]} barSize={25} />
                    </BarChart>
                  </ResponsiveContainer>
                </ErrorBoundary>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-12 text-[10px] text-zinc-550 font-black uppercase tracking-widest bg-zinc-950/10 border border-dashed border-zinc-900 rounded-3xl">
            Select vehicles above to display visual comparative charts.
          </div>
        )}

      </div>
    </div>
  );
}
