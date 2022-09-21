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
            payment_status : "Under Review",
        }
        //console.log(locationBooking);
        const docRef = await db.collection("bookings").doc(property_id).collection("bookingrequests").add(locationBooking);
        const bookingId = docRef.id;
       // console.log(docRef.id);
        const snapshot = await db.collection("users").doc(user_id).get();
         const user = snapshot.data();
        await db.collection("users").doc(user_id).update({ ...user, portfolio: [...user.portfolio, {...locationBooking, bookingId}] });
        return res.status(200).json({message : "Request sent"});
    } catch (error) {
        return res.status(400).send(error);
    }
}

const bookingReq = async(req, res) => {
    try {
        const tot_req = await db.collection("bookings").doc(req.params.locId).collection("bookingrequests").get();
        //console.log(tot_req);
        const requests = tot_req.docs.map(doc => {
            return {req_id : doc.id, ...doc.data()};
        })
        return res.status(200).json({requests});

    } catch (error) {
        return res.status(400).send(error);
    }
}

const getBookingDetail = async(req, res) => {
    try {
        const {locationId} = req.body
        console.log(req.body);
        const snapshot = await db.collection("bookings").doc(locationId).collection("bookingrequests").doc(req.params.bookingId).get();
        const bookingDetail = snapshot.data();
        return res.status(200).send(bookingDetail);
    } catch (error) {
        return res.status(400).send(error);
    }
}

const updateBookingStatus = async(req, res) => {
    try {
        const {locationId, bookingId, user_id, status} = req.body;
        const snapshot = await db.collection("bookings").doc(locationId).collection("bookingrequests").doc(bookingId).get();
        const bookingDetail = snapshot.data();
        await db.collection("bookings").doc(locationId).collection("bookingrequests").doc(bookingId).update({...bookingDetail, payment_status : status})
        const snapshot1 = await db.collection("users").doc(user_id).get();
        const user = snapshot1.data();
        console.log(user);
        const updatePort = user.portfolio.map(p => p.bookingId === bookingId ? {...p, payment_status : status} : p);
        console.log(updatePort);
       await db.collection("users").doc(user_id).update({ ...user, portfolio: updatePort });
        return res.status(200).send(`Booking is  ${status}`);
    } catch (error) {
        return res.status(400).send(error);
    }
}

module.exports = {
    locationBookController,
    bookingReq,
    getBookingDetail,
    updateBookingStatus
}