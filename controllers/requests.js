"use strict";
// const fireAdmin = require("firebase-admin");
// const db = fireAdmin.firestore();
const {
  EMAIL_FROM,
  SIB_API,
} = require("../config/key");
const Sib = require('sib-api-v3-sdk');
const Location = require("../models/Location");
const User = require("../models/User");
const DeactRequest = require("../models/DeactRequest");

//SendInBlue Mail
const client = Sib.ApiClient.instance

const apiKey = client.authentications['api-key']
apiKey.apiKey = SIB_API

const tranEmailApi = new Sib.TransactionalEmailsApi();
const sender = {
  email: EMAIL_FROM,
  name: "Spotlet"
}

const deleteUser = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    await DeactRequest.deleteMany({ user_id: req.params.id });

    // const receivers = [{ email: user.personalInfo.email },]
    // const emailData = {
    //   sender,
    //   to: receivers,
    //   subject: "Account Deactivated",
    //   htmlContent: ` <p style=text-align:center;>Your Account has been Deactivated</p>
    //     <hr />`,
    // };
    // await tranEmailApi.sendTransacEmail(emailData);

    return res.status(200).send("User Deleted");
  } catch (error) {
    return res.status(400).json(error);
  }
}

const rejectdeac = async (req, res) => {
  try {
    await DeactRequest.deleteMany({ user_id: req.params.id });

    // const receivers = [{ email: user.personalInfo.email },]
    // const emailData = {
    //   sender,
    //   to: receivers,
    //   subject: "Account Deactivation",
    //   htmlContent: ` <p style=text-align:center;>Your Account Deactivation Request has been REJECTED</p>
    //     <hr />`,
    // };
    // await tranEmailApi.sendTransacEmail(emailData);

    return res.status(200).send("Request Rejected");
  } catch (error) {
    return res.status(400).json(error);

  }
}

const getDeleteReqs = async (req, res) => {
  try {
    const requests = await DeactRequest.find().sort({ "timestamp": -1 });
    res.status(200).send(requests);
  } catch (error) {
    return res.status(400).json(error);
  }
}

const sendDeactivationReq = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    const request = await DeactRequest.findOne({ user_id: req.params.id })
    if (request) {
      return res.status(403).json("request already sent");
    }

    const newReq = new DeactRequest({
      user_id: req.params.id,
      CustomerName: user._doc.personalInfo.fullName,
      CustomerEmail: user._doc.personalInfo.email,
      CustomerImage: user._doc.personalInfo.profile_pic,
      Mobile: user._doc.personalInfo.mobile
    });

    await newReq.save();
    return res.status(200).send("Deactivation Request Sent");
  } catch (error) {
    return res.status(400).send(error);
  }
};

const locationrequests = async (req, res) => {
  try {
    const locations = await Location.find({ verified: "Under Review" }).sort({ "timestamp": -1 });;
    return res.status(200).json(locations);
  } catch (error) {
    return res.status(400).send(error);
  }
};

module.exports = {
  deleteUser,
  rejectdeac,
  getDeleteReqs,
  sendDeactivationReq,
  locationrequests
};
