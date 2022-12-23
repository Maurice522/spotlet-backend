const express = require("express");
const { createCity, getCities, createLocType, getLocTypes } = require("../controllers/dropdowns");
const router = express.Router();

router.post("/createcity", createCity);

router.get("/getcities", getCities);

router.post("/createloctype", createLocType);

router.get("/getloctypes", getLocTypes);


module.exports = router;