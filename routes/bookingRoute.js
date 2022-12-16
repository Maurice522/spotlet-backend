const express = require("express");
const router = express.Router();
const { locationBookController, bookingReq, getBookingDetail, updateBookingStatus, deleteBookingReq, updateBooking } = require("../controllers/booking");


router.post("/bookingreq", locationBookController);

router.get("/totrequest/:locId", bookingReq);

router.put("/getbookingdetail/:bookingId", getBookingDetail)

router.put("/updatepaymentstatus", updateBookingStatus);

router.put("/updatebooking", updateBooking);

router.delete("/deletebookingrequest", deleteBookingReq);

// router.post("/smsotp", mobileOtpVerify);

module.exports = router;
// AIzaSyDc_uYSzZP64UG7UNmYeE6uwlgklyiBjFA