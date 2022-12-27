const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
    {
        amount: {
            type: String,
            required: true,
            default: ""
        },
        bookingdate: {
            type: String,
            required: true,
            default: ""
        },
        bookingid: {
            type: String,
            required: true,
            default: ""
        },
        bookingname: {
            type: String,
            required: true,
            default: "",
        },
        date: {
            type: String,
            required: true,
            default: "",
        },
        hostname: {
            type: String,
            required: true,
            default: "",
        },
        locationid: {
            type: String,
            required: true,
            default: "",
        },
        status: {
            type: String,
            required: true,
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);