const express = require("express");
const router = express.Router();

const { getNoOfUsers, getNoOfLoctaions, getNoOfBookings, getNoOfRequests, getAllLocations, sendMsgToAllUsers } = require("../controllers/admin");

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

//msg all users
router.post("/announcement", sendMsgToAllUsers)

module.exports = router;
