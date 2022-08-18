"use strict";
const fireAdmin = require("firebase-admin");
const db = fireAdmin.firestore();
const {
    EMAIL_FROM,
    SENDGRID_API,
    EMAIL,
  } = require("../config/dev");
const sgMail = require("@sendgrid/mail");


const deleterequests = async (req, res) => {
    try {
        console.log("del");
        const user = await db.collection("users").doc(req.params.id).get();
        const data = {
            fullName: user.data().personalInfo.fullName,
            email: user.data().personalInfo.email,
        }
        await db.collection("requests").doc(req.params.id).set(data);
        return res.send("Deactivation Request Sent");

    } catch (error) {
        return res.status(400).send(error.message);

    }

}




module.exports = {
    deleterequests
};