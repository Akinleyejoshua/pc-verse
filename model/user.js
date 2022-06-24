const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    fname: {
        required: false,
        type: String
    },

    lname: {
        required: false,
        type: String
    },

    username: {
        type: String,
        required: true,
    },

    mcoin: {
        type: Number,
        required: false,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },
    
    password: {
        type: String,
        required: true,
    },

    isVerified: {
        type: Boolean, default: false
    },
    
    token: {
        type: String
    },

    passkey: {
        type: Number,
    },

    location: {
        type: String,
    },

    timestamp: {
        required: false,
        type: String
    },

})

const User = mongoose.model("users", userSchema);

module.exports = User;