const mongoose = require("mongoose");

const DeactRequestSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
            default: ""
        },
        CustomerName: {
            type: String,
            required: true,
            default: ""
        },
        CustomerEmail: {
            type: String,
            required: true,
            default: ""
        },
        CustomerImage: {
            type: String,
            default: ""
        },
        Mobile: {
            type: String,
            required: true,
            default: ""
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("DeactRequest", DeactRequestSchema);