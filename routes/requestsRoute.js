const express = require("express");
const router = express.Router();

const {
    deleterequests, locationrequests, deleteUser, rejectdeac, deleteReq
} = require("../controllers/requests");

router.post("/delreq/:id", deleterequests);
router.get("/locreqs", locationrequests);
router.delete("/delete/:id", deleteUser);
router.delete("/rejectdeac/:id", rejectdeac);
router.get("/deletereq", deleteReq);


module.exports = router;