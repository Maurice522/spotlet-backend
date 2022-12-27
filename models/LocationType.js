const mongoose = require("mongoose");

const LocationTypeSchema = new mongoose.Schema(
    {
        label: {
            type: String,
            required: true,
            default: ""
        },
        value: {
            type: String,
            required: true,
            default: ""
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("LocationType", LocationTypeSchema);