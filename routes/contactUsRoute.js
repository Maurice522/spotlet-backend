const express = require("express");
const { sendQueriesToGorecce, photoshootRequest } = require("../controllers/contactUs");
const router = express.Router();

//Contact us
router.post("/contactus", sendQueriesToGorecce);

//Photo Graph form
router.post("/photoshootreq", photoshootRequest);

module.exports = router;
