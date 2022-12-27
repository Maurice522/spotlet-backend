const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
    {
        reqDate: {
            type: String,
            required: true,
        },
        event: {
            type: String,
            required: true,
            default: ""
        },
        date: {
            type: String,
            required: true,
            default: ""
        },
        time: {
            type: String,
            required: true,
            default: "",
        },
        duration_in_hours: {
            type: String,
            required: true,
            default: "",
        },
        activity: {
            type: String,
            required: true,
            default: "",
        },
        user_id: {
            type: String,
            required: true,
            default: "",
        },
        user_data: {
            type: Object,
            required: true,
            default: {},
        },
        owner_id: {
            type: String,
            required: true,
            default: "",
        },
        discount: {
            type: String,
            required: true,
            default: "",
        },
        processfee: {
            type: String,
            required: true,
            default: "",
        },
        final_amount: {
            type: String,
            required: true,
            default: "",
        },
        property_id: {
            type: String,
            required: true,
            default: "",
        },
        total_amt: {
            type: String,
            required: true,
            default: "",
        },
        status: {
            type: String,
            required: true,
            default: "",
        },
        payment_status: {
            type: String,
            required: true,
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);