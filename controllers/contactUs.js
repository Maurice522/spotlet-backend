"use strict";
const fireAdmin = require("firebase-admin");
const db = fireAdmin.firestore();

const sendQueriesToGorecce = async(req, res) => {
    try {
        const {fullName, email, mobile, message} = req.body;
        const data = {
        fullName,
        email,
        mobile,
        message
    }
    await db.collection("contactus").doc().set(data);
    res.status(200).send("sent...");
    } catch (error) {
        return res.status(400).send(error);
    }
    
}

const photoshootRequest = async(req, res) => {
    try {
        const {fullName, email, mobile, address} = req.body;
        const data = {
        fullName,
        email,
        mobile,
        address
    }
    await db.collection("photorequest").doc().set(data);
    } catch (error) {
        return res.status(400).send(error);
    }
}

module.exports = {
    sendQueriesToGorecce,
    photoshootRequest
};
