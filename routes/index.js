const router = require("express").Router();
const { auth, user, crack, transactions, devices } = require("../controllers");
const { authToken } = require("../middlewear");

router.get("/api/", (req, res) => {
    res.json({
        message: "API working!",

    })
});

router.get("/api/user/:id", user.getData);
router.post("/api/user/@:username", authToken, user.getData);
router.post("/api/notifications/:id", authToken, user.getNofification);

router.get("/api/get-token/data", transactions.getCredencials);
router.post("/api/auth/signup/", auth.signUp);
router.post("/api/auth/signin/", auth.login);
router.post("/api/auth/verify/account/", auth.verifyAccount);
router.post("/api/auth/reset/pwd/", auth.resetPwd);
router.post("/api/auth/reset-password/", auth.resetPassword);

router.post("/api/add-device/", devices.addDevice);
router.post("/api/get-device/", devices.getDevices);
router.post("/api/device/online", devices.deviceOnline);
router.post("/api/device/status", devices.deviceStatus);

router.post("/api/get-token/mcoin", authToken, transactions.addToken);
router.post("/api/get-token/transactions", authToken, transactions.getTransactions);

router.post("/api/crack/:id", crack.crack_pwd);

console.log("routing")

module.exports = router;
