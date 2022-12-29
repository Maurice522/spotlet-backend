const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            default: ""
        },
        image: {
            type: Object,
            default: {}
        },
        subheading: {
            type: String,
            default: ""
        },
        date: {
            type: String,
            required: true,
            default: "",
        },
        content: {
            type: String,
            required: true,
            default: "",
        },
        likes: {
            type: Object,
            default: {},
        },
        comments: {
            type: Object,
            default: {},
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
