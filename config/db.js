const mongoose = require("mongoose");
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const connect = async () => {
    await mongoose.connect(process.env.MONGO_URI, options).then(res => {
        if (res) return console.log("Database Connected")
        console.log("Database Connection Failed")
    }).catch(err => {
        console.log("Database Connection Failed: " + err)
    })
}

module.exports = connect