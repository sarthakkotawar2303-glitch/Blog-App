const uploadToCloudinary = require("../helper/cloudinaryHelper");
const CoverImage = require("../model/coverImage");
const Post = require("../model/post");

/**
 * @name createPostController
 * @description Creates a new blog post with a cover image.
 * @route POST /posts/create
 */
const createPostController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    const { title, excerpt, description, category } = req.body;

    const { url, publicId } = await uploadToCloudinary(req.file.path);
    const image = await CoverImage.create({ url, publicId });

    const post = await Post.create({
      title,
      excerpt,
      description,
      category,
      author: req.user._id,
      coverImage: image._id,
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @name GetAllPost
 * @description Fetches all blog posts, including author and cover image details.
 * @route GET /posts/allPosts
 */
const GetAllPost = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("author", "name email")
      .populate("coverImage");

    return res.status(200).json({
      isSuccess: true,
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
    });
  }
};

/**
 * @name DeletePost
 * @description Deletes a specific blog post by ID if the requesting user is the author.
 * @route DELETE /posts/deletePost/:id
 */
const DeletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this post",
      });
    }

    await post.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      deletedPost: post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting post",
      error: error.message,
    });
  }
};

/**
 * @name UpdatePost
 * @description Updates an existing blog post by ID (title, excerpt, description, category, coverImage).
 * @route PUT /posts/:id/updatePost
 */
const UpdatePost = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!postId || typeof postId !== "string") {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.title = req.body.title ?? post.title;
    post.excerpt = req.body.excerpt ?? post.excerpt;
    post.description = req.body.description ?? post.description;
    post.category = req.body.category ?? post.category;

    if (req.file) {
      post.coverImage = req.file.path;
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating post" });
  }
};

/**
 * @name SinglePost
 * @description Fetches a single blog post by its ID with author and cover image details.
 * @route GET /posts/getPost/:id
 */
const SinglePost = async (req, res) => { 
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username email")
      .populate("coverImage");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occurred while fetching post",
    });
  }
};

/**
 * @name getMyPosts
 * @description Retrieves all blog posts authored by the currently logged-in user.
 * @route GET /posts/getMyPosts
 */
const getMyPosts = async (req, res) => {
  try {
    const myPosts = await Post.find({ author: req.user._id })
      .populate("author", "username email")
      .populate("coverImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: myPosts.length,
      posts: myPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @name toggleLikePost
 * @description Toggles like status on a post for a user (updates both Post and User models).
 * @route PUT /posts/:id/like
 */
const toggleLikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const User = require('../model/user');
    const user = await User.findById(userId);

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } });
      res.status(200).json({ message: "Post unliked", isLiked: false });
    } else {
      await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $push: { likedPosts: postId } });
      res.status(200).json({ message: "Post liked successfully", isLiked: true });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle like", error: error.message });
  }
};

module.exports = { createPostController, GetAllPost, DeletePost, UpdatePost, SinglePost, getMyPosts, toggleLikePost };
