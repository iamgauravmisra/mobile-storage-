const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  receiptId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  modelName: { type: String, required: true },
  pricePaid: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  guaranteeUntil: { type: Date, required: true }
});

module.exports = mongoose.model('Receipt', receiptSchema);