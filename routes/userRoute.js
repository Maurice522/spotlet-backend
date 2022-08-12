const express = require("express");
const router = express.Router();
const {
  registerController,
  signInController,
  activationController,
  getUserDataController,
  updateUserDataController,
  resetPasswordController,
} = require("../controllers/user");
//for registering users
router.post("/signup", registerController);

//for login
router.post("/signin", signInController);

// for account activation
router.post("/activation", activationController);

//get User Data
router.get("/user/:id", getUserDataController);

//update user data
router.put("/user/update/:id", updateUserDataController);

//reset password
router.put("/user/updatepassword", resetPasswordController);

module.exports = router;
