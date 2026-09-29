import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, MapPin, Sparkles, CheckCircle, FileDown, Phone, Mail, User, ChevronRight, ChevronLeft, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { AppContext } from '../context/AppContext';

export default function Scheduler() {
  const { cars, addNotification } = useContext(AppContext);
  const [searchParams] = useSearchParams();

  // Wizard State
  const [currentStep, setCurrentStep] = useState(1);

  // Booking details form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [city, setCity] = useState('New York');
  const [preferredVehicle, setPreferredVehicle] = useState('Lamborghini Revuelto');
  const [appointmentType, setAppointmentType] = useState('Test Drive');
  
  const [deliveryMethod, setDeliveryMethod] = useState('Showroom Pickup');
  const [laborService, setLaborService] = useState('None');
  const [notes, setNotes] = useState('');

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  
  // UI Flow
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    const carParam = searchParams.get('car');
    let typeParam = searchParams.get('type');
    if (carParam) setPreferredVehicle(carParam);
    if (typeParam) {
      if (typeParam === 'Vehicle Purchase Consultation') {
        typeParam = 'Car Booking';
      }
      if (typeParam === 'VIP Meeting') {
        typeParam = 'Schedule Meeting';
      }
      setAppointmentType(typeParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!date) {
      setAvailableSlots([]);
      return;
    }
    const selectedDate = new Date(date);
    const day = selectedDate.getDay();

    if (day === 0) {
      setAvailableSlots([]);
      addNotification('Sundays are closed. Please select Monday through Saturday.', 'warning');
      setDate('');
      return;
    }

    let slots = [];
    if (day === 6) {
      slots = ['10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM', '07:00 PM', '08:30 PM'];
    } else {
      slots = ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM', '07:30 PM'];
    }
    setAvailableSlots(slots);
    setTime('');
  }, [date]);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!name || !email || !phone) { 
        addNotification('Please complete identity details.', 'warning'); 
        return; 
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleBookingSubmit = async () => {
    if (!time) {
      addNotification('Please choose a preferred time slot', 'warning');
      return;
    }

    const payload = {
      name, email, phone, city, preferredVehicle, appointmentType, deliveryMethod, laborService, date, time, notes
    };

    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setConfirmedBooking(data);
        setIsSuccess(true);
        addNotification('VIP Reservation completed successfully.', 'success');
        
        try {
          await fetch('http://localhost:5000/api/messages/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              email,
              subject: `New VIP Booking: ${appointmentType} for ${preferredVehicle}`,
              message: `A new VIP ${appointmentType} has been scheduled.\n\nClient: ${name}\nPhone: ${phone}\nLocation: ${city}\nVehicle: ${preferredVehicle}\nDate: ${date}\nTime: ${time}\nNotes: ${notes || 'None'}`
            })
          });
        } catch (emailErr) {
          console.error("Failed to trigger email notification:", emailErr);
        }
        
      } else {
        const errData = await res.json();
        addNotification(errData.message || 'Booking failed', 'warning');
      }
    } catch (err) {
      console.error(err);
      addNotification('Failed to connect to booking server', 'warning');
    }
  };

  const generateReceiptPDF = () => {
    if (!confirmedBooking) return;
    const doc = new jsPDF();
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setTextColor(212, 175, 55);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('AETHERION MOTORS LUXURY', 20, 30);
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(10);
    doc.text('VIP SHOWROOM APPOINTMENT CONFIRMATION', 20, 38);
    doc.line(20, 42, 190, 42);
    doc.setTextColor(229, 229, 229);
    doc.setFontSize(12);
    let y = 60;
    const rows = [
      { label: 'Booking Reference', val: confirmedBooking.id || confirmedBooking._id },
      { label: 'Full Name', val: confirmedBooking.name },
      { label: 'Selected Vehicle', val: confirmedBooking.preferredVehicle },
      { label: 'Appointment Type', val: confirmedBooking.appointmentType },
      { label: 'Delivery Preference', val: confirmedBooking.deliveryMethod },
      { label: 'Labor Service', val: confirmedBooking.laborService },
      { label: 'Date Scheduled', val: confirmedBooking.date },
      { label: 'Time Scheduled', val: confirmedBooking.time },
      { label: 'Showroom Location', val: `${confirmedBooking.city} Center` }
    ];
    rows.forEach(r => {
      doc.setFont('Helvetica', 'bold');
      doc.text(`${r.label}:`, 20, y);
      doc.setFont('Helvetica', 'normal');
      doc.text(`${r.val}`, 75, y);
      y += 12;
    });
    y += 10;
    doc.setDrawColor(44, 44, 44);
    doc.line(20, y, 190, y);
    y += 10;
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(11);
    doc.text('VIP AMENITIES PREPARED:', 20, y);
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(9);
    y += 6;
    doc.text('- Private viewing chamber reservations', 25, y);
    y += 5;
    doc.text('- Dedicated relationship concierge staff assignment', 25, y);
    y += 5;
    doc.text('- Premium refresh bar access', 25, y);
    doc.save(`aetherion_vip_booking_${confirmedBooking.id || confirmedBooking._id}.pdf`);
  };

  const stepTitles = ['Identity', 'Curation', 'Logistics', 'Timing'];

  return (
    <div className="bg-luxury-black text-luxury-silver min-h-screen pt-32 pb-20 font-sans selection:bg-luxury-gold selection:text-black relative">
      {/* Ambient background glows */}
      <div className="absolute top-24 left-1/4 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-zinc-900/60 pb-8">
          <div>
            <span className="text-luxury-gold text-xs tracking-[0.35em] font-semibold uppercase block mb-2">VIP Concierge</span>
            <h1 className="text-white text-4xl md:text-5xl font-serif tracking-wide leading-tight">Showroom Booking</h1>
            <p className="text-zinc-550 text-[11px] mt-2 flex items-center gap-2 uppercase tracking-widest font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
              Reserve your executive consultation
            </p>
          </div>
          <p className="text-[11px] text-zinc-500 max-w-sm font-bold uppercase tracking-wider leading-relaxed">
            Our lounges provide private vehicle viewings and customized refreshments.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <div className="space-y-8">
              {/* Progress Tracker */}
              <div className="flex justify-between items-center relative mb-12 max-w-3xl mx-auto px-6">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-zinc-900 -z-10 -translate-y-1/2"></div>
                {stepTitles.map((title, i) => {
                  const stepNum = i + 1;
                  const isActive = currentStep === stepNum;
                  const isCompleted = currentStep > stepNum;
                  return (
                    <div key={title} className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${
                        isActive ? 'bg-luxury-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-110 font-black' : 
                        isCompleted ? 'bg-zinc-805 text-luxury-gold border border-luxury-gold/50' : 
                        'bg-zinc-950 text-zinc-600 border border-zinc-900'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : stepNum}
                      </div>
                      <span className={`text-[8px] uppercase tracking-widest font-black transition-colors ${
                        isActive ? 'text-luxury-gold' : isCompleted ? 'text-zinc-400' : 'text-zinc-650'
                      }`}>
                        {title}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                
                {/* Form Area */}
                <div className="lg:col-span-2 bg-[#0a0a0a] rounded-[2rem] p-6 md:p-10 border border-zinc-900/80 relative overflow-hidden min-h-[400px]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-luxury-gold/20 to-transparent"></div>
                  
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <h3 className="text-base font-bold text-white mb-6 uppercase tracking-wider">1. Personal Identity</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-zinc-400 font-semibold">
                          <div className="space-y-2 sm:col-span-2">
                            <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-550 mb-2 ml-1">Full Name</label>
                            <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-luxury-gold transition-colors" />
                              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Alistair Aetherion" className="w-full bg-zinc-900/20 border border-zinc-900 rounded-full pl-12 pr-5 py-3.5 text-white focus:border-luxury-gold/30 transition-all focus:outline-none placeholder-zinc-600 focus:bg-zinc-900/30" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-550 mb-2 ml-1">Email Address</label>
                            <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-luxury-gold transition-colors" />
                              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vip@aetherionmotors.com" className="w-full bg-zinc-900/20 border border-zinc-900 rounded-full pl-12 pr-5 py-3.5 text-white focus:border-luxury-gold/30 transition-all focus:outline-none placeholder-zinc-600 focus:bg-zinc-900/30" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-550 mb-2 ml-1">Phone</label>
                            <div className="relative group">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-luxury-gold transition-colors" />
                              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 0199" className="w-full bg-zinc-900/20 border border-zinc-900 rounded-full pl-12 pr-5 py-3.5 text-white focus:border-luxury-gold/30 transition-all focus:outline-none placeholder-zinc-600 focus:bg-zinc-900/30" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <h3 className="text-base font-bold text-white mb-6 uppercase tracking-wider">2. Vehicle Curation</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-zinc-400 font-semibold">
                          <div className="space-y-2">
                            <label className="block text-[9px] tracking-wider uppercase text-zinc-550 ml-1 font-bold">Showroom Center</label>
                            <select value={city} onChange={e => setCity(e.target.value)} className="w-full bg-zinc-900/20 border border-zinc-900 rounded-full px-5 py-3.5 text-white focus:border-luxury-gold/30 transition-all focus:outline-none appearance-none cursor-pointer">
                              <option value="New York" className="bg-zinc-950">New York Salon</option>
                              <option value="Beverly Hills" className="bg-zinc-950">Beverly Hills Salon</option>
                              <option value="Munich" className="bg-zinc-950">Munich Salon</option>
                              <option value="Tokyo" className="bg-zinc-950">Tokyo Salon</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[9px] tracking-wider uppercase text-zinc-550 ml-1 font-bold">Preferred Drivetrain</label>
                            <select value={preferredVehicle} onChange={e => setPreferredVehicle(e.target.value)} className="w-full bg-zinc-900/20 border border-zinc-900 rounded-full px-5 py-3.5 text-white focus:border-luxury-gold/30 transition-all focus:outline-none appearance-none cursor-pointer">
                              {cars.map(c => <option key={c.name} value={c.name} className="bg-zinc-950">{c.brand} {c.name}</option>)}
                            </select>
                          </div>
                          <div className="space-y-2 sm:col-span-2">
                            <label className="block text-[9px] tracking-wider uppercase text-zinc-550 ml-1 font-bold">Consultation Class</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {['Test Drive', 'Service & Care', 'Car Booking', 'Schedule Meeting'].map(type => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => setAppointmentType(type)}
                                  className={`py-3.5 px-3.5 border rounded-[1.2rem] text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${appointmentType === type ? 'bg-luxury-gold text-black border-luxury-gold shadow-md shadow-luxury-gold/5' : 'border-zinc-905 bg-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <h3 className="text-base font-bold text-white mb-6 uppercase tracking-wider">3. Logistics & Notes</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-zinc-400 font-semibold">
                          <div className="space-y-2">
                            <label className="block text-[9px] tracking-wider uppercase text-zinc-550 ml-1 font-bold">Delivery Preference</label>
                            <select value={deliveryMethod} onChange={e => setDeliveryMethod(e.target.value)} className="w-full bg-zinc-900/20 border border-zinc-900 rounded-full px-5 py-3.5 text-white focus:border-luxury-gold/30 transition-all focus:outline-none appearance-none cursor-pointer">
                              <option value="Showroom Pickup" className="bg-zinc-950">Showroom Pickup</option>
                              <option value="White-Glove Door Delivery" className="bg-zinc-950">White-Glove Door Delivery</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[9px] tracking-wider uppercase text-zinc-550 ml-1 font-bold">Labor Service</label>
                            <select value={laborService} onChange={e => setLaborService(e.target.value)} className="w-full bg-zinc-900/20 border border-zinc-900 rounded-full px-5 py-3.5 text-white focus:border-luxury-gold/30 transition-all focus:outline-none appearance-none cursor-pointer">
                              <option value="None" className="bg-zinc-950">No Service Required</option>
                              <option value="Standard Maintenance" className="bg-zinc-950">Standard Maintenance Labor</option>
                              <option value="Performance Tuning" className="bg-zinc-950">Performance Tuning</option>
                            </select>
                          </div>
                          <div className="space-y-2 sm:col-span-2">
                            <label className="block text-[9px] tracking-wider uppercase text-zinc-550 ml-1 font-bold">Private Notes (Optional)</label>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Indicate custom requirements or dietary restrictions for beverage preparations..." rows="3" className="w-full bg-zinc-900/20 border border-zinc-900 rounded-[1.5rem] px-5 py-4 text-white focus:border-luxury-gold/30 transition-all focus:outline-none placeholder-zinc-600 focus:bg-zinc-900/30 font-semibold" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 4 && (
                      <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <h3 className="text-base font-bold text-white mb-6 uppercase tracking-wider">4. Schedule Timing</h3>
                        <div className="space-y-6 text-xs text-zinc-400 font-semibold">
                          <div className="space-y-2">
                            <label className="block text-[9px] tracking-wider uppercase text-zinc-550 ml-1 font-bold">Select Date</label>
                            <div className="relative max-w-sm group">
                              <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-650 group-focus-within:text-luxury-gold transition-colors" />
                              <input type="date" value={date} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} className="w-full bg-zinc-900/20 border border-zinc-900 rounded-full pl-12 pr-5 py-3.5 text-white focus:border-luxury-gold/30 transition-all focus:outline-none cursor-pointer" />
                            </div>
                          </div>

                          <AnimatePresence>
                            {availableSlots.length > 0 && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                                <label className="block text-[9px] tracking-wider uppercase text-zinc-550 ml-1 font-bold">Select Time Slot</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[9px] font-black tracking-widest text-center uppercase">
                                  {availableSlots.map(s => (
                                    <button key={s} type="button" onClick={() => setTime(s)} className={`py-3.5 px-2.5 border rounded-full transition-all duration-300 ${time === s ? 'bg-luxury-gold text-black border-luxury-gold shadow-md shadow-luxury-gold/5' : 'border-zinc-900 bg-transparent text-zinc-450 hover:text-white hover:bg-zinc-900/50'}`}>
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Footer */}
                  <div className="flex justify-between items-center mt-10 pt-6 border-t border-zinc-900">
                    <button 
                      onClick={handlePrev} 
                      disabled={currentStep === 1} 
                      className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                        currentStep === 1 
                          ? 'text-zinc-800 cursor-not-allowed' 
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    {currentStep < 4 ? (
                      <button 
                        onClick={handleNext} 
                        className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-luxury-gold text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-black/25 duration-300"
                      >
                        Continue <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={handleBookingSubmit} 
                        className="flex items-center gap-2 px-6 py-3 bg-luxury-gold hover:bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] duration-300"
                      >
                        Dispatch VIP Request <ShieldCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sidebar Summary */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-[#0a0a0a] rounded-[2rem] p-6 md:p-8 border border-zinc-900/80 space-y-6 relative overflow-hidden group hover:border-luxury-gold/20 hover:shadow-[0_12px_40px_rgba(212,175,55,0.04)] transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 rounded-full blur-[50px]"></div>
                    <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                      <Sparkles className="w-5 h-5 text-luxury-gold" />
                      <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Reservation Dossier</h4>
                    </div>

                    <div className="space-y-5 text-xs">
                      <div>
                        <span className="block text-[8px] uppercase tracking-widest text-zinc-550 font-bold mb-1">Client Profile</span>
                        <p className={`font-semibold ${name ? 'text-white' : 'text-zinc-600'}`}>{name || 'Awaiting Input'}</p>
                        <p className="text-zinc-500 mt-0.5">{email || phone ? `${email} ${phone ? `| ${phone}` : ''}` : ''}</p>
                      </div>
                      
                      <div>
                        <span className="block text-[8px] uppercase tracking-widest text-zinc-550 font-bold mb-1">Curation Details</span>
                        <p className="text-white font-semibold">{preferredVehicle}</p>
                        <p className="text-zinc-500 mt-0.5">{appointmentType} &bull; {city} Salon</p>
                      </div>

                      <div>
                        <span className="block text-[8px] uppercase tracking-widest text-zinc-550 font-bold mb-1">Logistics</span>
                        <p className="text-white font-semibold">{deliveryMethod}</p>
                        <p className="text-zinc-500 mt-0.5">{laborService}</p>
                      </div>

                      <div>
                        <span className="block text-[8px] uppercase tracking-widest text-zinc-550 font-bold mb-1">Timing</span>
                        <p className={`font-semibold ${date ? 'text-white' : 'text-zinc-600'}`}>{date ? new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Pending Date'}</p>
                        <p className="text-luxury-gold font-black text-sm mt-1">{time || '--:--'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 border border-zinc-900 bg-zinc-950/20 rounded-2xl flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                    <p className="text-[9px] text-zinc-550 uppercase tracking-wider leading-relaxed font-bold">
                      By submitting this request, you agree to Aetherion Motors' bespoke consultation terms. VIP access may require financial portfolio verification prior to showroom entry.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            // Success confirmation receipt
            <motion.div key="booking-success" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="max-w-2xl mx-auto bg-[#0a0a0a] rounded-[2rem] p-8 md:p-12 border border-zinc-900 text-center space-y-10 shadow-2xl relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-luxury-gold/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="space-y-6 relative z-10">
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: [0, 1.2, 1] }} 
                  transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
                  className="inline-flex p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                >
                  <CheckCircle className="w-10 h-10" />
                </motion.div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif text-white tracking-[0.05em] uppercase mb-3">Reservation Confirmed</h2>
                  <p className="text-[10px] text-zinc-400 max-w-md mx-auto leading-relaxed font-black uppercase tracking-widest">
                    Your VIP dossier has been registered in our central ledger. A concierge advisor will verify your portfolio shortly.
                  </p>
                </div>
              </div>

              {/* Details Sub-Container */}
              <div className="bg-zinc-950/40 rounded-2xl border border-zinc-900 p-6 md:p-8 max-w-lg mx-auto relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 text-left">
                  <div className="flex flex-col">
                    <span className="text-zinc-500 uppercase text-[9px] font-bold tracking-widest mb-1">Reference ID</span>
                    <span className="text-white font-bold font-mono text-xs">{confirmedBooking?.id || confirmedBooking?._id || 'REQ-8899'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 uppercase text-[9px] font-bold tracking-widest mb-1">Vehicle</span>
                    <span className="text-white font-bold text-xs">{confirmedBooking?.preferredVehicle || preferredVehicle}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 uppercase text-[9px] font-bold tracking-widest mb-1">Schedule</span>
                    <span className="text-white font-bold text-xs">{confirmedBooking?.date || date} <span className="text-luxury-gold">@</span> {confirmedBooking?.time || time}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 uppercase text-[9px] font-bold tracking-widest mb-1">Location</span>
                    <span className="text-white font-bold text-xs">{confirmedBooking?.city || city} Center</span>
                  </div>
                </div>
              </div>

               <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                 <button onClick={generateReceiptPDF} className="px-8 py-3.5 bg-luxury-gold hover:bg-white text-black rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                   <FileDown className="w-4 h-4" /> <span>Download PDF Dossier</span>
                 </button>
                 <button onClick={() => { setIsSuccess(false); setCurrentStep(1); setTime(''); setDate(''); }} className="px-8 py-3.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-350 hover:text-white transition-all duration-300">
                   Schedule Another
                 </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
