import React, { useState } from 'react';
import { Globe, Search } from 'lucide-react';

export default function Brands() {
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [imageError, setImageError] = useState({});

  const brandsData = [
    // GERMANY
    {
      name: 'BMW',
      country: 'Germany',
      flag: '🇩🇪',
      established: '1916',
      launched: '1928',
      history: 'Munich-based pioneer of luxury sports driving dynamics, high-revving engines, and precision chassis engineering.'
    },
    {
      name: 'Mercedes-Benz',
      country: 'Germany',
      flag: '🇩🇪',
      established: '1926',
      launched: '1886',
      history: 'Pioneered the very first internal combustion automobile and remains the global benchmark for safety and luxury.'
    },
    {
      name: 'Audi',
      country: 'Germany',
      flag: '🇩🇪',
      established: '1909',
      launched: '1910',
      history: 'Renowned for its Quattro all-wheel drive, sleek premium cabins, and progressive lighting technologies.'
    },
    {
      name: 'Volkswagen',
      country: 'Germany',
      flag: '🇩🇪',
      established: '1937',
      launched: '1938',
      history: 'Created iconic daily premium models like the Beetle and Golf, transitioning to the unified ID electric family.'
    },
    {
      name: 'Porsche',
      country: 'Germany',
      flag: '🇩🇪',
      established: '1931',
      launched: '1948',
      history: 'Unmatched sports engineering pedigree with the rear-engined 911 serving as the industry standard.'
    },
    {
      name: 'Opel',
      country: 'Germany',
      flag: '🇩🇪',
      established: '1862',
      launched: '1899',
      history: 'A historic German manufacturer providing accessible engineering and clean modern designs.'
    },
    {
      name: 'Maybach',
      country: 'Germany',
      flag: '🇩🇪',
      established: '1909',
      launched: '1921',
      history: 'The absolute pinnacle of double-tone executive chauffeur comfort and luxury.'
    },

    // JAPAN
    {
      name: 'Toyota',
      country: 'Japan',
      flag: '🇯🇵',
      established: '1937',
      launched: '1936',
      history: 'The world\'s leading pioneer in reliability, mass assembly, hybrid synergy, and hydrogen fuels.'
    },
    {
      name: 'Honda',
      country: 'Japan',
      flag: '🇯🇵',
      established: '1948',
      launched: '1963',
      history: 'Engineered high-revving VTEC systems, legendary motorcycle tech, and sporty daily vehicles.'
    },
    {
      name: 'Nissan',
      country: 'Japan',
      flag: '🇯🇵',
      established: '1933',
      launched: '1935',
      history: 'Created legendary GT-R performance and pioneered early mass-market EVs like the Leaf.'
    },
    {
      name: 'Suzuki',
      country: 'Japan',
      flag: '🇯🇵',
      established: '1909',
      launched: '1955',
      history: 'Renowned for lightweight compact off-roaders and reliable small-capacity utility vehicles.'
    },
    {
      name: 'Mazda',
      country: 'Japan',
      flag: '🇯🇵',
      established: '1920',
      launched: '1931',
      history: 'Celebrated for beautiful Kodo design and pioneering rotary engine platforms.'
    },
    {
      name: 'Subaru',
      country: 'Japan',
      flag: '🇯🇵',
      established: '1953',
      launched: '1954',
      history: 'Pioneered Symmetrical All-Wheel Drive and high-traction Boxer engine layouts.'
    },
    {
      name: 'Mitsubishi Motors',
      country: 'Japan',
      flag: '🇯🇵',
      established: '1970',
      launched: '1917',
      history: 'Famous for rally-winning Lancer Evolution dynamics and advanced Super All-Wheel Control.'
    },
    {
      name: 'Lexus',
      country: 'Japan',
      flag: '🇯🇵',
      established: '1989',
      launched: '1989',
      history: 'Toyota\'s luxury division, defining silent operations and unmatched dealership hospitality.'
    },
    {
      name: 'Acura',
      country: 'Japan',
      flag: '🇯🇵',
      established: '1986',
      launched: '1986',
      history: 'Honda\'s luxury performance division, combining precision engineering with street sportiness.'
    },
    {
      name: 'Infiniti',
      country: 'Japan',
      flag: '🇯🇵',
      established: '1989',
      launched: '1989',
      history: 'Nissan\'s luxury segment, known for avant-garde design language and dynamic performance.'
    },

    // UNITED STATES
    {
      name: 'Ford Motor Company',
      country: 'United States',
      flag: '🇺🇸',
      established: '1903',
      launched: '1903',
      history: 'Revolutionized the industrial world with the assembly line and muscle heritage.'
    },
    {
      name: 'Chevrolet',
      country: 'United States',
      flag: '🇺🇸',
      established: '1911',
      launched: '1911',
      history: 'A cornerstone of American car culture, creator of Corvette and Camaro.'
    },
    {
      name: 'Tesla',
      country: 'United States',
      flag: '🇺🇸',
      established: '2003',
      launched: '2008',
      history: 'Pioneered the global electric vehicle revolution with advanced software and Autopilot.'
    },
    {
      name: 'Jeep',
      country: 'United States',
      flag: '🇺🇸',
      established: '1941',
      launched: '1941',
      history: 'Pioneered off-road utility and freedom, defining the rugged 4x4 standard.'
    },
    {
      name: 'Dodge',
      country: 'United States',
      flag: '🇺🇸',
      established: '1900',
      launched: '1914',
      history: 'The emblem of modern American muscle, supercharged Hemis, and aggressive power.'
    },
    {
      name: 'Cadillac',
      country: 'United States',
      flag: '🇺🇸',
      established: '1902',
      launched: '1902',
      history: 'GM\'s flagship brand, combining precision Blackwing performance with luxury design.'
    },
    {
      name: 'GMC',
      country: 'United States',
      flag: '🇺🇸',
      established: '1911',
      launched: '1912',
      history: 'Specializes in high-end premium utility trucks, luxury Denali trims, and electric Hummers.'
    },
    {
      name: 'Lincoln',
      country: 'United States',
      flag: '🇺🇸',
      established: '1917',
      launched: '1920',
      history: 'Ford\'s premier luxury brand, delivering American luxury passenger suites.'
    },
    {
      name: 'Chrysler',
      country: 'United States',
      flag: '🇺🇸',
      established: '1925',
      launched: '1926',
      history: 'A classic American manufacturer, known for roomy luxury minivans and full-size sedans.'
    },

    // UNITED KINGDOM
    {
      name: 'Rolls-Royce Motor Cars',
      country: 'United Kingdom',
      flag: '🇬🇧',
      established: '1904',
      launched: '1904',
      history: 'The global benchmark for ultimate prestige, silent cabins, and bespoke artwork.'
    },
    {
      name: 'Bentley',
      country: 'United Kingdom',
      flag: '🇬🇧',
      established: '1919',
      launched: '1921',
      history: 'Fuses hand-crafted British cabin luxury with high-performance grand touring dynamics.'
    },
    {
      name: 'Jaguar',
      country: 'United Kingdom',
      flag: '🇬🇧',
      established: '1922',
      launched: '1935',
      history: 'Known for beautiful sporting silhouettes, racing heritage, and graceful chassis setup.'
    },
    {
      name: 'Land Rover',
      country: 'United Kingdom',
      flag: '🇬🇧',
      established: '1948',
      launched: '1948',
      history: 'The definitive go-anywhere luxury off-road icon, creator of Range Rover.'
    },
    {
      name: 'Aston Martin',
      country: 'United Kingdom',
      flag: '🇬🇧',
      established: '1913',
      launched: '1915',
      history: 'The ultimate representation of British power, elegance, and Grand Touring racing.'
    },
    {
      name: 'McLaren Automotive',
      country: 'United Kingdom',
      flag: '🇬🇧',
      established: '1985',
      launched: '1992',
      history: 'Formula 1 technology direct to the street, utilizing carbon-fiber monocoques.'
    },
    {
      name: 'Mini',
      country: 'United Kingdom',
      flag: '🇬🇧',
      established: '1959',
      launched: '1959',
      history: 'Iconic space-saving front-wheel drive designs, known for go-kart handling.'
    },

    // ITALY
    {
      name: 'Ferrari',
      country: 'Italy',
      flag: '🇮🇹',
      established: '1939',
      launched: '1947',
      history: 'The absolute heart and racing soul of motorsport and high-performance supercars.'
    },
    {
      name: 'Lamborghini',
      country: 'Italy',
      flag: '🇮🇹',
      established: '1963',
      launched: '1963',
      history: 'Extreme geometric styling, roaring V12 engines, and uncompromising performance.'
    },
    {
      name: 'Maserati',
      country: 'Italy',
      flag: '🇮🇹',
      established: '1914',
      launched: '1926',
      history: 'Italian class and performance, featuring highly musical engines and fine leather.'
    },
    {
      name: 'Fiat',
      country: 'Italy',
      flag: '🇮🇹',
      established: '1899',
      launched: '1899',
      history: 'The backbone of Italian motoring, famous for charming compact urban designs.'
    },
    {
      name: 'Alfa Romeo',
      country: 'Italy',
      flag: '🇮🇹',
      established: '1910',
      launched: '1910',
      history: 'Beautiful Italian sports sedans and coupes with active driving enthusiasm.'
    },
    {
      name: 'Pagani',
      country: 'Italy',
      flag: '🇮🇹',
      established: '1992',
      launched: '1999',
      history: 'Bespoke hypercar art, combining AMG V12 power with carbon-titanium weaves.'
    },

    // FRANCE
    {
      name: 'Bugatti',
      country: 'France',
      flag: '🇫🇷',
      established: '1909',
      launched: '1910',
      history: 'Ultimate speed, absolute luxury, and unmatched 16-cylinder internal combustion engineering.'
    },
    {
      name: 'Renault',
      country: 'France',
      flag: '🇫🇷',
      established: '1899',
      launched: '1899',
      history: 'Pioneered hatchbacks, turbocharged racing tech, and smart urban electric vehicles.'
    },
    {
      name: 'Peugeot',
      country: 'France',
      flag: '🇫🇷',
      established: '1810',
      launched: '1889',
      history: 'One of the world\'s oldest manufacturers, offering sleek styling and electric mobility.'
    },
    {
      name: 'Citroën',
      country: 'France',
      flag: '🇫🇷',
      established: '1919',
      launched: '1919',
      history: 'Known for radical engineering, hydropneumatic suspension, and quirky designs.'
    },

    // SOUTH KOREA
    {
      name: 'Hyundai',
      country: 'South Korea',
      flag: '🇰🇷',
      established: '1967',
      launched: '1968',
      history: 'Pioneered rapid technological growth and EV efficiency with the E-GMP platform.'
    },
    {
      name: 'Kia',
      country: 'South Korea',
      flag: '🇰🇷',
      established: '1944',
      launched: '1974',
      history: 'Modern premium design language, excellent warranties, and high-performance EVs.'
    },
    {
      name: 'Genesis Motor',
      country: 'South Korea',
      flag: '🇰🇷',
      established: '2015',
      launched: '2015',
      history: 'South Korea\'s luxury flagship, delivering exceptional design with athletic elegance.'
    },

    // INDIA
    {
      name: 'Tata Motors',
      country: 'India',
      flag: '🇮🇳',
      established: '1945',
      launched: '1991',
      history: 'Indian global giant, owner of Jaguar Land Rover, driving electric EV mobility.'
    },
    {
      name: 'Mahindra & Mahindra',
      country: 'India',
      flag: '🇮🇳',
      established: '1945',
      launched: '1947',
      history: 'Pioneered authentic rugged SUVs and off-road excellence in India.'
    },
    {
      name: 'Maruti Suzuki',
      country: 'India',
      flag: '🇮🇳',
      established: '1981',
      launched: '1983',
      history: 'Joint venture mobilizing the Indian population with reliable hatchbacks.'
    },
    {
      name: 'Force Motors',
      country: 'India',
      flag: '🇮🇳',
      established: '1958',
      launched: '1958',
      history: 'Famous for heavy-duty commercial utility and the Mercedes-engined rugged Gurkha off-roader.'
    },
    {
      name: 'Ashok Leyland',
      country: 'India',
      flag: '🇮🇳',
      established: '1948',
      launched: '1948',
      history: 'Commercial vehicle giant powering cargo transport, logistics, and heavy haulage.'
    },

    // CHINA
    {
      name: 'BYD',
      country: 'China',
      flag: '🇨🇳',
      established: '2003',
      launched: '2003',
      history: 'The world\'s leading battery and plug-in electric vehicle manufacturer.'
    },
    {
      name: 'Geely',
      country: 'China',
      flag: '🇨🇳',
      established: '1986',
      launched: '1997',
      history: 'Global powerhouse owning Volvo, Polestar, and Lotus, driving smart electric vehicles.'
    },
    {
      name: 'Chery',
      country: 'China',
      flag: '🇨🇳',
      established: '1997',
      launched: '1999',
      history: 'Prominent Chinese exporter, leading in compact SUVs and tech integrations.'
    },
    {
      name: 'Great Wall Motors',
      country: 'China',
      flag: '🇨🇳',
      established: '1984',
      launched: '1984',
      history: 'Specializes in rugged utility pickups and popular SUV sub-brands like Haval and Tank.'
    },
    {
      name: 'NIO',
      country: 'China',
      flag: '🇨🇳',
      established: '2014',
      launched: '2016',
      history: 'Pioneered automated battery-swapping stations, executive EVs, and AI assistant NOMI.'
    },
    {
      name: 'XPeng',
      country: 'China',
      flag: '🇨🇳',
      established: '2014',
      launched: '2018',
      history: 'Leading Chinese smart EV startup focusing on autonomous driving and lidar integrations.'
    },

    // SWEDEN
    {
      name: 'Volvo Cars',
      country: 'Sweden',
      flag: '🇸🇪',
      established: '1927',
      launched: '1927',
      history: 'The world standard for vehicle safety innovations, transitioning to 100% EV.'
    },
    {
      name: 'Koenigsegg',
      country: 'Sweden',
      flag: '🇸🇪',
      established: '1994',
      launched: '2002',
      history: 'Boutique hypercar manufacturer setting speed records with direct-drive gearboxes.'
    },

    // OTHER
    {
      name: 'Škoda Auto',
      country: 'Other Famous Brands',
      flag: '🇨🇿',
      established: '1895',
      launched: '1905',
      history: 'Czech heritage under Volkswagen Group, known for clever utility layouts.'
    },
    {
      name: 'SEAT',
      country: 'Other Famous Brands',
      flag: '🇪🇸',
      established: '1950',
      launched: '1953',
      history: 'Spanish passenger car manufacturer under VW Group, delivering youthful design.'
    },
    {
      name: 'Cupra',
      country: 'Other Famous Brands',
      flag: '🇪🇸',
      established: '2018',
      launched: '2018',
      history: 'High-performance Spanish brand focused on emotional styling and sporty dynamics.'
    },
    {
      name: 'Dacia',
      country: 'Other Famous Brands',
      flag: '🇷🇴',
      established: '1966',
      launched: '1968',
      history: 'Romanian subsidiary of Renault, delivering simple, robust, and highly affordable cars.'
    },
    {
      name: 'Rimac Automobili',
      country: 'Other Famous Brands',
      flag: '🇭🇷',
      established: '2009',
      launched: '2011',
      history: 'Croatian electric hypercar tech company, building the fastest accelerating EV in the world.'
    }
  ];

  const countriesList = [
    { label: 'All Countries', value: 'All', icon: <Globe className="w-3.5 h-3.5" /> },
    { label: 'Germany 🇩🇪', value: 'Germany' },
    { label: 'Japan 🇯🇵', value: 'Japan' },
    { label: 'United States 🇺🇸', value: 'United States' },
    { label: 'United Kingdom 🇬🇧', value: 'United Kingdom' },
    { label: 'Italy 🇮🇹', value: 'Italy' },
    { label: 'France 🇫🇷', value: 'France' },
    { label: 'South Korea 🇰🇷', value: 'South Korea' },
    { label: 'India 🇮🇳', value: 'India' },
    { label: 'China 🇨🇳', value: 'China' },
    { label: 'Sweden 🇸🇪', value: 'Sweden' },
    { label: 'Other Brands 🌐', value: 'Other Famous Brands' }
  ];

  const getBrandLogoUrl = (brandName) => {
    let slug = brandName.toLowerCase()
      .replace('motor cars', '')
      .replace('motor company', '')
      .replace('automotive', '')
      .replace('motors', '')
      .replace('motor', '')
      .replace('&', '')
      .replace('cars', '')
      .trim()
      .replace(/\s+/g, '-');

    // Manual overrides for specific CDN matches
    if (slug === 'mercedes-benz') return 'https://vl.imgix.net/img/mercedes-benz-logo.png';
    if (slug === 'rolls-royce') return 'https://vl.imgix.net/img/rolls-royce-logo.png';
    if (slug === 'mahindra-mahindra') return 'https://vl.imgix.net/img/mahindra-logo.png';
    if (slug === 'maruti-suzuki') return 'https://vl.imgix.net/img/suzuki-logo.png';
    if (slug === 'force') return 'https://vl.imgix.net/img/force-logo.png';
    if (slug === 'great-wall') return 'https://vl.imgix.net/img/great-wall-logo.png';
    if (slug === 'volvo') return 'https://vl.imgix.net/img/volvo-logo.png';
    if (slug === 'peugeot') return 'https://vl.imgix.net/img/peugeot-logo.png';
    if (slug === 'citroën') return 'https://vl.imgix.net/img/citroen-logo.png';
    if (slug === 'skoda-auto') return 'https://vl.imgix.net/img/skoda-logo.png';

    return `https://vl.imgix.net/img/${slug}-logo.png`;
  };

  const renderFallbackLogo = (brandName) => {
    const words = brandName.split(' ');
    const initials = words.map(w => w[0]).join('').substring(0, 3).toUpperCase();
    const charCode = brandName.charCodeAt(0);
    let badgeColor = "#D4AF37";
    if (charCode % 5 === 0) badgeColor = "#E5E5E5";
    if (charCode % 5 === 1) badgeColor = "#CC0000";
    if (charCode % 5 === 2) badgeColor = "#1A365D";
    if (charCode % 5 === 3) badgeColor = "#006643";
    
    return (
      <div className="w-16 h-16 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center shadow shadow-black overflow-hidden relative shrink-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-transparent opacity-40" />
        <span className="text-[18px] font-black uppercase tracking-wider text-center" style={{ color: badgeColor }}>
          {initials}
        </span>
      </div>
    );
  };

  const renderBrandLogo = (brandName) => {
    if (imageError[brandName]) {
      return renderFallbackLogo(brandName);
    }
    return (
      <img
        src={getBrandLogoUrl(brandName)}
        alt={`${brandName} Logo`}
        loading="lazy"
        onError={() => setImageError(prev => ({ ...prev, [brandName]: true }))}
        className="w-[75%] h-[75%] object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] brightness-105 group-hover:scale-110 transition-transform duration-300"
      />
    );
  };

  // Filters
  const filteredBrands = brandsData.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          brand.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === 'All' || brand.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="bg-luxury-black text-luxury-silver min-h-screen pt-32 pb-20 font-sans selection:bg-luxury-gold selection:text-black relative">
      {/* Ambient background glows */}
      <div className="absolute top-24 left-1/4 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-zinc-900/60 pb-8">
          <div>
            <span className="text-luxury-gold text-xs tracking-[0.35em] font-semibold uppercase block mb-2">Global Heritage Registry</span>
            <h1 className="text-white text-4xl md:text-5xl font-serif tracking-wide leading-tight">Manufacturers Directory</h1>
            <p className="text-zinc-550 text-[11px] mt-2 flex items-center gap-2 uppercase tracking-widest font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
              Trace the mechanical lineage of global luxury makers
            </p>
          </div>
          <p className="text-[11px] text-zinc-500 max-w-sm font-bold uppercase tracking-wider leading-relaxed">
            Explore establishment years and historical milestones of 60+ global automotive legends.
          </p>
        </div>

        {/* Advanced Filter Command Center */}
        <div className="bg-[#070707] p-4 rounded-3xl border border-zinc-900/80 mb-12 flex flex-col lg:flex-row gap-6 items-center justify-between shadow-2xl">
          {/* Search bar */}
          <div className="relative w-full lg:max-w-sm shrink-0 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-650 group-focus-within:text-luxury-gold transition-colors" />
            <input
              type="text"
              placeholder="Search manufacturers, regions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/20 border border-zinc-900 focus:border-luxury-gold/30 rounded-full pl-11 pr-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none transition-all shadow-inner focus:bg-zinc-900/30"
            />
          </div>

          {/* Country Tabs */}
          <div className="flex gap-2 overflow-x-auto w-full hide-scrollbar pb-1 lg:pb-0">
            {countriesList.map((country) => (
              <button
                key={country.value}
                onClick={() => setSelectedCountry(country.value)}
                className={`flex items-center gap-2 px-5 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-full transition-all shrink-0 border ${
                  selectedCountry === country.value
                    ? 'bg-luxury-gold text-black border-luxury-gold shadow-md shadow-luxury-gold/5'
                    : 'text-zinc-450 hover:text-white bg-zinc-900/30 border-transparent hover:bg-zinc-900/50'
                }`}
              >
                <span className="text-sm">{country.icon}</span>
                <span>{country.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Brand Cards Grid - Center-Aligned Editorial Chassis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {filteredBrands.map((b) => (
            <div
              key={b.name}
              className="p-8 rounded-[2rem] border border-zinc-900/80 bg-[#0a0a0a] hover:border-luxury-gold/20 hover:shadow-[0_12px_40px_rgba(212,175,55,0.04)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col items-center justify-center gap-4 w-full relative min-h-[250px] group overflow-hidden"
            >
              {/* Region Flag / Country tag */}
              <div className="absolute top-4 left-4 bg-zinc-950 border border-zinc-900 px-3 py-1 rounded-full text-[8px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-sm transition-colors group-hover:border-luxury-gold/15">
                <span>{b.flag}</span>
                <span>{b.country === 'Other Famous Brands' ? 'Other' : b.country}</span>
              </div>

              {/* Large Centered Logo Medallion */}
              <div className="w-24 h-24 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center shadow-lg transition-all duration-500 group-hover:border-luxury-gold/25 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] overflow-hidden">
                {renderBrandLogo(b.name)}
              </div>

              {/* Centered Editorial Info */}
              <div className="w-full mt-2 flex flex-col items-center">
                <h3 className="text-zinc-100 group-hover:text-luxury-gold transition-colors duration-300 font-bold uppercase tracking-[0.15em] text-center text-sm mb-1">
                  {b.name}
                </h3>
                
                {/* Horizontal minimalist metadata line */}
                <p className="text-[9px] text-zinc-550 tracking-[0.2em] font-mono uppercase group-hover:text-zinc-400 transition-colors">
                  EST. {b.established} &bull; {b.launched}
                </p>

                {/* History Text (Revealed on Hover) */}
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out w-full mt-0 group-hover:mt-3">
                  <div className="overflow-hidden">
                    <div className="border-t border-zinc-900 pt-3 mt-1.5 mx-2">
                      <p className="text-[10px] text-zinc-450 text-center leading-relaxed font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {b.history}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredBrands.length === 0 && (
            <div className="col-span-full py-24 text-center border border-dashed border-zinc-900 rounded-3xl bg-zinc-950/20 text-zinc-550 text-xs font-bold uppercase tracking-wider">
              No manufacturers found matching your search.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
