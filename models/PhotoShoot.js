const mongoose = require("mongoose");

const PhotoShootSchema = new mongoose.Schema(
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
        address: {
            type: String,
            required: true,
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("PhotoShoot", PhotoShootSchema);