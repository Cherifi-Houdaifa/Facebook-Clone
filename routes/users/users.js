const express = require("express");
const router = express.Router();

const friendsRouter = require("./friends");
const usersControllers = require("../../controllers/users");

router.use("/friends", friendsRouter);

// get current user
router.get("/current", usersControllers.getCurrentUser);

// Search in users by username (search query included)
router.get("/search", usersControllers.searchUser);

// get user by _id with (friends included)
router.get("/:userid", usersControllers.getUser);

// update user profile (username or profile picture only) (you need to be logged in as the user)
router.put("/", usersControllers.updateUser);

module.exports = router;
