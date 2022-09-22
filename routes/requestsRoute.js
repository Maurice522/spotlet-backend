const express = require("express");
const router = express.Router();

const {
    deleterequests,locationrequests
} = require("../controllers/requests");


router.post("/delreq/:id",deleterequests);

router.get("/locreqs",locationrequests);





module.exports = router;
