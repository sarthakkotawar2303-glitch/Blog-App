const User = require('../model/user');
const bcrypt = require('bcrypt');
const { generateTokens } = require('../service/tokenService');

/**
 * @name SignUpUser
 * @description Registers a new user with username, email, and password.
 * @route POST /auth/signup
 */
const SignUpUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    const { accessToken, refreshToken } = await generateTokens(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 59 * 60 * 1000, // 59 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "Signup successful",
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        likedPosts: user.likedPosts || [],
        savedPosts: user.savedPosts || []
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Signup error",
      error: error.message
    });
  }
};

/**
 * @name loginUser
 * @description Authenticates a user and returns access and refresh tokens.
 * @route POST /auth/login
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

  
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.password) {
      return res.status(500).json({ message: "User password not found in DB" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 59 * 60 * 1000, 
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        likedPosts: user.likedPosts || [],
        savedPosts: user.savedPosts || []
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login error",
      error: error.message
    });
  }
};

const logOut=async=(req,res)=>{
try {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  
} catch (error) {
  return res.status(404).json({
    message:error.message
  })
}
}

/**
 * @name toggleBookmarkPost
 * @description Toggles saving a post for a user.
 * @route PUT /auth/bookmark/:id
 */
const toggleBookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isSaved = user.savedPosts.includes(postId);

    if (isSaved) {
      await User.findByIdAndUpdate(userId, { $pull: { savedPosts: postId } });
      res.status(200).json({ message: "Post removed from bookmarks", isSaved: false });
    } else {
      await User.findByIdAndUpdate(userId, { $push: { savedPosts: postId } });
      res.status(200).json({ message: "Post bookmarked successfully", isSaved: true });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle bookmark", error: error.message });
  }
};

/**
 * @name getSavedPosts
 * @description Gets all posts saved by the user.
 * @route GET /auth/savedPosts
 */
const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: 'savedPosts',
      populate: [
        { path: 'author', select: 'username email' },
        { path: 'coverImage' }
      ]
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, savedPosts: user.savedPosts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch saved posts", error: error.message });
  }
};

/**
 * @name getLikedPosts
 * @description Gets all posts liked by the user.
 * @route GET /auth/likedPosts
 */
const getLikedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: 'likedPosts',
      populate: [
        { path: 'author', select: 'username email' },
        { path: 'coverImage' }
      ]
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, likedPosts: user.likedPosts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch liked posts", error: error.message });
  }
};

module.exports = { SignUpUser, loginUser, logOut, toggleBookmarkPost, getSavedPosts, getLikedPosts };
