"use strict";
const fireAdmin = require("firebase-admin");
const db = fireAdmin.firestore();

const createTransaction = async (req, res) => {
    const data = req.body;
    try {
        await db.collection("transactions").doc(data.bookingid).set(data);
        return res.send("Transaction Added");
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

const getTransactions = async (req, res) => {
    try {
        const snapshot = await db.collection("transactions").get();
        const transactions = snapshot.docs.map(doc => {
            return doc.data();
        })
        res.status(200).send(transactions);
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

module.exports = {
    createTransaction, getTransactions
};