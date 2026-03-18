const mongoose = require('mongoose');
const s = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true, unique:true },
  widgets: { type: Array,  default: [] },
  layouts: { type: Object, default: {} },
}, { timestamps: true });
module.exports = mongoose.model('Dashboard', s);
