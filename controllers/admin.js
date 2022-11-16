const fireAdmin = require("firebase-admin");
const db = fireAdmin.firestore();

const getNoOfUsers = async (req, res) => {
    try {
        const user = await db.collection("users").get();;
        const size = user._size;
        res.status(200).send({ size });
    } catch (error) {
        res.status(422).send(error);
    }
};

const getNoOfLoctaions = async (req, res) => {
    try {
        const locations = await db.collection("location").get();;
        const size = locations._size;
        res.status(200).send({ size });
    } catch (error) {
        res.status(422).send(error);
    }
};

const getNoOfBookings = async (req, res) => {
    try {
        await db.collection("bookings").get()
            .then((bookings) => {
                console.log(bookings.docs);
                bookings.docs.map((booking) => {
                })
            })
            .catch((error) => console.log(error));
        res.status(200).send(bookings.data());
    } catch (error) {
        res.status(422).send(error);
    }
};

const getNoOfRequests = async (req, res) => {
    try {
        const locations = await db.collection("locations").get();
        console.log(locations.docs);
        res.status(200).send("Requests");
    } catch (error) {
        res.status(422).send(error);
    }
};

const getAllLocations = async (req, res) => {
    try {
        const snapshots = await db.collection("location").orderBy("timestamp", "desc").get();
        const locations = snapshots.docs.map(doc => {
            return { location_id: doc.id, ...doc.data() };
        })
        return res.json({ locations });
    } catch (error) {
        return res.status(400).send(error);
    }
}

const sendMsgToAllUsers = async (req, res) => {
    try {
        const { userlist, form } = req.body;
        console.log(form);
        userlist.forEach(async (user) => {
            const snapshot = await db.collection("users").doc(user.id).get();
            const userData = snapshot.data();
            await db.collection("users").doc(user.id).update({ ...userData, notifications: [...userData.notifications, form] });
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
