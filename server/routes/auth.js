const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'aetherion_private_secure_key';

// Demo Accounts Store
const demoUsers = [
  {
    name: "Alistair Aetherion",
    email: "admin@aetherionmotors.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
    wishlist: []
  },
  {
    name: "Elite Client",
    email: "user@aetherionmotors.com",
    password: bcrypt.hashSync("user123", 10),
    role: "user",
    wishlist: []
  }
];

// Seed initial users if using live DB
const seedUsers = async () => {
  if (!global.isMockDb) {
    try {
      const count = await User.countDocuments();
      if (count === 0) {
        await User.insertMany(demoUsers);
        console.log('✅ Demo Users Seeded to MongoDB');
      }
    } catch (e) {
      console.error('Failed to seed users', e);
    }
  }
};
setTimeout(seedUsers, 2000);

// Helper to get all users
async function getUsers() {
  if (global.isMockDb) {
    if (global.mockStore.users.length === 0) {
      // Initialize in memory
      global.mockStore.users = demoUsers.map((u, i) => ({
        id: `mock-user-${i}`,
        ...u
      }));
    }
    return global.mockStore.users;
  }
  return await User.find();
}

// Helper to save user
async function saveUser(userData) {
  if (global.isMockDb) {
    const idx = global.mockStore.users.findIndex(u => u.email === userData.email);
    if (idx !== -1) {
      global.mockStore.users[idx] = { ...global.mockStore.users[idx], ...userData };
      return global.mockStore.users[idx];
    }
    return userData;
  } else {
    let user = await User.findOne({ email: userData.email });
    if (user) {
      Object.assign(user, userData);
      await user.save();
    }
    return user;
  }
}

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await getUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const userId = user.id || user._id.toString();
    const payload = {
      id: userId,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: payload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const users = await getUsers();
    const user = users.find(u => (u.id || u._id.toString()) === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Automatically clear default seeded wishlist items to start with an empty list
    if (user.wishlist && (user.wishlist.includes("Revuelto") || user.wishlist.includes("Lamborghini Revuelto"))) {
      user.wishlist = user.wishlist.filter(item => item !== "Revuelto" && item !== "Lamborghini Revuelto");
      await saveUser(user);
    }

    res.json({
      id: user.id || user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      wishlist: user.wishlist || []
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/auth/wishlist
router.post('/wishlist', auth, async (req, res) => {
  const { carId } = req.body;
  try {
    const users = await getUsers();
    const user = users.find(u => (u.id || u._id.toString()) === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.wishlist) user.wishlist = [];
    const index = user.wishlist.indexOf(carId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(carId);
    }

    await saveUser(user);
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
