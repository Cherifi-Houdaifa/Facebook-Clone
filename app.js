const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Security best practices
app.disable("x-powered-by");
app.use(
    cors({
        origin: process.env.ALLOWED_ORIGINS.split("&"),
        credentials: true,
    })
);

// Performance best practices
app.use(compression());

// App middlewares
app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// DB connection
require("./helpers/db");

// passport configuration
require("./helpers/auth");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");

app.use("/", indexRouter);
app.use("/auth", authRouter);

app.use(function (err, req, res, next) {
    return res.status(500).json({ message: "An error occurred" });
});

module.exports = app;
