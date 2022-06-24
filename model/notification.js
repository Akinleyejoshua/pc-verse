const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user_id: {
        required: true,
        type: String,
    },

    info:{
        required: true,
        type: String
    },

    timestamp: {
        required: true,
        type: String,
    },

    seen:{
        type: Boolean,
    }

});

const Notification = mongoose.model("notifications", notificationSchema);

module.exports = Notification;