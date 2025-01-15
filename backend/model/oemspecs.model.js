const mongoose = require('mongoose');
require('dotenv').config()

const oemSpecsSchema = mongoose.Schema({
  model: { type: String},
  year: { type: String},
  listPrice: { type: String},
  availableColors: { type: [String]},
  mileage: { type: String},
  power: { type: String},
  maxSpeed: { type: String}
},{versionKey:false});

oemSpecsSchema.index({ model: "text", year: "text" });

const OEMSpecsModel = mongoose.model('OEMSpecs', oemSpecsSchema);

module.exports = {OEMSpecsModel};