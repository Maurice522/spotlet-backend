"use strict";
const fireAdmin = require("firebase-admin");
const db = fireAdmin.firestore();

const createCity = async (req, res) => {
    const data = req.body;
    try {
        await db.collection("cities").doc(data.value).set(data);
        return res.send("City Added");
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

const getCities = async (req, res) => {
    try {
        const snapshot = await db.collection("cities").get();
        const cities = snapshot.docs.map(doc => {
            return doc.data();
        })
        res.status(200).send(cities);
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

const createLocType = async (req, res) => {
    const data = req.body;
    try {
        await db.collection("locationtypes").doc(data.value).set(data);
        return res.send("Location Type Added");
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

const getLocTypes = async (req, res) => {
    try {
        const snapshot = await db.collection("locationtypes").get();
        const locationtypes = snapshot.docs.map(doc => {
            return doc.data();
        })
        res.status(200).send(locationtypes);
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

module.exports = {
    createCity, getCities, createLocType, getLocTypes
};