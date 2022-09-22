"use strict";
const fireAdmin = require("firebase-admin");
const db = fireAdmin.firestore();
const { EMAIL_FROM, SENDGRID_API, EMAIL } = require("../config/key");
const sgMail = require("@sendgrid/mail");

const deleterequests = async (req, res) => {
  try {
    console.log("del");
    const user = await db.collection("users").doc(req.params.id).get();
    const data = {
      id:req.params.id,
      CustomerName: user.data().personalInfo.fullName,
      CustomerEmail: user.data().personalInfo.email,
      CustomerImage:user.data().personalInfo.profile_pic,
      Mobile:user.data().personalInfo.mobile
    };
    await db.collection("requests").doc(req.params.id).set(data);
    return res.send("Deactivation Request Sent");
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
const locationrequests = async (req, res) => {
  try {
    const snapshots = await db.collection("location").where("verified", "==", "Under Review").orderBy("timestamp", "desc").get();
    const locations = snapshots.docs.map(doc => {
      return { location_id : doc.id, ...doc.data()};
    })
    return res.json({locations});
  } catch (error) {
    return res.status(400).send(error);
  }
};

module.exports = {
  deleterequests,
  locationrequests
};
