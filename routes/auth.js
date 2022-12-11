const express = require("express");
const router = express.Router();

const passport = require("passport");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");

router.get(
    "/google",
    passport.authenticate("google", {
        session: false,
        scope: ["email", "profile"],
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    function (req, res, next) {
        const body = { _id: req.user._id };
        const token = jwt.sign(body, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return res.json({ token: token });
    }
);

router.get(
    "/local",
    passport.authenticate("local", { session: false }),
    function (req, res, next) {
        const body = { _id: req.user._id };
        const token = jwt.sign(body, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return res.json({ token: token });
    }
);

router.post("/local/signup", [
    body("username")
        .escape()
        .exists()
        .custom(async (username) => {
            const user = await User.findOne({ username: username });
            if (user) {
                throw new Error("Username already exists");
            }
            return true;
        }),
    body("password")
        .exists()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
    body("confirm-password")
        .exists()
        .custom((confirmPassword, { req }) => {
            if (confirmPassword === req.body.password) {
                return true;
            }
            throw new Error("Confirmed password and password must be the same");
        }),
    async function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, password } = req.body;
        const user = await User.create({
            username: username,
            password: await bcrypt.hash(password, 10),
        });
        res.json({ message: `You have successfully signed up as ${username}` });
    },
]);

module.exports = router;
