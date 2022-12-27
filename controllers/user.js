"use strict";

// const fireAdmin = require("firebase-admin");
// const db = fireAdmin.firestore();
// const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
// const storage = require("../firebase");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {
  JWT_SECRET,
  EMAIL_FROM,
  SIB_API,
} = require("../config/key");
const Sib = require('sib-api-v3-sdk');
const User = require("../models/User");

const client = Sib.ApiClient.instance

const apiKey = client.authentications['api-key']
apiKey.apiKey = SIB_API

const tranEmailApi = new Sib.TransactionalEmailsApi();
const sender = {
  email: EMAIL_FROM,
  name: "Spotlet"
}

const registerController = async (req, res) => {
  try {

    const fullName = req.body.firstName + " " + req.body.lastName;
    const salt = await bcrypt.genSalt(13);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      personalInfo: {
        fullName: fullName,
        mobile: req.body.mobile,
        email: req.body.email,
        password: hashedPassword,
        booking_type: req.body.booking_type,
        [req.body.booking_type === "individual" ? "profession" : "company"]:
          req.body.booking_type === "individual" ? req.body.profession : req.body.company,
        profile_pic: "",
      },
      favourites: [],
      listedLocations: [],
      portfolio: [],
      notifications: [],
      notificationFlag: false,
    });

    // if user already exsist
    const exsitedUserEmail = await User.findOne({ "personalInfo.email": req.body.email });
    if (exsitedUserEmail)
      return res.status(403).json("email already exsist");

    const exsitedUserMobile = await User.findOne({ "personalInfo.mobile": req.body.mobile });
    if (exsitedUserMobile)
      return res.status(403).json("mobile already exsist");

    const createdUser = await newUser.save();

    const receivers = [{ email: req.body.email },]
    const emailData = {
      sender,
      to: receivers,
      subject: "Welcome to Spotlet",
      htmlContent: ` <p style=text-align:center;>SpotLet connects people through unique spaces. 
      State-of-the-art online platform enables guests to look for specific locations, 
      communicate with their hosts, and make payments quickly, all in a single place. 
      They aspire to create a community wherein you can always meet, create and 
      celebrate with like-minded people through our online marketplace. 
      So book the best spaces for any activity and enjoy a rewarding experience. 
      We aspire to provide guests with a simplified booking platform and 
      give property owners in India a channel to showcase their spaces and earn additional income. </p>`,
    };

    await tranEmailApi.sendTransacEmail(emailData);

    res.status(200).send("User has been created!");
  } catch (error) {
    return res.status(400).send(error);
  }
};

const activationController = async (req, res) => {
  try {
    const { firstName, lastName, mobile, email, password, booking_type } = req.body;
    if (!firstName || !mobile || !email || !password || !booking_type)
      return res.status(400).json({ error: "please fill all fields" });

    // if user already exsist
    const exsitedUserEmail = await User.findOne({ "personalInfo.email": req.body.email });
    if (exsitedUserEmail)
      return res.status(403).json("email already exsist");

    const exsitedUserMobile = await User.findOne({ "personalInfo.mobile": req.body.mobile });
    if (exsitedUserMobile)
      return res.status(403).json("mobile already exsist");

    //otp
    let verification_code = "";
    const characters = "0123456789";
    for (let i = 0; i < 4; i++)
      verification_code +=
        characters[Math.floor(Math.random() * characters.length)];

    const receivers = [{ email: email },]
    const emailData = {
      sender,
      to: receivers,
      subject: "Account activation link",
      htmlContent: ` <p style=text-align:center;>Please use the following code to activate your account - </p>
            <h2 style=text-align:center;>${verification_code}</h3>
            <hr />`,
    };

    await tranEmailApi.sendTransacEmail(emailData);

    return res.status(200).json({ otp: verification_code, message: "OTP Sent" });
  } catch (error) {
    return res.json(error);
  }
};

const signInController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Please add details!" });

    //find user
    const user = await User.findOne({ "personalInfo.email": req.body.email });
    if (!user)
      return res.status(404).json({ error: "User does not exsist!" });

    const doMatch = await bcrypt.compare(password, user.personalInfo.password);

    if (doMatch) {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
      console.log(token);
      return res.status(200).json({ token: token });
    } else
      return res.status(401).json({ error: "Invalid Email or Password!" });

  } catch (error) {
    return res.send(error);
  }
};


const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find().sort({ "timestamp": -1 });;

    res.status(200).send(users);
  } catch (error) {
    res.send(error);
  }
};

const getUserDataController = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    return res.status(200).send(user);
  } catch (error) {
    res.send(error);
  }
};

