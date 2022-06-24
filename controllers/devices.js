const {
    Devices,
    User
} = require("../model");
const DeviceService = require("../services/device.service");
require("dotenv").config();
const ObjectID = require('mongodb').ObjectID;

const addDevice = async (req, res) => {
    const { id, pcName, platform, serialnumber, pcUser, online } = req.body;

    if ([id, pcName, platform, serialnumber, pcUser, online].includes(undefined)) return res.json({
        message: "no input found",
        error: "invalid-input"
    });


    const idExist = await User.findOne({ _id: ObjectID(id) }).lean();

    if (idExist) {

        const deviceExsit = await Devices.findOne({
            $and: [
                {
                    user_id: idExist._id,
                    serialnumber: serialnumber
                }
            ]
        });

        if (deviceExsit) {

            return res.json({
                message: "This serialnumber has already been registered",
                error: "already-registered",
                done: false,
            });

        } else {
            const newDevice = await Devices({
                user_id: id, pcName, platform, serialnumber, pcUser, online: false
            })

            const deviceService = new DeviceService().createDevice(newDevice);

            if (deviceService) {
                deviceService.then(data => {
                    if (data === "err") return res.json({
                        message: "This serialnumber has already been registered",
                        error: "already-registered",
                        done: false,
                    });

                    res.json({
                        message: "device added",
                        devices: newDevice,
                        done: true,
                    });

                });
            } else {
                return res.json({
                    message: "Oops, an error occured!",
                    error: "add-device-failed",
                })
            }
        }


    } else {
        return res.json({
            message: "user does not exist",
            error: "does not exist"
        })
    }
}

const getDevices = async (req, res) => {
    const { id } = req.body;

    if ([id].includes(undefined || "")) return res.json({
        message: "no input found",
        error: "invalid-input"
    });

    const idExist = await User.findOne({ _id: ObjectID(id) }).lean();
    const devices = await Devices.find({ user_id: id }).lean();

    if (idExist) {
        if (devices) {
            return res.json({
                done: true,
                devices: devices,
            });
        } else {
            return res.json({
                done: false,
                error: "Oops, device not found",
            });
        }
    } else {
        return res.json({
            done: false,
            error: "user-not-found",
        });
    }

}

const deviceStatus = async (req, res) => {
    const { id, user_id } = req.body;


    if ([id, user_id].includes(undefined)) return res.json({
        message: "no input found",
        error: "invalid-input"
    });

    const idExist = await User.findOne({ _id: ObjectID(user_id) }).lean();
    const devices = await Devices.findOne({
        $and: [
            {
                _id: ObjectID(id),
                user_id: user_id
            }
        ]
    }).lean();


    if (idExist) {
        if (devices) {
            return res.json({
                done: true,
                online: devices.online
            });
        } else {
            return res.json({
                done: false,
                error: "Oops, device not found",
            })
        }
    } else {
        return res.json({
            done: false,
            error: "user-not-found",
        });
    }
}

const deviceOnline = async (req, res) => {
    const { id, user_id, online } = req.body;


    if ([id, user_id].includes(undefined)) return res.json({
        message: "no input found",
        error: "invalid-input"
    });

    const idExist = await User.findOne({ _id: ObjectID(user_id) }).lean();

    if (idExist) {
        const devices = await Devices.updateOne({ user_id: id, _id: ObjectID(id), online }).lean();
        if (devices) {
            setTimeout(() => {
                const devices = Devices.updateOne({ user_id: id, _id: ObjectID(id), online: false }).lean();
                if (devices) return res.json({
                    done: true,
                    online: false,
                });
            }, 2000)

            return res.json({
                done: true,
                online: online,
            });


        } else {
            return res.json({
                done: false,
                error: "Oops, device not found",
            })
        }
    } else {
        return res.json({
            done: false,
            error: "user-not-found",
        });
    }

}

module.exports = {
    addDevice, getDevices, deviceOnline, deviceStatus
}