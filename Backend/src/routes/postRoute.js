const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const auth = require('../middleware/auth');
const { 
  createPostController, 
  GetAllPost, 
  DeletePost, 
  UpdatePost, 
  SinglePost, 
  getMyPosts,
  toggleLikePost
} = require('../controllers/postController');

const postRouter = express.Router();

/**
 * @route POST /posts/create
 * @description Creates a new blog post. Expects a coverImage file in the request.
 */
postRouter.post('/create', auth, upload.single('coverImage'), createPostController);

/**
 * @route GET /posts/allPosts
 * @description Retrieves a list of all published blog posts.
 */
postRouter.get('/allPosts', auth, GetAllPost);

/**
 * @route PUT /posts/:id/updatePost
 * @description Updates an existing blog post by its ID. Can optionally handle a new coverImage.
 */
postRouter.put('/:id/updatePost', auth, upload.single('coverImage'), UpdatePost);

/**
 * @route DELETE /posts/deletePost/:id
 * @description Deletes a specific blog post by its ID if the authenticated user is the author.
 */
postRouter.delete('/deletePost/:id', auth, DeletePost);

/**
 * @route GET /posts/getPost/:id
 * @description Retrieves a single blog post by its ID, including its author and cover image.
 */
postRouter.get('/getPost/:id', auth, SinglePost);

/**
 * @route GET /posts/getMyPosts
 * @description Retrieves all blog posts created by the currently authenticated user.
 */
postRouter.get('/getMyPosts', auth, getMyPosts);

/**
 * @route PUT /posts/:id/like
 * @description Toggles the like status on a specific post for the authenticated user.
 */
postRouter.put('/:id/like', auth, toggleLikePost);

module.exports = postRouter;
