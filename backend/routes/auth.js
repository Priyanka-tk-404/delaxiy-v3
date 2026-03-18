const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');
const router  = express.Router();

const sign = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    if (await User.findOne({ email })) return res.status(409).json({ message: 'Email already registered' });
    const user  = await User.create({ name, email, password });
    res.status(201).json({ token: sign(user._id), user });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: sign(user._id), user: user.toJSON() });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/me', protect, (req, res) => res.json({ user: req.user }));

module.exports = router;
