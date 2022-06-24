const { User, Notification } = require("../model");
const bcrypt = require("bcrypt");
// const { UserServices } = require("../services");
const { tokenGenerator, mail } = require("../utils");
const UserServives = require("../services/user.services");
const { ObjectId } = require("mongodb");
// const fs = require("fs");

const signUp = async (req, res) => {
    const { username, email, password, time } = req.body;

    const emailExist = await User.findOne({
        email,
    }).lean();
    const usernameExist = await User.findOne({
        username,
    }).lean();

    if (emailExist) {
        return res.json({
            message: `email - ${email} already exist`,
            error: "email exist",
        });
    } else if (usernameExist) {
        return res.json({
            msessage: `username - ${username} already exist`,
            error: "username exist",
        });
    } else {
        if (
            username === undefined ||
            email === undefined ||
            password === undefined
        ) {
            return res.json({
                message: "All fields are required",
            });
        } else {
            const hash = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                email,
                password: hash,
                mcoin: 1,
            });

            const saveUser = new UserServives().createUser(newUser);


            if (saveUser) {
                saveUser.then(data => {
                    // console.log(data);

                    const html = `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Verification</title>
                        </head>
                        <body>
                            <h1>Hello ${data.username}, congrats on your successfull registration with us</h1>
                            <h2>Also you need to understand that email Verification is a very important factor today due to security risks</h2>
                            <h3>Verify your account now by clicking the Verification button bellow</h3>
                            <a target='__blank' href='http://127.0.0.1:3000/verify-account/${data._id}'>Verify Now</a>
                            <h2>Enjoy!!!</h2>
                        </body>
                        </html>
                    `;

                    mail(email, "Account Verification@PC-Verse", html).then(res => { return null; });
                    new Notification({ user_id: data._id, info: "Check your email for account varification", seen: false, timestamp: time }).save()

                    const token = tokenGenerator(
                        {
                            user_id: data._id,
                        },
                        "1m"
                    );

                    data.token = token;
                    new Notification({ user_id: data._id, info: "You have been credited $5 ~ 1mcoin for free", seen: false, timestamp: time }).save()

                    return res.status(200).json({
                        message: "Account Created",
                        data: data,
                        done: true,
                    });

                });


            } else {
                res.status(200).json({
                    message: "User already exist",
                });
            }
        }
    }
};

const login = async (req, res) => {
    const { email, password, time } = req.body;

    if (email === undefined || password === undefined) {
        return res.json({
            message: "All fields are required",
        });
    } else {
        const user = await User.findOne({
            email: email,
        });

        if (!user) {
            return res.json({
                message: "user does not exsit",
                error: "not-exist",
            });
        } else {
            const isMatch = await bcrypt.compare(`${password}`, `${user.password}`);
            if (!isMatch) {
                return res.json({
                    message: "email or password incorrect",
                    error: "incorrect",
                });
            } else {
                const accessToken = tokenGenerator(
                    {
                        user_id: user._id,
                    },
                    "1h",
                    process.env.TOKEN_SECRET_KEY
                );
                user.token = accessToken;
                new Notification({ user_id: user._id, info: "Account login", seen: false, timestamp: time }).save()

                res.json({
                    message: "success",
                    data: {
                        accessToken: accessToken,
                    },
                    done: true,
                });
            }
        }
        // console.log(isMatch);
    }
};

const verifyAccount = async (req, res) => {
    const { id, time } = req.body;

    const verify = await User.updateOne(
        {
            _id: ObjectId(id),
            isVerified: true,
        },
    );

    if (verify) {
        new Notification({ user_id: id, info: "Account Verified!", seen: false, timestamp: time }).save()

        return res.json({
            message: "account verified",
            done: true,
        });

    } else {

        return res.json({
            message: "This account does not exist",
            done: false,
            error: "does-not-exist",
        });

    }
};

const resetPwd = async (req, res) => {
    const { email } = req.body;

    const emailExist = await User.findOne({
        email,
    }).lean();
    if (!emailExist)
        return res.json({
            message: `email - ${email} is not registered with us`,
            done: false,
            error: "unknown-email",
        });

    const html = `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password</title>
        </head>
        
        <body>
            <p>Hey, ${emailExist.username}</h1>
            <p>If you know you are not the one who requested for a change of password, kindly ignore this email & report this email</p>
            <a href="http://127.0.0.1:3000/reset-pwd/${emailExist._id}">click here to reset</a>
            <a href="http://127.0.0.1:3000/report">click here to report activity</a>
        </body>
        
        </html>
    `;
    
    mail(email, "Password Reset@PCVerse", html).then(res => { return null; });
    return res.json({
        message: "check your email for due procedures",
        done: true,
    });
};

const resetPassword = async (req, res) => {
    const { id, password } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const changePwd = await User.updateOne(
        {
            _id: ObjectId(id),
            password: hash,
        },
    );
    if (changePwd) {
        new Notification({ user_id: id, info: "Password Changed Successfully!", seen: false, timestamp: time }).save()

        return res.json({
            message: "password changed successfully",
            done: true,
        });

    } else {

        return res.json({
            message: "This account does not exist",
            done: false,
            error: "does-not-exist",
        });

    }
};

const getUserData = async (req, res) => {
    const { uid } = req.params;
    const user = await User.findOne({
        _id: uid,
    }).lean();

    if (!user) {
        return res.json({
            error: "not found",
            message: "user not found",
        });
    } else {
        res.json({
            user: user,
            message: "success",
        });
    }
};

module.exports = {
    signUp,
    login,
    getUserData,
    verifyAccount,
    resetPwd,
    resetPassword,
};
