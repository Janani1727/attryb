const express = require("express");
const { MarketplaceInventoryModel } = require("../model/inventory.model");
const { OEMSpecsModel } = require("../model/oemspecs.model");

const MarketplaceInventoryRouter = express.Router();

MarketplaceInventoryRouter.get("/", async (req, res) => {
  
  let { searchModel, sortBy, sortOrder, filterColor, searchYear } = req.query;

  try {
    console.log("hello")
    // Define the query object
    const query = {};

    // Search by model
    if (searchModel) {
      query.model = { $regex: searchModel, $options: "i" };
    }

    // Filter by color
    if (filterColor) {
      const colorRegex = new RegExp(filterColor, "i"); // Case-insensitive regex
      query.availableColors = colorRegex;
    }

    // Search by year
    if (searchYear) {
      query.year = searchYear;
    }

    // Define the sort options
    const sortOptions = {};

    if (sortBy && sortOrder) {
      // Check if sortBy and sortOrder are provided
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
    } else {
     
      sortOptions.listPrice = 1; 
    }
    //  const data = await MarketplaceInventoryModel.find()
    const data = await MarketplaceInventoryModel.find(query).sort(sortOptions).populate('oemSpecs')
    console.log(data)
    res.send(data);
  } catch (err) {
    res.send(err.message);
    console.log("err:", err);
  }
});

// get specific dealer's Inventory
MarketplaceInventoryRouter.get("/dealer", async (req, res) => {
  const ID = req.body.dealer;
  try {
    console.log("ID:", ID);
    const notes = await MarketplaceInventoryModel.find({ dealer: ID })
      .populate("dealer")
      .populate("oemSpecs");
    res.send(notes);
  } catch (err) {
    console.log({ msg: "Error Occured", error: err });
  }
});

MarketplaceInventoryRouter.post("/create", async (req, res) => {
  const payload = req.body;

  const oemSpecsData = payload.oemSpecs;

  const newInventoryItem = await new MarketplaceInventoryModel(
    payload
  ).populate("oemSpecs");
  await newInventoryItem.save();
  // console.log(newInventoryItem);
  res.status(201).json(newInventoryItem);
});

MarketplaceInventoryRouter.delete("/delete/:id", async (req, res) => {
  const ID = req.params.id;
  try {
    await MarketplaceInventoryModel.findByIdAndDelete({ _id: ID });
    res.send(`Note with ID ${ID} Deleted`);
  } catch (err) {
    console.log({ msg: "Error Occured", error: err });
  }
});

// update in specific dealer's Inventory
MarketplaceInventoryRouter.patch("/update/:id", async (req, res) => {
  const ID = req.params.id;
  try {
    let data = await MarketplaceInventoryModel.findByIdAndUpdate(
      { _id: ID },
      req.body
    );
    res.send(data);
  } catch (err) {
    console.log({ msg: "Error Occured", error: err });
  }
});

module.exports = {
  MarketplaceInventoryRouter,
};

