const express = require("express");
const router = express.Router();

const { locationBookController, locationBookings, getBookingDetail, updateBookingStatus, deleteBookingReq } = require("../controllers/booking");


router.post("/bookingreq", locationBookController);

router.get("/totrequest/:locId", locationBookings);

router.get("/getbookingdetail/:bookingId", getBookingDetail)

router.put("/updatepaymentstatus", updateBookingStatus);

router.delete("/deletebookingrequest", deleteBookingReq);

// router.post("/smsotp", mobileOtpVerify);

module.exports = router;
// AIzaSyDc_uYSzZP64UG7UNmYeE6uwlgklyiBjFA