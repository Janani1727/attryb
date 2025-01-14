const express = require("express")
const { OEMSpecsModel } = require("../model/oemspecs.model")
const OEMRouter = express.Router()
const {auth} =require("../middleware/auth.middleware")

OEMRouter.get("/",async (req, res) => {
  let { searchModel, sortBy, sortOrder, filterColor, searchYear } = req.query;

  try {
    // Define the query object
    console.log("hello")
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
      // Default sorting if sortBy or sortOrder is not provided
      sortOptions.listPrice = 1; // Default to ascending order by price
    }

    const data = await OEMSpecsModel.find(query).sort(sortOptions);

    res.send(data);
  } catch (err) {
    res.send(err.message);
    console.log('err:', err);
  }
});



OEMRouter.get("/:id", async (req, res) => {
    const ID = req.params.id
    console.log('id:', ID)
  
    try {
      const data = await OEMSpecsModel.find({_id:ID})
  
      res.send(data);
    } catch (err) {
      res.send(err.message);
      console.log('err:', err);
    }
  });
  

// First Time OEM data POST

OEMRouter.post("/post", async (req, res) => {
  const data = req.body;
  // console.log('data:', data);
  try {
      // Assuming "OEMSpecsModel" is your Mongoose model, insert the data into the database
      const notes = await OEMSpecsModel.insertMany(data);

      // Respond with the saved data
      res.status(201).json(notes); // Respond with HTTP status 201 (Created) and the saved data
  } catch (err) {
      console.error({"msg": "Error Occurred", "error": err});
      res.status(500).json({"error": "An error occurred", "details": err.message});
  }
});




module.exports={
    OEMRouter
}