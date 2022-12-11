const express = require("express");
const router = express.Router();

const friendsControllers = require("../../controllers/friends");

// send a friend request to a user
router.post("/request", friendsControllers.requestFriend);

// accept a friend request
router.post("/accept", friendsControllers.acceptFriend);

// decline a friend request
router.post("/decline", friendsControllers.declineFriend);

// remove a friend
router.delete("/remove", friendsControllers.removeFriend);

module.exports = router;
