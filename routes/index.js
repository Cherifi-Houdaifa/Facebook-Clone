const express = require("express");
const router = express.Router();

const usersRouter = require("./users/users");
const postsRouter = require("./posts/posts");
const passport = require("passport");

router.use(
    "/users",
    passport.authenticate("jwt", { session: false }),
    usersRouter
);

router.use(
    "/posts",
    passport.authenticate("jwt", { session: false }),
    postsRouter
);

module.exports = router;
