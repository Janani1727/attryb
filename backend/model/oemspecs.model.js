const mongoose = require('mongoose');
require('dotenv').config()

const oemSpecsSchema = mongoose.Schema({
  model: { type: String},
  year: { type: String},
  listPrice: { type: Number},
  availableColors: { type: [String]},
  mileage: { type: Number},
  power: { type: Number},
  maxSpeed: { type: Number}
},{versionKey:false});

oemSpecsSchema.index({ model: "text", year: "text" });

const OEMSpecsModel = mongoose.model('OEMSpecs', oemSpecsSchema);

module.exports = {OEMSpecsModel};