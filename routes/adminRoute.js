const express = require("express");
const { getNoOfUsers, getNoOfLoctaions, getNoOfBookings, getNoOfRequests, getAllLocations } = require("../controllers/admin");
const { getLocation } = require("../controllers/location");
const router = express.Router();

//get no. of active users
router.get("/noofusers", getNoOfUsers);

//get no. of locations
router.get("/nooflocations", getNoOfLoctaions);

//get no. of bookings
router.get("/noofbookings", getNoOfBookings);

//get no. of requests
router.get("/noofrequests", getNoOfRequests);

//get all locations, approved and pending
router.get("/listalllocatons", getAllLocations)

module.exports = router;
