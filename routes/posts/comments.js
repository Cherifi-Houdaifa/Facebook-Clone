const express = require("express");
const router = express.Router({mergeParams: true});

const commentsControllers = require("../../controllers/comments");

// get all comments on current post
router.get("/", commentsControllers.getComments);

// create a comment on current post
router.post("/", commentsControllers.createComment);

module.exports = router;
