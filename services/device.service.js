class DeviceService {
    createDevice = async (data) => {
        try{
            const devices = await data.save();
            return devices;
        } catch (err){
            console.log("Failed to Add Device");
            console.log(err);
            return "err";
        }
    }
}

module.exports = DeviceService;