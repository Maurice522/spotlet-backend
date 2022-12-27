"use strict";
// const fireAdmin = require("firebase-admin");
// const db = fireAdmin.firestore();

const Transaction = require("../models/Transaction");

const createTransaction = async (req, res) => {
    try {
        const newTransaction = new Transaction({
            amount: req.body.amount,
            bookingdate: req.body.bookingdate,
            bookingid: req.body.bookingid,
            bookingname: req.body.bookingname,
            date: req.body.date,
            hostname: req.body.hostname,
            locationid: req.body.locationid,
            status: req.body.status,
        });

        const createdTransaction = await newTransaction.save();
        return res.send("Transaction Added");
    } catch (error) {
        return res.status(400).send(error);
    }
}

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ "timestamp": -1 });;

        res.status(200).send(transactions);

    } catch (error) {
        return res.status(400).send(error);
    }
}

module.exports = {
    createTransaction, getTransactions
};