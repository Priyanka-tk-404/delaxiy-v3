require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET missing in .env — add: JWT_SECRET=delaxiy_secret_2025');
  process.exit(1);
}

const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const app      = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ status:'ok', app:'DeLaxiY API v4' }));
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/orders',    require('./middleware/auth').protect, require('./routes/orders'));
app.use('/api/dashboard', require('./middleware/auth').protect, require('./routes/dashboard'));
app.use((err, req, res, next) => res.status(500).json({ message: err.message }));

const PORT  = process.env.PORT     || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/delaxiy';

mongoose.connect(MONGO)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 DeLaxiY API on http://localhost:${PORT}`));
  })
  .catch(e => { console.error('❌', e.message); process.exit(1); });
app.get("/", (req, res) => {
  res.send("DeLaxiY Backend is Running 🚀");
});