import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { HelpCircle, ChevronRight, Check, Compass, Sun, Moon, Eye, Heart, Power, Lightbulb } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';
import ThreeCar from '../components/ThreeCar';
import RealCarModel from '../components/RealCarModel';

export default function Viewer3D() {
  const { cars, toggleWishlist } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  // Selected Car
  const [selectedCar, setSelectedCar] = useState(null);

  // 3D Configurator States
  const [bodyColor, setBodyColor] = useState('#D4AF37');
  const [openLeftDoor, setOpenLeftDoor] = useState(false);
  const [openRightDoor, setOpenRightDoor] = useState(false);
  const [openHood, setOpenHood] = useState(false);
  const [openTrunk, setOpenTrunk] = useState(false);
  
  // Drivetrain & Dynamics States
  const [rotateWheels, setRotateWheels] = useState(false);
  const [steeringAngle, setSteeringAngle] = useState(0);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [isBraking, setIsBraking] = useState(false);
  const [headlightsOn, setHeadlightsOn] = useState(false);
  const [speed, setSpeed] = useState(0); // Animated speed state
  
  // Environment Lights Setup
  const [lightPreset, setLightPreset] = useState('studio'); // studio, sunset, night, neon

  // Color options mapping
  const colorPalette = [
    { name: 'Black', hex: '#0A0A0A' },
    { name: 'White', hex: '#EAEAEA' },
    { name: 'Silver', hex: '#8E8E8E' },
    { name: 'Red', hex: '#8B0000' },
    { name: 'Blue', hex: '#002F6C' },
    { name: 'Yellow', hex: '#E5A93B' },
    { name: 'Orange', hex: '#D35400' },
    { name: 'Green', hex: '#0D3E26' },
    { name: 'Purple', hex: '#4A154B' },
    { name: 'Gold', hex: '#D4AF37' }
  ];

  useEffect(() => {
    const carParam = searchParams.get('car');
    let car = cars.find(c => c.name === carParam);
    if (!car && cars.length > 0) {
      car = cars[0]; // fallback
    }
    if (car) {
      setSelectedCar(car);
      if (car.colors && car.colors.length > 0) {
        const found = colorPalette.find(c => c.name.toLowerCase() === car.colors[0].toLowerCase());
        if (found) setBodyColor(found.hex);
      }
    }
  }, [searchParams, cars]);

  // Speedometer physics loop
  useEffect(() => {
    let interval;
    if (isAccelerating || isBraking || speed > 0) {
      interval = setInterval(() => {
        setSpeed(prev => {
          let next = prev;
          if (isAccelerating) next += 2.5; // Acceleration rate
          else if (isBraking) next -= 4.0; // Braking rate
          else next -= 0.5; // Drag/Coast
          
          if (next < 0) next = 0;
          const maxSpeed = selectedCar?.specs?.topSpeed || 200;
          if (next > maxSpeed) next = maxSpeed;
          return next;
        });
      }, 50); // 20fps UI update is smooth enough
    }
    return () => clearInterval(interval);
  }, [isAccelerating, isBraking, speed, selectedCar]);

  // Auto turn on headlights at night
  useEffect(() => {
    if (lightPreset === 'night' || lightPreset === 'neon') {
      setHeadlightsOn(true);
    } else {
      setHeadlightsOn(false);
    }
  }, [lightPreset]);

  const handlePresetChange = (preset) => {
    setLightPreset(preset);
  };

  const getPresetConfig = () => {
    switch (lightPreset) {
      case 'sunset':
        return { ambient: 0.8, spot: 2.5, dir: 1.5, env: 'sunset', color: '#ffd59a', bg: '#1a0f14' };
      case 'night':
        return { ambient: 0.5, spot: 1.5, dir: 1.0, env: 'night', color: '#1a1a2e', bg: '#020205' };
      case 'neon':
        return { ambient: 0.2, spot: 2.0, dir: 0.8, env: 'apartment', color: '#ff007f', bg: '#050510' };
      default: // studio
        return { ambient: 0.6, spot: 1.2, dir: 0.7, env: 'city', color: '#ffffff', bg: '#f8f9fa' };
    }
  };

  const config = getPresetConfig();

  if (!selectedCar) {
    return (
      <div className="min-h-screen bg-luxury-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-zinc-550">Initializing Virtual Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-luxury-black text-luxury-silver h-screen pt-[90px] grid grid-cols-1 lg:grid-cols-4 font-sans overflow-hidden">
      
      {/* Sidebar - Configurator Control Center */}
      <div className="lg:col-span-1 border-r border-white/5 bg-[#050505]/95 backdrop-blur-xl p-6 md:p-10 flex flex-col space-y-10 z-10 overflow-y-auto">
        
        {/* Header Specs */}
        <div>
          <span className="text-luxury-gold text-[9px] tracking-[0.3em] font-bold uppercase block mb-2">Interactive Studio</span>
          <h1 className="text-white text-2xl md:text-3xl font-['Outfit'] font-bold tracking-widest uppercase mb-1">
            {selectedCar.brand === selectedCar.name.split(' ')[0] ? selectedCar.name : `${selectedCar.brand} ${selectedCar.name}`}
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{selectedCar.category}</p>
        </div>

        {/* Color Configurator */}
        <div className="space-y-4">
          <h3 className="text-[9px] tracking-[0.2em] uppercase text-zinc-400 font-bold">Body Coating Studio</h3>
          <div className="grid grid-cols-5 gap-3">
            {colorPalette.map((color) => (
              <button
                key={color.name}
                onClick={() => setBodyColor(color.hex)}
                title={color.name}
                className={`w-full aspect-square rounded-full border-2 relative transition-all duration-300 ${
                  bodyColor === color.hex ? 'border-luxury-gold scale-110 shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'border-white/5 hover:border-white/30 hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {bodyColor === color.hex && (
                  <span className="absolute inset-0 flex items-center justify-center text-white mix-blend-difference drop-shadow-md">
                    <Check className="w-4 h-4" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Opening Parts Animation Toggles */}
        <div className="space-y-4">
          <h3 className="text-[9px] tracking-[0.2em] uppercase text-zinc-400 font-bold">Aerodynamic & Chassis</h3>
          <div className="grid grid-cols-2 gap-3 text-[9px] font-bold uppercase tracking-widest">
            <button
              onClick={() => setOpenLeftDoor(!openLeftDoor)}
              className={`py-3.5 px-4 border rounded-full transition-all duration-300 ${openLeftDoor ? 'bg-luxury-gold text-black border-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'border-white/5 bg-black/40 hover:bg-white/10 text-zinc-400 hover:text-white'}`}
            >
              Left Door
            </button>
            <button
              onClick={() => setOpenRightDoor(!openRightDoor)}
              className={`py-3.5 px-4 border rounded-full transition-all duration-300 ${openRightDoor ? 'bg-luxury-gold text-black border-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'border-white/5 bg-black/40 hover:bg-white/10 text-zinc-400 hover:text-white'}`}
            >
              Right Door
            </button>
            <button
              onClick={() => setOpenHood(!openHood)}
              className={`py-3.5 px-4 border rounded-full transition-all duration-300 ${openHood ? 'bg-luxury-gold text-black border-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'border-white/5 bg-black/40 hover:bg-white/10 text-zinc-400 hover:text-white'}`}
            >
              Engine Hood
            </button>
            <button
              onClick={() => setOpenTrunk(!openTrunk)}
              className={`py-3.5 px-4 border rounded-full transition-all duration-300 ${openTrunk ? 'bg-luxury-gold text-black border-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'border-white/5 bg-black/40 hover:bg-white/10 text-zinc-400 hover:text-white'}`}
            >
              Luggage Trunk
            </button>
          </div>
        </div>

        {/* Drivetrain & Dynamics */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[9px] tracking-[0.2em] uppercase text-zinc-400 font-bold">Drivetrain Simulator</h3>
            <button 
              onClick={() => setHeadlightsOn(!headlightsOn)}
              className={`p-2 rounded-full transition-all duration-300 ${headlightsOn ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'bg-black/40 border border-white/5 text-zinc-500 hover:text-white'}`}
              title="Toggle Headlights"
            >
              <Lightbulb className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => setRotateWheels(!rotateWheels)}
              className={`w-full py-3.5 px-4 border rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex justify-center items-center gap-2 ${
                rotateWheels ? 'bg-luxury-gold text-black border-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'border-white/5 bg-black/40 hover:bg-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              <Power className="w-4 h-4" />
              {rotateWheels ? 'Drivetrain: ENGAGED' : 'Drivetrain: IDLE'}
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onMouseDown={() => setIsAccelerating(true)}
                onMouseUp={() => setIsAccelerating(false)}
                onMouseLeave={() => setIsAccelerating(false)}
                onTouchStart={() => setIsAccelerating(true)}
                onTouchEnd={() => setIsAccelerating(false)}
                className={`py-3.5 px-4 border rounded-full text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  isAccelerating ? 'bg-white text-black border-white scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.5)]' : 'border-white/5 bg-black/40 hover:bg-white/10 text-zinc-400'
                }`}
              >
                Accelerate (Hold)
              </button>
              <button
                onMouseDown={() => setIsBraking(true)}
                onMouseUp={() => setIsBraking(false)}
                onMouseLeave={() => setIsBraking(false)}
                onTouchStart={() => setIsBraking(true)}
                onTouchEnd={() => setIsBraking(false)}
                className={`py-3.5 px-4 border rounded-full text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  isBraking ? 'bg-red-500 text-white border-red-500 scale-[0.98] shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'border-white/5 bg-black/40 hover:bg-white/10 text-zinc-400'
                }`}
              >
                Brake (Hold)
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
                <span>Steering Angle</span>
                <span className={steeringAngle !== 0 ? 'text-luxury-gold' : ''}>{Math.round((steeringAngle * 180) / Math.PI)}°</span>
              </div>
              <input
                type="range"
                min={-Math.PI / 5}
                max={Math.PI / 5}
                step={0.02}
                value={steeringAngle}
                onChange={(e) => setSteeringAngle(parseFloat(e.target.value))}
                onDoubleClick={() => setSteeringAngle(0)}
                className="w-full accent-luxury-gold bg-white/5 h-1.5 rounded-full cursor-pointer appearance-none outline-none"
                title="Double click to center"
              />
            </div>
          </div>
        </div>

        {/* Studio Lighting Presets */}
        <div className="pt-8 border-t border-white/5">
          <h3 className="text-[9px] tracking-[0.2em] uppercase text-zinc-500 font-bold mb-4">Studio Environment</h3>
          <div className="grid grid-cols-2 gap-3 text-[9px] font-bold uppercase tracking-widest text-center">
            {[
              { id: 'studio', label: 'Studio' },
              { id: 'sunset', label: 'Sunset' },
              { id: 'night', label: 'Midnight' },
              { id: 'neon', label: 'Neon' }
            ].map(pres => (
              <button
                key={pres.id}
                onClick={() => handlePresetChange(pres.id)}
                className={`py-3 px-2 border rounded-full transition-all duration-300 ${
                  lightPreset === pres.id ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'border-white/5 bg-black/40 text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {pres.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* R3F 3D Viewport */}
      <div className="lg:col-span-3 h-[50vh] lg:h-full relative transition-colors duration-1000 overflow-hidden" style={{ backgroundColor: config.bg }}>
        
        {/* ThreeJS Canvas Container */}
        <div className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing">
          <Canvas dpr={[1, 2]} shadows camera={{ position: [0, 0.4, 5.5], fov: 42 }}>
            <color attach="background" args={[config.bg]} />
            
            {/* Ambient Lighting Setup */}
            <ambientLight intensity={config.ambient} color={config.color} />
            
            {/* Spotlight focused on car */}
            <spotLight 
              position={[8, 12, 8]} 
              angle={0.22} 
              penumbra={0.8} 
              intensity={config.spot} 
              castShadow 
              color={config.color}
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />

            {/* Back light reflection */}
            <directionalLight 
              position={[-6, 6, -6]} 
              intensity={config.dir} 
              color={lightPreset === 'neon' ? '#00ffff' : '#ffffff'} 
            />

            <Environment preset={config.env} />
            <ContactShadows 
              position={[0, -0.45, 0]} 
              opacity={0.65} 
              scale={12} 
              blur={2.5} 
              far={4} 
              color={lightPreset === 'studio' ? '#000000' : '#111111'}
            />
            
            <group position={[0, -0.45, 0]}>
              {selectedCar.brand === 'Porsche' ? (
                <React.Suspense fallback={null}>
                  <RealCarModel 
                    bodyColor={bodyColor} 
                    isAccelerating={isAccelerating}
                    isBraking={isBraking}
                    rotateWheels={rotateWheels}
                    steeringAngle={steeringAngle}
                  />
                </React.Suspense>
              ) : (
                <ThreeCar 
                  bodyColor={bodyColor} 
                  openLeftDoor={openLeftDoor} 
                  openRightDoor={openRightDoor}
                  openHood={openHood}
                  openTrunk={openTrunk}
                  rotateWheels={rotateWheels}
                  steeringAngle={steeringAngle}
                  isAccelerating={isAccelerating}
                  isBraking={isBraking}
                  headlightsOn={headlightsOn}
                  carCategory={selectedCar.category}
                  carBrand={selectedCar.brand}
                />
              )}
            </group>

            <OrbitControls 
              enableZoom={true} 
              maxPolarAngle={Math.PI / 2 - 0.05} // stop from going under ground
              minDistance={3.5}
              maxDistance={7}
              target={[0, 0, 0]}
              makeDefault
            />
          </Canvas>
        </div>

        {/* Navigation Indicator Overlay */}
        <div className="absolute top-8 left-8 z-10 max-w-sm pointer-events-none flex flex-col gap-1">
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em]">ESTIMATE ACQUISITION</p>
          <p className="text-3xl md:text-4xl font-['Outfit'] font-bold text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold to-yellow-200 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] tracking-widest">
            ${selectedCar.price.toLocaleString()}
          </p>
        </div>

        <div className="absolute top-8 right-8 z-10 flex gap-3">
          <button
            onClick={() => toggleWishlist(selectedCar.name)}
            className={`p-3.5 rounded-full backdrop-blur-md border transition-all duration-300 ${
              user?.wishlist?.includes(selectedCar.name) ? 'bg-red-500/20 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-black/60 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Heart className="w-5 h-5 fill-current" />
          </button>
          <Link
            to={`/scheduler?car=${encodeURIComponent(selectedCar.name)}&type=Test Drive`}
            className="bg-luxury-gold hover:bg-white text-black text-[10px] md:text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-full transition-all duration-300 flex items-center shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
          >
            Reserve Test Drive
          </Link>
        </div>

        {/* Speedometer Overlay */}
        <div className="absolute bottom-24 right-8 z-10 pointer-events-none flex flex-col items-end">
          <div className="relative flex items-center justify-center w-32 h-32 bg-[#050505]/80 backdrop-blur-xl rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            {/* SVG Arc for Speed */}
            <svg className="absolute inset-0 w-full h-full rotate-[135deg]">
              <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" strokeDasharray="254 339" strokeLinecap="round" />
              <circle 
                cx="64" cy="64" r="54" 
                fill="none" 
                stroke="#D4AF37" 
                strokeWidth="4" 
                strokeDasharray={`${(speed / (selectedCar?.specs?.topSpeed || 200)) * 254} 339`} 
                strokeLinecap="round" 
                className="transition-all duration-75 ease-linear drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" 
              />
            </svg>
            <div className="text-center mt-2">
              <span className="block text-4xl font-bold text-white font-['Outfit'] tabular-nums leading-none tracking-tight">
                {Math.round(speed)}
              </span>
              <span className="block text-[9px] text-luxury-gold font-bold uppercase tracking-[0.2em] mt-1.5">MPH</span>
            </div>
            
            {/* Dynamic RPM Dots */}
            <div className="absolute bottom-4 flex gap-1.5">
               <div className={`w-1.5 h-1.5 rounded-full transition-colors ${speed > 20 ? 'bg-luxury-gold shadow-[0_0_5px_rgba(212,175,55,0.8)]' : 'bg-white/10'}`}></div>
               <div className={`w-1.5 h-1.5 rounded-full transition-colors ${speed > 60 ? 'bg-luxury-gold shadow-[0_0_5px_rgba(212,175,55,0.8)]' : 'bg-white/10'}`}></div>
               <div className={`w-1.5 h-1.5 rounded-full transition-colors ${speed > 100 ? 'bg-luxury-gold shadow-[0_0_5px_rgba(212,175,55,0.8)]' : 'bg-white/10'}`}></div>
               <div className={`w-1.5 h-1.5 rounded-full transition-colors ${speed > 140 ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'bg-white/10'}`}></div>
            </div>
          </div>
        </div>

        {/* Viewport Info Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/5 bg-[#050505]/40 backdrop-blur-md flex justify-between items-center text-xs text-zinc-500 z-10 pointer-events-none">
          <div className="flex items-center gap-2 uppercase font-bold tracking-[0.2em] text-[9px]">
            <Compass className="w-4 h-4 text-luxury-gold animate-spin" style={{ animationDuration: '6s' }} />
            <span>Interactive 360 Viewing Sphere (Drag to rotate, Scroll to zoom)</span>
          </div>
          <p className="hidden md:block font-serif text-[10px] tracking-widest text-zinc-600">SPECIFICATION INTEGRITY COMPLIANT</p>
        </div>

      </div>

    </div>
  );
}
