const express = require("express");
const router = express.Router();
const {
  registerController,
  signInController,
  activationController,
  getUserDataController,
} = require("../controllers/user");
//for registering users
router.post("/signup", registerController);

//for login
router.post("/signin", signInController);

// for account activation
router.post("/activation", activationController);

//get User Data
router.get("/user/:id", getUserDataController);

module.exports = router;
