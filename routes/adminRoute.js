const express = require("express");
const router = express.Router();

const {
    getNoOfUsers,
    getNoOfLoctaions,
    getNoOfBookings,
    getNoOfRequests,
    getAllLocations,
    sendMsgToAllUsers,
    signInAdmin,
    forgotPasswordAdmin,
    resetPasswordAdmin
} = require("../controllers/admin");

//get no. of active users
router.get("/noofusers", getNoOfUsers);

//get no. of locations
router.get("/nooflocations", getNoOfLoctaions);

//get no. of bookings
router.get("/noofbookings", getNoOfBookings);

//get no. of requests
router.get("/noofrequests", getNoOfRequests);

//get all locations, approved and pending
router.get("/listalllocatons", getAllLocations);

//msg all users
router.post("/announcement", sendMsgToAllUsers);

//admin signin
router.post("/admin-signin", signInAdmin);

//forgot password
router.post("/admin-forgot-password", forgotPasswordAdmin);

//reset password
router.put("/reset-password/:id", resetPasswordAdmin);

module.exports = router;
