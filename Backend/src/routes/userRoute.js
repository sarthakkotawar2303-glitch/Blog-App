const express = require('express');
const { SignUpUser, loginUser, logOut, toggleBookmarkPost, getSavedPosts, getLikedPosts } = require('../controllers/UserController');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

/**
 * @route POST /auth/signup
 * @description Registers a new user.
 */
router.post('/signup', SignUpUser);

/**
 * @route POST /auth/login
 * @description Authenticates a user and issues tokens.
 */
router.post('/login', loginUser);

/**
 * @route POST /auth/logout
 * @description Logs out the user by clearing authentication tokens.
 */
router.post('/logout', logOut);

/**
 * @route PUT /auth/bookmark/:id
 * @description Toggles the saved/bookmarked status of a specific post for the authenticated user.
 */
router.put('/bookmark/:id', authenticateToken, toggleBookmarkPost);

/**
 * @route GET /auth/savedPosts
 * @description Retrieves a list of all posts saved by the authenticated user.
 */
router.get('/savedPosts', authenticateToken, getSavedPosts);

/**
 * @route GET /auth/likedPosts
 * @description Retrieves a list of all posts liked by the authenticated user.
 */
router.get('/likedPosts', authenticateToken, getLikedPosts);

module.exports = router;
