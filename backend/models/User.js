const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const s = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar:   { type: String, default: '' },
}, { timestamps: true });
s.pre('save', async function(n) { if (!this.isModified('password')) return n(); this.password = await bcrypt.hash(this.password,12); n(); });
s.methods.matchPassword = function(p) { return bcrypt.compare(p, this.password); };
s.methods.toJSON = function() { const o = this.toObject(); delete o.password; return o; };
module.exports = mongoose.model('User', s);
