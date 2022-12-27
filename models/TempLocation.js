const mongoose = require("mongoose");

const TempLocationSchema = new mongoose.Schema(
    {
        location_id: {
            type: String,
            required: true,
            default: "",
        },
        property_desc: {
            type: Object,
            required: true,
            default: {},
        },
        amenities: {
            type: [String],
            default: [],
        },
        bankDetails: {
            type: Object,
            default: {},
        },
        contact_det: {
            type: Object,
            default: {},
        },
        do_and_dont: {
            type: Object,
            default: {},
        },
        features: {
            type: [String],
            default: [],
        },
        gst: {
            type: Object,
        },
        imagesData: {
            type: [Object],
            default: [],
        },
        pricing: {
            type: Object,
            default: {},
        },
        property_address: {
            type: Object,
            default: {},
        },
        rules: {
            type: [String],
            default: [],
        },
        timings: {
            type: Object,
            default: {},
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("TempLocation", TempLocationSchema);