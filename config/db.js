const mongoose = require("mongoose");
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const connect = async () => {
    await mongoose.connect("mongodb+srv://uni-pc:uni-pc1@cluster0.mr8nz2m.mongodb.net/?retryWrites=true&w=majority", options).then(res => {
        if (res) return console.log("Database Connected")
        console.log("Database Connection Failed")
    }).catch(err => {
        console.log("Database Connection Failed: " + err)
    })
}

module.exports = connect
