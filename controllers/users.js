const User = require("../models/user");
const { isValidObjectId } = require("mongoose");
const { body, validationResult } = require("express-validator");

exports.searchUser = async function (req, res, next) {
    try {
        const { search } = req.query;
        const users = await User.find({ username: new RegExp(search, "i") });
        return res.json({ users: users });
    } catch (err) {
        return next(err);
    }
};
exports.getUser = async function (req, res, next) {
    try {
        const { userid } = req.params;
        if (!isValidObjectId(userid)) {
            return res.status(400).json({ message: "Invalid ObjectId" });
        }
        let user = await User.findById(userid)
            .populate("friends.friend")
            .exec();
        // filtering the friend requests
        user.friends = user.friends.filter((friend) => {
            if (friend.status !== "friends") {
                return false;
            }
            return true;
        });
        user = user.toObject();
        // removing passwords and googleids from objects
        delete user.password;
        delete user.googleid;
        // removing passwords and googleids from friends objects and removing their friends
        user.friends.forEach((object) => {
            delete object.friend.password;
            delete object.friend.googleid;
            delete object.friend.friends;
        });
        return res.json({ user: user });
    } catch (err) {
        return next(err);
    }
};
exports.updateUser = [
    body("username").optional(),
    body("profilePic").optional().isURL(),
    async function (req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { userid } = req.params;
            if (req.user._id !== userid) {
                return res.status(400).json({
                    message:
                        "You need to be logged in as the user to update his profile",
                });
            }
            if (!isValidObjectId(userid)) {
                return res.status(400).json({ message: "Invalid ObjectId" });
            }
            const { username, profilePic } = req.body;
            const user = await User.findByIdAndUpdate(userid, {
                username: username,
                profilePic: profilePic,
            });
            return res.json({ message: "Successfully updated user" });
        } catch (err) {
            return next(err);
        }
    },
];
