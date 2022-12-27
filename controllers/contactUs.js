"use strict";
// const fireAdmin = require("firebase-admin");
// const db = fireAdmin.firestore();

const ContactUs = require("../models/ContactUs");
const PhotoShoot = require("../models/PhotoShoot");


const sendQueriesToSpotlet = async (req, res) => {
    try {
        const newContactUs = new ContactUs({
            fullName: req.body.fullName,
            email: req.body.email,
            mobile: req.body.mobile,
            message: req.body.message,
        });

        const createdContactUs = await newContactUs.save();
        res.status(200).send("sent...");
    } catch (error) {
        return res.status(400).send(error);
    }

}
const getContact = async (req, res) => {
    try {
        const contactus = await ContactUs.find().sort({ "timestamp": -1 });;

        res.status(200).send(contactus);

    } catch (error) {
        return res.status(400).send(error);

    }
}

const photoshootRequest = async (req, res) => {
    try {
        const newPhotoShoot = new PhotoShoot({
            fullName: req.body.fullName,
            email: req.body.email,
            mobile: req.body.mobile,
            address: req.body.message,
        });

        const createdPhotoShoot = await newPhotoShoot.save();
        res.status(200).send("sent...");
    } catch (error) {
        return res.status(400).send(error);
    }
}


const getPhotoshoot = async (req, res) => {
    try {
        const photoshoot = await PhotoShoot.find().sort({ "timestamp": -1 });;

        res.status(200).send(photoshoot);

    } catch (error) {
        return res.status(400).send(error);

    }
}

module.exports = {
    sendQueriesToSpotlet,
    photoshootRequest,
    getContact, 
    getPhotoshoot
};
