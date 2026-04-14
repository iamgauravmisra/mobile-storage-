const Mobile = require('../models/Mobile');
const Receipt = require('../models/Receipt');

const getMobiles = async (req, res) => {
  try {
    const mobiles = await Mobile.find().sort({ createdAt: -1 });
    res.status(200).json(mobiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMobile = async (req, res) => {
  try {
    const mobile = await Mobile.create(req.body);
    res.status(201).json(mobile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const processSale = async (req, res) => {
  try {
    const { id } = req.params;
    let { customerName, customerPhone, customerAddress } = req.body;
    
    // Trim to prevent hidden space errors
    const cleanPhone = customerPhone.toString().trim();

    // 10-Digit Validation
    if (!/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits." });
    }

    const updatedMobile = await Mobile.findOneAndUpdate(
      { _id: id, stockQuantity: { $gt: 0 } },
      { $inc: { stockQuantity: -1 } },
      { new: true }
    );

    if (!updatedMobile) return res.status(400).json({ message: "Asset out of stock" });

    // Guarantee logic (1 year)
    const guaranteeDate = new Date();
    guaranteeDate.setFullYear(guaranteeDate.getFullYear() + 1);

    const newReceipt = await Receipt.create({
      receiptId: `INV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      customerName,
      customerPhone: cleanPhone,
      customerAddress,
      modelName: updatedMobile.modelName,
      pricePaid: updatedMobile.price,
      guaranteeUntil: guaranteeDate
    });

    res.status(200).json({ receipt: newReceipt, updatedMobile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMobile = async (req, res) => {
  try {
    await Mobile.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMobiles, addMobile, deleteMobile, processSale };