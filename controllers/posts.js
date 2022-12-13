const Post = require("../models/post");
const Comment = require("../models/comment");
const { isValidObjectId } = require("mongoose");
const { body, validationResult } = require("express-validator");

exports.getPosts = async function (req, res) {
    try {
        const { userid, skip } = req.query;
        // userid included
        if (userid) {
            if (!isValidObjectId(userid)) {
                return res.status(400).json({ message: "Invalid ObjectId" });
            }
            const posts = await Post.find({ user: userid })
                .sort({ date: "desc" })
                .skip(skip || 0)
                .limit(10)
                .exec();
            return res.json(posts);
        }
        // userid not included
        else {
            const posts = await Post.find({})
                .sort({ date: "desc" })
                .skip(skip || 0)
                .limit(10)
                .exec();
            return res.json(posts);
        }
    } catch (err) {
        return res.status(500).json({ message: "An error occurred" });
    }
};
exports.createPost = [
    body("text").exists().isAscii(),
    async function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const userid = req.user._id;
            const { text } = req.body;
            if (!isValidObjectId(userid)) {
                return res.status(400).json({ message: "Invalid ObjectId" });
            }
            const post = await Post.create({
                user: userid,
                text: text,
                date: Date.now(),
            });
            res.json({ post: post });
        } catch (err) {
            return res.status(500).json({ message: "An error occurred" });
        }
    },
];
exports.toggleLike = async function (req, res) {
    try {
        const userid = req.user._id;
        const { postid } = req.query;
        if (!isValidObjectId(postid)) {
            return res.status(400).json({ message: "Invalid ObjectId" });
        }
        const post = await Post.findById(postid);
        for (let i = 0; i < post.likes.length; i++) {
            if (post.likes[i].equals(userid)) {
                post.likes.splice(i, 1);
                await post.save();
                return res.json({ message: "You have unliked this post" });
            }
        }
        post.likes.push(userid);
        await post.save();
        return res.json({ message: "You have liked this post" });
    } catch (err) {
        return res.status(500).json({ message: "An error occurred" });
    }
};
exports.removePost = async function (req, res) {
    try {
        const userid = req.user._id;
        const { postid } = req.query;
        if (!isValidObjectId(postid)) {
            return res.status(400).json({ message: "Invalid ObjectId" });
        }
        const post = await Post.findById(postid);
        if (!post.user.equals(userid)) {
            return res
                .status(400)
                .json({
                    message:
                        "You can't delete this post because it's not yours",
                });
        }
        await post.delete();

        const comments = await Promise.all(
            post.comments.map((commentid) => {
                return Comment.findByIdAndDelete(commentid);
            })
        );
        res.json({ message: `Deleted post with id ${post._id}` });
    } catch (err) {
        return res.status(500).json({ message: "An error occurred" });
    }
};
