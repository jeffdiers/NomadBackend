let mongoose = require('mongoose');
let config = require('../config');

let RequestSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true
    },
    beardTrim: {
        type: Number
    },
    clipperCut: {
        type: Number
    },
    hairCut: {
        type: Number
    },
    user_barber_id: {
        type: Number,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    initialPosition: {
        type: Object,
        required: true
    },
    isSchedeuled: {
        type: Boolean,
        default: false
    }
});