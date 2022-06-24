const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    user_id: {
        required: true,
        type: String,
    },

    transaction_id: {
        required: true,
        type: String,
    },

    reference: {
        required: true,
        type: String,
    },

    timestamp: {
        required: true,
        type: String
    },

    amount: {
        required: true,
        type: String
    },

    mcoin: {
        required: true,
        type: String,
    },

    status: {
        required: true,
        type: String
    },

    message: {
        required: false,
        type: String
    },
    
});

const Transactions = mongoose.model("transactions", transactionSchema);

module.exports = Transactions;