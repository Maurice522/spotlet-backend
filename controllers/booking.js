"use strict"

const fireAdmin = require("firebase-admin");
const db = fireAdmin.firestore();

const locationBookController = async(req, res) => {
    try {
        const {event, date, time, duration_in_hours, attendies, activity, user_id, user_data, owner_id, property_id, total_amt} = req.body;
        //console.log(req.body);
        const locationBooking = {
            timestamp: new Date(),
            event,
            date,
            time,
            duration_in_hours,
            attendies,
            activity,
            user_id,
            user_data,
            owner_id,
            property_id,
            total_amt,
            payment_status : "pending",
        }
        console.log(locationBooking);
        await db.collection("bookings").doc(property_id).collection("bookingrequests").doc().set(locationBooking);
        return res.status(200).json({message : "Request sent"});
    } catch (error) {
        return res.status(400).send(error);
    }
}

const bookingReq = async(req, res) => {
    try {
        const tot_req = await db.collection("bookings").doc(req.params.locId).collection("bookingrequests").get();
        //console.log(tot_req);
        return res.status(200).json({requests : tot_req.docs.length});

    } catch (error) {
        return res.status(400).send(error);
    }
}

module.exports = {
    locationBookController,
    bookingReq
}