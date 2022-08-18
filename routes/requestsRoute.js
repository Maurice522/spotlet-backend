const express = require("express");
const router = express.Router();

const {
    deleterequests
} = require("../controllers/requests");


router.post("/delreq/:id",deleterequests);


module.exports = router;
