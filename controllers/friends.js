const User = require("../models/user");
const { isValidObjectId } = require("mongoose");

exports.getFriendRequests = async function (req, res) {
    try {
        const userid = req.user._id;
        if (!isValidObjectId(userid)) {
            return res.status(400).json({ message: "Invalid ObjectId" });
        }
        let friendRequests = [];
        const user = await User.findById(userid);
        user.friends.forEach((object) => {
            if (object.status === "requested") {
                friendRequests.push(object.friend);
            }
        });
        res.json({ friendRequests: friendRequests });
    } catch (err) {
        return res.status(500).json({ message: "An error occurred" });
    }
};
exports.requestFriend = async function (req, res) {
    try {
        const userid = req.user._id;
        const { friendid } = req.query;
        if (!isValidObjectId(userid) || !isValidObjectId(friendid)) {
            return res.status(400).json({ message: "Invalid ObjectId" });
        }
        if (userid === friendid) {
            return res.status(400).json({
                message: "You can't send a friend request to yourself",
            });
        }
        const user = await User.findById(userid);
        const friend = await User.findById(friendid);

        // check if user is already friend or you have sent friend request to him
        for (let i = 0; i < user.friends.length; i++) {
            if (user.friends[i].friend.equals(friendid)) {
                return res.status(400).json({
                    message: `You already have ${friend.username} as a friend or you have sent a friend request to him`,
                });
            }
        }

        user.friends.push({ friend: friendid, status: "pending" });
        friend.friends.push({ friend: userid, status: "requested" });
        await user.save();
        await friend.save();
        return res.json({
            message: `You have sent a friend request to ${friend.username}`,
        });
    } catch (err) {
        return res.status(500).json({ message: "An error occurred" });
    }
};
exports.acceptFriend = async function (req, res) {
    try {
        const userid = req.user._id;
        const { friendid } = req.query;
        if (!isValidObjectId(userid) || !isValidObjectId(friendid)) {
            return res.json({ message: "Invalid ObjectId" });
        }
        if (userid === friendid) {
            return res.status(400).json({
                message: "You can't accept a friend request from yourself",
            });
        }
        const user = await User.findById(userid);
        user.friends.forEach((object) => {
            if (
                object.friend.equals(friendid) &&
                object.status === "requested"
            ) {
                object.status = "friends";
            }
        });
        await user.save();
        const friend = await User.findById(friendid);
        friend.friends.forEach((object) => {
            if (object.friend.equals(userid) && object.status === "pending") {
                object.status = "friends";
            }
        });
        await friend.save();
        return res.json({
            message: `You have accepted ${friend.username} as your friend`,
        });
    } catch (err) {
        return res.status(500).json({ message: "An error occurred" });
    }
};
exports.declineFriend = async function (req, res) {
    try {
        const userid = req.user._id;
        const { friendid } = req.query;
        if (!isValidObjectId(userid) || !isValidObjectId(friendid)) {
            return res.json({ message: "Invalid ObjectId" });
        }
        if (userid === friendid) {
            return res.status(400).json({
                message: "You can't decline a friend request from yourself",
            });
        }
        const user = await User.findById(userid);
        user.friends.forEach((object, index) => {
            if (
                object.friend.equals(friendid) &&
                object.status === "requested"
            ) {
                user.friends.splice(index, 1);
            }
        });
        await user.save();
        const friend = await User.findById(friendid);
        friend.friends.forEach((object, index) => {
            if (object.friend.equals(userid) && object.status === "pending") {
                friend.friends.splice(index, 1);
            }
        });
        await friend.save();
        return res.json({
            message: `You have declined ${friend.username}'s friend request`,
        });
    } catch (err) {
        return res.status(500).json({ message: "An error occurred" });
    }
};
exports.removeFriend = async function (req, res) {
    try {
        const userid = req.user._id;
        const { friendid } = req.query;
        if (!isValidObjectId(userid) || !isValidObjectId(friendid)) {
            return res.json({ message: "Invalid ObjectId" });
        }
        if (userid === friendid) {
            return res.status(400).json({
                message: "You can't remove yourself from your friends",
            });
        }
        const user = await User.findById(userid);
        user.friends.forEach((object, index) => {
            if (object.friend.equals(friendid) && object.status === "friends") {
                user.friends.splice(index, 1);
            }
        });
        await user.save();
        const friend = await User.findById(friendid);
        friend.friends.forEach((object, index) => {
            if (object.friend.equals(userid) && object.status === "friends") {
                friend.friends.splice(index, 1);
            }
        });
        await friend.save();
        return res.json({
            message: `You have removed ${friend.username} from your friends`,
        });
    } catch (err) {
        return res.status(500).json({ message: "An error occurred" });
    }
};
