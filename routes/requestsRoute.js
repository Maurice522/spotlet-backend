const express = require("express");
const router = express.Router();

const { sendDeactivationReq, locationrequests, deleteUser, rejectdeac, getDeleteReqs } = require("../controllers/requests");

router.post("/delreq/:id", sendDeactivationReq);

router.get("/locreqs", locationrequests);

router.delete("/delete/:id", deleteUser);

router.delete("/rejectdeac/:id", rejectdeac);

router.get("/deletereq", getDeleteReqs);


module.exports = router;