const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
    {
        location_id: {
            type: String,
            required: true,
            default: "",
        },  
        amenities: {
            type: [String],
            required: true,
            default: [],
        },
        bankDetails: {
            type: Object,
            required: true,
            default: {},
        },
        bookedDates: {
            type: [Date],
            required: true,
            default: [],
        },
        contact_det: {
            type: Object,
            required: true,
            default: {},
        },
        do_and_dont: {
            type: Object,
            required: true,
            default: {},
        },
        features: {
            type: [String],
            required: true,
            default: [],
        },
        gst: {
            type: Object,
            default: {},
        },
        imagesData: {
            type: [Object],
            required: true,
            default: [],
        },
        pricing: {
            type: Object,
            required: true,
            default: {},
        },
        property_address: {
            type: Object,
            required: true,
            default: {},
        },
        property_desc: {
            type: Object,
            required: true,
            default: {},
        },
        rules: {
            type: [String],
            required: true,
            default: [],
        },
        timings: {
            type: Object,
            required: true,
            default: {},
        },
        review_and_rating: {
            type: [Object],
            required: true,
            default: [],
        }, 
        verified: {
            type: String,
            required: true,
            default: "",
        },        
    },
    { timestamps: true }
);

module.exports = mongoose.model("Location", LocationSchema);
