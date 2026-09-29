const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true }, // Supercars, Sports, Hybrid, EV, Off-Road
  price: { type: Number, required: true },
  year: { type: Number, required: true },
  image: { type: String, required: true },
  gallery: [{ type: String }],
  specs: {
    horsepower: { type: Number },
    torque: { type: Number },
    topSpeed: { type: Number },
    acceleration: { type: String },
    fuelType: { type: String },
    batteryRange: { type: Number },
    safetyRating: { type: String },
    features: [{ type: String }]
  },
  colors: [{ type: String }],
  isTrending: { type: Boolean, default: false },
  isNewLaunch: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Car || mongoose.model('Car', CarSchema);
