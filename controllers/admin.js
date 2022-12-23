const fireAdmin = require("firebase-admin");
const db = fireAdmin.firestore();

const getNoOfUsers = async (req, res) => {
    let count = 0;
    try {
        const snapshot = await db.collection("users").get();
        snapshot.docs.map((doc) => {
            count++;
        });
        res.status(200).send({ count });
    } catch (error) {
        res.status(400).send(error);
    }
};

const getNoOfLoctaions = async (req, res) => {
    let count = 0;
    try {
        const snapshot = await db.collection("location").where("verified", "==", "Approved").get();;
        snapshot.docs.map((doc) => {
            count++;
        });
        res.status(200).send({ count });
    } catch (error) {
        res.status(400).send(error);
    }
};

const getNoOfBookings = async (req, res) => {
    let count = 0;
    try {
        // const snapshot = await db.collection("bookings").get();
        // snapshot.docs.map(async (doc) => {
        const requests = await db.collection("bookings").doc("spot35127").collection("bookingrequests").get();
        requests.docs.map(doc => {
            count++;
        })
        // });
        // res.status(200).send(snapshot.docs);
        res.status(200).send({ count });
    } catch (error) {
        res.status(422).send(error);
    }
};

const getNoOfRequests = async (req, res) => {
    let count = 0;
    try {
        const snapshot = await db.collection("location").where("verified", "==", "Under Review").get();
        snapshot.docs.map(doc => {
            count++;
        })
        res.status(200).send({ count });
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
        // console.log(form);
        userlist.forEach(async (user) => {
            const snapshot = await db.collection("users").doc(user.id).get();
            const userData = snapshot.data();
            // console.log(userData);
            await db.collection("users").doc(user.id).update({ ...userData, notifications: [...userData.notifications, form], notificationFlag: true });
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