//update user personal_info data activation
const activationUpdateUserDataController = async (req, res) => {
  try {
    const { fullName, mobile, email, booking_type } = req.body;
    if (!fullName || !mobile || !email || !booking_type)
      return res.status(422).json({ error: "please fill all fields" });

    //otp
    let verification_code = "";
    const characters = "0123456789";
    for (let i = 0; i < 4; i++)
      verification_code +=
        characters[Math.floor(Math.random() * characters.length)];

    const receivers = [{ email: email },]
    const emailData = {
      sender,
      to: receivers,
      subject: "Account Update link",
      htmlContent: ` <p style=text-align:center;>Please use the following code to update your account - </p>
            <h2 style=text-align:center;>${verification_code}</h3>
            <hr />`,
    };

    await tranEmailApi.sendTransacEmail(emailData);

    return res.json({ otp: verification_code, message: " OTP Sent" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

//update user personal_info data
const updateUserDataController = async (req, res) => {
  try {

    const user = await User.findOne({ _id: req.params.id });

    const updatedUser = {
      ...user._doc,
      personalInfo: {
        fullName: req.body.fullName,
        mobile: req.body.mobile,
        email: req.body.email,
        password: user.personalInfo.password,
        booking_type: req.body.booking_type,
        [req.body.booking_type === "individual" ? "profession" : "company"]:
          req.body.booking_type === "individual" ? req.body.profession : req.body.company,
        profile_pic: "",
      },
    };

    await User.findByIdAndUpdate(req.params.id, { $set: updatedUser, }, { new: true });

    return res.status(200).json({ message: "user updated" });
  } catch (error) {
    res.status(400).send(error);
  }
};

const uploadPicController = async (req, res) => {
  try {
    const file = req.file;
    const imageRef = ref(storage, file.originalname);
    const metatype = { contentType: file.mimetype, name: file.originalname };
    const snapshot = await uploadBytes(imageRef, file.buffer, metatype);
    const url = await getDownloadURL(imageRef);
    return res.status(200).json({ message: "uploaded...", url: url });
  } catch (error) {
    return res.status(422).send(error);
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    //find user
    const user = await User.findOne({ "personalInfo.email": req.body.email });

    if (!user)
      return res.status(404).json({ error: "User does not exsist!" });

    const receivers = [{ email: email },]
    const emailData = {
      sender,
      to: receivers,
      subject: "Password Reset",
      htmlContent: `  <p>You requested for password reset</p><br><br>
    <h5>click in this <a href="https://gorecce-5a416.web.app/reset/${user._id.toString()}">link</a> to reset password</h5>`,
    };

    await tranEmailApi.sendTransacEmail(emailData);

    res.json({ message: "check your email..." });
  } catch (error) {
    res.status(422).send(error);
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findOne({ _id: req.params.id });

    const salt = await bcrypt.genSalt(13);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = {
      ...user._doc,
      personalInfo: { ...user.personalInfo, password: newHashedPassword },
    };

    await User.findByIdAndUpdate(req.params.id, { $set: updatedUser, }, { new: true });

    res.status(200).json({ message: "password changed..." });
  } catch (error) {
    res.status(400).send(error);
  }
};

const updatePasswordController = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (currentPassword === newPassword)
      return res.status(401).json({ error: "new password cannot be same as old password" });

    const user = await User.findOne({ _id: req.params.id });

    const doMatch = await bcrypt.compare(
      currentPassword,
      user.personalInfo.password
    );
    if (!doMatch)
      return res.status(401).json({ error: "Old Password is not correct!!" });

    const salt = await bcrypt.genSalt(13);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = {
      ...user._doc,
      personalInfo: { ...user.personalInfo, password: newHashedPassword },
    };

    await User.findByIdAndUpdate(req.params.id, { $set: updatedUser, }, { new: true });

    res.status(200).json({ message: "password updated." });
  } catch (error) {
    res.status(400).send(error);
  }
};

//notification handler
const updateNotificationFlagController = async (req, res) => {
  try {
    const { user_id } = req.body;

    const user = await User.findOne({ _id: user_id });

    await User.findByIdAndUpdate(user_id,
      {
        $set: {
          ...user._doc,
          notificationFlag: false
        },
      },
      { new: true }
    );
    res.status(200).json({ message: "notification seen" });
  } catch (error) {
    res.status(400).send(error);
  }
};

//favourites handler
const updateFavouritesController = async (req, res) => {
  try {
    const { user_id, favourites } = req.body;

    const user = await User.findOne({ _id: user_id });

    await User.findByIdAndUpdate(user_id,
      {
        $set: {
          ...user._doc,
          favourites: favourites
        },
      },
      { new: true }
    );
    res.status(200).json({ message: "favourites updated" });
  } catch (error) {
    res.status(400).send(error);
  }
};


module.exports = {
  registerController,
  signInController,
  activationController,
  getUserDataController,
  activationUpdateUserDataController,
  updateUserDataController,
  updatePasswordController,
  forgotPasswordController,
  getAllUsersController,
  resetPasswordController,
  updateNotificationFlagController,
  updateFavouritesController
  // uploadPicController,
};
