const app =  require("./app.js");
const db = require("./config/db");
require("dotenv").config();

db();

const port = 8000

app.listen(port, () => console.log(`Server running on localhost:${port}`))
