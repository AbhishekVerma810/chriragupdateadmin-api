const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require('cors');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')
require('dotenv').config();

const i18n = require('./middleware/i18n.config')
const session = require('./middleware/session')
const apiRestriction = require("./middleware/set.api.restriction")
const catchRouteError = require("./middleware/catch.route.error")
const catchGlobalError = require("./middleware/catch.global.error")
const { apiError } = require("./utils/response");
const parser = require("./middleware/parser")
const adminRoute = require("./routes/admin");
const apiRoute = require("./routes/api");

app.use(cors())
app.use(cookieParser());
app.use(session)
app.use(flash());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use("/public", express.static('public/'));
app.use("/upload", express.static("src/upload"));
app.use(express.static('views'));
app.use(apiRestriction)
app.use(i18n)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use("/public", express.static(__dirname + "/public/"));
app.use(parser)
app.use("/admin", adminRoute)
app.use("/api", apiRoute)
// bypass cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
    next()
})

// set port, listen for requests
app.use((err, req, res, next) => {
    console.log("API ERR : ", err);
    let error = apiError(err);
    res.status(error.status || 500);
    res.send(error);
});
app.get('/', (req, res) => {
    res.send('Hello, this is a test route!');
});
app.use(catchRouteError)
app.use(catchGlobalError)

module.exports = app
