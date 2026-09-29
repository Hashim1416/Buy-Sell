const mongoose = require('mongoose');
const Car = require('./models/Car');
require('dotenv').config();

async function updateDb() {
  if (!process.env.MONGODB_URI) {
    console.log('No MONGODB_URI. Server uses mock DB. carsSeed.js is updated, so just restart the server.');
    process.exit(0);
  }
  
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');
  
  const cars = await Car.find({ name: / Concept$/ });
  console.log(`Found ${cars.length} cars ending with " Concept".`);
  
  for (const car of cars) {
    const newName = car.name.replace(/ Concept$/, '');
    await Car.updateOne({ _id: car._id }, { $set: { name: newName } });
    console.log(`Updated ${car.name} -> ${newName}`);
  }
  
  console.log('Done.');
  process.exit(0);
}

updateDb().catch(err => {
  console.error(err);
  process.exit(1);
});
