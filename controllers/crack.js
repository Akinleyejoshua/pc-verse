const { User, Devices } = require("../model");
require("dotenv").config();
const ObjectID = require('mongodb').ObjectID;


const crack_pwd = async (req, res) => {
    const { id } = req.params;
    const { serial } = req.body;

    const userExist = await User.findOne({ id }).lean();

    if (userExist) {
        if ([undefined, null, ""].includes(serial)) return res.json({
            message: "invalid input",
            done: false,
        })


        const user = userExist
        const mcoin = user.mcoin;
        const devices = await Devices.find({user_id: id, serialnumber: serial});
        const systeminformation = [];

        // if (devices.length === 0 || !devices) return res.json({
        //     message: "you have no registered device yet!",
        //     done: false,
        // })

        devices.map(items => {
            systeminformation.push(items.serialnumber);
        });

        // return res.json({
        //     systeminformation,
        //     devices
        // })

        if (systeminformation.length < 0) {
            res.json({
                message: "you dont have any device registered yet!",
                done: false,
                actions: "reg-pc"
            })
        } else if (!systeminformation.includes(serial)) {
            const serialExist = await Devices.find({ serialnumber: serial, user_id: id });

            if (serialExist.length !== 0) {
                res.json({
                    message: "This PC belongs to another registered user",
                    done: false,
                    actions: "flag-user"
                })
            } else {
                res.json({
                    message: `This PC has not been registered yet, Visit <a target='__blank' href='http://127.0.0.1:3000/devices/${serial}'>Here to Add Device</a>`,
                    done: false,
                    action: "reg-this-pc",
                })
            }
        } else if (mcoin > 0) {
            const total = mcoin - process.env.RATE_USAGE;
            const deduct = await User.updateOne({_id: ObjectID(id), mcoin: total}).lean();;

            if (deduct) {

                res.json({
                    done: true,
                    message: "ready",
                    mcoin: deduct.mcoin,
                    devices: devices
                });

            } else {

                res.json({
                    done: false,
                    message: "unable to activate crack",
                });

            }
            
        } else {
            res.json({
                message: "you dont have suffient mcoin, purchase",
                done: false,
                action: "buy-mcoin"
            })
        }
    } else {
        return res.json({
            message: "user does not exist",
            error: "does not exist"
        })
    }
}

module.exports = {
    crack_pwd
}