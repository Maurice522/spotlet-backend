"use strict"
const {
    EMAIL_FROM,
    SIB_API,
} = require("../config/key");
const fireAdmin = require("firebase-admin");
const db = fireAdmin.firestore();
const Sib = require('sib-api-v3-sdk');

// const accountSid =TWILIO_ACCOUNT_SID;
// const authToken = TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

//SendInBlue Mail
const client = Sib.ApiClient.instance

const apiKey = client.authentications['api-key']
apiKey.apiKey = SIB_API

const tranEmailApi = new Sib.TransactionalEmailsApi();
const sender = {
    email: EMAIL_FROM,
    name: "Spotlet"
}

// sgMail.setApiKey(SIB_API);

const locationBookController = async (req, res) => {
    try {
        const { discount, reqDate, processfee, final_amount, event, date, time, duration_in_hours, attendies, activity, user_id, user_data, owner_id, property_id, total_amt } = req.body;
        // console.log(req.body);
        const locationBooking = {
            timestamp: new Date(),
            reqDate,
            event,
            date,
            time,
            duration_in_hours,
            attendies,
            activity,
            user_id,
            user_data,
            owner_id,
            discount,
            processfee,
            final_amount,
            property_id,
            total_amt,
            status: "Under Review",
            payment_status: "Pending",
        }
        // console.log(locationBooking);
        const docRef = await db.collection("bookings").doc(property_id).collection("bookingrequests").add(locationBooking);
        const bookingId = docRef.id;
        // console.log(docRef.id);
        const snapshot = await db.collection("users").doc(user_id).get();
        const user = snapshot.data();
        await db.collection("users").doc(user_id).update({ ...user, portfolio: [...user.portfolio, { ...locationBooking, bookingId }] });

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;
        const notification = {
            content: `You got a booking request`,
            link: `/location/${property_id}/bookingdetail/${bookingId}`,
            date: `${today}`,
            admin: false
        }
        // console.log(notification);
        const snapshot2 = await db.collection("users").doc(owner_id).get();
        const user2 = snapshot2.data();
        await db.collection("users").doc(owner_id).update({ ...user2, notifications: [...user2.notifications, notification], notificationFlag: true });

        return res.status(200).json({ message: "Request sent" });
    } catch (error) {
        return res.status(400).send(error);
    }
}

const bookingReq = async (req, res) => {
    try {
        const tot_req = await db.collection("bookings").doc(req.params.locId).collection("bookingrequests").get();
        // console.log(tot_req);
        const requests = tot_req.docs.map(doc => {
            return { req_id: doc.id, ...doc.data() };
        })
        return res.status(200).json({ requests });

    } catch (error) {
        return res.status(400).send(error);
    }
}

const getBookingDetail = async (req, res) => {
    try {
        const { locationId } = req.body
        //console.log(req.body);
        const snapshot = await db.collection("bookings").doc(locationId).collection("bookingrequests").doc(req.params.bookingId).get();
        const bookingDetail = snapshot.data();
        return res.status(200).send(bookingDetail);
    } catch (error) {
        return res.status(400).send(error);
    }
}

const updateBookingStatus = async (req, res) => {
    try {
        const { locationId, bookingId, user_id, status } = req.body;
        // console.log(status);
        const snapshot = await db.collection("bookings").doc(locationId).collection("bookingrequests").doc(bookingId).get();
        const bookingDetail = snapshot.data();
        await db.collection("bookings").doc(locationId).collection("bookingrequests").doc(bookingId).update({ ...bookingDetail, status: status })
        const snapshot1 = await db.collection("users").doc(user_id).get();
        const user = snapshot1.data();
        //console.log(user);
        const updatePort = user.portfolio.map(p => p.bookingId === bookingId ? { ...p, status: status } : p);
        //console.log(updatePort);
        await db.collection("users").doc(user_id).update({ ...user, portfolio: updatePort });

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;
        const notification = {
            content: `Your booking ${bookingId} has been ${status}`,
            link: `/bookingdetails/${bookingId}`,
            date: `${today}`,
            admin: false
        }
        // console.log(notification);
        const snapshot2 = await db.collection("users").doc(user_id).get();
        const user2 = snapshot2.data();
        await db.collection("users").doc(user_id).update({ ...user2, notifications: [...user2.notifications, notification], notificationFlag: true });

        const link = "https://gorecce-5a416.web.app/bookingdetails/" + bookingId;

        const receivers = [{ email: user.personalInfo.email },]
        const emailData = {
            sender,
            to: receivers,
            subject: "Location Booking Status",
            htmlContent: `
            <h2>Location Id - ${locationId}</h2>
            <h2>Booking Id - ${bookingId}</h2>
            <p>Your status of booking a location is ${status}</p>
            ${status === "Approved" ? `<p>Please use this link to complete your payment - <b>${link}</b> </p>` : ""}
              <hr />`,
        };
        await tranEmailApi.sendTransacEmail(emailData);
        console.log("done");
        return res.status(200).send(`Booking is  ${status}`);
    } catch (error) {
        return res.status(400).send(error);
    }
}

const deleteBookingReq = async (req, res) => {
    try {
        const { locationId, bookingId, user_id } = req.body;
        //console.log(req.body);
        await db.collection("bookings").doc(locationId).collection("bookingrequests").doc(bookingId).delete();
        const snapshot1 = await db.collection("users").doc(user_id).get();
        const user = snapshot1.data();
        const updatePort = user.portfolio.filter(p => p.bookingId !== bookingId);
        await db.collection("users").doc(user_id).update({ ...user, portfolio: updatePort });
        return res.status(200).send("Booking Request Deleted...");
    } catch (error) {
        return res.status(400).send(error);
    }
}

//     //Mobile OTP
// const mobileOtpVerify = (req, res) => {
//         const { phoneNum } = req.body;
//         console.log(phoneNum);
//         client.messages.create(
//             {
//                 body: 'Hi there', 
//                 from: '+15618163070', 
//                 to: phoneNum
//             }
//             )
//             .then(message => {
//                 console.log(message.sid)
//                 res.status(200).send("otp sent");
//             }).catch(err => res.status(422).send(err));            
// }

const updateBooking = async (req, res) => {
    try {
        const { locationId, bookingId, user_id, date, time } = req.body;
        const snapshot = await db.collection("bookings").doc(locationId).collection("bookingrequests").doc(bookingId).get();
        const bookingDetail = snapshot.data();
        await db.collection("bookings").doc(locationId).collection("bookingrequests").doc(bookingId).update({ ...bookingDetail, date, time })
        const snapshot1 = await db.collection("users").doc(user_id).get();
        const user = snapshot1.data();
        //console.log(user);
        const updatePort = user.portfolio.map(p => p.bookingId === bookingId ? { ...p, date, time } : p);
        //console.log(updatePort);
        await db.collection("users").doc(user_id).update({ ...user, portfolio: updatePort });

        return res.status(200).send(`Booking has been Updated`);
    } catch (error) {
        return res.status(400).send(error);
    }
}

module.exports = {
    locationBookController,
    bookingReq,
    getBookingDetail,
    updateBookingStatus,
    deleteBookingReq,
    updateBooking
    // mobileOtpVerify,
}