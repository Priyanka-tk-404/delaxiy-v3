const express   = require('express');
const Dashboard = require('../models/Dashboard');
const router    = express.Router();

router.get('/', async (req, res) => {
  try { res.json(await Dashboard.findOne({ user: req.user._id }) || { widgets: [], layouts: {} }); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/', async (req, res) => {
  try {
    const dash = await Dashboard.findOneAndUpdate({ user: req.user._id }, { ...req.body, user: req.user._id }, { new: true, upsert: true });
    res.json(dash);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
