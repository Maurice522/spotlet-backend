const express = require("express");
const router = express.Router();

const { sendQueriesToSpotlet, photoshootRequest, getContact, getPhotoshoot } = require("../controllers/contactUs");

//Contact us
router.post("/contactus", sendQueriesToSpotlet);

router.get("/getContact", getContact);


//Photo Graph form
router.post("/photoshootreq", photoshootRequest);

router.get("/getPhotoshoot", getPhotoshoot);


module.exports = router;
