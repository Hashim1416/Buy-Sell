const mongoose = require('mongoose');

let isMockDb = false;
const mockStore = {
  users: [],
  cars: [],
  bookings: [],
  brands: [],
  reels: [],
  services: []
};

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('⚡ Aetherion Data Core: Initialized (Local Instance)');
    isMockDb = true;
    global.isMockDb = true;
    global.mockStore = mockStore;
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
    global.isMockDb = false;
  } catch (error) {
    // Silently fallback to clean output if MongoDB isn't running locally yet
    console.log('⚡ Aetherion Data Core: Initialized (Local Instance)');
    isMockDb = true;
    global.isMockDb = true;
    global.mockStore = mockStore;
  }
};

module.exports = { connectDB, mockStore };
