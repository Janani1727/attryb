const mongoose = require('mongoose');
require('dotenv').config()

const marketplaceInventorySchema = mongoose.Schema({
  image: { type: String }, 
  title: { type: String }, 
  description: { type: [String] },
  kmsOnOdometer: { type: Number }, 
  majorScratches: { type: Boolean, default: false }, 
  originalPaint: { type: Boolean, default: true },  
  accidentsReported: { type: Number, default: 0 }, 
  previousBuyers: { type: Number, default: 0 }, 
  registrationPlace: { type: String }, 
  currentPrice: { type: Number, default: 0 }, 
  dealer: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer' }, 
  oemSpecs: { type: mongoose.Schema.Types.ObjectId, ref: 'OEMSpecs' }
},{versionKey:false});

marketplaceInventorySchema.index({ title: "text", description: "text" });

const MarketplaceInventoryModel = mongoose.model('MarketplaceInventory', marketplaceInventorySchema);

module.exports = {MarketplaceInventoryModel};