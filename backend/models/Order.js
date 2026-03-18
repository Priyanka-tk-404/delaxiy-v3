const mongoose = require('mongoose');

// Auto-generate CUST and ORD IDs
async function getNextSeq(model, prefix) {
  const last = await model.findOne({}, {}, { sort: { createdAt: -1 } });
  if (!last) return `${prefix}-0001`;
  const parts = (last[prefix === 'CUST' ? 'customerId' : 'orderId'] || '').split('-');
  const num = parseInt(parts[1] || 0) + 1;
  return `${prefix}-${String(num).padStart(4, '0')}`;
}

const orderSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerId:  { type: String },
  orderId:     { type: String },
  firstName:   { type: String, required: true },
  lastName:    { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String, required: true },
  street:      { type: String, required: true },
  city:        { type: String, required: true },
  state:       { type: String, required: true },
  postalCode:  { type: String, required: true },
  country:     { type: String, required: true },
  product:     { type: String, required: true, enum: ['Fiber Internet 300 Mbps','5G Unlimited Mobile Plan','Fiber Internet 1 Gbps','Business Internet 500 Mbps','VoIP Corporate Package'] },
  quantity:    { type: Number, required: true, min: 1, default: 1 },
  unitPrice:   { type: Number, required: true },
  totalAmount: { type: Number },
  status:      { type: String, enum: ['Pending','In progress','Completed'], default: 'Pending' },
  createdBy:   { type: String, required: true },
  orderDate:   { type: Date, default: Date.now },
}, { timestamps: true });

orderSchema.pre('save', async function(next) {
  this.totalAmount = this.quantity * this.unitPrice;
  if (!this.customerId) this.customerId = await getNextSeq(this.constructor, 'CUST');
  if (!this.orderId)    this.orderId    = await getNextSeq(this.constructor, 'ORD');
  next();
});

module.exports = mongoose.model('Order', orderSchema);
