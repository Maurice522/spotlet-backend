"use strict"
const {
    EMAIL_FROM,
    SENDGRID_API,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN
  } = require("../config/key");
const fireAdmin = require("firebase-admin");
const db = fireAdmin.firestore();

const accountSid =TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

//SendGrid Mail
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(SENDGRID_API);

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
        //console.log(req.body);
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
        //console.log(user);
        const updatePort = user.portfolio.map(p => p.bookingId === bookingId ? {...p, payment_status : status} : p);
        //console.log(updatePort);
       await db.collection("users").doc(user_id).update({ ...user, portfolio: updatePort });
       const link = "https://gorecce-5a416.web.app/bookingdetails/"+bookingId;
       const emailData = {
        from: EMAIL_FROM,
        to: user.personalInfo.email,
        subject: "Location Booking Status",
        html: `
        <h2>Location Id - ${locationId}</h2>
        <h2>Booking Id - ${bookingId}</h2>
        <p>Your status of booking a location is ${status}</p>
        ${status === "Approved" ? `<p>Please use this link to complete your payment - <b>${link}</b> </p>` : ""}
              <hr />`,
      };
      await sgMail.send(emailData);
        return res.status(200).send(`Booking is  ${status}`);
    } catch (error) {
        return res.status(400).send(error);
    }
}

    const deleteBookingReq = async(req, res) => {
        try {
            const {locationId, bookingId, user_id} = req.body;
            //console.log(req.body);
            await db.collection("bookings").doc(locationId).collection("bookingrequests").doc(bookingId).delete(); 
            const snapshot1 = await db.collection("users").doc(user_id).get();
            const user = snapshot1.data();
            const updatePort = user.portfolio.filter(p => p.bookingId !== bookingId);
            await db.collection("users").doc(user_id).update({...user, portfolio : updatePort});
            return res.status(200).send("Booking Request Deleted...");
        } catch (error) {
            return res.status(400).send(error);
        }
    }

    //Mobile OTP
const mobileOtpVerify = (req, res) => {
        const { phoneNum } = req.body;
        console.log(phoneNum);
        
        client.messages.create(
            {
                body: 'Hi there', 
                from: '+15618163070', 
                to: phoneNum
            }
            )
            .then(message => {
                console.log(message.sid)
                res.status(200).send("otp sent");
            }).catch(err => res.status(422).send(err));
            
}
module.exports = {
    locationBookController,
    bookingReq,
    getBookingDetail,
    updateBookingStatus,
    deleteBookingReq,
    mobileOtpVerify
}