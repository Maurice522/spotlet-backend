"use strict";

const fireAdmin = require("firebase-admin");
const db = fireAdmin.firestore();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const {
  JWT_SECRET,
  EMAIL_FROM,
  SENDGRID_API,
  EMAIL,
} = require("../config/dev");
const sgMail = require("@sendgrid/mail");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const storage = require("../firebase");

sgMail.setApiKey(SENDGRID_API);

const registerController = async (req, res) => {
  try {
    const { firstName, lastName, mobile, email, password, job, booking_type } =
      req.body;
    const fullName = firstName + " " + lastName;
    const hashedPassword = await bcrypt.hash(password, 13);
    const data = {
      personalInfo: {
        fullName,
        mobile,
        email,
        password: hashedPassword,
        job,
        booking_type,
        profile_pic: "",
      },
      favourites: [],
      listedLocations: [],
      portfolio: [],
    };
    await db.collection("users").doc().set(data);

    const snapshot = await db
      .collection("users")
      .where(`personalInfo.email`, "==", email)
      .get();
    let user_id;
    snapshot.forEach(async (doc) => {
      user_id = doc.id;
    });
    const token = jwt.sign({ _id: user_id }, JWT_SECRET, { expiresIn: "7d" });
    return res.send(token);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const activationController = async (req, res) => {
  try {
    const { firstName, lastName, mobile, email, password, job, booking_type } =
      req.body;
    if (!firstName || !mobile || !email || !password || !job || !booking_type)
      return res.status(422).json({ error: "please fill all fields" });
    //find user if already present
    const snapshot = await db
      .collection("users")
      .where(`personalInfo.email`, "==", email)
      .get();
    if (!snapshot.empty)
      return res.status(422).json({ error: "user already exists!" });
    //otp
    let verification_code = "";
    const characters = "0123456789";
    for (let i = 0; i < 4; i++)
      verification_code +=
        characters[Math.floor(Math.random() * characters.length)];
    const emailData = {
      from: EMAIL_FROM,
      to: email,
      subject: "Account activation link",
      html: ` <p style=text-align:center;>Please use the following code to activate your account - </p>
            <h2 style=text-align:center;>${verification_code}</h3>
            <hr />`,
    };
    await sgMail.send(emailData);
    return res.json({ otp: verification_code, message: " OTP Sent" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const signInController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(422).json({ error: "Please add details!" });
    //find user
    const snapshot = await db
      .collection("users")
      .where(`personalInfo.email`, "==", email)
      .get();
    if (snapshot.empty)
      return res.status(422).json({ error: "Invalid email and password!!" });
    //compare password
    let user, user_id;
    snapshot.forEach(async (doc) => {
      user_id = doc.id;
      user = doc.data();
    });
    const doMatch = await bcrypt.compare(password, user.personalInfo.password);
    if (doMatch) {
      const token = jwt.sign({ _id: user_id }, JWT_SECRET, { expiresIn: "7d" });
      return res.send(token);
    } else return res.status(422).json({ error: "Invalid Email or Password!" });
  } catch (error) {
    return res.status(422).json(error);
  }
};

const getUserDataController = async (req, res) => {
  try {
    const user = await db.collection("users").doc(req.params.id).get();
    const userData = {
      personalInfo: {
        fullName: user.data().personalInfo.fullName,
        email: user.data().personalInfo.email,
        mobile: user.data().personalInfo.mobile,
        job: user.data().personalInfo.job,
        booking_type: user.data().personalInfo.booking_type,
        job: user.data().personalInfo.job,
        profile_pic: user.data().personalInfo.profile_pic,
      },
      favourites: user.data().favourites,
      listedLocations: user.data().listedLocations,
      portfolio: user.data().portfolio,
    };
    return res.status(200).send(userData);
  } catch (error) {
    res.status(422).send(error);
  }
};

const updateUserDataController = async (req, res) => {
  try {
    const { booking_type, email, fullName, job, mobile, profile_pic } =
      req.body;

    const snapshot = await db.collection("users").doc(req.params.id).get();
    const user = snapshot.data();

    const updatedUser = {
      ...user,
      personalInfo: {
        ...user.personalInfo,
        booking_type,
        email,
        fullName,
        job,
        mobile,
        profile_pic,
      },
    };
    await db.collection("users").doc(req.params.id).update(updatedUser);
    return res.status(200).json({ message: "user updated" });
  } catch (error) {
    res.status(422).send(error);
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
    //find user
    const { email } = req.body;
    const snapshot = await db
      .collection("users")
      .where(`personalInfo.email`, "==", email)
      .get();
    if (snapshot.empty)
      return res.status(422).json({ error: "User not exist with this email!" });
    let user_id;
    snapshot.forEach(async (doc) => {
      user_id = doc.id;
    });
    sgMail.send({
      to: email,
      from: EMAIL_FROM,
      subject: "Password Reset",
      html: `  <p>You requested for password reset</p><br><br>
      <h5>click in this <a href="${EMAIL}/reset/${user_id}">link</a> to reset password</h5>`,
    });
    res.json({ message: "check your email..." });
  } catch (error) {
    res.status(422).send(error);
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const snapshot = await db.collection("users").doc(req.params.id).get();
    const user = snapshot.data();
    const newHashedPassword = await bcrypt.hash(newPassword, 13);
    await db
      .collection("users")
      .doc(req.params.id)
      .update({
        ...user,
        personalInfo: { ...user.personalInfo, password: newHashedPassword },
      });
    return res.status(200).json({ message: "password changed..." });
  } catch (error) {
    res.status(422).send(error);
  }
};

const updatePasswordController = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const snapshot = await db.collection("users").doc(req.params.id).get();
    const user = snapshot.data();
    const doMatch = await bcrypt.compare(
      currentPassword,
      user.personalInfo.password
    );
    if (!doMatch)
      return res.status(422).json({ error: "Old Password is not correct!!" });
    const newHashedPassword = await bcrypt.hash(newPassword, 13);
    await db
      .collection("users")
      .doc(req.params.id)
      .update({
        ...user,
        personalInfo: { ...user.personalInfo, password: newHashedPassword },
      });
    return res.status(200).json({ message: "password updated." });
  } catch (error) {
    res.status(422).send(error);
  }
};

module.exports = {
  registerController,
  signInController,
  activationController,
  getUserDataController,
  updateUserDataController,
  updatePasswordController,
  forgotPasswordController,
  resetPasswordController,
  uploadPicController,
};
