const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
    {
        bookingId: {
            type: String,
            required: true,
            default: ""
        },
        locationId: {
            type: String,
            required: true,
            default: ""
        },
        members: {
            type: [String],
            required: true,
            default: []
        },
        users: {
            type: [Object],
            required: true,
            default: []
        },
        messages: {
            type: [Object],
            required: true,
            default: []
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);