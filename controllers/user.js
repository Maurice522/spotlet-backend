"use strict";

const fireAdmin = require("firebase-admin");
const db = fireAdmin.firestore();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET, EMAIL_FROM, SENDGRID_API } = require("../config/dev");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(SENDGRID_API);
const registerController = async (req, res) => {
  try {
    const { fullName, mobile, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 13);
    const data = {
      personalInfo: {
        fullName,
        mobile,
        email,
        password: hashedPassword,
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
    const { fullName, mobile, email, password } = req.body;
    if (!fullName || !mobile || !email || !password)
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
    for (let i = 0; i < 6; i++)
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

module.exports = {
  registerController,
  signInController,
  activationController,
  getUserDataController,
};
