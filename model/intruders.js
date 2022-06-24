const mongoose = require("mongoose");

const intrudersSchema = new mongoose.Schema({
    user_id: {
        required: true,
        type: String,
    },

    serialnumber: {
        required: true,
        type: String,
    },

    info: {
        required: true,
        type: String
    },

    timestamp: {
        required: true,
        type: String,
    },

    seen: {
        type: Boolean,
    },

    data: {
        type: Object,
    },

    permit: {
        type: Boolean,
    }

});

const Intruders = mongoose.model("intruders", intrudersSchema);

module.exports = Intruders;