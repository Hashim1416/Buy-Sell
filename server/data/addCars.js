const fs = require('fs');
const path = require('path');

const newCars = [
  // Supercars
  {
    name: "P1", brand: "McLaren Automotive", category: "Supercars", price: 1150000, year: 2013,
    image: "https://images.unsplash.com/photo-1620882613583-0570a2ea9cbf?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 903, torque: 664, topSpeed: 217, acceleration: "2.8s", fuelType: "Hybrid", batteryRange: 19, safetyRating: "5 Star", features: ["Active Aerodynamics"] },
    colors: ["Yellow", "Orange", "Black"], isTrending: true, isNewLaunch: false
  },
  {
    name: "LaFerrari", brand: "Ferrari", category: "Supercars", price: 1400000, year: 2015,
    image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 950, torque: 664, topSpeed: 218, acceleration: "2.4s", fuelType: "Hybrid", batteryRange: 0, safetyRating: "5 Star", features: ["HY-KERS System"] },
    colors: ["Red", "Black"], isTrending: true, isNewLaunch: false
  },
  {
    name: "Chiron", brand: "Bugatti", category: "Supercars", price: 3000000, year: 2022,
    image: "https://images.unsplash.com/photo-1627454820516-dc7671ce9e1c?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 1479, torque: 1180, topSpeed: 261, acceleration: "2.4s", fuelType: "Gasoline", batteryRange: 0, safetyRating: "5 Star", features: ["W16 Engine"] },
    colors: ["Blue", "Black"], isTrending: true, isNewLaunch: false
  },

  // Sports Cars
  {
    name: "911 GT3", brand: "Porsche", category: "Sports Cars", price: 182900, year: 2024,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 502, torque: 346, topSpeed: 197, acceleration: "3.2s", fuelType: "Gasoline", batteryRange: 0, safetyRating: "5 Star", features: ["PDK Transmission"] },
    colors: ["Silver", "Blue", "Black"], isTrending: true, isNewLaunch: false
  },
  {
    name: "Corvette Z06", brand: "Chevrolet", category: "Sports Cars", price: 112700, year: 2024,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 670, torque: 460, topSpeed: 195, acceleration: "2.6s", fuelType: "Gasoline", batteryRange: 0, safetyRating: "5 Star", features: ["Flat-plane V8"] },
    colors: ["Red", "White", "Yellow"], isTrending: true, isNewLaunch: false
  },
  {
    name: "GT-R NISMO", brand: "Nissan", category: "Sports Cars", price: 220990, year: 2024,
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 600, torque: 481, topSpeed: 205, acceleration: "2.5s", fuelType: "Gasoline", batteryRange: 0, safetyRating: "5 Star", features: ["ATTESA E-TS AWD"] },
    colors: ["White", "Silver", "Black"], isTrending: false, isNewLaunch: false
  },

  // EV Cars
  {
    name: "Taycan Turbo S", brand: "Porsche", category: "EV Cars", price: 194900, year: 2024,
    image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 750, torque: 774, topSpeed: 161, acceleration: "2.6s", fuelType: "Electric", batteryRange: 222, safetyRating: "5 Star", features: ["800-Volt Architecture"] },
    colors: ["White", "Blue", "Black"], isTrending: true, isNewLaunch: false
  },
  {
    name: "Air Sapphire", brand: "Lucid", category: "EV Cars", price: 249000, year: 2024,
    image: "https://images.unsplash.com/photo-1678170849319-74d306b9b32c?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 1234, torque: 1430, topSpeed: 205, acceleration: "1.89s", fuelType: "Electric", batteryRange: 427, safetyRating: "5 Star", features: ["Tri-Motor AWD"] },
    colors: ["Blue", "Black", "Silver"], isTrending: true, isNewLaunch: false
  },
  {
    name: "Model S Plaid", brand: "Tesla", category: "EV Cars", price: 89990, year: 2024,
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 1020, torque: 1050, topSpeed: 200, acceleration: "1.99s", fuelType: "Electric", batteryRange: 359, safetyRating: "5 Star", features: ["Yoke Steering"] },
    colors: ["Red", "White", "Black"], isTrending: true, isNewLaunch: false
  },

  // Off-Road Cars
  {
    name: "G-Class G63", brand: "Mercedes-Benz", category: "Off-Road Cars", price: 179000, year: 2024,
    image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 577, torque: 627, topSpeed: 149, acceleration: "4.5s", fuelType: "Gasoline", batteryRange: 0, safetyRating: "4 Star", features: ["3 Locking Differentials"] },
    colors: ["Black", "White", "Silver"], isTrending: true, isNewLaunch: false
  },
  {
    name: "Defender V8", brand: "Land Rover", category: "Off-Road Cars", price: 111300, year: 2024,
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 518, torque: 461, topSpeed: 149, acceleration: "4.9s", fuelType: "Gasoline", batteryRange: 0, safetyRating: "5 Star", features: ["Terrain Response 2"] },
    colors: ["Green", "Black", "Grey"], isTrending: true, isNewLaunch: false
  },
  {
    name: "Bronco Raptor", brand: "Ford", category: "Off-Road Cars", price: 89835, year: 2024,
    image: "https://images.unsplash.com/photo-1627042633145-b780d842ba45?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 418, torque: 440, topSpeed: 114, acceleration: "5.6s", fuelType: "Gasoline", batteryRange: 0, safetyRating: "4 Star", features: ["G.O.A.T Modes", "Fox Shocks"] },
    colors: ["Orange", "Blue", "Black"], isTrending: true, isNewLaunch: false
  },

  // New and Futures Cars
  {
    name: "Valhalla", brand: "Aston Martin", category: "New and Futures Cars", price: 800000, year: 2025,
    image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 998, torque: 738, topSpeed: 217, acceleration: "2.5s", fuelType: "Hybrid", batteryRange: 9, safetyRating: "5 Star", features: ["F1 Technology", "Carbon Fiber Tub"] },
    colors: ["Silver", "Green"], isTrending: true, isNewLaunch: true
  },
  {
    name: "Lanzador", brand: "Lamborghini", category: "New and Futures Cars", price: 300000, year: 2028,
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 1341, torque: 1000, topSpeed: 190, acceleration: "2.8s", fuelType: "Electric", batteryRange: 300, safetyRating: "5 Star", features: ["Ultra-GT Design", "Active Aero"] },
    colors: ["Blue", "Silver"], isTrending: true, isNewLaunch: true
  },
  {
    name: "Celestiq", brand: "Cadillac", category: "New and Futures Cars", price: 340000, year: 2025,
    image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 600, torque: 640, topSpeed: 130, acceleration: "3.8s", fuelType: "Electric", batteryRange: 300, safetyRating: "5 Star", features: ["Hand-Built", "Smart Glass Roof"] },
    colors: ["Black", "Blue", "Silver"], isTrending: true, isNewLaunch: true
  },

  // Old Cars
  {
    name: "Supra RZ", brand: "Toyota", category: "Old Cars", price: 85000, year: 1998,
    image: "https://images.unsplash.com/photo-1603513492128-ba7bc9b0e143?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 320, torque: 315, topSpeed: 155, acceleration: "4.6s", fuelType: "Gasoline", batteryRange: 0, safetyRating: "3 Star", features: ["2JZ-GTE Engine"] },
    colors: ["White", "Black", "Red"], isTrending: true, isNewLaunch: false
  },
  {
    name: "RX-7 Spirit R", brand: "Mazda", category: "Old Cars", price: 75000, year: 2002,
    image: "https://images.unsplash.com/photo-1555542456-4b6848259d07?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 276, torque: 231, topSpeed: 155, acceleration: "5.0s", fuelType: "Gasoline", batteryRange: 0, safetyRating: "3 Star", features: ["Rotary Engine"] },
    colors: ["Silver", "Blue", "Yellow"], isTrending: false, isNewLaunch: false
  },
  {
    name: "NSX Type-R", brand: "Honda", category: "Old Cars", price: 120000, year: 1992,
    image: "https://images.unsplash.com/photo-1633511874225-b46c2f90a612?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 270, torque: 210, topSpeed: 168, acceleration: "5.0s", fuelType: "Gasoline", batteryRange: 0, safetyRating: "3 Star", features: ["VTEC V6 Engine", "Aluminum Body"] },
    colors: ["White", "Red"], isTrending: true, isNewLaunch: false
  },

  // Vintage Cars
  {
    name: "E-Type Series 1", brand: "Jaguar", category: "Vintage Cars", price: 250000, year: 1961,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0be2?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 265, torque: 260, topSpeed: 150, acceleration: "7.1s", fuelType: "Gasoline", batteryRange: 0, safetyRating: "None", features: ["Iconic Design", "Straight-6"] },
    colors: ["Green", "Silver"], isTrending: true, isNewLaunch: false
  },
  {
    name: "DB5", brand: "Aston Martin", category: "Vintage Cars", price: 1000000, year: 1964,
    image: "https://images.unsplash.com/photo-1621213076296-857c1bb4ccab?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 282, torque: 288, topSpeed: 143, acceleration: "8.0s", fuelType: "Gasoline", batteryRange: 0, safetyRating: "None", features: ["Superleggera Body"] },
    colors: ["Silver", "Green"], isTrending: true, isNewLaunch: false
  },
  {
    name: "300 SL Gullwing", brand: "Mercedes-Benz", category: "Vintage Cars", price: 1500000, year: 1954,
    image: "https://images.unsplash.com/photo-1563283944-cdb5d63ec200?auto=format&fit=crop&w=1200&q=80",
    gallery: [], specs: { horsepower: 215, torque: 202, topSpeed: 161, acceleration: "8.8s", fuelType: "Gasoline", batteryRange: 0, safetyRating: "None", features: ["Gullwing Doors"] },
    colors: ["Silver", "Red"], isTrending: true, isNewLaunch: false
  }
];

const filePath = path.join(__dirname, 'carsSeed.js');
let content = fs.readFileSync(filePath, 'utf8');

// The file ends with:
//   }
// ];
// module.exports = carsSeed;

// We need to insert the new cars before the array closes.
const closingIndex = content.lastIndexOf('];');
if (closingIndex !== -1) {
  const newCarsString = newCars.map(car => JSON.stringify(car, null, 2)).join(',\n  ') + '\n';
  
  // Insert a comma if the array isn't empty before the closing bracket
  const part1 = content.slice(0, closingIndex).trimRight();
  const insertContent = (part1.endsWith('[') ? '\n  ' : ',\n  ') + newCarsString;
  const part2 = content.slice(closingIndex);
  
  const finalContent = part1 + insertContent + part2;
  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log('Successfully added ' + newCars.length + ' new cars.');
} else {
  console.error('Could not find the closing bracket of carsSeed array.');
}
