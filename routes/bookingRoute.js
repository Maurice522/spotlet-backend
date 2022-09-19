const express = require("express");
const router = express.Router();
const { locationBookController, bookingReq } = require("../controllers/booking");


router.post("/bookingreq", locationBookController);

router.get("/totbookings/:locId", bookingReq);

module.exports = router;