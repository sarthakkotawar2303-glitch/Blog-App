const express = require("express");
const {
  createComment,
  updateComments,
  deleteComments,
  allComments,
} = require("../controllers/commentController");
const auth = require("../middleware/auth");

const CommentRouter = express.Router();

/**
 * @route POST /posts/:id/comments
 * @description Creates a new comment on a specific post.
 */
CommentRouter.post("/:id/comments", auth, createComment);

/**
 * @route GET /posts/:id/comments
 * @description Retrieves all comments for a specific post.
 */
CommentRouter.get("/:id/comments", allComments);

/**
 * @route PUT /posts/:id/comments
 * @description Updates an existing comment for a specific post. Expects commentId and updated text in body.
 */
CommentRouter.put("/:id/comments", auth, updateComments);

/**
 * @route DELETE /posts/delete/:id
 * @description Deletes a specific comment by its ID if the authenticated user is the comment's author.
 */
CommentRouter.delete("/delete/:id", auth, deleteComments);

module.exports = CommentRouter;
