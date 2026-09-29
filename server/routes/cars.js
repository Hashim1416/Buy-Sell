const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const auth = require('../middleware/auth');
const carsSeed = require('../data/carsSeed');

// Helper to get cars
async function getCars() {
  if (global.isMockDb) {
    if (global.mockStore.cars.length === 0) {
      global.mockStore.cars = carsSeed.map((c, i) => ({
        id: `mock-car-${i}`,
        ...c
      }));
    }
    return global.mockStore.cars;
  }
  
  let cars = await Car.find();
  if (cars.length === 0) {
    cars = await Car.insertMany(carsSeed);
    console.log('✅ Seeding initial cars to MongoDB complete');
  }
  return cars;
}

// GET all cars
router.get('/', async (req, res) => {
  try {
    const cars = await getCars();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching cars' });
  }
});

// GET single car
router.get('/:id', async (req, res) => {
  try {
    const cars = await getCars();
    const car = cars.find(c => (c.id || c._id.toString()) === req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create car (Admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin only' });
  }

  const { name, brand, category, price, year, image, specs, colors, isTrending, isNewLaunch } = req.body;
  try {
    if (global.isMockDb) {
      const newCar = {
        id: `mock-car-${Date.now()}`,
        name, brand, category, price: Number(price), year: Number(year), image,
        specs: specs || { horsepower: 0, torque: 0, topSpeed: 0, acceleration: 'N/A', fuelType: 'Gasoline', batteryRange: 0, safetyRating: '5 Star', features: [] },
        colors: colors || ['Black'],
        isTrending: !!isTrending,
        isNewLaunch: !!isNewLaunch,
        createdAt: new Date()
      };
      global.mockStore.cars.push(newCar);
      return res.status(201).json(newCar);
    } else {
      const newCar = new Car({
        name, brand, category, price, year, image, specs, colors, isTrending, isNewLaunch
      });
      await newCar.save();
      return res.status(201).json(newCar);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating car' });
  }
});

// PUT update car (Admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin only' });
  }

  try {
    if (global.isMockDb) {
      const idx = global.mockStore.cars.findIndex(c => c.id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Car not found' });
      
      const updated = {
        ...global.mockStore.cars[idx],
        ...req.body,
        price: req.body.price ? Number(req.body.price) : global.mockStore.cars[idx].price,
        year: req.body.year ? Number(req.body.year) : global.mockStore.cars[idx].year
      };
      global.mockStore.cars[idx] = updated;
      return res.json(updated);
    } else {
      const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedCar) return res.status(404).json({ message: 'Car not found' });
      return res.json(updatedCar);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE car (Admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin only' });
  }

  try {
    if (global.isMockDb) {
      const idx = global.mockStore.cars.findIndex(c => c.id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Car not found' });
      global.mockStore.cars.splice(idx, 1);
      return res.json({ message: 'Car deleted successfully' });
    } else {
      const deletedCar = await Car.findByIdAndDelete(req.params.id);
      if (!deletedCar) return res.status(404).json({ message: 'Car not found' });
      return res.json({ message: 'Car deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
