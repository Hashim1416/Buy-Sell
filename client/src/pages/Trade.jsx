import React, { useState } from 'react';
import { DollarSign, Landmark, ShieldCheck, Milestone, CalendarRange, Plus } from 'lucide-react';

export default function Trade() {
  const [activeTab, setActiveTab] = useState('valuation'); // valuation, finance

  const carDatabase = {
    'Lamborghini': ['Huracan', 'Aventador', 'Urus'],
    'Ferrari': ['F8 Tributo', 'SF90 Stradale', 'Roma'],
    'Porsche': ['911 GT3', 'Taycan', 'Panamera'],
    'Rolls-Royce': ['Phantom', 'Cullinan', 'Ghost'],
    'BMW': ['M4 Competition', 'M5 CS', 'XM'],
    'Mercedes-Benz': ['G63 AMG', 'S-Class', 'AMG GT'],
    'Cadillac': ['CT5-V Blackwing', 'Escalade V'],
    'McLaren': ['720S', 'Artura', 'P1'],
    'Bugatti': ['Chiron', 'Veyron', 'Bolide'],
    'Aston Martin': ['DB11', 'Vantage', 'DBS Superleggera']
  };

  // Valuation Estimator States
  const [valBrand, setValBrand] = useState('Lamborghini');
  const [valModel, setValModel] = useState(carDatabase['Lamborghini'][0]);
  const [valYear, setValYear] = useState(2021);
  const [valMileage, setValMileage] = useState(12000);
  const [valCondition, setValCondition] = useState('excellent'); // excellent, good, fair
  const [estimatedValue, setEstimatedValue] = useState(null);
  
  // Inquiry State
  const [inquirySent, setInquirySent] = useState(false);

  // Finance Calculator States
  const [vehiclePrice, setVehiclePrice] = useState(250000);
  const [downPayment, setDownPayment] = useState(50000);
  const [interestRate, setInterestRate] = useState(5.5); // %
  const [loanTerm, setLoanTerm] = useState(60); // months

  // Execute Valuation Calculation
  const calculateValuation = (e) => {
    e.preventDefault();
    let baseVal = 200000; // Base Huracan / luxury baseline

    // Adjust based on brand index
    if (valBrand === 'Ferrari') baseVal = 240000;
    if (valBrand === 'Rolls-Royce') baseVal = 280000;
    if (valBrand === 'Porsche') baseVal = 140000;
    if (valBrand === 'BMW') baseVal = 70000;

    // Depreciation based on age
    const age = new Date().getFullYear() - valYear;
    const deprAgeFactor = Math.max(1 - age * 0.07, 0.3);

    // Depreciation based on mileage
    const deprMileageFactor = Math.max(1 - (valMileage / 100000) * 0.25, 0.4);

    // Condition modifier
    let condMod = 1.0;
    if (valCondition === 'good') condMod = 0.9;
    if (valCondition === 'fair') condMod = 0.75;

    const computedVal = Math.round(baseVal * deprAgeFactor * deprMileageFactor * condMod);
    setEstimatedValue(computedVal);
  };

  // Execute Finance Calculation
  const principal = vehiclePrice - downPayment;
  const monthlyInterestRate = interestRate / 100 / 12;
  const emi = monthlyInterestRate > 0 
    ? (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) / (Math.pow(1 + monthlyInterestRate, loanTerm) - 1)
    : principal / loanTerm;

  const totalPayment = emi * loanTerm;
  const totalInterest = totalPayment - principal;

  return (
    <div className="bg-luxury-black text-luxury-silver min-h-screen pt-32 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-zinc-900 pb-8">
          <div>
            <span className="text-luxury-gold text-xs tracking-[0.35em] font-semibold uppercase block mb-1">Financial Services</span>
            <h1 className="text-white typography-section-title">Offers & Trade-In Desk</h1>
          </div>
          <p className="text-xs text-zinc-500 max-w-sm font-light leading-relaxed">
            Acquire custom trade values and bespoke financing programs tailored to your portfolio configurations.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="inline-flex bg-black/40 border border-white/5 p-1.5 rounded-full gap-2 mb-12 text-[10px] font-bold uppercase tracking-widest relative z-10">
          <button
            onClick={() => setActiveTab('valuation')}
            className={`px-6 py-3 rounded-full transition-all duration-300 ${activeTab === 'valuation' ? 'bg-luxury-gold text-black shadow-lg' : 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5'}`}
          >
            Vehicle Valuation
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className={`px-6 py-3 rounded-full transition-all duration-300 ${activeTab === 'finance' ? 'bg-luxury-gold text-black shadow-lg' : 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5'}`}
          >
            EMI Finance Calculator
          </button>
        </div>

        {/* Tab content panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main calculators space */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'valuation' ? (
              
              // 1. Valuation form
              <div className="glass-card rounded-[2.5rem] p-6 md:p-8 border border-white/5 space-y-6 group hover:border-luxury-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <Milestone className="w-5 h-5 text-luxury-gold" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-300">Valuation Estimator</h3>
                </div>

                <form onSubmit={calculateValuation} className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold text-zinc-400">
                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider uppercase text-zinc-500 ml-1">Manufacturer</label>
                    <select 
                      value={valBrand} 
                      onChange={e => {
                        setValBrand(e.target.value);
                        setValModel(carDatabase[e.target.value][0]);
                      }}
                      className="w-full bg-black/40 border border-white/5 rounded-full px-5 py-2.5 text-white focus:outline-none focus:border-luxury-gold/50 appearance-none transition-colors"
                    >
                      {Object.keys(carDatabase).map(brand => (
                        <option key={brand} value={brand} className="bg-[#0C0C0C]">{brand}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider uppercase text-zinc-500 ml-1">Model Name</label>
                    <select
                      required
                      value={valModel}
                      onChange={e => setValModel(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-full px-5 py-2.5 text-white focus:outline-none focus:border-luxury-gold/50 appearance-none transition-colors"
                    >
                      {carDatabase[valBrand].map(model => (
                        <option key={model} value={model} className="bg-[#0C0C0C]">{model}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider uppercase text-zinc-500 ml-1">Release Year</label>
                    <input
                      type="number"
                      required
                      value={valYear}
                      onChange={e => setValYear(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/5 rounded-full px-5 py-2.5 text-white focus:outline-none focus:border-luxury-gold/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider uppercase text-zinc-500 ml-1">Current Odometer (miles)</label>
                    <input
                      type="number"
                      required
                      value={valMileage}
                      onChange={e => setValMileage(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/5 rounded-full px-5 py-2.5 text-white focus:outline-none focus:border-luxury-gold/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="block text-[10px] tracking-wider uppercase text-zinc-500 ml-1">Mechanical & Cosmetic State</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'excellent', label: 'Excellent' },
                        { id: 'good', label: 'Good' },
                        { id: 'fair', label: 'Fair' }
                      ].map(cond => (
                        <button
                          key={cond.id}
                          type="button"
                          onClick={() => setValCondition(cond.id)}
                          className={`py-2.5 px-2 border rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 text-center ${
                            valCondition === cond.id ? 'bg-luxury-gold text-black border-luxury-gold' : 'border-white/5 text-zinc-400 bg-transparent hover:bg-white/5'
                          }`}
                        >
                          {cond.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2 pt-4">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-luxury-gold hover:bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                    >
                      Calculate Valuation Quote
                    </button>
                  </div>
                </form>

                {estimatedValue !== null && (
                  <div className="border-t border-white/5 pt-6 text-center bg-black/20 p-6 rounded-[2rem] border border-white/5 mt-4">
                    <span className="text-[10px] text-zinc-500 block font-bold uppercase tracking-wider mb-1">Estimated Acquisition Value</span>
                    <span className="text-luxury-gold typography-price-text">${estimatedValue.toLocaleString()}</span>
                    <p className="text-[9px] text-zinc-550 mt-2 font-light">This is a certified showroom quote valid for trade-in transactions over 14 business days.</p>
                  </div>
                )}

              </div>

            ) : (

              // 2. Finance EMI calculator
              <div className="glass-card rounded-[2.5rem] p-6 md:p-8 border border-white/5 space-y-6 group hover:border-luxury-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <Landmark className="w-5 h-5 text-luxury-gold" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-300">EMI Finance Calculator</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold text-zinc-400">
                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider uppercase text-zinc-500 ml-1">Vehicle Base Price ($)</label>
                    <input
                      type="number"
                      value={vehiclePrice}
                      onChange={e => setVehiclePrice(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/5 rounded-full px-5 py-2.5 text-white focus:outline-none focus:border-luxury-gold/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider uppercase text-zinc-500 ml-1">Down Payment ($)</label>
                    <input
                      type="number"
                      value={downPayment}
                      onChange={e => setDownPayment(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/5 rounded-full px-5 py-2.5 text-white focus:outline-none focus:border-luxury-gold/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider uppercase text-zinc-500 ml-1">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={e => setInterestRate(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/5 rounded-full px-5 py-2.5 text-white focus:outline-none focus:border-luxury-gold/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider uppercase text-zinc-500 ml-1">Loan Term (months)</label>
                    <select
                      value={loanTerm}
                      onChange={e => setLoanTerm(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/5 rounded-full px-5 py-2.5 text-white font-semibold focus:outline-none focus:border-luxury-gold/50 transition-colors appearance-none"
                    >
                      <option value={36}>36 Months (3 Years)</option>
                      <option value={48}>48 Months (4 Years)</option>
                      <option value={60}>60 Months (5 Years)</option>
                      <option value={72}>72 Months (6 Years)</option>
                    </select>
                  </div>
                </div>

                {/* Finance Results */}
                <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6 text-center text-[10px] font-sans text-zinc-400 mt-4 relative z-10">
                  <div className="bg-black/30 p-4 rounded-[1.5rem] border border-white/5">
                    <span className="block text-zinc-550 uppercase tracking-wider mb-1">Monthly Payment</span>
                    <span className="text-white font-bold text-sm">${Math.round(emi).toLocaleString()}</span>
                  </div>
                  <div className="bg-black/30 p-4 rounded-[1.5rem] border border-white/5">
                    <span className="block text-zinc-550 uppercase tracking-wider mb-1">Total Interest</span>
                    <span className="text-white font-bold text-sm">${Math.round(totalInterest).toLocaleString()}</span>
                  </div>
                  <div className="bg-luxury-gold/5 p-4 rounded-[1.5rem] border border-luxury-gold/20">
                    <span className="block text-luxury-gold uppercase tracking-wider mb-1">Total Payment</span>
                    <span className="text-luxury-gold font-bold text-sm">${Math.round(totalPayment).toLocaleString()}</span>
                  </div>
                </div>

              </div>

            )}
          </div>

          {/* Luxury context column */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Private Program */}
            <div className="glass-card rounded-[2.5rem] p-6 border border-white/5 space-y-4 relative overflow-hidden group hover:border-luxury-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-luxury-gold to-transparent opacity-50" />
              <CalendarRange className="w-8 h-8 text-luxury-gold" />
              <h4 className="text-white typography-card-title">Premium Membership</h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-light">
                Lock in exclusive seasonal promotions, zero down financing options, and corporate tax write-off plans directly with our advisory board.
              </p>
              {inquirySent ? (
                <div className="text-[10px] text-emerald-400 border border-emerald-900/50 bg-emerald-950/20 px-4 py-3 rounded-full w-full text-center font-bold tracking-widest uppercase flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
                  <ShieldCheck className="w-4 h-4" /> Inquiry Received
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setInquirySent(true);
                    setTimeout(() => setInquirySent(false), 4000);
                  }}
                  className="text-[10px] text-luxury-gold hover:bg-luxury-gold hover:text-black uppercase font-bold tracking-widest border border-luxury-gold/50 px-4 py-3 rounded-full w-full text-center transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                >
                  Inquire program details
                </button>
              )}
            </div>

            {/* Insurance details */}
            <div className="glass-card rounded-[2.5rem] p-6 border border-white/5 space-y-4 group hover:border-luxury-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-500">
              <ShieldCheck className="w-8 h-8 text-luxury-gold" />
              <h4 className="text-white typography-card-title">Showroom Coverage</h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-light">
                Secure door-to-door enclosed transport insurance, paint restoration coverages, and mechanical warranties tailored to rare collector hypercars.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
