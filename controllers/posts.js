const Post = require("../models/post");
const Comment = require("../models/comment");
const { isValidObjectId } = require("mongoose");
const { body, validationResult } = require("express-validator");
const mutler = require("multer");
const upload = mutler();

exports.getPosts = async function (req, res, next) {
    try {
        const { userid, skip } = req.query;
        const findObject = {};
		// userid included
        if (userid) {
            if (!isValidObjectId(userid)) {
                return res.status(400).json({ message: "Invalid ObjectId" });
            }
			findObject.user = userid;
        }
        
		const posts = await Post.find(findObject)
                .sort({ date: "desc" })
                .skip(skip || 0)
                .limit(10)
                .exec();
        
		let newPosts = []
		posts.forEach((post) => {
			let newPost = post.toObject();
			if (post.img) {
				newPost.img = post.img.toString("base64");
			}
			newPosts.push(newPost);
		})
		return res.json(newPosts);
    } catch (err) {
        return next(err);
    }
};
exports.createPost = [
	upload.single("image"),
    body("text").exists().isAscii(),
    async function (req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const userid = req.user._id;
            const { text } = req.body;
			const image = req.file;
			const mimetypes = ["image/jpeg", "image/png", "image/gif"]
            if (!isValidObjectId(userid)) {
                return res.status(400).json({ message: "Invalid ObjectId" });
            }
			// no image included
			if (!image) {
				const post = await Post.create({
					user: userid,
					text: text,
					date: Date.now(),
				});
				return res.json({ post: post });
			}
			// image included
			if (!mimetypes.includes(image.mimetype)) {
				return res.json({message: `Unsupported file extension: ${image.mimetype}`})
			}
			if (image.size > 5 * 1024 * 1024) {
				return res.json({message: "File size too big"})
			}
			const post = await Post.create({
				user: userid,
				text: text,
				img: image.buffer,
				date: Date.now(),
			});
			return res.json({ post: post });
        } catch (err) {
            return next(err);
        }
    },
];
exports.toggleLike = async function (req, res, next) {
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
        return next(err);
    }
};
exports.removePost = async function (req, res, next) {
    try {
        const userid = req.user._id;
        const { postid } = req.query;
        if (!isValidObjectId(postid)) {
            return res.status(400).json({ message: "Invalid ObjectId" });
        }
        const post = await Post.findById(postid);
        if (!post.user.equals(userid)) {
            return res.status(400).json({
                message: "You can't delete this post because it's not yours",
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
        return next(err);
    }
};
