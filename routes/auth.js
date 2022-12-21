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
        return res
            .cookie("check", "1", {
                sameSite: "None",
                secure: true,
                path: "/",
                maxAge: 1000 * 3600 * 24,
            })
            .cookie("jwt", token, {
                httpOnly: true,
                sameSite: "None",
                secure: true,
                path: "/",
                maxAge: 1000 * 3600 * 24,
            })
            .json({ message: "You have logged in successfully" });
    }
);

router.post(
    "/local",
    passport.authenticate("local", { session: false }),
    function (req, res, next) {
        const body = { _id: req.user._id };
        const token = jwt.sign(body, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return res
            .cookie("check", "1", {
                sameSite: "None",
                secure: true,
                path: "/",
                maxAge: 1000 * 3600 * 24,
            })
            .cookie("jwt", token, {
                httpOnly: true,
                sameSite: "None",
                secure: true,
                path: "/",
                maxAge: 1000 * 3600 * 24,
            })
            .json({ message: "You have logged in successfully" });
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

router.get("/logout", function (req, res, next) {
    if (!req.cookies["jwt"]) {
        return res
            .status(401)
            .json({ message: "You have not sent a jwt token" });
    }
    res.clearCookie("jwt").clearCookie("check").json({
        message: "You have logged out successfully",
    });
});

module.exports = router;
