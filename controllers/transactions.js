const {
    Transactions,
    User
} = require("../model");
// const { transactionService } = require("../services")
const transactionService = require("../services/transaction.service");
require("dotenv").config();
const ObjectID = require('mongodb').ObjectID;

const addToken = async (req, res) => {
    const {
        id,
        transaction_ref,
        mcoin,
        amount,
        status,
        timestamp,
        message,
        transaction_id
    } = req.body;

    if ([id, transaction_ref, mcoin, amount, status, timestamp, message, transaction_id].includes(undefined)) return res.json({
        message: "incomplete input data",
        done: false,
    });

    const transactions = new Transactions({
        user_id: id,
        reference: transaction_ref,
        message: message,
        transaction_id: transaction_id,
        mcoin: mcoin,
        amount: amount,
        status: status,
        timestamp: timestamp,
    });

    const saveTransactions = new transactionService().createTransaction(transactions);

    const userExist = await User.findOne({
        _id: ObjectID(id)
    }).lean();

    const newToken = parseInt(userExist.mcoin) + parseInt(mcoin);

    if (userExist) {

        const addMCOIN = await User.updateOne({
            _id: ObjectID(id),
            mcoin: newToken
        }).lean();

        if (addMCOIN) {

            if (saveTransactions) {
                saveTransactions.then(data => {

                    res.json({
                        message: "mcoin-added",
                        done: true,
                        transactions: data,
                    });
                });
            } else {
                saveTransactions.then(data => {
                    res.json({
                        message: "mcoin-added",
                        done: true,
                        data: data,
                        user: addMCOIN,
                    });
                })
            }
        }

    } else {
        res.json({
            message: "user does not exist",
            done: false,
        });
    }

}

const getCredencials = async (req, res) => {
    res.json({
        pbkey: process.env.PBKEY,
        conversion: process.env.CONVERSION,
        dollar: process.env.DOLLAR
    })
}

const getTransactions = async (req, res) => {
    const {
        id
    } = req.body;

    const transactions = await Transactions.find({
        user_id: id,
    }).lean();

    if (transactions) {

        return res.json({
            done: true,
            data: transactions,
        });

    } else {
        return res.json({
            done: false,
            message: "You have not made any transaction yet!"
        })
    }

}

module.exports = {
    addToken,
    getCredencials,
    getTransactions
}