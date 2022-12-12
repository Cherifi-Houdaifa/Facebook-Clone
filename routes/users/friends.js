const express = require("express");
const router = express.Router();

const friendsControllers = require("../../controllers/friends");


// get all friend requests sent to you
router.get("/", friendsControllers.getFriendRequests);

// All down need query parameter (friendid)
// send a friend request to a user
router.post("/request", friendsControllers.requestFriend);

// accept a friend request
router.post("/accept", friendsControllers.acceptFriend);

// decline a friend request
router.post("/decline", friendsControllers.declineFriend);

// remove a friend
router.delete("/remove", friendsControllers.removeFriend);

module.exports = router;
