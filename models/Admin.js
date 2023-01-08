const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            default: ""
        },
        password: {
            type: String,
            required: true,
            default: ""
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);