const jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer');
require("dotenv").config();


const generateAccessToken = (user, exp, key) => {
    return jwt.sign(user, `${key}`, {
        expiresIn: exp,
    });
}

const paginator = (data, page, limit) => {

    var pagination, result = {};
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // pagination = data;

    // if (endIndex > data.length){
    //     result.next = {
    //         page: page + 1,
    //         limit: limit
    //     }
    // }

    // if (startIndex > 0){
    //     result.prev = {
    //         page: page - 1,
    //         limit: limit
    //     }
    // }

    result = {
        // records: pagination.slice(startIndex, endIndex),
        next: {
            page: page + 1,
            limit: limit
        },
        prev: {
            page: page - 1,
            limit: limit
        }

    }

    return result;
}

var transporter = nodemailer.createTransport({
    service: `${process.env.EMAIL}`,
    auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASS}`
    }, 
    // port: `${process.env.EMAIL_PORT}`,
});

const mail = async (to, subject, template) => {

    const mailOptions = {
        from: `${process.env.EMAIL_USER}`, // sender address
        to: `${to}`, // list of receivers
        subject: `${subject}`, // Subject line
        html: `${template}`// plain text body
    };

    return transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err);
        else
            console.log(info);
    });

}

module.exports = {
    tokenGenerator: generateAccessToken, paginator, mail
}