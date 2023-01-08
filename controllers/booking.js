"use strict"
// const fireAdmin = require("firebase-admin");
// const db = fireAdmin.firestore();

const {
    EMAIL_FROM,
    SIB_API,
} = require("../config/key");
const Sib = require('sib-api-v3-sdk');
const Booking = require("../models/Booking");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");

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

const locationBookController = async (req, res) => {
    try {
        const newBooking = new Booking({
            discount: req.body.discount,
            reqDates: req.body.reqDate,
            processfee: req.body.processfee,
            final_amount: req.body.final_amount,
            event: req.body.event,
            bookedTimeDates: req.body.bookedTimeDates,
            attendies: req.body.attendies,
            activity: req.body.activity,
            user_id: req.body.user_id,
            user_data: req.body.user_data,
            owner_id: req.body.owner_id,
            property_id: req.body.property_id,
            total_amt: req.body.total_amt,
            status: "Under Review",
            payment_status: "Pending",
        });

        const createdBooking = await newBooking.save();

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = dd + '/' + mm + '/' + yyyy;
        const notification = {
            content: `You got a booking request`,
            link: `/location/${req.body.property_id}/bookingdetail/${createdBooking._id}`,
            date: `${today}`,
            admin: false
        }

        const user = await User.findOne({ _id: req.body.user_id });

        await User.findByIdAndUpdate(req.body.user_id,
            {
                $set: {
                    ...user._doc,
                    portfolio: [...user.portfolio, createdBooking],
                    notifications: [...user.notifications, notification],
                    notificationFlag: true
                },
            },
            { new: true }
        );
        return res.status(200).json({ message: "Request sent" });
    } catch (error) {
        return res.status(400).send(error);
    }
}

const locationBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ property_id: req.params.locId }).sort({ "timestamp": -1 });;

        return res.status(200).json(bookings);

    } catch (error) {
        return res.status(400).send(error);
    }
}

const getBookingDetail = async (req, res) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.bookingId });

        return res.status(200).send(booking);
    } catch (error) {
        return res.status(400).send(error);
    }
}

const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId, user_id, status, locationId } = req.body;

        const booking = await Booking.findOne({ _id: bookingId });

        if (!booking)
            return res.status(404).send("No Booking found...");

        await Booking.findByIdAndUpdate(bookingId,
            {
                $set: {
                    ...booking._doc,
                    status: status,
                },
            },
            { new: true }
        );
        const user = await User.findOne({ _id: user_id });

        const portfolio = user._doc.portfolio;
        portfolio.map((booking) => {
            if (bookingId === booking._id.toString()) {
                booking.status = status
            }
        })

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

        await User.findByIdAndUpdate(user_id,
            {
                $set: {
                    ...user._doc,
                    portfolio: portfolio,
                    notifications: [...user.notifications, notification],
                    notificationFlag: true
                },
            },
            { new: true }
        );

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

        return res.status(200).send(`Booking is  ${status}`);
    } catch (error) {
        return res.status(400).send(error);
    }
}

const deleteBookingReq = async (req, res) => {
    try {
        const { bookingId, user_id } = req.body;

        await Booking.deleteOne({ _id: bookingId });

        const user = await User.findOne({ _id: user_id });

        const portfolio = user._doc.portfolio;
        const updatePortfolio = portfolio.map((booking) => {
            if (bookingId !== booking._id.toString()) {
                return booking;
            }
        })

        await User.findByIdAndUpdate(user_id,
            {
                $set: {
                    ...user._doc,
                    portfolio: updatePortfolio ? updatePortfolio : [],
                },
            },
            { new: true }
        );

        return res.status(200).send("Booking Request Deleted...");
    } catch (error) {
        return res.status(400).send(error);
    }
}

const addABookingDay = async (req, res) => {
    try {
        const { data } = req.body;

        const booking = await Booking.findOne({ _id: req.params.bookingId });

        if (!booking)
            return res.status(404).send("No Booking found...");

        await Booking.findByIdAndUpdate(req.params.bookingId,
            {
                $set: {
                    ...booking._doc,
                    bookedTimeDates: [...booking.bookedTimeDates, data],
                    reqDates: [...booking.reqDates, data.bookedDate]
                },
            },
            { new: true }
        );
        const user = await User.findOne({ _id: booking.user_id });

        const portfolio = user._doc.portfolio;
        portfolio.map((booking) => {
            if (req.params.bookingId === booking._id.toString()) {
                booking.bookedTimeDates = [...booking.bookedTimeDates, data];
                booking.reqDates = [...booking.reqDates, data.bookedDate]
            }
        })

        await User.findByIdAndUpdate(booking.user_id,
            {
                $set: {
                    ...user._doc,
                    portfolio: portfolio,
                },
            },
            { new: true }
        );

        return res.status(200).send(`Booking day added`);
    } catch (error) {
        return res.status(400).send(error);
    }
}

// Mobile OTP
// const mobileOtpVerify = (req, res) => {
//     const { phoneNum } = req.body;
//     console.log(phoneNum);
//     client.messages.create(
//         {
//             body: 'Hi there',
//             from: '+15618163070',
//             to: phoneNum
//         }
//     )
//         .then(message => {
//             console.log(message.sid)
//             res.status(200).send("otp sent");
//         }).catch(err => res.status(422).send(err));
// }


module.exports = {
    locationBookController,
    locationBookings,
    getBookingDetail,
    updateBookingStatus,
    deleteBookingReq,
    addABookingDay,
    // mobileOtpVerify,
}