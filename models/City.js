const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema(
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

module.exports = mongoose.model("City", CitySchema);