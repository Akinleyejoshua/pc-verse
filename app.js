const express = require("express");
const cors = require("cors");
const routes = require("./routes/index.js");

const app = express();
app.use(
    cors({
        credentials: true,
        origin: true
    })
);
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(routes);


module.exports = app;
