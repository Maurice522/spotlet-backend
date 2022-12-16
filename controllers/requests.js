"use strict";
const fireAdmin = require("firebase-admin");
const db = fireAdmin.firestore();
const { EMAIL_FROM, SIB_API, EMAIL } = require("../config/key");
const sgMail = require("@sendgrid/mail");


const deleteUser = async (req, res) => {
  try {
      // const data=await db.collection("users").doc(req.params.id).get(email);
      // const emailData = {
      //     from: EMAIL_FROM,
      //     to: "saketmundra2707@gmail.com",
      //     subject: "Account Deactivated",
      //     html: ` <p style=text-align:center;>Your Account has been Deactivated</p>
      //           <hr />`,
      //   };
      // await sgMail.send(emailData);
      await db.collection("users").doc(req.params.id).delete();
      await db.collection("requests").doc(req.params.id).delete();
      return res.status(200).send("User Deleted");
  } catch (error) {
      return res.status(400).json(error);
  }
}
const rejectdeac = async (req, res) => {
  try {
      await db.collection("requests").doc(req.params.id).delete();
      return res.status(200).send("Request Rejected");
  } catch (error) {
      return res.status(400).json(error);

  }
}
const deleteReq = async (req, res) => {
  try {
      const data = await db.collection("requests").get();
      res.send(data.docs.map(doc => doc.data()));
  } catch (error) {
      return res.status(400).json(error);
  }
}
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

module.exports = {deleteUser,
  rejectdeac,
  deleteReq,
  deleterequests,
  locationrequests
};
