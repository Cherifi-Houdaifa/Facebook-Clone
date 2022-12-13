const Post = require("../models/post");
const Comment = require("../models/comment");
const { isValidObjectId } = require("mongoose");
const { body, validationResult } = require("express-validator");

exports.getComments = async function (req, res) {
    try {
        const { postid } = req.params;
        if (!isValidObjectId(postid)) {
            return res.status(400).json({ message: "Invalid ObjectId" });
        }
        const post = await Post.findById(postid);
        const comments = await Promise.all(
            post.comments.map((commentid) => {
                return Comment.findById(commentid);
            })
        );
        return res.json({ comments: comments });
    } catch (err) {
        return res.status(500).json({ message: "An error occurred" });
    }
};
exports.createComment = [
    body("text").exists().isAscii(),
    async function (req, res) {
        try {
			const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
			const userid = req.user._id;
			const {text} = req.body;
            const { postid } = req.params;
            if (!isValidObjectId(postid)) {
                return res.status(400).json({ message: "Invalid ObjectId" });
            }
			const post = await Post.findById(postid);
			const comment = await Comment.create({
				user: userid,
				text: text,
			})
			post.comments.push(comment._id);
			await post.save();
			return res.json({message: `You have commented on the post with id of ${post._id}`});
        } catch (err) {
            return res.status(500).json({ message: "An error occurred" });
        }
    },
];
