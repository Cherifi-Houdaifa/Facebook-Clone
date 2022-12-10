const express = require("express");
const router = express.Router();

const passport = require("passport");

router.get("/", passport.authenticate("jwt", {session: false}),function (req, res, next) {
	res.json("hi");
});

module.exports = router;
