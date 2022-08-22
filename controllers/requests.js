"use strict";
const fireAdmin = require("firebase-admin");
const db = fireAdmin.firestore();

const sgMail = require("@sendgrid/mail");

const deleterequests = async (req, res) => {
  try {
    console.log("del");
    const user = await db.collection("users").doc(req.params.id).get();
    const data = {
      id:req.params.id,
      CustomerName: user.data().personalInfo.fullName,
      CustomerEmail: user.data().personalInfo.email,
      CustomerImage:user.data().personalInfo.profile_pic
    };
    await db.collection("requests").doc(req.params.id).set(data);
    return res.send("Deactivation Request Sent");
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports = {
  deleterequests,
};
