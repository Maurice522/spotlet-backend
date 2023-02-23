// const fireAdmin = require("firebase-admin");
// const db = fireAdmin.firestore();

const Admin = require("../models/Admin");
const Booking = require("../models/Booking");
const Location = require("../models/Location");
const User = require("../models/User");

const jwt = require("jsonwebtoken");

const {
    JWT_SECRET,
} = require("../config/key");


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
        const locations = await Location.find().sort({ "timestamp": -1 });
        return res.status(200).json(locations);
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
                        notifications: [...user.notifications, req.body.form],
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

const signInAdmin = async (req, res) => {
    console.log("Reached")
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Please add details!" });

        //find admin
        const admin = await Admin.findOne({ "email": req.body.email });
        if (!admin)
            return res.status(404).json({ error: "You are not a admin!" });

        // const doMatch = await bcrypt.compare(password, admin.password);

        // if(doMatch){
        if (admin.password === password) {
            const token = jwt.sign({ _id: admin._id }, JWT_SECRET, { expiresIn: "7d" });
            console.log(token);
            return res.status(200).json({ token: token });
        } else
            return res.status(401).json({ error: "Invalid Email or Password!" });

    } catch (error) {
        return res.send(error);
    }
};

const forgotPasswordAdmin = async (req, res) => {
    try {
        const { email } = req.body;

        //find admin
        const admin = await Admin.findOne({ "email": req.body.email });

        if (!admin)
            return res.status(404).json({ error: "You are not a admin" });

        const receivers = [{ email: email },]
        const emailData = {
            sender,
            to: receivers,
            subject: "Password Reset",
            htmlContent: `<p>You requested for password reset</p>
                <br/>
                <h5>click in this 
                    <a href="https://spotlet.in/reset-password/${admin._id.toString()}">
                        link
                    </a> 
                    to reset password
                </h5>`,
        };

        await tranEmailApi.sendTransacEmail(emailData);

        res.json({ message: "check your email..." });
    } catch (error) {
        res.status(422).send(error);
    }
};

const resetPasswordAdmin = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const admin = await Admin.findOne({ _id: req.params.id });

        // const salt = await bcrypt.genSalt(13);
        // const newHashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedAdmin = {
            ...admin._doc,
            password: newPassword,
        };

        await Admin.findByIdAndUpdate(req.params.id, { $set: updatedAdmin, }, { new: true });

        res.status(200).json({ message: "password changed..." });
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports = {
    getNoOfUsers,
    getNoOfLoctaions,
    getNoOfBookings,
    getNoOfRequests,
    getAllLocations,
    sendMsgToAllUsers,
    signInAdmin,
    forgotPasswordAdmin,
    resetPasswordAdmin
};
