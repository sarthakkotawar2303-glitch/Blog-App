const express = require("express");
const {
  createComment,
  updateComments,
  deleteComments,
  allComments,
} = require("../controllers/commentController");
const auth = require("../middleware/auth");

const CommentRouter = express.Router();

// Create comment
CommentRouter.post("/:id/comments", auth, createComment);

// Get all comments for a post
CommentRouter.get("/:id/comments", allComments);

// Update a comment
CommentRouter.put("/:id/comments", auth, updateComments);

// Delete a comment
CommentRouter.delete("/delete/:id", auth, deleteComments);

module.exports = CommentRouter;
