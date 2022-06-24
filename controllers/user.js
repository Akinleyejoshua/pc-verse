const { User, Notification } = require("../model");
// const ObjectID = require('mongodb').ObjectID;

const getData = async (req, res) => {
    const { id } = req.params;

    if (id === undefined) return res.json({
        message: "no input found",
        error: "invalid-input"
    });

    const idExist = await User.findOne({ id }).lean();
    const notifications = await Notification.find({
        user_id: id
    }).lean();

    if (idExist) {
        res.json({ data: idExist, notifications:notifications });
    } else {
        return res.json({
            message: "user does not exist",
            error: "does-not-exist",
            done: false,

        })
    }

}

const getNofification = async (req, res) => {
    const { id } = req.params;
    if (id === undefined) return res.json({
        message: "no input found",
        error: "invalid-input"
    });

    const idExist = await User.findOne({ id }).lean();
    const notifications = Notification.find({
        user_id: id
    }).lean();


    if (idExist && notifications) {
        res.json({ data: notifications })
    } else {
        return res.json({
            message: "user does not exist",
            error: "does not exist",
            done: false,
        })
    }
}

module.exports = {
    getData, getNofification
}