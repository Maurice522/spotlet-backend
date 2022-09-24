const express = require("express");
const router = express.Router();
const { locationBookController, bookingReq, getBookingDetail, updateBookingStatus, deleteBookingReq } = require("../controllers/booking");


router.post("/bookingreq", locationBookController);

router.get("/totrequest/:locId", bookingReq);

router.put("/getbookingdetail/:bookingId", getBookingDetail)

router.put("/updatepaymentstatus", updateBookingStatus);

router.delete("/deletebookingrequest", deleteBookingReq);

module.exports = router;