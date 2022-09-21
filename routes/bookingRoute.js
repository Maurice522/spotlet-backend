const express = require("express");
const router = express.Router();
const { locationBookController, bookingReq, getBookingDetail, updateBookingStatus } = require("../controllers/booking");


router.post("/bookingreq", locationBookController);

router.get("/totrequest/:locId", bookingReq);

router.get("/getbookingdetail/:bookingId", getBookingDetail)

router.put("/updatepaymentstatus", updateBookingStatus);

module.exports = router;