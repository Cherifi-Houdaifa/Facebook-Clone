const express = require("express");
const logger = require("morgan");
const cors = require('cors');
const compression = require('compression')
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Security best practices
app.disable('x-powered-by');
app.use(cors());

// Performance best practices
app.use(compression())

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
