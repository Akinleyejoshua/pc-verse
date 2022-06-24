const mongoose = require("mongoose");
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const connect = async () => {
    await mongoose.connect("mongodb+srv://pc-verse:pcverse1@cluster0.1zgdg.mongodb.net/?retryWrites=true&w=majority", options).then(res => {
        if (res) return console.log("Database Connected")
        console.log("Database Connection Failed")
    }).catch(err => {
        console.log("Database Connection Failed: " + err)
    })
}

module.exports = connect
