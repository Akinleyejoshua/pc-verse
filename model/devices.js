const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
    user_id: {
        required: true,
        type: String,
    },

    pcName: {
        required: true,
        type: String,
    },

    platform: {
        required: true,
        type: String,
    },

    serialnumber: {
        required: true,
        type: String,
        unique: true,
    },

    pcUser: {
        required: true,
        type: String
    },

    online: {
        required: true,
        type: Boolean
    },

});

const Devices = mongoose.model("devices", deviceSchema);

module.exports = Devices;