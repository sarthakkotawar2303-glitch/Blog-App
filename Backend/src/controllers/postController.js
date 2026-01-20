const uploadToCloudinary = require("../helper/cloudinaryHelper");
const CoverImage = require("../model/coverImage");
const Post = require("../model/post");

// Create a new post
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

// Fetch all posts
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

// Delete a post
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

// Update a post
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

    // Update fields if provided
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

// Get single post
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

// Get posts of logged-in user
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

module.exports = { createPostController, GetAllPost, DeletePost, UpdatePost, SinglePost, getMyPosts };
