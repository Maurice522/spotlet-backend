const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        personalInfo: {
            type: Object,
            required: true,
            default: {},
        },
        favourites: {
            type: [String],
            required: true,
            default: [],
        },
        listedLocations: {
            type: [Object],
            required: true,
            default: [],
        },
        portfolio: {
            type: [Object],
            required: true,
            default: [],
        },
        notifications: {
            type: [Object],
            required: true,
            default: [],
        },
        notificationFlag: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
