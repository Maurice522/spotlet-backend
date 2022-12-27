// const fireAdmin = require("firebase-admin");
// const db = fireAdmin.firestore();

const Booking = require("../models/Booking");
const Location = require("../models/Location");
const User = require("../models/User");

const getNoOfUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ "timestamp": -1 });;
        res.status(200).send({ count: users.length });
    } catch (error) {
        res.status(400).send(error);
    }
};

const getNoOfLoctaions = async (req, res) => {
    try {
        const locations = await Location.find({ verified: "Approved" }).sort({ "timestamp": -1 });;
        res.status(200).send({ count: locations.length });
    } catch (error) {
        res.status(400).send(error);
    }
};

const getNoOfBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ "timestamp": -1 });;
        res.status(200).send({ count: bookings.length });
    } catch (error) {
        res.status(422).send(error);
    }
};

const getNoOfRequests = async (req, res) => {
    try {
        const locations = await Location.find({ verified: "Under Review" }).sort({ "timestamp": -1 });;
        res.status(200).send({ count: locations.length });
    } catch (error) {
        res.status(400).send(error);
    }
};

const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find().sort({ "timestamp": -1 });;
        return res.json(locations);
    } catch (error) {
        return res.status(400).send(error);
    }
}

const sendMsgToAllUsers = async (req, res) => {
    try {
        const usersList = await User.find().sort({ "timestamp": -1 });;

        usersList.forEach(async (user) => {
            await User.findByIdAndUpdate(user._id,
                {
                    $set: {
                        ...user._doc,
                        notifications: [...user.notifications, req.body],
                        notificationFlag: true
                    },
                },
                { new: true }
            );
        });
        res.status(200).send("Message Sent");
    } catch (error) {
        return res.status(400).send(error);
    }
}

module.exports = {
    getNoOfUsers,
    getNoOfLoctaions,
    getNoOfBookings,
    getNoOfRequests,
    getAllLocations,
    sendMsgToAllUsers
};
