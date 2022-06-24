const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token){
        return res.json({
            message: "Access denied"
        })
    } else {
        // console.log(token)
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, user) => {
            try {
                if (err) return res.json({
                    message: "token expired"
                });
                req.user = user;

                return next();
            } catch (err){
                console.log(err);
            }
        })
    }
}

module.exports = authenticateToken;