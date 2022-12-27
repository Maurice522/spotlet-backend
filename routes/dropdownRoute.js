const express = require("express");
const router = express.Router();

const { createCity, getCities, createLocType, getLocTypes } = require("../controllers/dropdowns");

//CITIES
router.post("/createcity", createCity);

router.get("/getcities", getCities);


//LOCATION TYPE
router.post("/createloctype", createLocType);

router.get("/getloctypes", getLocTypes);


module.exports = router;