const express = require("express");
const logger = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// DB connection
require("./helpers/db");

// passport configuration
require("./helpers/auth");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/auth", authRouter);

module.exports = app;
