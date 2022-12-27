const mongoose = require("mongoose");

const ContactUsSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            default: ""
        },
        email: {
            type: String,
            required: true,
            default: ""
        },
        mobile: {
            type: String,
            required: true,
            default: ""
        },
        message: {
            type: String,
            required: true,
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ContactUs", ContactUsSchema);