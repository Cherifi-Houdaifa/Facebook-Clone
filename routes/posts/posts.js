const express = require("express");
const router = express.Router();

const commentsRouter = require("./comments");
const postsControllers = require("../../controllers/posts");

router.use("/:postid/comments/", commentsRouter);

// get the 10 recent posts if no userid query parameter is inluded
// if it is get the 10 recent user posts
// (both with skip query parameter optimal)
router.get("/", postsControllers.getPosts);

// create a post
router.post("/", postsControllers.createPost);

// toggle like on a post (postid query parameter included)
router.put("/like", postsControllers.toggleLike);

// remove post (only current user ones) and (postid query parameter included)
router.delete("/remove", postsControllers.removePost);

module.exports = router;
