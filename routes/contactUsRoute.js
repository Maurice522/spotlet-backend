const express = require("express");
const { sendQueriesToGorecce, photoshootRequest,getContact,getPhotoshoot } = require("../controllers/contactUs");
const router = express.Router();

//Contact us
router.post("/contactus", sendQueriesToGorecce);

router.get("/getContact",getContact);


//Photo Graph form
router.post("/photoshootreq", photoshootRequest);

router.get("/getPhotoshoot",getPhotoshoot);


module.exports = router;
