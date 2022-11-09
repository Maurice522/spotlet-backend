const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  registerController,
  signInController,
  activationController,
  getUserDataController,
  activationUpdateUserDataController,
  updateUserDataController,
  forgotPasswordController,
  uploadPicController,
  updatePasswordController,
  resetPasswordController,
  getUsersController, 
  updateUserInfo
} = require("../controllers/user");

const memoStorage = multer.memoryStorage();

const upload = multer({ memoStorage });

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

// for account updation
router.post("/updateactivation", activationUpdateUserDataController);

//update user personal_info data
router.put("/user/update/:id", updateUserDataController);

//forgot password
router.post("/forgot-password", forgotPasswordController);

//update password
router.put("/user/updatepassword/:id", updatePasswordController);

//reset password
router.put("/user/reset-password/:id", resetPasswordController);

//upload pic
router.post("/user/upload-pic", upload.single("pic"), uploadPicController);

//update user data
router.post("/updateuser", updateUserInfo);

module.exports = router;
