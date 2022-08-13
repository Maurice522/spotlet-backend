const express = require("express");
const router = express.Router();

const {
    locationCreate
} = require("../controllers/location");

//Creating a Location.
router.post("/createl", locationCreate);


module.exports = router;

