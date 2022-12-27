"use strict";

const City = require("../models/City");
const LocationType = require("../models/LocationType");

// const fireAdmin = require("firebase-admin");
// const db = fireAdmin.firestore();

const createCity = async (req, res) => {
    try {
        const newCity = new City({
            label: req.body.label,
            value: req.body.value,
        });
        await newCity.save();
        return res.send("City Added");
    } catch (error) {
        return res.status(400).send(error);
    }
}

const getCities = async (req, res) => {
    try {
        const cities = await City.find().sort({ "timestamp": -1 });;
        res.status(200).send(cities);
    } catch (error) {
        return res.status(400).send(error);
    }
}

const createLocType = async (req, res) => {
    try {
        const newLocationType = new LocationType({
            label: req.body.label,
            value: req.body.value,
        });
        await newLocationType.save();
        return res.send("Location Type Added");
    } catch (error) {
        return res.status(400).send(error);
    }
}

const getLocTypes = async (req, res) => {
    try {
        const locationtypes = await LocationType.find().sort({ "timestamp": -1 });;
        res.status(200).send(locationtypes);
    } catch (error) {
        return res.status(400).send(error);
    }
}

module.exports = {
    createCity,
    getCities,
    createLocType,
    getLocTypes
};