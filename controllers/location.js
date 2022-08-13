"use strict";

const fireAdmin = require("firebase-admin");
const db = fireAdmin.firestore();


const locationCreate = async (req, res) => {
    try {
        const { userid, type, size, desc, address, city, state, country, pincode, amenities, images, features, dos, donts
            , hourlyrate, fourhrrate, twelhrrate, timings, rules } = req.body;
        const data = {
            property_desc: {
                userid, type,
                size, desc,
            },
            property_address:{
                address, city,
                state, country,
                pincode
            }, 
            amenities:amenities,
            images:images,
            features:features,
            dosndonts:{
                dos,donts
            },
            pricing: { hourlyrate, fourhrrate, twelhrrate },
            timings:timings,
            rules:rules
        };
        await db.collection("location").doc().set(data);
        return res.send("Location Created");

    } catch (error) {
        return res.status(400).send(error.message);
    }
}

module.exports = {
    locationCreate
  };