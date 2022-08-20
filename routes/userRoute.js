const express = require("express");
const router = express.Router();
const {
  registerController,
  signInController,
  activationController,
  getUserDataController,
  updateUserDataController,
  resetPasswordController,
  forgotPasswordController,
  getUsersController
} = require("../controllers/user");
//for registering users
router.post("/signup", registerController);

//for login
router.post("/signin", signInController);

// for account activation
router.post("/activation", activationController);

//get User Data
router.get("/user/:id", getUserDataController);

//get all users
router.get("/users", getUsersController);

//update user data
router.put("/user/update/:id", updateUserDataController);

//forgot password
router.post("/forgot-password", forgotPasswordController);

//reset password
router.put("/user/updatepassword/:id", resetPasswordController);

module.exports = router;
