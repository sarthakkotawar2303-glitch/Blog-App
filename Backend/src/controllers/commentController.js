const Comments = require("../model/Comments");

// Create a new comment
const createComment = async (req, res) => {
  try {
    const text = req.body.text?.trim();

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    let comment = await Comments.create({
      post: req.params.id,
      user: req.user._id,
      text,
    });

    comment = await comment.populate("user", "username email");

    return res.status(201).json({
      success: true,
      message: "Comment added",
      comment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

// Fetch all comments for a post
const allComments = async (req, res) => {
  try {
    const filter = req.params.id ? { post: req.params.id } : {};

    const comments = await Comments.find(filter)
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
};

// Update a comment
const updateComments = async (req, res) => {
  try {
    const { commentId, text } = req.body;

    if (!commentId) {
      return res.status(400).json({ message: "Comment ID missing" });
    }

    const comment = await Comments.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Ownership check
    if (comment.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    comment.text = text;
    await comment.save();

    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error("UPDATE COMMENT ERROR:", error);
    res.status(500).json({ message: "Update failed" });
  }
};

// Delete a comment
const deleteComments = async (req, res) => {
  try {
    const { commentId } = req.body;
    const comment = await Comments.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this comment",
      });
    }

    await comment.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while deleting comment",
      error: error.message,
    });
  }
};

module.exports = { createComment, allComments, updateComments, deleteComments };
