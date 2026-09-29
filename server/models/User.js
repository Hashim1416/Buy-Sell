const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  wishlist: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// Avoid OverwriteModelError if compiling multiple times
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
