const express = require("express");
const router = express.Router();

const { locationCreate, getAllLocations, tempLocation } = require("../controllers/location");

//Create a Temporary Location
router.post("/templocation", tempLocation)

//Creating a Location.
router.post("/createlocation", locationCreate);

//Get All Locations
router.get("/getlocations", getAllLocations);


module.exports = router;
